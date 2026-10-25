// Özgün AYDA eğitim senaryolarıdır. Resmî ÖSD görevi değildir.
export type WritingMode = 'practice' | 'timed'
export type FieldType = 'text' | 'select'
export interface FormField {
 id:string; label:string; answer:string; type:FieldType; choices?:string[]; helpTr?:string
}
export interface EmailPoint {
 id:string; question:string; hintTr:string; samples:string[]; signalPatterns:string[]
}
export interface WritingTask {
 id:string; title:string; theme:string; formTitle:string; formScenario:string;
 fields:FormField[]; emailFrom:string; incoming:string; emailTo:string;
 points:[EmailPoint,EmailPoint,EmailPoint]; modelFormNote:string; modelEmail:string
}
const t=(id:string,label:string,answer:string,helpTr?:string):FormField=>({id,label,answer,type:'text',helpTr})
const s=(id:string,label:string,answer:string,choices:string[]):FormField=>({id,label,answer,type:'select',choices})
const p=(id:string,question:string,hintTr:string,signalPatterns:string[],samples:string[]):EmailPoint=>({id,question,hintTr,signalPatterns,samples})
export const writingTasks:WritingTask[]=[
{
 id:'za1-schreiben-01',title:'Set 1 · Deutschkurs',theme:'Dil kursuna kayıt ve arkadaşla buluşma',
 formTitle:'ANMELDUNG · DEUTSCHKURS',
 formScenario:'Lara Berger will einen Deutschkurs besuchen. Sie heißt Lara Berger, ist am 12. März 1999 geboren und wohnt in der Blumenstraße 7, 4020 Linz. Ihr Kurs ist A1, beginnt im November, findet am Montag statt und startet um 18 Uhr. Sie möchte den Abendkurs. Ihre E-Mail-Adresse ist lara.berger@beispiel.at. Bitte helfen Sie Lara und füllen Sie die zehn Angaben im Formular aus.',
 fields:[
  t('vorname','Vorname','Lara'),t('nachname','Nachname','Berger'),
  t('geburtsdatum','Geburtsdatum','12.03.1999','Gün.Ay.Yıl formatı'),
  t('strasse','Straße und Hausnummer','Blumenstraße 7'),
  t('plz','Postleitzahl','4020'),t('ort','Ort','Linz'),s('niveau','Kursniveau','A1',['A1','A2','B1']),
  s('kurs','Kursart','Abendkurs',['Vormittagskurs','Abendkurs']),
  t('tag','Wochentag','Montag'),t('zeit','Uhrzeit','18:00')
 ],
 modelFormNote:'Formdaki on bilgi senaryoda açıkça verilmiştir; kişi ve yerler kurgusaldır.',
 emailFrom:'Nina',emailTo:'Nina',
 incoming:'Hallo! Ich möchte dich am Samstag in Linz treffen. Wann kommst du? Wie lange bleibst du? Wen bringst du mit? Schreib mir bitte! Liebe Grüße, Nina',
 points:[
  p('arrival','Wann kommst du?','Gün ve saat söyle.', ['samstag','sonntag','montag','uhr','morgen','abend'],['Ich komme am Samstag um 14 Uhr.']),
  p('duration','Wie lange bleibst du?','Kaç saat veya gün kalacağını yaz.', ['bleibe','bleiben','stunden','tage','tag','stunde','nacht'],['Ich bleibe zwei Stunden.']),
  p('company','Wen bringst du mit?','Kiminle geleceğini veya yalnız geleceğini belirt.', ['bringe','mitbringen','allein','freund','schwester','bruder','mann','frau'],['Ich bringe meine Schwester mit.'])
 ],
 modelEmail:'Liebe Nina,\nich komme am Samstag um 14 Uhr nach Linz. Ich bleibe zwei Stunden und bringe meine Schwester mit. Ich freue mich auf dich.\nLiebe Grüße\nLara'
},
{
 id:'za1-schreiben-02',title:'Set 2 · Hotel',theme:'Otel rezervasyonu ve şehir gezisi',
 formTitle:'HOTELBUCHUNG · GÄSTEKARTE',
 formScenario:'Paul König fährt im August nach Graz. Er reist mit dem Zug, kommt am Freitag an und bleibt drei Nächte. Er bucht ein Doppelzimmer mit Frühstück für zwei Personen. Er bezahlt mit Kreditkarte. Seine Telefonnummer ist 0664 1234567. Das Zimmer kostet 90 Euro pro Nacht.',
 fields:[
  t('vorname','Vorname','Paul'),t('nachname','Nachname','König'),t('reiseziel','Reiseziel','Graz'),t('monat','Monat','August'),
  t('ankunft','Ankunftstag','Freitag'),t('naechte','Nächte','3'),
  s('zimmer','Zimmer','Doppelzimmer',['Einzelzimmer','Doppelzimmer']),
  s('fruehstueck','Frühstück','Ja',['Ja','Nein']),t('personen','Personen','2'),
  s('zahlung','Bezahlung','Kreditkarte',['Bar','Kreditkarte'])
 ],
 modelFormNote:'On alanı rezervasyon metnindeki açık bilgilere göre doldurun.',
 emailFrom:'Tom',emailTo:'Tom',
 incoming:'Hallo! Du besuchst mich bald in Graz. Was möchtest du am Freitag machen? Wo wollen wir uns treffen? Was bringst du mit? Viele Grüße, Tom',
 points:[
  p('activity','Was möchtest du am Freitag machen?','Bir etkinlik belirt.', ['möchte','will','gehen','besuchen','sehen','spielen','essen'],['Ich möchte die Stadt sehen.']),
  p('location','Wo wollen wir uns treffen?','Bir buluşma yeri yaz.', ['bahnhof','café','cafe','zentrum','park','hotel','treffen'],['Wir treffen uns am Bahnhof.']),
  p('bringing','Was bringst du mit?','Getireceğin şeyi veya hiçbir şey getirmeyeceğini yaz.', ['bringe','mitbringen','nichts','kuchen','buch','geschenk','wasser'],['Ich bringe einen Kuchen mit.'])
 ],
 modelEmail:'Hallo Tom,\nich möchte am Freitag die Stadt sehen. Wir können uns am Bahnhof treffen. Ich bringe einen Kuchen mit. Ich freue mich sehr.\nViele Grüße\nPaul'
},
{
 id:'za1-schreiben-03',title:'Set 3 · Sportkurs',theme:'Spor kayıt formu ve haftalık plan',
 formTitle:'SPORTZENTRUM · KURSANMELDUNG',
 formScenario:'Mila Hoffmann ist am 8. Juli 2002 geboren. Sie wohnt in Salzburg, Gartenweg 15, Postleitzahl 5020. Sie möchte am Dienstag um 17 Uhr einen Yogakurs für Anfänger besuchen. Der Kurs beginnt im Mai. Mila zahlt bar und kommt mit dem Bus.',
 fields:[
  t('vorname','Vorname','Mila'),t('nachname','Nachname','Hoffmann'),
  t('geburtsdatum','Geburtsdatum','08.07.2002'),t('strasse','Straße und Nr.','Gartenweg 15'),
  t('plz','PLZ','5020'),t('ort','Ort','Salzburg'),
  s('sport','Sportart','Yoga',['Yoga','Tennis','Schwimmen']),
  s('niveau','Niveau','Anfänger',['Anfänger','Fortgeschrittene']),
  t('tag','Kursttag','Dienstag'),t('zeit','Kursbeginn (Uhrzeit)','17:00')
 ],
 modelFormNote:'Başvuru sahibinin gerçek kişisel verileri kullanılmıyor; örnek senaryo kurgu.',
 emailFrom:'Sara',emailTo:'Sara',
 incoming:'Hallo, ich möchte einen Sportkurs mit dir besuchen. Welchen Sport magst du? Wann hast du Zeit? Wie kommst du zum Sportzentrum? Liebe Grüße, Sara',
 points:[
  p('sport','Welchen Sport magst du?','İstediğin sporu söyle.', ['yoga','tennis','schwimmen','sport','fußball','fussball','laufen'],['Ich mag Yoga.']),
  p('schedule','Wann hast du Zeit?','Gün/saat belirt.', ['montag','dienstag','mittwoch','donnerstag','freitag','samstag','sonntag','uhr'],['Ich habe am Dienstag um 17 Uhr Zeit.']),
  p('transport','Wie kommst du zum Sportzentrum?','Ulaşım şeklini yaz.', ['bus','bahn','auto','rad','fahrrad','fuß','fuss','gehe','fahre'],['Ich fahre mit dem Bus.'])
 ],
 modelEmail:'Liebe Sara,\nich mag Yoga und habe am Dienstag um 17 Uhr Zeit. Ich fahre mit dem Bus zum Sportzentrum. Kommst du auch?\nLiebe Grüße\nMila'
},
{
 id:'za1-schreiben-04',title:'Set 4 · Bibliothek',theme:'Kütüphane üyeliği ve kitap alışverişi',
 formTitle:'STADTBIBLIOTHEK · MITGLIEDSKARTE',
 formScenario:'Emil Wagner wohnt in Wien in der Hauptstraße 21, 1030 Wien. Er ist am 3. Januar 1998 geboren. Er möchte eine Jahreskarte für Erwachsene. Er liest gern Krimis und möchte die Karte ab Oktober. Er bezahlt mit Bankkarte. Seine Handynummer ist 0676 9876543.',
 fields:[
  t('vorname','Vorname','Emil'),t('nachname','Nachname','Wagner'),
  t('geburtsdatum','Geburtsdatum','03.01.1998'),t('strasse','Straße und Hausnummer','Hauptstraße 21'),
  t('plz','Postleitzahl','1030'),t('ort','Ort','Wien'),
  s('karte','Kartenart','Jahreskarte',['Tageskarte','Jahreskarte']),
  s('alter','Mitglied','Erwachsene',['Kinder','Erwachsene']),
  t('beginn','Beginn (Monat)','Oktober'),s('zahlung','Zahlungsart','Bankkarte',['Bar','Bankkarte'])
 ],
 modelFormNote:'Yazılacak bilgiler örnek metinde bulunmaktadır.',
 emailFrom:'Felix',emailTo:'Felix',
 incoming:'Hallo! Ich gehe oft in die Bibliothek. Welche Bücher magst du? Wann hast du Zeit? Wer kommt mit dir? Bis bald, Felix',
 points:[
  p('books','Welche Bücher magst du?','Kitap türünü veya konusunu belirt.', ['bücher','bücher','krimi','roman','geschichte','lesen','mag'],['Ich mag Krimis.']),
  p('time','Wann hast du Zeit?','Gün veya saat yaz.', ['montag','dienstag','mittwoch','donnerstag','freitag','samstag','sonntag','uhr','morgen','nachmittag'],['Ich habe am Samstag Zeit.']),
  p('person','Wer kommt mit dir?','Yanında gelecek kişi veya yalnız gelme bilgisini yaz.', ['freund','freundin','schwester','bruder','mutter','vater','allein','kommt mit'],['Meine Freundin kommt mit.'])
 ],
 modelEmail:'Hallo Felix,\nich lese gern Krimis. Am Samstag um 15 Uhr habe ich Zeit. Meine Freundin kommt mit. Wir können zusammen neue Bücher suchen.\nBis bald\nEmil'
},
{
 id:'za1-schreiben-05',title:'Set 5 · Kochkurs',theme:'Yemek kursu başvurusu ve arkadaş daveti',
 formTitle:'KOCHKURS · ANMELDUNG',
 formScenario:'Anna Mayer möchte im Juni einen Kochkurs in Innsbruck machen. Sie ist am 20. April 2001 geboren. Sie wohnt am Bergweg 4, 6020 Innsbruck. Der Kurs ist am Donnerstag von 19 bis 21 Uhr. Anna möchte den vegetarischen Kurs. Die Teilnahme kostet 40 Euro, und sie bezahlt bar.',
 fields:[
  t('vorname','Vorname','Anna'),t('nachname','Nachname','Mayer'),t('geburtsdatum','Geburtsdatum','20.04.2001'),
  t('strasse','Straße und Nummer','Bergweg 4'),t('plz','PLZ','6020'),t('ort','Ort','Innsbruck'),
  t('monat','Monat','Juni'),t('tag','Kurs am','Donnerstag'),
  s('kurs','Kursart','Vegetarisch',['Vegetarisch','Fisch','Fleisch']),
  s('zahlung','Zahlung','Bar',['Bar','Kreditkarte'])
 ],
 modelFormNote:'Başvuru on alan içerir; verilen metinden bağımsız bilgi uydurmanıza gerek yok.',
 emailFrom:'Lea',emailTo:'Lea',
 incoming:'Hallo! Ich mache am Wochenende ein Abendessen. Kommst du? Um wie viel Uhr kannst du kommen? Was möchtest du essen? Was bringst du mit? Liebe Grüße, Lea',
 points:[
  p('arrival','Um wie viel Uhr kannst du kommen?','Saat yaz.', ['uhr','abend','morgen','nachmittag','18','19','20'],['Ich komme um 19 Uhr.']),
  p('food','Was möchtest du essen?','Bir yemek belirt.', ['essen','pizza','salat','suppe','nudeln','gemüse','gemuese'],['Ich möchte Nudeln essen.']),
  p('bringing','Was bringst du mit?','Bir şey getireceğini veya getirmeyeceğini söyle.', ['bringe','mitbringen','nichts','brot','wasser','salat','kuchen'],['Ich bringe einen Salat mit.'])
 ],
 modelEmail:'Liebe Lea,\nja, ich komme gern um 19 Uhr. Ich möchte Nudeln essen und bringe einen Salat mit. Danke für deine Einladung.\nLiebe Grüße\nAnna'
}
]
export function getWritingTask(id:string) { return writingTasks.find(t=>t.id===id) }
export function validateWritingTasks():string[] {
 const issues:string[]=[]
 const ids=new Set<string>()
 for(const task of writingTasks){
  if(ids.has(task.id))issues.push('Set ID tekrarlandı: '+task.id)
  ids.add(task.id)
  if(task.fields.length!==10)issues.push(task.id+': form 10 alan değil')
  if(task.points.length!==3)issues.push(task.id+': e-postada 3 soru yok')
  if(!task.modelEmail||!task.formScenario||!task.incoming)issues.push(task.id+': kaynak yok')
  for(const f of task.fields)if(!f.id||!f.label||!f.answer||(f.type==='select'&&!f.choices?.includes(f.answer)))issues.push(task.id+': '+f.id+' geçersiz')
  for(const point of task.points)if(!point.question||!point.hintTr||!point.samples.length)issues.push(task.id+': soru örneği eksik')
 }
 return issues
}
