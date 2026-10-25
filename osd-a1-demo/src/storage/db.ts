import type { Attempt, LastView, ProgressOverview } from './models'
import {readingResult,hearingResult,type ExamRun} from '../modules/exam/model'

const DB_NAME = 'ayda-osd-a1-demo'
export const DB_VERSION = 2

export const STORE_NAMES = ['meta','attempts','drafts','progress','sessions','recordings','teacherRequests','examSessions'] as const
export type StoreName = typeof STORE_NAMES[number]
export function missingStores(existing:Iterable<string>):StoreName[]{
 const available=new Set(existing)
 return STORE_NAMES.filter(name=>!available.has(name))
}
type StoredValue = unknown

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('Tarayıcı yerel veritabanını desteklemiyor.'))
      return
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      // v1 -> v2 yalnızca examSessions deposunu oluşturur; diğer kayıtlar ve bloblar korunur.
      for (const name of missingStores(Array.from(db.objectStoreNames))) db.createObjectStore(name,{keyPath:'id'})
    }
    request.onerror = () => reject(request.error ?? new Error('Yerel veri deposu açılmadı.'))
    request.onblocked = () => reject(new Error('Veritabanı başka bir sekmede açık.'))
    request.onsuccess = () => resolve(request.result)
  })
}

async function transaction<T>(name: StoreName, mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDatabase()
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(name, mode)
      const req = run(tx.objectStore(name))
      let value: T
      req.onsuccess = () => { value = req.result }
      req.onerror = () => reject(req.error ?? new Error('Kayıt isteği başarısız.'))
      tx.oncomplete = () => resolve(value)
      tx.onerror = () => reject(tx.error ?? new Error('Veri kaydedilemedi.'))
      tx.onabort = () => reject(tx.error ?? new Error('Veri işlemi iptal edildi.'))
    })
  } finally {
    db.close()
  }
}

export async function putRecord<T extends { id: string }>(store: StoreName, record: T): Promise<void> {
  await transaction<IDBValidKey>(store, 'readwrite', (s) => s.put(record))
}

export async function readRecord<T>(store: StoreName, id: string): Promise<T | undefined> {
  return transaction<T | undefined>(store, 'readonly', (s) => s.get(id))
}

export async function listRecords<T>(store: StoreName): Promise<T[]> {
  return transaction<T[]>(store, 'readonly', (s) => s.getAll())
}

export async function deleteRecord(store: StoreName, id: string): Promise<void> {
  await transaction<undefined>(store, 'readwrite', (s) => s.delete(id))
}

export async function setPreference(id: string, value: StoredValue): Promise<void> {
  await putRecord('meta', { id, value })
}

export async function getPreference<T>(id: string): Promise<T | undefined> {
  const row = await readRecord<{ id: string; value: T }>('meta', id)
  return row?.value
}

export async function saveLastView(path: string): Promise<void> {
  await setPreference('lastView', { path, updatedAt: new Date().toISOString() } satisfies LastView)
}

export async function readLastView(): Promise<LastView | undefined> {
  return getPreference<LastView>('lastView')
}

export async function readProgressOverview(): Promise<ProgressOverview> {
  const [attempts,examRows]=await Promise.all([listRecords<Attempt>('attempts'),listRecords<ExamRun>('examSessions')])
  const finished=attempts.filter(x=>Boolean(x.finishedAt))
  const exams=examRows.filter(x=>x.kind==='integrated-exam'&&x.status==='finished')
  const uniqueIds=[...finished.map(x=>x.taskId),...exams.map(x=>x.id)]
  const wrongStandalone=finished.reduce((sum,item)=>sum+(item.correctCount===undefined?0:Math.max(0,(item.answeredCount??item.answers.length)-item.correctCount)),0)
  return {
    attempts:finished.length+exams.length,
    completed:new Set(uniqueIds).size,
    wrong:wrongStandalone+exams.reduce((sum,s)=>sum+readingResult(s).wrong+hearingResult(s).wrong,0)
  }
}

export async function clearAllLocalData():Promise<void>{
 const db=await openDatabase()
 try{
  await new Promise<void>((resolve,reject)=>{
   const tx=db.transaction([...STORE_NAMES],'readwrite')
   for(const name of STORE_NAMES)tx.objectStore(name).clear()
   tx.oncomplete=()=>resolve()
   tx.onerror=()=>reject(tx.error??new Error('Sıfırlama başarısız.'))
   tx.onabort=()=>reject(tx.error??new Error('Sıfırlama iptal edildi.'))
  })
 }finally{db.close()}
}
async function encodeBlob(blob:Blob):Promise<string>{
 const bytes=new Uint8Array(await blob.arrayBuffer())
 let text=''
 for(let i=0;i<bytes.length;i+=8192)text+=String.fromCharCode(...bytes.subarray(i,i+8192))
 return btoa(text)
}
export async function exportAllLocalData():Promise<string>{
 const dbVersion=DB_VERSION
 const stores:Record<string,unknown[]>={}
 for(const name of STORE_NAMES){
  const list=await listRecords<Record<string,unknown>>(name)
  stores[name]=name==='recordings'
   ?await Promise.all(list.map(async row=>{
     if(row.blob instanceof Blob){
       const {blob,...meta}=row
       return {...meta,blob:{type:blob.type,size:blob.size,base64:await encodeBlob(blob)}}
     }
     return row
    }))
   :list
 }
 return JSON.stringify({format:'ayda-osd-a1-demo-backup',schemaVersion:dbVersion,exportedAt:new Date().toISOString(),stores},null,2)
}
