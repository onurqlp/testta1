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
    detail: 'Beş özgün form ve kişisel e-posta seti, cihaz üstünde kural kontrolü, sürüm geri yükleme ve kalıcı taslak.'
  },
  {
    id: 'sprechen', title: 'Sprechen', subtitle: 'Konuşma', summary: 'Redemittel ve prova',
    stage: 5, accent: 'mint',
    detail: 'İki özgün ÖSD A1 sözlü prova seti, altı durum çizimi, Redemittel, cihazda saklanan mikrofon kayıtları.'
  }
]

export const findModule = (id: string) => modules.find((module) => module.id === id)
