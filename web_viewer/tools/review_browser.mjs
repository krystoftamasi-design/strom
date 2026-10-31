import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
const require = createRequire(path.join(process.env.USERPROFILE, '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json'));
const {chromium} = require('playwright');
const [url, output] = process.argv.slice(2);
const result = {browser:'Google Chrome', url, chapters:[], errors:[], failedRequests:[]};
let browser;
try {
  browser = await chromium.launch({channel:'chrome', headless:true, args:['--enable-webgl','--ignore-gpu-blocklist']});
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  page.on('pageerror', e=>result.errors.push(String(e)));
  page.on('requestfailed', r=>result.failedRequests.push({url:r.url(),failure:r.failure()}));
  page.on('response', r=>{if(r.status()>=400)result.failedRequests.push({url:r.url(),status:r.status()});});
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForFunction(()=>document.querySelector('[data-open-chapter]'),null,{timeout:120000});
  await page.waitForFunction(()=>!document.querySelector('#loader:not(.hidden)'),null,{timeout:120000});
  const ids = await page.locator('[data-open-chapter]').evaluateAll(nodes=>nodes.map(n=>n.dataset.openChapter));
  for(const id of [...new Set(ids)]) {
    const entry={id, interactions:[]};
    try {
      // Menu can be collapsed; DOM click invokes the real chapter handler.
      await page.locator(`[data-open-chapter="${id}"]`).first().evaluate(el=>el.click());
      await page.waitForTimeout(500);
      entry.activeChapter=await page.locator('body').getAttribute('data-chapter');
      entry.text=await page.locator('body').innerText();
      entry.windows=await page.locator('.element-ui-okno').evaluateAll(nodes=>nodes.map(n=>({id:n.dataset.windowId,visible:!!n.getClientRects().length,text:n.innerText,html:n.outerHTML})));
      const toggles=page.locator('.annotation-toggle:visible');
      const count=await toggles.count();
      for(let i=0;i<count;i++) {
        const toggle=toggles.nth(i);
        const before=await toggle.getAttribute('aria-expanded');
        await toggle.click();
        const after=await toggle.getAttribute('aria-expanded');
        entry.interactions.push({index:i,before,after,text:await toggle.innerText()});
        await toggle.click();
      }
      entry.screenshot=path.join(output,`${id}.png`);
      await page.screenshot({path:entry.screenshot});
    }catch(e){entry.unverified=String(e);}
    result.chapters.push(entry);
  }
  result.status='CAPTURED';
}catch(e){result.status='UNVERIFIED';result.reason=String(e);}
finally{if(browser)await browser.close();await fs.writeFile(path.join(output,'browser.json'),JSON.stringify(result,null,2));}
