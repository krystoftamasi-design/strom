import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
const require = createRequire('C:/Users/kryst/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const { chromium } = require('playwright');
const root = process.cwd();
const browser = await chromium.launch({headless:true, channel:'msedge', args:['--enable-webgl','--ignore-gpu-blocklist']});
const page = await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if(m.type()==='error' && !m.text().includes('net::ERR')) errors.push(m.text()); });
await page.route('**/web_viewer/strom_web_viewer.html', async route => {
  let html = await fs.readFile(path.join(root,'web_viewer/strom_web_viewer.html'),'utf8');
  html = html.replace('    // Season controls', '    window.shaderQA = { scene, renderer, camera, leafControls, leafReference, barkReference, model: () => currentModel, shaderUniforms, leaves: () => leavesMeshes };\n    // Season controls');
  await route.fulfill({contentType:'text/html',body:html});
});
try {
  await page.goto('http://127.0.0.1:8765/web_viewer/strom_web_viewer.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(() => document.getElementById('loader').classList.contains('hidden'),{},{timeout:120000});
  await page.waitForFunction(() => getComputedStyle(document.getElementById('loader')).opacity === '0');
  await page.screenshot({path:path.join(root,'web_viewer/nahledy/shader_reference_preview.png')});
  const describe = () => page.evaluate(() => ({leaves:shaderQA.leaves().map(m=>({name:m.material.name,vertices:m.geometry.attributes.position.count,reference:m.geometry.attributes.referenceSeason.count})),programErrors:shaderQA.renderer.info.programs.filter(p=>p.diagnostics?.runnable===false).length}));
  console.log('WEB',JSON.stringify(await describe()));
  const checkBark = async () => {
    const bark = await page.evaluate(() => {
      const result=[];
      shaderQA.model().traverse(node=>{if(node.isMesh && node.material.name==='Bark_GraphML_Tree (Blender reference)') result.push({name:node.name,lambert:node.material.isMeshLambertMaterial,positions:node.geometry.attributes.position.count,pattern:node.geometry.attributes.barkPattern?.count});});
      return result;
    });
    if(bark.length!==2 || bark.some(mesh=>!mesh.lambert || mesh.pattern!==mesh.positions)) throw Error('Both trunk and roots must use the Blender bark material and their own baked data');
    console.log('BARK',JSON.stringify(bark));
  };
  await checkBark();

  for (const [source,asset] of [['list2.png','leaf_alpha_1.png'],['list.png','leaf_alpha_2.png']]) {
    const [sourceBytes,assetBytes] = await Promise.all([fs.readFile(path.join(root,'obrazky',source)),fs.readFile(path.join(root,'web_viewer/web_assets',asset))]);
    if (!sourceBytes.equals(assetBytes)) throw Error('Leaf alpha must preserve the user source image: '+source);
  }
  const maskSources = await page.evaluate(() => shaderQA.leafReference.alpha.map(texture => new URL(texture.image.src).pathname.split('/').pop()));
  if (maskSources.join(',') !== 'leaf_alpha_1.png,leaf_alpha_2.png') throw Error('Each leaf type must use its own alpha image');
  if (await page.evaluate(() => shaderQA.leafReference.alpha[0] === shaderQA.leafReference.alpha[1])) throw Error('Leaf types must not share a single mask texture');

  const lights = await page.evaluate(() => {const result=[];shaderQA.scene.traverse(o=>{if(o.isLight) result.push(o.type);});return result;});
  if (lights.filter(type=>type==='DirectionalLight').length!==1 || lights.filter(type=>type==='HemisphereLight').length!==1) throw Error('The tree must use one sun and diffuse sky');
  if (await page.evaluate(()=>shaderQA.leaves().some(m=>m.geometry.attributes.leafPivot))) throw Error('Camera-facing leaves must be removed');
  if (!(await page.evaluate(() => shaderQA.shaderUniforms.uAlphaMode.value === 2 && shaderQA.leaves().every(m => m.material.alphaToCoverage && !m.material.alphaHash)))) throw Error('Blender brush must stay selected with filtered UV coverage');
  if (!(await page.locator('[data-alphamode="2"]').getAttribute('class')).includes('active')) throw Error('Blender button must remain active');
  await page.mouse.move(920,400);
  await page.mouse.down();
  await page.mouse.move(1100,460,{steps:12});
  await page.mouse.up();
  await page.screenshot({path:path.join(root,'web_viewer/nahledy/shader_rotated_preview.png')});
  await page.locator('#btnBlenderCam').click();
  await page.getByRole('button',{name:'Léto',exact:true}).click();
  await page.screenshot({path:path.join(root,'web_viewer/nahledy/shader_summer_preview.png')});
  await page.locator('#sliderSun').evaluate(el=>{el.value='0';el.dispatchEvent(new Event('input'));});
  await page.screenshot({path:path.join(root,'web_viewer/nahledy/shader_no_sun_preview.png')});
  for(const mode of ['0','1','2']) await page.locator(`[data-alphamode="${mode}"]`).click();
  await page.locator('#sliderSun').evaluate(el=>{el.value='100';el.dispatchEvent(new Event('input'));});
  const setSlider = async (selector,value) => page.locator(selector).evaluate((el,value)=>{el.value=String(value);el.dispatchEvent(new Event('input'));},value);
  await setSlider('#sliderLeafAlpha',0);
  if (await page.evaluate(() => shaderQA.shaderUniforms.uLeafAlphaStrength.value) !== 0) throw Error('Alpha must reach zero');
  await page.screenshot({path:path.join(root,'web_viewer/nahledy/shader_alpha_zero_preview.png')});
  await setSlider('#sliderLeafAlpha',50);
  await page.screenshot({path:path.join(root,'web_viewer/nahledy/shader_alpha_half_preview.png')});
  await setSlider('#sliderLeafAlpha',200);
  if (await page.evaluate(() => shaderQA.shaderUniforms.uLeafAlphaStrength.value) !== 2) throw Error('Alpha must reach 200%');
  await setSlider('#sliderLeafAlpha',100);
  await setSlider('#sliderLeafEdgeTransition',0);
  await page.evaluate(() => { shaderQA.edgeSample = shaderQA.leafReference.stableAlpha[0].image.data.slice(); });
  await setSlider('#sliderLeafEdgeTransition',300);
  if (!await page.evaluate(() => shaderQA.edgeSample.some((value,i)=>value!==shaderQA.leafReference.stableAlpha[0].image.data[i]))) throw Error('Edge slider must change the actual alpha mask');
  if (await page.evaluate(() => shaderQA.shaderUniforms.uLeafAlphaStrength.value) !== 1) throw Error('Edge transition must not change overall alpha strength');
  await page.screenshot({path:path.join(root,'web_viewer/nahledy/shader_edge_transition_preview.png')});
  await setSlider('#sliderLeafEdgeTransition',100);

  const visibleLeaves = () => page.evaluate(() => shaderQA.leaves().reduce((count,m)=>count+m.geometry.drawRange.count/6,0));
  if ((await visibleLeaves()) !== 9932) throw Error('Original leaf count must be preserved');
  const originalLength = await page.evaluate(() => {
    const { mesh, leaves } = shaderQA.leafControls.models[0];
    const [a,b] = leaves[0].vertices;
    const p = mesh.geometry.attributes.position;
    return Math.hypot(p.getX(a)-p.getX(b),p.getY(a)-p.getY(b),p.getZ(a)-p.getZ(b));
  });
  await setSlider('#sliderLeafSize',150);
  const scaledLength = await page.evaluate(() => {
    const { mesh, leaves } = shaderQA.leafControls.models[0];
    const [a,b] = leaves[0].vertices;
    const p = mesh.geometry.attributes.position;
    return Math.hypot(p.getX(a)-p.getX(b),p.getY(a)-p.getY(b),p.getZ(a)-p.getZ(b));
  });
  if (Math.abs(scaledLength/originalLength-1.5)>0.0001) throw Error('Leaf size did not change by 150%');
  await setSlider('#sliderLeafCount',0);
  if ((await visibleLeaves()) !== 0) throw Error('Zero leaves must draw zero triangles');
  await setSlider('#sliderLeafCount',3000);
  if ((await visibleLeaves()) !== 3000) throw Error('Expected exactly 3000 leaves');
  await page.screenshot({path:path.join(root,'web_viewer/nahledy/shader_leaf_controls_preview.png')});
  await page.locator('#btnModelFull').click();
  await page.waitForFunction(() => document.getElementById('loader').classList.contains('hidden'),{},{timeout:120000});
  console.log('FULL',JSON.stringify(await describe()));
  await checkBark();
  if ((await visibleLeaves()) !== 3000 || await page.locator('#sliderLeafSize').inputValue() !== '150') throw Error('Leaf settings must survive a model switch');
  await setSlider('#sliderLeafSize',100);
  await setSlider('#sliderLeafCount',9932);
  if ((await visibleLeaves()) !== 9932) throw Error('Restoring original count must restore every leaf');
  if (await page.evaluate(() => shaderQA.shaderUniforms.uAlphaMode.value) !== 2) throw Error('Rotation and controls must not change the Blender mode');
  await page.screenshot({path:path.join(root,'web_viewer/nahledy/shader_full_preview.png')});
  if ((await describe()).programErrors) throw Error('Shader program failed');
  if(errors.length) throw Error(errors.join('\n'));
  console.log('PASS: Blender mode preserved during rotation; stable UV alpha; exact 0/3000/9932 leaf counts; 150% leaf size; settings preserved across both models; shader compilation.');
} finally { await browser.close(); }
