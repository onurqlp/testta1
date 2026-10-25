import { describe, expect, it } from 'vitest'
import { readingSets, validateReadingSets } from './content'
import { draftId, finishAttempt, gradeAttempt, makeAttempt, secondsRemaining, updateAnswer } from './logic'

describe('ÖSD A1 özgün Lesen setleri', () => {
  it('iki eksiksiz 3 parçalı / 16 soruluk set içerir', () => {
    expect(readingSets).toHaveLength(2)
    expect(validateReadingSets()).toEqual([])
    expect(readingSets.map(s => s.questions.length)).toEqual([16,16])
  })
  it('cevap anahtarları 1-6, JA/NEIN biçimini kullanır', () => {
    for (const set of readingSets) for (const q of set.questions)
      expect(q.part === 2 ? ['JA','NEIN'] : ['1','2','3','4','5','6']).toContain(q.answer)
  })
})
describe('Lesen oturumu ve puan', () => {
  const set = readingSets[0]
  it('sınavı 25 dakika ile başlatır ve zaman farkıyla sürdürür', () => {
    const a = makeAttempt(set,'exam',1000000)
    expect(secondsRemaining(a,1000000)).toBe(1500)
    expect(secondsRemaining(a,1060000)).toBe(1440)
    expect(secondsRemaining(a,3000000)).toBe(0)
  })
  it('çalışma modunda süre sınırı yoktur', () => {
    const a = makeAttempt(set,'practice')
    expect(a.endsAt).toBeUndefined()
    expect(a.mode).toBe('practice')
  })
  it('gerçek doğru, yanlış ve yanıtsız soruları ayrı sayar', () => {
    let a = makeAttempt(set,'practice')
    const [first,second] = set.questions
    a = updateAnswer(a,first.id,first.answer)
    a = updateAnswer(a,second.id,'6')
    expect(gradeAttempt(a,set.questions)).toMatchObject({correct:1,wrong:1,unanswered:14,answered:2})
    const finished = finishAttempt(a,set.questions,'submitted',2500000)
    expect(finished.finishedAt).toBeTruthy()
    expect(finished.correctCount).toBe(1)
    expect(finished.answeredCount).toBe(2)
    expect(finished.questionCount).toBe(16)
    expect(finished.id).not.toBe(draftId(set.id,'practice'))
  })
  it('bir soru tekrar yanıtlandığında çift saymaz', () => {
    let a = makeAttempt(set,'practice')
    a = updateAnswer(a,set.questions[0].id,'6')
    a = updateAnswer(a,set.questions[0].id,set.questions[0].answer)
    expect(a.answers).toHaveLength(1)
    expect(gradeAttempt(a,set.questions).correct).toBe(1)
  })
})
