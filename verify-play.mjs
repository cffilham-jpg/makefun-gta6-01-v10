import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
const origin='http://127.0.0.1:8080';
try{
  const page=await browser.newPage({viewport:{width:850,height:540}});
  page.setDefaultTimeout(22000);
  const errors=[];
  page.on('pageerror',error=>{errors.push(error.message);console.error(error.message);});
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.route('**/*',route=>{
    if(route.request().url().startsWith(origin+'/'))return route.continue();
    errors.push('External request '+route.request().url());return route.abort();
  });
  await page.goto(origin);
  const match=(id,words)=>page.waitForFunction(([id,words])=>document.getElementById(id)?.textContent.includes(words),[id,words],{polling:100});
  const key=code=>page.keyboard.press(code);
  const save=async()=>{
    await key('Escape');await page.locator('[data-action=save]').waitFor();
    return page.evaluate(()=>JSON.parse(localStorage.getItem('puerto-alba-autosave-v1')));
  };
  await page.locator('[data-action=begin]').click();
  await match('mission','Wheelwoman');
  const original=await save();assert.equal(original.version,1);
  await page.locator('[data-action=resume]').click();
  await page.keyboard.down('w');
  await page.waitForTimeout(1800);await page.keyboard.up('w');
  const walked=await save();assert.ok(walked.z<original.z-.15,'walking advances world position');
  await page.locator('[data-action=resume]').click();
  await key('e');await match('vehicle','FALCON GT');
  await page.keyboard.down('w');
  await page.waitForFunction(()=>Number(document.querySelector('#vehicle strong')?.textContent)>5,null,{polling:100});
  await page.keyboard.up('w');
  await key('x');await match('prompt','PIT STOP active');
  await key('m');await page.locator('[data-action=job0]').click();await match('prompt','Job started');
  await key('e');await match('vehicle','ON FOOT');
  await page.keyboard.down('f');await page.waitForFunction(()=>!document.querySelector('#weapons .slot.active small').textContent.includes('54 rounds'),null,{polling:100});await page.keyboard.up('f');
  await match('dispatch','GARZA-7');
  await page.evaluate(()=>{
    const slot='puerto-alba-autosave-v1';const data=JSON.parse(localStorage.getItem(slot));
    localStorage.setItem(slot,JSON.stringify({...data,x:-4.65,z:3.5}));
  });
  await page.reload();await page.locator('[data-action=begin]').click();
  await key('e');await match('vehicle','ORCA 900');
  await page.keyboard.down('w');await page.waitForFunction(()=>Number(document.querySelector('#vehicle strong')?.textContent)>6,null,{polling:100});await page.keyboard.up('w');
  assert.deepEqual(errors,[]);
  console.log('Passed: walk, Falcon handling, crew repair, mission selection, weapon fire, police dispatch, save/continue, motorcycle handling, and zero external requests or console errors.');
}finally{await browser.close();}
