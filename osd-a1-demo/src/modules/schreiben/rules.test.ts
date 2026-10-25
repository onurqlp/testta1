import {describe,it,expect} from 'vitest'
import {writingTasks,validateWritingTasks} from './content'
import {analyzeEmail,applyFix,checkForm,getHighlightSpans,wordCount} from './rules'
import {newDraft,reviseDraft,snapshotDraft,restoreSnapshot,countDown,finishDraft,makeWritingAttempt} from './model'

describe('ÖSD A1 Schreiben özgün 5 set',()=>{
 it('her set: 10 form alanı ve 3 gerçek soru',()=>{
   expect(writingTasks).toHaveLength(5)
   expect(validateWritingTasks()).toEqual([])
 })
 it('form boş/değer eşleştirme ve seçimi yanlış başarı olarak sunmaz',()=>{
  const task=writingTasks[0]
  const result=checkForm(task,{vorname:'lara',nachname:'BergER',kurs:'Vormittagskurs'})
  expect(result.find(x=>x.fieldId==='vorname')?.status).toBe('matches')
  expect(result.find(x=>x.fieldId==='kurs')?.status).toBe('review')
  expect(result.find(x=>x.fieldId==='geburtsdatum')?.status).toBe('empty')
 })
 it('yüksek güvenli düzeltmeleri metin içinde işaretler',()=>{
  const task=writingTasks[0],sample='Hallo Nina, ichh bist da. Ich komen morgen! Liebe Grüße'
  const issues=analyzeEmail(sample,task)
  expect(issues.filter(i=>i.severity==='error').length).toBeGreaterThan(1)
  const issue=issues.find(x=>x.id==='spell-ichh')!
  expect(issue.safeToApply).toBe(true)
  expect(applyFix(sample,issue)).toContain('ich bist')
  expect(getHighlightSpans(sample,issues).filter(s=>s.issue).length).toBeGreaterThan(1)
 })
 it('doğru kısa metinde yüksek güvenli hata üretmez',()=>{
  const task=writingTasks[0]
  const correct='Liebe Nina, ich komme am Samstag um 14 Uhr. Ich bleibe zwei Stunden. Ich bringe meine Schwester mit. Liebe Grüße, Lara'
  expect(analyzeEmail(correct,task).filter(x=>x.severity==='error')).toEqual([])
  expect(wordCount(correct)).toBeGreaterThan(20)
 })
 it('anlamı doğrulama iddiası yoktur; yalnız ipucu gösterir',()=>{
  const task=writingTasks[1]
  const issues=analyzeEmail('Hallo Tom, danke für deine Nachricht. Ich fahre morgen in Urlaub. Viele Grüße, Paul',task)
  expect(issues.filter(x=>x.id.startsWith('prompt-')).every(x=>x.severity==='info'&&x.confidence==='low')).toBe(true)
 })
 it('öğrenci metninde uygulanamaz öneriyi sessizce değiştirmez',()=>{
  const str='Hallo!';const bad=analyzeEmail(str,writingTasks[0]).find(x=>x.id==='length')!
  expect(applyFix(str,bad)).toBe(str)
 })
})
describe('taslak ve süre',()=>{
 it('20 dakikalık süre gerçek tarih üzerinden hesaplanır',()=>{
  const d=newDraft(writingTasks[0].id,'timed',1000000)
  expect(countDown(d,1000000)).toBe(1200)
  expect(countDown(d,1060000)).toBe(1140)
  expect(countDown(d,5000000)).toBe(0)
 })
 it('eski taslağa sürümden döner ve biten çalışmaya sahte puan koymaz',()=>{
  const a=reviseDraft(newDraft(writingTasks[0].id,'practice'),{email:'Önceki metin'})
  const b=snapshotDraft(a,1000000)
  const c=restoreSnapshot(reviseDraft(b,{email:'Yeni metin'}),b.snapshots[0].id)
  expect(c.email).toBe('Önceki metin')
  const finished=makeWritingAttempt(finishDraft(c))
  expect(finished).not.toHaveProperty('correctCount')
  expect(finished.writing.email).toBe('Önceki metin')
 })
})
