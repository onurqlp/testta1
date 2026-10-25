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
    detail: 'Özgün okuma metinleri, soru çözme, cevap açıklamaları ve yanlış takibi Aşama 2’de etkinleşecek.'
  },
  {
    id: 'hoeren', title: 'Hören', subtitle: 'Dinleme', summary: 'Dinle, anla, cevapla',
    stage: 3, accent: 'purple',
    detail: 'Gerçek ses dosyaları, oynatma kuralları ve dinleme soruları Aşama 3’te eklenecek. Şu anda ses oynatımı yok.'
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
