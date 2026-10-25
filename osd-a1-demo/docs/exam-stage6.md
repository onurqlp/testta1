# AYDA ÖSD A1 · Aşama 6
25 Ekim 2026

**Kaynak:** https://osd.at/portfolio-item/osd-zertifikat-a1-za1/
ÖSD ZA1 resmî yapısı: yazılı Lesen 25 dk, Hören yaklaşık 10 dk, Schreiben 20 dk. Sözlü 10 dk hazırlık ve yaklaşık 10 dk sınav. Yazılı modül ~55 dakika.

## Tam deneme
- 2 özgün set, mevcut dört bağımsız modülün kaynaklarını kullanır.
- `src/modules/exam/model.ts` test edilen bir sınav oturum durum makinesidir; `ExamView.tsx` gerçek kullanıcı etkileşimidir.
- Kullanıcı bölümü onaylayarak geçer; süre dolarsa otomatik geçiş; geri dönülmez.
- Açık ara ver seçeneğinde zaman donar; sırf sekme yenilemek süreyi sıfırlamaz. Resmî sınavda ara verme serbestliği olduğuna dair iddia yoktur.
- Lesen/Hören gerçek cevap bazlı doğru/yanlış/boş sayısı; Schreiben açıklama ve form verileri; Sprechen cihaz mikrofon kaydı (otomatik puan yok).
- Mikrofon kaydı cihazın kendi IndexedDB'sindeki `recordings` deposundadır. AI, metne dönüştürme ve sunucuya dosya gönderme yoktur.

## Kalıcı veriler
- IndexedDB v1→v2 göçü yalnızca `examSessions` store ekler. Önceki attempts, drafts, sessions ve ses Blob kayıtları korunur.
- Gerçek kişisel geçmiş ve 7 günlük grafik. Kullanılmayan alanlarda sıfır/boş gösterilir; asla örnek başarı gösterilmez.
- JSON dışa aktarma bütün depoları ve ses dosyalarını Base64 olarak içerir. JSON geri yükleme henüz yoktur.
- Atomik reset bütün depoları iki açık onayla temizler; geri döndürülemez.

## Sınırlar
- Resmî ÖSD sonuç/kazanma tahmini değildir. Sprechen ve Schreiben için sahte puan üretilmez.
- Tarayıcı depolaması cihazla sınırlıdır. Ses kaydı ve çevrim dışı kullanım gerçek cihazda ayrıca kontrol edilmelidir.
- Öğretmen/ödeme/randevu entegrasyonu yoktur; Aşama 7'ye geçilmemiştir.
- Vercel kalite kapısı: `npm run test && npm run check:audio && npm run build`.
