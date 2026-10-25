import {useEffect,useRef,useState} from 'react'
import {listRecords,putRecord,readRecord} from '../../storage/db'
import Picture from '../lesen/Pictures'
import {analyzeEmail,checkForm,wordCount} from '../schreiben/rules'
import {phraseBank} from '../sprechen/content'
import SceneArt from '../sprechen/SceneArt'
import {PARTS,PART_LABELS,answerExam,completePart,examCounts,finishHearingPlayback,
 hearingCanPlay,hearingPending,hearingResult,newExam,pauseExam,playHearing,readingResult,remaining,
 rememberHearing,resumeExam,selectedSet,suggestedRetakes,timeText,type ExamPart,type ExamRun,type Three} from './model'
import './exam.css'

type View='list'|'session'|'report'
const isExam=(r:ExamRun)=>r?.kind==='integrated-exam'&&r.version===1
const mimeChoices=['audio/webm;codecs=opus','audio/mp4','audio/webm','audio/ogg;codecs=opus']
export default function ExamView(){
 const [view,setView]=useState<View>('list')
 const [list,setList]=useState<ExamRun[]>([])
 const [active,setActive]=useState<ExamRun|null>(null)
 const ref=useRef<ExamRun|null>(null)
 const [error,setError]=useState('')
 const [loading,setLoading]=useState(true)
 const [saving,setSaving]=useState(false)
 const [finishing,setFinishing]=useState(false)
 const [now,setNow]=useState(Date.now)
 const [showAudioError,setShowAudioError]=useState('')
 const [isPlaying,setIsPlaying]=useState(false)
 const [recording,setRecording]=useState(false)
 const [recordBusy,setRecordBusy]=useState(false)
 const [recordUrl,setRecordUrl]=useState('')
 const [recordSeconds,setRecordSeconds]=useState(0)
 const [phraseOpen,setPhraseOpen]=useState(false)
 const [hintOpen,setHintOpen]=useState(false)
 const audio=useRef<HTMLAudioElement|null>(null)
 const media=useRef<MediaRecorder|null>(null)
 const mic=useRef<MediaStream|null>(null)
 const chunks=useRef<Blob[]>([])
 const startAt=useRef(0)
 const queue=useRef<Promise<void>>(Promise.resolve())
 const stopPromise=useRef<Promise<void>|null>(null)
 const lock=useRef(false)
 const lastAudioSave=useRef(0)
 const mounted=useRef(true)
 const setRun=(s:ExamRun|null)=>{ref.current=s;setActive(s)}
 const refresh=async()=>{
   const rows=await listRecords<ExamRun>('examSessions')
   setList(rows.filter(isExam).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)))
 }
 useEffect(()=>{
  mounted.current=true
  refresh().catch(()=>setError('Sınav geçmişi okunamadı. Yerel depolama iznini kontrol et.'))
   .finally(()=>{if(mounted.current)setLoading(false)})
  return()=>{mounted.current=false;audio.current?.pause();if(media.current?.state==='recording')media.current.stop();mic.current?.getTracks().forEach(t=>t.stop())}
 },[])
 const save=(next:ExamRun)=>{
   setRun(next);setSaving(true)
   queue.current=queue.current.catch(()=>{}).then(()=>putRecord('examSessions',next))
    .then(()=>{if(mounted.current)setList(rows=>[next,...rows.filter(r=>r.id!==next.id)])})
    .catch(()=>setError('Değişiklik kaydedilemedi. Tarayıcıyı kapatmadan depolamayı kontrol et.'))
    .finally(()=>{if(mounted.current)setSaving(false)})
 }
 const edit=(fn:(s:ExamRun)=>ExamRun)=>{
   const s=ref.current
   if(s&&s.status==='active'&&!lock.current)save(fn(s))
 }
 const start=async(i:0|1)=>{
  setError('')
  const session=newExam(i)
  try{await putRecord('examSessions',session);setRun(session);setList(rows=>[session,...rows]);setView('session');setNow(Date.now())}
  catch{setError('Deneme oluşturulamadı; IndexedDB erişimi gerekli.')}
 }
 const open=(s:ExamRun)=>{setRun(s);setView(s.status==='finished'?'report':'session');setNow(Date.now());setHintOpen(false)}
 const stopAudio=()=>{
   const s=ref.current,a=audio.current
   if(a&&!a.paused){
     a.pause();setIsPlaying(false)
     if(s&&s.part==='hoeren'&&hearingPending(s,s.hearing.part)){
       const p=s.hearing.part;save(rememberHearing(s,p,a.currentTime))
     }
   }
 }
 const afterRecord=async()=>{
   const r=media.current
   if(r?.state==='recording')r.stop()
   if(stopPromise.current)await stopPromise.current
 }
 const exit=()=>{if(recording||recordBusy)return;stopAudio();setRun(null);setView('list');setError('');void refresh().catch(()=>{})}
 const pause=async()=>{
   const s=ref.current
   if(!s||s.status!=='active'||recording||recordBusy)return
   stopAudio()
   const next=pauseExam(s)
   save(next)
 }
 const resume=()=>{
   const s=ref.current
   if(s?.status==='paused')save(resumeExam(s))
 }
 const advance=async(force=false)=>{
   if(lock.current||!ref.current||ref.current.status!=='active'||saving)return
   const s=ref.current,expired=remaining(s)===0
   if(!force&&!expired){
     const name=s.part==='sprechen'&&s.speaking.phase==='prep'?'hazırlık süresi':PART_LABELS[s.part]
     if(!window.confirm(name+' bölümünü bitirip sonraki aşamaya geçmek istiyor musun? Önceki bölüme geri dönülemez.'))return
   }
   lock.current=true;setFinishing(true)
   try{
     if(recording)await afterRecord()
     stopAudio()
     await queue.current
     const latest=ref.current!
     const next=completePart(latest)
     await putRecord('examSessions',next)
     setRun(next);setList(xs=>[next,...xs.filter(x=>x.id!==next.id)])
     setNow(Date.now());setIsPlaying(false);setPhraseOpen(false);setHintOpen(false)
     if(next.status==='finished'){setView('report');window.dispatchEvent(new Event('ayda:progress-changed'))}
   }catch{setError('Bölüm geçişi kaydedilemedi; yanıtların korundu. Tekrar deneyebilirsin.')}
   finally{lock.current=false;setFinishing(false)}
 }
 useEffect(()=>{
  if(view!=='session'||active?.status!=='active')return
  const tick=()=>{
   const n=Date.now();setNow(n)
   const s=ref.current
   if(s?.status==='active'&&remaining(s,n)===0)void advance(true)
  }
  tick();const timer=window.setInterval(tick,1000)
  return()=>window.clearInterval(timer)
 },[view,active?.id,active?.status,active?.part,active?.sections[active.part]?.endsAt,active?.speaking.phase])
 useEffect(()=>{
  if(!recording)return
  const i=window.setInterval(()=>{
    const elapsed=Math.floor((Date.now()-startAt.current)/1000)
    setRecordSeconds(elapsed)
    if(elapsed>=120&&media.current?.state==='recording')media.current.stop()
  },500)
  return()=>window.clearInterval(i)
 },[recording])
 const currentPart=active?.part||'lesen'
 const sets=active?selectedSet(active):undefined
 const rSection=active?.sections.lesen
 const hSection=active?.sections.hoeren
 const lesenQuestion=sets&&rSection?sets.lesen.questions[rSection.questionIndex]:undefined
 const lesenAnswer=lesenQuestion?rSection?.answers[lesenQuestion.id]||'':''
 const hQuestions=sets?.hoeren.units.flatMap(unit=>unit.questions)||[]
 const hörenQuestion=hSection?hQuestions[hSection.questionIndex]:undefined
 const hörUnit=hörenQuestion?sets?.hoeren.units.find(u=>u.part===hörenQuestion.part):undefined
 const hörenAnswer=hörenQuestion?hSection?.answers[hörenQuestion.id]||'':''
 const hCurrentPart=hörUnit?.part||1
 const scene=sets?.sprechen.scenes.find(s=>s.id===active?.speaking.sceneId)
 const rr=active?readingResult(active):undefined
 const hr=active?hearingResult(active):undefined
 const formResult=active&&sets?checkForm(sets.schreiben,active.writing.form):[]
 const wordNum=active?wordCount(active.writing.email):0
 const checklist=active?examCounts(active):undefined
 const frozen=active?.status==='paused'
 const oralPrep=active?.part==='sprechen'&&active.speaking.phase==='prep'
 useEffect(()=>{
  setIsPlaying(false);setShowAudioError('');audio.current?.pause()
 },[active?.id,active?.part,active?.hearing.part])
 useEffect(()=>{
  if(!active?.speaking.recording)return
  let cancelled=false,url=''
  setRecordUrl('')
  void readRecord<{id:string;blob:Blob}>('recordings',active.speaking.recording.id).then(row=>{
   if(!cancelled&&row?.blob){url=URL.createObjectURL(row.blob);setRecordUrl(url)}
  }).catch(()=>{if(!cancelled)setError('Kaydedilmiş ses okunamadı.')})
  return()=>{cancelled=true;if(url)URL.revokeObjectURL(url)}
 },[active?.id,active?.speaking.recording?.createdAt])
 const playAudio=()=>{
  const s=ref.current,player=audio.current
  if(!s||!player||s.status!=='active'||s.part!=='hoeren')return
  const part=s.hearing.part
  if(!hearingCanPlay(s,part))return
  const pending=hearingPending(s,part)
  player.currentTime=pending?(s.hearing.positions[part]||0):0
  // User gesture synchronously triggers play() on mobile.
  void player.play().then(()=>{
   if(!pending)edit(old=>playHearing(old,part))
   setIsPlaying(true)
  }).catch(()=>setShowAudioError('Ses başlatılamadı. İnternet ve ses izinlerini kontrol et.'))
 }
 const saveAudioTime=(force=false)=>{
  const s=ref.current,p=audio.current
  if(!s||s.part!=='hoeren'||!p||!hearingPending(s,s.hearing.part))return
  if(!force&&Math.abs(p.currentTime-lastAudioSave.current)<3)return
  lastAudioSave.current=p.currentTime
  edit(old=>rememberHearing(old,old.hearing.part,p.currentTime))
 }
 const beginRecord=async()=>{
  const s=ref.current
  if(!s||s.part!=='sprechen'||s.speaking.phase!=='speech'||s.status!=='active'||recording||recordBusy)return
  if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){setError('Mikrofon kaydı bu tarayıcıda desteklenmiyor. HTTPS üzerinde güncel bir tarayıcı aç.');return}
  setRecordBusy(true);setError('')
  try{
   const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:false})
   mic.current=stream
   const codec=mimeChoices.find(x=>MediaRecorder.isTypeSupported(x))
   const recorder=new MediaRecorder(stream,codec?{mimeType:codec}:undefined)
   media.current=recorder;chunks.current=[]
   let resolveStop:()=>void=()=>{}
   stopPromise.current=new Promise<void>(resolve=>{resolveStop=resolve})
   const sessionId=s.id
   recorder.ondataavailable=e=>{if(e.data.size>0)chunks.current.push(e.data)}
   recorder.onstop=()=>{
    void (async()=>{
     try{
      const blob=new Blob(chunks.current,{type:recorder.mimeType||codec||'audio/webm'})
      if(blob.size<500)throw Error('Boş ses kaydı')
      const now=new Date().toISOString(),key=sessionId+':oral-recording'
      const duration=Math.max(1,Math.round((Date.now()-startAt.current)/1000))
      await putRecord('recordings',{id:key,sessionId,part:3,blob,mime:blob.type,duration,createdAt:now})
      const latest=ref.current
      if(latest?.id===sessionId){
       save({...latest,speaking:{...latest.speaking,recording:{id:key,size:blob.size,mime:blob.type,duration,createdAt:now}},updatedAt:now})
       await queue.current
      }
     }catch{setError('Ses kaydı saklanamadı. Cihaz depolamasını kontrol et.')}
     finally{stream.getTracks().forEach(x=>x.stop());mic.current=null;media.current=null;chunks.current=[];setRecordBusy(false);setRecording(false);resolveStop()}
    })()
   }
   recorder.onerror=()=>setError('Mikrofon kaydı sırasında hata oluştu.')
   startAt.current=Date.now();setRecordSeconds(0);recorder.start(900);setRecording(true)
  }catch(err){mic.current?.getTracks().forEach(t=>t.stop());mic.current=null;setRecordBusy(false)
   setError((err as {name?:string}).name==='NotAllowedError'?'Mikrofon izni reddedildi. Tarayıcı izinlerinden açabilirsin.':'Mikrofon açılamadı. Cihaz ve HTTPS bağlantısını kontrol et.')}
 }
 const confirmSection=()=>{
  const s=ref.current
  if(!s)return
  const section=s.part
  const msg=section==='lesen'?rr?.answered+' / '+rr?.total+' okuma yanıtı':
   section==='hoeren'?hr?.answered+' / '+hr?.total+' dinleme yanıtı':
   section==='schreiben'?checklist?.formFilled+' / 10 form ve '+wordNum+' kelime':
   s.speaking.phase==='prep'?s.speaking.topics.length+' / 4 tanışma konusu seçili':'Ses kaydı: '+(s.speaking.recording?'var':'yok')
  if(!window.confirm('Bölümü onaylıyor musun?\n'+msg+'\nBölüm geçişinden sonra geri dönülemez.'))return
  void advance(true)
 }
 const formOnChange=(id:string,value:string)=>{
  edit(s=>({...s,writing:{...s.writing,form:{...s.writing.form,[id]:value}},updatedAt:new Date().toISOString()}))
 }
 const report=active&&active.status==='finished'
 return <div className="exam6">
  {error&&<div className="exam6-error" role="alert">{error}<button onClick={()=>setError('')}>Kapat</button></div>}
  {view==='list'&&<>
   <header className="exam6-hero"><span>AŞAMA 6 · BÜTÜNLEŞİK DENEME</span><h2>4 beceri, tek deneme.</h2><p>Özgün A1 çalışmalarıyla okuma, dinleme, yazma ve sözlü prova. Her adım kaydedilir; bitmeden hiçbir sonuç başarı gibi gösterilmez.</p></header>
   <div className="exam6-schedule">{[['Lesen','25 dk'],['Hören','~10 dk'],['Schreiben','20 dk'],['Sprechen hazırlık','10 dk'],['Sprechen prova','~10 dk']].map(([name,duration])=><div key={name}><strong>{name}</strong><span>{duration}</span></div>)}</div>
   <div className="exam6-disclaimer">ÖSD'nin yazılı modülü yaklaşık 55 dakika, sözlü modülü 10 dakika hazırlık + yaklaşık 10 dakika sınavdır. Bu <b>eğitim amaçlı simülasyonda</b> bölüm geçişleri ve kullanıcı tarafından verilen ara seçenekleri bulunmaktadır; resmî değerlendirme veya sertifika değildir.</div>
   {loading&&<p>Yerel geçmiş yükleniyor…</p>}
   {list.some(x=>x.status!=='finished')&&<section className="exam6-active"><h3>Devam eden denemeler</h3>{list.filter(x=>x.status!=='finished').map(x=><button onClick={()=>open(x)} key={x.id}><span><b>Demo set {x.setIndex+1}</b><small>{PART_LABELS[x.part]} · {x.status==='paused'?'Ara verildi':'Çalışma açık'} · {new Date(x.updatedAt).toLocaleString('tr-TR')}</small></span><strong>Devam et ›</strong></button>)}</section>}
   <div className="exam6-sets">{([0,1] as const).map(i=><article key={i}><span>DENEME {i+1}</span><h3>{i===0?'Günlük Hayat':'Şehir ve Planlar'}</h3><p>Mevcut dört modülün {i+1}. özgün setleriyle tam deneme.</p><button className="exam6-primary" onClick={()=>void start(i)}>Yeni deneme başlat ›</button></article>)}</div>
   {list.some(x=>x.status==='finished')&&<section className="exam6-history"><h3>Bitirdiğin sınav denemeleri</h3>{list.filter(x=>x.status==='finished').map(x=><button key={x.id} onClick={()=>open(x)}><span><strong>Deneme {x.setIndex+1}</strong><small>{new Date(x.finishedAt!).toLocaleString('tr-TR')}</small></span><b>{readingResult(x).correct} / {readingResult(x).total} Lesen · {hearingResult(x).correct} / {hearingResult(x).total} Hören</b></button>)}</section>}
  </>}
  {(view==='session'||view==='report')&&active&&sets&&<div className="exam6-session">
   <div className="exam6-head"><button className="exam6-back" disabled={recording||recordBusy} onClick={exit}>‹ Deneme listesi</button><div><small>{saving?'Kaydediliyor…':'Cihazda kayıtlı'}</small>{view==='session'&&<strong className="exam6-clock">{timeText(remaining(active,now))}</strong>}</div></div>
   <div className="exam6-title"><strong>Deneme {active.setIndex+1}</strong><span>{active.status==='finished'?'Tamamlandı':active.status==='paused'?'Ara verildi':'Devam ediyor'}</span></div>
   <div className="exam6-parts">{PARTS.map((p,i)=><div className={(p===currentPart?'current ':'')+(active.sections[p].finishedAt?'done':'')} key={p}><span>{i+1}</span><small>{PART_LABELS[p]}</small></div>)}</div>
   {view==='session'&&<>
    {frozen?<div className="exam6-paused"><h3>Denemeye ara verildi</h3><p>Süre donduruldu. Kaldığın yerden devam edebilirsin. Bu esneklik yalnızca uygulamanın demo çalışma moduna özeldir.</p><button className="exam6-primary" onClick={resume}>Denemeye devam et ›</button></div>:<>
     <div className="exam6-part-title"><div><span>AKTİF BÖLÜM</span><h2>{PART_LABELS[currentPart]} {oralPrep?'· Hazırlık':' '}</h2></div><button className="exam6-secondary" disabled={recording||recordBusy} onClick={()=>void pause()}>Ⅱ Ara ver</button></div>
     <div className="exam6-running-note">Sekmeyi yenilersen süre kaldığı gerçek zamandan devam eder. Sadece “Ara ver” ile süre dondurulur. Bitirdiğin bölüme geri dönülmez.</div>
     {currentPart==='lesen'&&lesenQuestion&&<section className="exam6-question">
      <div className="exam6-question-head"><b>Aufgabe {lesenQuestion.part} · Soru {rSection!.questionIndex+1}/{sets.lesen.questions.length}</b><span>{rr?.answered}/{rr?.total} yanıt</span></div>
      {lesenQuestion.part===1&&<div className="exam6-reading-list">{sets.lesen.ads.map(ad=><article key={ad.id}><strong>Anzeige {ad.id} · {ad.title}</strong><p lang="de">{ad.text}</p></article>)}</div>}
      {lesenQuestion.part===2&&<div className="exam6-german-text">{sets.lesen.texts.filter(t=>t.id===lesenQuestion.sourceId).map(t=><div key={t.id}><strong>{t.title}</strong><p lang="de">{t.text}</p></div>)}</div>}
      {lesenQuestion.part===3&&<div className="exam6-reading-list">Beş metni uygun resimlerle eşleştir. Bir resim kullanılmaz.</div>}
      <h3 lang="de">{lesenQuestion.prompt}</h3>
      {lesenQuestion.part===3?<div className="exam6-images">{sets.lesen.pictures.map(p=><label key={p.id} className={lesenAnswer===p.id?'chosen':''}><input type="radio" name={'exam-r-'+lesenQuestion.id} checked={lesenAnswer===p.id} onChange={()=>edit(s=>answerExam(s,lesenQuestion.id,p.id))}/><Picture kind={p.kind}/><span>Bild {p.id}</span></label>)}</div>:<div className="exam6-choices">{(lesenQuestion.part===2?['JA','NEIN']:sets.lesen.ads.map(ad=>ad.id)).map(opt=><label key={opt} className={lesenAnswer===opt?'chosen':''}><input type="radio" name={'exam-r-'+lesenQuestion.id} checked={lesenAnswer===opt} onChange={()=>edit(s=>answerExam(s,lesenQuestion.id,opt))}/>{lesenQuestion.part===1?'Anzeige '+opt:opt}</label>)}</div>}
      <div className="exam6-question-nav"><button disabled={rSection!.questionIndex===0} onClick={()=>edit(s=>({...s,sections:{...s.sections,lesen:{...s.sections.lesen,questionIndex:Math.max(0,s.sections.lesen.questionIndex-1)}}}))}>‹ Önceki</button><button disabled={rSection!.questionIndex===sets.lesen.questions.length-1} onClick={()=>edit(s=>({...s,sections:{...s.sections,lesen:{...s.sections.lesen,questionIndex:Math.min(sets.lesen.questions.length-1,s.sections.lesen.questionIndex+1)}}}))}>Sonraki ›</button></div>
      <div className="exam6-number-grid">{sets.lesen.questions.map((q,i)=><button key={q.id} className={(rSection?.questionIndex===i?'selected ':'')+(rSection?.answers[q.id]?'answered':'')} onClick={()=>edit(s=>({...s,sections:{...s.sections,lesen:{...s.sections.lesen,questionIndex:i}}}))}>{i+1}</button>)}</div>
     </section>}
     {currentPart==='hoeren'&&hörUnit&&hörenQuestion&&<section className="exam6-question">
      <div className="exam6-question-head"><b>{hörUnit.label} · Soru {hSection!.questionIndex+1}/{hQuestions.length}</b><span>{hr?.answered}/{hr?.total} yanıt</span></div>
      <div className="exam6-player"><strong>{hörUnit.label}</strong><p lang="de">{hörUnit.instructionDe}</p><audio key={hörUnit.audio} ref={audio} src={hörUnit.audio} preload="metadata"
       onEnded={()=>edit(s=>finishHearingPlayback(s,s.hearing.part))} onPause={()=>{setIsPlaying(false);saveAudioTime(true)}} onTimeUpdate={()=>saveAudioTime()}
       onError={()=>setShowAudioError('Ses dosyası yüklenemedi. Bağlantıyı kontrol et.')}/>
       <div className="exam6-player-actions"><button className="exam6-primary" disabled={isPlaying||!hearingCanPlay(active,hCurrentPart)} onClick={playAudio}>{hearingPending(active,hCurrentPart)?'▶ Yarım kalan sesi sürdür':'▶ Sesi dinle'}</button>{isPlaying&&<button className="exam6-secondary" onClick={stopAudio}>Ⅱ Duraklat</button>}</div>
       <small>Görev {hCurrentPart}: {active.hearing.plays[hCurrentPart]} dinleme başlatıldı; {active.hearing.completed[hCurrentPart]} tamamlandı. Sınır {hCurrentPart===2?'2':'1'}.</small>{showAudioError&&<p role="alert">{showAudioError}</p>}
      </div>
      <h3 lang="de">{hörenQuestion.prompt}</h3>
      {hörenQuestion.kind==='picture'?<div className="exam6-images">{hörUnit.pictures?.map(pic=><label className={hörenAnswer===pic.value?'chosen':''} key={pic.value}><input type="radio" name={'exam-h-'+hörenQuestion.id} checked={hörenAnswer===pic.value} onChange={()=>edit(s=>answerExam(s,hörenQuestion.id,pic.value))}/><Picture kind={pic.kind}/><span>Bild {pic.value}</span></label>)}</div>:hörenQuestion.kind==='fill'?<input className="exam6-input" lang="de" placeholder="Duyduğun kısa bilgiyi yaz" value={hörenAnswer} onChange={e=>edit(s=>answerExam(s,hörenQuestion.id,e.target.value))}/>:<div className="exam6-choices">{hörenQuestion.options?.map(opt=><label key={opt.value} className={hörenAnswer===opt.value?'chosen':''}><input type="radio" name={'exam-h-'+hörenQuestion.id} checked={hörenAnswer===opt.value} onChange={()=>edit(s=>answerExam(s,hörenQuestion.id,opt.value))}/>{opt.value.toUpperCase()} · {opt.text}</label>)}</div>}
      <div className="exam6-question-nav"><button disabled={hSection!.questionIndex===0} onClick={()=>{stopAudio();edit(s=>({...s,sections:{...s.sections,hoeren:{...s.sections.hoeren,questionIndex:s.sections.hoeren.questionIndex-1}},hearing:{...s.hearing,part:hQuestions[s.sections.hoeren.questionIndex-1].part}}))}}>‹ Önceki</button><button disabled={hSection!.questionIndex===hQuestions.length-1} onClick={()=>{stopAudio();edit(s=>({...s,sections:{...s.sections,hoeren:{...s.sections.hoeren,questionIndex:s.sections.hoeren.questionIndex+1}},hearing:{...s.hearing,part:hQuestions[s.sections.hoeren.questionIndex+1].part}}))}}>Sonraki ›</button></div>
      <div className="exam6-number-grid">{hQuestions.map((q,i)=><button key={q.id} className={(hSection?.questionIndex===i?'selected ':'')+(hSection?.answers[q.id]?'answered':'')} onClick={()=>{stopAudio();edit(s=>({...s,sections:{...s.sections,hoeren:{...s.sections.hoeren,questionIndex:i}},hearing:{...s.hearing,part:q.part}}))}}>{i+1}</button>)}</div>
     </section>}
     {currentPart==='schreiben'&&<section className="exam6-question"><div className="exam6-question-head"><b>Aufgabe 1 · Formular</b><span>{checklist?.formFilled}/10 alan</span></div>
       <p className="exam6-german-text" lang="de">{sets.schreiben.formScenario}</p>
       <div className="exam6-form">{sets.schreiben.fields.map(f=><label key={f.id}><span>{f.label}</span>{f.type==='select'?<select value={active.writing.form[f.id]||''} onChange={e=>formOnChange(f.id,e.target.value)}><option value="">Seçiniz</option>{f.choices?.map(c=><option key={c} value={c}>{c}</option>)}</select>:<input lang="de" value={active.writing.form[f.id]||''} onChange={e=>formOnChange(f.id,e.target.value)} placeholder="Almanca cevap"/>}</label>)}</div>
       <div className="exam6-question-head"><b>Aufgabe 2 · E-Mail</b><span>{wordNum} kelime · ≈30 hedef</span></div>
       <div className="exam6-german-text"><strong>{sets.schreiben.emailFrom} schreibt dir:</strong><p lang="de">{sets.schreiben.incoming}</p>{sets.schreiben.points.map(p=><small key={p.id} lang="de">{p.question}</small>)}</div>
       <label className="exam6-write"><span>Deine Antwort</span><textarea lang="de" spellCheck={false} rows={9} value={active.writing.email} onChange={e=>edit(s=>({...s,writing:{...s.writing,email:e.target.value},updatedAt:new Date().toISOString()}))} placeholder="Hallo ..."/></label>
       <p className="exam6-muted">Bu denemede otomatik puan yok; yazı açıklamaları sonuç ekranında açılır.</p>
     </section>}
     {currentPart==='sprechen'&&<section className="exam6-question">
       <div className="exam6-question-head"><b>{oralPrep?'10 dakika hazırlık':'10 dakika konuşma provası'}</b><span>ÖSD A1 üç sözlü görev</span></div>
       <p className="exam6-muted">{oralPrep?'Bu süre sırasında dört tanışma başlığı ve bir resim seç. Ardından konuşma provası başlar.':'Soruları sesli yanıtla; cihaz mikrofonuyla prova kaydını saklayabilirsin. Otomatik not verilmez.'}</p>
       <h3>Aufgabe 1 · Sich vorstellen</h3><div className="exam6-topics">{sets.sprechen.themes.map(t=><button className={active.speaking.topics.includes(t.id)?'chosen':''} key={t.id} onClick={()=>edit(s=>({...s,speaking:{...s.speaking,topics:s.speaking.topics.includes(t.id)?s.speaking.topics.filter(x=>x!==t.id):s.speaking.topics.length<4?[...s.speaking.topics,t.id]:s.speaking.topics}}))}>{active.speaking.topics.includes(t.id)?'✓ ':'+ '}{t.name}</button>)}</div><small>{active.speaking.topics.length}/4 konu</small>
       <div className="exam6-german-text">{sets.sprechen.themes.filter(t=>active.speaking.topics.includes(t.id)).map(t=><p key={t.id} lang="de"><b>{t.question}</b> · {t.sample}</p>)}</div>
       <h3>Aufgabe 2 · Bildbeschreibung</h3><div className="exam6-scenes">{sets.sprechen.scenes.map(scene=><button key={scene.id} className={scene.id===active.speaking.sceneId?'chosen':''} onClick={()=>edit(s=>({...s,speaking:{...s.speaking,sceneId:scene.id,step:0}}))}><SceneArt title={scene.title} kind={scene.icon}/><b>{scene.title}</b></button>)}</div>
       {scene&&<div className="exam6-german-text"><p>{scene.overviewTr}</p><b lang="de">Beispiel: {scene.example}</b></div>}
       <h3>Aufgabe 3 · Rollenspiel</h3>{scene?<div className="exam6-german-text"><b>{scene.title}</b><p lang="de">{scene.prompts[active.speaking.step].question}</p><small>{scene.prompts[active.speaking.step].hintTr}</small><div className="exam6-question-nav"><button disabled={active.speaking.step===0} onClick={()=>edit(s=>({...s,speaking:{...s.speaking,step:Math.max(0,s.speaking.step-1)}}))}>‹ Önceki soru</button><button disabled={active.speaking.step===2} onClick={()=>edit(s=>({...s,speaking:{...s.speaking,step:Math.min(2,s.speaking.step+1)}}))}>Sonraki soru ›</button></div></div>:<p>Rol oyunu için önce bir resim seç.</p>}
       <button className="exam6-link" onClick={()=>setPhraseOpen(x=>!x)}>{phraseOpen?'Redemittel gizle':'Redemittel göster'}</button>
       {phraseOpen&&<div className="exam6-phrases">{[...phraseBank[1],...phraseBank[2],...phraseBank[3]].map((p,i)=><div key={i}><strong lang="de">{p.de}</strong><small>{p.tr}</small></div>)}</div>}
       {!oralPrep&&<section className="exam6-recorder"><h4>Mikrofonla sözlü prova</h4><p>Cihazdan izin alarak kaydedilir; dışarı aktarılmaz. En fazla 2 dakika.</p><button className="exam6-primary" disabled={recordBusy} onClick={()=>void(recording?afterRecord():beginRecord())}>{recording?'■ Kaydı durdur '+timeText(recordSeconds):'● Sesimi kaydet'}</button>{active.speaking.recording&&<span>Kaydedilmiş ses: {timeText(active.speaking.recording.duration)}</span>}{recordUrl&&<audio controls src={recordUrl}/>}</section>}
       <label className="exam6-write"><span>Prova notu (isteğe bağlı)</span><textarea value={active.speaking.notes} rows={3} onChange={e=>edit(s=>({...s,speaking:{...s.speaking,notes:e.target.value}}))}/></label>
      </section>}
     <div className="exam6-finish"><div><b>{oralPrep?'Hazırlığı tamamla ve konuşmaya geç':'Bölümü bitir'}</b><small>Geçmeden önce kayıtlar ve boş yanıtlar onay ekranında kontrol edilir.</small></div><button className="exam6-primary" disabled={recording||recordBusy||saving||finishing} onClick={confirmSection}>{oralPrep?'Konuşmayı başlat':'Bölümü onayla ›'}</button></div>
    </>}
   </>}
   {report&&rr&&hr&&checklist&&<section className="exam6-report">
    <span>TAMAMLANMIŞ DENEME · {new Date(active.finishedAt!).toLocaleString('tr-TR')}</span><h2>Deneme {active.setIndex+1} sonuçların</h2><p>Bunlar yalnızca bu denemedeki gerçek girişlerin özetidir. Resmî ÖSD puanı, geçme kararı veya sertifika değildir.</p>
    <div className="exam6-score-grid"><div><small>Lesen</small><strong>{rr.correct}/{rr.total}</strong><span>{rr.wrong} yanlış · {rr.blank} boş</span></div><div><small>Hören</small><strong>{hr.correct}/{hr.total}</strong><span>{hr.wrong} yanlış · {hr.blank} boş</span></div><div><small>Schreiben</small><strong>{checklist.formFilled}/10</strong><span>Form dolu · {wordNum} kelime</span></div><div><small>Sprechen</small><strong>{active.speaking.recording?'Kayıt var':'Kayıt yok'}</strong><span>Puan yok · {active.speaking.topics.length}/4 konu</span></div></div>
    <div className="exam6-report-block"><h3>Lesen · Yanlış ve boş sorular</h3>{rr.wrongItems.length?rr.wrongItems.map(q=><article key={q.id}><b lang="de">{q.prompt}</b><p>Sen: {q.user} · Doğru: {q.answer}</p><small>{q.why}</small></article>):<p>İşaretlenen yanıtlarda yanlış yok.</p>}<p>Boş: {rr.blank} soru. Boşlar yanlış hanesine eklenmez.</p></div>
    <div className="exam6-report-block"><h3>Hören · Yanlışlar</h3>{hr.wrongItems.length?hr.wrongItems.map(q=><article key={q.id}><b lang="de">{q.prompt}</b><p>Sen: {q.user} · Doğru: {q.answer}</p><small>{q.why}</small></article>):<p>Yanlış cevap yok.</p>}<p>Boş: {hr.blank} soru.</p></div>
    <div className="exam6-report-block"><h3>Schreiben · Yerel yönlendirme</h3><p>10 form alanından {formResult.filter(x=>x.status==='matches').length} tanesi örnekle eşleşiyor, {formResult.filter(x=>x.status==='review').length} farklı, {formResult.filter(x=>x.status==='empty').length} boş.</p><button className="exam6-link" onClick={()=>setHintOpen(x=>!x)}>{hintOpen?'Açıklamaları gizle':'Yazma kontrollerini aç'}</button>{hintOpen&&<div className="exam6-writing-result">{formResult.map((f,i)=><p key={f.fieldId}>{sets.schreiben.fields[i].label}: {f.detailTr}</p>)}{analyzeEmail(active.writing.email,sets.schreiben).map((issue,i)=><p key={i}><b>{issue.titleTr}:</b> {issue.detailTr}</p>)}<blockquote lang="de">{active.writing.email||'Metin yazılmadı.'}</blockquote></div>}</div>
    <div className="exam6-report-block"><h3>Sprechen · Öz kontrol</h3><p>Seçilen konular: {active.speaking.topics.length}/4 · Ses kaydı: {active.speaking.recording?'var':'yok'}. Telaffuz ve iletişim yeterliliği otomatik ölçülmez.</p>{recordUrl&&<audio controls src={recordUrl}/>}</div>
    <div className="exam6-report-block"><h3>Tekrar önerileri</h3>{suggestedRetakes(active).length?suggestedRetakes(active).map(p=><p key={p}>• {PART_LABELS[p]} — {p==='lesen'||p==='hoeren'?'Yanlış/boş sorularını tekrar et.':'Tamamlanmamış pratik adımlarını çalış.'}</p>):<p>Kaydedilmiş açık alıştırma eksiği görünmüyor. Bu, sınava hazır olduğun anlamına gelmez.</p>}</div>
   </section>}
  </div>}
 </div>
}
