# AYDA ÖSD A1 Prüfungstraining — DEMO

**Durum:** Aşama 2 / 8 · 25 Ekim 2026 · Yalnızca eğitim amaçlı demo

## Kaynak ve dağıtım
- Mevcut AYDA canlı uygulamalarından ayrı.
- GitHub test deposunda yalnızca `demo/osd-a1-stage1-20261025` dalının `osd-a1-demo/` klasöründe tutulur; `main` değişmez.
- Mobil-önce React 19 + Vite 6 + TypeScript, sistem fontları ve sıfır yapay zekâ API çağrısı.
- Android APK henüz yok. İleride Android WebView kabuğu ayrı ele alınacak.

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

## Önemli demo sınırlamaları
Şu anda Hören/Schreiben/Sprechen alıştırmaları, ses dosyaları, gerçek rezervasyon ve ödeme yoktur. Kullanıcıya çalışıyor gibi sunulmaz. Aşama 3–7 arasında ayrı ayrı geliştirilecektir. Ana uygulama test edilmeden mevcut AYDA canlı sistemlerine aktarılmaz.

Öğrenci çalışma verisi demo sürümünde sadece tarayıcıdaki IndexedDB alanında tutulur; bulut senkronu yoktur ve tarayıcı verilerinin temizlenmesiyle kaybolabilir.

Bağımsız AYDA hazırlık demosudur; resmî ÖSD ürünü değildir. Telifli ÖSD soruları, sesleri ve logoları eklenmemiştir.

## Belgeler
- [Kaynak kod incelemesi](docs/source-audit.md)
- [Resmî A1 sınav yapısı](docs/osd-a1-format.md)
- [Mimari ve sonraki aşamalar](docs/architecture.md)
