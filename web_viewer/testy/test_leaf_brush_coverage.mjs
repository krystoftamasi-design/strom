import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
const require=createRequire('C:/Users/kryst/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const sharp=require('sharp');
const output='C:/Users/kryst/.codex/visualizations/2026/10/20/01a15869-470f-7b32-8386-18cb185dbe08';
const label=process.argv[2]||'after';
const browser=await chromium.launch({headless:true,channel:'msedge',args:['--enable-webgl','--ignore-gpu-blocklist']});
const page=await browser.newPage({viewport:{width:840,height:420},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(String(e)));
await page.route('**/web_viewer/strom_web_viewer.html',async route=>{
  let html=await fs.readFile('web_viewer/strom_web_viewer.html','utf8');
  html=html.replaceAll('requestAnimationFrame(animate);','/* isolated material preview */');
  html=html.replace('    // Season controls',
    '    window.brushQA={THREE,renderer,leafReference,shaderUniforms,createLeafMaterial,allSuns,ambientLight,leafControls};\n    // Season controls');
  await route.fulfill({contentType:'text/html',body:html});
});
try{
  await page.goto('http://127.0.0.1:8080/web_viewer/strom_web_viewer.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.brushQA&&document.getElementById('loader').classList.contains('hidden'),{},{timeout:120000});
  const setup=await page.evaluate(()=>{
    const q=brushQA,{THREE,renderer,leafControls,shaderUniforms,allSuns,ambientLight}=q;
    document.querySelectorAll('body > :not(canvas)').forEach(e=>{e.style.display='none';});
    renderer.setPixelRatio(1);renderer.setSize(840,420);
    q.scene=new THREE.Scene();q.scene.background=new THREE.Color(0xd3d0b7);
    q.scene.add(ambientLight.clone());
    allSuns.forEach(sun=>{const light=sun.clone();light.castShadow=false;light.target=sun.target.clone();q.scene.add(light,light.target);});
    q.camera=new THREE.OrthographicCamera(-4.2,4.2,2.1,-2.1,.1,20);q.camera.position.z=5;q.camera.lookAt(0,0,0);
    shaderUniforms.uSeasonOffset.value=0;
    q.planes=leafControls.models.map(({mesh,leaves},type)=>{
      const geo=new THREE.PlaneGeometry(4.2,4.2),uv=geo.attributes.uv;
      const source=mesh.geometry.attributes.referenceUv;
      let minU=Infinity,minV=Infinity,maxU=-Infinity,maxV=-Infinity;
      for(const i of leaves[0].vertices){minU=Math.min(minU,source.getX(i));minV=Math.min(minV,source.getY(i));maxU=Math.max(maxU,source.getX(i));maxV=Math.max(maxV,source.getY(i));}
      const atlas=[],season=[];
      for(let i=0;i<uv.count;i++){atlas.push(minU+uv.getX(i)*(maxU-minU),minV+uv.getY(i)*(maxV-minV));season.push(.25);}
      geo.setAttribute('referenceUv',new THREE.Float32BufferAttribute(atlas,2));geo.setAttribute('referenceSeason',new THREE.Float32BufferAttribute(season,1));
      const plane=new THREE.Mesh(geo,mesh.material);plane.position.x=type===0?2.1:-2.1;q.scene.add(plane);return plane;
    });
    renderer.render(q.scene,q.camera);
    return {samples:renderer.getContext().getParameter(renderer.getContext().SAMPLES),canvasAlpha:renderer.getContext().getContextAttributes().alpha,alphaMode:shaderUniforms.uAlphaMode.value};
  });
  await page.screenshot({path:path.join(output,`leaf_brush_${label}.png`)});
  const render=async alpha=>{
    await page.evaluate(alpha=>{
      const q=brushQA,{THREE}=q;
      const texture=new THREE.DataTexture(new Uint8Array([255,255,255,alpha]),1,1);texture.needsUpdate=true;
      const reference={...q.leafReference,stableAlpha:[texture,texture]};
      q.planes.forEach((plane,type)=>{plane.material=q.createLeafMaterial(type,reference,q.shaderUniforms);});
      q.renderer.render(q.scene,q.camera);
    },alpha);
    const {data,info}=await sharp(await page.screenshot()).raw().toBuffer({resolveWithObject:true});
    const index=(210*info.width+210)*info.channels;
    return Array.from(data.slice(index,index+3));
  };
  const clear=await render(0),opaque=await render(255),half=await render(128);
  const direction=opaque.map((v,i)=>v-clear[i]);
  const coverage=direction.reduce((sum,v,i)=>sum+v*(half[i]-clear[i]),0)/direction.reduce((sum,v)=>sum+v*v,0);
  const result={label,...setup,clear,opaque,half,coverage,errors};
  await fs.writeFile(path.join(output,`leaf_brush_${label}.json`),JSON.stringify(result,null,2));
  console.log(JSON.stringify(result));
  if(label!=='before'&&(coverage<.35||coverage>.65||errors.length))throw Error('Partial alpha must remain partial in the final rendered pixel');
}finally{await browser.close();}
