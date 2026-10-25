# Demo mimarisi ve sekiz aşamalı uygulama

## Dosya katmanları
- `src/data/modules.ts`: modül ve yol tanımları
- `src/storage/models.ts`: tipli görev, soru, cevap, deneme, düzeltme, ses, yazı, öğretmen isteği modelleri
- `src/storage/db.ts`: IndexedDB v1; meta/attempts/drafts/progress/sessions/recordings/teacherRequests; transaction tamamlanmadan başarı dönmez.
- `src/App.tsx`: hash route, uygulama menüsü, boş durumların dürüst gösterimi, son açılan bölüm bağlantısı
- `src/styles.css`: mobil-first responsive kurallar, masaüstü desteği

## Gezinti
Hash-route, örn. `#/module/lesen` kullanılarak Vercel statik hostingde doğrudan sayfa gezinmesi ve Android WebView geri tuşuyla uyum sağlanır.

## Veri
Kaydetme sadece yerel tarayıcıda. Kimlik doğrulama, uzak sunucuya dosya gönderme, ücret alma, bulut eşleme ve analitik henüz yoktur. İlerideki şema göçleri `DB_VERSION` artırılarak `onupgradeneeded` içinde planlanacak.

## Sonraki aşamalar
2. Lesen özgün görev seti / soru motoru
3. Hören özgün görev + hakları uygun gerçek ses
4. Schreiben ÖSD A1 offline kural motoru
5. Sprechen Redemittel + cihaz mikrofon kaydı
6. Deneme sınavı + ilerleme ve yanlışlar
7. Gerçek öğretmen hizmeti için yalnız demo arayüzler
8. Uçtan uca kalite ve isteğe bağlı Android WebView APK

**Aşama 1'de bu işleri yapılmış gibi işaretleme.** Gerçek içerik, gerçek ödeme, sahte puan ve sahte randevu yok.
