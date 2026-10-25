# AŞAMA 3 — HÖREN / Özgün sesli demo
Kaynak doğrulama: ÖSD ZA1 Modellsatzbroschüre (2024), s.22, https://www.osd.at/wp-content/uploads/2024/09/ZA1-Modellsatzbroschure_WEB.pdf (25 Ekim 2026).
- Aufgabe 1: 5 kısa ses / 6 resim, her ses bir defa, 5 eşleştirme.
- Aufgabe 2: tek kayıt / iki kez oynatma, beş kısa yazılı bilgi.
- Aufgabe 3: 5 kısa röportaj / bir kez, 5 seçmeli soru.
- ÖSD yaklaşık 10 dakika. Bu demo için 10 dakikalık oturum sınırı uygulanır; resmî birebir ses ve süre üretimi iddiası yok.
İçerik: iki özgün set = 30 soru, altı MP3 parça (her sette 3 ses grubu). Tüm kayıtların metinleri AYDA tarafından özgün yazıldı. Sesler espeak-ng offline Alman sesi ile, ffmpeg kullanılarak MP3'e kodlanır; doğal insan sesi değildir. Türkçe açıklamalar ve çalışma modunda açılabilir transkript vardır.
Ses varlıkları `public/audio/*.mp3` altına yalnızca GitHub Actions'ın yetkili açık kaynak araçlarla üretip commitlediği dosyalardan alınır. Ses dosyaları gerçekten repoda bulunmadan ve oynatılabilirliği doğrulanmadan Vercel'e çıkılmamalıdır.
Oynatma: çalışma modunda sınırsız; sınav modunda Aufgabe 1/3 için birer, Aufgabe 2 için iki hak; kalıcı `plays` sayacı. Oynatmayı kullanıcı başlatır (mobil autoplay kısıtları). Ağ/ses hata durumu gösterilir; yanlışlıkla tüketilen oynatma hakkı olası yükleme hatasında geri verilmeye çalışılır. Tarayıcı yenilenince sınavdaki tüketilmiş ses hakları yenilenmez. Ses kaydının yarıda kesilmesi durumunda, özellikle sınav modunda geri dönüş mümkün olmayabileceği anlatılır.
İşaretlenen sorular, cevaplar, sayfa konumu, puanlar ve geçmiş IndexedDB v1 ile saklanır. Resmî ÖSD başarı notu değil, 15 cevap üzerinden ham doğruluk sunulur. Hören ve Lesen kayıtları aynı ilerleme özetinde sayılır.
Offline: service worker HTTPS üzerinde MP3'leri önbelleğe alır; depolama kısıtları ve sesin henüz indirilememesi halinde offline çalışma garanti edilmez.
