import { useEffect, useMemo, useRef, useState } from 'react'
import { listRecords, putRecord, readRecord } from '../../storage/db'
import { writingTasks, getWritingTask, type WritingTask, type WritingMode } from './content'
import { analyzeEmail, applyFix, checkForm, getHighlightSpans, wordCount, type Issue } from './rules'
import { countDown, draftId, finishDraft, makeWritingAttempt, newDraft, restoreSnapshot, reviseDraft, showTime, snapshotDraft, type WritingDraft } from './model'
import './schreiben.css'

type Screen = 'sets' | 'editing' | 'finished'
type Section = 'form' | 'mail'
const isDraft=(a:WritingDraft)=>a?.module==='schreiben' && Boolean(getWritingTask(a.taskId))
const isCompleted=(a:{module?:string;finishedAt?:string})=>a?.module==='schreiben'&&Boolean(a.finishedAt)

export default function SchreibenView() {
 const [screen,setScreen]=useState<Screen>('sets')
 const [section,setSection]=useState<Section>('form')
 const [active,setActive]=useState<WritingDraft|null>(null)
 const activeRef=useRef<WritingDraft|null>(null)
 const [allDrafts,setAllDrafts]=useState<WritingDraft[]>([])
 const [completeCount,setCompleteCount]=useState<Record<string,number>>({})
 const [loading,setLoading]=useState(true)
 const [message,setMessage]=useState('')
 const [saveStatus,setSaveStatus]=useState<'saved'|'saving'|'error'>('saved')
 const [showFormFeedback,setShowFormFeedback]=useState(false)
 const [showModel,setShowModel]=useState(false)
 const [showTeacher,setShowTeacher]=useState(false)
 const [now,setNow]=useState(Date.now)
 const [finishing,setFinishing]=useState(false)
 const [restoreChoice,setRestoreChoice]=useState('')
 const textArea=useRef<HTMLTextAreaElement|null>(null)
 const queue=useRef<Promise<void>>(Promise.resolve())
 const saveSequence=useRef(0)
 const submitLock=useRef(false)
 const mounted=useRef(true)

 useEffect(()=>{
   mounted.current=true
   Promise.all([listRecords<WritingDraft>('drafts'),listRecords<{module:string;taskId:string;finishedAt?:string}>('attempts')])
   .then(([drafts,attempts])=>{
     if(!mounted.current)return
     setAllDrafts(drafts.filter(isDraft))
     const counts:Record<string,number>={}
     for(const a of attempts.filter(isCompleted))counts[a.taskId]=(counts[a.taskId]||0)+1
     setCompleteCount(counts)
   }).catch(()=>{if(mounted.current)setMessage('Yerel kayıtlar açılamadı. Tarayıcı depolama ayarını kontrol edin.')})
   .finally(()=>{if(mounted.current)setLoading(false)})
   return()=>{mounted.current=false}
 },[])

 const setCurrent=(draft:WritingDraft|null)=>{activeRef.current=draft;setActive(draft)}
 const update=(next:WritingDraft)=>{
   setCurrent(next);setSaveStatus('saving')
   const seq=++saveSequence.current
   queue.current=queue.current.catch(()=>{}).then(()=>putRecord('drafts',next))
     .then(()=>{
       if(!mounted.current)return
       setAllDrafts(old=>[next,...old.filter(a=>a.id!==next.id)])
       if(seq===saveSequence.current)setSaveStatus('saved')
     }).catch(()=>{
       if(mounted.current){setSaveStatus('error');setMessage('Taslak cihazda kaydedilemedi. Bu sekmeden çıkmadan depolama alanını kontrol edin.')}
     })
 }
 const patch=(partial:Partial<Pick<WritingDraft,'email'|'form'>>)=>{
   const value=activeRef.current
   if(value&&!value.finishedAt&&!(value.mode==='timed'&&countDown(value)===0)&&!submitLock.current)update(reviseDraft(value,partial))
 }
 const choose=async(task:WritingTask,newMode:WritingMode)=>{
   setMessage('');setShowFormFeedback(false);setShowModel(false);setShowTeacher(false);setRestoreChoice('')
   try{
     const row=await readRecord<WritingDraft>('drafts',draftId(task.id,newMode))
     const draft=row||newDraft(task.id,newMode)
     if(!row)await putRecord('drafts',draft)
     setCurrent(draft);setSection('form');setScreen(draft.finishedAt?'finished':'editing')
     setNow(Date.now());setSaveStatus('saved')
   }catch{setMessage('Çalışma açılamadı. Tarayıcının yerel veri iznini kontrol edin.')}
 }
 const finish=async(why:'submitted'|'timeout')=>{
   if(submitLock.current||!activeRef.current)return
   submitLock.current=true;setFinishing(true);setMessage('')
   try{
     await queue.current
     const draft=activeRef.current
     if(!draft||draft.finishedAt)return
     const reason=draft.mode==='timed'&&countDown(draft)===0?'timeout':why
     const final=finishDraft(draft)
     const attempt={...makeWritingAttempt(final),completionReason:reason}
     await putRecord('attempts',attempt)
     await putRecord('drafts',final)
     setCurrent(final);setScreen('finished')
     setAllDrafts(old=>[final,...old.filter(a=>a.id!==final.id)])
     setCompleteCount(c=>({...c,[draft.taskId]:(c[draft.taskId]||0)+1}))
     setSaveStatus('saved')
     window.dispatchEvent(new Event('ayda:progress-changed'))
   }catch{setMessage('Tamamlama kaydedilemedi. Taslağın silinmedi; yeniden deneyebilirsin.')}
   finally{submitLock.current=false;setFinishing(false)}
 }
 useEffect(()=>{
   if(screen!=='editing'||active?.mode!=='timed')return
   const tick=()=>{
     const stamp=Date.now();setNow(stamp)
     const d=activeRef.current
     if(d&&!d.finishedAt&&countDown(d,stamp)===0)void finish('timeout')
   }
   tick()
   const interval=window.setInterval(tick,1000)
   return()=>window.clearInterval(interval)
 },[screen,active?.id,active?.endsAt])

 const task=active?getWritingTask(active.taskId):undefined
 const mail=active?.email||''
 const emailIssues=useMemo(()=>task?analyzeEmail(mail,task):[],[mail,task])
 const formReview=useMemo(()=>task&&active?checkForm(task,active.form):[],[task,active?.form])
 const missing=formReview.filter(item=>item.status==='empty').length
 const mismatch=formReview.filter(item=>item.status==='review').length
 const locked=Boolean(active?.finishedAt||(active?.mode==='timed'&&countDown(active,now)===0))
 const clock=active?countDown(active,now):0
 const goodForms=formReview.filter(x=>x.status==='matches').length
 const issuesBySeverity=(severity:Issue['severity'])=>emailIssues.filter(x=>x.severity===severity)
 const returnToSets=()=>{setScreen('sets');setMessage('');setShowModel(false);setShowTeacher(false)}
 const refreshDraft=async()=>{
   const a=activeRef.current
   if(!a)return
   const next={...newDraft(a.taskId,a.mode),snapshots:[...a.snapshots]}
   try{
     await queue.current;await putRecord('drafts',next)
     setCurrent(next);setAllDrafts(old=>[next,...old.filter(d=>d.id!==next.id)])
     setScreen('editing');setNow(Date.now());setSection('form');setShowFormFeedback(false);setShowModel(false)
   }catch{setMessage('Yeni çalışma başlatılırken bir kayıt hatası oluştu.')}
 }
 const saveVersion=()=>{
   const a=activeRef.current
   if(!a||locked)return
   update(snapshotDraft(a))
 }
 const restoreVersion=()=>{
   const a=activeRef.current
   if(!a||!restoreChoice||locked)return
   update(restoreSnapshot(a,restoreChoice))
   setMessage('Seçilen taslak sürümü geri yüklendi. Otomatik kayıt yapılıyor.')
 }
 const insertCharacter=(value:string)=>{
   const textarea=textArea.current
   const current=activeRef.current
   if(!textarea||!current||locked)return
   const start=textarea.selectionStart??current.email.length
   const end=textarea.selectionEnd??start
   patch({email:current.email.slice(0,start)+value+current.email.slice(end)})
   window.requestAnimationFrame(()=>{textarea.focus();textarea.setSelectionRange(start+value.length,start+value.length)})
 }
 const fixes=(issue:Issue)=>{if(active&&!locked)patch({email:applyFix(active.email,issue)})}

 return <div className="sch-app">
  {message&&<div className="sch-warning" role="alert">{message}<button type="button" onClick={()=>setMessage('')} aria-label="Uyarıyı kapat">×</button></div>}
  {screen==='sets'&&<>
    <header className="sch-intro"><div><span className="sch-overline">AŞAMA 4 · SCHREIBEN</span><h2>Yaz, kontrol et, geliştir.</h2><p>ÖSD A1 biçimine uygun beş özgün form ve e-posta çalışması. İnternete veya yapay zekâ servisine ihtiyaç duymayan, kural tabanlı Türkçe açıklamalar.</p></div><div className="sch-hero-badge"><b>5</b><span>ÇALIŞMA</span></div></header>
    {!loading&&writingTasks.map((t,i)=><article className="sch-set" key={t.id}>
     <div className="sch-set-header"><span className="sch-number">{String(i+1).padStart(2,'0')}</span><div><h3>{t.title}</h3><p>{t.theme}</p></div><span className="sch-tag">20 DK</span></div>
     <div className="sch-mini"><span>10 form alanı</span><span>3 e-posta sorusu</span><span>Örnek çözüm</span></div>
     <div className="sch-actions">{(['practice','timed'] as WritingMode[]).map(choice=>{
       const existing=allDrafts.find(d=>d.id===draftId(t.id,choice))
       return <button key={choice} className={choice==='practice'?'sch-primary':'sch-outline'} onClick={()=>void choose(t,choice)}>
         {existing?'Aç · ':''}{choice==='practice'?'Serbest çalışma':'20 dk süreli çalışma'}
         {existing&&<small>{existing.finishedAt?'Tamamlandı':existing.email.trim()?'Taslak var':'Başlandı'}</small>}
       </button>
     })}</div>{completeCount[t.id]>0&&<small className="sch-complete-counter">Bu cihazda {completeCount[t.id]} tamamlanan deneme</small>}
    </article>)}
    {loading&&<p>Kaydedilen taslaklar yükleniyor…</p>}
    <aside className="sch-explain"><strong>Önemli fark</strong><p>Motor; belirli yazım, çekim, biçim ve form verisi hatalarını gösterebilir. Üç cevabın anlamını güvenilir biçimde değerlendiremez. <b>Sınav puanı veya geçme tahmini üretmez.</b></p></aside>
  </>}
  {screen==='editing'&&active&&task&&<>
   <div className="sch-top"><button className="sch-link" onClick={returnToSets}>‹ Çalışmalara dön</button><div className="sch-top-right"><small className={saveStatus==='error'?'sch-red':''}>{saveStatus==='saving'?'Kaydediliyor…':saveStatus==='saved'?'Cihaza kaydedildi':'Kayıt hatası'}</small>{active.mode==='timed'?<b className={'sch-clock '+(clock<120?'urgent':'')}>{showTime(clock)}</b>:<b className="sch-practice">SERBEST</b>}</div></div>
   <div className="sch-progress-name"><h2>{task.title}</h2><span>{wordCount(mail)} kelime</span></div>
   <nav className="sch-tabs" aria-label="Schreiben görevleri"><button aria-current={section==='form'?'step':undefined} className={section==='form'?'active':''} onClick={()=>setSection('form')}>Aufgabe 1 <small>Formular · 10 alan</small></button><button aria-current={section==='mail'?'step':undefined} className={section==='mail'?'active':''} onClick={()=>setSection('mail')}>Aufgabe 2 <small>E-Mail · 3 soru</small></button></nav>
   {section==='form'?<>
    <article className="sch-situation"><span className="sch-overline">AUFGABE 1 · FORMULAR</span><h3>{task.formTitle}</h3><p lang="de">{task.formScenario}</p></article>
    <div className="sch-form-grid">{task.fields.map((field,i)=>{
      const check=formReview.find(x=>x.fieldId===field.id)
      return <label className={'sch-field '+(showFormFeedback?'is-'+check?.status:'')} key={field.id}><span>{i+1}. {field.label}</span>
       {field.type==='select'?<select value={active.form[field.id]||''} disabled={locked} onChange={e=>patch({form:{...active.form,[field.id]:e.target.value}})}><option value="">Seçiniz</option>{field.choices?.map(item=><option key={item} value={item}>{item}</option>)}</select>:<input lang="de" autoComplete="off" disabled={locked} value={active.form[field.id]||''} placeholder="Almanca cevabın" onChange={e=>patch({form:{...active.form,[field.id]:e.target.value}})}/>}
       {field.helpTr&&<small>{field.helpTr}</small>}{showFormFeedback&&check&&<small className="sch-field-feedback">{check.detailTr}</small>}</label>
    })}</div>
    <div className="sch-inline-actions"><button className="sch-outline" onClick={()=>setShowFormFeedback(x=>!x)}>{showFormFeedback?'Kontrolü gizle':'Form alanlarını kontrol et'}</button><button className="sch-primary" onClick={()=>setSection('mail')}>E-posta görevine geç ›</button></div>
    {showFormFeedback&&<div className="sch-review-box"><strong>Bilgi kontrolü: {goodForms}/10 eşleşiyor · {missing} boş · {mismatch} farklı</strong><p>Bu sadece örnek metindeki verilerle karşılaştırmadır; ÖSD'nin resmî 5 puanlık değerlendirmesi değildir.</p></div>}
   </>:<>
    <article className="sch-situation"><span className="sch-overline">AUFGABE 2 · E-MAIL</span><h3>{task.emailFrom} schreibt dir:</h3><p lang="de">{task.incoming}</p><div className="sch-questions">{task.points.map((point,i)=><div key={point.id}><b>{i+1}.</b><span lang="de">{point.question}</span><small>{point.hintTr}</small></div>)}</div></article>
    <div className="sch-mail-composer"><div className="sch-mail-head"><strong>Deine Antwort an {task.emailTo}</strong><span>{wordCount(mail)} kelime · hedef ≈ 30</span></div><textarea ref={textArea} rows={10} lang="de" spellCheck={false} disabled={locked} value={mail} onChange={e=>patch({email:e.target.value})} placeholder={['Hallo '+task.emailTo+',','', '...','', 'Liebe Grüße','...'].join('\n')} aria-label="Almanca e-posta metnin"/></div>
    <div className="sch-keyboard"><span>Almanca karakterler</span>{['ä','ö','ü','Ä','Ö','Ü','ß'].map(x=><button type="button" disabled={locked} key={x} onClick={()=>insertCharacter(x)}>{x}</button>)}</div>
    <div className="sch-check-summary"><div><strong>Yerel yazım kontrolü</strong><p>Otomatik, yalnız cihazda. Değişiklikleri sadece sen onaylarsın.</p></div><span>{issuesBySeverity('error').length} hata · {issuesBySeverity('suggestion').length} öneri · {issuesBySeverity('info').length} bilgi</span></div>
    {mail&&<div className="sch-preview"><strong>Metinde işaretlenenler</strong><div className="sch-highlight" lang="de">{getHighlightSpans(mail,emailIssues).map((part,i)=>part.issue?<mark key={i} title={part.issue.detailTr}>{part.text}</mark>:<span key={i}>{part.text}</span>)}</div></div>}
    <div className="sch-issues">{emailIssues.map((issue,i)=><article className={'sch-issue '+issue.severity} key={issue.id+'-'+i}><div className="sch-issue-head"><span>{issue.severity==='error'?'HATA':issue.severity==='suggestion'?'ÖNERİ':'BİLGİ'}</span><strong>{issue.titleTr}</strong></div><p>{issue.detailTr}</p>{issue.safeToApply&&issue.replacement!==undefined&&<button className="sch-fix" onClick={()=>fixes(issue)} disabled={locked}>Düzelt: {issue.replacement}</button>}</article>)}</div>
    <div className="sch-hint-bank"><strong>Hazır A1 kalıpları</strong><div>{['Hallo '+task.emailTo+',','Vielen Dank für deine Nachricht.','Ich komme gern.','Ich habe am Samstag Zeit.','Liebe Grüße'].map(phrase=><button key={phrase} disabled={locked} onClick={()=>patch({email:(mail?mail.trimEnd()+'\n':'')+phrase})}>{phrase} <span>+</span></button>)}</div><p>Kalıpları kendi cevabına uygun şekilde düzenle; sırf kalıp eklenmesi görev maddelerinin karşılandığı anlamına gelmez.</p></div>
   </>}
   <div className="sch-save-panel"><div><strong>Taslak sürümleri</strong><p>Tüm değişiklikler cihazda otomatik kaydedilir. İstersen bir sürümü ayrıca sakla (son 5 sürüm).</p></div><button disabled={locked} className="sch-outline" onClick={saveVersion}>+ Sürümü sakla</button>
    {active.snapshots.length>0&&<div className="sch-revisions"><select aria-label="Önceki sürüm" value={restoreChoice} onChange={e=>setRestoreChoice(e.target.value)} disabled={locked}><option value="">Önceki sürümü seç</option>{active.snapshots.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select><button className="sch-outline" onClick={restoreVersion} disabled={!restoreChoice||locked}>Geri yükle</button></div>}</div>
   <div className="sch-bottom-actions"><button className="sch-outline" onClick={()=>setShowModel(x=>!x)}>{showModel?'Örnek cevabı gizle':'Örnek cevabı göster'}</button><button className="sch-primary" onClick={()=>void finish('submitted')} disabled={finishing}>{finishing?'Kaydediliyor…':'Çalışmayı tamamla ✓'}</button></div>
   {showModel&&<div className="sch-example"><strong>Örnek Form + E-Posta</strong><p>{task.modelFormNote}</p><div className="sch-model-fields">{task.fields.map(field=><span key={field.id}><b>{field.label}: </b>{field.answer}</span>)}</div><pre lang="de">{task.modelEmail}</pre><small>Bu bir örnek yanıt; aynı anlama gelen farklı A1 cümleleri de doğru olabilir.</small></div>}
   <div className="sch-teacher"><strong>Gerçek öğretmen kontrolü</strong><p>Yerel motor dilin tamamını veya görev anlamını denetleyemez. İnsan öğretmenle ayrıntılı inceleme daha sonraki aşamanın hizmetidir.</p><button onClick={()=>setShowTeacher(x=>!x)}>Öğretmen kontrolü bilgisi</button>{showTeacher&&<p className="sch-service-note">DEMO: Talep gönderme ve ödeme henüz açık değil. Metnin herhangi bir sunucuya gönderilmedi.</p>}</div>
  </>}
  {screen==='finished'&&active&&task&&<>
   <button className="sch-link" onClick={returnToSets}>‹ Çalışmalara dön</button>
   <section className="sch-finished"><span className="sch-overline">YEREL DEMO KAYDI</span><h2>{task.title} · Tamamlandı</h2><p>Form ve e-posta taslağın bu cihazda saklandı. Otomatik sınav puanı verilmedi; metni öğretmen değerlendirmelidir.</p><div><span><b>{Object.values(active.form).filter(Boolean).length}</b> / 10 doldurulan alan</span><span><b>{wordCount(active.email)}</b> kelime</span><span>{active.mode==='timed'?'Süreli çalışma':'Serbest çalışma'}</span></div></section>
   <article className="sch-preview-finished"><h3>Kaydedilen e-posta</h3><pre lang="de">{active.email||'(Metin yazılmadı)'}</pre><h3>Form yanıtları</h3><div className="sch-model-fields">{task.fields.map(f=><span key={f.id}><b>{f.label}: </b>{active.form[f.id]||'—'}</span>)}</div></article>
   <div className="sch-actions"><button className="sch-outline" onClick={()=>setShowModel(x=>!x)}>{showModel?'Örnek çözümü gizle':'Örnek çözümü göster'}</button><button className="sch-primary" onClick={()=>void refreshDraft()}>Yeni denemeye başla</button></div>
   {showModel&&<div className="sch-example"><strong>Özgün örnek yanıt</strong><pre lang="de">{task.modelEmail}</pre><p>{task.modelFormNote}</p></div>}
  </>}
 </div>
}
