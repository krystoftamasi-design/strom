import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/kryst/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const root=process.cwd();
const out=path.join(root,'old/optimization_20261020');
await fs.mkdir(out,{recursive:true});
const source=await fs.readFile('web_viewer/strom_web_viewer.html','utf8');
assert.equal(source,await fs.readFile('web_viewer/index.html','utf8'));
function glb(buffer){
  const length=buffer.readUInt32LE(12),json=JSON.parse(buffer.subarray(20,20+length));
  const binary=buffer.subarray(28+length);
  return {json,accessor(index){const a=json.accessors[index],v=json.bufferViews[a.bufferView];
    const width={SCALAR:1,VEC2:2,VEC3:3,VEC4:4}[a.type],bytes={5126:4,5125:4,5123:2,5121:1}[a.componentType];
    const start=(v.byteOffset||0)+(a.byteOffset||0),stride=v.byteStride||width*bytes;
    const packed=Buffer.alloc(a.count*width*bytes);
    for(let i=0;i<a.count;i++)binary.copy(packed,i*width*bytes,start+i*stride,start+i*stride+width*bytes);
    return packed;
  }};
}
const original=glb(await fs.readFile('web_viewer/web_assets/strom_web.glb'));
const fast=glb(await fs.readFile('web_viewer/web_assets/strom_web_fast.glb'));
for(const name of ['Material.003','Material.005']){
  const find=g=>g.json.meshes.flatMap(m=>m.primitives).find(p=>g.json.materials[p.material].name===name);
  const a=find(original),b=find(fast);
  assert.deepEqual(Object.keys(a.attributes),Object.keys(b.attributes));
  for(const key of Object.keys(a.attributes))assert.deepEqual(original.accessor(a.attributes[key]),fast.accessor(b.attributes[key]));
  assert.deepEqual(original.accessor(a.indices),fast.accessor(b.indices));
}
for(const type of [0,1])assert.deepEqual(await fs.readFile(`web_viewer/web_assets/strom_web_leaf_${type}.bin`),await fs.readFile(`web_viewer/web_assets/strom_web_fast_leaf_${type}.bin`));
console.log('PASS leaf geometry, UVs, normals, colors, indices and reference attributes are byte-identical');
const browser=await chromium.launch({headless:true,channel:'msedge',args:['--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
await page.route('**/web_viewer/strom_web_viewer.html',route=>{
  let html=source.replace('    // Season controls',`window.perfQA={scene,renderer,camera,controls,allSuns,leafControls,shaderUniforms,loadTreeModel,
    model:()=>currentModel,leaves:()=>leavesMeshes,sapGroup,dripZoneGroup,sunHelpersGroup,
    paused:false,shadowDraws:0,watch(){this.model().traverse(o=>{if(o.isMesh)o.onBeforeShadow=()=>this.shadowDraws++;});}};
    // Season controls`);
  html=html.replace('function animate(now) {','function animate(now) { if(window.perfQA?.paused){requestAnimationFrame(animate);return;}');
  return route.fulfill({contentType:'text/html',body:html});
});
const loaded=async()=>{
  await page.waitForFunction(()=>window.perfQA?.model() && document.getElementById('loader').classList.contains('hidden'),{},{timeout:120000});
  await page.waitForTimeout(500);
};
const setSlider=async(id,value)=>page.locator('#'+id).evaluate((e,v)=>{e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}));},value);
try{
  await page.goto('http://127.0.0.1:8080/web_viewer/strom_web_viewer.html',{waitUntil:'domcontentloaded'});
  await loaded();
  const initial=await page.evaluate(()=>{
    const q=perfQA;q.watch();q.shadowDraws=0;
    const meshes=[];q.model().traverse(o=>{if(o.isMesh)meshes.push({name:o.name,triangles:Math.min(o.geometry.index.count,o.geometry.drawRange.count)/3,vertices:o.geometry.attributes.position.count,bark:o.geometry.attributes.barkPattern?.count});});
    return {meshes,autoUpdate:q.renderer.shadowMap.autoUpdate,suns:q.allSuns.length,mode:q.shaderUniforms.uAlphaMode.value};
  });
  assert.equal(initial.autoUpdate,false);assert.equal(initial.suns,1);assert.equal(initial.mode,2);
  assert.equal(initial.meshes.reduce((s,m)=>s+m.triangles,0),JSON.parse(await fs.readFile('web_viewer/web_assets/strom_web_fast_report.json','utf8')).totalTriangles);
  assert(initial.meshes.filter(m=>m.bark).every(m=>m.bark===m.vertices));
  await page.waitForTimeout(350);
  assert.equal(await page.evaluate(()=>perfQA.shadowDraws),0,'Idle frames must reuse shadows');
  await page.evaluate(()=>{const q=perfQA;q.camera.position.x+=2;q.controls.update();});
  await page.waitForTimeout(350);
  assert.equal(await page.evaluate(()=>perfQA.shadowDraws),0,'Camera motion must reuse shadows');
  for(const [id,value] of [['sliderLeafSize',120],['sliderLeafCount',5000],['sliderLeafEdgeTransition',200],['sliderLeafAlpha',80],['sliderLightRot',40],['sliderSunElevation',35]]){
    await page.evaluate(()=>perfQA.shadowDraws=0);
    await setSlider(id,value);await page.waitForTimeout(400);
    const draws=await page.evaluate(()=>perfQA.shadowDraws);
    assert(draws>0,id+' must refresh maps');
    await page.waitForTimeout(250);
    assert.equal(await page.evaluate(()=>perfQA.shadowDraws),draws,id+' must stop refreshing after the change');
  }
  for(const id of ['chkLeaves','chkTrunk','chkRoots','chkWireframe','chkShadows']){
    await page.locator('#'+id).evaluate(e=>{e.checked=false;e.dispatchEvent(new Event('change',{bubbles:true}));});
    await page.waitForTimeout(150);await page.evaluate(()=>perfQA.shadowDraws=0);
    await page.locator('#'+id).evaluate(e=>{e.checked=true;e.dispatchEvent(new Event('change',{bubbles:true}));});
    await page.waitForTimeout(300);
    assert((await page.evaluate(()=>perfQA.shadowDraws))>0,id+' restoration must refresh maps');
  }
  await page.locator('#chkWireframe').evaluate(e=>{e.checked=false;e.dispatchEvent(new Event('change',{bubbles:true}));});
  for(const type of ['0','1','all']){
    await page.evaluate(()=>perfQA.shadowDraws=0);
    await page.locator(`[data-leaf-type="${type}"]`).click();await page.waitForTimeout(400);
    assert((await page.evaluate(()=>perfQA.shadowDraws))>0,'Leaf type must refresh maps');
  }
  await page.evaluate(()=>perfQA.shadowDraws=0);
  await page.locator('[data-alphamode="0"]').click();await page.waitForTimeout(250);
  assert((await page.evaluate(()=>perfQA.shadowDraws))>0,'Alpha mode must refresh maps');
  await page.locator('[data-alphamode="2"]').click();
  for(const [id,value] of [['sliderLeafSize',100],['sliderLeafCount',9932],['sliderLeafEdgeTransition',100],['sliderLeafAlpha',100],['sliderLightRot',0],['sliderSunElevation',10]])await setSlider(id,value);
  await page.waitForTimeout(600);
  // Cache and a fresh per-frame shadow render must produce identical pixels.
  await page.evaluate(()=>{const q=perfQA;q.paused=true;q.renderer.render(q.scene,q.camera);});
  const cached=await page.locator('#canvas3d').evaluate(c=>c.toDataURL());
  await page.evaluate(()=>{const q=perfQA;q.renderer.shadowMap.autoUpdate=true;q.renderer.render(q.scene,q.camera);q.renderer.shadowMap.autoUpdate=false;});
  const uncached=await page.locator('#canvas3d').evaluate(c=>c.toDataURL());
  assert.equal(cached,uncached,'Shadow cache must preserve the rendered image exactly');
  console.log('PASS shadows remain cached during idle/camera motion; all caster, alpha, light and shadow controls invalidate; cached output matches fresh shadows exactly');
  await page.screenshot({path:path.join(out,'optimized_viewer.png')});
  await page.addStyleTag({content:'#controlsPanel,.toolbar,.top-bar,.header,.stats-bar,#btnTogglePanel,#btnBlenderCam,#btnAutoRotate,#btnScreenshot,.toast,#settingsCategoryMenu{visibility:hidden!important}'});
  await page.evaluate(()=>{const q=perfQA;q.sapGroup.visible=false;q.dripZoneGroup.visible=false;q.sunHelpersGroup.visible=false;});
  const shots=[];
  for(const model of ['strom_web','strom_web_fast']){
    await page.evaluate(m=>{perfQA.paused=false;perfQA.loadTreeModel('./web_assets/'+m+'.glb');},model);
    await loaded();
    await page.evaluate(()=>{perfQA.paused=true;});
    for(const [view,pos,target] of [['whole',[37.9,18.2,28.1],[0,11.5,0]],['roots',[16,8,22],[0,-.3,0]],['trunk',[5,6,8],[0,6,0]]]){
      await page.evaluate(({pos,target})=>{const q=perfQA;q.controls.enableDamping=false;q.camera.position.set(...pos);q.controls.target.set(...target);q.controls.update();q.renderer.render(q.scene,q.camera);},{pos,target});
      const file=path.join(out,model+'_'+view+'.png');await page.screenshot({path:file});shots.push(file);
    }
  }
  // Verify cache invalidation also works after loading the unchanged full model.
  await page.evaluate(()=>{perfQA.paused=false;perfQA.loadTreeModel('./web_assets/strom_full.glb');});await loaded();
  await page.evaluate(()=>{perfQA.watch();perfQA.shadowDraws=0;});
  await setSlider('sliderLeafSize',110);await page.waitForTimeout(350);
  assert((await page.evaluate(()=>perfQA.shadowDraws))>0,'Full model changes must refresh maps');
  assert.equal(await page.evaluate(()=>perfQA.shaderUniforms.uAlphaMode.value),2);
  assert.equal(errors.length,0,errors.join('\n'));
  await fs.writeFile(path.join(out,'validation.json'),JSON.stringify({initial,leafBuffersIdentical:true,cachePixelsIdentical:true,allInvalidationsPassed:true,fullModelPassed:true,errors,shots},null,2));
  console.log('PASS full model, no runtime errors, screenshots: '+out);
}finally{await browser.close();}
