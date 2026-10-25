import type {Attempt} from '../../storage/models'
import type {WritingDraft} from '../schreiben/model'
import type {SpeakingSession} from '../sprechen/model'
import {PARTS,PART_LABELS,hearingResult,readingResult,type ExamPart,type ExamRun} from '../exam/model'

export interface ProgressEvent {
 id:string;title:string;module:ExamPart|'exam';date:string;kind:'finished'|'active'
 details:string;path:string
}
export interface SkillScore {
 module:ExamPart;finished:number;graded:number;correct:number;wrong:number;blank:number
}
export interface ProgressSummary {
 finishedCount:number;activeCount:number;uniqueTasks:number;examFinished:number;examActive:number;
 writingDrafts:number;recordingCount:number;correct:number;wrong:number;blank:number;
 skills:SkillScore[];activity:{day:string;count:number}[];recent:ProgressEvent[];
 recommendations:{module:ExamPart;reason:string}[]
}
const isExam=(row:ExamRun)=>row?.kind==='integrated-exam'&&row.version===1
const pathBy=(part:ExamPart)=>'#/module/'+part
const localDay=(iso:string)=>{const d=new Date(iso);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
const fmt=(a:Attempt)=>{
 if(a.correctCount===undefined)return 'Öznel/puanlanmayan çalışma'
 const answered=a.answeredCount??a.answers.length
 return a.correctCount+' doğru · '+Math.max(0,answered-a.correctCount)+' yanlış'
}
export function computeProgress(
  attempts:Attempt[],drafts:WritingDraft[],speak:SpeakingSession[],rawExam:ExamRun[],now=Date.now()
):ProgressSummary {
 const done=attempts.filter(a=>Boolean(a.finishedAt))
 const inProgress=attempts.filter(a=>!a.finishedAt)
 const exams=rawExam.filter(isExam)
 const examDone=exams.filter(e=>e.status==='finished')
 const examsActive=exams.filter(e=>e.status!=='finished')
 const writtenDrafts=drafts.filter(d=>d?.module==='schreiben'&&!d.finishedAt)
 const speakingActive=speak.filter(s=>s?.module==='sprechen'&&!s.finishedAt)
 const skills:SkillScore[]=PARTS.map(module=>({module,finished:0,graded:0,correct:0,wrong:0,blank:0}))
 const get=(module:ExamPart)=>skills.find(s=>s.module===module)!
 const unique=new Set<string>()
 for(const a of done){
  if(!PARTS.includes(a.module as ExamPart))continue
  const score=get(a.module as ExamPart)
  score.finished++
  unique.add(a.module+':'+a.taskId)
  if(a.correctCount!==undefined){
   const answered=a.answeredCount??a.answers.length
   score.graded++
   score.correct+=a.correctCount
   score.wrong+=Math.max(0,answered-a.correctCount)
   score.blank+=Math.max(0,(a.questionCount??answered)-answered)
  }
 }
 for(const e of examDone){
  unique.add(e.id)
  const grades={lesen:readingResult(e),hoeren:hearingResult(e)}
  for(const module of PARTS){
   const skill=get(module)
   skill.finished++
   if(module==='lesen'||module==='hoeren'){
    const g=grades[module];skill.graded++
    skill.correct+=g.correct;skill.wrong+=g.wrong;skill.blank+=g.blank
   }
  }
 }
 const all:ProgressEvent[]=[
 ...done.filter(a=>PARTS.includes(a.module as ExamPart)).map(a=>({
  id:a.id,title:PART_LABELS[a.module as ExamPart]+' · '+a.taskId,module:a.module as ExamPart,
  date:a.finishedAt!,kind:'finished' as const,details:fmt(a),path:pathBy(a.module as ExamPart)
 })),
 ...examDone.map(e=>({id:e.id,title:'Tam deneme · Set '+(e.setIndex+1),module:'exam' as const,
  date:e.finishedAt!,kind:'finished' as const,details:readingResult(e).correct+' Lesen doğru · '+hearingResult(e).correct+' Hören doğru',path:'#/exam?run='+encodeURIComponent(e.id)})),
 ...inProgress.filter(a=>PARTS.includes(a.module as ExamPart)).map(a=>({
  id:a.id,title:PART_LABELS[a.module as ExamPart]+' · devam ediyor',module:a.module as ExamPart,
  date:a.updatedAt,kind:'active' as const,details:'Cihazda kayıtlı çalışma',path:pathBy(a.module as ExamPart)})),
 ...examsActive.map(e=>({id:e.id,title:'Tam deneme · Set '+(e.setIndex+1),module:'exam' as const,
  date:e.updatedAt,kind:'active' as const,details:PART_LABELS[e.part]+' bölümünde kaldı',path:'#/exam?run='+encodeURIComponent(e.id)})),
 ...writtenDrafts.map(d=>({id:d.id,title:'Schreiben taslağı',module:'schreiben' as const,
  date:d.updatedAt,kind:'active' as const,details:d.email.trim()?'Yazılı metin saklandı':'Form veya e-posta taslağı',path:'#/module/schreiben'})),
 ...speakingActive.map(s=>({id:s.id,title:'Sprechen provası',module:'sprechen' as const,
  date:s.updatedAt,kind:'active' as const,details:'Kaldığın bölümden devam et',path:'#/module/sprechen'}))
 ].sort((a,b)=>b.date.localeCompare(a.date))
 const finishedDates=[...done.map(a=>a.finishedAt!),...examDone.map(e=>e.finishedAt!)]
 const activity=Array.from({length:7},(_,i)=>{
  const d=new Date(now);d.setHours(12,0,0,0);d.setDate(d.getDate()-6+i)
  const day=localDay(d.toISOString())
  return {day,count:finishedDates.filter(x=>localDay(x)===day).length}
 })
 const recommendations:{module:ExamPart;reason:string}[]=[]
 for(const s of skills){
  if(s.graded>0&&(s.wrong>0||s.blank>0))recommendations.push({module:s.module,reason:s.wrong+' yanlış, '+s.blank+' boş cevap: açıklamaları tekrar incele.'})
 }
 if(writtenDrafts.length)recommendations.push({module:'schreiben',reason:writtenDrafts.length+' tamamlanmamış yazma taslağın var.'})
 if(speakingActive.length)recommendations.push({module:'sprechen',reason:speakingActive.length+' devam eden sözlü provan var.'})
 return {finishedCount:done.length+examDone.length,
 activeCount:inProgress.length+examsActive.length+writtenDrafts.length+speakingActive.length,
 uniqueTasks:unique.size,examFinished:examDone.length,examActive:examsActive.length,
 writingDrafts:writtenDrafts.length,recordingCount:speak.reduce((n,s)=>n+Object.keys(s.recordings||{}).length,0)+exams.filter(e=>e.speaking.recording).length,
 correct:skills.reduce((n,s)=>n+s.correct,0),wrong:skills.reduce((n,s)=>n+s.wrong,0),blank:skills.reduce((n,s)=>n+s.blank,0),
 skills,activity,recent:all,recommendations}
}
