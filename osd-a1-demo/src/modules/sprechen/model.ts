import type { SpeakingMode, SpeakingPart, SpeakingSet } from './content'
export const SPEAKING_SECONDS=10*60
export interface SpeakingSession {
 id:string;module:'sprechen';setId:string;mode:SpeakingMode;startedAt:string;updatedAt:string;
 endsAt?:string;finishedAt?:string;currentPart:SpeakingPart;
 selectedTopics:string[];sceneId:string;roleplayStep:number;
 notes:Partial<Record<SpeakingPart,string>>;
 selfChecks:Partial<Record<SpeakingPart,string[]>>;
 recordings:Partial<Record<SpeakingPart,{id:string;duration:number;size:number;mime:string;createdAt:string}>>;
}
export interface LocalRecording {
 id:string;sessionId:string;part:SpeakingPart;createdAt:string;mime:string;duration:number;
 blob:Blob
}
export const recordingId=(sessionId:string,part:SpeakingPart)=>sessionId+':recording:'+part
export const durationText=(seconds:number)=>String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0')
export function makeSession(set:SpeakingSet,mode:SpeakingMode,at=Date.now()):SpeakingSession{
 const date=new Date(at).toISOString()
 return {id:'sprechen:'+set.id+':'+mode+':session:'+at,module:'sprechen',setId:set.id,mode,
 startedAt:date,updatedAt:date,endsAt:mode==='timed'?new Date(at+SPEAKING_SECONDS*1000).toISOString():undefined,
 currentPart:1,selectedTopics:[],sceneId:set.scenes[0].id,roleplayStep:0,notes:{},selfChecks:{},recordings:{}}
}
export function remainingSeconds(s:SpeakingSession,now=Date.now()):number{
 return !s.endsAt||s.finishedAt?SPEAKING_SECONDS:Math.max(0,Math.ceil((new Date(s.endsAt).getTime()-now)/1000))
}
export function toggleTopic(s:SpeakingSession,id:string):SpeakingSession{
 const next=s.selectedTopics.includes(id)?s.selectedTopics.filter(x=>x!==id):s.selectedTopics.length<4?[...s.selectedTopics,id]:s.selectedTopics
 return {...s,selectedTopics:next,updatedAt:new Date().toISOString()}
}
export function setPart(s:SpeakingSession,part:SpeakingPart):SpeakingSession{
 return {...s,currentPart:part,updatedAt:new Date().toISOString()}
}
export function finishSession(s:SpeakingSession,at=Date.now()):SpeakingSession{
 return {...s,finishedAt:new Date(at).toISOString(),updatedAt:new Date(at).toISOString()}
}
export function makeAttempt(s:SpeakingSession){
 return {id:s.id+':completed',module:'sprechen' as const,taskId:s.setId,
 mode:s.mode==='practice'?'practice' as const:'exam' as const,
 startedAt:s.startedAt,updatedAt:s.updatedAt,finishedAt:s.finishedAt,
 answers:[],
 speaking:{sessionId:s.id,selectedTopics:s.selectedTopics,sceneId:s.sceneId,recordingCount:Object.keys(s.recordings).length}}
 // No automatic pronunciation or success score.
}
export const selectedComplete=(s:SpeakingSession)=>s.selectedTopics.length===4
