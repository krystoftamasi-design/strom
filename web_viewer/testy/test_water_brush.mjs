import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/kryst/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright'),sharp=require('sharp');
const out=path.resolve('old/water_brush_20261020');await fs.mkdir(out,{recursive:true});
assert.deepEqual(await fs.readFile('obrazky/cara.png'),await fs.readFile('web_viewer/web_assets/water_brush.png'));
const source=await fs.readFile('web_viewer/strom_web_viewer.html','utf8');
assert.equal(source,await fs.readFile('web_viewer/index.html','utf8'));
const browser=await chromium.launch({headless:true,channel:'msedge',args:['--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('net::ERR'))errors.push(m.text());});
await page.route('**/web_viewer/strom_web_viewer.html',route=>{
  let html=source.replace('    // Season controls',`window.waterQA={scene,renderer,camera,controls,sapGroup,sapMaterial,sapUniforms,
    canopyOcclusion,photosynthesisGroup,dripZoneGroup,sunHelpersGroup,THREE,addWaterBrushAttributes,paused:false,
    meshes:()=>sapMeshes,joint:()=>sapJointMesh,label:()=>sapWaterLabel};\n    // Season controls`);
  html=html.replace('function animate(now) {','function animate(now) { if(window.waterQA?.paused){requestAnimationFrame(animate);return;}');
  return route.fulfill({contentType:'text/html',body:html});
});
const slider=async(id,value)=>page.locator('#'+id).evaluate((e,v)=>{e.value=String(v);e.dispatchEvent(new Event('input',{bubbles:true}));},value);
const geometryCheck=()=>page.evaluate(()=>{
  const q=waterQA,meshes=[...q.meshes(),q.joint()];
  return meshes.map((m,i)=>{
    const g=m.geometry, attrs=['flowCenter','flowTangent','flowDistance'];
    return {joint:i===meshes.length-1,vertices:g.attributes.position.count,
      valid:attrs.every(a=>g.attributes[a]?.count===g.attributes.position.count&&g.attributes[a].array.every(Number.isFinite)),
      first:g.attributes.flowDistance.getX(0),last:g.attributes.flowDistance.getX(g.attributes.position.count-1)};
  });
});
async function render(time){return page.evaluate(time=>{const q=waterQA;q.sapUniforms.uTime.value=time;q.renderer.render(q.scene,q.camera);return q.renderer.domElement.toDataURL();},time);}
async function bluePixels(url){
  const {data,info}=await sharp(Buffer.from(url.split(',')[1],'base64')).removeAlpha().raw().toBuffer({resolveWithObject:true});
  let count=0;for(let i=0;i<data.length;i+=info.channels)if(data[i+2]>110&&data[i+2]>data[i]+40&&data[i+2]>data[i+1]+20)count++;
  return count;
}
try{
  await page.goto('http://127.0.0.1:8080/web_viewer/strom_web_viewer.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.waterQA&&document.getElementById('loader').classList.contains('hidden')&&!waterQA.canopyOcclusion.busy,{},{timeout:120000});
  let geometry=await geometryCheck();assert(geometry.every(m=>m.valid));
  assert.equal(geometry[0].first,0);assert(geometry[0].last>1);
  assert(geometry.slice(1,-1).every(m=>Math.abs(m.last)<1e-5));
  const material=await page.evaluate(()=>({name:waterQA.sapMaterial.name,texture:waterQA.sapUniforms.uBrushMap.value.image.src,flipY:waterQA.sapUniforms.uBrushMap.value.flipY,depthTest:waterQA.sapMaterial.depthTest}));
  assert(material.texture.includes('water_brush.png'));assert.equal(material.flipY,false);
  await page.locator('#btnClosePanel').click();await page.waitForTimeout(500);
  await page.screenshot({path:path.join(out,'water_brush_whole.png')});
  await page.evaluate(()=>{
    const q=waterQA;q.paused=true;q.controls.enableDamping=false;
    q.photosynthesisGroup.visible=false;q.dripZoneGroup.visible=false;q.sunHelpersGroup.visible=false;
    if(q.label())q.label().visible=false;
    q.camera.position.set(5,6,8);q.controls.target.set(0,6,0);q.controls.update();
    q.sapUniforms.uSpeed.value=1;q.sapUniforms.uTime.value=.25;
  });
  const movingA=await render(.25),movingB=await render(1.5);
  assert.notEqual(movingA,movingB,'Water brush must flow when speed is nonzero');
  const frontPixels=await bluePixels(movingA);assert(frontPixels>100,'The black source must render as blue water, using its alpha');
  await page.screenshot({path:path.join(out,'water_brush_closeup.png')});
  await slider('sliderSapSpeed',0);await page.evaluate(()=>waterQA.sapUniforms.uSpeed.value=0);
  assert.equal(await render(2),await render(3),'Speed zero must stop brush motion');
  await slider('sliderSapOpacity',0);assert.equal(await bluePixels(await render(3)),0,'Opacity zero must hide the water brush');
  await slider('sliderSapOpacity',100);await slider('sliderSapThickness',16);
  geometry=await geometryCheck();assert(geometry.every(m=>m.valid),'Thickness changes must rebuild brush attributes');
  await slider('sliderSapThickness',8);await slider('sliderSapSpeed',100);
  for(const checked of [false,true]){
    await page.locator('#chkSapXray').evaluate((e,v)=>{e.checked=v;e.dispatchEvent(new Event('change',{bubbles:true}));},checked);
    assert.equal(await page.evaluate(()=>waterQA.sapMaterial.depthTest),!checked);
  }
  await page.evaluate(()=>{const q=waterQA;q.camera.position.set(-8,6,5);q.controls.target.set(0,6,0);q.controls.update();});
  const sidePixels=await bluePixels(await render(2));assert(sidePixels>100,'Stroke must remain visible from a side angle');
  await page.screenshot({path:path.join(out,'water_brush_side.png')});
  // Render a long isolated water path so every texture join crosses the image.
  // Check actual GPU output row by row, not a copy of the shader's phase math.
  for(const time of [0,1.7,4.3]){
    const image=await page.evaluate(time=>{
      const q=waterQA,T=q.THREE,scene=new T.Scene();scene.background=new T.Color(0xffffff);
      const curve=new T.LineCurve3(new T.Vector3(0,-5,0),new T.Vector3(0,5,0));
      const geometry=new T.TubeGeometry(curve,160,.03,12,false);q.addWaterBrushAttributes(geometry,curve);
      scene.add(new T.Mesh(geometry,q.sapMaterial));
      const camera=new T.OrthographicCamera(-1,1,6,-6,.1,100);camera.position.z=10;camera.lookAt(0,0,0);
      q.sapUniforms.uSpeed.value=1;q.sapUniforms.uOpacity.value=1;q.sapUniforms.uTime.value=time;
      q.renderer.render(scene,camera);const result=q.renderer.domElement.toDataURL();geometry.dispose();return result;
    },time);
    const png=Buffer.from(image.split(',')[1],'base64');
    const {data,info}=await sharp(png).removeAlpha().raw().toBuffer({resolveWithObject:true});
    const rows=[];
    for(let y=Math.ceil(info.height/12)+5;y<Math.floor(info.height*11/12)-5;y++){
      let blue=0;for(let x=Math.floor(info.width/2)-45;x<=Math.floor(info.width/2)+45;x++){
        const i=(y*info.width+x)*info.channels;blue+=Math.max(0,data[i+2]-data[i])/255;
      }rows.push(blue);
    }
    const sorted=[...rows].sort((a,b)=>a-b),ratio=sorted[0]/sorted[Math.floor(sorted.length/2)];
    assert(ratio>.68,'Texture joins must not fade or interrupt the water line: '+ratio);
    console.log('SEAM',time,'minimum/median blue coverage',ratio.toFixed(3));
    await fs.writeFile(path.join(out,'seamless_path_'+time+'.png'),png);
  }
  assert.equal(errors.length,0,errors.join('\n'));
  await fs.writeFile(path.join(out,'validation.json'),JSON.stringify({material,geometry,frontBluePixels:frontPixels,sideBluePixels:sidePixels,sourceBytesIdentical:true,flow:true,stopped:true,opacity:true,thickness:true,xray:true,errors},null,2));
  console.log('PASS original PNG alpha tinted blue, flowing/stopped texture, opacity, thickness, xray, side views and shader/runtime checks');
}finally{await browser.close();}
