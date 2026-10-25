import {useCallback,useEffect,useMemo,useState} from 'react'
import {deleteRecord,listRecords,putRecord} from '../../storage/db'
import type {WritingDraft} from '../schreiben/model'
import {SERVICES,STATUS_LABEL,createDemoRequest,findService,formatPrice,isDemoRequest,simulateNext,validateRequest,type DemoRequest} from './model'
import './teachers.css'

const TIMES=['10:00','14:00','19:00']
const getParams=()=>new URLSearchParams(window.location.hash.split('?')[1]||'')
const todayLocal=()=>{const now=new Date();return [now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-')}
const shortDate=(value:string)=>new Date(value+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})
export default function SupportView(){
 const params=useMemo(getParams,[])
 const [serviceId,setServiceId]=useState(()=>findService(params.get('service')||'')?.id||SERVICES[0].id)
 const [selectedDrafts,setSelectedDrafts]=useState<string[]>(()=>params.get('draft')?[params.get('draft')!]:[])
 const [date,setDate]=useState('')
 const [time,setTime]=useState('')
 const [drafts,setDrafts]=useState<WritingDraft[]>([])
 const [requests,setRequests]=useState<DemoRequest[]>([])
 const [loading,setLoading]=useState(true)
 const [busy,setBusy]=useState(false)
 const [error,setError]=useState('')
 const [notice,setNotice]=useState('')
 const service=findService(serviceId)!
 const eligibleDrafts=useMemo(()=>drafts.filter(x=>x?.module==='schreiben'&&typeof x.email==='string'&&x.email.trim().length>0).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)),[drafts])
 const reload=useCallback(async()=>{
  const [draftRows,requestRows]=await Promise.all([listRecords<WritingDraft>('drafts'),listRecords<unknown>('teacherRequests')])
  setDrafts(draftRows)
  setRequests(requestRows.filter(isDemoRequest).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)))
 },[])
 useEffect(()=>{
  let live=true
  void reload().catch(()=>{if(live)setError('Yerel taslaklar veya demo talepleri okunamadı.')})
    .finally(()=>{if(live)setLoading(false)})
  return()=>{live=false}
 },[reload])
 const selectService=(id:string)=>{
  setServiceId(id);setSelectedDrafts([]);setDate('');setTime('');setError('');setNotice('')
 }
 const toggleDraft=(id:string)=>{
  const max=service.draftCount||1
  setSelectedDrafts(old=>old.includes(id)?old.filter(x=>x!==id):old.length>=max?[...old.slice(1),id]:[...old,id])
 }
 const draftTitles=(ids:string[])=>ids.map(id=>{
  const d=drafts.find(x=>x.id===id)
  return d?d.taskId+' · '+d.mode+' · '+d.email.trim().split(/\s+/).length+' kelime':'Taslak cihazda bulunamadı'
 })
 const validation=validateRequest(service,selectedDrafts,date,time)
 const save=async()=>{
  setError('');setNotice('')
  const issue=validateRequest(service,selectedDrafts,date,time)
  if(issue){setError(issue);return}
  if(service.kind==='writing-review'&&selectedDrafts.some(id=>!eligibleDrafts.some(d=>d.id===id))){setError('Seçili mektupların tamamı cihazda kayıtlı ve dolu olmalı.');return}
  setBusy(true)
  try{
   const row=createDemoRequest(service,selectedDrafts,date,time)
   await putRecord('teacherRequests',row)
   setRequests(old=>[row,...old])
   setNotice('Demo seçim kaydedildi. Gerçek öğretmene iletilmedi, ödeme veya randevu oluşturulmadı.')
  }catch(e){setError(e instanceof Error?e.message:'Demo isteği kaydedilemedi.')}
  finally{setBusy(false)}
 }
 const advance=async(row:DemoRequest)=>{
  if(busy)return
  const changed=simulateNext(row)
  if(changed===row)return
  setBusy(true);setError('')
  try{
   await putRecord('teacherRequests',changed)
   setRequests(old=>old.map(x=>x.id===row.id?changed:x))
   setNotice('Yalnızca cihazındaki DEMO durum göstergesi değişti. Herhangi bir öğretmen işlem yapmadı.')
  }catch{setError('Demo durum değişikliği kaydedilemedi.')}
  finally{setBusy(false)}
 }
 const remove=async(row:DemoRequest)=>{
  if(busy||!window.confirm('Bu demo istek kaydını cihazından silmek istiyor musun? Çalışma taslakları silinmeyecek.'))return
  setBusy(true);setError('')
  try{
   await deleteRecord('teacherRequests',row.id)
   setRequests(old=>old.filter(x=>x.id!==row.id))
   setNotice('Yalnızca seçilen demo istek kaydı silindi.')
  }catch{setError('Demo kayıt silinemedi.')}
  finally{setBusy(false)}
 }
 return <div className="teach7">
  <header className="teach7-hero">
   <span>AŞAMA 7 · ÖĞRETMEN DESTEĞİ</span>
   <h1>Bir öğretmenle çalışmayı planla.</h1>
   <p>A1 mektup değerlendirmesi veya canlı Sprechen/Schreiben desteğini keşfet. Bu ekran yalnızca hizmet ve rezervasyon <strong>demonstrasyonudur.</strong></p>
   <div className="teach7-hero-pills"><span>6 demo hizmet</span><span>Yerel kayıt</span><span>Gerçek ödeme yok</span></div>
  </header>
  <div className="teach7-alert" role="note"><strong>Demo bilgilendirmesi</strong><p>Fiyatlar henüz onaylanmamış öneridir. Takvimde görülen saatler gerçek öğretmen uygunluğu değildir; talep gönderilmez, ödeme alınmaz ve hiçbir rezervasyon kesinleşmez.</p></div>
  {error&&<div className="teach7-message danger" role="alert">{error}</div>}
  {notice&&<div className="teach7-message" role="status">{notice}</div>}
  <section className="teach7-block"><div className="teach7-heading"><span>01 · HİZMETİ SEÇ</span><h2>Nasıl destek almak istersin?</h2></div>
   <div className="teach7-services">{SERVICES.map(x=><button type="button" key={x.id} aria-pressed={x.id===serviceId} className={'teach7-service '+(x.id===serviceId?'selected':'')} onClick={()=>selectService(x.id)}>
    <div className="teach7-service-top"><span>{x.category==='schreiben'?'✍ Schreiben':x.category==='sprechen'?'◉ Sprechen':'◇ Kombine'}</span><b>{x.id===serviceId?'✓ Seçili':'Seç ›'}</b></div>
    <h3>{x.title}</h3><p>{x.description}</p>
    <div className="teach7-service-bottom"><div><strong>{formatPrice(x.priceTry)}</strong><small>ÖNERİ FİYAT · DEMO</small></div><em>{x.durationMinutes?x.durationMinutes+' dk görüşme':x.draftCount+' metin'}</em></div>
   </button>)}</div>
  </section>
  <section className="teach7-block"><div className="teach7-heading"><span>02 · DETAYLARI BELİRLE</span><h2>{service.kind==='writing-review'?'Kayıtlı mektuplarını seç':'Demo tarih ve saat seç'}</h2></div>
   {service.kind==='writing-review'?<div className="teach7-panel">
     <p><strong>{service.draftCount+' farklı taslak seçmelisin.'}</strong> Aşağıda yalnız cihazda kayıtlı ve metni olan Schreiben taslakları gösterilir. Bir taslak seçilince içeriği hiçbir yere gönderilmez.</p>
     {loading?<p>Taslaklar okunuyor…</p>:eligibleDrafts.length===0?<div className="teach7-empty"><p>Henüz uygun bir mektup taslağın yok.</p><a href="#/module/schreiben">Schreiben'de mektup yaz ›</a></div>:<div className="teach7-draft-list">{eligibleDrafts.map(d=><label key={d.id} className={'teach7-draft '+(selectedDrafts.includes(d.id)?'selected':'')}>
      <input type="checkbox" checked={selectedDrafts.includes(d.id)} onChange={()=>toggleDraft(d.id)}/>
      <span><strong>{d.taskId}</strong><small>{d.mode==='timed'?'Süreli':'Serbest'} çalışma · {new Date(d.updatedAt).toLocaleDateString('tr-TR')} · {d.email.trim().split(/\s+/).length} kelime</small><em lang="de">{d.email.trim().slice(0,120)}{d.email.trim().length>120?'…':''}</em></span>
     </label>)}</div>}
     <small className="teach7-counter">{selectedDrafts.length} / {service.draftCount} seçili</small>
    </div>:<div className="teach7-panel">
     <p>İstediğin tarihi ve örnek saati işaretle. <strong>Hiçbir saat gerçek müsaitlik ya da ayrılmış randevu değildir.</strong> Öğretmen takvimi bağlanmadı.</p>
     <div className="teach7-date-grid">
       <label><span>Tercih edilen tarih (DEMO)</span><input type="date" min={todayLocal()} value={date} onChange={e=>setDate(e.target.value)}/></label>
       <label><span>Örnek saat (DEMO SLOT)</span><select value={time} onChange={e=>setTime(e.target.value)}><option value="">Demo saat seç</option>{TIMES.map(t=><option value={t} key={t}>{t} · DEMO SLOT</option>)}</select></label>
     </div>
     <small className="teach7-counter">Tarih ve saat sadece yerel örnek talep özetinde görünecek.</small>
    </div>}
  </section>
  <section className="teach7-block"><div className="teach7-heading"><span>03 · ÖZET VE YEREL KAYIT</span><h2>Örnek talep özeti</h2></div>
   <div className="teach7-summary"><div><span>Hizmet</span><strong>{service.title}</strong></div><div><span>Teslim</span><strong>{service.delivery}</strong></div>
    {service.kind==='writing-review'?<div><span>Seçilen metinler</span><strong>{selectedDrafts.length===0?'Henüz seçilmedi':draftTitles(selectedDrafts).join(' / ')}</strong></div>:<div><span>Örnek zaman</span><strong>{date&&time?shortDate(date)+' · '+time+' (DEMO SLOT)':'Henüz seçilmedi'}</strong></div>}
    <div className="teach7-summary-price"><span>Öneri fiyat · kesinleşmiş değil</span><strong>{formatPrice(service.priceTry)}</strong></div>
    <p>Kaydetme işlemi sadece bu tarayıcıdaki demo geçmişine kayıt açar; gerçek talep, ödeme, toplantı bağlantısı veya teslimat oluşturmaz.</p>
    <div className="teach7-actions"><button type="button" className="teach7-primary" disabled={busy||loading||Boolean(validation)} onClick={()=>void save()}>{busy?'Kaydediliyor…':'Yerel demo talebini kaydet'}</button><button type="button" className="teach7-secondary" onClick={()=>setNotice('Demo: ödeme entegrasyonu aktif değil. Kart bilgisi alınmıyor; hiçbir ödeme yapılmadı.')}>Ödeme adımı (DEMO)</button></div>
    {validation&&<small className="teach7-validation">{validation}</small>}
   </div>
  </section>
  <section className="teach7-block"><div className="teach7-heading"><span>04 · KAYITLARIM</span><h2>Bu cihazdaki demo taleplerim</h2></div>
   <p className="teach7-note">Aşağıdaki durumlar yalnızca iş akışını göstermek içindir. “Teslim edildi / inceleniyor / tamamlandı” adımlarında hiçbir gerçek öğretmen işlem yapmaz.</p>
   {loading?<p>Kayıtlar okunuyor…</p>:requests.length===0?<div className="teach7-empty">Henüz kaydedilmiş demo talebi bulunmuyor.</div>:<div className="teach7-history">{requests.map(row=>{
    const svc=findService(row.serviceId)
    return <article className="teach7-request" key={row.id}>
      <div className="teach7-request-head"><div><strong>{svc?.title||'Demo hizmet'}</strong><small>{new Date(row.createdAt).toLocaleString('tr-TR')}</small></div><span>DEMO</span></div>
      <p>{row.preferredDate&&row.preferredTime?row.preferredDate+' · '+row.preferredTime+' · müsaitlik doğrulanmadı':row.draftIds.length+' yerel mektup seçimi'}</p>
      <div className="teach7-state">{STATUS_LABEL[row.status]}</div>
      <div className="teach7-actions"><button type="button" disabled={busy||row.status==='simulated-completed'} onClick={()=>void advance(row)}>Demo durumunu ilerlet</button><button type="button" disabled={busy} className="teach7-delete" onClick={()=>void remove(row)}>Bu kaydı sil</button></div>
    </article>
   })}</div>}
  </section>
  <footer className="teach7-bottom">Gerçek hizmet için sonraki entegrasyonlar: öğretmen takvimi, güvenli dosya gönderimi, ödeme altyapısı, bildirimler ve öğretmen değerlendirme paneli. Bu demo AYDA'nın gerçek randevu sistemine bağlı değildir.</footer>
 </div>
}
