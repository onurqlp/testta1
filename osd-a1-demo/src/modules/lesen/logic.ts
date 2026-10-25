import type { Answer } from '../../storage/models'
import type { ReadingQuestion, ReadingSet } from './content'

export type LesenMode = 'practice' | 'exam'
export interface LesenAttempt {
  id: string
  module: 'lesen'
  taskId: string
  mode: LesenMode
  startedAt: string
  updatedAt: string
  finishedAt?: string
  endsAt?: string
  completionReason?: 'submitted' | 'timeout'
  currentIndex: number
  flaggedQuestionIds: string[]
  answers: Answer[]
  answeredCount?: number
  correctCount?: number
  questionCount?: number
}

export const EXAM_SECONDS = 25 * 60
export const draftId = (setId: string, mode: LesenMode) => 'lesen:' + setId + ':' + mode + ':active'
export const selectedValue = (attempt: LesenAttempt, id: string) =>
  attempt.answers.find(answer => answer.questionId === id)?.value as string | undefined

export function makeAttempt(set: ReadingSet, mode: LesenMode, at: number = Date.now()): LesenAttempt {
  const stamp = new Date(at).toISOString()
  return {
    id: draftId(set.id, mode), module: 'lesen', taskId: set.id, mode, startedAt: stamp,
    updatedAt: stamp, endsAt: mode === 'exam' ? new Date(at + EXAM_SECONDS * 1000).toISOString() : undefined,
    currentIndex: 0, flaggedQuestionIds: [], answers: []
  }
}
export function updateAnswer(attempt: LesenAttempt, questionId: string, value: string): LesenAttempt {
  return {
    ...attempt,
    updatedAt: new Date().toISOString(),
    answers: [...attempt.answers.filter(answer => answer.questionId !== questionId), { questionId, value }]
  }
}
export function gradeAttempt(attempt: LesenAttempt, questions: ReadingQuestion[]) {
  const answered = questions.filter(q => !!selectedValue(attempt, q.id))
  const correct = answered.filter(q => selectedValue(attempt, q.id) === q.answer)
  const wrong = answered.filter(q => selectedValue(attempt, q.id) !== q.answer)
  return {
    correct: correct.length,
    wrong: wrong.length,
    unanswered: questions.length - answered.length,
    answered: answered.length,
    total: questions.length,
    wrongQuestionIds: wrong.map(q => q.id)
  }
}
export function finishAttempt(attempt: LesenAttempt, questions: ReadingQuestion[], reason: 'submitted' | 'timeout', at: number = Date.now()): LesenAttempt {
  const result = gradeAttempt(attempt, questions)
  return {
    ...attempt,
    id: 'lesen:' + attempt.taskId + ':' + attempt.mode + ':finished:' + at,
    updatedAt: new Date(at).toISOString(), finishedAt: new Date(at).toISOString(),
    completionReason: reason, answeredCount: result.answered, correctCount: result.correct,
    questionCount: result.total
  }
}
export function secondsRemaining(attempt: LesenAttempt, now: number = Date.now()): number {
  if (!attempt.endsAt || attempt.mode === 'practice' || attempt.finishedAt) return EXAM_SECONDS
  return Math.max(0, Math.ceil((new Date(attempt.endsAt).getTime() - now) / 1000))
}
export function formatSeconds(seconds: number): string {
  return String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0')
}
