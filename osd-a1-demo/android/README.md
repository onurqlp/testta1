# AYDA ÖSD A1 — Canlı siteyi açan Android uygulaması

**Önemli:** Uygulama `https://ayda-osd-a1-demo.vercel.app/` adresindeki güncel siteyi WebView içinde açar. Siteye yapılan yayınlar uygulama yeniden derlenmeden kullanıcılara ulaşır. İnternet bağlantısı gerekir.

## Kullanıcı deneyimi
- APK ana sayfasında **ÖSD A1 Sınav Rehberi** kartı, alt menüde **Rehber** sekmesi vardır.
- Rehber 4 bölüm / 11 görevi kapsar. Her görev açıklama, öğretici örnek, yöntem, hatalar ve ipuçları sunar. Rehber ayrı uygulama/site olarak açılmaz, aynı Android WebView içinde kalır.
- Ana A1 demo: Lesen, Hören, Schreiben, Sprechen, entegre deneme, ilerleme ve öğretmen hizmetleri demosu.
- Test soruları, sesler ve rehber içerikleri canlı siteden yüklenir.
- Android geri tuşu rehberden uygulamaya dönebilir. Fiziksel Android cihazda ayrıca test edilmelidir.

## Teknik mimari / veri koruma
- Java + Android SDK. `com.aydadil.osda1.demo`, sürüm **0.9.0-demo**, versionCode **9**, Android SDK 26+.
- WebView canlı **https://ayda-osd-a1-demo.vercel.app/** adresini yükler; istekler APK içindeki eski dosyalarla kesilmez. Mevcut HTTPS origin'i korunur, böylece IndexedDB ve localStorage kayıtları aynı cihazda kalır.
- APK içinde bulunmayan/izin verilen kaynaklar için mevcut HTTPS davranışı; çapraz kaynak gezinmesi sadece haricî tarayıcıda. HTTP ve TLS doğrulama hataları reddedilir.
- Rehberde işaretler demo uygulama kökenindeki `localStorage` içinde; sınav ve kayıtlar `IndexedDB` içinde kalır. Uygulamayı kaldırmak/veriyi temizlemek bunları silebilir. Geri yükleme/senkronizasyon yoktur.
- İzinler: INTERNET ve gerektikçe RECORD_AUDIO. Sesin izinsiz sunucuya gönderimi yok.
- Bu APK WebView bağlantı düzeltmesini bir kez taşır. Bundan sonraki web sitesi yayınları yeni APK gerektirmez.

## Derleme / dağıtım
- GitHub Actions: `.github/workflows/a1-android-apk.yml`
- Node 22 ile `osd-a1-demo` klasöründe test, audio kontrolü ve Vite build yapılır.
- Android SDK 35 / Gradle 8.9 / Java 17 ile `:app:assembleDebug`.
- Çıktı: GitHub Actions içinden indirilebilen `AYDA-OSD-A1-AYDA-UI-v0.10.apk` test APK'sı.

## Sınırlar
- Debug imzalı test APK'sı; Google Play ürünü veya gerçek ticari dağıtım değildir.
- Aynı applicationId ile önceki sürümle imza uyumu Android kuruluma bağlıdır; GitHub debug anahtarı derlemeler arasında değişebilir. İmza değiştiğinde Android eski APK'nın üstüne kurmaya izin vermez. **Eski uygulamayı kaldırarak kayıtları kaybetmeyin.** Kalıcı imza ve veri taşıma stratejisi gerekir.
- Fiziksel Android cihazda mikrofondan kayıt, audio Range, çevrim dışı mod, eski sürüm yükseltmesi, sınav/rehber gezinmesi ve geri tuşu test edilmelidir.
- Resmî ÖSD materyallerinin kullanım lisansı ücretli mağaza dağıtımından önce ayrıca gözden geçirilmelidir.


## AYDA kurumsal kimlik güncellemesi — 0.10.0 (25.10.2026)
- **Kaynak:** `onurqlp/ayda-wordpress-sync/pages/homepage-v98-calendly-direct-booking-full-preview-20261020.html` üzerindeki ana sayfa renkleri: lacivert `#102541`, koyu lacivert `#0c1e35`, altın `#e8c37b`.
- **Logo:** AYDA ana sayfasıyla SHA-256 hash'i birebir aynı olan resmî `ayda-home-v89-baa791945bb954a30b.png`, uygulamada `/branding/ayda-logo.png`; Android launcher'da aynı kaynağın ikili kopyası.
- Uygulama başlığı, ana ekran, beceri kartları, ilerleme bölümü, deneme ve rehber iç sayfası AYDA temasıyla uyumlu.
- Tam web uygulaması ve 11 görevli rehber canlı siteden yüklenir.
- Mevcut öğrenci çalışmaları ve IndexedDB yapısı değiştirilmedi. Debug APK yalnız test içindir.
- `npm run test` AYDA logo hash'ini, kaynak renkleri, rehber bağlarını ve görev kapsamını kontrol eder.
