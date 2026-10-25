# AYDA ÖSD A1 — v0.9 entegre rehberli Android demo APK

**Önemli:** A1 web uygulamasının tamamı ve ÖSD A1 Sınav Rehberi, APK içindeki `assets/web/` dosyaları olarak paketlenir. İçerikleri açmak için ayrı tarayıcıya ya da Vercel güncellemesine ihtiyaç yoktur. ÖSD resmî model örnek kâğıdı görselleri ve öğretici resimler de APK içine gömülür; YouTube videosu ve haricî kaynak bağlantıları internet gerektirir.

## Kullanıcı deneyimi
- APK ana sayfasında **ÖSD A1 Sınav Rehberi** kartı, alt menüde **Rehber** sekmesi vardır.
- Rehber 4 bölüm / 11 görevi kapsar. Her görev açıklama, öğretici örnek, yöntem, hatalar ve ipuçları sunar. Rehber ayrı uygulama/site olarak açılmaz, aynı Android WebView içinde kalır.
- Ana A1 demo: Lesen, Hören, Schreiben, Sprechen, entegre deneme, ilerleme ve öğretmen hizmetleri demosu.
- Test soruları, 6 MP3, app JS/CSS, 11 görevli rehberin HTML/JS/CSS dosyaları paket içindedir. ÖSD model kâğıdı görselleri internetten (osd.aydadil.com) görüntülenir.
- Android geri tuşu rehberden uygulamaya dönebilir. Fiziksel Android cihazda ayrıca test edilmelidir.

## Teknik mimari / veri koruma
- Java + Android SDK. `com.aydadil.osda1.demo`, sürüm **0.9.0-demo**, versionCode **9**, Android SDK 26+.
- WebView URL'si, mevcut v0.8'den gelen **https://ayda-osd-a1-demo.vercel.app/** HTTPS origin'inde kalır. `WebViewClient.shouldInterceptRequest` ve `ServiceWorkerClient.shouldInterceptRequest` ilk olarak APK'ya gömülmüş uygulama dosyalarını açar. Bu yöntem local `file://` kökenine geçmeyerek önceki kullanıcı IndexedDB kayıtlarıyla aynı origin'i korur.
- APK içinde bulunmayan/izin verilen kaynaklar için mevcut HTTPS davranışı; çapraz kaynak gezinmesi sadece haricî tarayıcıda. HTTP ve TLS doğrulama hataları reddedilir.
- Rehberde işaretler demo uygulama kökenindeki `localStorage` içinde; sınav ve kayıtlar `IndexedDB` içinde kalır. Uygulamayı kaldırmak/veriyi temizlemek bunları silebilir. Geri yükleme/senkronizasyon yoktur.
- İzinler: INTERNET ve gerektikçe RECORD_AUDIO. Sesin izinsiz sunucuya gönderimi yok.
- Bu sürüm bir **snapshot** APK'dır; web sitesi sonradan güncellense bile APK'daki rehber içeriği mağaza/APK güncellemesi olmadan değişmez. Kullanıcıya mevcut siteyi yükleyen eski v0.8 APK'sıyla karıştırılmamalıdır.
- GitHub CI, AYDA rehber kaynak deposundaki resimleri yalnız derleme anında çeker; kaynak görsellerin güncellenmesi APK'yı otomatik güncellemez.
- Hatalı/eksik paket dosyasında uzak HTTPS kaynağına düşebilir. Üretilen APK içinde temel dosyaların hepsinin olduğu CI'da doğrulanır.

## Derleme / dağıtım
- GitHub Actions: `.github/workflows/a1-android-apk.yml`
- Node 22 ile `osd-a1-demo` klasöründe test, audio kontrolü ve Vite build yapılır.
- Üretim dosyaları `osd-a1-demo/android/app/src/main/assets/web/` yoluna otomatik kopyalanır (kaynak depoya büyük ikili dosyalar commit edilmez).
- Android SDK 35 / Gradle 8.9 / Java 17 ile `:app:assembleDebug`.
- Çıktı: `AYDA-OSD-A1-REHBER-v0.9.apk`, GitHub Actions artefaktı ve `osd-a1-demo-v0.9.0` prerelease.

## Sınırlar
- Debug imzalı test APK'sı; Google Play ürünü veya gerçek ticari dağıtım değildir.
- Aynı applicationId ile önceki sürümle imza uyumu Android kuruluma bağlıdır; GitHub debug anahtarı derlemeler arasında değişebilir. İmza değiştiğinde Android eski APK'nın üstüne kurmaya izin vermez. **Eski uygulamayı kaldırarak kayıtları kaybetmeyin.** Kalıcı imza ve veri taşıma stratejisi gerekir.
- Fiziksel Android cihazda mikrofondan kayıt, audio Range, çevrim dışı mod, eski sürüm yükseltmesi, sınav/rehber gezinmesi ve geri tuşu test edilmelidir.
- Resmî ÖSD materyallerinin kullanım lisansı ücretli mağaza dağıtımından önce ayrıca gözden geçirilmelidir.


## AYDA kurumsal kimlik güncellemesi — 0.10.0 (25.10.2026)
- **Kaynak:** `onurqlp/ayda-wordpress-sync/pages/homepage-v98-calendly-direct-booking-full-preview-20261020.html` üzerindeki ana sayfa renkleri: lacivert `#102541`, koyu lacivert `#0c1e35`, altın `#e8c37b`.
- **Logo:** AYDA ana sayfasıyla SHA-256 hash'i birebir aynı olan resmî `ayda-home-v89-baa791945bb954a30b.png`, uygulamada `/branding/ayda-logo.png`; Android launcher'da aynı kaynağın ikili kopyası.
- Uygulama başlığı, ana ekran, beceri kartları, ilerleme bölümü, deneme ve rehber iç sayfası AYDA temasıyla uyumlu.
- APK içine tam web uygulaması, 11 görevli rehber, örnek kâğıtlar, ses dosyaları ve resmî AYDA logo var. Uzak Vercel sürümü dağıtılmasa dahi yerel APK arayüzü çalışır.
- Mevcut öğrenci çalışmaları ve IndexedDB yapısı değiştirilmedi. Debug APK yalnız test içindir.
- `npm run test` AYDA logo hash'ini, kaynak renkleri, rehber bağlarını ve görev kapsamını kontrol eder.
