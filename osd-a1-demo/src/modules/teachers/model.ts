export type ServiceKind='writing-review'|'live'
export type DemoStatus='saved'|'simulated-delivered'|'simulated-reviewing'|'simulated-completed'
export interface DemoService {
 id:string; title:string;kind:ServiceKind;category:'schreiben'|'sprechen'|'combined';
 priceTry:number;durationMinutes?:number;draftCount?:1|3;description:string;delivery:string
}
export const SERVICES:readonly DemoService[]=[
 {id:'writing-single',title:'1 mektup öğretmen kontrolü',kind:'writing-review',category:'schreiben',priceTry:499,draftCount:1,description:'Bir A1 e-postasını öğretmenin sonradan incelemesi için örnek talep.',delivery:'Asenkron metin değerlendirmesi'},
 {id:'writing-three',title:'3 mektup kontrol paketi',kind:'writing-review',category:'schreiben',priceTry:1299,draftCount:3,description:'Üç farklı kaydedilmiş A1 metni için örnek paket.',delivery:'Asenkron metin değerlendirmesi'},
 {id:'writing-live-30',title:'Canlı Schreiben çalışması',kind:'live',category:'schreiben',priceTry:1250,durationMinutes:30,description:'A1 form ve kısa e-posta çalışması için canlı görüşme taslağı.',delivery:'Canlı çevrim içi görüşme'},
 {id:'speaking-live-30',title:'Canlı Sprechen sınav provası',kind:'live',category:'sprechen',priceTry:1250,durationMinutes:30,description:'Üç sözlü Aufgabe için öğretmenle prova planı.',delivery:'Canlı çevrim içi görüşme'},
 {id:'speaking-live-60',title:'Canlı Sprechen çalışması',kind:'live',category:'sprechen',priceTry:2250,durationMinutes:60,description:'A1 konuşma ve soru-cevap pratiği için uzun görüşme.',delivery:'Canlı çevrim içi görüşme'},
 {id:'combined-live-60',title:'Sprechen + Schreiben',kind:'live',category:'combined',priceTry:2250,durationMinutes:60,description:'İki beceri için ortak canlı çalışma planı.',delivery:'Canlı çevrim içi görüşme'}
]
export const findService=(id:string)=>SERVICES.find(s=>s.id===id)
export const formatPrice=(amount:number)=>new Intl.NumberFormat('tr-TR').format(amount)+' TL'
export const STATUS_LABEL:Record<DemoStatus,string>={
 saved:'Cihazda demo taslağı',
 'simulated-delivered':'DEMO · Teslim edildi (simülasyon)',
 'simulated-reviewing':'DEMO · İnceleniyor (simülasyon)',
 'simulated-completed':'DEMO · Tamamlandı (simülasyon)'
}
export interface DemoRequest {
 id:string;kind:'teacher-service-demo';version:1;serviceId:string;
 createdAt:string;updatedAt:string;status:DemoStatus;
 proposedPriceTry:number;draftIds:string[];
 preferredDate?:string;preferredTime?:string;
}
const validDay=(value:string)=>{
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false
 const parsed=new Date(value+'T12:00:00')
 if(Number.isNaN(parsed.getTime()))return false
 const [year,month,day]=value.split('-').map(Number)
 return parsed.getFullYear()===year&&parsed.getMonth()+1===month&&parsed.getDate()===day
}
export function validateRequest(service:DemoService,draftIds:string[],date:string,time:string,now=Date.now()):string|null{
 if(service.kind==='writing-review'){
  if(draftIds.length!==(service.draftCount||0)||new Set(draftIds).size!==draftIds.length||draftIds.some(id=>!id.trim()))
   return 'Bu paket için '+service.draftCount+' farklı, kayıtlı mektup taslağı seç.'
  return null
 }
 if(!validDay(date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))
  return 'Demo tarihini ve saatini seç.'
 const desired=new Date(date+'T'+time+':00').getTime()
 if(!Number.isFinite(desired)||desired<=now)return 'Geçmişte olmayan bir demo tarih/saat seç.'
 return null
}
export function createDemoRequest(service:DemoService,draftIds:string[],date:string,time:string,now=Date.now(),id?:string):DemoRequest{
 const problem=validateRequest(service,draftIds,date,time,now)
 if(problem)throw new Error(problem)
 const at=new Date(now).toISOString()
 const record:DemoRequest={id:id||'teacher-demo:'+now+':'+Math.random().toString(36).slice(2),
  kind:'teacher-service-demo',version:1,serviceId:service.id,createdAt:at,updatedAt:at,status:'saved',
  proposedPriceTry:service.priceTry,draftIds:service.kind==='writing-review'?[...draftIds]:[]}
 if(service.kind==='live'){record.preferredDate=date;record.preferredTime=time}
 return record
}
const NEXT:Partial<Record<DemoStatus,DemoStatus>>={
 saved:'simulated-delivered',
 'simulated-delivered':'simulated-reviewing',
 'simulated-reviewing':'simulated-completed'
}
export function simulateNext(request:DemoRequest,now=Date.now()):DemoRequest{
 const status=NEXT[request.status]
 return status?{...request,status,updatedAt:new Date(now).toISOString()}:request
}
export function isDemoRequest(value:unknown):value is DemoRequest{
 if(!value||typeof value!=='object')return false
 const row=value as Partial<DemoRequest>
 return row.kind==='teacher-service-demo'&&row.version===1&&typeof row.id==='string'&&
 typeof row.serviceId==='string'&&Boolean(findService(row.serviceId))&&
 (row.status==='saved'||row.status==='simulated-delivered'||row.status==='simulated-reviewing'||row.status==='simulated-completed')
}
