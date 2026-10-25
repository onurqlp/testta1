import {useCallback,useEffect,useState} from 'react'
import {clearAllLocalData,exportAllLocalData,listRecords} from '../../storage/db'
import type {Attempt} from '../../storage/models'
import type {WritingDraft} from '../schreiben/model'
import type {SpeakingSession} from '../sprechen/model'
import type {ExamRun} from '../exam/model'
import {PART_LABELS,readingResult,hearingResult} from '../exam/model'
import {computeProgress,type ProgressSummary} from './model'
import './progress.css'

function dayLabel(value:string){return new Date(value+'T12:00:00').toLocaleDateString('tr-TR',{weekday:'short'})}
export default function ProgressView(){
 const [summary,setSummary]=useState<ProgressSummary|null>(null)
 const [loading,setLoading]=useState(true)
 const [error,setError]=useState('')
 const [busy,setBusy]=useState(false)
 const [filter,setFilter]=useState<'all'|'finished'|'active'>('all')
 const reload=useCallback(async()=>{
  const [a,d,s,e]=await Promise.all([
    listRecords<Attempt>('attempts'),
    listRecords<WritingDraft>('drafts'),
    listRecords<SpeakingSession>('sessions'),
    listRecords<ExamRun>('examSessions')
  ])
  setSummary(computeProgress(a,d,s,e))
 },[])
 useEffect(()=>{
  let mounted=true
  reload().catch(()=>{if(mounted)setError('Cihazdaki ilerleme verileri okunamadı.')})
   .finally(()=>{if(mounted)setLoading(false)})
  const onUpdate=()=>{void reload().catch(()=>setError('Son değişiklikler yüklenemedi.'))}
  window.addEventListener('ayda:progress-changed',onUpdate)
  return()=>{mounted=false;window.removeEventListener('ayda:progress-changed',onUpdate)}
 },[reload])
 const backup=async()=>{
  setBusy(true);setError('')
  try{
   const json=await exportAllLocalData()
   const file=new Blob([json],{type:'application/json;charset=utf-8'})
   const url=URL.createObjectURL(file)
   const a=document.createElement('a');a.href=url
   a.download='AYDA-OSD-A1-Yedek-'+new Date().toISOString().slice(0,10)+'.json'
   document.body.appendChild(a);a.click();a.remove()
   window.setTimeout(()=>URL.revokeObjectURL(url),3000)
  }catch{setError('Yedek oluşturulamadı. Tarayıcıda kayıtların ve ses dosyalarının okunabildiğini kontrol et.')}
  finally{setBusy(false)}
 }
 const erase=async()=>{
  if(!window.confirm('AYDA A1 demosundaki TÜM cihaz kayıtları ve ses dosyaları silinecek. Bu işlem geri alınamaz. Devam edilsin mi?'))return
  if(!window.confirm('İkinci onay: Önce JSON yedeği indirdiğinden emin ol. Verileri kalıcı olarak sıfırlayayım mı?'))return
  setBusy(true);setError('')
  try{
   await clearAllLocalData()
   window.dispatchEvent(new Event('ayda:progress-changed'))
   window.location.reload()
  }catch{setError('Veriler sıfırlanamadı. Başka bir sekmede uygulama açıksa kapatıp yeniden dene.')}
  finally{setBusy(false)}
 }
 const show=summary?.recent.filter(r=>filter==='all'||r.kind===filter)||[]
 const peak=Math.max(0,...(summary?.activity.map(x=>x.count)||[]))
 return <div className="p6">
  <header className="p6-hero"><span>GERÇEK CİHAZ KAYITLARI</span><h2>İlerlemeni burada gör.</h2><p>Sayfadaki tüm sayılar senin çözüm, taslak ve tam deneme kayıtlarından hesaplanır. Örnek veri, hayalî başarı oranı veya resmî ÖSD geçme tahmini yoktur.</p></header>
  {error&&<div role="alert" className="p6-error">{error}</div>}
  {loading&&<p>Veriler yükleniyor…</p>}
  {summary&&<>
   <div className="p6-stats">
    <div><small>Bitmiş çalışma</small><strong>{summary.finishedCount}</strong><span>Özgün kayıtlardan</span></div>
    <div><small>Devam eden</small><strong>{summary.activeCount}</strong><span>Taslak + denemeler</span></div>
    <div><small>Birleşik deneme</small><strong>{summary.examFinished}</strong><span>{summary.examActive} devam ediyor</span></div>
    <div><small>Gerçek yanlış</small><strong>{summary.wrong}</strong><span>{summary.blank} boş ayrıca izlenir</span></div>
   </div>
   <div className="p6-columns">
    <section className="p6-panel"><div className="p6-panel-header"><h3>Son 7 gün · Tamamlanan çalışmalar</h3><span>{summary.activity.reduce((n,a)=>n+a.count,0)} kayıt</span></div>
     {peak===0?<div className="p6-empty">Bu 7 günde tamamlanmış çalışma bulunmuyor. Grafik sıfırdan oluşturulmadı.</div>:<div className="p6-bars" role="img" aria-label={'Son 7 gün tamamlanan çalışmalar: '+summary.activity.map(x=>x.day+' '+x.count).join(', ')}>
      {summary.activity.map(row=><div className="p6-bar-col" key={row.day}><b>{row.count||''}</b><div className="p6-bar-track"><span style={{height:(row.count/peak*100)+'%'}}/></div><small>{dayLabel(row.day)}</small></div>)}
     </div>}
    </section>
    <section className="p6-panel"><h3>Beceri bazında gerçek sonuçlar</h3>
     {summary.skills.map(skill=><div className="p6-skill" key={skill.module}>
      <div><strong>{PART_LABELS[skill.module]}</strong><small>{skill.finished} bitmiş çalışma</small></div>
      {skill.graded>0?<div className="p6-score"><b>{skill.correct} doğru</b><span>{skill.wrong} yanlış · {skill.blank} boş</span></div>:<span className="p6-not-graded">{skill.finished>0?'Otomatik puan yok':'Henüz çalışma yok'}</span>}
     </div>)}
    </section>
   </div>
   <section className="p6-panel"><div className="p6-panel-header"><h3>Gerçek geçmişin</h3><div className="p6-filter"><button className={filter==='all'?'active':''} onClick={()=>setFilter('all')}>Tümü</button><button className={filter==='finished'?'active':''} onClick={()=>setFilter('finished')}>Bitenler</button><button className={filter==='active'?'active':''} onClick={()=>setFilter('active')}>Devam eden</button></div></div>
    {show.length===0?<p className="p6-empty">Seçili filtreye uygun kayıt bulunmuyor.</p>:show.map(ev=><a href={ev.path} key={ev.id} className="p6-activity"><div><b>{ev.title}</b><span>{ev.details}</span></div><div><small>{new Date(ev.date).toLocaleString('tr-TR')}</small><strong>{ev.kind==='active'?'Devam et ›':'İncele ›'}</strong></div></a>)}
   </section>
   <section className="p6-panel"><h3>Neleri tekrar çalışmalısın?</h3>{summary.recommendations.length?summary.recommendations.map((r,i)=><a key={r.module+i} href={'#/module/'+r.module} className="p6-recommendation"><strong>{PART_LABELS[r.module]}</strong><span>{r.reason}</span><b>Çalış ›</b></a>):<p className="p6-empty">Kayıtlardan çıkarılabilen somut eksik şu an yok. Yeni çalışmalar yaptıkça öneriler oluşur. Bu ifade sınava hazır olduğunu kanıtlamaz.</p>}</section>
   <section className="p6-backup"><div><h3>Veriler ve yerel yedek</h3><p>Şu ana kadar {summary.writingDrafts} açık Schreiben taslağı ve {summary.recordingCount} kayıt referansı mevcut. JSON yedeği cihazdaki ses dosyalarını Base64 olarak da içerir; dosya büyük olabilir. Sunucuya otomatik gönderim yapılmaz.</p></div><div className="p6-backup-actions"><button disabled={busy} onClick={()=>void backup()}>JSON yedeğini indir</button><button disabled={busy} className="destructive" onClick={()=>void erase()}>Tüm kayıtları sıfırla</button></div></section>
  </>}
 </div>
}

export function ExamMistakes(){
 const [rows,setRows]=useState<{id:string;title:string;date:string;prompt:string;user:string;answer:string;why:string}[]>([])
 const [error,setError]=useState('')
 useEffect(()=>{
  let active=true
  listRecords<ExamRun>('examSessions').then(exams=>{
   if(!active)return
   setRows(exams.filter(e=>e.kind==='integrated-exam'&&e.status==='finished')
     .flatMap(e=>[...readingResult(e).wrongItems.map(q=>({q,skill:'Lesen'})),
       ...hearingResult(e).wrongItems.map(q=>({q,skill:'Hören'}))]
      .map(({q,skill})=>({id:e.id+q.id,title:'Tam deneme '+(e.setIndex+1)+' · '+skill,
        date:e.finishedAt||e.updatedAt,prompt:q.prompt,user:q.user,answer:q.answer,why:q.why}))))
  }).catch(()=>setError('Tam deneme yanlışları okunamadı.'))
  return()=>{active=false}
 },[])
 return <section className="p6-panel"><h3>Tam denemelerdeki yanlışlar</h3>
 {error&&<p role="alert" className="p6-error">{error}</p>}
 {rows.length===0?<p className="p6-empty">Bütünleşik denemelerde henüz kaydedilmiş yanlış cevap yok. Boş bırakılan sorular yanlış sayılmaz.</p>:
 rows.map(r=><article className="p6-error-item" key={r.id}><small>{r.title} · {new Date(r.date).toLocaleDateString('tr-TR')}</small><strong lang="de">{r.prompt}</strong><p>Senin cevabın: {r.user} · Doğru: {r.answer}</p><span>{r.why}</span></article>)}
 </section>
}
