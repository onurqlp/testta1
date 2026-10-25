import type { ReactNode } from 'react'

const BASE='https://wa.me/905409122503?text='
const contact=(subject:string)=>BASE+encodeURIComponent('Merhaba AYDA Dil Akademisi, ÖSD A1 çalışma platformunuzdan ulaşıyorum. '+subject+' hakkında bilgi alabilir miyim?')
const attrs={target:'_blank',rel:'noopener noreferrer'} as const

function ServiceCard({eyebrow,title,children,tags,whatsApp,detailUrl,detailText,icon}:{
  eyebrow:string; title:string; children:ReactNode; tags:string[];
  whatsApp:string; detailUrl:string; detailText:string; icon:ReactNode
}){
  return <article className="ayda-service-card">
    <div className="ayda-service-top">
      <span className="ayda-service-symbol" aria-hidden="true">{icon}</span>
      <span className="ayda-service-kicker">{eyebrow}</span>
    </div>
    <h2>{title}</h2>
    <div className="ayda-service-description">{children}</div>
    <div className="ayda-service-tags">{tags.map(label=><span key={label}>{label}</span>)}</div>
    <div className="ayda-service-actions">
      <a className="ayda-service-primary" {...attrs} href={contact(whatsApp)}>WhatsApp’tan bilgi al <span aria-hidden="true">↗</span></a>
      <a className="ayda-service-secondary" {...attrs} href={detailUrl}>{detailText} <span aria-hidden="true">↗</span></a>
    </div>
  </article>
}

export default function ServicesView({onNavigate}:{onNavigate:(route:string)=>void}){
  return <>
    <div className="page-head ayda-services-heading">
      <span className="kicker">AYDA DİL AKADEMİSİ</span>
      <h1>Almanca yolculuğunda<br/>yanınızdayız.</h1>
      <p>ÖSD A1 sınavına hazırlanırken ihtiyaç duyabileceğiniz eğitim ve evrak hizmetlerini bir arada keşfedin. Soru çözümleriniz ve kişisel ilerlemeniz bu bölümden etkilenmez.</p>
    </div>
    <section className="ayda-services-hero" aria-label="AYDA hizmetleri">
      <span className="ayda-services-overline">DİL EĞİTİMİ · TERCÜME · YOL HARİTASI</span>
      <div className="ayda-services-hero-inner">
        <div><h2>Hedefiniz ne olursa olsun,<br/><em>bir sonraki adımınız belli olsun.</em></h2><p>Sınav hazırlığı, online kurs veya Almanca evrak işlemleri için AYDA ekibinden bilgi alabilirsiniz.</p></div>
        <span className="ayda-services-monogram" aria-hidden="true">A1<span>→</span>C1</span>
      </div>
    </section>
    <div className="ayda-service-grid">
      <ServiceCard eyebrow="01 · ALMANCA EĞİTİMİ" title="Online Almanca Kursları" whatsApp="A1–B2 online grup kursu veya A1–C1 özel ders seçenekleri" detailUrl="https://www.aydadil.com/kurslar/" detailText="Kursları incele"
        tags={['A1–B2 canlı grup','A1–C1 özel ders','Speaking ve etüt']} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 5.5C7 4.5 10 5 12 7c2-2 5-2.5 8-1.5V19c-3-1.2-6-.8-8 1-2-1.8-5-2.2-8-1V5.5Z"/><path d="M12 7v13"/></svg>}>
        <p>Öğretmen eşliğinde canlı ders, konuşma pratiği, ders kayıtları ve tekrarlarla seviyenize uygun ilerleyin. Grup ve birebir ders planı için güncel programı sorun.</p>
      </ServiceCard>
      <ServiceCard eyebrow="02 · EVRAK VE TERCÜME" title="Almanca–Türkçe Tercüme" whatsApp="Almanca–Türkçe yeminli tercüme ve gerektiğinde noter onayı hizmeti" detailUrl="https://www.aydadil.com/" detailText="AYDA web sitesine git"
        tags={['Diploma ve transkript','Başvuru belgeleri','Noter onayı süreç desteği']} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v6h5M9 13h7m-7 4h7"/></svg>}>
        <p>Almanya başvurularında kullanılan diploma, transkript ve benzeri evraklar için yeminli tercüme ve noter onayı sürecinde yönlendirme. Belge türüne göre kapsam ve ücret teyit edilir.</p>
      </ServiceCard>
      <ServiceCard eyebrow="03 · SINAV ODAKLI" title="Sınav Hazırlığı ve Özel Ders" whatsApp="ÖSD A1 sınavı için öğretmenli sözlü prova, yazma değerlendirmesi ve sınav hazırlık dersi" detailUrl="https://www.aydadil.com/sinavhazirlik/" detailText="Hazırlık kaynakları"
        tags={['ÖSD / telc / Goethe','Schreiben çalışması','Sprechen provası']} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>}>
        <p>Dijital çalışmanın yanında öğretmen geri bildirimi isteyenler için sınava odaklı ders seçenekleri. Hazırlık eğitimi, resmî sınav kaydı veya sertifika garantisi anlamına gelmez.</p>
      </ServiceCard>
      <ServiceCard eyebrow="04 · ALMANYA HEDEFİ" title="Başvuru ve Denklik Yönlendirmesi" whatsApp="Almanya eğitim veya çalışma hedefim için dil seviyesi, başvuru belgeleri ve denklik yönlendirmesi" detailUrl="https://www.aydadil.com/" detailText="AYDA’yı incele"
        tags={['Eğitim ve çalışma hedefi','Dil seviyesi planı','Belge yönlendirmesi']} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m3 10 9-7 9 7v10H3V10Z"/><path d="M9 20v-6h6v6"/></svg>}>
        <p>Almanya’daki üniversite veya iş hedefiniz için dil seviyesini ve belge hazırlık adımlarını planlama desteği. Resmî denklik kararı ilgili yetkili kurumlara aittir.</p>
      </ServiceCard>
    </div>
    <section className="ayda-service-help" aria-label="ÖSD A1 öğretmen desteği">
      <div><span>ÖSD A1 ÇALIŞMAYA DEVAM</span><h2>Bu uygulamadaki desteğiniz de burada.</h2><p>Öğretmenle konuşma provası ve yazma çalışması seçeneklerini ayrı bölümde inceleyebilirsiniz.</p></div>
      <button type="button" onClick={()=>onNavigate('/support')}>Öğretmen desteği <span aria-hidden="true">→</span></button>
    </section>
    <p className="ayda-services-note">Kurs, tercüme, randevu ve fiyat talepleri AYDA'nın iletişim kanallarından yürütülür. Bu demo uygulamada ödeme alınmaz, belge yüklenmez ve otomatik randevu oluşturulmaz.</p>
  </>
}
