import type { Attempt, LastView, ProgressOverview } from './models'

const DB_NAME = 'ayda-osd-a1-demo'
const DB_VERSION = 1

type StoreName = 'meta' | 'attempts' | 'drafts' | 'progress' | 'sessions' | 'recordings' | 'teacherRequests'
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
      const stores: StoreName[] = ['meta', 'attempts', 'drafts', 'progress', 'sessions', 'recordings', 'teacherRequests']
      for (const name of stores) if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: 'id' })
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
  const attempts = await listRecords<Attempt>('attempts')
  const finished = attempts.filter((item) => Boolean(item.finishedAt))
  return {
    attempts: finished.length,
    completed: new Set(finished.map((item) => item.taskId)).size,
    wrong: finished.reduce((count, item) => count + (
      item.questionCount !== undefined && item.correctCount !== undefined
        ? Math.max(0, item.questionCount - item.correctCount) : 0
    ), 0)
  }
}
