# Aşama 7 — Öğretmen hizmetleri entegrasyon sözleşmesi
25 Ekim 2026 — **yalnızca demo / uygulanmamış entegrasyon tasarımı**

## Kaynak ve kesin sınırlar
Kaynak: `AYDA_OSD_A1_DEMO_8_ASAMA_GO_MASTER_PROMPT_2026-10-25.txt` bölüm 5 ve Aşama 7.
Uygulama henüz öğretmen takvimine, ödeme hizmetine, AYDA yönetim sistemine veya dosya gönderimine **bağlı değildir**. Kullanıcı tarafından seçilen saatler gerçek uygunluk değildir; fiyatlar yönetimce onaylanmamış öneri fiyatlardır. İstemcide saklanan durum değişiklikleri yalnız **simülasyondur**.
A1 demosu gerçek ödeme, ödeme bilgisi, kişisel iletişim bilgisi, randevu, değerlendirme sonucu veya öğretmen görüşme URL'si üretmez.

## Katalog (önerilen demo fiyatları)
| ID | Hizmet | Süre / tür | Öneri |
|---|---|---|---|
| writing-single | 1 mektup öğretmen kontrolü | asenkron, tek metin | 499 TL |
| writing-three | 3 mektup kontrolü | asenkron, üç metin | 1.299 TL |
| writing-live-30 | Canlı Schreiben | 30 dk | 1.250 TL |
| speaking-live-30 | Canlı Sprechen provası | 30 dk | 1.250 TL |
| speaking-live-60 | Canlı Sprechen | 60 dk | 2.250 TL |
| combined-live-60 | Sprechen + Schreiben | 60 dk | 2.250 TL |

Referans AYDA özel ders tarifesi ayrı üründür: tek ders 3.000 TL, 8 ders 18.000 TL, 16 ders 31.200 TL. Ders süresi doğrulanmadan sabit dakika belirtilmemiştir.

## Mevcut demo depolama sözleşmesi
- Store: mevcut IndexedDB `teacherRequests`, DB sürümü 2'de **yeni store eklenmedi**.
- Ayırıcı: `kind: 'teacher-service-demo'`, `version: 1`.
- Alanlar: `id`, `createdAt`, `updatedAt`, `serviceId`, `proposedPriceTry`, `status`, `draftIds[]`; canlı seans için ayrıca `preferredDate`, `preferredTime`.
- Hiçbir metin, dosya veya ses, `teacherRequests` içine kopyalanmaz. Yazı kaynakları `drafts` store'unda kalır. Ses kaynakları `recordings` store'undan çıkmaz.
- Örnek durumlar: `saved`, `simulated-delivered`, `simulated-reviewing`, `simulated-completed`. Bu durumlar sistemce gerçek süreç gibi sunulmaz; simülasyon etiketlidir.
- Metin hizmeti 1 veya 3 farklı dolu taslak ister. Canlı hizmet geçmişte olmayan tercih tarihi/saatini kabul eder; uygunluk teyidi yoktur.
- Bu kayıtlar mevcut JSON dışa aktarmaya ve iki onaylı tüm veriyi sıfırlama işlemine dahildir; önceki öğrenci kayıtlarının migrasyonu gerekmez.

## Gelecekteki gerçek entegrasyonun zorunlu kapıları (henüz yapılmadı)
1. **Yetki ve onay:** Kullanıcı kimlik doğrulaması ve öğretmenin yalnız kendisine atanmış dosyaları görmesini sağlayan sunucu erişim kontrolü. Veri işleme/aydınlatma ve açık gönderim izni.
2. **Güvenli dosya teslimi:** Taslağı kullanıcının açık eylemiyle belirlenmiş öğretmene HTTPS üzerinden güvenli depoya yükleme; dosya türü, boyutu, erişim süresi, audit log ve silme kuralları. Uygulama içi ses Blob'u otomatik yüklenmemeli.
3. **Gerçek takvim:** Öğretmen ve takvim kaynağı ID'leri, saat dilimi, süre, hold / expiry, concurrency ve çifte rezervasyon koruması; ancak sunucu onayından sonra gerçek `confirmed` durumu.
4. **Gerçek ödeme:** Onaylı fiyat kataloğu, yetkili ödeme sağlayıcısı, sunucu tarafında fiyat doğrulama, idempotency, başarısızlık/iade ve makbuz akışı. Yalnız istemci durumuna güvenilmez.
5. **İş akışı:** Sunucu durum makinesi, öğretmen görevlendirme, gönderim/incelenme/teslim kanıtı, değişiklik geçmişi, bildirimler ve öğrenciye erişilebilir teslim dosyası.
6. **Uygulama mağazası politikası:** Google Play'in **yayın tarihinde güncel** ödeme, abonelik, dijital içerik ve birebir gerçek zamanlı ders kuralları incelenecek; kullanım şekline göre hangi ödeme yöntemine izin verildiği hukuki/ürün incelemesiyle teyit edilecek. Bu doküman Play politikası uygunluğu onayı değildir.

## Yapılmayanlar
Öğretmen paneline bağlantı yok; AYDA canlı sitelerine, ödeme hesabına, WhatsApp'a veya takvime yazma yok. Sahte toplantı URL'si / rezervasyon kodu yok. Bütün istekler bu cihazda kalır; tarayıcı verileri silinirse kaybolur. Aşama 8 APK veya Play yayını başlatılmamıştır.
