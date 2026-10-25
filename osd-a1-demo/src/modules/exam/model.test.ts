import {describe,expect,it} from 'vitest'
import {answerExam,completePart,examCounts,finishHearingPlayback,hearingCanPlay,hearingResult,newExam,pauseExam,
 playHearing,readingResult,remaining,resumeExam,startSpeakingPerformance,suggestedRetakes} from './model'
import {readingSets} from '../lesen/content'
describe('A1 birleşik deneme',()=>{
 it('iki setin her birinde dört gerçek bölüm var',()=>{
  for(const n of [0,1] as const){const x=newExam(n,1000000);expect(x.part).toBe('lesen')
   expect(readingResult(x).total).toBe(readingSets[n].questions.length)
   expect(hearingResult(x).total).toBe(15);expect(x.sections.sprechen.startedAt).toBeUndefined()}
 })
 it('resmî yazılı süreleri ve sözlü 10+10 hazırlığı',()=>{
  let x=newExam(0,1000000)
  expect(remaining(x,1000000)).toBe(1500)
  x=completePart(x,2500000);expect(x.part).toBe('hoeren');expect(remaining(x,2500000)).toBe(600)
  x=completePart(x,3100000);expect(x.part).toBe('schreiben');expect(remaining(x,3100000)).toBe(1200)
  x=completePart(x,4300000);expect(x.part).toBe('sprechen');expect(x.speaking.phase).toBe('prep')
  expect(remaining(x,4300000)).toBe(600)
  x=startSpeakingPerformance(x,4900000);expect(x.speaking.phase).toBe('speech')
  expect(remaining(x,4900000)).toBe(600)
  x=completePart(x,5500000);expect(x.status).toBe('finished')
 })
 it('ara verince saat donar; yenileme aktif saati sıfırlamaz',()=>{
  let x=newExam(0,1000000)
  x=pauseExam(x,1100000);expect(remaining(x,1900000)).toBe(1400)
  x=resumeExam(x,2000000);expect(remaining(x,2000000)).toBe(1400)
  expect(remaining(x,2050000)).toBe(1350)
  expect(remaining(JSON.parse(JSON.stringify(x)),2100000)).toBe(1300)
 })
 it('tamamlanmadan otomatik başarı kaydı yoktur, boşlar yanlışa yazılmaz',()=>{
  let x=newExam(0,1000000)
  const q=readingSets[0].questions[0]
  x=answerExam(x,q.id,q.answer,1000001)
  const r=readingResult(x)
  expect(r.correct).toBe(1);expect(r.wrong).toBe(0)
  expect(r.blank).toBe(r.total-1)
  expect(examCounts(x).completedParts).toBe(0)
 })
 it('dinleme birinci görev 1, ikinci 2 hak kullanır',()=>{
  let x=newExam(0,1000000);x=completePart(x,2500000)
  x=playHearing(x,1);expect(hearingCanPlay(x,1)).toBe(true)
  x=finishHearingPlayback(x,1);expect(hearingCanPlay(x,1)).toBe(false)
  x=playHearing(x,2);x=finishHearingPlayback(x,2)
  expect(hearingCanPlay(x,2)).toBe(true)
  x=playHearing(x,2);x=finishHearingPlayback(x,2)
  expect(hearingCanPlay(x,2)).toBe(false)
 })
 it('gerçek kayıtlara göre tekrar önerir, sahte puan üretmez',()=>{
  const x=newExam(0,1000000)
  expect(suggestedRetakes(x)).toEqual(['lesen','hoeren','schreiben','sprechen'])
  expect(x).not.toHaveProperty('correctCount')
 })
})
