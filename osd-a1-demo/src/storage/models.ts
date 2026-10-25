import type { ModuleId } from '../data/modules'

export type ExamSection = ModuleId

export interface Task {
  id: string
  module: ExamSection
  kind: string
  title: string
  version: number
}

export interface Question {
  id: string
  taskId: string
  prompt: string
  options?: { id: string; text: string }[]
}

export interface Answer {
  questionId: string
  value: string | string[]
}

export interface Attempt {
  id: string
  module: ExamSection
  taskId: string
  mode: 'practice' | 'exam'
  startedAt: string
  updatedAt: string
  finishedAt?: string
  answers: Answer[]
  correctCount?: number
  answeredCount?: number
  questionCount?: number
}

export interface Correction {
  id: string
  category: 'error' | 'suggestion' | 'info'
  messageTr: string
  start?: number
  end?: number
  replacement?: string
}

export interface SavedDraft {
  id: string
  taskId: string
  text: string
  updatedAt: string
}

export interface AudioAsset {
  id: string
  taskId: string
  src: string
  rights: string
}

export interface SpeakingPrompt {
  id: string
  taskId: string
  instructionsDe: string
  helpTr: string
}

export interface LearningProgress {
  module: ExamSection
  lastTaskId?: string
  completedTaskIds: string[]
  updatedAt: string
}

export interface ExamSession {
  id: string
  startedAt: string
  completedAt?: string
  currentModule: ExamSection
  remainingSeconds?: number
}

export interface TeacherService {
  id: string
  title: string
  feeTry?: number
  demoOnly: true
}

export interface BookingRequest {
  id: string
  serviceId: string
  requestedAt: string
  preferredTime?: string
  status: 'demo-request'
}

export interface TeacherReviewRequest {
  id: string
  draftId: string
  requestedAt: string
  status: 'demo-request'
}

export interface LastView {
  path: string
  updatedAt: string
}

export interface ProgressOverview {
  completed: number
  attempts: number
  wrong: number
}
