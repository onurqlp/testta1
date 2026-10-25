import {describe,expect,it} from 'vitest'
import {getSpeakingSet,phraseBank,speakingSets,validateSpeakingSets} from './content'
import {durationText,finishSession,makeAttempt,makeSession,recordingId,remainingSeconds,toggleTopic} from './model'
describe('Özgün ZA1 Sprechen görevleri',()=>{
 it('2 tam set, 6 farklı çizim konusu, 3 görev ve 3 turlu rol oyunu var',()=>{
  expect(speakingSets).toHaveLength(2);expect(validateSpeakingSets()).toEqual([])
  for(const s of speakingSets){expect(s.themes).toHaveLength(6);expect(s.scenes).toHaveLength(3);
   for(const scene of s.scenes)expect(scene.prompts).toHaveLength(3)}
  expect(getSpeakingSet('sprechen-unterwegs-02')?.scenes[2].title).toContain('Feier')
 })
 it('3 aşamada kullanılabilir konuşma kalıpları var',()=>{
  for(const p of [1,2,3] as const)expect(phraseBank[p].length).toBeGreaterThan(4)
 })
 it('toplam 4 kişisel konu seçilebilir',()=>{
  let s=makeSession(speakingSets[0],'practice',100)
  for(const id of speakingSets[0].themes.map(x=>x.id))s=toggleTopic(s,id)
  expect(s.selectedTopics).toHaveLength(4)
  s=toggleTopic(s,s.selectedTopics[0]);expect(s.selectedTopics).toHaveLength(3)
 })
 it('yaklaşık 10 dakika timer gerçek saat üzerinden sürer',()=>{
  const s=makeSession(speakingSets[0],'timed',1000000)
  expect(remainingSeconds(s,1000000)).toBe(600)
  expect(remainingSeconds(s,1060000)).toBe(540)
  expect(remainingSeconds(s,2000000)).toBe(0)
  expect(durationText(65)).toBe('01:05')
 })
 it('kayıt anahtarları göreve göre farklıdır',()=>{
  const s=makeSession(speakingSets[0],'practice',100)
  expect(recordingId(s.id,1)).not.toEqual(recordingId(s.id,2))
 })
 it('tamamlanan konuşmaya puan uydurulmaz',()=>{
  const s=finishSession(makeSession(speakingSets[0],'practice',1000000),1300000)
  const a=makeAttempt(s)
  expect(a).not.toHaveProperty('correctCount')
  expect(a.finishedAt).toBeDefined()
 })
})
