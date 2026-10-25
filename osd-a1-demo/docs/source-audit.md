# Kaynak denetimi — 2026-10-25

Bu çalışma yalnız **okuma** amaçlıdır. Aşağıdaki kaynak depolarına hiçbir commit gönderilmedi.

## onurqlp/a2telcmektup
İncelendi: README.md, index.html, script.js (kalıp bankası ve görev modeli), style.css.
- Alınacak fikir: büyük tuşlar, Türkçe yönlendirme, "görevi oku → yaz → kontrol et" akışı.
- Yeniden kullanılabilir kod: kalıp gruplama yaklaşımı, yerel düzeltme veri düzeni, çevrimdışı hata sınıflandırması (Aşama 4'te dönüşüm ve test gerekiyor).
- telc/ÖSD farkı: telc A2'nin 15 dakikalık mektup sınavı ve "4 maddeden 3" yönergesi **ÖSD A1'e taşınamaz**. ÖSD A1'de 20 dakika, form + üç rehber sorulu kişisel e-posta bulunur.

## onurqlp/A1hazirlik
İncelendi: index.html (giriş koruması ve portal arayüzü).
- Alınacak fikir: A1 öğrencisine sade giriş ve konu seçimi.
- Yeniden kullanılabilir kod: renk ve erişilebilir gezinme fikri; kimlik denetimi ve mevcut erişim koruması taşınmamalı.
- Uyarlama: portal telc/Goethe/ÖSD karma; demo sadece ÖSD Zertifikat A1 olmalı.

## onurqlp/sinavhazirlik
İncelendi: index.html (modül kartları ve AYDA renk sistemi).
- Alınacak fikir: dört beceriye hızlı yönlendirme.
- Yeniden kullanılabilir kod: minimum; mobil kart düzeni yeniden yazıldı.
- Uyarlama: çoklu sınav markası içeriği değil, doğrulanmış ÖSD A1 akışı kullanılacak.

## onurqlp/A2telc
İncelendi: README.md, index.html (mobil gezinme ve öğrenci bilgilendirme).
- Alınacak fikir: kısa açıklamalar, buton etiketleri, belirgin bölüm ayrımları.
- Yeniden kullanılabilir kod: başlık/sekme UX örüntüsü.
- telc/ÖSD farkı: telc A2 süreleri, sınav tarihleri, üçüncü taraf bağlantıları kesinlikle kopyalanmamalı.

## onurqlp/osd_a1_ayda
İncelendi: index.html (A1 ana sayfa, renkler ve bölüm yapısı).
- Alınacak fikir: ÖSD A1'e odaklı içerik alanları.
- Yeniden kullanılabilir kod: mevcut canlı siteyi taşımadan sadece bilgi mimarisi fikri.
- Uyarlama: demo öğrenci verisi ve yönetimi mevcut AYDA parolalı ekranlarından tamamen ayrı.

## onurqlp/osda1rehber
İncelendi: index.html (A1/A2 ortak rehber başlangıcı).
- Alınacak fikir: resmî soru sayfası ile açıklama sayfasını ayırma konusundaki UX ihtiyacı.
- Yeniden kullanılabilir kod: şu aşamada yok.
- Uyarlama: hem A1 hem A2 barındıran rehberden A2 öğeleri alınmadı; telifli sınav sayfaları kopyalanmadı.

## onurqlp/osda1denemeler
İncelendi: index.html ve app.js (ekran durumu ve önceki/sonraki soruya geçiş yaklaşımı).
- Alınacak fikir: soru navigasyonu ve oturum kimliğini kararlı tutma.
- Yeniden kullanılabilir kod: sadece akış tasarımı; veri modelini ayrı tipli ve kalıcı depoya geçireceğiz.
- Uyarlama: hazır soru setleri ve varsa hakları belirsiz materyal aynen alınmayacak.

## Karar
Eski siteleri birbirine gömmek yerine React + TypeScript temel uygulaması ve yeniden kullanılabilir veri erişim katmanı yazıldı. Görev içerikleri uygulama kodundan ayrı tutulacak. Yerel gramer motoru ancak ÖSD A1'e uygunluk ve lisans yönünden aşama 4'te entegre edilecek.
