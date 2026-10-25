import {describe,it,expect} from 'vitest'
import {DB_VERSION,STORE_NAMES,missingStores} from './db'
describe('IndexedDB v1 -> v2 geçişi',()=>{
 it('mevcut depolar yeniden oluşturulmaz veya silinmez',()=>{
  expect(DB_VERSION).toBe(2)
  const previous=['meta','attempts','drafts','progress','sessions','recordings','teacherRequests']
  expect(missingStores(previous)).toEqual(['examSessions'])
 })
 it('tüm depolar varsa göç işlemi yoktur',()=>expect(missingStores([...STORE_NAMES])).toEqual([]))
 it('ses kayıtları ve mevcut denemeler yedek kapsamındadır',()=>{
  expect(STORE_NAMES).toContain('recordings')
  expect(STORE_NAMES).toContain('examSessions')
  expect(STORE_NAMES).toContain('attempts')
 })
})
