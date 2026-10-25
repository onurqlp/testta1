// AYDA tarafından hazırlanan özgün A1 soruları. Resmî ÖSD soru metinleri değildir.
export type LesenPart = 1 | 2 | 3
export type AnswerCode = '1' | '2' | '3' | '4' | '5' | '6' | 'JA' | 'NEIN'
export interface ReadingQuestion {
  id: string
  part: LesenPart
  label: string
  sourceId?: string
  prompt: string
  answer: AnswerCode
  explanation: string
}
export interface ReadingNotice { id: string; title: string; text: string }
export type PictureKind = 'bus' | 'bakery' | 'post' | 'doctor' | 'park' | 'library' |
  'train' | 'hotel' | 'clothes' | 'cinema' | 'restaurant' | 'pool'
export interface ReadingPicture { id: string; kind: PictureKind; alt: string }
export interface ReadingSet {
  id: string
  title: string
  subtitle: string
  ads: ReadingNotice[]
  texts: ReadingNotice[]
  pictures: ReadingPicture[]
  questions: ReadingQuestion[]
}

export const readingSets: ReadingSet[] = [
  {
    id: 'a1-lesen-alltag-01',
    title: 'Set 1 · Günlük Hayat',
    subtitle: 'Kurs, alışveriş, ulaşım ve günlük ihtiyaçlar',
    ads: [
      { id: '1', title: 'Sprachschule Morgen', text: 'Deutsch für Anfänger. Montag und Mittwoch von 18 bis 20 Uhr. Kleine Gruppen, jetzt anmelden!' },
      { id: '2', title: 'Fahrrad-Werkstatt Kurt', text: 'Ihr Rad ist kaputt? Wir reparieren Bremsen und Reifen. Montag bis Freitag, 9–17 Uhr.' },
      { id: '3', title: 'Kinderpraxis Dr. Roth', text: 'Arzt für Kinder. Termine am Vormittag und am Nachmittag. Anmeldung unter 030 45 67 80.' },
      { id: '4', title: 'Obstmarkt am Platz', text: 'Frische Äpfel, Birnen, Tomaten und Salat. Jeden Tag von 8 bis 14 Uhr.' },
      { id: '5', title: 'Stadtbibliothek', text: 'Bücher lesen und kostenlos ausleihen. Dienstag bis Samstag geöffnet. Bibliothekskarte bitte mitbringen.' },
      { id: '6', title: 'Kino Licht', text: 'Heute um 20 Uhr: Ein Film für die ganze Familie. Karten ab 7 Euro.' }
    ],
    texts: [
      { id: 't1', title: 'Schwimmbad Sonne', text: 'Das Schwimmbad ist von Dienstag bis Sonntag von 9 bis 19 Uhr geöffnet. Am Montag ist es geschlossen. Kinder unter sechs Jahren zahlen nichts.' },
      { id: 't2', title: 'Nachricht von Emil', text: 'Hallo Mia! Mein Zug aus Salzburg kommt heute um 17:30 Uhr an. Ich warte vor dem Bahnhof auf dich. Ruf mich bitte an! Liebe Grüße, Emil' },
      { id: 't3', title: 'Stadtcafé', text: 'Frühstück: Montag bis Freitag von 7 bis 11 Uhr. Samstag und Sonntag von 8 bis 12 Uhr. Eine Tasse Tee kostet 2 Euro.' }
    ],
    pictures: [
      { id: '1', kind: 'bus', alt: 'Çizim: otobüs' },
      { id: '2', kind: 'bakery', alt: 'Çizim: fırın ve ekmek' },
      { id: '3', kind: 'post', alt: 'Çizim: mektup ve posta kutusu' },
      { id: '4', kind: 'doctor', alt: 'Çizim: doktor ve stetoskop' },
      { id: '5', kind: 'park', alt: 'Çizim: park ve ağaç' },
      { id: '6', kind: 'library', alt: 'Çizim: kitaplık' }
    ],
    questions: [
      { id: 's1-a', part: 1, label: 'A', prompt: 'Sie möchten Deutsch lernen. Nur am Abend haben Sie Zeit.', answer: '1', explanation: 'Sprachschule Morgen bietet Deutschkurse am Montag und Mittwoch um 18 Uhr an.' },
      { id: 's1-b', part: 1, label: 'B', prompt: 'Ihr Fahrrad ist kaputt. Sie brauchen Hilfe.', answer: '2', explanation: 'Die Fahrrad-Werkstatt repariert Fahrräder.' },
      { id: 's1-c', part: 1, label: 'C', prompt: 'Ihre Tochter ist krank. Sie suchen einen Arzt für Kinder.', answer: '3', explanation: 'Die Kinderpraxis behandelt Kinder.' },
      { id: 's1-d', part: 1, label: 'D', prompt: 'Sie möchten heute frisches Obst kaufen.', answer: '4', explanation: 'Am Obstmarkt gibt es frische Äpfel und Birnen.' },
      { id: 's1-e', part: 1, label: 'E', prompt: 'Sie möchten ein Buch mit nach Hause nehmen und später zurückbringen.', answer: '5', explanation: 'In der Bibliothek kann man Bücher ausleihen.' },
      { id: 's1-f', part: 2, label: '1', sourceId: 't1', prompt: 'Kann man am Montag im Schwimmbad schwimmen?', answer: 'NEIN', explanation: 'Montag ist geschlossen, deshalb lautet die Antwort NEIN.' },
      { id: 's1-g', part: 2, label: '2', sourceId: 't1', prompt: 'Müssen Kinder unter sechs Jahren bezahlen?', answer: 'NEIN', explanation: '„Zahlen nichts“ bedeutet: Es ist für diese Kinder kostenlos.' },
      { id: 's1-h', part: 2, label: '3', sourceId: 't2', prompt: 'Kommt Emils Zug um halb sechs am Abend an?', answer: 'JA', explanation: '17:30 Uhr ist halb sechs am Abend.' },
      { id: 's1-i', part: 2, label: '4', sourceId: 't2', prompt: 'Wartet Emil im Café auf Mia?', answer: 'NEIN', explanation: 'Emil wartet vor dem Bahnhof, nicht im Café.' },
      { id: 's1-j', part: 2, label: '5', sourceId: 't3', prompt: 'Kann man am Sonntag um 11 Uhr frühstücken?', answer: 'JA', explanation: 'Sonntag gibt es Frühstück von 8 bis 12 Uhr.' },
      { id: 's1-k', part: 2, label: '6', sourceId: 't3', prompt: 'Kostet eine Tasse Tee 3 Euro?', answer: 'NEIN', explanation: 'Im Text steht 2 Euro, nicht 3 Euro.' },
      { id: 's1-l', part: 3, label: 'A', prompt: 'Ich fahre jeden Morgen mit dem Bus zur Arbeit.', answer: '1', explanation: '„Mit dem Bus“ gehört zum Bild mit dem Bus.' },
      { id: 's1-m', part: 3, label: 'B', prompt: 'Ich kaufe frisches Brot und einen Kuchen.', answer: '2', explanation: 'Brot und Kuchen kann man in einer Bäckerei kaufen.' },
      { id: 's1-n', part: 3, label: 'C', prompt: 'Ich möchte diesen Brief heute noch schicken.', answer: '3', explanation: 'Ein Brief gehört zur Post und zum Briefkasten.' },
      { id: 's1-o', part: 3, label: 'D', prompt: 'Ich bin krank und gehe heute zum Arzt.', answer: '4', explanation: 'Der Arzt passt zum Bild mit dem Stethoskop.' },
      { id: 's1-p', part: 3, label: 'E', prompt: 'Am Nachmittag spiele ich mit meinem Sohn im Park.', answer: '5', explanation: 'Der Park mit einem Baum ist die passende Abbildung.' }
    ]
  },
  {
    id: 'a1-lesen-unterwegs-02',
    title: 'Set 2 · Şehirde ve Yolda',
    subtitle: 'Otel, alışveriş, randevu ve etkinlikler',
    ads: [
      { id: '1', title: 'Hotel Am Markt', text: 'Einzel- und Doppelzimmer. Check-in täglich ab 15 Uhr. Frühstück ab 7 Uhr.' },
      { id: '2', title: 'Blumen Eva', text: 'Blumen für Geburtstag und Hochzeit. Wir bringen den Blumenstrauß auch zu Ihnen nach Hause.' },
      { id: '3', title: 'Yoga am Abend', text: 'Ein Kurs für Anfänger. Jeden Dienstag um 18 Uhr im Sportzentrum. Bitte bequeme Kleidung tragen.' },
      { id: '4', title: 'Schlüsselhilfe Klein', text: 'Schlüssel verloren? Tür geht nicht auf? Wir helfen auch am Wochenende. Telefon 0800 444 22.' },
      { id: '5', title: 'Tierarztpraxis Berger', text: 'Ihr Hund oder Ihre Katze ist krank? Bitte rufen Sie für einen Termin an.' },
      { id: '6', title: 'Reisebüro Nord', text: 'Flüge und Reisen nach Spanien und Italien. Jetzt günstige Sommerangebote.' }
    ],
    texts: [
      { id: 't1', title: 'Bibliothek in der Stadt', text: 'Wir haben Montag bis Donnerstag von 10 bis 18 Uhr offen, am Freitag bis 16 Uhr. Am Samstag und Sonntag ist geschlossen. Die Anmeldung ist kostenlos.' },
      { id: 't2', title: 'Arzttermin', text: 'Guten Tag, Frau König! Ihr Termin bei Dr. Weber ist am Dienstag, 12. Mai, um 9:30 Uhr. Bitte bringen Sie Ihre Krankenkarte mit.' },
      { id: 't3', title: 'Herbstfest im Hof', text: 'Unser Fest beginnt am Samstag um 16 Uhr. Der Eintritt ist frei. Getränke gibt es an einem Stand. Bei Regen feiern wir in der Turnhalle.' }
    ],
    pictures: [
      { id: '1', kind: 'train', alt: 'Çizim: tren' },
      { id: '2', kind: 'hotel', alt: 'Çizim: otel ve yatak' },
      { id: '3', kind: 'clothes', alt: 'Çizim: giysi mağazası' },
      { id: '4', kind: 'cinema', alt: 'Çizim: sinema perdesi' },
      { id: '5', kind: 'restaurant', alt: 'Çizim: tabakta yemek' },
      { id: '6', kind: 'pool', alt: 'Çizim: yüzme havuzu' }
    ],
    questions: [
      { id: 's2-a', part: 1, label: 'A', prompt: 'Sie möchten für zwei Nächte ein Zimmer buchen.', answer: '1', explanation: 'Das Hotel bietet Zimmer zum Übernachten an.' },
      { id: 's2-b', part: 1, label: 'B', prompt: 'Ihre Freundin hat Geburtstag. Sie wollen ihr Blumen nach Hause schicken.', answer: '2', explanation: 'Blumen Eva liefert Blumen direkt nach Hause.' },
      { id: 's2-c', part: 1, label: 'C', prompt: 'Sie wollen dienstags um 18 Uhr Sport machen.', answer: '3', explanation: 'Der Yoga-Kurs beginnt dienstags um 18 Uhr.' },
      { id: 's2-d', part: 1, label: 'D', prompt: 'Sie haben Ihren Wohnungsschlüssel verloren.', answer: '4', explanation: 'Die Schlüsselhilfe hilft bei verlorenen Schlüsseln.' },
      { id: 's2-e', part: 1, label: 'E', prompt: 'Ihr Hund frisst nicht und ist krank.', answer: '5', explanation: 'Für einen kranken Hund ist die Tierarztpraxis richtig.' },
      { id: 's2-f', part: 2, label: '1', sourceId: 't1', prompt: 'Ist die Bibliothek am Samstag geöffnet?', answer: 'NEIN', explanation: 'Im Text steht: Samstag und Sonntag ist geschlossen.' },
      { id: 's2-g', part: 2, label: '2', sourceId: 't1', prompt: 'Muss man für die Anmeldung bezahlen?', answer: 'NEIN', explanation: 'Die Anmeldung ist kostenlos.' },
      { id: 's2-h', part: 2, label: '3', sourceId: 't2', prompt: 'Hat Frau König am Dienstag einen Arzttermin?', answer: 'JA', explanation: 'Der Termin ist am Dienstag, 12. Mai.' },
      { id: 's2-i', part: 2, label: '4', sourceId: 't2', prompt: 'Muss Frau König ihre Krankenkarte mitbringen?', answer: 'JA', explanation: '„Bitte bringen Sie Ihre Krankenkarte mit“ steht in der Nachricht.' },
      { id: 's2-j', part: 2, label: '5', sourceId: 't3', prompt: 'Müssen die Besucher Eintritt bezahlen?', answer: 'NEIN', explanation: '„Der Eintritt ist frei“ bedeutet: kostenlos.' },
      { id: 's2-k', part: 2, label: '6', sourceId: 't3', prompt: 'Findet das Fest bei Regen in der Turnhalle statt?', answer: 'JA', explanation: 'Bei Regen wird in der Turnhalle gefeiert.' },
      { id: 's2-l', part: 3, label: 'A', prompt: 'Morgen fahre ich mit dem Zug nach Wien.', answer: '1', explanation: 'Der Zug gehört zum Bild mit dem Schienenfahrzeug.' },
      { id: 's2-m', part: 3, label: 'B', prompt: 'Ich suche ein Zimmer. Dort möchte ich zwei Nächte schlafen.', answer: '2', explanation: 'Zum Übernachten passt das Hotel mit dem Bett.' },
      { id: 's2-n', part: 3, label: 'C', prompt: 'Die blaue Jacke im Geschäft gefällt mir sehr gut.', answer: '3', explanation: 'Die Jacke gibt es im Kleidungsgeschäft.' },
      { id: 's2-o', part: 3, label: 'D', prompt: 'Am Freitag sehen wir zusammen einen Film.', answer: '4', explanation: 'Zum Film passt das Kino-Bild.' },
      { id: 's2-p', part: 3, label: 'E', prompt: 'Im Restaurant bestelle ich eine Pizza und ein Wasser.', answer: '5', explanation: 'Essen und Trinken passen zum Restaurant-Bild.' }
    ]
  }
]

export const allLesenQuestions = readingSets.flatMap(set => set.questions.map(question => ({ ...question, setId: set.id, setTitle: set.title })))
export const getReadingSet = (id: string) => readingSets.find(set => set.id === id)
export const findReadingQuestion = (id: string) => allLesenQuestions.find(question => question.id === id)

export function validateReadingSets(): string[] {
  const errors: string[] = []
  const globalIds = new Set<string>()
  for (const set of readingSets) {
    if (set.questions.length !== 16) errors.push(set.id + ': 16 sorudan farklı')
    if (set.ads.length !== 6 || set.texts.length !== 3 || set.pictures.length !== 6)
      errors.push(set.id + ': uyaran sayıları hatalı')
    for (const part of [1, 2, 3] as LesenPart[]) {
      const qs = set.questions.filter(q => q.part === part)
      if (qs.length !== (part === 2 ? 6 : 5)) errors.push(set.id + ': görev ' + part + ' hatalı')
      if (part !== 2 && new Set(qs.map(q => q.answer)).size !== 5)
        errors.push(set.id + ': görev ' + part + ' eşleştirme yanıtı tekrarlı')
    }
    for (const text of set.texts) if (set.questions.filter(q => q.sourceId === text.id).length !== 2)
      errors.push(set.id + ': metin başına iki soru olmalı')
    for (const q of set.questions) {
      if (globalIds.has(q.id)) errors.push('Tekrarlı soru kimliği: ' + q.id)
      globalIds.add(q.id)
      if (q.part === 2 && q.answer !== 'JA' && q.answer !== 'NEIN') errors.push(q.id + ': yanlış ikili cevap')
      if (q.part === 1 && !set.ads.some(a => a.id === q.answer)) errors.push(q.id + ': ilan bulunamadı')
      if (q.part === 3 && !set.pictures.some(a => a.id === q.answer)) errors.push(q.id + ': resim bulunamadı')
      if (!q.explanation || !q.prompt) errors.push(q.id + ': eksik içerik')
    }
  }
  return errors
}
