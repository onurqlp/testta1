import {useEffect,useRef,useState} from 'react'
import {deleteRecord,listRecords,putRecord,readRecord} from '../../storage/db'
import {getScene,getSpeakingSet,phraseBank,speakingSets,type SpeakingMode,type SpeakingPart} from './content'
import SceneArt from './SceneArt'
import {durationText,finishSession,makeAttempt,makeSession,recordingId,remainingSeconds,setPart,toggleTopic,
 type LocalRecording,type SpeakingSession} from './model'
import './sprechen.css'

type Screen='sets'|'session'|'complete'
const isSpeaking=(s:SpeakingSession)=>s?.module==='sprechen'&&Boolean(getSpeakingSet(s.setId))
const speakingHints:Record<SpeakingPart,string[]> = {
 1:['Seçtiğim dört konuda konuşabildim.','Her konu için en az bir anlaşılır cümle söyledim.','Karşımdakinin temel sorularına yanıt verdim.'],
 2:['Resimdeki kişileri ve sayısını söyledim.','Kişilerin bulunduğu yeri tarif ettim.','Kişilerin ne yaptığını anlattım.'],
 3:['Selamlaştım veya konuşmaya başladım.','En az bir istek veya soru söyledim.','Kibarca teşekkür edip konuşmayı bitirdim.']
}
const mimeList=['audio/webm;codecs=opus','audio/mp4','audio/webm','audio/ogg;codecs=opus']
function userMediaError(err:unknown):string {
 const e=err as {name?:string}
 if(e?.name==='NotAllowedError'||e?.name==='PermissionDeniedError')return 'Mikrofon izni verilmedi. Tarayıcıdaki site izinlerinden mikrofonu açabilirsin.'
 if(e?.name==='NotFoundError')return 'Bu cihazda kullanılabilir bir mikrofon bulunamadı.'
 if(e?.name==='NotReadableError')return 'Mikrofon başka bir uygulamada kullanılıyor olabilir.'
 return 'Mikrofon açılamadı. HTTPS bağlantısını, tarayıcı izinlerini ve cihaz desteğini kontrol et.'
}
export default function SprechenView(){
 const [screen,setScreen]=useState<Screen>('sets')
 const [sessions,setSessions]=useState<SpeakingSession[]>([])
 const [current,setCurrent]=useState<SpeakingSession|null>(null)
 const currentRef=useRef<SpeakingSession|null>(null)
 const [loading,setLoading]=useState(true)
 const [message,setMessage]=useState('')
 const [saving,setSaving]=useState(false)
 const [now,setNow]=useState(Date.now)
 const [recording,setRecording]=useState(false)
 const [recordedSeconds,setRecordedSeconds]=useState(0)
 const [mediaBusy,setMediaBusy]=useState(false)
 const [recordingUrl,setRecordingUrl]=useState('')
 const [showExample,setShowExample]=useState(false)
 const [showPhrases,setShowPhrases]=useState(true)
 const [roleplayHelp,setRoleplayHelp]=useState(false)
 const [finishing,setFinishing]=useState(false)
 const [audioVersion,setAudioVersion]=useState(0)
 const recorderRef=useRef<MediaRecorder|null>(null)
 const streamRef=useRef<MediaStream|null>(null)
 const chunksRef=useRef<Blob[]>([])
 const recordingStartRef=useRef(0)
 const stopTaskRef=useRef<Promise<void>|null>(null)
 const queueRef=useRef<Promise<void>>(Promise.resolve())
 const lockedRef=useRef(false)
 const aliveRef=useRef(true)

 const setSession=(s:SpeakingSession|null)=>{currentRef.current=s;setCurrent(s)}
 const queueSave=(s:SpeakingSession)=>{
   setSession(s);setSaving(true)
   queueRef.current=queueRef.current.catch(()=>{}).then(()=>putRecord('sessions',s))
    .then(()=>setSessions(xs=>[s,...xs.filter(x=>x.id!==s.id)]))
    .catch(()=>setMessage('Prova kayıt bilgisi saklanamadı. Tarayıcı depolama iznini kontrol et.'))
    .finally(()=>{if(aliveRef.current)setSaving(false)})
   return queueRef.current
 }
 const change=(fn:(s:SpeakingSession)=>SpeakingSession)=>{
   const s=currentRef.current
   if(s&&!s.finishedAt&&!lockedRef.current)void queueSave(fn(s))
 }
 useEffect(()=>{
   aliveRef.current=true
   listRecords<SpeakingSession>('sessions')
    .then(xs=>{if(aliveRef.current)setSessions(xs.filter(isSpeaking).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)))})
    .catch(()=>{if(aliveRef.current)setMessage('Yerel konuşma arşivi açılamadı. Tarayıcı izinlerini kontrol et.')})
    .finally(()=>{if(aliveRef.current)setLoading(false)})
   return()=>{aliveRef.current=false;try{if(recorderRef.current?.state==='recording')recorderRef.current.stop()}catch{/* unavailable */}
     streamRef.current?.getTracks().forEach(t=>t.stop())}
 },[])
 const begin=async(setId:string,mode:SpeakingMode)=>{
   setMessage('')
   const existing=sessions.find(s=>s.setId===setId&&s.mode===mode&&!s.finishedAt)
   if(existing){setSession(existing);setScreen('session');setNow(Date.now());return}
   const set=getSpeakingSet(setId)
   if(!set)return
   const newOne=makeSession(set,mode)
   try{await putRecord('sessions',newOne);setSession(newOne);setSessions(prev=>[newOne,...prev]);setNow(Date.now());setScreen('session')}
   catch{setMessage('Yerel kayıt deposu açılamadı. Yeni prova başlatılamıyor.')}
 }
 const activeSet=current?getSpeakingSet(current.setId):undefined
 const part=current?.currentPart||1
 const selectedScene=activeSet&&current?.sceneId?getScene(activeSet,current.sceneId):undefined
 const hasRecording=Boolean(current?.recordings[part])
 const canEdit=Boolean(current&&!current.finishedAt&&!(current.mode==='timed'&&remainingSeconds(current,now)===0))
 const finish=async()=>{
   if(lockedRef.current||!currentRef.current||currentRef.current.finishedAt)return
   lockedRef.current=true;setFinishing(true)
   try{
     const media=recorderRef.current
     if(media&&media.state!=='inactive'){media.stop();await stopTaskRef.current}
     await queueRef.current
     const session=currentRef.current
     if(!session)return
     const final=finishSession(session)
     await putRecord('sessions',final)
     await putRecord('attempts',makeAttempt(final))
     setSession(final);setSessions(xs=>[final,...xs.filter(x=>x.id!==final.id)])
     setScreen('complete')
     window.dispatchEvent(new Event('ayda:progress-changed'))
   }catch{setMessage('Tamamlamayı kaydedemedik. Önceki ses kayıtların silinmedi.')}
   finally{lockedRef.current=false;setFinishing(false)}
 }
 useEffect(()=>{
   if(screen!=='session'||current?.mode!=='timed'||current.finishedAt)return
   const run=()=>{const timestamp=Date.now();setNow(timestamp);
     const s=currentRef.current;if(s&&!s.finishedAt&&remainingSeconds(s,timestamp)===0)void finish()}
   run()
   const t=window.setInterval(run,1000)
   return()=>window.clearInterval(t)
 },[screen,current?.id,current?.endsAt,current?.finishedAt])
 useEffect(()=>{
   if(!recording)return
   const t=window.setInterval(()=>{
     const seconds=Math.round((Date.now()-recordingStartRef.current)/1000)
     setRecordedSeconds(seconds)
     if(seconds>=120&&recorderRef.current?.state==='recording')recorderRef.current.stop()
   },500)
   return()=>window.clearInterval(t)
 },[recording])
 useEffect(()=>{
   if(!current)return
   let disposed=false, url=''
   setRecordingUrl('')
   const id=current.recordings[part]?.id
   if(id)readRecord<LocalRecording>('recordings',id).then(value=>{
     if(disposed)return
     if(value?.blob&&value.blob.size>0){url=URL.createObjectURL(value.blob);setRecordingUrl(url)}
     else setMessage('Bu prova için kayıt dosyası bulunamadı. Tarayıcı depolaması temizlenmiş olabilir.')
   }).catch(()=>{if(!disposed)setMessage('Ses arşivi okunamadı.')})
   return()=>{disposed=true;if(url)URL.revokeObjectURL(url)}
 },[current?.id,current?.recordings[part]?.createdAt,part,audioVersion])
 const stopRecording=async()=>{
   const r=recorderRef.current
   if(r&&r.state!=='inactive'){try{r.stop()}catch{/* already stopped */}}
   if(stopTaskRef.current)await stopTaskRef.current
 }
 const startRecording=async()=>{
   const s=currentRef.current
   if(!s||s.finishedAt||!canEdit||mediaBusy||recording)return
   if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){
     setMessage('Bu tarayıcıda mikrofon kayıt API’si bulunamadı. Tarayıcının güncel sürümünü HTTPS üzerinde kullan.')
     return
   }
   setMediaBusy(true);setMessage('')
   try{
     const stream=await navigator.mediaDevices.getUserMedia({audio:true,video:false})
     if(!aliveRef.current||currentRef.current?.id!==s.id){
       stream.getTracks().forEach(t=>t.stop());return
     }
     streamRef.current=stream
     const mime=mimeList.find(m=>MediaRecorder.isTypeSupported(m))
     const media=new MediaRecorder(stream,mime?{mimeType:mime}:undefined)
     recorderRef.current=media
     const capturePart=s.currentPart,sessionId=s.id
     chunksRef.current=[];recordingStartRef.current=Date.now();setRecordedSeconds(0)
     let resolveStop:()=>void=()=>{}
     stopTaskRef.current=new Promise<void>(resolve=>{resolveStop=resolve})
     media.ondataavailable=(e:BlobEvent)=>{if(e.data.size>0)chunksRef.current.push(e.data)}
     media.onerror=()=>setMessage('Kaydedici beklenmedik şekilde durdu. Dosyayı kaydetmeyi deneyeceğiz.')
     media.onstop=()=>{
       void (async()=>{
         try{
           const blob=new Blob(chunksRef.current,{type:media.mimeType||mime||'audio/webm'})
           if(blob.size<500)throw Error('Boş ses kaydı')
           const duration=Math.max(1,Math.round((Date.now()-recordingStartRef.current)/1000))
           const key=recordingId(sessionId,capturePart),stamp=new Date().toISOString()
           const row:LocalRecording={id:key,sessionId,part:capturePart,blob,mime:blob.type,duration,createdAt:stamp}
           await putRecord('recordings',row)
           const latest=currentRef.current
           if(latest?.id===sessionId){
             await queueSave({...latest,recordings:{...latest.recordings,[capturePart]:{
               id:key,createdAt:stamp,mime:blob.type,size:blob.size,duration}},updatedAt:stamp})
           }
           if(aliveRef.current)setAudioVersion(x=>x+1)
         }catch(e){if(aliveRef.current)setMessage('Ses kaydı saklanamadı. Cihazın boş depolama alanını kontrol et: '+String(e))}
         finally{
           stream.getTracks().forEach(t=>t.stop())
           streamRef.current=null;recorderRef.current=null;chunksRef.current=[]
           if(aliveRef.current){setRecording(false);setMediaBusy(false)}
           resolveStop()
         }
       })()
     }
     media.start(900)
     setRecording(true)
   }catch(e){streamRef.current?.getTracks().forEach(t=>t.stop());streamRef.current=null
     setMediaBusy(false);setMessage(userMediaError(e))}
 }
 const navigatePart=async(next:SpeakingPart)=>{
   if(!current||recording||mediaBusy)return
   setShowExample(false);setRoleplayHelp(false)
   if(current.finishedAt){setSession({...current,currentPart:next});return}
   change(s=>setPart(s,next))
 }
 const deleteAudio=async()=>{
   const s=currentRef.current,meta=s?.recordings[part]
   if(!s||!meta||recording||s.finishedAt)return
   try{
     await deleteRecord('recordings',meta.id)
     const rec={...s.recordings};delete rec[part]
     await queueSave({...s,recordings:rec,updatedAt:new Date().toISOString()})
     setAudioVersion(x=>x+1)
   }catch{setMessage('Ses dosyası silinemedi.')}
 }
 const toggleCheck=(text:string)=>{
   change(s=>{
     const checks=s.selfChecks[part]||[]
     return {...s,selfChecks:{...s.selfChecks,[part]:checks.includes(text)?checks.filter(x=>x!==text):[...checks,text]},updatedAt:new Date().toISOString()}
   })
 }
 const fresh=async()=>{if(recording||mediaBusy){await stopRecording()}setScreen('sets');setSession(null);setMessage('');setShowExample(false)}
 return <div className="spr-app">
  {message&&<div className="spr-alert" role="alert">{message}<button aria-label="Kapat" onClick={()=>setMessage('')}>×</button></div>}
  {screen==='sets'&&<>
   <header className="spr-hero"><div><span className="spr-kicker">ÖSD A1 · SPRECHEN</span><h2>Kendi sesinle prova yap.</h2><p>Dört başlıkta tanışma, özgün resimlerle anlatma ve karşılıklı konuşma. Seslerin cihazında saklanır; hiçbir yapay zekâ servisine gönderilmez.</p></div><span className="spr-hero-count"><b>3</b> GÖREV</span></header>
   {!loading&&speakingSets.map((set,i)=><article className="spr-set" key={set.id}>
     <div className="spr-set-head"><span className="spr-index">0{i+1}</span><div><h3>{set.title}</h3><p>{set.subtitle}</p></div><span className="spr-pill">A1</span></div>
     <div className="spr-set-sub"><span>4 konuşma başlığı</span><span>3 özgün resim</span><span>3 tur rol oyunu</span></div>
     <div className="spr-actions">{(['practice','timed'] as SpeakingMode[]).map(mode=>{
       const previous=sessions.find(x=>x.setId===set.id&&x.mode===mode&&!x.finishedAt)
       return <button key={mode} className={mode==='practice'?'spr-btn-main':'spr-btn-outline'} onClick={()=>void begin(set.id,mode)}>{previous?'Kaldığın yerden · ':''}{mode==='practice'?'Serbest prova':'10 dk süreli prova'}</button>
     })}</div>
   </article>)}
   {loading&&<p className="spr-hint">Kayıtlar yükleniyor…</p>}
   {sessions.some(s=>s.finishedAt)&&<section className="spr-history"><h3>Bitirdiğin provalar</h3>{sessions.filter(s=>s.finishedAt).slice(0,6).map(s=><button key={s.id} onClick={()=>{setSession(s);setScreen('complete')}}><span><b>{getSpeakingSet(s.setId)?.title}</b><small>{new Date(s.finishedAt!).toLocaleDateString('tr-TR')} · {Object.keys(s.recordings).length} ses</small></span><span>Dinle ›</span></button>)}</section>}
   <aside className="spr-note"><strong>Sınav notu yerine gerçek prova</strong><p>Resmî ÖSD sözlü sınavını görevliler değerlendirir. Bu uygulama sesini kaydetmene, tekrar dinlemene ve kendi kontrol listeni doldurmana yardımcı olur. Ses metne çevrilmez, puanlanmaz ve yüklenmez.</p></aside>
  </>}
  {(screen==='session'||screen==='complete')&&current&&activeSet&&<>
   <div className="spr-top"><button className="spr-back" disabled={mediaBusy} onClick={()=>void fresh()}>‹ Setlere dön</button><div><small>{saving?'Kaydediliyor…':'Yerel kayıt'}</small>{current.mode==='timed'&&screen==='session'?<strong className={'spr-clock '+(remainingSeconds(current,now)<90?'warning':'')}>{durationText(remainingSeconds(current,now))}</strong>:<span className="spr-tag">{current.mode==='practice'?'SERBEST':'SÜRELİ'}</span>}</div></div>
   <div className="spr-current"><h2>{activeSet.title}</h2><span>{Object.keys(current.recordings).length}/3 ses kaydı</span></div>
   <nav className="spr-parts" aria-label="Sprechen görevleri">{([1,2,3] as SpeakingPart[]).map(n=><button key={n} className={part===n?'selected':''} aria-current={part===n?'step':undefined} disabled={recording||mediaBusy} onClick={()=>void navigatePart(n)}><span>Aufgabe {n}</span><small>{n===1?'Tanışma':n===2?'Resim': 'Rol oyunu'}</small></button>)}</nav>
   {part===1&&<section className="spr-work"><span className="spr-kicker">AUFGABE 1 · SICH VORSTELLEN</span><h3>Dört konu seç, kendini tanıt</h3><p>Altı başlıktan dört tanesini seç. Her konu hakkında birkaç basit Almanca cümle kur. Sonra sesini kaydet.</p>
    <div className="spr-topic-grid">{activeSet.themes.map(topic=><button key={topic.id} disabled={!canEdit} className={current.selectedTopics.includes(topic.id)?'selected':''} aria-pressed={current.selectedTopics.includes(topic.id)} onClick={()=>change(s=>toggleTopic(s,topic.id))}><span className="spr-select-dot">{current.selectedTopics.includes(topic.id)?'✓':'+'}</span><b>{topic.name}</b><small>{topic.question}</small></button>)}</div>
    <p className={'spr-counter '+(current.selectedTopics.length===4?'ok':'')}>{current.selectedTopics.length}/4 konu seçildi</p>
    {current.selectedTopics.map(id=>{const t=activeSet.themes.find(x=>x.id===id);return t?<div className="spr-topic-detail" key={id}><b>{t.name} — {t.question}</b><p>{t.helperTr}</p><small lang="de">Örnek: {t.sample}</small></div>:null})}
   </section>}
   {part===2&&<section className="spr-work"><span className="spr-kicker">AUFGABE 2 · SITUATION BESCHREIBEN</span><h3>Bir resim seç ve anlat</h3><p>Üç özgün çizimden birini seç. Kaç kişi var, nerede bulunuyorlar ve ne yapıyorlar? Seçtiğin resim Aufgabe 3 rol oyununda da kullanılacak.</p>
    <div className="spr-scenes">{activeSet.scenes.map(scene=><button key={scene.id} disabled={!canEdit} className={current.sceneId===scene.id?'selected':''} onClick={()=>change(s=>({...s,sceneId:scene.id,roleplayStep:0,updatedAt:new Date().toISOString()}))}><SceneArt kind={scene.icon} title={scene.title}/><span>{scene.title}</span><small>{scene.setting}</small><b>{current.sceneId===scene.id?'✓ Seçildi':'Bu resmi seç'}</b></button>)}</div>
    {selectedScene&&<div className="spr-scene-detail"><h4>{selectedScene.title}</h4><p>{selectedScene.overviewTr}</p><div className="spr-description-grid"><span><strong>Kişiler</strong>{selectedScene.people}</span><span><strong>Yer</strong>{selectedScene.place}</span><span><strong>Etkinlik</strong>{selectedScene.actions}</span></div><button className="spr-link" onClick={()=>setShowExample(x=>!x)}>{showExample?'Örneği kapat':'Örnek A1 betimlemesini göster'}</button>{showExample&&<blockquote lang="de">{selectedScene.example}</blockquote>}</div>}
   </section>}
   {part===3&&<section className="spr-work"><span className="spr-kicker">AUFGABE 3 · ROLLENSPIEL</span><h3>Seçtiğin resimde konuş</h3>{!selectedScene?<div className="spr-unselected"><p>Rol oyunu için önce Aufgabe 2'den bir resim seçmelisin.</p><button className="spr-btn-main" onClick={()=>void navigatePart(2)}>Resim seç ›</button></div>:<>
    <div className="spr-role-head"><SceneArt kind={selectedScene.icon} title={selectedScene.title}/><div><strong>{selectedScene.title}</strong><p>{selectedScene.setting}</p></div></div>
    <div className="spr-role-nav"><span>Konuşma turu {current.roleplayStep+1} / 3</span><div>{selectedScene.prompts.map((_,i)=><button key={i} className={i===current.roleplayStep?'active':''} disabled={!canEdit} onClick={()=>change(s=>({...s,roleplayStep:i,updatedAt:new Date().toISOString()}))}>{i+1}</button>)}</div></div>
    <div className="spr-dialog"><span>Konuşma arkadaşının sorusu</span><h4 lang="de">{selectedScene.prompts[current.roleplayStep].question}</h4><small>{selectedScene.prompts[current.roleplayStep].hintTr}</small><button className="spr-link" onClick={()=>setRoleplayHelp(x=>!x)}>{roleplayHelp?'Örneği gizle':'Örnek cevabı göster'}</button>{roleplayHelp&&<p className="spr-suggested" lang="de">{selectedScene.prompts[current.roleplayStep].response}</p>}</div>
    <div className="spr-speech-nav"><button className="spr-btn-outline" disabled={current.roleplayStep===0||!canEdit} onClick={()=>{change(s=>({...s,roleplayStep:Math.max(0,s.roleplayStep-1),updatedAt:new Date().toISOString()}));setRoleplayHelp(false)}}>‹ Önceki tur</button><button className="spr-btn-main" disabled={current.roleplayStep===2||!canEdit} onClick={()=>{change(s=>({...s,roleplayStep:Math.min(2,s.roleplayStep+1),updatedAt:new Date().toISOString()}));setRoleplayHelp(false)}}>Sonraki tur ›</button></div>
   </>}</section>}
   <section className="spr-practice-tools"><button className="spr-tools-head" aria-expanded={showPhrases} onClick={()=>setShowPhrases(x=>!x)}><b>Redemittel · Hazır A1 kalıpları</b><span>{showPhrases?'−': '+'}</span></button>
    {showPhrases&&<div className="spr-phrase-grid">{phraseBank[part].map((item,i)=><div key={i}><b lang="de">{item.de}</b><small>{item.tr}</small></div>)}</div>}
   </section>
   <section className="spr-recorder"><div className="spr-rec-header"><div><span className="spr-kicker">YALNIZCA BU CİHAZ</span><h3>Sesini kaydet ve dinle</h3><p>Bu görev için sesini kaydedebilirsin. Önceki kaydının üzerine yeni kayıt yapılabilir.</p></div><span className={'spr-rec-light '+(recording?'on':'')}>{recording?'● KAYIT':'● HAZIR'}</span></div>
     <div className="spr-record-actions">{recording?<button className="spr-stop" onClick={()=>void stopRecording()}>■ Kaydı durdur · {durationText(recordedSeconds)}</button>:<button className="spr-btn-main" disabled={!canEdit||mediaBusy} onClick={()=>void startRecording()}>{mediaBusy?'Mikrofon açılıyor…':'● Ses kaydı başlat'}</button>}
      <span>Her kayıt en fazla 2 dakika. Mikrofon izni yalnızca kayıt başlatıldığında istenir.</span></div>
     {hasRecording&&recordingUrl&&<div className="spr-playback"><strong>Kaydedilen ses · {durationText(current.recordings[part]!.duration)}</strong><audio controls preload="metadata" src={recordingUrl}>Cihazın ses oynatmayı desteklemiyor.</audio><div><a download={'AYDA-A1-'+activeSet.id+'-Aufgabe-'+part+(current.recordings[part]?.mime.includes('mp4')?'.m4a':'.webm')} href={recordingUrl}>Kaydı cihazına indir</a>{!current.finishedAt&&<button onClick={()=>void deleteAudio()} disabled={recording}>Yerel kaydı sil</button>}</div></div>}
     {hasRecording&&!recordingUrl&&<small className="spr-hint">Kayıt okunuyor…</small>}
     {!hasRecording&&<p className="spr-hint">Bu görevde henüz kaydedilmiş ses yok.</p>}
     <p className="spr-privacy">Ses dosyası doğrudan tarayıcının IndexedDB alanına kaydedilir. Sunucuya, öğretmene veya yapay zekâya gönderilmez. Tarayıcı verilerini temizlersen kayıtlar silinir.</p>
   </section>
   <section className="spr-self"><h3>Öz değerlendirme kontrolü</h3><p>Bu kutular senin kendine verdiğin işaretlerdir; sistem doğru telaffuz ettiğini doğrulamaz.</p>{speakingHints[part].map(hint=><label key={hint}><input type="checkbox" checked={Boolean(current.selfChecks[part]?.includes(hint))} disabled={!canEdit} onChange={()=>toggleCheck(hint)}/>{hint}</label>)}</section>
   <section className="spr-notes"><label htmlFor="spr-note">Kendi notların (isteğe bağlı)</label><textarea id="spr-note" rows={3} value={current.notes[part]||''} disabled={!canEdit} onChange={e=>change(s=>({...s,notes:{...s.notes,[part]:e.target.value},updatedAt:new Date().toISOString()}))} placeholder="Unuttuğun kelimeler veya sonraki provada dikkat edeceğin şeyler…"/></section>
   {screen==='session'&&<div className="spr-footer-actions">{part<3?<button className="spr-btn-main" disabled={recording||mediaBusy} onClick={()=>void navigatePart((part+1) as SpeakingPart)}>Sonraki Aufgabe ›</button>:<button className="spr-btn-main" disabled={finishing||recording||mediaBusy} onClick={()=>void finish()}>{finishing?'Kaydediliyor…':'Provayı tamamla ✓'}</button>}<button className="spr-btn-outline" disabled={finishing||recording||mediaBusy} onClick={()=>void finish()}>Burada bitir ve kaydet</button></div>}
   {screen==='complete'&&<div className="spr-done"><span>✓ Prova tamamlandı</span><h3>{activeSet.title}</h3><p>{Object.keys(current.recordings).length} ses dosyası saklandı. Değerlendirme ve puan üretilmedi; yukarıdaki sekmelerden kendi kayıtlarını tekrar dinleyebilirsin.</p><button className="spr-btn-main" onClick={()=>void fresh()}>Yeni çalışma seç</button></div>}
  </>}
 </div>
}
