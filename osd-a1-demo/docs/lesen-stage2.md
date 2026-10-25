# AŞAMA 2 — LESEN · 25 Ekim 2026

## Kaynak ve telif
ÖSD resmî ZA1 modellsatz broşürü, s.34: https://www.osd.at/wp-content/uploads/2024/09/ZA1-Modellsatzbroschure_WEB.pdf
- Aufgabe 1: 5 durum ↔ 6 ilan; 1 fazla ilan.
- Aufgabe 2: 3 kısa metin, her metne 2 JA/NEIN sorusu.
- Aufgabe 3: 5 metin ↔ 6 resim; 1 fazla resim.
- Süre: 25 dakika. ÖSD resmî puanı birebir taklit edilmez; öğrenim amaçlı **16 sorudan doğru sayısı** raporlanır.

## Özgün içerik
- Set 1: Günlük Hayat / 16 soru / 6 ilan / 3 metin / 6 özgün vektör çizimi.
- Set 2: Şehirde ve Yolda / 16 soru / 6 ilan / 3 metin / 6 özgün vektör çizimi.
- Toplam 32 soru; hiçbir resmî telifli soru, fotoğraf veya logo kopyalanmadı.

## Kayıt ve zaman
- Kaydedilenler: cevap, aktif soru, işaretlenen sorular, başlangıç zamanı, sona erme zamanı, bitmiş deneme.
- Sınav modu: 25 dakika gerçek saat; sekme kapatılıp geri gelindiğinde kalan süre wall-clock ile hesaplanır. Uygulama açıkken süre bitiminde otomatik teslim.
- Çalışma modunda seçim sonrası gerekçe görünür; sınav modunda ancak sonuçta görünür.
- Görevler / yanlışlar / sonuçlar IndexedDB v1 `attempts` deposunda saklanır. Geçmiş denemeler yeni denemeyle silinmez.

## Sınırlar
- Bu aşama yalnızca Lesen. Hören/Sprechen sesi ve Schreiben içerikleri eklenmedi.
- Resmî ÖSD başarı puanı / sertifika notu yok.
- Demo cihazlar arasında senkronize olmaz.
- Dinamik ilerleme sadece gerçek kullanıcı cevabı üzerinden hesaplanır.

## Kısa testler
Vitest: set envanteri ve cevap anahtarı, zaman sınırı, kayıt modeli, doğru/yanlış/boş ayrımı, cevabı güncelleme.
Vercel build: `npm run test && npm run build`.
