# AŞAMA 4 — ÖSD ZA1 Schreiben (25.10.2026)

## Resmî doğrulama
ÖSD 2024 [ZA1 model broşürü](https://www.osd.at/wp-content/uploads/2024/09/ZA1-Modellsatzbroschure_WEB.pdf), s.24: Schreiben 20 dakika; Aufgabe 1 form doldurma (10 alan, resmî 5 puan), Aufgabe 2 kişisel gelen e-postaya üç yönlendirici soruyla yaklaşık 30 kelimelik yanıt (resmî 10 puan). Bu demo puan **üretmez**.
Yalnız AYDA'nın özgün, lisans açısından bağımsız beş senaryosu kullanılmaktadır. Resmî ÖSD sınav metinlerinin hiçbiri kopyalanmamıştır.

## Eski telc A2 motoruyla ilişki
Kaynak: [onurqlp/a2telcmektup](https://github.com/onurqlp/a2telcmektup) `script.js` (okundu, yazılmadı). Yaklaşık 242 düzeltmelik yerel sözlük, Redemittel, kaydetme, hata önceliği ve güven düzeyi fikri yararlıdır. Kod telc A2 koşullarına, uzun mektuplara ve daha iddialı bağlam analizine bağlı olduğu için birebir kopyalanmadı. A1'e özgü küçük, sınırları bilinen saf TypeScript denetleyici yazıldı.

## Modül
- 5 tam tema; her biri 10 alanlı form ve 3 cevap maddeli gelen e-postadan oluşur. Her set için örnek form ve e-posta vardır.
- Çalışma modu süresizdir; 20 dakikalık süreli mod gerçek saatle sınırlıdır.
- Özel Almanca karakter butonları, yaklaşık 30 kelimelik hedef, yazım/fiil çekimi/boşluk/noktalama için yalnız yüksek güvenli düzeltmeler; uygunluk, kapanış ve madde kontrolü öneridir.
- Otomatik kurallar anlamı veya öğrencinin sınav başarısını değerlendiremez. İpuçları semantik eksiklikleri kanıtlamaz.
- Aktif taslaklar `drafts` IndexedDB deposunda, tamamlamalar sahte puansız `attempts` deposunda tutulur. Eski kayıt şemasına müdahale edilmez.
- Beş adede kadar manuel taslak sürümü; kullanıcı seçerek geri alabilir.
- Öğretmen incelemesi yalnız bilgilendirme; ödeme veya gönderim bu aşamada açılmaz.
- Otomatik testlerde form, kurallar, sonradan düzeltme, zaman ve geri yükleme kontrol edilir.

## Sınırlamalar
Dikkate alınan bazı yaygın hatalar, örneğin Almancadaki tüm birleşik fiiller veya serbest anlatım varyasyonları, mevcut basit kurallarla belirlenemez. Yanlış olumlu sonuç ihtimali kalır. İnsan öğretmen yerine geçmez. Cihaz verileri başka cihazla senkronize edilmez.
