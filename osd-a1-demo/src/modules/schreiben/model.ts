import type { WritingMode } from './content'
export interface WritingDraft {
 id:string; module:'schreiben'; taskId:string; mode:WritingMode; startedAt:string; updatedAt:string;
 endsAt?:string; finishedAt?:string; email:string; form:Record<string,string>;
 snapshots:{id:string;date:string;label:string;email:string;form:Record<string,string>}[]
}
export const WRITE_SECONDS=20*60
export const draftId=(taskId:string,mode:WritingMode)=>'schreiben:'+taskId+':'+mode+':draft'
export const countDown=(draft:WritingDraft,at=Date.now())=>
 !draft.endsAt?WRITE_SECONDS:Math.max(0,Math.ceil((new Date(draft.endsAt).getTime()-at)/1000))
export const showTime=(seconds:number)=>String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0')
export function newDraft(taskId:string,mode:WritingMode,at=Date.now()):WritingDraft {
 const stamp=new Date(at).toISOString()
 return {id:draftId(taskId,mode),taskId,module:'schreiben',mode,startedAt:stamp,updatedAt:stamp,
 endsAt:mode==='timed'?new Date(at+WRITE_SECONDS*1000).toISOString():undefined,
 email:'',form:{},snapshots:[]}
}
export function reviseDraft(draft:WritingDraft,changes:Partial<Pick<WritingDraft,'email'|'form'>>):WritingDraft {
 return {...draft,...changes,updatedAt:new Date().toISOString()}
}
export function snapshotDraft(draft:WritingDraft,now=Date.now()):WritingDraft {
 const n={id:String(now),date:new Date(now).toISOString(),
 label:new Date(now).toLocaleString('tr-TR'),email:draft.email,form:{...draft.form}}
 return {...draft,snapshots:[n,...draft.snapshots].slice(0,5),updatedAt:new Date(now).toISOString()}
}
export function restoreSnapshot(draft:WritingDraft,id:string):WritingDraft {
 const saved=draft.snapshots.find(x=>x.id===id)
 return saved?{...draft,email:saved.email,form:{...saved.form},updatedAt:new Date().toISOString()}:draft
}
export function finishDraft(draft:WritingDraft,at=Date.now()):WritingDraft {
 return {...draft,finishedAt:new Date(at).toISOString(),updatedAt:new Date(at).toISOString()}
}
export function makeWritingAttempt(draft:WritingDraft) {
 return {id:'schreiben:'+draft.taskId+':'+draft.mode+':finished:'+Date.now(),
 module:'schreiben' as const,taskId:draft.taskId,mode:draft.mode==='timed'?'exam' as const:'practice' as const,
 startedAt:draft.startedAt,updatedAt:draft.updatedAt,finishedAt:draft.finishedAt,
 answers:[],writing:{form:{...draft.form},email:draft.email}}
 // intentionally NO correctCount: text cannot be machine-scored reliably.
}
