import {chromium} from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const url=process.env.QA_URL||'http://127.0.0.1:4173'
const output=path.resolve('artifacts/qa')
fs.mkdirSync(output,{recursive:true})
const browser=await chromium.launch({headless:true,args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']})
const issues=[]
let passed=0
const check=(state,message)=>{if(!state){issues.push(message);console.error('FAIL',message)}else{passed++;console.log('PASS',message)}}
const routes=['/home','/works','/module/lesen','/module/hoeren','/module/schreiben','/module/sprechen','/exam','/mistakes','/progress','/support','/about']
try{
 for(const [label,width,height] of [['mobile-360',360,800],['mobile-390',390,844],['tablet',768,1024],['desktop',1440,900]]){
  const context=await browser.newContext({viewport:{width,height},permissions:['microphone']})
  const page=await context.newPage()
  page.on('pageerror',e=>issues.push(label+' JS runtime error: '+e.message))
  for(const route of routes){
   await page.goto(url+'/#'+route,{waitUntil:'networkidle',timeout:20000})
   await page.locator('#root .app-shell').waitFor({timeout:12000})
   const dims=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,screen:window.innerWidth,visible:!!document.querySelector('main')}))
   check(dims.visible,label+' '+route+' renders')
   check(dims.scroll<=dims.screen+2,label+' '+route+' has no horizontal overflow ('+dims.scroll+'/'+dims.screen+')')
   if(['/home','/works','/support','/exam'].includes(route))
    await page.screenshot({path:path.join(output,label+'-'+route.replaceAll('/','').replaceAll('?','-')+'.png'),fullPage:true})
  }
  if(label==='mobile-390'){
   await page.goto(url+'/#/exam',{waitUntil:'networkidle'})
   await page.getByRole('button',{name:/Yeni deneme başlat/}).first().click()
   check(await page.getByRole('button',{name:/Ara ver/}).count()>0,'integrated exam starts')
   await page.getByRole('button',{name:/Ara ver/}).click()
   await page.waitForTimeout(250)
   await page.reload({waitUntil:'networkidle'})
   check((await page.locator('body').innerText()).includes('Devam eden denemeler'),'paused session remains in IndexedDB after reload')
   await page.getByRole('button',{name:/Devam et/}).first().click()
   check((await page.locator('body').innerText()).includes('Ara verildi'),'pausing persists across reopen')
   await page.getByRole('button',{name:/Denemeye devam et/}).click()
   check(await page.getByRole('button',{name:/Ara ver/}).count()>0,'resume is operational')
   await page.goto(url+'/#/support',{waitUntil:'networkidle'})
   await page.getByRole('button',{name:/Canlı Sprechen sınav provası/}).click()
   const future=new Date(Date.now()+4*86400000)
   const localDate=[future.getFullYear(),String(future.getMonth()+1).padStart(2,'0'),String(future.getDate()).padStart(2,'0')].join('-')
   await page.locator('input[type="date"]').fill(localDate)
   await page.locator('.teach7-date-grid select').selectOption('14:00')
   await page.getByRole('button',{name:/Yerel demo talebini kaydet/}).click()
   check((await page.locator('body').innerText()).includes('Demo seçim kaydedildi'),'teacher demo creates only local request')
   await page.reload({waitUntil:'networkidle'})
   check((await page.locator('.teach7-history .teach7-request').count())===1,'teacher demo request persists in IndexedDB')
   await page.getByRole('button',{name:/Ödeme adımı/}).click()
   check((await page.locator('body').innerText()).includes('hiçbir ödeme yapılmadı'),'payment remains demo-only')
   await page.goto(url+'/#/home',{waitUntil:'networkidle'})
   await page.evaluate(async()=>{if('serviceWorker' in navigator){await navigator.serviceWorker.ready;await new Promise(r=>setTimeout(r,900))}})
   await context.setOffline(true)
   await page.reload({waitUntil:'domcontentloaded',timeout:12000})
   check((await page.locator('body').innerText()).includes('Almancana güven'),'offline cached home page loads')
   await context.setOffline(false)
  }
  await context.close()
 }
}catch(e){issues.push('Fatal QA error: '+String(e?.stack||e))}
finally{await browser.close()}
const result={passed,errors:issues,generatedAt:new Date().toISOString()}
fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(result,null,2))
console.log('FINAL_QA_REPORT',JSON.stringify(result))
if(issues.length)process.exitCode=1
