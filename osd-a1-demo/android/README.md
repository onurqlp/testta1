# AYDA ÖSD A1 DEMO — Android WebView kabuğu

Bu dizin **yalnızca A1 demosu** için hafif bir Android WebView uygulamasıdır. Play Store ürünü veya resmî ÖSD uygulaması değildir. Paket kimliği `com.aydadil.osda1.demo` ve sürüm `0.8.0-demo` bilerek demo olarak ayrıldı.

## Mimari
- Java + Android SDK, dış kütüphane ve geliştiriciye ait API anahtarı yok.
- Sabit, yalnız HTTPS `https://ayda-osd-a1-demo.vercel.app/#/home` kaynağını Android System WebView içinde açar; iframe kullanılmaz.
- WebView yalnız bu alan adındaki HTTPS gezinmesini kabul eder. Harici HTTPS bağlantılarını cihaz tarayıcısında açar. HTTP'yi ve TLS hatası olan bağlantıları WebView'de açmaz.
- Android geri tuşu web geçmişinde dolaşır; geçmiş yoksa ana sayfa/çıkış.
- Bağlantı/TLS hatasında Türkçe anlaşılır hata ve 'Yeniden dene' butonu.
- Yerel `DOM storage / IndexedDB` saklanır; öğretmen isteği ve cevaplar uygulamanın kendi veri alanında kalır. APK sürüm güncellemesi kayıtları silmez; uygulamanın kaldırılması/Android veri temizleme siler.
- İzinler yalnız `INTERNET` ve ihtiyaç halinde `RECORD_AUDIO`. Kamera, konum, depolama veya ağ durumu izni yok. `getUserMedia` sırasında hem Android hem WebView mikrofon izin kontrolü yapılır. Ses kaydı **cihazdan otomatik gönderilmez**.
- HTML dosya seçici `ACTION_GET_CONTENT` üzerinden açılır; seçimi Android'e bırakır. Gerçek sunucu yüklemesi veya ödeme sistemi yoktur.
- Derleme için Google Android SDK API 35 ve Java 17 / Gradle 8.9 gerekir. `compileSdk=35`, `targetSdk=34`, `minSdk=26`.
- Android WebView'in gerçek ses kaydı, FileChooser, çevrim dışı service worker ses davranışı ve geri tuşu **fiziksel Android cihazda** ayrıca test edilmelidir. Chromium web testleri Android testinin yerine geçmez.

## CI ile Demo APK derleme
Workflow: `.github/workflows/a1-android-apk.yml`. Android SDK ve Gradle kurulu GitHub Actions Ubuntu runner'da:
```sh
cd osd-a1-demo/android
gradle --no-daemon :app:assembleDebug
# Çıktı: app/build/outputs/apk/debug/app-debug.apk
```
GitHub Actions `AYDA-OSD-A1-DEMO-v0.8.apk` adlı artefaktı üretir ve mümkünse yalnızca demo amaçlı bir GitHub prerelease'e yükler. APK **debug imzalı** olduğu için ticari/Play Store dağıtımına uygun değildir.

## Gelecekte Play Store öncesi yapılması gerekenler
- Ürün sahibi onaylı nihai uygulama kimliği, Play Console hesabı, ayrı güvenli release imza anahtarı, AAB, sürüm/dağıtım politikası.
- İçerik telifi, resmî kurumla ilişki bulunmadığı açıklaması, ödeme politikası, veri saklama ve gizlilik bildirimi.
- Android 13/14/15 gerçek cihaz matrisi (WebView mikrofon ve dosya seçimi, internet yok/geri tuşu), kayıt temizleme/yedekleme.
- Yetkili öğretmen tarafına erişim/kimlik doğrulama, güvenli upload, takvim uygunluğu ve ödeme entegrasyonu mevcut değildir.
- GitHub'ın debug APK'sı *Play Store'a yüklenmez*.

## Mevcut veri kapsamı
A1 demo tarayıcı verileri `WebView` ile sistem tarayıcısı arasında otomatik taşınmaz; farklı kullanıcı profilleridir. Veri güvenliği için kullanıcılar uygulama içi JSON yedek seçeneğini kullanabilir.
