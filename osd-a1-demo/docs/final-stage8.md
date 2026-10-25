# AYDA ÖSD A1 · Final Demo Aşama 8
Tarih: 25 Ekim 2026 · Ürün sürümü: 0.8.0-demo

## Kapsam, statü ve izolasyon
- Yalnız A1 ÖSD hazırlık demosu; A2/B1, telc/Goethe ürünleri, mevcut AYDA WordPress siteleri değiştirilmedi.
- GitHub: `onurqlp/testta1`, `demo/osd-a1-stage1-20261025` dalı, `osd-a1-demo/`; test ve APK kodu aynı demo alanında.
- Web: `https://ayda-osd-a1-demo.vercel.app` (üretim/demo ortamı, gerçek öğrenci ödeme/kimlik sistemi değildir).
- Android: `android/` kabuğu; release değil, debug imzalı demo APK üretim iş akışı. Play Store yayını yok.
- Lisans: ÖSD logoları, resmî telifli sınav soruları veya resmî ses içerikleri kopyalanmadı. Demo içerikleri özgün hazırlık materyalidir. Alman sesleri espeak-ng sentezli olup gerçek insan/sınav kayıtları değildir. Harici telifli materyal eklemek için izin gerekecek.

## Çalışan modüller ve kapsam
| Modül | Gerçek işlev | Sınır |
|---|---|---|
| Lesen | 2 set, 32 soru, süreli/süresiz çalışma, geçmiş, yanlışlar | Resmî not iddiası yok |
| Hören | 2 set, 30 soru, 6 MP3, çalışma/sınav oynatma hakları, ilerleme | Sesler özgün sentetik, stüdyo/ÖSD dosyaları değil |
| Schreiben | 5 form + e-posta senaryosu, cihaz içi kurallar, taslak/sürüm | Serbest metnin tümünü güvenilir puanlama yok |
| Sprechen | 2 set, tanışma/resim/rol, Redemittel, yerel mikrofon kayıtları | Otomatik transkripsiyon ve insan öğretmen notu yok |
| Deneme | 4 becerili 2 tam deneme, bölüm zamanları, kayıtlı devam et/rapor | Eğitim simülasyonu, sertifika/geçme kararı yok |
| İlerlemem | Gerçek cihaz geçmişi, 7 gün grafiği, yanlış/boş/öneriler, JSON yedek | Bulut eşleme ve JSON geri yükleme henüz yok |
| Öğretmen desteği | 6 hizmet, öneri fiyat, mektup/tarih seçme, yerel demo kayıt, durum simülasyonu | Ödeme yok, rezervasyon yok, gerçek öğretmen incelemesi yok |
| Android kabuk | HTTPS-only WebView, mikrofon izni, dosya seçici, geri tuşu ve çevrim dışı hata | Fiziksel Android cihaz matrisi zorunlu |

## Test kanıtı
- `npm run test`: 44 birim testi, 8 dosya başarıyla tamamlandı.
- `npm run check:audio`: 6 özgün MP3 dosyasının bulunduğu ve boş olmadığı doğrulandı.
- `npm run build`: TypeScript strict + Vite üretim derlemesi başarılı.
- `npm audit`: 25.10.2026 tarihinde Vitest 5.0.5 yükseltmesiyle 0 bildirilmiş açık (bağımlılık durumu zamana bağlıdır).
- `scripts/e2e-final.mjs`: Chromium 360x800 / 390x844 / 768x1024 / 1440x900, 11 rota, yatay taşma kontrolü; 96/96 tarayıcı kontrolü başarılı.
- Uçtan uca: entegre denemeyi başlat-duraklat-yeniden aç-devam et; demo öğretmen rezervasyon talebini oluştur-yeniden aç; ödeme tuşunun sahte tahsilat yapmaması; offline önbellekten ana sayfayı açma.
- GitHub Actions `a1-final-qa.yml` ekran görüntüleri + JSON rapor artefaktı yükler. Fiziksel cihaz WebView ses/file chooser testi tarayıcı QA kapsamından ayrıdır.
- Service worker HTML ağ-öncelikli; cache v8 ile eski sürüme takılma azaltıldı. Çevrim dışı Range isteklerinde önbellekten cevap desteği eklendi; cihaz bazlı ses oynatımı yine kontrol edilmeli.

## Veri koruma
- IndexedDB isimleri ve sürümü 2 korundu. Öğrenci cevapları, taslak, ilerleme ve sesler için sıfırlama/migrasyon yapılmadı.
- Tüm veriyi JSON olarak dışa aktarma (Blob base64) var, otomatik içe alma/bulut senkronu yok.
- Web tarayıcısı ve Android WebView farklı veri alanlarıdır. Aynı cihaz olsalar da cevaplar kendiliğinden taşınmaz.
- Kaydetme yalnızca cihazda; uygulama silinirse/veri temizlenirse kaybolabilir.

## Üretimden önce kalan zorunlu işler
1. Fiziksel Android 13-15 / Chrome WebView sürümleriyle mikrofon ve ses kaydı, MP3 çevrim dışı, ses dosyası indirme, dosya seçimi, Android geri, tekrar açma ve ekran görünümü.
2. Google Play geliştirici hesabı ve güncel hedef SDK / AAB / release anahtar yönetimi; kullanıcının ayrı açık komutu olmadan mağazaya yükleme yapılmaz.
3. Nihai fiyat ve hizmet sözleşmeleri, ödeme yöntemi kuralları, güvenli dosya aktarma, gerçek öğretmen paneli, takvim durum mutabakatı, kimlik doğrulama.
4. KVKK ve gizlilik bilgilendirmesi, içerik telifi/lisans doğrulaması, destek ve iade şartları. Resmî ÖSD onayı veya içerik lisansı varmış gibi davranılmaz.
5. Geri yükleme, cihazlar arası senkronizasyon, veri taşıma kararı. İçeriğin yetkisiz kopyalanmasına karşı satılacak uygulamada ayrı ürün güvenliği.

## Sonuç
Aşama 8 kapsamındaki web demo kalite kontrolü gerçekleştirilmiştir. Android APK yalnızca GitHub Actions'da başarılı artefakt/doğrulama varsa hazır sayılır; APK'nın gerçek telefondaki işlevi ayrıca doğrulanmadan Play'e hazır denemez. Başka aşamaya otomatik geçiş yoktur.
