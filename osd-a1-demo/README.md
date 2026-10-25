# AYDA ÖSD A1 Prüfungstraining — DEMO

**Durum:** Aşama 8 / 8 + ÖSD A1 Sınav Rehberi (v0.9) — final demo · 25 Ekim 2026 · Yalnızca eğitim amaçlı demo

## Kaynak ve dağıtım
- Mevcut AYDA canlı uygulamalarından ayrı.
- GitHub test deposunda yalnızca `demo/osd-a1-stage1-20261025` dalının `osd-a1-demo/` klasöründe tutulur; `main` değişmez.
- Mobil-önce React 19 + Vite 6 + TypeScript, sistem fontları ve sıfır yapay zekâ API çağrısı.
- Android test APK derlemesi mevcuttur; Google Play Store yayını henüz yoktur.

## Lokal çalıştırma
```sh
npm install
npm run dev
npm run test
npm run build
npm run preview
```

## Aşama 1 kapsamı
- Mobil ana sayfa, dört modül kartı, çalışmalar, deneme, yanlışlar, ilerleme, öğretmen desteği ve hakkında ekranları
- Mobil dört sekmeli alt menü, masaüstü görünüm, hash tabanlı geçmiş/Android geri tuşuna uyumlu gezinme
- IndexedDB v1; meta, attempts, drafts, progress, sessions, recordings, teacherRequests depoları
- Son açılan bölüm bilgisini aynı cihazda saklayan ve onu açan devam kartı
- Gerçek tamamlanmış deneme yoksa sıfır gösteren istatistikler; içerik eksikliği açık etiketli

## Aşama 2 — LESEN (çalışıyor)
- İki özgün A1 seti, her biri Aufgabe 1 (5 durum/6 ilan), Aufgabe 2 (3 metin/6 JA-NEIN), Aufgabe 3 (5 metin/6 özgün SVG resim)
- Toplam 32 soru; her soruda doğru cevap ve Türkçe açıklama; çalışma ve 25 dakikalık süreli sınav modu
- Soru işaretleme, önceki/sonraki, bölüm atlama, sonuç ve yanlışlarım
- Aktif soru/cevap/süre IndexedDB'de; cihazdan tekrar açılınca sürdürme; sonuç geçmişi korunur
- Doğru/yanlış/boş sayaçları gerçek kullanıcı girdisinden hesaplanır. Resmî ÖSD 30 puanlık değerlendirme taklit edilmez.
- [Aşama 2 test ve içerik raporu](docs/lesen-stage2.md)

## Aşama 3 — HÖREN (çalışıyor)
- İki set / toplam 30 özgün soru / 6 yerel, gerçek oynatılır MP3 dosyası
- 5 ses–6 resim, beş boşluk doldurma, beş kısa röportaj tipi / iki set
- Sentetik çevrimdışı Almanca ses (espeak-ng + FFmpeg). Gerçek insan stüdyosu kaydı ya da resmî ÖSD sesi değildir.
- Çalışma modu sınırsız tekrar ve transkript; sınav modu tekrar hakları 1 / 2 / 1, yaklaşık 10 dakika
- Oynatma hakları, kısmi ses pozisyonu, aktif soru, işaretleme, soru yanıtları ve geçmiş IndexedDB'de
- Hören yanlışları da Yanlışlarım listesinde, Hören sonuçları da İlerlemem kartında gösterilir.
- Sesler service worker önbelleğiyle bağlantısız kullanım için indirilir (tarayıcı depolaması müsaitse).
- [Aşama 3 ses ve test belgesi](docs/hoeren-stage3.md)

## Aşama 4 — SCHREIBEN (çalışıyor)
- 5 özgün senaryo: 10 alanlı form + 3 soruya cevap veren yaklaşık 30 kelimelik kişisel e-posta
- İnternetsiz, saf TypeScript kontrol motoru: form boş/değer eşleştirme; seçilmiş kesin yazım ve çekim hataları; hitap, kapanış, uzunluk ve madde kontrollerinde yalnız uyarı
- Kelime sayacı, Almanca karakter klavyesi, 20 dakikalık süreli pratik, sınırsız süreli çalışma
- IndexedDB'de otomatik taslak, 5'e kadar sürüm saklama/geri yükleme ve tamamlanan işlerin geçmişi
- Sahte metin puanı ve kullanıcı verisi sunucuya gönderimi yok
- Öğretmen incelemesi düğmesi yalnız DEMO bilgi ekranı; satın alma ve gönderim aktif değildir
- [Aşama 4 raporu](docs/schreiben-stage4.md)

## Aşama 5 — SPRECHEN (çalışıyor)
- ÖSD A1'in üç sözlü görevi: 6 konudan 4'üyle kendini tanıtma, 3 özgün SVG görselden birini anlatma, seçilen görselde üç turluk rol oyunu
- 2 özgün prova seti (6 durum çizimi), Türkçe ipuçları ve Almanca A1 Redemittel
- Serbest veya yaklaşık 10 dakikalık süreli prova
- Web MediaRecorder + getUserMedia ile açık kullanıcı izni; tek görev başına en çok 2 dakikalık kayıt
- Ses Blob'ları cihazın IndexedDB `recordings` deposunda saklanır; yeniden oynatma, indirme, değiştirme, silme ve tamamlanan kaydı arşivden açma
- Aynı cihazda görev yeri, 4 konu seçimi, rol oynama aşaması, kişisel kontrol kutuları ve notlar korunur
- Otomatik konuşma değerlendirme, ses çözümleme, haricî API, sunucuya dosya yükleme, ücret ve randevu yoktur
- [Aşama 5 kaynak ve kılavuz](docs/sprechen-stage5.md)

## Aşama 6 — TAM DENEME + İLERLEME
- İki tam özgün dört becerili demo denemesi: Lesen 25, Hören ~10, Schreiben 20, sözlü hazırlık 10 + Sprechen ~10 dakika.
- Bölüm onayları, süre dolması, ara ver/devam et, sıfırlanmayan tarih tabanlı sayaçlar, IndexedDB v2 `examSessions`.
- Gerçek Lesen/Hören yanıt sonuçları, Schreiben yerel açıklamaları ve puansız Sprechen mikrofon kaydı.
- Gerçek geçmiş/yanlışlar, 7 günlük grafik, dört beceri kırılımı, tamamlanmamış taslaklar ve tekrar önerileri.
- Tüm yerel veriyi (ses Blobları dahil) Base64 içerikli JSON yedeğine aktarma; iki onayla veriyi sıfırlama.
- [Aşama 6 teknik dokümantasyonu](docs/exam-stage6.md)

## Aşama 7 — ÖĞRETMEN HİZMETLERİ + REZERVASYON DEMOSU
- 6 ücretli hizmet türü, süre/teslim biçimi ve açıkça **onaylanmamış öneri fiyat** etiketi.
- Schreiben'den mektup taslağıyla demo değerlendirme talebi; 1 veya 3 farklı taslak seçimi, yalnız cihazda saklama.
- Canlı Sprechen ve Schreiben için gerçek müsaitlik olmayan demo tarih/saat seçimi, özet ve yerel talep geçmişi.
- "Ödeme adımı" bilgilendirme gösterir, kart veya gerçek para almaz; görüşme URL'si ve onaylanmış rezervasyon oluşturulmaz.
- "Teslim edildi / inceleniyor / tamamlandı" adımları yalnız açıkça etiketlenmiş simülasyon, gerçek öğretmen işlemi değildir.
- Önceki eğitim ve kayıt depoları korunur; öğretmen talepleri mevcut `teacherRequests` içinde tutulur.
- [Aşama 7 kabul raporu](docs/teachers-stage7.md) · [Gelecekteki entegrasyon sözleşmesi](docs/teacher-integrations.md)

## Aşama 8 — FİNAL DEMO, ÇOKLU EKRAN QA ve ANDROID KABUĞU
- Chromium ile 360x800, 390x844, 768x1024 ve 1440x900 cihaz profillerinde 11 rota, toplam 96 tarayıcı kontrolü.
- A1 sınavını duraklatıp tekrar açma, örnek öğretmen talebini kaydetme, kayıt geçmişi, çevrim dışı uygulama kabuğu doğrulandı.
- Service worker önbellek sürümü 8: HTML gezinmede ağ öncelikli, sesin range isteklerinde çevrim dışı kalan önbelleğe destek.
- Öğretmen örnek tarih/saatleri geçersiz (31 Kasım, 29 Şubat 2026) olduğunda reddedilir.
- Vitest test bağımlılığı güvenlik açıkları giderilerek güncellendi; npm audit 0 raporu.
- `android/` altında demo WebView kabuğu ve Github Actions debug APK üretim hattı, Play Store yayını YOK.
- [Final kalite raporu](docs/final-stage8.md) · [Android kabuğu](android/README.md)

## Önemli demo sınırlamaları
Şu anda dört beceri, bütünleşik demo deneme ve öğretmen hizmeti *gösterim akışı* aktiftir. Gerçek öğretmen değerlendirmesi, takvimden müsaitlik doğrulama, rezervasyon, para tahsilatı ve sunucuya dosya gönderimi aktif değildir. Ana uygulama test edilmeden mevcut AYDA canlı sistemlerine aktarılmaz.

Öğrenci çalışma verisi demo sürümünde sadece tarayıcıdaki IndexedDB alanında tutulur; bulut senkronu yoktur ve tarayıcı verilerinin temizlenmesiyle kaybolabilir.

Bağımsız AYDA hazırlık demosudur; resmî ÖSD ürünü değildir. Telifli ÖSD soruları, sesleri ve logoları eklenmemiştir.

## Belgeler
- [Kaynak kod incelemesi](docs/source-audit.md)
- [Resmî A1 sınav yapısı](docs/osd-a1-format.md)
- [Mimari ve sonraki aşamalar](docs/architecture.md)


## Entegre ÖSD A1 Sınav Rehberi (25.10.2026, v0.9)
- Uygulama ana ekranı, Çalışmalar ve mobil alt menüden **Rehber** bağlantısı bulunur.
- `/rehber/a1/` altında aynı demo alanından açılır: 4 beceri ve **11 görev**, açıklamalı özgün örnekler, resmî model kâğıt sayfası referansları, sınav stratejileri, puanlama, sınav günü kontrolü, yerel kaldığım görev ve kontrol listesi.
- Metin, tasarım ve öğrenci rehberi kod kaynağı `onurqlp/osda1rehber` (`a1/`, 25.10.2026). Kaynak repo, `osd.aydadil.com`, WordPress ve diğer AYDA siteleri **değiştirilmedi**.
- Resmî örnek sınav JPG dosyaları ve özgün çalışma fotoğrafları demo reposuna kopyalanmadı; resimler `osd.aydadil.com` adresinden çağrılır ve internet gerektirir. Rehberin metin, HTML, JS ve CSS dosyaları service worker tarafından önbelleğe alınır.
- Rehberin işaretleme ve devam durumu aynı demo kaynağında ayrı bir localStorage girdisinde kalır; ana sınavın IndexedDB puanlarına veya istatistiklerine katılmaz. Orijinal `osd.aydadil.com` sayfasındaki önceki işaretler bu demoya otomatik taşınmaz.
- Derleme/QA: `npm run test` artık 4 bölüm / 11 görev ve rehber rotalarının smoke kontrolünü mevcut Vitest testleriyle beraber çalıştırır.
- Resmî ÖSD model sınavı görselleri referans amaçlıdır; ticari Google Play dağıtımı öncesinde yeniden kullanım ve lisans koşulları ayrı doğrulanmalıdır.


## AYDA kurumsal kimlik güncellemesi — 0.10.0 (25.10.2026)
- **Kaynak:** `onurqlp/ayda-wordpress-sync/pages/homepage-v98-calendly-direct-booking-full-preview-20261020.html` üzerindeki ana sayfa renkleri: lacivert `#102541`, koyu lacivert `#0c1e35`, altın `#e8c37b`.
- **Logo:** AYDA ana sayfasıyla SHA-256 hash'i birebir aynı olan resmî `ayda-home-v89-baa791945bb954a30b.png`, uygulamada `/branding/ayda-logo.png`; Android launcher'da aynı kaynağın ikili kopyası.
- Uygulama başlığı, ana ekran, beceri kartları, ilerleme bölümü, deneme ve rehber iç sayfası AYDA temasıyla uyumlu.
- APK içine tam web uygulaması, 11 görevli rehber, örnek kâğıtlar, ses dosyaları ve resmî AYDA logo var. Uzak Vercel sürümü dağıtılmasa dahi yerel APK arayüzü çalışır.
- Mevcut öğrenci çalışmaları ve IndexedDB yapısı değiştirilmedi. Debug APK yalnız test içindir.
- `npm run test` AYDA logo hash'ini, kaynak renkleri, rehber bağlarını ve görev kapsamını kontrol eder.


## Site v0.11 — AYDA hizmetleri (APK koduna dokunulmadı)
- React uygulamasında `#/services` rotası ve altta **Hizmetler** sekmesi; öğretmen desteği `#/support` üzerinden korunur.
- Kurumsal logo ve renkler `/branding/ayda-logo.png`, `brand.css`, `services.css`.
- A1–B2 online grup, A1–C1 özel ders, ÖSD/telc/Goethe hazırlık; Almanca–Türkçe yeminli tercüme ve noter onayı süreç desteği; Almanya başvuru/denklik yönlendirmesi.
- WhatsApp bağlantıları ve resmî AYDA sayfalarına yönlendirme. Demo içinde belge yüklemesi, ödeme veya randevu kayıt sistemi eklenmedi.
- Android kabuk ve imza, uygulama kimliği, WebView ayarları, dosyaları **değiştirilmedi**; yeni UI web dağıtımında görünür.
