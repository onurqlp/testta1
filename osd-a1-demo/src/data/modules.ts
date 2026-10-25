export type ModuleId = 'lesen' | 'hoeren' | 'schreiben' | 'sprechen'
export type Stage = 2 | 3 | 4 | 5

export interface StudyModule {
  id: ModuleId
  title: string
  subtitle: string
  summary: string
  stage: Stage
  accent: 'blue' | 'purple' | 'gold' | 'mint'
  detail: string
}

export const modules: StudyModule[] = [
  {
    id: 'lesen', title: 'Lesen', subtitle: 'Okuma', summary: 'Kısa metinler ve sorular',
    stage: 2, accent: 'blue',
    detail: 'ÖSD A1 düzeninde iki özgün set, çalışma ve süreli sınav seçenekleri, açıklamalar ve yanlış takibi.'
  },
  {
    id: 'hoeren', title: 'Hören', subtitle: 'Dinleme', summary: 'Dinle, anla, cevapla',
    stage: 3, accent: 'purple',
    detail: 'İki ÖSD A1 dinleme seti, gerçek Almanca MP3 sesler, transkript, dinleme hakları ve kalıcı kayıt.'
  },
  {
    id: 'schreiben', title: 'Schreiben', subtitle: 'Yazma', summary: 'Form ve kısa e-posta',
    stage: 4, accent: 'gold',
    detail: 'Form doldurma, kısa e-posta çalışmaları, yerel düzeltme önerileri ve taslak kaydı Aşama 4’te açılacak.'
  },
  {
    id: 'sprechen', title: 'Sprechen', subtitle: 'Konuşma', summary: 'Redemittel ve prova',
    stage: 5, accent: 'mint',
    detail: 'Özgün konuşma görevleri, kalıplar ve cihaz üstü ses kaydı Aşama 5’te eklenecek. Yapay zekâ puanı kullanılmayacak.'
  }
]

export const findModule = (id: string) => modules.find((module) => module.id === id)
