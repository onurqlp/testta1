// AYDA özgün A1 konuşma örnekleri; ÖSD'nin sınav görselleri ve metinleri kopyalanmamıştır.
export type SpeakingPart = 1 | 2 | 3
export type SpeakingMode = 'practice' | 'timed'
export type SceneIcon = 'cafe' | 'station' | 'market' | 'doctor' | 'school' | 'party'
export interface SpeakingTopic { id:string; name:string; question:string; helperTr:string; sample:string }
export interface Phrase { de:string; tr:string }
export interface SpeakingScene {
 id:string; icon:SceneIcon; title:string; setting:string; overviewTr:string;
 people:string; place:string; actions:string; example:string;
 prompts:{ question:string; response:string; hintTr:string }[]
}
export interface SpeakingSet {
 id:string; title:string; subtitle:string; themes:SpeakingTopic[];
 scenes:[SpeakingScene,SpeakingScene,SpeakingScene]
}
export const topicTemplates:SpeakingTopic[]=[
 {id:'beruf',name:'Beruf',question:'Was machen Sie beruflich?',helperTr:'Ne iş yaptığını veya öğrenci olduğunu anlat.',sample:'Ich bin Studentin. Ich lerne Deutsch.'},
 {id:'familie',name:'Familie',question:'Haben Sie eine Familie?',helperTr:'Ailenden bir-iki cümleyle bahset.',sample:'Ich habe eine Schwester. Meine Familie wohnt in Ankara.'},
 {id:'sprachen',name:'Sprachen',question:'Welche Sprachen sprechen Sie?',helperTr:'Bildiğin dilleri söyle.',sample:'Ich spreche Türkisch und ein bisschen Deutsch.'},
 {id:'sport',name:'Sport',question:'Machen Sie gern Sport?',helperTr:'Sevdiğin sporu veya hareketi anlat.',sample:'Ich schwimme gern. Am Sonntag gehe ich ins Schwimmbad.'},
 {id:'hobbys',name:'Hobbys',question:'Was machen Sie gern in der Freizeit?',helperTr:'Boş zaman etkinliğinden söz et.',sample:'Ich höre Musik. Ich lese gern Bücher.'},
 {id:'essen',name:'Lieblingsessen',question:'Was essen Sie gern?',helperTr:'Sevdiğin bir yemek hakkında konuş.',sample:'Ich esse gern Pizza. Am Wochenende koche ich zu Hause.'}
]
export const phraseBank:Record<SpeakingPart,Phrase[]>={
 1:[
 {de:'Ich heiße ... und komme aus ... .',tr:'Adım ... ve ... şehrinden/ülkesinden geliyorum.'},
 {de:'Ich wohne in ... .',tr:'... şehrinde oturuyorum.'},
 {de:'Ich arbeite als ... .',tr:'... olarak çalışıyorum.'},
 {de:'Ich lerne Deutsch, weil ... .',tr:'Almanca öğreniyorum, çünkü ... .'},
 {de:'In meiner Freizeit ... .',tr:'Boş zamanımda ... .'},
 {de:'Mein Lieblingsessen ist ... .',tr:'En sevdiğim yemek ... .'}
 ],
 2:[
 {de:'Auf dem Bild sehe ich ... .',tr:'Resimde ... görüyorum.'},
 {de:'Da sind zwei Personen.',tr:'Orada iki kişi var.'},
 {de:'Die Personen sind im ... .',tr:'Kişiler ... yerindeler.'},
 {de:'Links steht eine Frau.',tr:'Solda bir kadın ayakta.'},
 {de:'Rechts sitzt ein Mann.',tr:'Sağda bir erkek oturuyor.'},
 {de:'Sie sprechen miteinander.',tr:'Birbirleriyle konuşuyorlar.'},
 {de:'Vielleicht möchten sie ... .',tr:'Belki ... istiyorlar.'}
 ],
 3:[
 {de:'Guten Tag! Ich möchte bitte ... .',tr:'İyi günler! Lütfen ... istiyorum.'},
 {de:'Wie viel kostet das?',tr:'Bu ne kadar?'},
 {de:'Wann beginnt ... ?',tr:'... ne zaman başlıyor?'},
 {de:'Haben Sie ... ?',tr:'... var mı?'},
 {de:'Können Sie mir bitte helfen?',tr:'Bana yardımcı olabilir misiniz?'},
 {de:'Danke schön. Auf Wiedersehen!',tr:'Teşekkürler. Hoşça kalın!'}
 ]
}
const p=(question:string,response:string,hintTr:string)=>({question,response,hintTr})
export const speakingSets:SpeakingSet[]=[
 {
 id:'sprechen-alltag-01',title:'Set 1 · Günlük Yaşam',subtitle:'Kafe, tren istasyonu ve alışveriş',
 themes:topicTemplates,
 scenes:[
 {id:'cafe',icon:'cafe',title:'Im Café',setting:'Kafede sipariş',overviewTr:'İki kişi bir kafede, biri masada oturuyor, diğeri sipariş alıyor.',people:'eine Kellnerin und ein Gast',place:'im Café',actions:'Der Gast bestellt ein Getränk. Die Kellnerin schreibt etwas.',
 example:'Ich sehe zwei Personen. Sie sind in einem Café. Ein Mann sitzt am Tisch. Eine Frau steht. Sie sprechen über Getränke.',
 prompts:[
 p('Guten Tag! Was möchten Sie trinken?','Ich möchte einen Tee, bitte.','Bir içecek sipariş et.'),
 p('Möchten Sie auch etwas essen?','Ja, ein Stück Kuchen, bitte.','Yemek isteğini söyle.'),
 p('Das macht sechs Euro.','Hier, bitte. Danke schön!','Ödeme yapıp teşekkür et.')
 ]},
 {id:'station',icon:'station',title:'Am Bahnhof',setting:'Tren bileti alma',overviewTr:'İstasyonda bankonun önünde yolcu ve görevli var.',people:'ein Fahrgast und ein Mitarbeiter',place:'am Bahnhof',actions:'Der Fahrgast fragt nach einer Fahrkarte. Der Mitarbeiter zeigt den Weg.',
 example:'Auf dem Bild sehe ich zwei Personen. Sie sind am Bahnhof. Ein Mann kauft eine Fahrkarte. Der Mitarbeiter hilft ihm.',
 prompts:[
 p('Guten Tag. Wohin möchten Sie fahren?','Ich möchte nach Wien fahren.','Gitmek istediğin şehri söyle.'),
 p('Einfach oder hin und zurück?','Einfach, bitte.','Tek yön veya gidiş dönüş belirt.'),
 p('Der Zug fährt um 15 Uhr auf Gleis zwei.','Vielen Dank. Auf Wiedersehen!','Saati anladığını söyle ve teşekkür et.')
 ]},
 {id:'market',icon:'market',title:'Im Supermarkt',setting:'Markette yardım isteme',overviewTr:'Bir müşteri ve mağaza görevlisi rafların önünde konuşuyor.',people:'eine Kundin und ein Verkäufer',place:'im Supermarkt',actions:'Die Kundin sucht Obst. Der Verkäufer zeigt auf die Regale.',
 example:'Ich sehe zwei Personen im Supermarkt. Eine Frau sucht Äpfel. Ein Verkäufer zeigt ihr das Obst.',
 prompts:[
 p('Guten Morgen! Kann ich Ihnen helfen?','Ja, wo finde ich die Äpfel?','Bir ürünün yerini sor.'),
 p('Dort rechts. Wie viele möchten Sie?','Ich möchte vier Äpfel, bitte.','Miktar belirt.'),
 p('Brauchen Sie noch etwas?','Nein, danke. Das ist alles.','Kibarca bitir.')
 ]}
 ]
 },
 {
 id:'sprechen-unterwegs-02',title:'Set 2 · Şehir ve Planlar',subtitle:'Doktor, dil okulu ve davet',
 themes:topicTemplates,
 scenes:[
 {id:'doctor',icon:'doctor',title:'In der Arztpraxis',setting:'Doktordan randevu isteme',overviewTr:'Bir hasta resepsiyondaki görevliyle konuşuyor.',people:'ein Patient und eine Mitarbeiterin',place:'in der Arztpraxis',actions:'Der Patient spricht mit der Mitarbeiterin. Er möchte einen Termin.',
 example:'Ich sehe einen Mann und eine Frau. Sie sind in einer Arztpraxis. Der Mann ist krank. Er spricht mit der Frau.',
 prompts:[
 p('Guten Tag. Was kann ich für Sie tun?','Ich brauche einen Termin beim Arzt.','Randevu iste.'),
 p('Haben Sie morgen um zehn Uhr Zeit?','Ja, um zehn Uhr habe ich Zeit.','Randevu saatini onayla.'),
 p('Bitte bringen Sie Ihre Karte mit.','Ja, natürlich. Vielen Dank.','Gerekli eşyayı getireceğini söyle.')
 ]},
 {id:'school',icon:'school',title:'In der Sprachschule',setting:'Dil kursu hakkında bilgi',overviewTr:'Bir öğrenci, kurs danışmanıyla masa başında konuşuyor.',people:'ein Schüler und eine Kursleiterin',place:'in einer Sprachschule',actions:'Der Schüler fragt nach einem Deutschkurs. Die Frau zeigt einen Stundenplan.',
 example:'Auf dem Bild sehe ich zwei Personen. Sie sind in einer Sprachschule. Ein Schüler fragt nach dem Kurs.',
 prompts:[
 p('Guten Tag. Welchen Kurs suchen Sie?','Ich suche einen Deutschkurs A1.','Kurs seviyesini belirt.'),
 p('Wann haben Sie Zeit?','Ich habe am Abend Zeit.','Uygun saatini söyle.'),
 p('Der Kurs beginnt am Montag.','Gut, danke für die Information!','Bilgiyi alıp teşekkür et.')
 ]},
 {id:'party',icon:'party',title:'Auf einer Feier',setting:'Bir davette sohbet',overviewTr:'İki arkadaş küçük bir doğum günü kutlamasında konuşuyor.',people:'zwei Freunde',place:'auf einer Geburtstagsfeier',actions:'Sie stehen am Tisch und sprechen. Es gibt Kuchen und Getränke.',
 example:'Ich sehe zwei Freunde. Sie sind auf einer Geburtstagsfeier. Auf dem Tisch steht ein Kuchen. Sie sprechen und lachen.',
 prompts:[
 p('Hallo! Schön, dass du da bist. Möchtest du Kuchen?','Ja, gern. Vielen Dank!','Teklifi kabul et veya reddet.'),
 p('Und was möchtest du trinken?','Ein Glas Wasser, bitte.','İçecek iste.'),
 p('Hast du am Samstag wieder Zeit?','Ja, am Nachmittag habe ich Zeit.','Gün ve saat belirt.')
 ]}
 ]
 }
]
export const getSpeakingSet=(id:string)=>speakingSets.find(set=>set.id===id)
export const getScene=(set:SpeakingSet,id:string)=>set.scenes.find(scene=>scene.id===id)
export function validateSpeakingSets():string[]{
 const issues:string[]=[]
 const ids=new Set<string>()
 for(const s of speakingSets){
  if(ids.has(s.id))issues.push('Tekrarlı set: '+s.id);ids.add(s.id)
  if(s.themes.length!==6||s.scenes.length!==3)issues.push(s.id+': 6 tema veya 3 özgün görsel eksik')
  for(const c of s.scenes) {
   if(ids.has(c.id))issues.push('Tekrarlı sahne: '+c.id);ids.add(c.id)
   if(c.prompts.length!==3||!c.example||!c.people||!c.place||!c.actions)issues.push(c.id+': sahne bilgileri eksik')
  }
 }
 return issues
}
