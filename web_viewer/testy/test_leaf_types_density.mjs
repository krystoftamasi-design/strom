import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
const require = createRequire('C:/Users/kryst/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium} = require('playwright');
const output='C:/Users/kryst/.codex/visualizations/2026/10/20/01a15869-470f-7b32-8386-18cb185dbe08';
const browser=await chromium.launch({headless:true,channel:'msedge',args:['--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const errors=[];
page.on('pageerror',error=>errors.push(String(error)));
await page.route('**/web_viewer/strom_web_viewer.html',async route=>{
  const html=await fs.readFile('web_viewer/strom_web_viewer.html','utf8');
  await route.fulfill({contentType:'text/html',body:html.replace('    // Season controls',
    '    window.leafFeatureQA={THREE,scene,renderer,camera,controls,allSuns,ambientLight,leafControls,leafReference,shaderUniforms,leaves:()=>leavesMeshes};\n    // Season controls')});
});
const assert=(condition,message)=>{if(!condition)throw Error(message);};
const slider=(selector,value)=>page.locator(selector).evaluate((element,value)=>{element.value=String(value);element.dispatchEvent(new Event('input'));},value);
const type=value=>page.locator(`[data-leaf-type="${value}"]`).click();
const state=()=>page.evaluate(()=>({
  count:Number(document.getElementById('sliderLeafCount').value),
  max:Number(document.getElementById('sliderLeafCount').max),type:leafFeatureQA.leafControls.type,
  meshes:leafFeatureQA.leaves().map(mesh=>({visible:mesh.visible,count:mesh.geometry.drawRange.count/6,
    material:mesh.material.name,vertices:mesh.geometry.attributes.position.count,
    referenceVertices:mesh.geometry.attributes.referenceUv.count,seasonVertices:mesh.geometry.attributes.referenceSeason.count}))
}));
const total=s=>s.meshes.filter(m=>m.visible).reduce((sum,m)=>sum+m.count,0);
const checks=[];
try{
  await page.goto('http://127.0.0.1:8080/web_viewer/strom_web_viewer.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.leafFeatureQA&&document.getElementById('loader').classList.contains('hidden'),{},{timeout:120000});
  await page.getByRole('button',{name:'Obecné',exact:true}).click();
  let s=await state();
  assert(total(s)===9932&&s.max===29796,'Default population and triple capacity');
  assert(s.meshes.every(m=>m.vertices===m.referenceVertices&&m.vertices===m.seasonVertices),'Copied attributes must match expanded geometry');
  assert(await page.evaluate(()=>leafFeatureQA.leafReference.edgeTransition===0),'Approved brush contour must be the default');
  await page.evaluate(()=>{
    const p=leafFeatureQA,render=p.renderer.shadowMap.render.bind(p.renderer.shadowMap);
    p.shadowUpdates=0;
    p.renderer.shadowMap.render=(...args)=>{
      if(p.renderer.shadowMap.enabled&&(p.renderer.shadowMap.needsUpdate||p.renderer.shadowMap.autoUpdate))p.shadowUpdates++;
      return render(...args);
    };
  });
  checks.push({label:'default',...s});
  await type('0');s=await state();
  assert(total(s)===4988&&s.max===14964&&s.meshes[0].visible&&!s.meshes[1].visible,'Type 1 isolation and density');
  checks.push({label:'type1',...s});
  await page.waitForTimeout(250);
  assert(await page.evaluate(()=>leafFeatureQA.shadowUpdates>0),'Type filter must invalidate cached shadow maps');
  await page.screenshot({path:path.join(output,'leaf_type_1.png')});
  await page.locator('#chkLeaves').evaluate(element=>{
    element.checked=false;element.dispatchEvent(new Event('change'));
    element.checked=true;element.dispatchEvent(new Event('change'));
  });
  s=await state();assert(!s.meshes[1].visible,'Global visibility must preserve selected type');
  await type('1');s=await state();
  assert(total(s)===4944&&s.max===14832&&!s.meshes[0].visible&&s.meshes[1].visible,'Type 2 isolation and density');
  checks.push({label:'type2',...s});
  await page.waitForTimeout(250);
  await page.screenshot({path:path.join(output,'leaf_type_2.png')});
  await type('all');await slider('#sliderLeafCount',29796);s=await state();
  assert(total(s)===29796&&s.meshes[0].count===14964&&s.meshes[1].count===14832,'Maximum must draw 29796 actual leaves');
  const copiesMoved=await page.evaluate(()=>leafFeatureQA.leafControls.models.every(({original,leaves,baseCount})=>{
    const a=leaves[0],b=leaves[baseCount];return a.center.distanceTo(b.center)>0.0001&&original.every(Number.isFinite);
  }));
  assert(copiesMoved,'Additional layers must have distinct positions and finite coordinates');
  checks.push({label:'triple',...s});
  await page.waitForTimeout(350);
  await page.screenshot({path:path.join(output,'leaf_types_density.png')});
  await type('0');s=await state();assert(total(s)===14964,'Density must survive isolation at maximum');
  await type('all');s=await state();assert(total(s)===29796,'Returning both types must restore maximum');
  await slider('#sliderLeafCount',0);assert(total(await state())===0,'Zero must draw no leaves');
  await slider('#sliderLeafCount',10001);assert(total(await state())===10001,'Odd population must not round away leaves');
  await slider('#sliderLeafSize',150);
  const sizing=await page.evaluate(()=>leafFeatureQA.leafControls.models.every(({mesh,original,leaves})=>{
    for(const leaf of [leaves[0],leaves[leaves.length-1]]){
      const [a,b]=leaf.vertices,p=mesh.geometry.attributes.position;
      const actual=Math.hypot(p.getX(a)-p.getX(b),p.getY(a)-p.getY(b),p.getZ(a)-p.getZ(b));
      const initial=Math.hypot(original[a*3]-original[b*3],original[a*3+1]-original[b*3+1],original[a*3+2]-original[b*3+2]);
      if(Math.abs(actual/initial-1.5)>.0001)return false;
    }return true;
  }));
  assert(sizing,'Size must scale source and generated leaves identically');
  await slider('#sliderLeafSize',100);
  await slider('#sliderLeafCount',9932);await type('1');
  await page.locator('#btnModelFull').click();
  await page.waitForFunction(()=>document.getElementById('loader').classList.contains('hidden'),{},{timeout:120000});
  s=await state();assert(s.type==='1'&&total(s)===4944&&s.max===14832,'Isolation and density must survive model change');
  await slider('#sliderLeafCount',14832);s=await state();assert(total(s)===14832,'Full model must support additional leaves');
  checks.push({label:'full_type2_max',...s});
  await type('all');await slider('#sliderLeafCount',9932);
  await slider('#sliderLeafEdgeTransition',300);
  const feather=await page.evaluate(()=>{leafFeatureQA.feather=leafFeatureQA.leafReference.stableAlpha[0].image.data.slice();return leafFeatureQA.leafReference.edgeTransition;});
  await slider('#sliderLeafEdgeTransition',0);
  assert(feather===3&&await page.evaluate(()=>leafFeatureQA.feather.some((value,i)=>value!==leafFeatureQA.leafReference.stableAlpha[0].image.data[i])),'Optional feather must remain adjustable');
  assert(await page.evaluate(()=>leafFeatureQA.shaderUniforms.uAlphaMode.value===2),'Blender alpha mode must stay selected');
  const calibration=JSON.parse(await fs.readFile('old/leaf_light_calibration.json','utf8'));
  const measured=await page.evaluate(samples=>{
    const {THREE,renderer,allSuns,ambientLight}=leafFeatureQA;
    const scene=new THREE.Scene();scene.add(ambientLight.clone());
    const suns=allSuns.map(s=>{const clone=s.clone();clone.castShadow=false;clone.target=s.target.clone();scene.add(clone,clone.target);return clone;});
    const mat=new THREE.MeshLambertMaterial({toneMapped:false});mat.color.setRGB(.84,.84,.84);
    const plane=new THREE.Mesh(new THREE.PlaneGeometry(4,4),mat);scene.add(plane);
    const cam=new THREE.OrthographicCamera(-1,1,1,-1,.1,10);
    const target=new THREE.WebGLRenderTarget(8,8,{type:THREE.FloatType});
    const pixels=new Float32Array(8*8*4),result=[];
    for(const sample of samples){
      const [x,y,z]=sample.normal,n=new THREE.Vector3(x,z,-y);
      plane.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),n);
      cam.position.copy(n).multiplyScalar(5);cam.lookAt(0,0,0);
      suns.forEach(s=>{s.intensity=sample.label==='ambient'?0:10;});
      renderer.setRenderTarget(target);renderer.render(scene,cam);renderer.readRenderTargetPixels(target,0,0,8,8,pixels);
      const index=(4*8+4)*4;result.push({label:sample.label,rgb:Array.from(pixels.slice(index,index+3))});
    }
    renderer.setRenderTarget(null);target.dispose();plane.geometry.dispose();mat.dispose();
    return result;
  },calibration.samples);
  measured.forEach((sample,i)=>assert(sample.rgb.every((channel,c)=>Math.abs(channel-calibration.samples[i].rgb[c])<.02),`EEVEE irradiance mismatch: ${sample.label} ${sample.rgb}`));
  assert(!await page.evaluate(()=>leafFeatureQA.renderer.info.programs.some(p=>p.diagnostics?.runnable===false)),'Shader compilation');
  assert(errors.length===0,errors.join('\n'));
  await fs.writeFile(path.join(output,'leaf_feature_checks.json'),JSON.stringify({checks,eevee:calibration.samples,web:measured,errors},null,2));
  console.log('PASS',JSON.stringify({checks,webCalibration:measured,errors}));
}finally{await browser.close();}
