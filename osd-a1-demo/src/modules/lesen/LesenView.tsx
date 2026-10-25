import { useEffect, useRef, useState } from 'react'
import { deleteRecord, listRecords, putRecord } from '../../storage/db'
import { readingSets, getReadingSet, type ReadingQuestion, type ReadingSet } from './content'
import Picture from './Pictures'
import { draftId, finishAttempt, formatSeconds, gradeAttempt, makeAttempt, secondsRemaining, selectedValue, updateAnswer, type LesenAttempt, type LesenMode } from './logic'
import './lesen.css'

type Screen = 'sets' | 'taking' | 'result'
const isLesen = (item: LesenAttempt) => item?.module === 'lesen' && Boolean(getReadingSet(item.taskId))
const isFinished = (item: LesenAttempt) => Boolean(item.finishedAt)

export default function LesenView() {
  const [screen, setScreen] = useState<Screen>('sets')
  const [drafts, setDrafts] = useState<LesenAttempt[]>([])
  const [history, setHistory] = useState<LesenAttempt[]>([])
  const [attempt, setAttempt] = useState<LesenAttempt | null>(null)
  const [resultFilter, setResultFilter] = useState<'all'|'wrong'>('all')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [now, setNow] = useState(() => Date.now())
  const pendingSave = useRef<Promise<void>>(Promise.resolve())
  const attemptRef = useRef<LesenAttempt | null>(null)
  const finishing = useRef(false)

  const syncAttempt = (a: LesenAttempt | null) => { attemptRef.current = a; setAttempt(a) }
  const loadAll = async () => {
    const rows = (await listRecords<LesenAttempt>('attempts')).filter(isLesen)
    setDrafts(rows.filter(a => !isFinished(a)).sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)))
    setHistory(rows.filter(isFinished).sort((a,b) => (b.finishedAt || '').localeCompare(a.finishedAt || '')))
  }
  useEffect(() => {
    let active = true
    listRecords<LesenAttempt>('attempts').then(rows => {
      if (!active) return
      const ours = rows.filter(isLesen)
      setDrafts(ours.filter(a => !isFinished(a)).sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)))
      setHistory(ours.filter(isFinished).sort((a,b) => (b.finishedAt || '').localeCompare(a.finishedAt || '')))
    }).catch(() => { if (active) setError('Kayıtlar açılamadı. Tarayıcı depolamasını kontrol edin.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const saveUpdate = (updated: LesenAttempt) => {
    syncAttempt(updated)
    setSaving(true)
    pendingSave.current = pendingSave.current.catch(() => {}).then(async () => {
      await putRecord('attempts', updated)
    }).catch(() => {
      setError('Son değişiklik kaydedilemedi. Depolama iznini kontrol edin; sayfayı kapatmayın.')
    }).finally(() => setSaving(false))
  }

  const start = async (set: ReadingSet, mode: LesenMode) => {
    setError('')
    const existing = drafts.find(a => a.id === draftId(set.id,mode))
    if (existing) {
      syncAttempt(existing)
      setNow(Date.now())
      setScreen('taking')
      return
    }
    const created = makeAttempt(set, mode)
    try {
      await putRecord('attempts', created)
      syncAttempt(created)
      setDrafts(prev => [created, ...prev])
      setNow(Date.now())
      setScreen('taking')
    } catch {
      setError('Çalışma açılamadı: Tarayıcı yerel kayıt alanına erişemiyor.')
    }
  }

  const amend = (change: (current: LesenAttempt) => LesenAttempt) => {
    const current = attemptRef.current
    if (!current || finishing.current) return
    saveUpdate(change(current))
  }

  const finish = async (requestReason: 'submitted'|'timeout') => {
    if (finishing.current || !attemptRef.current) return
    finishing.current = true
    setError('')
    try {
      await pendingSave.current
      const current = attemptRef.current
      if (!current) return
      const set = getReadingSet(current.taskId)
      if (!set) throw new Error('Çalışma seti bulunamadı.')
      const reason = current.mode === 'exam' && secondsRemaining(current) === 0 ? 'timeout' : requestReason
      const finalAttempt = finishAttempt(current, set.questions, reason)
      await putRecord('attempts', finalAttempt)
      await deleteRecord('attempts', current.id)
      syncAttempt(finalAttempt)
      setResultFilter('all')
      setScreen('result')
      await loadAll()
      window.dispatchEvent(new Event('ayda:progress-changed'))
    } catch {
      setError('Sonuç kaydedilemedi. Çalışmanız korunuyor; lütfen tekrar deneyin.')
    } finally {
      finishing.current = false
    }
  }

  useEffect(() => {
    if (screen !== 'taking' || attempt?.mode !== 'exam') return
    const tick = () => {
      const stamp = Date.now()
      setNow(stamp)
      const a = attemptRef.current
      if (a && secondsRemaining(a, stamp) === 0) void finish('timeout')
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [screen, attempt?.id, attempt?.endsAt, attempt?.mode])

  useEffect(() => {
    if (screen !== 'taking') return
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [screen, attempt?.currentIndex])

  const set = attempt && getReadingSet(attempt.taskId)
  const question = set && attempt ? set.questions[attempt.currentIndex] : undefined
  const answer = attempt && question ? selectedValue(attempt,question.id) : undefined
  const grade = attempt && set ? gradeAttempt(attempt,set.questions) : undefined
  const marked = Boolean(attempt && question && attempt.flaggedQuestionIds.includes(question.id))
  const count = question && set ? set.questions.filter(q => q.part === question.part).length : 0
  const ordinal = question && set ? set.questions.filter(q => q.part === question.part).findIndex(q => q.id === question.id) + 1 : 0
  const remaining = attempt ? secondsRemaining(attempt,now) : 0
  const titleByPart: Record<1|2|3,string> = { 1:'Durum – İlan Eşleştirme', 2:'Metin – JA / NEIN', 3:'Metin – Resim Eşleştirme' }

  return <div className="lesen-module">
    {error && <div className="lesen-error" role="alert">{error}</div>}
    {screen === 'sets' && <>
      <div className="lesen-intro"><div><span className="lesen-eyebrow">ÖZGÜN A1 OKUMA ÇALIŞMALARI</span><h2>İki set. Üç görev. Gerçek pratik.</h2><p>Her sette ÖSD A1 görev türlerine göre hazırlanmış 16 soru bulunur. Sonuçlar yalnızca bu cihazda kaydedilir.</p></div><div className="lesen-time"><span>LESEN</span><strong>25 dk</strong><small>Sınav modu süresi</small></div></div>
      {loading ? <p className="lesen-hint">Çalışma kayıtları yükleniyor…</p> : readingSets.map((s,index) => <section className="lesen-set-card" key={s.id}>
        <div className="lesen-set-top"><span className="lesen-set-number">0{index+1}</span><div className="lesen-set-title"><h3>{s.title}</h3><p>{s.subtitle}</p></div><span className="lesen-mini-pill">16 SORU</span></div>
        <div className="lesen-topic-pills"><span>5 İlan eşleştirme</span><span>6 JA/NEIN</span><span>5 Resim eşleştirme</span></div>
        <div className="lesen-actions">{(['practice','exam'] as LesenMode[]).map(mode => {
          const old = drafts.find(a => a.id===draftId(s.id,mode))
          const done = history.filter(a => a.taskId===s.id && a.mode===mode).length
          return <button className={mode==='practice'?'lesen-primary':'lesen-secondary'} key={mode} onClick={()=>void start(s,mode)}>
            {old?'Kaldığın yerden: ':''}{mode==='practice'?'Çalışma modu':'25 dk sınav modu'}
            {old && <small>{old.answers.length}/16 yanıt</small>}
            {!old && done>0 && <small>Geçmiş deneme: {done}</small>}
          </button>
        })}</div>
      </section>)}
      {history.length>0 && <section className="lesen-history"><h3>Son tamamladığın çalışmalar</h3>{history.slice(0,5).map(a => <button key={a.id} onClick={()=>{syncAttempt(a);setResultFilter('all');setScreen('result')}}><span><strong>{getReadingSet(a.taskId)?.title}</strong><small>{a.mode==='exam'?'Sınav':'Çalışma'} · {new Date(a.finishedAt!).toLocaleDateString('tr-TR')}</small></span><b>{a.correctCount}/{a.questionCount}</b><span aria-hidden="true">›</span></button>)}</section>}
      <div className="lesen-notice"><strong>Nasıl puanlanıyor?</strong><p>Doğruların 16 soru üzerinden hesaplanır. Resmî ÖSD notu, 30 puanlık sınav değerlendirmesi veya geçme kararı değildir.</p></div>
    </>}

    {screen === 'taking' && set && question && attempt && <>
      <div className="lesen-session-head">
        <button className="lesen-text-button" onClick={()=>{void loadAll();setScreen('sets')}}>‹ Setlere dön</button>
        <div className="lesen-session-right"><span className="lesen-save-status" aria-live="polite">{saving?'Kaydediliyor…':'Cihazda kayıtlı'}</span>{attempt.mode==='exam' ? <strong className={'lesen-clock '+(remaining<120?'urgent':'')} aria-label={'Kalan süre '+formatSeconds(remaining)}>{formatSeconds(remaining)}</strong> : <span className="lesen-mode-tag">ÇALIŞMA</span>}</div>
      </div>
      <div className="lesen-progress-head"><strong>{set.title}</strong><span>{grade?.answered || 0} / 16 yanıt</span></div>
      <div className="lesen-progress-bar"><span style={{width:((grade?.answered||0)/16*100)+'%'}}/></div>
      <nav className="lesen-part-nav" aria-label="Lesen görevleri">{([1,2,3] as const).map(part=><button key={part} aria-current={part===question.part?'step':undefined} className={part===question.part?'active':''} onClick={()=>amend(a=>({...a,currentIndex:set.questions.findIndex(q=>q.part===part),updatedAt:new Date().toISOString()}))}>Aufgabe {part}<small>{part===1?'5 soru':part===2?'6 soru':'5 soru'}</small></button>)}</nav>
      <div className="lesen-question-heading"><div><span className="lesen-eyebrow">AUFGABE {question.part} · {ordinal}/{count}</span><h2>{titleByPart[question.part]}</h2></div><button className={'lesen-mark '+(marked?'is-marked':'')} onClick={()=>amend(a=>({...a,flaggedQuestionIds:marked?a.flaggedQuestionIds.filter(id=>id!==question.id):[...a.flaggedQuestionIds,question.id],updatedAt:new Date().toISOString()}))} aria-pressed={marked}>{marked?'★ İşaretlendi':'☆ İşaretle'}</button></div>
      {question.part===1 && <div className="lesen-instructions"><strong>Situation</strong><p>Lesen Sie die sechs Anzeigen. Welche Anzeige passt zur Situation? Eine Anzeige ist zu viel.</p><div className="lesen-ads">{set.ads.map(item=><article key={item.id} className="lesen-ad"><span>Anzeige {item.id}</span><strong>{item.title}</strong><p>{item.text}</p></article>)}</div></div>}
      {question.part===2 && <div className="lesen-instructions"><strong>Anzeige</strong><p>Lesen Sie den Text. Antworten Sie mit JA oder NEIN.</p>{set.texts.filter(t=>t.id===question.sourceId).map(item=><article className="lesen-reading" key={item.id}><strong>{item.title}</strong><p>{item.text}</p></article>)}</div>}
      {question.part===3 && <div className="lesen-instructions"><strong>Bilder</strong><p>Lesen Sie die fünf Texte. Wählen Sie für jeden Text das passende Bild. Ein Bild ist zu viel.</p></div>}
      <section className="lesen-question-card">
        <div className="lesen-prompt"><span>{question.part===2?'Frage':'Situation'} {question.label}</span><h3 lang="de">{question.prompt}</h3></div>
        {question.part===3 ? <div className="lesen-picture-grid" role="radiogroup" aria-label="Resim seçimi">{set.pictures.map(picture=><label className={'lesen-picture '+(answer===picture.id?'chosen':'')} key={picture.id}><input type="radio" name={'answer-'+question.id} value={picture.id} checked={answer===picture.id} onChange={()=>amend(a=>updateAnswer(a,question.id,picture.id))} aria-label={'Bild '+picture.id+', '+picture.alt}/><Picture kind={picture.kind}/><span>Bild {picture.id}</span><span className="lesen-select-dot" aria-hidden="true"/></label>)}</div> :
        <div className={'lesen-choices '+(question.part===2?'yesno':'')} role="radiogroup" aria-label="Cevap seçenekleri">{(question.part===1?set.ads.map(a=>({id:a.id,label:'Anzeige '+a.id})): [{id:'JA',label:'JA'},{id:'NEIN',label:'NEIN'}]).map(option=><label className={'lesen-choice '+(answer===option.id?'chosen':'')} key={option.id}><input type="radio" checked={answer===option.id} name={'answer-'+question.id} value={option.id} onChange={()=>amend(a=>updateAnswer(a,question.id,option.id))}/><span>{option.label}</span><span className="lesen-select-dot" aria-hidden="true"/></label>)}</div>}
        {answer && attempt.mode==='practice' && <div className={'lesen-feedback '+(answer===question.answer?'correct':'incorrect')} role="status">
          <strong>{answer===question.answer?'✓ Doğru!':'Bu cevabı yeniden değerlendirebilirsin.'}</strong>
          <p>{answer===question.answer?'':'Doğru cevap: '+(question.part===2?'':question.part===1?'Anzeige ':'Bild ')+question.answer+'. '}{question.explanation}</p>
        </div>}
        {attempt.mode==='exam' && <p className="lesen-exam-note">Sınav modunda doğru cevaplar bitirdikten sonra gösterilir.</p>}
      </section>
      <div className="lesen-question-nav">
        <button className="lesen-secondary" disabled={attempt.currentIndex===0} onClick={()=>amend(a=>({...a,currentIndex:Math.max(0,a.currentIndex-1),updatedAt:new Date().toISOString()}))}>‹ Önceki</button>
        {attempt.currentIndex===set.questions.length-1 ? <button className="lesen-primary" onClick={()=>void finish('submitted')}>Çalışmayı bitir ✓</button> : <button className="lesen-primary" onClick={()=>amend(a=>({...a,currentIndex:Math.min(set.questions.length-1,a.currentIndex+1),updatedAt:new Date().toISOString()}))}>Sonraki ›</button>}
      </div>
      <div className="lesen-map-title"><strong>Sorular</strong><span>Dokunarak git · Yıldızlılar işaretli</span></div>
      <div className="lesen-question-map" role="group" aria-label="Sorulara hızlı geçiş">{set.questions.map((q,i)=><button key={q.id} className={(i===attempt.currentIndex?'current ':'')+(selectedValue(attempt,q.id)?'answered ':'')+(attempt.flaggedQuestionIds.includes(q.id)?'flagged':'')} aria-label={'Soru '+(i+1)+(selectedValue(attempt,q.id)?' cevaplandı':' cevaplanmadı')+(attempt.flaggedQuestionIds.includes(q.id)?' işaretli':'')} aria-current={i===attempt.currentIndex?'step':undefined} onClick={()=>amend(a=>({...a,currentIndex:i,updatedAt:new Date().toISOString()}))}>{i+1}{attempt.flaggedQuestionIds.includes(q.id)?'★':''}</button>)}</div>
      <div className="lesen-end-row"><span>{grade?.unanswered||0} yanıtlanmamış soru var.</span><button onClick={()=>void finish('submitted')} disabled={finishing.current}>Bitir ve sonucu gör</button></div>
    </>}

    {screen === 'result' && attempt && set && grade && <>
      <button className="lesen-text-button" onClick={()=>{void loadAll();setScreen('sets')}}>‹ Setlere dön</button>
      <section className="lesen-result">
        <span className="lesen-eyebrow">{attempt.mode==='exam'?'SINAV MODU':'ÇALIŞMA MODU'} · {set.title}</span>
        <div className="lesen-score"><strong>{grade.correct}</strong><span>/ {grade.total} doğru</span></div>
        <h2>{attempt.completionReason==='timeout'?'Süre doldu, yanıtların kaydedildi.':'Çalışma tamamlandı'}</h2>
        <p>Bu sonuç sadece kendi cevaplarına dayanır. ÖSD'nin resmî 30 puanlık Lesen notu değildir.</p>
        <div className="lesen-result-counts"><span><b>{grade.correct}</b> Doğru</span><span><b>{grade.wrong}</b> Yanlış</span><span><b>{grade.unanswered}</b> Boş</span></div>
        <div className="lesen-result-parts">{([1,2,3] as const).map(part=><div key={part}><span>Aufgabe {part}</span><strong>{set.questions.filter(q=>q.part===part && selectedValue(attempt,q.id)===q.answer).length} / {set.questions.filter(q=>q.part===part).length}</strong></div>)}</div>
      </section>
      <div className="lesen-review-top"><h3>Cevap açıklamaları</h3><div role="group" aria-label="Açıklama filtresi"><button aria-pressed={resultFilter==='all'} className={resultFilter==='all'?'active':''} onClick={()=>setResultFilter('all')}>Tümü</button><button aria-pressed={resultFilter==='wrong'} className={resultFilter==='wrong'?'active':''} onClick={()=>setResultFilter('wrong')}>Yanlışlar ({grade.wrong})</button></div></div>
      {set.questions.filter(q=>resultFilter==='all'||(selectedValue(attempt,q.id)&&selectedValue(attempt,q.id)!==q.answer)).map(q=><article className="lesen-review-item" key={q.id}><div className="lesen-review-label"><span>Aufgabe {q.part} · {q.label}</span><b className={!selectedValue(attempt,q.id)?'neutral':selectedValue(attempt,q.id)===q.answer?'good':'bad'}>{!selectedValue(attempt,q.id)?'Boş':selectedValue(attempt,q.id)===q.answer?'Doğru':'Yanlış'}</b></div><strong lang="de">{q.prompt}</strong><p>Senin cevabın: <b>{selectedValue(attempt,q.id)||'—'}</b> · Doğru: <b>{q.answer}</b></p><small>{q.explanation}</small></article>)}
      {resultFilter==='wrong'&&grade.wrong===0&&<p className="lesen-hint">Yanlış cevabın yok. Diğer soruların açıklamalarını da inceleyebilirsin.</p>}
      <button className="lesen-primary lesen-full" onClick={()=>{void loadAll();setScreen('sets')}}>Diğer çalışma setleri</button>
    </>}
  </div>
}

export function LesenMistakes() {
  const [items, setItems] = useState<{ attempt: LesenAttempt; question: ReadingQuestion; answer: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(()=>{
    let active=true
    listRecords<LesenAttempt>('attempts').then(rows=>{
      if (!active) return
      const complete = rows.filter(a=>isLesen(a)&&isFinished(a)).sort((a,b)=>(b.finishedAt||'').localeCompare(a.finishedAt||''))
      const wrong = complete.flatMap(a=>{
        const s=getReadingSet(a.taskId)
        return (s?.questions||[]).filter(q=>selectedValue(a,q.id)&&selectedValue(a,q.id)!==q.answer)
          .map(question=>({attempt:a,question,answer:selectedValue(a,question.id)!}))
      })
      setItems(wrong)
    }).catch(()=>{if(active)setError('Yanlış cevap geçmişi okunamadı.')})
      .finally(()=>{if(active)setLoading(false)})
    return ()=>{active=false}
  },[])
  return <div className="lesen-module"><div className="lesen-intro mini"><div><span className="lesen-eyebrow">AŞAMA 2 · LESEN</span><h2>Okuma yanlışlarım</h2><p>Tamamlanmış Lesen çalışmalarındaki gerçek yanlış cevaplar. Boş bırakılan sorular yanlış sayılmaz.</p></div></div>
    {error&&<div className="lesen-error" role="alert">{error}</div>}
    {loading?<p>Geçmiş yükleniyor…</p>:items.length===0?<div className="lesen-notice"><strong>Henüz kaydedilmiş bir yanlış cevap yok.</strong><p>Lesen çalışmasını tamamladıktan sonra yanlışlarını burada inceleyebilirsin.</p></div>:<><p className="lesen-count-line">{items.length} yanlış cevap kaydı (aynı soru farklı denemelerde tekrar edebilir)</p>{items.map((item,i)=><article className="lesen-review-item" key={item.attempt.id+'-'+item.question.id+'-'+i}><div className="lesen-review-label"><span>{getReadingSet(item.attempt.taskId)?.title} · Aufgabe {item.question.part}</span><b className="bad">{new Date(item.attempt.finishedAt!).toLocaleDateString('tr-TR')}</b></div><strong lang="de">{item.question.prompt}</strong><p>Senin cevabın: <b>{item.answer}</b> · Doğru cevap: <b>{item.question.answer}</b></p><small>{item.question.explanation}</small></article>)}</>}
  </div>
}
