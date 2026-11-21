import { readFileSync, mkdirSync } from 'node:fs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');

const url='http://127.0.0.1:8080';
const small=process.argv.includes('--review');
const browser=await chromium.launch({args:['--no-sandbox','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
try{
  const page=await browser.newPage({viewport:{width:1280,height:800}});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.route('**/*',route=>{
    if(route.request().url().startsWith(url+'/'))return route.continue();
    errors.push('External request: '+route.request().url());return route.abort();
  });
  if(small)mkdirSync('.capture',{recursive:true});
  for(const shot of JSON.parse(readFileSync('shots.json','utf8'))){
    await page.goto(url+'/'+shot.query);
    await page.locator('body[data-ready=true]').waitFor({state:'attached',timeout:12000});
    const result=await page.screenshot({path:`screenshots/${shot.name}`,quality:89,timeout:15000});
    if(result.length>262144)throw new Error(`Oversize render ${shot.name}: ${result.length}`);
    if(small){
      const review=await browser.newPage({viewport:{width:768,height:480}});
      await review.setContent(`<body style="margin:0"><img width="768" height="480" src="data:image/jpeg;base64,${result.toString('base64')}">`);
      await review.screenshot({path:`.capture/${shot.name}`});await review.close();
    }
    console.log(shot.name,result.length);
  }
  if(errors.length)throw new Error(errors.join('\n'));
}finally{await browser.close();}
