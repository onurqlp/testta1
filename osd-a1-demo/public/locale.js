/* Shared, lightweight UI translation layer for the web app and the standalone guide. */
(function () {
  const KEY = 'aydaOsdA1Locale';
  const catalog = {
    'İçeriğe geç':['Skip to content','Zum Inhalt springen'],
    'AYDA ana sayfaya dön':['Return to AYDA home','Zur AYDA-Startseite'],
    'SINAV HAZIRLIĞI':['EXAM PREPARATION','PRÜFUNGSVORBEREITUNG'],
    'AYDA kurs ve tercüme hizmetleri':['AYDA courses and translation services','AYDA-Kurse und Übersetzungsdienste'],
    'Hizmetler':['Services','Angebote'], 'Hakkında':['About','Über uns'],
    'Ana Sayfa':['Home','Startseite'], 'Rehber':['Guide','Leitfaden'],
    'AYDA DİL AKADEMİSİ':['AYDA LANGUAGE ACADEMY','AYDA SPRACHAKADEMIE'],
    'Prüfungstraining':['Exam preparation','Prüfungstraining'],
    'ÖSD A1 Prüfungstraining':['ÖSD A1 exam preparation','ÖSD-A1-Prüfungsvorbereitung'],
    'AYDA | ÖSD A1 Prüfungstraining DEMO':['AYDA | ÖSD A1 Exam Preparation DEMO','AYDA | ÖSD-A1-Prüfungsvorbereitung DEMO'],
    'ÖSD SINAV HAZIRLIĞI':['ÖSD EXAM PREPARATION','ÖSD-PRÜFUNGSVORBEREITUNG'],
    'Almancana güven.':['Trust your German.','Vertrau auf dein Deutsch.'],
    'Sınava hazır ol.':['Be ready for the exam.','Mach dich prüfungsbereit.'],
    'A1 sınavına adım adım hazırlanabileceğin kişisel çalışma alanın.':['Your personal space to prepare for the A1 exam, step by step.','Dein persönlicher Lernbereich zur schrittweisen Vorbereitung auf die A1-Prüfung.'],
    'Çalışmaları keşfet':['Explore practice','Übungen entdecken'],
    'SEVİYE':['LEVEL','NIVEAU'], 'ÇALIŞMA PANELİ':['STUDY DASHBOARD','LERNÜBERSICHT'],
    'Bugün ne çalışalım?':['What would you like to study today?','Was möchtest du heute üben?'],
    '4 beceri · Tek hedef':['4 skills · One goal','4 Fertigkeiten · Ein Ziel'],
    'KALDIĞIN YERDEN DEVAM ET':['PICK UP WHERE YOU LEFT OFF','LERNEN FORTSETZEN'],
    'İlk çalışmanı seç':['Choose your first activity','Wähle deine erste Übung'],
    'Son açtığın bölüme geri dönebilirsin.':['You can return to the section you last opened.','Du kannst den zuletzt geöffneten Abschnitt wieder aufnehmen.'],
    'Bir bölüm açtığında burada görünecek.':['It will appear here when you open a section.','Hier erscheint sie, sobald du einen Abschnitt öffnest.'],
    'Yerel ilerleme yükleniyor…':['Loading local progress…','Lokalen Lernstand wird geladen …'],
    'Devam et':['Continue','Weiter'], 'Çalışmalara dön':['Back to practice','Zurück zu den Übungen'],
    'YENİ · ÖSD A1 SINAV REHBERİ':['NEW · ÖSD A1 EXAM GUIDE','NEU · ÖSD-A1-PRÜFUNGSLEITFADEN'],
    'Önce sınavı tanı, sonra soruları çöz.':['Understand the exam first, then practise.','Lerne zuerst die Prüfung kennen, dann übe die Aufgaben.'],
    '4 bölüm, 11 görev · Örnek sınav kâğıdı görselleri · Adım adım stratejiler':['4 sections, 11 tasks · Sample exam pages · Step-by-step strategies','4 Teile, 11 Aufgaben · Ansichten von Prüfungsseiten · Schritt-für-Schritt-Strategien'],
    'Çalışma modülleri':['Practice modules','Übungsmodule'], 'SINAV YOLCULUĞU':['YOUR EXAM JOURNEY','DEIN PRÜFUNGSWEG'],
    'Hedefine giden yol':['Your path to the goal','Dein Weg zum Ziel'],
    'Deneme Sınavı':['Mock exam','Probeprüfung'], 'Tam sınav akışı':['Full exam format','Vollständiger Prüfungsablauf'],
    'Yanlışlarım':['My mistakes','Meine Fehler'], 'Tekrar listesi':['Review list','Wiederholungsliste'],
    'İlerlemem':['My progress','Mein Lernstand'], 'Gerçek kayıtlarım':['My saved results','Meine gespeicherten Ergebnisse'],
    'AYDA İLE DEVAM ET':['CONTINUE WITH AYDA','MIT AYDA WEITERLERNEN'],
    'Sınavdan sonraki adımda da yanındayız.':['We are here for your next step after the exam, too.','Auch nach der Prüfung begleiten wir dich beim nächsten Schritt.'],
    'Canlı Almanca kursları, sınav hazırlığı ve Almanca–Türkçe yeminli tercüme hizmetlerini keşfet.':['Explore live German courses, exam preparation and certified German–Turkish translation.','Entdecke Live-Deutschkurse, Prüfungsvorbereitung und beglaubigte Deutsch-Türkisch-Übersetzungen.'],
    'AYDA hizmetlerini keşfet':['Explore AYDA services','AYDA-Angebote entdecken'],
    'AYDA DESTEĞİ':['AYDA SUPPORT','AYDA-UNTERSTÜTZUNG'],
    'Bir öğretmenle çalışmak ister misin?':['Would you like to work with a teacher?','Möchtest du mit einer Lehrkraft lernen?'],
    'A1 konuşma provası ve yazı değerlendirme hizmetlerini demo ekranda incele.':['Explore the A1 speaking practice and writing feedback options in this demo.','Sieh dir in dieser Demo die A1-Sprechübung und das Schreibfeedback an.'],
    'Destek seçenekleri':['Support options','Unterstützungsangebote'], 'A1 ÇALIŞMA ALANI':['A1 PRACTICE AREA','A1-LERNBEREICH'],
    'Çalışmalar':['Practice','Übungen'],
    'Her beceriyi ayrı ayrı geliştireceğiz. Hazır olduğunda ilgili alana dokun.':['You can practise each skill separately. Choose a section when you are ready.','Du kannst jede Fertigkeit einzeln üben. Wähle einen Bereich, wenn du bereit bist.'],
    'ÖSD A1 SINAV REHBERİ':['ÖSD A1 EXAM GUIDE','ÖSD-A1-PRÜFUNGSLEITFADEN'],
    '11 görevlik sınav rehberi':['Exam guide with 11 tasks','Prüfungsleitfaden mit 11 Aufgaben'],
    'Örnek sınav sayfaları ve öğretmen tavsiyeleri':['Sample exam pages and teacher tips','Beispiel-Prüfungsseiten und Tipps von Lehrkräften'],
    'Tam Deneme Sınavı':['Full mock exam','Vollständige Probeprüfung'], 'Dört becerili deneme aktif':['Four-skill mock exam available','Probeprüfung mit vier Fertigkeiten verfügbar'],
    'AYDA · ÖSD ZERTIFIKAT A1':['AYDA · ÖSD CERTIFICATE A1','AYDA · ÖSD-ZERTIFIKAT A1'],
    'ÖSD A1 Sınav Rehberi':['ÖSD A1 Exam Guide','ÖSD-A1-Prüfungsleitfaden'],
    'Bu bölüm soru çözme testi değil; sınav kâğıdındaki 11 görevi tanıma ve strateji öğrenme alanın. Örnek sınav sayfaları ve adım adım anlatımlar burada.':['This section introduces the 11 tasks in the exam paper and strategies for tackling them. It is a guide, not a question test. Sample pages and step-by-step explanations are included.','Hier lernst du die 11 Aufgaben des Prüfungsbogens und passende Strategien kennen. Dieser Bereich ist ein Leitfaden, kein Aufgabentest. Beispielseiten und Schritt-für-Schritt-Erklärungen sind enthalten.'],
    '4 BÖLÜM · 11 GÖREV':['4 SECTIONS · 11 TASKS','4 TEILE · 11 AUFGABEN'],
    'Sınavda neyle karşılaşacağını öğren.':['Learn what to expect in the exam.','Erfahre, was dich in der Prüfung erwartet.'],
    'ÖSD model sınavından kâğıt görsellerini, soruların nerede olduğunu, cevap yöntemlerini ve sık yapılan hataları incele.':['Explore pages from the ÖSD model exam, where to find the questions, how to answer and common mistakes.','Sieh dir Seiten aus dem ÖSD-Modellsatz, die Position der Fragen, Antwortmethoden und häufige Fehler an.'],
    'Tam rehberi aç':['Open the full guide','Vollständigen Leitfaden öffnen'],
    'OKUMA':['READING','LESEN'], 'DİNLEME':['LISTENING','HÖREN'], 'YAZMA':['WRITING','SCHREIBEN'], 'KONUŞMA':['SPEAKING','SPRECHEN'],
    'Rehberde başka neler var?':['What else is in the guide?','Was findest du noch im Leitfaden?'],
    'Sınav günü kontrolü, yazılı ve sözlü puanlama koşulları, sınav kâğıtlarını büyütme, hazırlık kontrol listesi ve kaldığın göreve dönme.':['An exam-day checklist, written and speaking score requirements, zoomable exam pages, a preparation checklist and a way to resume where you left off.','Eine Checkliste für den Prüfungstag, Bewertungsbedingungen für den schriftlichen und mündlichen Teil, vergrößerbare Prüfungsseiten, eine Vorbereitungs-Checkliste und die Möglichkeit, an der letzten Aufgabe weiterzumachen.'],
    'Bilgi:':['Note:','Hinweis:'],
    'Rehberdeki işaretler bu tarayıcıda ayrıca kaydedilir; deneme puanını değiştirmez. Rehberin temel içeriği ve görselleri APK sürümünde yerel olarak da bulunabilir; web sürümünde ilk açılış için internet gerekir.':['Guide checklist marks are saved separately in this browser and do not affect mock exam scores. The APK may include the guide and images locally; the web version needs an internet connection on first load.','Die Markierungen im Leitfaden werden separat in diesem Browser gespeichert und beeinflussen keine Probeprüfungsergebnisse. Die APK kann Leitfaden und Bilder lokal enthalten; die Webversion benötigt beim ersten Laden eine Internetverbindung.'],
    'AYDA kaynak rehberi ↗':['AYDA resource guide ↗','AYDA-Ressourcen ↗'],
    'TEKRAR ALANI':['REVIEW AREA','WIEDERHOLUNGSBEREICH'],
    'Gerçek çözdüğün sorulardan oluşacak kişisel tekrar listen.':['Your personal review list, based on questions you have answered.','Deine persönliche Wiederholungsliste aus den Aufgaben, die du bearbeitet hast.'],
    'BİLGİ VE YASAL':['INFORMATION & LEGAL','INFORMATIONEN & RECHTLICHES'],
    'Uygulama hakkında':['About this app','Über diese App'], 'Bağımsız hazırlık materyali':['Independent preparation material','Unabhängiges Vorbereitungsmaterial'],
    'Bu uygulama AYDA Dil Akademisinin bağımsız eğitim demosudur. Resmî ÖSD ürünü değildir; ÖSD tarafından onaylandığı iddia edilmez.':['This app is an independent educational demo by AYDA Language Academy. It is not an official ÖSD product and is not claimed to be endorsed by ÖSD.','Diese App ist eine unabhängige Lerndemo der AYDA Dil Akademisi. Sie ist kein offizielles ÖSD-Produkt und wird nicht als vom ÖSD anerkannt dargestellt.'],
    'Kaynaklar ve sınav biçimi':['Sources and exam format','Quellen und Prüfungsformat'],
    'ÖSD resmî bilgilendirme sayfası ↗':['Official ÖSD information ↗','Offizielle ÖSD-Informationen ↗'], 'Gizlilik':['Privacy','Datenschutz'],
    'Bu demo üyelik, ödeme ve öğrenci verisi toplamaz. Yerel çalışma bilgileri yalnızca kullandığın tarayıcının veri alanında saklanır; silersen kaybolabilir.':['This demo does not collect account, payment or student data. Local practice data is stored only in this browser and may be lost if you delete it.','Diese Demo erhebt keine Konto-, Zahlungs- oder Schülerdaten. Lokale Übungsdaten werden nur in diesem Browser gespeichert und können beim Löschen verloren gehen.'],
    'Hazırlık planı':['Preparation plan','Vorbereitungsplan'],
    'Kurslar ve tercüme':['Courses and translation','Kurse und Übersetzungen'],
    'Kurs, tercüme, randevu ve fiyat talepleri AYDA’nın iletişim kanallarından yürütülür. Bu demo uygulamada ödeme alınmaz, belge yüklenmez ve otomatik randevu oluşturulmaz.':['Course, translation, appointment and pricing enquiries are handled through AYDA’s contact channels. This demo does not accept payments, collect documents or create appointments.','Anfragen zu Kursen, Übersetzungen, Terminen und Preisen werden über die AYDA-Kontaktkanäle bearbeitet. Diese Demo nimmt keine Zahlungen entgegen, sammelt keine Dokumente und erstellt keine Termine.'],
    'Almanca yolculuğunda':['On your German-learning journey,','Auf deinem Weg mit Deutsch'], 'yanınızdayız.':['we are here for you.','sind wir an deiner Seite.'],
    'ÖSD A1 sınavına hazırlanırken ihtiyaç duyabileceğiniz eğitim ve evrak hizmetlerini bir arada keşfedin. Soru çözümleriniz ve kişisel ilerlemeniz bu bölümden etkilenmez.':['Explore learning and document services that may help as you prepare for the ÖSD A1 exam. Your answers and personal progress are not affected by this section.','Entdecke Lern- und Dokumentenservices, die dich bei der Vorbereitung auf die ÖSD-A1-Prüfung unterstützen können. Deine Antworten und dein persönlicher Lernstand bleiben davon unberührt.'],
    'DİL EĞİTİMİ · TERCÜME · YOL HARİTASI':['LANGUAGE LEARNING · TRANSLATION · GUIDANCE','SPRACHUNTERRICHT · ÜBERSETZUNG · ORIENTIERUNG'],
    'AYDA hizmetleri':['AYDA services','AYDA-Dienstleistungen'],
    'AYDA eğitim ve tercüme hizmetleri':['AYDA learning and translation services','AYDA-Sprachkurse und Übersetzungsdienste'],
    '01 · ALMANCA EĞİTİMİ':['01 · GERMAN LANGUAGE COURSES','01 · DEUTSCHUNTERRICHT'],
    '02 · EVRAK VE TERCÜME':['02 · DOCUMENTS & TRANSLATION','02 · DOKUMENTE & ÜBERSETZUNG'],
    '03 · SINAV ODAKLI':['03 · EXAM PREPARATION','03 · PRÜFUNGSORIENTIERT'],
    '04 · ALMANYA HEDEFİ':['04 · GERMANY STUDY & WORK','04 · ZIELE IN DEUTSCHLAND'],
    'Schreiben çalışması':['Writing practice','Schreibtraining'],
    'Sprechen provası':['Speaking practice','Sprechübung'],
    'ÖSD A1 ÇALIŞMAYA DEVAM':['CONTINUE WITH ÖSD A1','MIT ÖSD A1 WEITERÜBEN'],
    "Kurs, tercüme, randevu ve fiyat talepleri AYDA'nın iletişim kanallarından yürütülür. Bu demo uygulamada ödeme alınmaz, belge yüklenmez ve otomatik randevu oluşturulmaz.":['Course, translation, appointment and pricing enquiries are handled through AYDA contact channels. This demo does not accept payments, collect documents or create appointments.','Anfragen zu Kursen, Übersetzungen, Terminen und Preisen werden über die AYDA-Kontaktkanäle bearbeitet. Diese Demo nimmt keine Zahlungen entgegen, sammelt keine Dokumente und erstellt keine Termine.'],
    'Hedefiniz ne olursa olsun,':['Whatever your goal,','Was auch immer dein Ziel ist,'], 'bir sonraki adımınız belli olsun.':['make your next step clear.','soll dein nächster Schritt klar sein.'],
    'Sınav hazırlığı, online kurs veya Almanca evrak işlemleri için AYDA ekibinden bilgi alabilirsiniz.':['Contact the AYDA team for information about exam preparation, online courses or German document services.','Das AYDA-Team informiert dich zu Prüfungsvorbereitung, Onlinekursen und deutschen Dokumenten.'],
    'WhatsApp’tan bilgi al':['Ask on WhatsApp','Über WhatsApp anfragen'], 'Kursları incele':['Explore courses','Kurse ansehen'],
    'AYDA web sitesine git':['Visit AYDA website','AYDA-Website öffnen'], 'Hazırlık kaynakları':['Preparation resources','Vorbereitungsmaterialien'], 'AYDA’yı incele':['Explore AYDA','AYDA entdecken'],
    'Öğretmen desteği':['Teacher support','Unterstützung durch Lehrkräfte'],
    'Bu uygulamadaki desteğiniz de burada.':['Support for this app is here, too.','Auch die Unterstützung zu dieser App findest du hier.'],
    'Öğretmenle konuşma provası ve yazma çalışması seçeneklerini ayrı bölümde inceleyebilirsiniz.':['Explore speaking practice and writing support with a teacher in a separate section.','Entdecke Sprechübungen und Schreibtraining mit einer Lehrkraft in einem eigenen Bereich.'],
    'AYDA Dil Akademisi':['AYDA Language Academy','AYDA Sprachakademie'],
    'Online Almanca Kursları':['Online German courses','Online-Deutschkurse'],
    'Almanca–Türkçe Tercüme':['German–Turkish translation','Deutsch-Türkisch-Übersetzung'],
    'Sınav Hazırlığı ve Özel Ders':['Exam preparation and private lessons','Prüfungsvorbereitung und Einzelunterricht'],
    'Başvuru ve Denklik Yönlendirmesi':['Application and recognition guidance','Orientierung zu Bewerbungen und Anerkennung'],
    'A1–B2 canlı grup':['Live A1–B2 group classes','Live-Gruppenkurse A1–B2'], 'A1–C1 özel ders':['A1–C1 private lessons','Einzelunterricht A1–C1'],
    'Speaking ve etüt':['Speaking practice and study sessions','Sprechtraining und Lernzeiten'],
    'Diploma ve transkript':['Diplomas and transcripts','Diplome und Notenübersichten'], 'Başvuru belgeleri':['Application documents','Bewerbungsunterlagen'],
    'Noter onayı süreç desteği':['Guidance on notarisation','Unterstützung bei der notariellen Beglaubigung'],
    'Eğitim ve çalışma hedefi':['Study and work goals','Studien- und Arbeitsziele'], 'Dil seviyesi planı':['Language-level planning','Planung des Sprachniveaus'],
    'Belge yönlendirmesi':['Document guidance','Orientierung zu Unterlagen'],
    'Öğretmen eşliğinde canlı ders, konuşma pratiği, ders kayıtları ve tekrarlarla seviyenize uygun ilerleyin. Grup ve birebir ders planı için güncel programı sorun.':['Progress at your level with live teacher-led lessons, speaking practice, lesson recordings and review. Ask for the current schedule for group or private lessons.','Lerne passend zu deinem Niveau mit Live-Unterricht, Sprechübungen, Aufzeichnungen und Wiederholungen. Frage nach dem aktuellen Plan für Gruppen- oder Einzelunterricht.'],
    'Almanya başvurularında kullanılan diploma, transkript ve benzeri evraklar için yeminli tercüme ve noter onayı sürecinde yönlendirme. Belge türüne göre kapsam ve ücret teyit edilir.':['Guidance on certified translation and notarisation for diplomas, transcripts and similar documents used in applications to Germany. Scope and fees are confirmed for each document type.','Orientierung zu beglaubigten Übersetzungen und notarieller Beglaubigung von Diplomen, Notenübersichten und ähnlichen Unterlagen für Bewerbungen in Deutschland. Umfang und Kosten werden je Dokumentart bestätigt.'],
    'Dijital çalışmanın yanında öğretmen geri bildirimi isteyenler için sınava odaklı ders seçenekleri. Hazırlık eğitimi, resmî sınav kaydı veya sertifika garantisi anlamına gelmez.':['Exam-focused lessons for learners who want teacher feedback alongside digital practice. Preparation does not include official exam registration or guarantee a certificate.','Prüfungsorientierter Unterricht für Lernende, die zusätzlich zum digitalen Üben Feedback von Lehrkräften möchten. Die Vorbereitung umfasst keine offizielle Prüfungsanmeldung und garantiert kein Zertifikat.'],
    'Almanya’daki üniversite veya iş hedefiniz için dil seviyesini ve belge hazırlık adımlarını planlama desteği. Resmî denklik kararı ilgili yetkili kurumlara aittir.':['Guidance on planning language levels and document preparation for study or work goals in Germany. Official recognition decisions are made by the relevant authorities.','Orientierung zur Planung des Sprachniveaus und der Unterlagen für Studium oder Arbeit in Deutschland. Über die offizielle Anerkennung entscheiden die zuständigen Stellen.'],
    'Bu tarayıcıda yerel kayıt açılamıyor. Gezinebilirsin ancak ilerleme kaydedilemeyebilir.':['Local storage is unavailable in this browser. You can continue browsing, but your progress may not be saved.','Der lokale Speicher ist in diesem Browser nicht verfügbar. Du kannst weiter navigieren, aber dein Lernstand wird möglicherweise nicht gespeichert.'],
    'Yerel kayıt devre dışı. Tarayıcı izinlerini kontrol et.':['Local storage is disabled. Check your browser permissions.','Lokale Speicherung ist deaktiviert. Prüfe die Browserberechtigungen.'],
    'Kayıtlar yükleniyor…':['Loading saved work…','Gespeicherte Übungen werden geladen …'], 'Önceki sonuçların':['Your previous results','Deine bisherigen Ergebnisse'],
    'Gerçek dinleme nasıl çalışır?':['How does the listening section work?','Wie läuft der Hörteil ab?'],
    'Çalışma modu':['Practice mode','Übungsmodus'], 'Sınav':['Exam','Prüfung'], 'Çalışma':['Practice','Übung'],
    'Çalışma kayıtları yükleniyor…':['Loading saved practice…','Gespeicherte Übungen werden geladen …'], 'Setlere dön':['Back to sets','Zurück zur Auswahl'],
    'Kayıt hatası':['Save error','Speicherfehler'], 'Kaydediliyor…':['Saving…','Wird gespeichert …'], 'Cihazda kayıtlı':['Saved on this device','Auf diesem Gerät gespeichert'],
    'İşaretlendi':['Flagged','Markiert'], 'İşaretle':['Flag','Markieren'], 'Cevabın':['Your answer','Deine Antwort'],
    'Bir cevap seç':['Choose an answer','Wähle eine Antwort'], 'Doğru cevap':['Correct answer','Richtige Antwort'],
    'Tekrar dinleyip kontrol et':['Listen again and check','Höre noch einmal und prüfe'], 'Önceki':['Previous','Zurück'], 'Sonraki':['Next','Weiter'],
    'Bitir ve sonucu gör':['Finish and view results','Beenden und Ergebnis ansehen'], 'Sorular':['Questions','Fragen'],
    'Çalışmayı tamamla ve kaydet':['Finish and save','Übung abschließen und speichern'], 'Yeni çalışma seç':['Choose another activity','Neue Übung wählen'],
    'Boş':['Unanswered','Offen'], 'Yanlış':['Incorrect','Falsch'], 'Doğru':['Correct','Richtig'], 'İncele':['Review','Ansehen'],
    'Örnek cevabı gizle':['Hide sample answer','Musterantwort ausblenden'], 'Örnek cevabı göster':['Show sample answer','Musterantwort anzeigen'],
    'Geri yükle':['Restore','Wiederherstellen'], 'Önceki sürümü seç':['Choose a previous version','Vorherige Version wählen'],
    'Örnek Form + E-Posta':['Sample form + email','Beispielformular + E-Mail'],
    'Bu bir örnek yanıt; aynı anlama gelen farklı A1 cümleleri de doğru olabilir.':['This is a sample answer; other A1 sentences with the same meaning may also be correct.','Dies ist eine Beispielantwort. Andere A1-Sätze mit gleicher Bedeutung können ebenfalls richtig sein.'],
    'Yazım çalışması':['Writing practice','Schreibübung'], 'Sözlü prova':['Speaking practice','Sprechübung'],
    'Dinleme görevleri':['Listening tasks','Höraufgaben'], 'Lesen görevleri':['Reading tasks','Leseaufgaben'],
    'Resim seçimi':['Choose an image','Bild auswählen'], 'Doğru görseli seç':['Choose the correct image','Wähle das passende Bild'],
    'Almanca duyduğun bilgiyi yaz':['Type the information you hear in German','Schreibe die gehörte Information auf Deutsch'],
    'Rakam ya da Almanca kelime yazabilirsin. Desteklenen varyantlar kontrol edilir.':['You can enter a number or a German word. Accepted variants are checked.','Du kannst eine Zahl oder ein deutsches Wort eingeben. Zulässige Varianten werden geprüft.'],
    'Sınav modunda açıklama ve transkript yalnızca tamamlandıktan sonra görünür.':['In exam mode, explanations and transcripts are shown only after you finish.','Im Prüfungsmodus werden Erklärungen und Transkripte erst nach dem Abschluss angezeigt.'],
    'Özgün Almanca transkripti aç':['Open the original German transcript','Originales deutsches Transkript öffnen'],
    'Senin cevabın:':['Your answer:','Deine Antwort:'], 'Doğru:':['Correct:','Richtig:'], 'Kaldığın yerden:':['Continue where you left off:','Hier weitermachen:'],
    '25 dk sınav modu':['25-minute exam mode','Prüfungsmodus · 25 Min.'], '~10 dk sınav modu':['~10-minute exam mode','Prüfungsmodus · ca. 10 Min.'],
    'Kayıtlar açılamadı. Tarayıcı depolamasını kontrol edin.':['Could not open saved work. Check browser storage.','Gespeicherte Übungen konnten nicht geöffnet werden. Prüfe den Browserspeicher.'],
    'Kayıt başarısız. Bu ekrandan çıkmadan depolama iznini kontrol et.':['Could not save. Check storage permissions before leaving this screen.','Speichern fehlgeschlagen. Prüfe die Speicherberechtigung, bevor du diese Seite verlässt.'],
    'Sonuç kaydedilemedi. Çalışmanız korunuyor; lütfen tekrar deneyin.':['Could not save the result. Your work is preserved; please try again.','Das Ergebnis konnte nicht gespeichert werden. Deine Arbeit ist gesichert; bitte versuche es erneut.'],
    'Ses dosyası yüklenemedi. Bağlantıyı kontrol edip yeniden dene. Oynatma kaydın silinmedi.':['Audio could not be loaded. Check your connection and try again. Your playback record has not been deleted.','Die Audiodatei konnte nicht geladen werden. Prüfe die Verbindung und versuche es erneut. Dein Wiedergabeverlauf wurde nicht gelöscht.'],
    'Tarayıcın ses oynatmayı desteklemiyor.':['Your browser does not support audio playback.','Dein Browser unterstützt keine Audiowiedergabe.'],
    'Sınav modu':['Exam mode','Prüfungsmodus'], 'Çalışma modu':['Practice mode','Übungsmodus'],
    'Dil seçimi':['Language','Sprache'], 'Türkçe':['Türkçe','Türkçe'], 'Deutsch':['Deutsch','Deutsch'], 'English':['English','English']
    ,
    'A1–B2 online grup kursu veya A1–C1 özel ders seçenekleri':['A1–B2 online group courses or A1–C1 private lessons','Online-Gruppenkurse A1–B2 oder Einzelunterricht A1–C1'],
    'Almanca–Türkçe yeminli tercüme ve gerektiğinde noter onayı hizmeti':['Certified German–Turkish translation and notarisation where required','Beglaubigte Deutsch-Türkisch-Übersetzung und bei Bedarf notarielle Beglaubigung'],
    'ÖSD A1 sınavı için öğretmenli sözlü prova, yazma değerlendirmesi ve sınav hazırlık dersi':['Teacher-led ÖSD A1 speaking practice, writing feedback and exam preparation lessons','Angeleitete ÖSD-A1-Sprechübungen, Schreibfeedback und Prüfungsvorbereitung'],
    'Almanya eğitim veya çalışma hedefim için dil seviyesi, başvuru belgeleri ve denklik yönlendirmesi':['Language level, application documents and recognition guidance for study or work in Germany','Sprachniveau, Bewerbungsunterlagen und Orientierung zur Anerkennung für Studium oder Arbeit in Deutschland'],
    'Okuma':['Reading','Lesen'], 'Dinleme':['Listening','Hören'], 'Yazma':['Writing','Schreiben'], 'Konuşma':['Speaking','Sprechen'],
    'ÖSD A1 öğretmen desteği':['ÖSD A1 teacher support','ÖSD-A1-Unterstützung durch Lehrkräfte'],
    'ÖSD A1 ÇALIŞMAYA DEVAM':['KEEP PRACTISING ÖSD A1','ÖSD A1 WEITER ÜBEN'],
    'A1 konuşma provası ve yazı değerlendirme hizmetlerini demo ekranda incele.':['Explore the A1 speaking practice and writing feedback options in this demo.','Sieh dir in dieser Demo die A1-Sprechübung und das Schreibfeedback an.'],
    'Sonuç kaydedilemedi; yeniden dene. Cevapların henüz silinmedi.':['Could not save the result; try again. Your answers have not been deleted.','Das Ergebnis konnte nicht gespeichert werden. Versuche es erneut. Deine Antworten wurden nicht gelöscht.'],
    'Cihaz kayıtlarına erişilemiyor. Depolama ayarlarını kontrol et.':['Cannot access device storage. Check your storage settings.','Zugriff auf den Gerätespeicher nicht möglich. Prüfe die Speichereinstellungen.'],
    'Yeni çalışmayı kaydedemedik. Tarayıcıda depolama alanı gerekir.':['Could not save the new activity. Browser storage is required.','Die neue Übung konnte nicht gespeichert werden. Der Browserspeicher ist erforderlich.'],
    'Çalışma açılamadı: Tarayıcı yerel kayıt alanına erişemiyor.':['Could not open the activity: browser storage is unavailable.','Die Übung konnte nicht geöffnet werden: Der lokale Browserspeicher ist nicht verfügbar.'],
    'Sonuç kaydedilemedi. Çalışmanız korunuyor; lütfen tekrar deneyin.':['Could not save the result. Your work is preserved; please try again.','Das Ergebnis konnte nicht gespeichert werden. Deine Arbeit ist gesichert; bitte versuche es erneut.'],
    'Kaydedilmiş çalışmalar yükleniyor…':['Loading saved activities…','Gespeicherte Übungen werden geladen …'],
    'Son tamamladığın çalışmalar':['Your recently completed activities','Deine zuletzt abgeschlossenen Übungen'],
    'Nasıl puanlanıyor?':['How is it scored?','Wie wird bewertet?'],
    'Doğruların 16 soru üzerinden hesaplanır. Resmî ÖSD notu, 30 puanlık sınav değerlendirmesi veya geçme kararı değildir.':['Your correct answers are counted out of 16 questions. This is not an official ÖSD score, a 30-point exam assessment or a pass decision.','Deine richtigen Antworten werden von 16 Aufgaben gezählt. Das ist keine offizielle ÖSD-Bewertung, keine 30-Punkte-Prüfungsbewertung und keine Bestehensentscheidung.'],
    'Dinle. Anla. Cevapla.':['Listen. Understand. Answer.','Hören. Verstehen. Antworten.'],
    'İki özgün A1 dinleme seti ve altı gerçek ses dosyası. Sesler çevrimdışı üretilmiş sentetik Almanca konuşmalardır; resmî ÖSD kayıtları değildir.':['Two original A1 listening sets and six audio files. The audio contains synthetic German speech generated offline; it is not official ÖSD audio.','Zwei eigene A1-Hörsets und sechs Audiodateien. Die Audios enthalten offline erzeugte synthetische deutsche Sprache und sind keine offiziellen ÖSD-Aufnahmen.'],
    '5 görsel eşleştirme':['5 picture-matching questions','5 Bildzuordnungen'], '5 kısa not':['5 short notes','5 kurze Notizen'], '5 röportaj':['5 interviews','5 Interviews'],
    'Gerçek ÖSD sınav biçimini çalış':['Practise the ÖSD exam format','Übe das ÖSD-Prüfungsformat'],
    'Sınavda Aufgabe 1 ve 3 birer kez, Aufgabe 2 en fazla iki kez dinlenir. Başlamadan önce soruları incele. Mobil tarayıcıda sesi açmak için dokunmalısın. Resmî ÖSD puanı yerine gerçek doğru sayısı gösterilir.':['In the exam, Aufgaben 1 and 3 are played once and Aufgabe 2 up to twice. Read the questions first. On mobile, tap to start audio. This shows the number of correct answers, not an official ÖSD score.','In der Prüfung werden Aufgabe 1 und 3 einmal, Aufgabe 2 höchstens zweimal abgespielt. Lies zuerst die Fragen. Auf dem Smartphone musst du die Wiedergabe antippen. Angezeigt wird die Zahl richtiger Antworten, keine offizielle ÖSD-Bewertung.'],
    'Ses başlatılamadı. İnternet bağlantısını, tarayıcı ses iznini ve dosya yüklenmesini kontrol et.':['Audio could not start. Check your internet connection, browser audio permission and file loading.','Die Wiedergabe konnte nicht gestartet werden. Prüfe Internetverbindung, Audioberechtigung und Dateiladen.'],
    'Ses çalardaki başlat/duraklat ve zaman çizelgesini kullanarak istediğin kadar dinleyebilirsin.':['In practice mode, use the audio player and timeline to listen as often as you like.','Im Übungsmodus kannst du mit Audioplayer und Zeitleiste beliebig oft hören.'],
    'Tarayıcı arka plana geçerse ses duraklatılır. Aynı oynatmayı sürdürebilirsin; yenileme sonrası kalan dinleme hakkın korunur. Yeni oynatma için sınav hakkı aşılmaz.':['Audio pauses when the browser moves to the background. You can resume the same playback, and your remaining allowance is preserved after refresh. Starting a new playback will not exceed the exam limit.','Wechselt der Browser in den Hintergrund, wird die Wiedergabe pausiert. Du kannst sie fortsetzen; nach dem Neuladen bleibt dein Restkontingent erhalten. Die Prüfungsgrenze wird bei einer neuen Wiedergabe nicht überschritten.'],
    'Yazılı modül için en az 38/75 gerekir.':['At least 38/75 points are required for the written module.','Für das schriftliche Modul sind mindestens 38/75 Punkte erforderlich.'],
    'Sözlü modül ayrı değerlendirilir; en az 12/25 gerekir.':['The speaking module is assessed separately; at least 12/25 points are required.','Das mündliche Modul wird separat bewertet; erforderlich sind mindestens 12/25 Punkte.'],
    'Kapat ×':['Close ×','Schließen ×'], 'Başa dön ↑':['Back to top ↑','Nach oben ↑'],
    'Biraz daha tekrar etmek ister misin?':['Would you like to review some more?','Möchtest du noch etwas wiederholen?'],
    'Sınav hazırlığı':['Exam preparation','Prüfungsvorbereitung'], 'Dijital kütüphane ↗':['Digital library ↗','Digitale Bibliothek ↗'],
    'A1 tekrar':['A1 review','A1-Wiederholung'], 'A2 tekrar':['A2 review','A2-Wiederholung'], 'B1 tekrar':['B1 review','B1-Wiederholung'],
    'Kaldığım göreve dön':['Resume my task','Zur letzten Aufgabe'], 'Tekrar oku':['Review again','Noch einmal ansehen'],
    'İlgili konuyu tekrar oku:':['Review the related topic:','Thema erneut ansehen:'],
    'Başka neye bakmak istersin?':['What would you like to explore?','Was möchtest du dir noch ansehen?'],
    'İlk kez giriyorum →':['This is my first time →','Ich bin zum ersten Mal hier →'],
    'Sözlü sınav videosu →':['Speaking exam video →','Video zur mündlichen Prüfung →'],
    'Sınav günü →':['Exam day →','Prüfungstag →'], 'Puanlama →':['Scoring →','Bewertung →'], 'Hazır mıyım? →':['Am I ready? →','Bin ich bereit? →'], 'Kaynaklar →':['Resources →','Quellen →'],
    'Açıklamalı öğretici örnek · sınav sorusu değildir':['Worked learning example · not an exam question','Erklärtes Lernbeispiel · keine Prüfungsaufgabe'],
    'Bu bölümde ne yapacağım?':['What will I do in this section?','Was mache ich in diesem Teil?'],
    'Karşıma nasıl bir soru gelecek?':['What kind of question will I see?','Welche Aufgabe erwartet mich?'],
    'Adım adım nasıl yapacağım?':['How do I do it step by step?','Wie gehe ich Schritt für Schritt vor?'],
    'Doğru düşünme yöntemi':['A useful way to think it through','Die richtige Denkweise'],
    'Öğrencinin zihninden geçen düşünce':['What the learner might be thinking','Gedanken der lernenden Person'],
    'Öğretmenin tavsiyesi':['Teacher tip','Tipp der Lehrkraft'], 'En sık yapılan hatalar':['Common mistakes','Häufige Fehler'],
    'Aklında sadece bunu tut':['Remember this one thing','Das Wichtigste zum Merken'],
    'Bir bölüm seç. Her seferinde yalnızca bir görevi öğren.':['Choose a section. Learn one task at a time.','Wähle einen Teil. Lerne immer nur eine Aufgabe auf einmal.'],
    'Önce durumları, sonra altı gerçek ilanı gör.':['First review the situations, then the six original advertisements.','Sieh dir zuerst die Situationen und dann die sechs Originalanzeigen an.'],
    'JA/NEIN sorularının gerçek kâğıtta nasıl düzenlendiğini gör.':['See how the JA/NEIN questions are arranged on the actual paper.','Sieh dir an, wie die JA/NEIN-Fragen auf dem Originalbogen angeordnet sind.'],
    'Metinlerin ve resimlerin ayrı sayfalarda yer aldığını gör.':['See how the texts and pictures appear on separate pages.','Sieh dir an, wie Texte und Bilder auf getrennten Seiten stehen.'],
    'Görevi öğren →':['Learn the task →','Aufgabe kennenlernen →'], 'Önceki görev':['Previous task','Vorherige Aufgabe'], 'Görev listesi':['Task list','Aufgabenübersicht'],
    'Sonraki görev':['Next task','Nächste Aufgabe'], 'Bölüm bitti · Devam et':['Section complete · Continue','Teil abgeschlossen · Weiter'],
    'Görev açıklamalarını göstermek için tarayıcında JavaScript’i etkinleştir. İnternet gerekmez; content.js ve app.js dosyaları index.html ile aynı klasörde olmalıdır.':['Enable JavaScript in your browser to show task explanations. No internet is needed; content.js and app.js must be in the same folder as index.html.','Aktiviere JavaScript im Browser, um die Aufgabenerklärungen anzuzeigen. Internet ist nicht nötig; content.js und app.js müssen im selben Ordner wie index.html liegen.'],
    'Merhaba AYDA Dil Akademisi, ÖSD A1 çalışma platformunuzdan ulaşıyorum.':['Hello AYDA Language Academy, I am contacting you from your ÖSD A1 practice platform.','Hallo AYDA Dil Akademie, ich schreibe über Ihre ÖSD-A1-Lernplattform.']
    ,
    'Kısa metinler ve sorular':['Short texts and questions','Kurze Texte und Fragen'],
    'Dinle, anla, cevapla':['Listen, understand, answer','Hören, verstehen, antworten'],
    'Form ve kısa e-posta':['Form and short email','Formular und kurze E-Mail'],
    'Redemittel ve prova':['Useful phrases and practice','Redemittel und Übung'],
    'ÖSD A1 düzeninde iki özgün set, çalışma ve süreli sınav seçenekleri, açıklamalar ve yanlış takibi.':['Two original sets in the ÖSD A1 format, practice and timed exam modes, explanations and mistake review.','Zwei eigene Sets im ÖSD-A1-Format, Übungs- und Prüfungsmodus mit Zeitlimit, Erklärungen und Fehlerübersicht.'],
    'İki ÖSD A1 dinleme seti, gerçek Almanca MP3 sesler, transkript, dinleme hakları ve kalıcı kayıt.':['Two ÖSD A1 listening sets, German MP3 audio, transcripts, playback limits and saved progress.','Zwei ÖSD-A1-Hörsets, deutsche MP3-Audios, Transkripte, Wiedergabelimits und gespeicherter Lernstand.'],
    'Beş özgün form ve kişisel e-posta seti, cihaz üstünde kural kontrolü, sürüm geri yükleme ve kalıcı taslak.':['Five original form and personal email sets, on-device rule checks, version restore and saved drafts.','Fünf eigene Formular- und E-Mail-Sets, Regelprüfung auf dem Gerät, Versionswiederherstellung und gespeicherte Entwürfe.'],
    'İki özgün ÖSD A1 sözlü prova seti, altı durum çizimi, Redemittel, cihazda saklanan mikrofon kayıtları.':['Two original ÖSD A1 speaking practice sets, six scenario illustrations, useful phrases and microphone recordings saved on your device.','Zwei eigene ÖSD-A1-Sprechübungssets, sechs Situationsbilder, Redemittel und lokal gespeicherte Mikrofonaufnahmen.'],
    '32 soru · Kullanıma açık':['32 questions · Available','32 Fragen · Verfügbar'],
    '30 soru · Gerçek ses':['30 questions · Audio included','30 Fragen · Mit Audio'],
    '5 yazma seti · Yerel kontrol':['5 writing sets · On-device checks','5 Schreibsets · Lokale Prüfung'],
    '2 sözlü prova · Ses kaydı':['2 speaking practices · Audio recording','2 Sprechübungen · Audioaufnahme'],
    '30 özgün soru · 6 MP3 ses dosyası':['30 original questions · 6 MP3 audio files','30 eigene Fragen · 6 MP3-Audiodateien'],
    '5 form + e-posta · İnternetsiz kontrol':['5 forms + email · Offline checks','5 Formulare + E-Mail · Offline-Prüfung'],
    '2 prova seti · 6 özgün resim · Ses kaydı':['2 practice sets · 6 original images · Audio recording','2 Übungssets · 6 eigene Bilder · Audioaufnahme'],
    'Özgün A1 okuma çalışmaları':['Original A1 reading practice','Eigene A1-Leseübungen'],
    'İki set. Üç görev. Gerçek pratik.':['Two sets. Three tasks. Real practice.','Zwei Sets. Drei Aufgaben. Echte Übung.'],
    'Her sette ÖSD A1 görev türlerine göre hazırlanmış 16 soru bulunur. Sonuçlar yalnızca bu cihazda kaydedilir.':['Each set has 16 questions based on ÖSD A1 task types. Results are saved only on this device.','Jedes Set enthält 16 Aufgaben nach dem ÖSD-A1-Format. Ergebnisse werden nur auf diesem Gerät gespeichert.'],
    'Sınav modu süresi':['Exam time limit','Prüfungszeit'], 'Soru':['Question','Frage'], 'yanıt':['answered','beantwortet'],
    'Soru açıklamaları':['Answer explanations','Antworterklärungen'], 'Cevap açıklamaları':['Answer explanations','Antworterklärungen'],
    'Tümü':['All','Alle'], 'Yanlışlar':['Mistakes','Fehler'], 'Yanlış cevabın yok. Diğer soruların açıklamalarını da inceleyebilirsin.':['You have no incorrect answers. You can review the explanations for the other questions.','Du hast keine falschen Antworten. Sieh dir gern auch die Erklärungen zu den anderen Fragen an.'],
    'Okuma yanlışlarım':['My reading mistakes','Meine Lesefehler'], 'Dinleme yanlışlarım':['My listening mistakes','Meine Hörfehler'],
    'Tamamlandı':['Completed','Abgeschlossen'], 'Devam et · ':['Continue · ','Weiter · '],
    'Süreli çalışma':['Timed practice','Übung mit Zeitlimit'], 'Serbest çalışma':['Untimed practice','Übung ohne Zeitlimit'],
    'SERBEST':['UNTIMED','OHNE ZEITLIMIT'], 'SÜRELİ':['TIMED','MIT ZEITLIMIT'],
    'Mikrofon açılıyor…':['Starting microphone…','Mikrofon wird gestartet …'], 'Ses kaydı başlat':['Start audio recording','Aufnahme starten'],
    'Kaydı durdur':['Stop recording','Aufnahme stoppen'], 'Sesini kaydet ve dinle':['Record and listen to your voice','Nimm deine Stimme auf und höre sie an'],
    'Mikrofonla sözlü prova':['Speaking practice with microphone','Sprechübung mit Mikrofon'],
    'Öz değerlendirme kontrolü':['Self-assessment checklist','Checkliste zur Selbsteinschätzung'],
    'Kendi notların (isteğe bağlı)':['Your notes (optional)','Deine Notizen (optional)'],
    'Redemittel · Hazır A1 kalıpları':['Useful phrases · A1 expressions','Redemittel · A1-Formulierungen'],
    'Ses dosyası doğrudan tarayıcının IndexedDB alanına kaydedilir. Sunucuya, öğretmene veya yapay zekâya gönderilmez. Tarayıcı verilerini temizlersen kayıtlar silinir.':['Audio files are stored in this browser’s IndexedDB. They are not sent to a server, teacher or AI. Clearing browser data deletes them.','Audiodateien werden in der IndexedDB dieses Browsers gespeichert. Sie werden nicht an einen Server, eine Lehrkraft oder eine KI gesendet. Beim Löschen der Browserdaten gehen die Aufnahmen verloren.'],
    'Bu görevde henüz kaydedilmiş ses yok.':['No audio has been recorded for this task yet.','Für diese Aufgabe wurde noch kein Audio aufgenommen.'],
    'Kayıt okunuyor…':['Loading recording…','Aufnahme wird geladen …'], 'Prova tamamlandı':['Practice completed','Übung abgeschlossen'],
    'Bitirdiğin provalar':['Completed practices','Abgeschlossene Übungen'], 'Dinle ›':['Listen ›','Anhören ›'],
    'Dosya yüklenemedi.':['File could not be loaded.','Datei konnte nicht geladen werden.'],
    'Çalışma tamamlandı.':['Practice completed.','Übung abgeschlossen.'],
    'Süre doldu; cevaplar kaydedildi.':['Time is up; your answers have been saved.','Die Zeit ist abgelaufen; deine Antworten wurden gespeichert.'],
    'Bu sonuç yalnızca özgün demo sorularındaki doğru cevap sayısıdır; resmî ÖSD notu değildir.':['This result counts correct answers in original demo questions only; it is not an official ÖSD score.','Dieses Ergebnis zählt nur richtige Antworten in den eigenen Demoaufgaben und ist keine offizielle ÖSD-Bewertung.'],
    'Açıklama filtresi':['Explanation filter','Erklärungsfilter'], 'Gerçek yanlışlar':['Incorrect answers','Falsche Antworten'],
    'JSON yedeğini indir':['Download JSON backup','JSON-Sicherung herunterladen'], 'Tüm kayıtları sıfırla':['Delete all saved data','Alle gespeicherten Daten löschen'],
    'Veriler ve yerel yedek':['Data and local backup','Daten und lokale Sicherung'],
    'Neleri tekrar çalışmalısın?':['What should you review?','Was solltest du wiederholen?'],
    'Çalışmaya başla':['Start practising','Übung starten'], 'Kaldığın soru setini aç':['Open the question set you left','Öffne das zuletzt bearbeitete Fragenset'],
    'Sözlü prova kaydına devam et':['Continue your speaking practice','Sprechübung fortsetzen'],
    'Kayıtlı e-postaya devam et':['Continue your saved email draft','Gespeicherten E-Mail-Entwurf fortsetzen'],
    'Sınav modunda':['In exam mode','Im Prüfungsmodus'], 'gerçek yanlış':['incorrect answer','falsche Antwort'],
    'Yanlış cevap kaydı bulunmuyor.':['No incorrect answers have been saved.','Es wurden keine falschen Antworten gespeichert.'],
    'Yerel ilerleme':['Local progress','Lokaler Lernstand'], 'Gerçek kayıtlar':['Saved results','Gespeicherte Ergebnisse'],
    'Yerel kayıt':['Saved locally','Lokal gespeichert'], 'Kayıt sorunu':['Saving problem','Speicherproblem'],
    'Çalışmayı tamamla':['Finish activity','Übung abschließen'], 'Çalışmayı tamamla ✓':['Finish activity ✓','Übung abschließen ✓'],
    'Bölümü onayla ›':['Confirm section ›','Teil bestätigen ›'], 'Bölümü bitir':['Finish section','Teil abschließen'],
    'Konuşmayı başlat':['Start speaking','Sprechen starten'], 'Hazırlığı tamamla ve konuşmaya geç':['Finish preparation and start speaking','Vorbereitung abschließen und mit dem Sprechen beginnen'],
    'Ara ver':['Pause','Pause'], 'Burada bitir ve kaydet':['Finish and save here','Hier abschließen und speichern'],
    'Sınav Günü Ne Yapmalıyım?':['What should I do on exam day?','Was soll ich am Prüfungstag tun?'],
    'Puanlama Nasıl İşliyor?':['How does scoring work?','Wie funktioniert die Bewertung?'],
    'ÖSD A1 SINAVINA HAZIR MIYIM?':['AM I READY FOR THE ÖSD A1 EXAM?','BIN ICH BEREIT FÜR DIE ÖSD-A1-PRÜFUNG?'],
    'Bu bir test değil. Anladığın maddeleri işaretle; eksik kalan konuyu tekrar oku.':['This is not a test. Check the points you understand and review anything that is still unclear.','Dies ist kein Test. Markiere, was du verstanden hast, und wiederhole offene Themen.'],
    'İşaretleri temizle':['Clear marks','Markierungen löschen'],
    'Bu uygulamada destek seçimi demo amaçlıdır. Gerçek rezervasyon oluşturulmaz.':['Support selection in this app is for demonstration only. No actual booking is made.','Die Auswahl der Unterstützung dient in dieser App nur zur Demonstration. Es wird keine echte Buchung vorgenommen.'],
    'Kişisel ilerlemen bu cihazda saklanır.':['Your progress is stored on this device.','Dein Lernstand wird auf diesem Gerät gespeichert.'],
    'Aşama ':['Stage ','Stufe '], 'görev':['task','Aufgabe'], 'görevler':['tasks','Aufgaben'],
    'AYDA | ÖSD A1 Prüfungstraining DEMO':['AYDA | ÖSD A1 Exam Preparation DEMO','AYDA | ÖSD-A1-Prüfungsvorbereitung DEMO'],
    'Yeminli tercüme':['Certified translation','Beglaubigte Übersetzung'], 'Tümünü gör':['View all','Alle ansehen'],
    'Geri dön':['Go back','Zurück'], 'Devam':['Continue','Weiter'], 'Yardım':['Help','Hilfe'], 'Uyarı':['Warning','Hinweis'],
    'Kapat':['Close','Schließen'], 'Kurslar':['Courses','Kurse'], 'Dersler':['Lessons','Unterricht'],
    'Sonuçlar':['Results','Ergebnisse'], 'Durum':['Status','Status'], 'Ayarlar':['Settings','Einstellungen'],
    'Kaydet':['Save','Speichern'], 'Sil':['Delete','Löschen'], 'İptal':['Cancel','Abbrechen'], 'Evet':['Yes','Ja'], 'Hayır':['No','Nein'],
    'Tekrar dene':['Try again','Erneut versuchen'], 'İşlem tamamlandı.':['Action completed.','Aktion abgeschlossen.'],
    'Bir hata oluştu.':['An error occurred.','Ein Fehler ist aufgetreten.'], 'Henüz kayıt yok.':['No saved work yet.','Noch keine gespeicherten Übungen.'],
    'Sonuç bulunamadı.':['No results found.','Keine Ergebnisse gefunden.'], 'Bu bölüm hazırlanıyor.':['This section is being prepared.','Dieser Bereich wird vorbereitet.'],
    'Süre doldu':['Time is up','Zeit abgelaufen'], 'Cevaplarını kontrol et':['Review your answers','Überprüfe deine Antworten'],
    'Önceki soru':['Previous question','Vorherige Frage'], 'Sonraki soru':['Next question','Nächste Frage'], 'Cevaplarını kaydet':['Save your answers','Antworten speichern'],
    'Toplam':['Total','Gesamt'], 'Doğru sayısı':['Correct answers','Richtige Antworten'], 'İlerleme durumu':['Progress','Lernstand'],
    'Tamamlanan çalışmalar':['Completed activities','Abgeschlossene Übungen'], 'Çalışma süresi':['Practice time','Übungszeit'],
    'İşaretli sorular':['Flagged questions','Markierte Fragen'], 'Yanlış cevapların':['Incorrect answers','Falsche Antworten'],
    'Boş bırakılanlar':['Unanswered questions','Offene Fragen'], 'E-posta taslağı':['Email draft','E-Mail-Entwurf'],
    'Form doldurma':['Form completion','Formular ausfüllen'], 'Kayıt ve gizlilik':['Storage and privacy','Speicherung und Datenschutz'],
    'Yalnızca bu cihazda saklanır.':['Stored on this device only.','Wird nur auf diesem Gerät gespeichert.'], 'Dışarı aktarılmaz.':['Not exported.','Wird nicht exportiert.'],
    'Adım adım':['Step by step','Schritt für Schritt'], 'ÖSD A1 Sınav Rehberi · Adım adım':['ÖSD A1 Exam Guide · Step by step','ÖSD-A1-Prüfungsleitfaden · Schritt für Schritt']
  };
  const valid = ['tr', 'de', 'en'];
  const clean = value => String(value || '').trim();
  const normalize = value => clean(value).replace(/\s+/g, ' ');
  const reverse = { de: new Map(), en: new Map() };
  Object.entries(catalog).forEach(([tr, values]) => { reverse.en.set(values[0], tr); reverse.de.set(values[1], tr); });
  let locale = 'tr';
  try { const saved = localStorage.getItem(KEY); if (valid.includes(saved)) locale = saved; } catch { /* Private browsing may disable storage. */ }
  let applying = false;
  const originals = new WeakMap();
  function sourceFor(node, value) {
    if (!originals.has(node)) originals.set(node, value);
    const original = originals.get(node);
    if (catalog[value]) { originals.set(node, value); return value; }
    return reverse[locale]?.get(value) || original;
  }
  function translate(value, to = locale) {
    const source = reverse[locale]?.get(value) || reverse.de.get(value) || reverse.en.get(value) || normalize(value);
    if (to === 'tr') return source;
    const values = catalog[source];
    if (values) return values[to === 'en' ? 0 : 1];
    const titleSuffix = source.match(/^(.+) · Adım adım$/);
    if (titleSuffix) return `${translate(titleSuffix[1], to)} · ${to === 'de' ? 'Schritt für Schritt' : 'Step by step'}`;
    const dynamic = source.match(/^Tamamlanan: (\d+) çalışma · (\d+) gerçek yanlış$/);
    if (dynamic) return to === 'de' ? `Abgeschlossen: ${dynamic[1]} Übungen · ${dynamic[2]} falsche Antworten` : `Completed: ${dynamic[1]} activities · ${dynamic[2]} incorrect answers`;
    const answerCount = source.match(/^(\d+)\s*\/\s*(\d+) yanıt$/);
    if (answerCount) return to === 'de' ? `${answerCount[1]} / ${answerCount[2]} beantwortet` : `${answerCount[1]} / ${answerCount[2]} answered`;
    const unanswered = source.match(/^(\d+) soruya cevap verilmedi$/);
    if (unanswered) return to === 'de' ? `${unanswered[1]} Fragen unbeantwortet` : `${unanswered[1]} questions unanswered`;
    const questionLabel = source.match(/^Soru (\d+)$/);
    if (questionLabel) return to === 'de' ? `Frage ${questionLabel[1]}` : `Question ${questionLabel[1]}`;
    const stage = source.match(/^AŞAMA (\d+) · (.+)$/);
    if (stage) return `${to === 'de' ? 'STUFE' : 'STAGE'} ${stage[1]} · ${stage[2]}`;
    return value;
  }
  function setLocale(next) {
    if (!valid.includes(next)) return;
    locale = next;
    try { localStorage.setItem(KEY, next); } catch { /* Preference is optional when storage is blocked. */ }
    document.documentElement.lang = next === 'tr' ? 'tr' : next === 'de' ? 'de' : 'en';
    const currentTitle = document.title;
    const localizedTitle = translate(currentTitle, next);
    if (localizedTitle !== currentTitle) document.title = localizedTitle;
    apply(document.body);
    window.dispatchEvent(new CustomEvent('ayda:locale', { detail: next }));
  }
  function apply(root) {
    if (!root || applying) return;
    applying = true;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!normalize(node.nodeValue)) continue;
      const raw = clean(node.nodeValue);
      const tr = sourceFor(node, raw);
      if (locale === 'tr') {
        if (node.nodeValue !== originals.get(node)) node.nodeValue = originals.get(node);
      } else if (catalog[tr] || tr !== raw) {
        const translated = translate(tr);
        if (node.nodeValue.trim() !== translated) node.nodeValue = node.nodeValue.replace(raw, translated);
      }
    }
    const elements = root.nodeType === 1 ? [root, ...root.querySelectorAll('*')] : [...root.querySelectorAll('*')];
    for (const el of elements) {
      for (const attr of ['aria-label', 'title', 'placeholder', 'alt']) {
        if (!el.hasAttribute?.(attr)) continue;
        const value = el.getAttribute(attr);
        const tr = reverse[locale]?.get(value) || value;
        const local = el.__aydaAttrs || (el.__aydaAttrs = {});
        if (!(attr in local)) local[attr] = tr;
        const original = local[attr];
        const values = catalog[original];
        if (locale === 'tr') el.setAttribute(attr, original);
        else if (values) el.setAttribute(attr, values[locale === 'en' ? 0 : 1]);
      }
    }
    applying = false;
  }
  window.AydaLocale = { key: KEY, get: () => locale, set: setLocale, t: translate, apply, catalog };
  document.documentElement.lang = locale === 'tr' ? 'tr' : locale === 'de' ? 'de' : 'en';
  const initialTitle = translate(document.title, locale);
  if (initialTitle !== document.title) document.title = initialTitle;
  const start = () => {
    apply(document.body);
    new MutationObserver(records => {
      if (applying) return;
      for (const record of records) {
        if (record.type === 'characterData') apply(record.target.parentElement || document.body);
        else record.addedNodes.forEach(node => { if (node.nodeType === 1) apply(node); });
      }
    }).observe(document.body, { subtree: true, childList: true, characterData: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
