import {describe,it,expect} from 'vitest'
import {SERVICES,createDemoRequest,findService,formatPrice,isDemoRequest,simulateNext,validateRequest} from './model'
describe('Aşama 7 öğretmen desteği — yalnız demo',()=>{
 const now=new Date('2026-10-25T09:00:00').getTime()
 it('6 hizmetin öneri fiyatı sabit; gerçek tahsilat alanı yok',()=>{
  expect(SERVICES).toHaveLength(6)
  expect(SERVICES.map(x=>x.priceTry)).toEqual([499,1299,1250,1250,2250,2250])
  expect(formatPrice(1299)).toContain('TL')
 })
 it('tek/üç mektup için eşsiz seçilmiş taslak şart',()=>{
  const one=findService('writing-single')!,three=findService('writing-three')!
  expect(validateRequest(one,[],'','',now)).toBeTruthy()
  expect(validateRequest(one,['draft1'],'','',now)).toBeNull()
  expect(validateRequest(three,['draft1','draft1','draft2'],'','',now)).toBeTruthy()
  expect(validateRequest(three,['a','b','c'],'','',now)).toBeNull()
 })
 it('geçmişe rezervasyon istenemez; seçilen saat müsaitlik değildir',()=>{
  const live=findService('speaking-live-30')!
  expect(validateRequest(live,[],'2026-10-24','10:00',now)).toBeTruthy()
  expect(validateRequest(live,[],'2026-11-02','14:00',now)).toBeNull()
  const req=createDemoRequest(live,[],'2026-11-02','14:00',now,'test-id')
  expect(req).toMatchObject({status:'saved',kind:'teacher-service-demo',proposedPriceTry:1250,preferredTime:'14:00'})
  expect(req).not.toHaveProperty('paymentId')
  expect(req).not.toHaveProperty('confirmedBookingId')
 })
 it('durumlar yalnız simülasyon olarak ilerler ve geri sıfırlanmaz',()=>{
  const live=findService('speaking-live-60')!
  let req=createDemoRequest(live,[],'2026-11-02','10:00',now,'id-2')
  expect(isDemoRequest(req)).toBe(true)
  req=simulateNext(req,now+1000);expect(req.status).toBe('simulated-delivered')
  req=simulateNext(req,now+2000);expect(req.status).toBe('simulated-reviewing')
  req=simulateNext(req,now+3000);expect(req.status).toBe('simulated-completed')
  expect(simulateNext(req)).toEqual(req)
  expect(isDemoRequest({id:'older',status:'demo-request'})).toBe(false)
 })
})
