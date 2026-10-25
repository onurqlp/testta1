# AYDA ÖSD A1 — Aşama 7 kabul raporu

**Kapsam:** Öğretmen hizmetleri + rezervasyon demosu. Tamamen tarayıcıda, ağ API'siz.

## Uygulananlar
- Altı hizmet kartı, süre/teslim şekli ve açık `ÖNERİ FİYAT · DEMO` etiketi.
- Schreiben içindeki mevcut dolu taslağa doğrudan öğretmen kontrolü DEMO bağlantısı; tek ve üç farklı taslak seçimi.
- Sprechen listesinden canlı 30 dk prova demosuna bağlantı.
- Gün/tarih ve 10:00 / 14:00 / 19:00 gibi açıkça **DEMO SLOT** olan örnek saat seçenekleri; geçmiş tarihi reddetme.
- Talep özeti, yalnız cihazdaki `teacherRequests` deposunda yeni kayıt; gerçek ödeme / gerçek randevu bulunmadığı açıklaması.
- Kullanıcıya durum akışını gösteren `DEMO` simülasyon butonu, yerel kayıt silme ve geçmiş. Sahte öğretmen sonucu / puanı yok.

## Değiştirilmeyenler
Mevcut dört beceri, tam sınav, öğrenci çalışma geçmişi, IndexedDB isimleri ve DB_VERSION=2 korunur. Gerçek kişi, takvim veya ödeme servisine bağlanmaz.

## Test kapıları
`npm run test && npm run check:audio && npm run build`
Model testleri: katalog ve öneri fiyat, 1/3 farklı taslak, geçmiş tarih engeli, yerel demo durum geçişi.
Tarayıcıda gerçek mikrofon, veri dışa aktarma ve ekran ergonomisi Aşama 8 son kalite denetiminde ayrıca gözden geçirilecek.

## Gelecek entegrasyonlar
`teacher-integrations.md` bağlantı sözleşmesi ve Google Play güncel politika inceleme gereksinimi. Aşama 8'e otomatik geçilmez.
