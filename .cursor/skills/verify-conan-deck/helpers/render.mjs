import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const root=process.cwd();
const deck=path.join(root,".");
const require=createRequire(path.join(deck,'package.json'));
const playwright=require('playwright-chromium');
const {chromium}=playwright;
const base=process.env.DECK_URL;
assert(base,'Serve the production dist directory, then set DECK_URL to its origin');
const out=path.join(root,'artifacts/verification/rendered');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch();
try {
 const page=await browser.newPage({viewport:{width:1280,height:720}});
 const proof={screenshots:[],navigation:null,visualReview:'requires full-size human inspection; screenshots alone are not a visual pass'};
 for(const slide of [1, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]){
  await page.goto(new URL(String(slide),base.endsWith('/')?base:base+'/').href,{waitUntil:'networkidle'});
  await page.keyboard.press('Escape');await page.evaluate(async()=>{await document.fonts.load('400 32px "Deck Emoji"','🚀⚡');await document.fonts.ready;});await page.waitForTimeout(600);
  assert(await page.locator('.slidev-layout').count()>0,'slide layout missing');
  await page.screenshot({path:path.join(out,`slide-${slide}.png`)});proof.screenshots.push(slide);
 }
 
 fs.writeFileSync(path.join(out,'runtime.json'),JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof,null,2));
} finally {await browser.close();}
