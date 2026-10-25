import {describe,expect,it} from 'vitest'
import {computeProgress} from './model'
import {newExam,completePart,answerExam} from '../exam/model'
import {readingSets} from '../lesen/content'
import type {Attempt} from '../../storage/models'
describe('İlerleme verisi ve kayıt sayımı',()=>{
 it('boş kayıtlar grafik ve başarı üretmez',()=>{
  const x=computeProgress([],[],[],[],Date.UTC(2026,9,25))
  expect(x.correct).toBe(0);expect(x.wrong).toBe(0);expect(x.finishedCount).toBe(0)
  expect(x.activity.every(d=>d.count===0)).toBe(true);expect(x.recommendations).toEqual([])
 })
 it('gerçek yanıt, boş/yanlış farkı ve tamamlanmış denemeyi sayar',()=>{
  let e=newExam(0,Date.UTC(2026,9,25))
  e=answerExam(e,readingSets[0].questions[0].id,readingSets[0].questions[0].answer)
  for(let i=0;i<5;i++)e=completePart(e,Date.UTC(2026,9,25)+i*1000000)
  expect(e.status).toBe('finished')
  const p=computeProgress([],[],[],[e],Date.UTC(2026,9,25)+5000000)
  expect(p.examFinished).toBe(1);expect(p.correct).toBe(1)
  expect(p.wrong).toBe(0);expect(p.blank).toBeGreaterThan(20)
  expect(p.activity.some(d=>d.count===1)).toBe(true)
 })
 it('yazı ve sözlü denemelere icat edilmiş puan eklenmez',()=>{
  const a:Attempt={id:'x',module:'schreiben',taskId:'mail1',mode:'practice',startedAt:'2026-10-25T00:00:00Z',
   updatedAt:'2026-10-25T00:00:00Z',finishedAt:'2026-10-25T01:00:00Z',answers:[]}
  const p=computeProgress([a],[],[],[],Date.UTC(2026,9,25))
  expect(p.finishedCount).toBe(1);expect(p.skills.find(x=>x.module==='schreiben')?.graded).toBe(0)
  expect(p.correct).toBe(0)
 })
 it('sadece bitmiş girişler haftalık grafikte yer alır',()=>{
  const a:Attempt={id:'x',module:'lesen',taskId:'r1',mode:'practice',startedAt:'2026-10-25T00:00:00Z',
   updatedAt:'2026-10-25T00:00:00Z',answers:[]}
  const p=computeProgress([a],[],[],[],Date.UTC(2026,9,25))
  expect(p.finishedCount).toBe(0);expect(p.activeCount).toBe(1)
  expect(p.activity.reduce((sum,d)=>sum+d.count,0)).toBe(0)
 })
})
