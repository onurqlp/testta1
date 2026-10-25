import type { Answer } from '../../storage/models'
import { getHearingSet, matchesAnswer, type HearingSet } from './content'
import type { Mode, Part } from './content'

export const EXAM_SECONDS = 10*60 // ÖSD yaklaşık 10 dakika; demo süre sınırı
export const PLAY_LIMIT:Record<Part,number> = {1:1,2:2,3:1}
export type FinishReason = 'submitted' | 'timeout'

export interface HearingAttempt {
 id:string
 module:'hoeren'
 taskId:string
 mode:Mode
 startedAt:string
 updatedAt:string
 finishedAt?:string
 endsAt?:string
 currentIndex:number
 flaggedQuestionIds:string[]
 answers: Answer[]
 plays:Record<Part,number>
 correctCount?:number
 answeredCount?:number
 questionCount?:number
 completionReason?:FinishReason
}
export const draftId=(id:string,mode:Mode)=>'hoeren:'+id+':'+mode+':active'
export function makeAttempt(set:HearingSet,mode:Mode,now=Date.now()):HearingAttempt {
 const stamp=new Date(now).toISOString()
 return {id:draftId(set.id,mode),module:'hoeren',taskId:set.id,mode,startedAt:stamp,updatedAt:stamp,
   endsAt:mode==='exam'?new Date(now+EXAM_SECONDS*1000).toISOString():undefined,
   currentIndex:0,flaggedQuestionIds:[],answers:[],plays:{1:0,2:0,3:0}}
}
export function selectedValue(a:HearingAttempt,qid:string):string {
 return String(a.answers.find(x=>x.questionId===qid)?.value||'')
}
export function updateAnswer(a:HearingAttempt,qid:string,value:string):HearingAttempt {
 return {...a,updatedAt:new Date().toISOString(),
  answers:[...a.answers.filter(x=>x.questionId!==qid),{questionId:qid,value}]}
}
export function countResults(a:HearingAttempt,set:HearingSet) {
 const all=set.units.flatMap(x=>x.questions)
 const answered=all.filter(q=>!!selectedValue(a,q.id).trim())
 const correct=answered.filter(q=>matchesAnswer(q,selectedValue(a,q.id)))
 const wrong=answered.filter(q=>!matchesAnswer(q,selectedValue(a,q.id)))
 return {total:all.length,answered:answered.length,correct:correct.length,wrong:wrong.length,
   unanswered:all.length-answered.length,wrongIds:wrong.map(q=>q.id)}
}
export function finishAttempt(a:HearingAttempt,reason:FinishReason,now=Date.now()):HearingAttempt {
 const set=getHearingSet(a.taskId)
 if(!set)throw new Error('Dinleme seti bulunamadı')
 const results=countResults(a,set)
 return {...a,id:'hoeren:'+a.taskId+':'+a.mode+':finished:'+now,updatedAt:new Date(now).toISOString(),
 finishedAt:new Date(now).toISOString(),completionReason:reason,correctCount:results.correct,
 answeredCount:results.answered,questionCount:results.total}
}
export const remaining=(a:HearingAttempt,now=Date.now()) =>
  a.mode!=='exam'||!a.endsAt?EXAM_SECONDS:Math.max(0,Math.ceil((new Date(a.endsAt).getTime()-now)/1000))
export const formatTime=(s:number)=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')
export function canReplay(a:HearingAttempt,part:Part):boolean {
 return a.mode==='practice'||(a.plays[part]||0)<PLAY_LIMIT[part]
}
export function registerPlay(a:HearingAttempt,part:Part):HearingAttempt {
 if(!canReplay(a,part))return a
 return {...a,updatedAt:new Date().toISOString(),plays:{...a.plays,[part]:(a.plays[part]||0)+1}}
}
