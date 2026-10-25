import { useEffect, useRef, useState } from 'react'
import { deleteRecord, listRecords, putRecord } from '../../storage/db'
import { hearingSets, getHearingSet, matchesAnswer, type HearingQuestion, type HearingSet, type Part, type Mode } from './content'
import Picture from '../lesen/Pictures'
import {
 canReplay, completePlayback, countResults, draftId, finishAttempt, formatTime, hasPendingPlayback,
 makeAttempt, registerPlay, remaining, rememberPlayback, selectedValue, updateAnswer, PLAY_LIMIT,
 type HearingAttempt
} from './logic'
import './hoeren.css'

type Screen = 'sets' | 'taking' | 'result'
const isHearing=(a:HearingAttempt)=>a?.module==='hoeren'&&Boolean(getHearingSet(a.taskId))
const allQuestions=(s:HearingSet)=>s.units.flatMap(u=>u.questions)

export default function HoerenView() {
 const [screen,setScreen]=useState<Screen>('sets')
 const [active,setActive]=useState<HearingAttempt|null>(null)
 const activeRef=useRef<HearingAttempt|null>(null)
 const [drafts,setDrafts]=useState<HearingAttempt[]>([])
 const [history,setHistory]=useState<HearingAttempt[]>([])
 const [saving,setSaving]=useState(false)
 const [error,setError]=useState('')
 const [audioError,setAudioError]=useState('')
 const [playing,setPlaying]=useState(false)
 const [showTranscript,setShowTranscript]=useState(false)
 const [now,setNow]=useState(Date.now)
 const [busy,setBusy]=useState(false)
 const [loading,setLoading]=useState(true)
 const audioRef=useRef<HTMLAudioElement|null>(null)
 const queue=useRef<Promise<void>>(Promise.resolve())
 const previousTime=useRef(0)
 const preventFinish=useRef(false)
 const currentPart=useRef<Part|0>(0)

 const setAttempt=(a:HearingAttempt|null)=>{activeRef.current=a;setActive(a)}
 const listAll=async()=>{
   const rows=(await listRecords<HearingAttempt>('attempts')).filter(isHearing)
   setDrafts(rows.filter(a=>!a.finishedAt).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)))
   setHistory(rows.filter(a=>a.finishedAt).sort((a,b)=>(b.finishedAt||'').localeCompare(a.finishedAt||'')))
 }
 useEffect(()=>{
   let mounted=true
   listRecords<HearingAttempt>('attempts').then(rows=>{
     if(!mounted)return
     const ours=rows.filter(isHearing)
     setDrafts(ours.filter(a=>!a.finishedAt).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)))
     setHistory(ours.filter(a=>a.finishedAt).sort((a,b)=>(b.finishedAt||'').localeCompare(a.finishedAt||'')))
   }).catch(()=>{if(mounted)setError('Cihaz kayıtlarına erişilemiyor. Depolama ayarlarını kontrol et.')})
     .finally(()=>{if(mounted)setLoading(false)})
   return()=>{mounted=false}
 },[])
 const save=(a:HearingAttempt)=>{
   setAttempt(a)
   setSaving(true)
   queue.current=queue.current.catch(()=>{}).then(()=>putRecord('attempts',a))
     .catch(()=>setError('Kayıt başarısız. Bu ekrandan çıkmadan depolama iznini kontrol et.'))
     .finally(()=>setSaving(false))
 }
 const change=(f:(a:HearingAttempt)=>HearingAttempt)=>{
   const curr=activeRef.current
   if(curr&&!curr.finishedAt&&!preventFinish.current)save(f(curr))
 }
 const start=async(set:HearingSet,mode:Mode)=>{
   setError('');setAudioError('')
   const previous=drafts.find(a=>a.id===draftId(set.id,mode))
   if(previous){
     setAttempt(previous);setNow(Date.now());setScreen('taking');setShowTranscript(false)
     return
   }
   const a=makeAttempt(set,mode)
   try{
     await putRecord('attempts',a)
     setAttempt(a);setDrafts(xs=>[a,...xs]);setNow(Date.now());setScreen('taking')
   }catch{setError('Yeni çalışmayı kaydedemedik. Tarayıcıda depolama alanı gerekir.')}
 }
 const finish=async(reason:'submitted'|'timeout')=>{
   if(preventFinish.current||!activeRef.current)return
   preventFinish.current=true
   setBusy(true);setError('')
   try{
     audioRef.current?.pause()
     await queue.current
     const a=activeRef.current!
     const final=finishAttempt(a,a.mode==='exam'&&remaining(a)===0?'timeout':reason)
     await putRecord('attempts',final)
     await deleteRecord('attempts',a.id)
     setAttempt(final);setScreen('result');setShowTranscript(false)
     await listAll()
     window.dispatchEvent(new Event('ayda:progress-changed'))
   }catch{
     setError('Sonuç kaydedilemedi; yeniden dene. Cevapların henüz silinmedi.')
   }finally{preventFinish.current=false;setBusy(false)}
 }
 useEffect(()=>{
   if(screen!=='taking'||active?.mode!=='exam')return
   const tick=()=>{
     const timestamp=Date.now()
     setNow(timestamp)
     const a=activeRef.current
     if(a&&!a.finishedAt&&remaining(a,timestamp)===0)void finish('timeout')
   }
   tick()
   const timer=window.setInterval(tick,1000)
   return()=>window.clearInterval(timer)
 },[screen,active?.id,active?.endsAt,active?.mode])
 const set=active?getHearingSet(active.taskId):undefined
 const questions=set?allQuestions(set):[]
 const q=active?questions[active.currentIndex]:undefined
 const unit=q?set?.units.find(u=>u.part===q.part):undefined
 const answer=q&&active?selectedValue(active,q.id):''
 const result=set&&active?countResults(active,set):undefined
 const part=q?.part??1
 const plays=active?.plays[part]||0
 const done=active?.completedPlays?.[part]||0
 const canPlay=active?canReplay(active,part):false

 useEffect(()=>{
   if(!unit)return
   if(currentPart.current!==unit.part){
     audioRef.current?.pause()
     currentPart.current=unit.part
     setPlaying(false);setAudioError('');setShowTranscript(false);previousTime.current=0
   }
 },[unit?.part,active?.taskId])
 useEffect(()=>{
   if(screen!=='taking')return
   const onVisibility=()=>{
     if(document.hidden&&activeRef.current?.mode==='exam'&&!audioRef.current?.paused)
       audioRef.current?.pause()
   }
   document.addEventListener('visibilitychange',onVisibility)
   return()=>document.removeEventListener('visibilitychange',onVisibility)
 },[screen])
 const saveAudioPosition=(force=false)=>{
   const a=activeRef.current, audio=audioRef.current
   if(!a||!audio||a.mode==='practice'||!hasPendingPlayback(a,part))return
   if(!force&&Math.abs(audio.currentTime-previousTime.current)<3)return
   previousTime.current=audio.currentTime
   change(old=>rememberPlayback(old,part,audio.currentTime))
 }
 const playAudio=()=>{
   const a=activeRef.current,audio=audioRef.current
   if(!a||!audio||busy)return
   setAudioError('')
   if(a.mode==='exam'&&!canReplay(a,part))return
   if(!audio.paused)return
   const resume=a.mode==='exam'&&hasPendingPlayback(a,part)
   if(resume){
     const position=a.audioPositions?.[part]||0
     if(Number.isFinite(audio.duration)&&audio.duration>position+0.5)audio.currentTime=position
   }else audio.currentTime=0
   setBusy(true)
   // play() must be invoked synchronously within the user gesture on mobile.
   const promise=audio.play()
   Promise.resolve(promise).then(()=>{
     if(!resume&&a.mode==='exam')change(old=>registerPlay(old,part))
     setPlaying(true)
   }).catch(()=>{
     setAudioError('Ses başlatılamadı. İnternet bağlantısını, tarayıcı ses iznini ve dosya yüklenmesini kontrol et.')
   }).finally(()=>setBusy(false))
 }
 const pauseAudio=()=>{
   const audio=audioRef.current
   if(!audio)return
   audio.pause()
   saveAudioPosition(true)
   setPlaying(false)
 }
 const onEnded=()=>{
   setPlaying(false)
   if(activeRef.current?.mode==='exam')
     change(a=>completePlayback(a,part))
 }
 const back=()=>{
   audioRef.current?.pause()
   void listAll()
   setScreen('sets');setAudioError('');setShowTranscript(false)
 }
 const goto=(index:number)=>{audioRef.current?.pause();setPlaying(false);change(a=>({...a,currentIndex:index,updatedAt:new Date().toISOString()}))}
 const sendAnswer=(val:string)=>{if(q)change(a=>updateAnswer(a,q.id,val))}
 const statusLabel=active?.mode==='exam' ? (hasPendingPlayback(active,part)?'Yarım kalan oynatmaya devam edebilirsin': (PLAY_LIMIT[part]-plays)+' oynatma hakkı kaldı') : 'Çalışma modunda tekrar sınırsız'
 return <div className="hoeren-app">
 {error&&<p role="alert" className="hoeren-error">{error}</p>}
 {screen==='sets'&&<>
   <header className="hoeren-intro"><div><span className="hoeren-kicker">AŞAMA 3 · HÖREN</span><h2>Dinle. Anla. Cevapla.</h2><p>İki özgün A1 dinleme seti ve altı gerçek ses dosyası. Sesler çevrimdışı üretilmiş sentetik Almanca konuşmalardır; resmî ÖSD kayıtları değildir.</p></div><div className="hoeren-intro-number"><strong>30</strong><small>SORU</small></div></header>
   {!loading&&hearingSets.map((set,index)=><article className="hoeren-set" key={set.id}>
     <div className="hoeren-set-head"><span className="hoeren-set-index">0{index+1}</span><div><h3>{set.title}</h3><p>{set.subtitle}</p></div><span className="hoeren-count">15 SORU</span></div>
     <div className="hoeren-part-list"><span>5 görsel eşleştirme</span><span>5 kısa not</span><span>5 röportaj</span></div>
     <div className="hoeren-set-actions">{(['practice','exam'] as const).map(mode=>{
       const previous=drafts.find(a=>a.id===draftId(set.id,mode))
       return <button key={mode} type="button" className={mode==='practice'?'hoeren-primary':'hoeren-outline'} onClick={()=>void start(set,mode)}>{previous?'Devam et · ':''}{mode==='practice'?'Çalışma modu':'~10 dk sınav modu'}{previous&&<small>{previous.answers.filter(x=>String(x.value).trim()).length}/15 cevap</small>}</button>
     })}</div>
   </article>)}
   {loading&&<p>Kaydedilmiş çalışmalar yükleniyor…</p>}
   {history.length>0&&<section className="hoeren-history"><h3>Önceki sonuçların</h3>{history.slice(0,8).map(x=><button key={x.id} onClick={()=>{setAttempt(x);setScreen('result')}}><span><strong>{getHearingSet(x.taskId)?.title}</strong><small>{x.mode==='exam'?'Sınav':'Çalışma'} · {new Date(x.finishedAt!).toLocaleDateString('tr-TR')}</small></span><b>{x.correctCount}/{x.questionCount}</b></button>)}</section>}
   <div className="hoeren-guidance"><strong>Gerçek dinleme nasıl çalışır?</strong><p>Sınavda Aufgabe 1 ve 3 birer kez, Aufgabe 2 en fazla iki kez dinlenir. Başlamadan önce soruları incele. Mobil tarayıcıda sesi açmak için dokunmalısın. Resmî ÖSD puanı yerine gerçek doğru sayısı gösterilir.</p></div>
 </>}
 {screen==='taking'&&set&&q&&unit&&active&&result&&<>
   <div className="hoeren-session-head"><button className="hoeren-link" onClick={back}>‹ Setlere dön</button><div className="hoeren-session-status"><small>{error?'Kayıt sorunu':saving?'Kaydediliyor':'Cihazda kayıt'}</small>{active.mode==='exam'?<strong className={'hoeren-clock '+(remaining(active,now)<60?'danger':'')}>{formatTime(remaining(active,now))}</strong>:<b>ÇALIŞMA</b>}</div></div>
   <div className="hoeren-status-bar"><strong>{set.title}</strong><span>{result.answered}/15 yanıt</span></div><div className="hoeren-bar"><span style={{width:(result.answered/15*100)+'%'}}/></div>
   <nav className="hoeren-tabs" aria-label="Dinleme görevleri">{set.units.map(u=><button key={u.part} className={part===u.part?'selected':''} onClick={()=>goto(questions.findIndex(ques=>ques.part===u.part))}>Aufgabe {u.part}<small>{u.part===1?'Resimler':u.part===2?'Bilgiler':'Röportajlar'}</small></button>)}</nav>
   <section className="hoeren-audio-panel">
     <div><span className="hoeren-kicker">ORİJİNAL AYDA DEMO SESİ</span><h2>{unit.label} · {unit.part===1?'Görseller':unit.part===2?'Not tutma':'Röportajlar'}</h2><p>{unit.descriptionTr}</p><small lang="de">{unit.instructionDe}</small></div>
     <div className="hoeren-player">
       <audio key={unit.audio} ref={audioRef} preload="metadata" src={unit.audio} controls={active.mode==='practice'}
         onPlay={()=>setPlaying(true)}
         onPause={()=>{setPlaying(false);saveAudioPosition(true)}}
         onTimeUpdate={()=>saveAudioPosition()}
         onEnded={onEnded}
         onError={()=>{setPlaying(false);setAudioError('Ses dosyası yüklenemedi. Bağlantıyı kontrol edip yeniden dene. Oynatma kaydın silinmedi.')}}
       >
         Tarayıcın ses oynatmayı desteklemiyor.
       </audio>
       {active.mode==='exam'&&<div className="hoeren-player-buttons">
         {!playing?<button className="hoeren-primary" disabled={!canPlay||busy} onClick={playAudio} type="button">{hasPendingPlayback(active,part)?'▶ Kaldığın sesten devam':'▶ Sesi başlat'}</button>
          :<button className="hoeren-outline" onClick={pauseAudio} type="button">Ⅱ Duraklat</button>}
         <span>{statusLabel}</span>
       </div>}
       {active.mode==='practice'&&<p>Ses çalardaki başlat/duraklat ve zaman çizelgesini kullanarak istediğin kadar dinleyebilirsin.</p>}
       {audioError&&<p role="alert" className="hoeren-error">{audioError}</p>}
       {active.mode==='exam'&&<p className="hoeren-limit-note">Tarayıcı arka plana geçerse ses duraklatılır. Aynı oynatmayı sürdürebilirsin; yenileme sonrası kalan dinleme hakkın korunur. Yeni oynatma için sınav hakkı aşılmaz.</p>}
     </div>
     {active.mode==='practice'&&<div className="hoeren-transcript"><button type="button" aria-expanded={showTranscript} onClick={()=>setShowTranscript(x=>!x)}>{showTranscript?'− Transkripti gizle':'+ Almanca transkripti göster'}</button>{showTranscript&&<p lang="de">{unit.transcript}</p>}</div>}
   </section>
   <div className="hoeren-question-heading"><div><span className="hoeren-kicker">AUFGABE {part} · {q.number}/5</span><h3>{q.kind==='picture'?'Uygun resmi işaretle':q.kind==='fill'?'Duyduğunu yaz':'Doğru seçeneği bul'}</h3></div><button className={active.flaggedQuestionIds.includes(q.id)?'hoeren-star marked':'hoeren-star'} onClick={()=>change(a=>({...a,flaggedQuestionIds:a.flaggedQuestionIds.includes(q.id)?a.flaggedQuestionIds.filter(id=>id!==q.id):[...a.flaggedQuestionIds,q.id],updatedAt:new Date().toISOString()}))}>{active.flaggedQuestionIds.includes(q.id)?'★ İşaretlendi':'☆ İşaretle'}</button></div>
   <div className="hoeren-question"><p className="hoeren-prompt" lang="de">{q.prompt}</p>
   {q.kind==='picture'&&<div className="hoeren-pictures" role="radiogroup" aria-label="Doğru görseli seç">{unit.pictures?.map(img=><label key={img.value} className={'hoeren-picture '+(answer===img.value?'checked':'')}><input type="radio" name={'hoeren-'+q.id} checked={answer===img.value} onChange={()=>sendAnswer(img.value)} aria-label={'Bild '+img.value+', '+img.alt}/><Picture kind={img.kind}/><strong>Bild {img.value}</strong></label>)}</div>}
   {q.kind==='fill'&&<label className="hoeren-fill"><span>Cevabın</span><input lang="de" value={answer} onChange={event=>sendAnswer(event.target.value)} placeholder="Almanca duyduğun bilgiyi yaz" autoComplete="off" spellCheck={false} type="text"/><small>Rakam ya da Almanca kelime yazabilirsin. Desteklenen varyantlar kontrol edilir.</small></label>}
   {q.kind==='choice'&&<div className="hoeren-choices" role="radiogroup" aria-label="Bir cevap seç">{q.options?.map(opt=><label className={answer===opt.value?'checked':''} key={opt.value}><input type="radio" name={'hoeren-'+q.id} value={opt.value} checked={answer===opt.value} onChange={()=>sendAnswer(opt.value)}/><b>{opt.value.toUpperCase()}</b>{opt.text}</label>)}</div>}
   {active.mode==='practice'&&answer.trim()&&<div role="status" className={'hoeren-feedback '+(matchesAnswer(q,answer)?'good':'review')}><strong>{matchesAnswer(q,answer)?'✓ Doğru cevap':'Tekrar dinleyip kontrol et'}</strong><p>{!matchesAnswer(q,answer)&&'Beklenen: '+(q.options?.find(x=>x.value===q.answer)?.text||q.answer)+'. '}{q.explanationTr}</p></div>}
   {active.mode==='exam'&&<small className="hoeren-exam-message">Sınav modunda açıklama ve transkript yalnızca tamamlandıktan sonra görünür.</small>}
   </div>
   <div className="hoeren-move"><button className="hoeren-outline" disabled={active.currentIndex===0} onClick={()=>goto(active.currentIndex-1)}>‹ Önceki</button>{active.currentIndex===questions.length-1?<button className="hoeren-primary" disabled={busy} onClick={()=>void finish('submitted')}>Bitir ve sonucu gör</button>:<button className="hoeren-primary" onClick={()=>goto(active.currentIndex+1)}>Sonraki ›</button>}</div>
   <div className="hoeren-question-map-label"><strong>Sorular</strong><small>Yeşil: cevaplandı · Yıldız: işaretli</small></div><div className="hoeren-question-map">{questions.map((item,i)=><button key={item.id} className={(active.currentIndex===i?'current ':'')+(selectedValue(active,item.id).trim()?'answered ':'')+(active.flaggedQuestionIds.includes(item.id)?'flagged':'')} onClick={()=>goto(i)} aria-label={'Soru '+(i+1)} aria-current={active.currentIndex===i?'step':undefined}>{i+1}{active.flaggedQuestionIds.includes(item.id)?'★':''}</button>)}</div>
   <div className="hoeren-submit"><small>{result.unanswered} soruya cevap verilmedi</small><button disabled={busy} onClick={()=>void finish('submitted')}>Çalışmayı tamamla ve kaydet</button></div>
 </>}
 {screen==='result'&&active&&set&&result&&<>
   <button className="hoeren-link" onClick={back}>‹ Setlere dön</button>
   <div className="hoeren-result"><span className="hoeren-kicker">{active.mode==='exam'?'SINAV MODU':'ÇALIŞMA MODU'}</span><h2>{active.completionReason==='timeout'?'Süre doldu; cevaplar kaydedildi.':'Çalışma tamamlandı.'}</h2><div className="hoeren-big-score"><strong>{result.correct}</strong><span>/ {result.total} doğru</span></div><p>Bu sonuç yalnızca özgün demo sorularındaki doğru cevap sayısıdır; resmî ÖSD notu değildir.</p><div className="hoeren-score-grid"><span><b>{result.correct}</b> doğru</span><span><b>{result.wrong}</b> yanlış</span><span><b>{result.unanswered}</b> boş</span></div><div className="hoeren-task-scores">{set.units.map(u=><div key={u.part}><small>{u.label}</small><strong>{u.questions.filter(q=>matchesAnswer(q,selectedValue(active,q.id))).length} / 5</strong></div>)}</div></div>
   {set.units.map(u=><section className="hoeren-result-section" key={u.part}><h3>{u.label} · Cevap ve transkript</h3><details><summary>Özgün Almanca transkripti aç</summary><p lang="de">{u.transcript}</p></details>{u.questions.map(q=>{const submitted=selectedValue(active,q.id),correct=matchesAnswer(q,submitted);return <article className="hoeren-review" key={q.id}><div><span>{q.number}. soru</span><b className={!submitted?'neutral':correct?'good':'bad'}>{!submitted?'Boş':correct?'Doğru':'Yanlış'}</b></div><strong lang="de">{q.prompt}</strong><p>Senin cevabın: <b>{q.options?.find(o=>o.value===submitted)?.text||submitted||'—'}</b></p><p>Doğru cevap: <b>{q.options?.find(o=>o.value===q.answer)?.text||q.answer}</b></p><small>{q.explanationTr}</small></article>})}</section>)}
   <button className="hoeren-primary hoeren-full" onClick={back}>Yeni çalışma seç</button>
 </>}
 </div>
}

export function HoerenMistakes() {
 const [wrong,setWrong]=useState<{attempt:HearingAttempt;question:HearingQuestion;answer:string}[]>([])
 const [error,setError]=useState('')
 const [loading,setLoading]=useState(true)
 useEffect(()=>{
  let mounted=true
  listRecords<HearingAttempt>('attempts').then(rows=>{
   if(!mounted)return
   const items=rows.filter(a=>isHearing(a)&&a.finishedAt).sort((a,b)=>(b.finishedAt||'').localeCompare(a.finishedAt||'')).flatMap(a=>{
    const set=getHearingSet(a.taskId)
    return (set?.units.flatMap(u=>u.questions)||[]).filter(q=>selectedValue(a,q.id).trim()&&!matchesAnswer(q,selectedValue(a,q.id)))
      .map(q=>({attempt:a,question:q,answer:selectedValue(a,q.id)}))
   })
   setWrong(items)
  }).catch(()=>setError('Dinleme geçmişi okunamadı.')).finally(()=>{if(mounted)setLoading(false)})
  return()=>{mounted=false}
 },[])
 return <section className="hoeren-app hoeren-mistakes"><h2>Hören · Yanlışlarım</h2>{error&&<p role="alert">{error}</p>}{loading?<p>Kayıtlar yükleniyor…</p>:wrong.length===0?<div className="hoeren-guidance"><p>Hören bölümünde henüz yanlış cevap kaydın bulunmuyor.</p></div>:wrong.map((item,i)=><div className="hoeren-review" key={item.attempt.id+'-'+item.question.id+'-'+i}><div><span>{getHearingSet(item.attempt.taskId)?.title} · Aufgabe {item.question.part}</span><b className="bad">{new Date(item.attempt.finishedAt!).toLocaleDateString('tr-TR')}</b></div><strong lang="de">{item.question.prompt}</strong><p>Senin cevabın: <b>{item.question.options?.find(o=>o.value===item.answer)?.text||item.answer}</b></p><p>Doğru: <b>{item.question.options?.find(o=>o.value===item.question.answer)?.text||item.question.answer}</b></p><small>{item.question.explanationTr}</small></div>)}</section>
}
