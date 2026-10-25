import {readingSets} from '../lesen/content'
import {hearingSets,matchesAnswer} from '../hoeren/content'
import {writingTasks} from '../schreiben/content'
import {speakingSets} from '../sprechen/content'

export type ExamPart='lesen'|'hoeren'|'schreiben'|'sprechen'
export const PARTS:ExamPart[]=['lesen','hoeren','schreiben','sprechen']
export const PART_LABELS:Record<ExamPart,string>={lesen:'Lesen',hoeren:'Hören',schreiben:'Schreiben',sprechen:'Sprechen'}
export const LIMITS:Record<ExamPart,number>={lesen:1500,hoeren:600,schreiben:1200,sprechen:600}
export type Three=1|2|3
export const HEARING_LIMITS:Record<Three,number>={1:1,2:2,3:1}
export interface ExamPartData {
 startedAt?:string;endsAt?:string;finishedAt?:string;pausedAt?:string;
 questionIndex:number;answers:Record<string,string>
}
export interface ExamRun {
 id:string;kind:'integrated-exam';version:1;setIndex:0|1;status:'active'|'paused'|'finished';
 startedAt:string;updatedAt:string;finishedAt?:string;part:ExamPart;
 sections:Record<ExamPart,ExamPartData>;
 hearing:{part:Three;plays:Record<Three,number>;completed:Record<Three,number>;positions:Record<Three,number>};
 writing:{form:Record<string,string>;email:string};
 speaking:{phase:'prep'|'speech';topics:string[];sceneId:string;step:number;notes:string;
    recording?:{id:string;duration:number;size:number;mime:string;createdAt:string}}
}
const stamp=(time:number)=>new Date(time).toISOString()
export const selectedSet=(run:ExamRun)=>({
 lesen:readingSets[run.setIndex],hoeren:hearingSets[run.setIndex],
 schreiben:writingTasks[run.setIndex],sprechen:speakingSets[run.setIndex]
})
const blank=():ExamPartData=>({questionIndex:0,answers:{}})
export function newExam(setIndex:0|1,now=Date.now()):ExamRun {
 const start=stamp(now)
 return {
 id:'exam:a1:'+now+':'+setIndex,kind:'integrated-exam',version:1,setIndex,status:'active',
 startedAt:start,updatedAt:start,part:'lesen',
 sections:{lesen:{...blank(),startedAt:start,endsAt:stamp(now+LIMITS.lesen*1000)},hoeren:blank(),schreiben:blank(),sprechen:blank()},
 hearing:{part:1,plays:{1:0,2:0,3:0},completed:{1:0,2:0,3:0},positions:{1:0,2:0,3:0}},
 writing:{form:{},email:''},speaking:{phase:'prep',topics:[],sceneId:'',step:0,notes:''}
 }
}
export const remaining=(run:ExamRun,now=Date.now()):number=>{
 const section=run.sections[run.part]
 if(!section.endsAt||run.status==='finished')return 0
 const ref=run.status==='paused'&&section.pausedAt?Date.parse(section.pausedAt):now
 return Math.max(0,Math.ceil((Date.parse(section.endsAt)-ref)/1000))
}
export const timeText=(secs:number)=>String(Math.floor(secs/60)).padStart(2,'0')+':'+String(secs%60).padStart(2,'0')
export function pauseExam(run:ExamRun,now=Date.now()):ExamRun{
 if(run.status!=='active')return run
 const sections={...run.sections,[run.part]:{...run.sections[run.part],pausedAt:stamp(now)}}
 return {...run,status:'paused',sections,updatedAt:stamp(now)}
}
export function resumeExam(run:ExamRun,now=Date.now()):ExamRun{
 if(run.status!=='paused')return run
 const part=run.part, section=run.sections[part]
 const ms=Math.max(0,now-Date.parse(section.pausedAt||stamp(now)))
 const sections={...run.sections,[part]:{...section,pausedAt:undefined,endsAt:section.endsAt?stamp(Date.parse(section.endsAt)+ms):undefined}}
 return {...run,status:'active',sections,updatedAt:stamp(now)}
}
export function answerExam(run:ExamRun,id:string,value:string,now=Date.now()):ExamRun {
 const section=run.sections[run.part]
 return {...run,sections:{...run.sections,[run.part]:{...section,answers:{...section.answers,[id]:value}}},updatedAt:stamp(now)}
}
export const hearingPending=(run:ExamRun,part:Three)=>run.hearing.plays[part]>run.hearing.completed[part]
export const hearingCanPlay=(run:ExamRun,part:Three)=>hearingPending(run,part)||run.hearing.plays[part]<HEARING_LIMITS[part]
export function playHearing(run:ExamRun,part:Three,now=Date.now()):ExamRun{
 if(!hearingCanPlay(run,part)||hearingPending(run,part))return run
 return {...run,hearing:{...run.hearing,plays:{...run.hearing.plays,[part]:run.hearing.plays[part]+1}},updatedAt:stamp(now)}
}
export function rememberHearing(run:ExamRun,part:Three,position:number):ExamRun{
 return {...run,hearing:{...run.hearing,positions:{...run.hearing.positions,[part]:Math.max(0,position)}}}
}
export function finishHearingPlayback(run:ExamRun,part:Three):ExamRun{
 return {...run,hearing:{...run.hearing,completed:{...run.hearing.completed,[part]:Math.min(run.hearing.plays[part],run.hearing.completed[part]+1)},positions:{...run.hearing.positions,[part]:0}}}
}
export function startSpeakingPerformance(run:ExamRun,now=Date.now()):ExamRun{
 if(run.part!=='sprechen'||run.speaking.phase!=='prep')return run
 return {...run,speaking:{...run.speaking,phase:'speech'},
  sections:{...run.sections,sprechen:{...run.sections.sprechen,endsAt:stamp(now+LIMITS.sprechen*1000)}},updatedAt:stamp(now)}
}
export function completePart(run:ExamRun,now=Date.now()):ExamRun{
 if(run.status!=='active')return run
 if(run.part==='sprechen'&&run.speaking.phase==='prep')return startSpeakingPerformance(run,now)
 const part=run.part,idx=PARTS.indexOf(part),finishedAt=stamp(now)
 const current={...run.sections[part],finishedAt,pausedAt:undefined}
 const sections={...run.sections,[part]:current}
 if(idx===PARTS.length-1)return {...run,sections,status:'finished',finishedAt,updatedAt:finishedAt}
 const next=PARTS[idx+1]
 sections[next]={...sections[next],startedAt:finishedAt,endsAt:stamp(now+(next==='sprechen'?600:LIMITS[next])*1000)}
 return {...run,sections,part:next,updatedAt:finishedAt}
}
export function readingResult(run:ExamRun){
 const s=selectedSet(run).lesen,answers=run.sections.lesen.answers
 const correct=s.questions.filter(q=>answers[q.id]===q.answer).length
 const answered=s.questions.filter(q=>Boolean(answers[q.id])).length
 return {correct,wrong:answered-correct,answered,blank:s.questions.length-answered,total:s.questions.length,
 wrongItems:s.questions.filter(q=>Boolean(answers[q.id])&&answers[q.id]!==q.answer)
  .map(q=>({id:q.id,part:q.part,prompt:q.prompt,user:answers[q.id],answer:q.answer,why:q.explanation}))}
}
export function hearingResult(run:ExamRun){
 const s=selectedSet(run).hoeren,answers=run.sections.hoeren.answers,qs=s.units.flatMap(u=>u.questions)
 const correct=qs.filter(q=>matchesAnswer(q,answers[q.id])).length
 const answered=qs.filter(q=>Boolean(answers[q.id]?.trim())).length
 return {correct,wrong:answered-correct,answered,blank:qs.length-answered,total:qs.length,
 wrongItems:qs.filter(q=>Boolean(answers[q.id]?.trim())&&!matchesAnswer(q,answers[q.id]))
 .map(q=>({id:q.id,part:q.part,prompt:q.prompt,user:answers[q.id],answer:q.answer,why:q.explanationTr}))}
}
export function examCounts(run:ExamRun) {
 const lesen=readingResult(run),hoeren=hearingResult(run)
 const form=selectedSet(run).schreiben.fields
 const filled=form.filter(f=>Boolean(run.writing.form[f.id]?.trim())).length
 return {lesen,hoeren,formFilled:filled,formTotal:form.length,emailWords:run.writing.email.trim()?run.writing.email.trim().split(/\s+/).length:0,
 topics:run.speaking.topics.length,recordings:run.speaking.recording?1:0,
 completedParts:PARTS.filter(p=>Boolean(run.sections[p].finishedAt)).length}
}
export function suggestedRetakes(run:ExamRun):ExamPart[]{
 const l=readingResult(run),h=hearingResult(run),suggest:ExamPart[]=[]
 if(l.wrong>0||l.blank>0)suggest.push('lesen')
 if(h.wrong>0||h.blank>0)suggest.push('hoeren')
 if(examCounts(run).formFilled<10||!run.writing.email.trim())suggest.push('schreiben')
 if(!run.speaking.recording)suggest.push('sprechen')
 return suggest
}
