// AYDA tarafından özgün olarak yazıldı. ÖSD'nin telifli soru veya ses dosyası kullanılmadı.
import type { PictureKind } from '../lesen/content'

export type Part = 1 | 2 | 3
export type Mode = 'practice' | 'exam'
export type Kind = 'picture' | 'fill' | 'choice'
export interface HearingQuestion {
  id: string
  part: Part
  number: number
  kind: Kind
  prompt: string
  answer: string
  aliases?: string[]
  explanationTr: string
  options?: { value: string; text: string }[]
}
export interface HearingUnit {
  part: Part
  label: string
  descriptionTr: string
  instructionDe: string
  audio: string
  transcript: string
  pictures?: { value: string; kind: PictureKind; alt: string }[]
  questions: HearingQuestion[]
}
export interface HearingSet {
  id: string
  title: string
  subtitle: string
  units: [HearingUnit, HearingUnit, HearingUnit]
}
const image = (ids: PictureKind[]) => ids.map((kind,i) => ({value:String(i+1),kind,alt:kind+' simgesi'}))
const pic = (id: string, number: number, answer: string, explanationTr: string): HearingQuestion =>
  ({ id, part:1, number, kind:'picture', prompt:'Hören Sie Text '+number+'. Welches Bild passt?', answer, explanationTr })
const fill = (id: string, number: number, prompt: string, answer: string, aliases: string[], explanationTr: string): HearingQuestion =>
  ({id, part:2,number,kind:'fill',prompt,answer,aliases,explanationTr})
const choice = (id:string,number:number,prompt:string, answer:string, a:string,b:string,c:string,explanationTr:string):HearingQuestion =>
  ({id,part:3,number,kind:'choice',prompt,answer,options:[{value:'a',text:a},{value:'b',text:b},{value:'c',text:c}],explanationTr})
export const hearingSets: HearingSet[] = [
 { id:'a1-hoeren-alltag-01',title:'Set 1 · Alltag',subtitle:'Günlük yaşam, ulaşım ve randevular',units:[
   {part:1,label:'Aufgabe 1',descriptionTr:'5 kısa metni bir kez dinle, her biri için 6 görselden doğru olanı seç. 1 görsel kullanılmaz.',instructionDe:'Hören Sie die fünf Texte. Welches Bild passt? Sie hören jeden Text einmal.',audio:'/audio/alltag-01-aufgabe1.mp3',
    pictures:image(['bakery','doctor','bus','park','post','hotel']),
    transcript:'Text eins: Entschuldigung, fährt dieser Bus zum Bahnhof? Ja, die Nummer acht. Text zwei: Ich möchte zwei Brötchen und ein Brot, bitte. Text drei: Guten Tag. Ich bin krank und brauche einen Termin beim Arzt. Text vier: Wir gehen heute Nachmittag mit den Kindern in den Park. Text fünf: Ich möchte diesen Brief nach Wien schicken.',
    questions:[
    pic('h1-1-1',1,'3','Otobüs ve Bahnhof sözleri otobüs resmini işaret eder.'),
    pic('h1-1-2',2,'1','Brötchen ve Brot fırınla ilgili.'),
    pic('h1-1-3',3,'2','Krank ve Arzt doktor anlamına gelir.'),
    pic('h1-1-4',4,'4','Mit den Kindern in den Park ifadesinde park geçiyor.'),
    pic('h1-1-5',5,'5','Brief schicken postayla mektup göndermektir.')
   ]},
   {part:2,label:'Aufgabe 2',descriptionTr:'Bir duyuruyu iki defa dinle. Duyduğun 5 bilgiyi kısa cevap olarak yaz.',instructionDe:'Hören Sie den Text zweimal. Ergänzen Sie die Informationen.',audio:'/audio/alltag-01-aufgabe2.mp3',
    transcript:'Guten Tag. Hier sind die Informationen für den Deutschkurs. Der Kurs beginnt am Montag, dem sechsten April. Unterricht ist um achtzehn Uhr. Der Kurs findet im Raum zwölf statt. Bitte bringen Sie ein Heft mit. Ein Kursbuch kostet fünfzehn Euro. Vielen Dank.',
    questions:[
     fill('h1-2-1',1,'Kurs başlangıç günü (Wochentag)','Montag',['montags'],'Pazartesi = Montag.'),
     fill('h1-2-2',2,'Başlangıç saati (Uhrzeit)','18',['18 uhr','18:00','achtzehn','achtzehn uhr','sechs uhr abends'],'achtzehn Uhr = 18.00.'),
     fill('h1-2-3',3,'Derslik numarası (Raum)','12',['zwölf','raum zwölf','raum 12'],'Raum zwölf, derslik 12.'),
     fill('h1-2-4',4,'Getirilecek eşya','Heft',['ein heft','das heft','hefte'],'Bitte bringen Sie ein Heft mit.'),
     fill('h1-2-5',5,'Kitabın fiyatı (Euro)','15',['fünfzehn','15 euro','fünfzehn euro'],'Fünfzehn Euro = 15 Euro.')
    ]},
   {part:3,label:'Aufgabe 3',descriptionTr:'5 kısa röportajı bir kez dinle; her soruda üç seçenekten birini işaretle.',instructionDe:'Hören Sie fünf kurze Interviews. Kreuzen Sie die richtige Antwort an. Sie hören jeden Text einmal.',audio:'/audio/alltag-01-aufgabe3.mp3',
    transcript:'Interview eins. Was trinken Sie morgens? Ich trinke meistens Tee, keinen Kaffee. Interview zwei. Wo wohnen Sie jetzt? In Graz, in der Nähe vom Zentrum. Interview drei. Wie fahren Sie zur Arbeit? Mit dem Fahrrad. Es ist nicht weit. Interview vier. Wann haben Sie frei? Am Sonntag. Da arbeite ich nicht. Interview fünf. Was machen Sie gern am Wochenende? Ich koche gern mit Freunden.',
    questions:[
     choice('h1-3-1',1,'Was trinkt die Person morgens?','b','Kaffee','Tee','Wasser','Ich trinke meistens Tee.'),
     choice('h1-3-2',2,'Wo wohnt die Person?','a','Graz','Wien','Salzburg','Die Person wohnt in Graz.'),
     choice('h1-3-3',3,'Wie fährt die Person zur Arbeit?','c','Mit dem Auto','Mit dem Bus','Mit dem Fahrrad','Mit dem Fahrrad: bisikletle.'),
     choice('h1-3-4',4,'Wann hat die Person frei?','b','Montag','Sonntag','Freitag','Am Sonntag arbeite ich nicht.'),
     choice('h1-3-5',5,'Was macht die Person gern am Wochenende?','a','Mit Freunden kochen','Tennis spielen','Ins Kino gehen','Ich koche gern mit Freunden.')
    ]}
 ]},
 { id:'a1-hoeren-unterwegs-02',title:'Set 2 · Unterwegs',subtitle:'Tren, konaklama ve alışveriş',units:[
   {part:1,label:'Aufgabe 1',descriptionTr:'5 kısa metni bir kez dinle ve uygun görsellerle eşleştir.',instructionDe:'Hören Sie die fünf Texte. Welches Bild passt? Sie hören jeden Text einmal.',audio:'/audio/unterwegs-02-aufgabe1.mp3',
    pictures:image(['train','hotel','clothes','cinema','restaurant','pool']),
    transcript:'Text eins: Unser Zug nach Linz fährt heute von Gleis drei. Text zwei: Guten Abend. Ich habe ein Zimmer für zwei Nächte reserviert. Text drei: Haben Sie diese Jacke auch in Größe M? Text vier: Der Film beginnt um zwanzig Uhr. Die Karten gibt es an der Kasse. Text fünf: Ich nehme eine Pizza und ein Glas Wasser, bitte.',
    questions:[
     pic('h2-1-1',1,'1','Gleis ve Zug: tren ve peron.'),
     pic('h2-1-2',2,'2','Zimmer reserviert: otel odası ayırttı.'),
     pic('h2-1-3',3,'3','Jacke ve Größe M: kıyafet mağazası.'),
     pic('h2-1-4',4,'4','Film ve Karten: sinema.'),
     pic('h2-1-5',5,'5','Pizza ve Wasser siparişi: restoran.')
    ]},
   {part:2,label:'Aufgabe 2',descriptionTr:'Tren anonsunu iki defa dinle ve 5 bilgiyi not et.',instructionDe:'Hören Sie den Text zweimal. Ergänzen Sie die Informationen.',audio:'/audio/unterwegs-02-aufgabe2.mp3',
    transcript:'Achtung, eine Durchsage für die Fahrgäste. Der Zug nach Salzburg fährt heute um vierzehn Uhr dreißig. Die Abfahrt ist auf Gleis fünf. Eine Fahrkarte kostet neun Euro. Der Schalter ist bis neunzehn Uhr geöffnet. Vielen Dank und eine gute Fahrt.',
    questions:[
     fill('h2-2-1',1,'Varış şehri (Ziel)','Salzburg',[],'Zug nach Salzburg: Salzburg treni.'),
     fill('h2-2-2',2,'Kalkış saati','14:30',['14.30','vierzehn uhr dreißig','vierzehn uhr dreissig','14 30'],'Vierzehn Uhr dreißig = 14:30.'),
     fill('h2-2-3',3,'Peron (Gleis)','5',['fünf','gleis fünf','gleis 5'],'Gleis fünf, peron 5.'),
     fill('h2-2-4',4,'Bilet fiyatı (Euro)','9',['neun','9 euro','neun euro'],'Neun Euro = 9 Euro.'),
     fill('h2-2-5',5,'Gişenin kapanış saati','19',['19:00','19 uhr','neunzehn','neunzehn uhr'],'Bis neunzehn Uhr = saat 19.00’a kadar.')
    ]},
   {part:3,label:'Aufgabe 3',descriptionTr:'5 kısa röportajı bir kez dinle, doğru seçeneği bul.',instructionDe:'Hören Sie fünf kurze Interviews. Kreuzen Sie die richtige Antwort an. Sie hören jeden Text einmal.',audio:'/audio/unterwegs-02-aufgabe3.mp3',
    transcript:'Interview eins. Wohin fahren Sie in den Ferien? Nach Italien, ans Meer. Interview zwei. Was kaufen Sie heute? Eine neue Jacke für den Winter. Interview drei. Wie spät beginnt Ihre Arbeit? Um sieben Uhr morgens. Interview vier. Wer kommt heute zu Besuch? Meine Schwester aus Wien. Interview fünf. Was essen Sie gern zum Frühstück? Am liebsten Brot und Käse.',
    questions:[
     choice('h2-3-1',1,'Wohin fährt die Person in den Ferien?','c','Nach Deutschland','Nach Spanien','Nach Italien','Die Person sagt: Nach Italien.'),
     choice('h2-3-2',2,'Was kauft die Person?','b','Eine Tasche','Eine Jacke','Schuhe','Eine neue Jacke für den Winter.'),
     choice('h2-3-3',3,'Wann beginnt die Arbeit?','a','Um sieben Uhr','Um acht Uhr','Um zehn Uhr','Um sieben Uhr morgens.'),
     choice('h2-3-4',4,'Wer kommt zu Besuch?','c','Der Bruder','Die Mutter','Die Schwester','Meine Schwester aus Wien.'),
     choice('h2-3-5',5,'Was isst die Person zum Frühstück?','b','Müsli und Obst','Brot und Käse','Ein Ei','Am liebsten Brot und Käse.')
    ]}
 ]}
]

export const hearingQuestions = hearingSets.flatMap(s => s.units.flatMap(u => u.questions.map(q=>({...q,setId:s.id,setTitle:s.title}))))
export function getHearingSet(id: string) { return hearingSets.find(s=>s.id===id) }
export function normalizeAnswer(input: string):string {
 return input.toLocaleLowerCase('de-DE').trim().replace(/[.,]/g,':').replace(/[:\s]+/g,' ').replace(/\s*uhr\s*/g,' uhr').replace(/\s+/g,' ').trim()
}
export function matchesAnswer(q:HearingQuestion, value:string|undefined):boolean {
 if(!value?.trim())return false
 return [q.answer,...(q.aliases||[])].map(normalizeAnswer).includes(normalizeAnswer(value))
}
export function validateHearingSets():string[] {
 const errs:string[]=[], ids=new Set<string>()
 for(const s of hearingSets){
  if(s.units.length!==3)errs.push(s.id+': görev eksik')
  for(const u of s.units){
   if(u.questions.length!==5)errs.push(s.id+': '+u.part+' 5 soru değil')
   if(!u.audio.endsWith('.mp3')||!u.transcript)errs.push('Ses ya da metin eksik')
   if(u.part===1&&(!u.pictures||u.pictures.length!==6||new Set(u.questions.map(q=>q.answer)).size!==5))errs.push('Resim eşleştirme hatalı')
   for(const q of u.questions){if(ids.has(q.id))errs.push('ID tekrarlandı');ids.add(q.id);if(!q.explanationTr||!q.prompt)errs.push('İçerik eksik '+q.id)}
  }
 }
 return errs
}
