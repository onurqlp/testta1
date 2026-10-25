import { describe, expect, it } from 'vitest'
import { hearingSets, validateHearingSets, matchesAnswer } from './content'
import {canReplay,completePlayback,countResults,draftId,finishAttempt,hasPendingPlayback,makeAttempt,registerPlay,rememberPlayback,remaining,updateAnswer} from './logic'

describe('ÖSD A1 Hören özgün içerik',()=>{
 it('iki set / 3 görev / toplam 30 soru',()=>{
   expect(hearingSets).toHaveLength(2)
   expect(validateHearingSets()).toEqual([])
   expect(hearingSets.map(s=>s.units.flatMap(u=>u.questions).length)).toEqual([15,15])
 })
 it('her görevde beş soru ve medya bağlantısı bulunur',()=>{
   for(const s of hearingSets)for(const u of s.units){
     expect(u.questions).toHaveLength(5)
     expect(u.audio).toMatch(/\.mp3$/)
     expect(u.transcript.length).toBeGreaterThan(80)
   }
 })
 it('düz yazı cevap varyasyonları doğru değerlendirilir',()=>{
   const q=hearingSets[0].units[1].questions[1]
   expect(matchesAnswer(q,'18:00')).toBe(true)
   expect(matchesAnswer(q,'achtzehn Uhr')).toBe(true)
   expect(matchesAnswer(q,'20')).toBe(false)
 })
})
describe('ÖSD A1 dinleme denemesi',()=>{
 const set=hearingSets[0]
 it('10 dakika demo sayacı sekme yenilense dahi zamana göre çalışır',()=>{
   const a=makeAttempt(set,'exam',1000000)
   expect(remaining(a,1000000)).toBe(600)
   expect(remaining(a,1060000)).toBe(540)
   expect(remaining(a,4000000)).toBe(0)
 })
 it('sınavda 1 / 2 / 1 oynatma hakkını aşmaz',()=>{
   let a=makeAttempt(set,'exam')
   a=registerPlay(a,1)
   expect(canReplay(a,1)).toBe(true) // yarım kalan aynı ses sürdürülebilir
   expect(registerPlay(a,1).plays[1]).toBe(1)
   a=rememberPlayback(a,1,4)
   expect(a.audioPositions[1]).toBe(4)
   a=completePlayback(a,1)
   expect(hasPendingPlayback(a,1)).toBe(false)
   expect(canReplay(a,1)).toBe(false)
   a=registerPlay(a,2)
   expect(canReplay(a,2)).toBe(true)
   a=registerPlay(a,2)
   a=completePlayback(a,2)
   a=completePlayback(a,2)
   expect(canReplay(a,2)).toBe(false)
   a=registerPlay(a,3)
   a=completePlayback(a,3)
   expect(canReplay(a,3)).toBe(false)
 })
 it('çalışma modunda tekrar sınırsızdır',()=>{
   let a=makeAttempt(set,'practice')
   for(let i=0;i<5;i++)a=registerPlay(a,1)
   expect(canReplay(a,1)).toBe(true)
 })
 it('doğru, yanlış ve cevaplanmamış soruları ayrı tutar',()=>{
   let a=makeAttempt(set,'practice')
   const [correct,wrong]=set.units[0].questions
   a=updateAnswer(a,correct.id,correct.answer)
   a=updateAnswer(a,wrong.id,'6')
   expect(countResults(a,set)).toMatchObject({total:15,answered:2,correct:1,wrong:1,unanswered:13})
   const ended=finishAttempt(a,'submitted',3500000)
   expect(ended.id).not.toBe(draftId(set.id,'practice'))
   expect(ended.correctCount).toBe(1)
   expect(ended.answeredCount).toBe(2)
   expect(ended.questionCount).toBe(15)
 })
})
