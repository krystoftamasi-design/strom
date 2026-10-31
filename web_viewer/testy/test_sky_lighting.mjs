import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {computeCanopyVisibility} from '../vykreslovani/canopy_occlusion_worker.js';
const require=createRequire('C:/Users/kryst/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const out=path.resolve('old/sky_lighting_20261020');await fs.mkdir(out,{recursive:true});
const plane=[[-3,2,-3,3,2,-3,3,2,3],[-3,2,-3,3,2,3,-3,2,3]];
const leafPlane=new Float32Array(plane.flatMap(p=>[...p,0,0,1,0,1,1,0]));
const synthetic={bounds:[-7,-1,-7,7,5,7],wood:new Float32Array(),leaves:leafPlane,samples:new Float32Array([0,0,0,.01,0,4,0,.01,6,0,0,.01]),maskSize:32,masks:[new Float32Array(1024).fill(1),new Float32Array(1024).fill(1)]};
const solid=computeCanopyVisibility(synthetic).values;
assert(solid[0]<solid[1]-.1,'A leaf below an occluder must receive less sky');
assert(solid[0]<solid[2]-.05,'AO must depend on neighboring geometry, not height alone');
assert.equal(solid[1],1,'An exposed sample must retain full sky');
assert.deepEqual(computeCanopyVisibility(synthetic).values,solid,'AO must be deterministic');
const transparent=computeCanopyVisibility({...synthetic,masks:synthetic.masks.map(m=>new Float32Array(m.length))}).values;
assert(transparent[0]>solid[0]+.1,'Transparent alpha must stop occluding');
const branch=computeCanopyVisibility({...synthetic,leaves:new Float32Array(),wood:new Float32Array(plane.flat())}).values;
assert(branch[0]<branch[1]-.1,'Branches must occlude diffuse sky');
console.log('PASS geometry-based occlusion, transparency, branches, deterministic rays',JSON.stringify({solid:[...solid],transparent:[...transparent],branch:[...branch]}));
const browser=await chromium.launch({headless:true,channel:'msedge',args:['--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('net::ERR'))errors.push(m.text());});
const source=await fs.readFile('web_viewer/strom_web_viewer.html','utf8');
assert.equal(source,await fs.readFile('web_viewer/index.html','utf8'));
await page.route('**/web_viewer/strom_web_viewer.html',route=>{
  let html=source.replace('    // Season controls',`window.skyQA={scene,renderer,camera,controls,leafControls,canopyOcclusion,shaderUniforms,skyLight,sun1,allSuns,
    model:()=>currentModel,sapGroup,dripZoneGroup,sunHelpersGroup,paused:false};\n    // Season controls`);
  html=html.replace('function animate(now) {','function animate(now) { if(window.skyQA?.paused){requestAnimationFrame(animate);return;}');
  return route.fulfill({contentType:'text/html',body:html});
});
const settled=async()=>page.waitForFunction(()=>window.skyQA&&document.getElementById('loader').classList.contains('hidden')&&!skyQA.canopyOcclusion.busy&&!skyQA.canopyOcclusion.pending&&skyQA.canopyOcclusion.appliedRevision===skyQA.canopyOcclusion.revision,{},{timeout:120000});
const slider=async(id,value)=>page.locator('#'+id).evaluate((e,v)=>{e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}));},value);
const report={synthetic:{solid:[...solid],transparent:[...transparent],branch:[...branch]},checks:[]};
try{
  await page.goto('http://127.0.0.1:8080/web_viewer/strom_web_viewer.html',{waitUntil:'domcontentloaded'});await settled();
  report.initial=await page.evaluate(()=>{
    const q=skyQA,lights=[];q.scene.traverse(o=>{if(o.isLight)lights.push({type:o.type,shadow:o.castShadow,intensity:o.intensity});});
    const values=[];for(const {mesh,leaves,ends} of q.leafControls.models)for(let i=0;i<leaves.length&&ends[i+1]<=mesh.geometry.drawRange.count;i++)values.push(mesh.geometry.attributes.canopyVisibility.getX(leaves[i].vertices[0]));
    const sorted=[...values].sort((a,b)=>a-b);
    return {lights,ao:{min:sorted[0],p20:sorted[Math.floor(sorted.length*.2)],p80:sorted[Math.floor(sorted.length*.8)],max:sorted.at(-1),count:values.length,workerMs:q.canopyOcclusion.durationMs},autoUpdate:q.renderer.shadowMap.autoUpdate,computations:q.canopyOcclusion.computations,mode:q.shaderUniforms.uAlphaMode.value,programErrors:q.renderer.info.programs.filter(p=>p.diagnostics?.runnable===false).length};
  });
  console.log('INITIAL',JSON.stringify(report.initial));
  assert.equal(report.initial.lights.filter(l=>l.type==='DirectionalLight').length,1);
  assert.equal(report.initial.lights.filter(l=>l.type==='HemisphereLight').length,1);
  assert.equal(report.initial.lights.filter(l=>l.shadow).length,1);
  assert.equal(report.initial.autoUpdate,false);assert.equal(report.initial.mode,2);assert.equal(report.initial.programErrors,0);
  assert(report.initial.ao.max-report.initial.ao.min>.1,'Canopy must have both exposed and occluded leaves');
  const initialComputations=await page.evaluate(()=>skyQA.canopyOcclusion.computations);
  await page.evaluate(()=>{skyQA.camera.position.x+=3;skyQA.controls.update();});await page.waitForTimeout(400);
  assert.equal(await page.evaluate(()=>skyQA.canopyOcclusion.computations),initialComputations,'Camera must not recompute AO');
  await slider('sliderCanopyAO',0);assert.equal(await page.evaluate(()=>skyQA.shaderUniforms.uCrownAO.value),0);
  await slider('sliderCanopyAO',100);assert.equal(await page.evaluate(()=>skyQA.shaderUniforms.uCrownAO.value),1);
  assert.equal(await page.evaluate(()=>skyQA.canopyOcclusion.computations),initialComputations,'AO strength must not rebuild occlusion');
  for(const [id,value] of [['sliderLeafSize',120],['sliderLeafCount',4000],['sliderLeafEdgeTransition',150],['sliderLeafAlpha',60]]){
    const before=await page.evaluate(()=>skyQA.canopyOcclusion.revision);await slider(id,value);await page.waitForTimeout(220);await settled();
    assert((await page.evaluate(()=>skyQA.canopyOcclusion.appliedRevision))>before,id+' must recompute AO');report.checks.push(id);
  }
  for(const type of ['0','1','all']){
    const before=await page.evaluate(()=>skyQA.canopyOcclusion.revision);await page.locator(`[data-leaf-type="${type}"]`).click();await page.waitForTimeout(220);await settled();
    assert((await page.evaluate(()=>skyQA.canopyOcclusion.appliedRevision))>before,'Type must recompute AO');
  }
  for(const [id,value] of [['sliderLeafSize',100],['sliderLeafCount',9932],['sliderLeafEdgeTransition',0],['sliderLeafAlpha',100],['sliderCanopyAO',75]])await slider(id,value);
  await page.waitForTimeout(250);await settled();
  await slider('sliderSun',0);assert.equal(await page.evaluate(()=>skyQA.sun1.intensity),0);
  await slider('sliderAmbient',0);assert.equal(await page.evaluate(()=>skyQA.skyLight.intensity),0);
  await slider('sliderSun',100);await slider('sliderAmbient',100);
  await slider('sliderSunElevation',-10);assert.equal(await page.evaluate(()=>skyQA.sun1.intensity),0);
  await slider('sliderSunElevation',45);assert((await page.evaluate(()=>skyQA.sun1.intensity))>0);
  // Freeze animations for stable images and verify the new AO control changes light.
  await page.evaluate(()=>{const q=skyQA;q.paused=true;q.sapGroup.visible=false;q.dripZoneGroup.visible=false;q.sunHelpersGroup.visible=false;q.controls.enableDamping=false;});
  await page.locator('#btnClosePanel').click();
  for(let i=0;i<4;i++){
    await page.evaluate(i=>{const q=skyQA,a=i*Math.PI/2+.6;q.camera.position.set(42*Math.cos(a),18,42*Math.sin(a));q.controls.target.set(0,11.5,0);q.controls.update();q.renderer.render(q.scene,q.camera);},i);
    await page.screenshot({path:path.join(out,'sky_view_'+i+'.png')});
  }
  await page.evaluate(()=>{skyQA.renderer.render(skyQA.scene,skyQA.camera);});
  const aoImage=await page.locator('#canvas3d').evaluate(c=>c.toDataURL());
  await slider('sliderCanopyAO',0);await page.evaluate(()=>skyQA.renderer.render(skyQA.scene,skyQA.camera));
  const noAoImage=await page.locator('#canvas3d').evaluate(c=>c.toDataURL());assert.notEqual(aoImage,noAoImage,'AO must visibly affect the material');
  await slider('sliderCanopyAO',75);
  await page.evaluate(()=>{const q=skyQA;q.camera.position.set(37.9,18.2,28.1);q.controls.target.set(0,11.5,0);q.controls.update();q.renderer.render(q.scene,q.camera);});
  await page.screenshot({path:path.join(out,'sky_lighting_preview.png')});
  await page.evaluate(()=>{skyQA.paused=false;});await page.locator('#btnModelFull').evaluate(e=>e.click());await settled();
  assert.equal(await page.evaluate(()=>skyQA.allSuns.length),1);
  const full=await page.evaluate(()=>({revision:skyQA.canopyOcclusion.appliedRevision,workerMs:skyQA.canopyOcclusion.durationMs,programErrors:skyQA.renderer.info.programs.filter(p=>p.diagnostics?.runnable===false).length}));
  assert.equal(full.programErrors,0);report.full=full;
  assert.equal(errors.length,0,errors.join('\n'));report.errors=errors;
  await fs.writeFile(path.join(out,'validation.json'),JSON.stringify(report,null,2));
  console.log('PASS single cached sun + hemisphere sky, AO distribution/controls, edit invalidation, four views, full model, no shader/runtime errors');
}finally{await browser.close();}
