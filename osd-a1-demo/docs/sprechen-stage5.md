# AYDA ÖSD A1 · Sprechen Aşama 5
25 Ekim 2026

## Resmî sınav kaynağı ve uyarlama
[ÖSD Zertifikat A1](https://osd.at/portfolio-item/osd-zertifikat-a1-za1/): sözlü 10 dakika (yaklaşık) ve 25 resmî puan, üç görev:
1. Altı tema içinden dört tanesini seçerek kendini kısaca anlatma.
2. Bir resim seçerek kişiler, yer ve eylemleri betimleme.
3. Aynı resmin gündelik yaşam durumunda kısa rol oyunu.
ÖSD model soru resimleri ve metinleri kopyalanmadı. Bu uygulamadaki tüm altı SVG çizim, 2 set, örnek konuşmalar ve üç turluk partner soruları AYDA demo için bağımsız oluşturuldu.

## Kapsam
- Set 1: kafe, tren istasyonu, market; Set 2: doktor resepsiyonu, dil okulu, doğum günü.
- 6 kişisel tema, 4 seçim; her tema Almanca basit soru, örnek ve Türkçe rehber.
- Görsel betimlemeye dönük kişiler-yer-eylem kontrolü, Türkçe kolay anlatım ve özgün örnek.
- Görev 3: seçilen görselin durumunda 3 yazılı partner sorusu; gerçek insanla karşılıklı canlı bağlantı değildir.
- Her görevde Redemittel, kişisel notlar ve **yalnız öğrencinin işaretlediği** kontrol maddeleri.
- Serbest prova ve 10 dakikalık yerel sayacı bulunan süreli prova (resmî değerlendirme değil).
- Öğrencinin sesini mikrofon izniyle kaydetme; MediaRecorder MIME biçimi destek kontrolüyle MP4/WebM/Opus/Ogg arasından seçim.
- Görev başına 120 saniye tavan; kayıt bittikten sonra blob IndexedDB v1 `recordings` deposuna yazılır. Sınav tamamlanınca `sessions` ve `attempts` depolarında puansız tamamlanma kaydı tutulur.
- Kayıt URL.createObjectURL ile yerel oynatılır; kullanıcı dosyayı cihazına indirebilir. Geri alma, değiştirme, kullanıcı isterse silme mevcuttur.
- Kullanıcı verisi, ses, transkript **sunucuya gönderilmez**. Model API veya konuşma-tanıma servisi yoktur.

## Önemli teknik sınırlar
- Cihaz mikrofonu HTTPS/localhost ortamında açılır. Kullanıcı izni ve tarayıcı MediaRecorder desteği zorunludur.
- IndexedDB depolama kotası dolabilir; gizli modda veri saklanmayabilir. Tarayıcı verileri silinirse kayıtlar kaybolur.
- Güncel Chrome Android ve Safari biçim desteği farklıdır. Kullanıcıdan mikrofon izni istenirken kayıt başlatmak gerekir.
- Çalışma içeriğini ekrandan okuyup özgün ses kaydı yapmak, sınavı otomatik sesli diyalog hâline getirmez.
- Gerçek cihaz/mikrofon akışı ile izin-ret/yenileme testleri Vercel derleme ve unit testlerin yerini tutmaz; bunlar ayrıca test edilmelidir.
- Tam bütünleşik sınav / öğrenci raporu Aşama 6 kapsamındadır; öğretmen hizmetleri Aşama 7.

## Veri güvenliği
Kaydın kendisi `Blob` olarak yalnız yerel tarayıcıda kalır. Manuel indirme dışında dosya dışa çıkarılmaz. Kayıt saklanamazsa kullanıcıya hata gösterilir, sahte başarı yazılmaz.

## Test
- Soru setlerinin bütünlüğü, konu seçim sınırı, takvim süresi, kayıt anahtarları ve sahte puan olmaması için Vitest.
- Vercel dağıtımında `npm run test && npm run check:audio && npm run build`.
