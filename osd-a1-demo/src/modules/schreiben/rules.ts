import type { FormField, WritingTask } from './content'

export type Severity = 'error' | 'suggestion' | 'info'
export interface Issue {
 id:string; severity:Severity; titleTr:string; detailTr:string
 start?:number; end?:number; original?:string; replacement?:string
 confidence:'high'|'medium'|'low'; safeToApply:boolean
}
export interface FormCheck {
 fieldId:string; status:'empty'|'matches'|'review'
 detailTr:string
}

export const wordCount=(text:string):number=>text.trim()?text.trim().split(/\s+/u).filter(Boolean).length:0
const fold=(s:string)=>s.toLocaleLowerCase('de-DE').replace(/ß/g,'ss').replace(/\s+/g,' ').trim()
const normalizeForm=(s:string)=>fold(s).replace(/[.\s:]/g,'')
export function checkForm(task:WritingTask,answers:Record<string,string>):FormCheck[] {
 return task.fields.map(field=>{
   const value=(answers[field.id]||'').trim()
   if(!value)return {fieldId:field.id,status:'empty' as const,detailTr:'Bu alan henüz doldurulmadı.'}
   if(normalizeForm(value)===normalizeForm(field.answer))return {fieldId:field.id,status:'matches' as const,detailTr:'Örnek senaryodaki bilgiyle eşleşiyor.'}
   return {fieldId:field.id,status:'review' as const,detailTr:'Örnek senaryodaki değerden farklı görünüyor; yeniden kontrol et.'}
 })
}
export function analyzeEmail(text:string,task:WritingTask):Issue[]{
 const issues:Issue[]=[]
 const add=(issue:Issue)=>{if(!issues.some(x=>x.id===issue.id&&x.start===issue.start))issues.push(issue)}
 if(!text.trim())return [{
    id:'email-empty',severity:'info',titleTr:'E-posta henüz yazılmadı',
    detailTr:'Yaklaşık 30 kelimelik, üç soruya cevap veren kişisel bir e-posta yaz.',
    confidence:'high',safeToApply:false
 }]
 // A1 için yüksek güvenli, bağlamdan bağımsız ve seçilmiş yazım hataları.
 const corrections:Record<string,{fix:string;why:string}>={
   'ichh':{fix:'ich',why:'Ich zamiri tek h ile yazılır.'},
   'komen':{fix:'kommen',why:'Kommen fiilinde çift m vardır.'},
   'komme':{fix:'komme',why:''},
   'vieln':{fix:'vielen',why:'Vielen sözcüğünde e harfi bulunur.'},
   'bittee':{fix:'bitte',why:'Bitte sözcüğünün sonunda tek e bulunur.'},
   'dankee':{fix:'danke',why:'Danke tek e ile biter.'},
   'freunt':{fix:'Freund',why:'Freund sözcüğü d ile biter.'},
   'heutte':{fix:'heute',why:'Heute sözcüğünde tek t bulunur.'},
   'morgenr':{fix:'morgen',why:'Morgen kelimesinin sonunda r yoktur.'},
   'bishald':{fix:'bald',why:'Kapanışta “Bis bald” kullanabilirsiniz.'},
   'grusse':{fix:'Grüße',why:'Grüße sözcüğünde ü ve ß kullanılır.'}
 }
 for(const match of text.matchAll(/\b(ichh|komen|vieln|bittee|dankee|freunt|heutte|morgenr|grusse)\b/giu)){
   const token=match[0],key=token.toLocaleLowerCase('de-DE'),rule=corrections[key]
   if(!rule||match.index===undefined)continue
   const fix=/^[A-ZÄÖÜ]/u.test(token)?rule.fix.charAt(0).toUpperCase()+rule.fix.slice(1):rule.fix
   add({id:'spell-'+key,severity:'error',titleTr:'Yazım hatası',
   detailTr:rule.why,start:match.index,end:match.index+token.length,original:token,
   replacement:fix,confidence:'high',safeToApply:true})
 }
 const conjugations:{pattern:RegExp;replace:string;why:string}[]=[
   {pattern:/\bich\s+bist\b/giu,replace:'ich bin',why:'Ich ile sein fiili “bin” olur.'},
   {pattern:/\bich\s+hat\b/giu,replace:'ich habe',why:'Ich ile haben fiili “habe” olur.'},
   {pattern:/\bich\s+haben\b/giu,replace:'ich habe',why:'Ich ile haben fiili “habe” olur.'},
   {pattern:/\bich\s+kommst\b/giu,replace:'ich komme',why:'Ich ile kommen fiili “komme” olur.'},
   {pattern:/\bdu\s+haben\b/giu,replace:'du hast',why:'Du ile haben fiili “hast” olur.'},
   {pattern:/\bwir\s+ist\b/giu,replace:'wir sind',why:'Wir ile sein fiili “sind” olur.'}
 ]
 for(const rule of conjugations)for(const match of text.matchAll(rule.pattern)){
   if(match.index===undefined)continue
   const token=match[0],replacement=/^[A-ZÄÖÜ]/u.test(token)?rule.replace.charAt(0).toUpperCase()+rule.replace.slice(1):rule.replace
   add({id:'conj-'+rule.replace,severity:'error',titleTr:'Fiil çekimi',
    detailTr:rule.why,start:match.index,end:match.index+token.length,original:token,
    replacement,confidence:'high',safeToApply:true})
 }
 for(const match of text.matchAll(/ {2,}/gu)){
   if(match.index===undefined)continue
   add({id:'double-space',severity:'error',titleTr:'Fazla boşluk',
     detailTr:'Kelimeler arasında tek boşluk yeterlidir.',start:match.index,end:match.index+match[0].length,
     original:match[0],replacement:' ',confidence:'high',safeToApply:true})
 }
 for(const match of text.matchAll(/\s+[,!?]/gu)){
   if(match.index===undefined||match[0].includes('\n'))continue
   add({id:'punct-space',severity:'error',titleTr:'Noktalama öncesi boşluk',
   detailTr:'Virgül, ünlem veya soru işaretinden hemen önce boşluk bırakılmaz.',
   start:match.index,end:match.index+match[0].length,original:match[0],
   replacement:match[0].trim(),confidence:'high',safeToApply:true})
 }
 const stripped=text.trim()
 const head=stripped.split(/\r?\n/)[0]||''
 if(!/^(?:hallo\b|liebe\b|lieber\b|guten\s+tag\b)/iu.test(head)){
   add({id:'salutation',severity:'suggestion',titleTr:'Hitap kontrolü',detailTr:'Kişisel e-postada “Hallo '+task.emailTo+','+'” veya “Liebe/Lieber ...,” hitabı kullanılabilir.',confidence:'medium',safeToApply:false})
 }
 const lastLines=stripped.split(/\r?\n/).slice(-3).join(' ')
 if(!/(?:liebe\s+grüße|viele\s+grüße|herzliche\s+grüße|bis\s+bald|bis\s+später|dein[e]?\b|gru[eü]sse)/iu.test(lastLines)){
   add({id:'closing',severity:'suggestion',titleTr:'Kapanış kontrolü',detailTr:'Sona “Liebe Grüße” veya “Viele Grüße” gibi kişisel bir kapanış ekle.',confidence:'medium',safeToApply:false})
 }
 const count=wordCount(text)
 if(count<20||count>55){
   add({id:'length',severity:'suggestion',titleTr:'Kelime sayısı',detailTr:'ÖSD A1 kişisel e-postada yaklaşık 30 kelime hedeflenir. Şu an '+count+' kelime var.',confidence:'medium',safeToApply:false})
 }
 // Kelime anahtarları ANLAMI değerlendiremez. “Tamamlandı” demek yerine yalnız ipucu gösterir.
 const simple=fold(text)
 for(const point of task.points){
   const hit=point.signalPatterns.some(pattern=>simple.includes(fold(pattern)))
   if(!hit){
     add({id:'prompt-'+point.id,severity:'info',titleTr:'Görev maddesini kendin kontrol et',
      detailTr:'“'+point.question+'” sorusuna net cevap verdin mi? '+point.hintTr+' Anahtar kelime bulunamaması, cevap olmadığı anlamına gelmez.',
      confidence:'low',safeToApply:false})
   }
 }
 return issues.sort((a,b)=>(a.start??Number.MAX_SAFE_INTEGER)-(b.start??Number.MAX_SAFE_INTEGER))
}
export function getHighlightSpans(text:string,issues:Issue[]){
 const relevant=issues.filter(i=>i.start!==undefined&&i.end!==undefined&&i.end>i.start)
  .sort((a,b)=>(a.start||0)-(b.start||0))
 const spans:{text:string;issue?:Issue}[]=[]
 let last=0
 for(const issue of relevant){
  const start=issue.start!,end=issue.end!
  if(start<last||end>text.length)continue
  if(start>last)spans.push({text:text.slice(last,start)})
  spans.push({text:text.slice(start,end),issue})
  last=end
 }
 if(last<text.length)spans.push({text:text.slice(last)})
 return spans
}
export function applyFix(text:string,issue:Issue):string {
 if(!issue.safeToApply||issue.start===undefined||issue.end===undefined||issue.replacement===undefined)return text
 if(text.slice(issue.start,issue.end)!==issue.original)return text
 return text.slice(0,issue.start)+issue.replacement+text.slice(issue.end)
}
