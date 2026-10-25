import { useEffect, useMemo, useState } from 'react'
import { findModule, modules, type ModuleId } from './data/modules'
import { openDatabase, listRecords, readLastView, readProgressOverview, saveLastView } from './storage/db'
import type { Attempt, LastView, ProgressOverview } from './storage/models'
import { PART_LABELS, type ExamRun } from './modules/exam/model'
import type { WritingDraft } from './modules/schreiben/model'
import type { SpeakingSession } from './modules/sprechen/model'
import LesenView, { LesenMistakes } from './modules/lesen/LesenView'
import HoerenView, { HoerenMistakes } from './modules/hoeren/HoerenView'
import SchreibenView from './modules/schreiben/SchreibenView'
import SprechenView from './modules/sprechen/SprechenView'
import ExamView from './modules/exam/ExamView'
import ProgressView, {ExamMistakes} from './modules/progress/ProgressView'
import SupportView from './modules/teachers/SupportView'
import ServicesView from './ServicesView'

type IconName = 'briefcase' | 'book' | 'headphones' | 'pen' | 'mic' | 'home' | 'grid' | 'chart' | 'help' | 'arrow' | 'clock' | 'check' | 'alert' | 'layers' | 'refresh' | 'spark' | 'shield' | 'back' | 'chevron'
type TabId = 'home' | 'guide' | 'works' | 'progress' | 'services'
const emptyProgress: ProgressOverview = { completed: 0, attempts: 0, wrong: 0 }

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const }
  const paths: Record<IconName, React.ReactNode> = {
    briefcase: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18m-10 0v3h2v-3"/></>,
    book: <><path d="M4 5.5C6.5 4.7 9 4.8 12 6.8c3-2 5.5-2.1 8-.9V19c-2.5-1.1-5-.9-8 1-3-1.9-5.5-2.1-8-1V5.5Z" /><path d="M12 7v13"/></>,
    headphones: <><path d="M4 14v-3a8 8 0 0 1 16 0v3"/><path d="M4 14h2.5v6H6a2 2 0 0 1-2-2v-4ZM20 14h-2.5v6H18a2 2 0 0 0 2-2v-4Z"/></>,
    pen: <><path d="m4 20 4.7-1.1L20 7.6 16.4 4 5.1 15.3 4 20Z"/><path d="m14.7 5.7 3.6 3.6M4 20h16"/></>,
    mic: <><rect x="9" y="2.5" width="6" height="12" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3m-4 0h8"/></>,
    home: <><path d="m3 10 9-7 9 7v10H3V10Z"/><path d="M9 20v-6h6v6"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    chart: <><path d="M4 20V11m6 9V5m6 15v-8m4 8V8"/><path d="M2 20h20"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.4 9a2.8 2.8 0 1 1 4.5 2.4c-1.1.8-1.9 1.1-1.9 2.6M12 17h.01"/></>,
    arrow: <><path d="M4 12h16m-7-7 7 7-7 7"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
    alert: <><circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 4h.01"/></>,
    layers: <><path d="m3 9 9-5 9 5-9 5-9-5Zm0 5 9 5 9-5M3 18l9 4 9-4"/></>,
    refresh: <><path d="M20 7V3m0 4h-4M4 17v4m0-4h4"/><path d="M6 8a7 7 0 0 1 12-2m0 10a7 7 0 0 1-12 2"/></>,
    spark: <><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2ZM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z"/></>,
    shield: <><path d="M12 2 4 5v6c0 5 3 8 8 11 5-3 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></>,
    back: <><path d="m13 5-7 7 7 7M7 12h13"/></>,
    chevron: <><path d="m9 5 7 7-7 7"/></>
  }
  return <svg {...common}>{paths[name]}</svg>
}

const getPath = () => {
  const raw = window.location.hash.replace(/^#/, '') || '/home'
  if (['/home', '/works', '/progress', '/support', '/about', '/exam', '/mistakes', '/guide', '/services'].includes(raw)) return raw
  if(raw.startsWith('/exam?run='))return raw
  if(raw.startsWith('/support?'))return raw
  if (raw.startsWith('/module/') && findModule(raw.split('/')[2])) return raw
  return '/home'
}
function navigate(path: string) {
  const hash = '#' + path
  if (window.location.hash !== hash) window.location.hash = hash
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
function ModuleIcon({ id, size = 26 }: { id: ModuleId; size?: number }) {
  return <Icon name={{ lesen: 'book', hoeren: 'headphones', schreiben: 'pen', sprechen: 'mic' }[id] as IconName} size={size} />
}
const stageCards = [
  { title: 'Deneme Sınavı', sub: 'Tam sınav akışı', path: '/exam', icon: 'clock' as IconName, stage: 6 },
  { title: 'Yanlışlarım', sub: 'Tekrar listesi', path: '/mistakes', icon: 'refresh' as IconName, stage: 6 },
  { title: 'İlerlemem', sub: 'Gerçek kayıtlarım', path: '/progress', icon: 'chart' as IconName, stage: 6 }
]

function EmptyState({ icon = 'layers', title, description, stage }: { icon?: IconName; title: string; description: string; stage?: number }) {
  return <section className="empty-state">
    <div className="empty-icon"><Icon name={icon} size={28}/></div>
    {stage && <span className="step-pill">AŞAMA {stage}</span>}
    <h2>{title}</h2>
    <p>{description}</p>
    <button className="btn ghost" onClick={() => navigate('/works')}><Icon name="back" size={18}/> Çalışmalara dön</button>
  </section>
}

function App() {
  const [path, setPath] = useState(getPath)
  const [last, setLast] = useState<LastView | undefined>()
  const [progress, setProgress] = useState(emptyProgress)
  const [dbError, setDbError] = useState('')
  const [loading, setLoading] = useState(true)
  const [resumeTarget,setResumeTarget]=useState<{path:string;title:string;detail:string}|null>(null)

  useEffect(() => {
    if (!window.location.hash) window.location.hash = '#/home'
    const update = () => { setPath(getPath()); window.scrollTo({ top: 0, behavior: 'instant' }) }
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  useEffect(() => {
    let active = true
    Promise.all([openDatabase().then(db => db.close()), readLastView(), readProgressOverview()])
      .then(([,lastView,overview]) => { if (active) { setLast(lastView); setProgress(overview); setDbError('') } })
      .catch(() => { if (active) setDbError('Bu tarayıcıda yerel kayıt açılamıyor. Gezinebilirsin ancak ilerleme kaydedilemeyebilir.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    readProgressOverview().then(overview => { if (active) setProgress(overview) }).catch(() => {})
    const reload = () => { readProgressOverview().then(overview => { if (active) setProgress(overview) }).catch(() => {}) }
    window.addEventListener('ayda:progress-changed', reload)
    return () => { active = false; window.removeEventListener('ayda:progress-changed', reload) }
  }, [path])

  useEffect(() => {
    if (!path.startsWith('/module/')) return
    const view = { path, updatedAt: new Date().toISOString() }
    saveLastView(path).then(() => setLast(view)).catch(() => setDbError('Yerel kayıt devre dışı. Tarayıcı izinlerini kontrol et.'))
  }, [path])

  useEffect(()=>{
    let alive=true
    const load=async()=>{
      try{
        const [exams,attempts,drafts,sessions]=await Promise.all([
          listRecords<ExamRun>('examSessions'),listRecords<Attempt>('attempts'),
          listRecords<WritingDraft>('drafts'),listRecords<SpeakingSession>('sessions')
        ])
        const open:{updatedAt:string;path:string;title:string;detail:string}[]=[]
        for(const e of exams.filter(x=>x?.kind==='integrated-exam'&&x.version===1&&x.status!=='finished'))
          open.push({updatedAt:e.updatedAt,path:'/exam?run='+encodeURIComponent(e.id),title:'Tam deneme · Set '+(e.setIndex+1),detail:PART_LABELS[e.part]+' bölümünden devam et'})
        for(const a of attempts.filter(x=>!x.finishedAt&&(x.module==='lesen'||x.module==='hoeren')))
          open.push({updatedAt:a.updatedAt,path:'/module/'+a.module,title:PART_LABELS[a.module as 'lesen'|'hoeren']+' çalışması',detail:'Kaldığın soru setini aç'})
        for(const d of drafts.filter(x=>x?.module==='schreiben'&&!x.finishedAt))
          open.push({updatedAt:d.updatedAt,path:'/module/schreiben',title:'Schreiben taslağı',detail:'Kayıtlı e-postaya devam et'})
        for(const v of sessions.filter(x=>x?.module==='sprechen'&&!x.finishedAt))
          open.push({updatedAt:v.updatedAt,path:'/module/sprechen',title:'Sprechen provası',detail:'Sözlü prova kaydına devam et'})
        open.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))
        if(alive)setResumeTarget(open[0]||null)
      }catch{if(alive)setResumeTarget(null)}
    }
    void load()
    window.addEventListener('ayda:progress-changed',load)
    return()=>{alive=false;window.removeEventListener('ayda:progress-changed',load)}
  },[path])
  const section = useMemo(() => path.startsWith('/module/') ? findModule(path.split('/')[2]) : undefined, [path])
  const activeTab: TabId = path === '/home' ? 'home' : path === '/guide' ? 'guide' : (path === '/progress' || path === '/mistakes') ? 'progress' : (path.startsWith('/support') || path === '/services') ? 'services' : 'works'
  const lastModule = last?.path ? findModule(last.path.split('/')[2]) : undefined

  return <div className="app-shell">
    <a className="skip-link" href="#main">İçeriğe geç</a>
    <header className="site-header">
      <div className="head-inner">
        <button className="brand" onClick={() => navigate('/home')} aria-label="AYDA ana sayfaya dön">
          <img className="brand-logo" src="/branding/ayda-logo.png" width="134" height="45" alt="AYDA Dil Akademisi" />
          <span className="brand-copy"><strong>ÖSD A1</strong><small>SINAV HAZIRLIĞI</small></span>
        </button>
        <div className="header-right"><button className="header-services-link" onClick={() => navigate('/services')} aria-label="AYDA kurs ve tercüme hizmetleri"><Icon name="briefcase" size={17}/><span>Hizmetler</span></button><span className="demo-badge"><span className="status-light"/> A1 · DEMO</span><button className="info-button" aria-label="Hakkında" onClick={() => navigate('/about')}><Icon name="help" size={21}/></button></div>
      </div>
    </header>
    <main id="main" className="main-wrap">
      {dbError && <div className="warning" role="alert"><Icon name="alert" size={17}/>{dbError}</div>}
      {path === '/home' && <>
        <section className="hero">
          <div className="hero-art art-one"/><div className="hero-art art-two"/>
          <div className="hero-text">
            <span className="eyebrow"><span className="eyebrow-line"/> ÖSD SINAV HAZIRLIĞI</span>
            <h1>Almancana güven.<br/><em>Sınava hazır ol.</em></h1>
            <p>A1 sınavına adım adım hazırlanabileceğin kişisel çalışma alanın.</p>
            <div className="hero-actions"><button className="btn light" onClick={() => navigate('/works')}>Çalışmaları keşfet <Icon name="arrow" size={19}/></button></div>
          </div>
          <div className="hero-level"><span>SEVİYE</span><b>A1</b><small>Prüfungstraining</small></div>
        </section>
        <div className="section-heading greeting"><div><span className="kicker">ÇALIŞMA PANELİ</span><h2>Bugün ne çalışalım?</h2></div><span className="muted-side">4 beceri · Tek hedef</span></div>
        <section className="resume-card">
          <div className="resume-icon"><Icon name="refresh" size={24}/></div>
          <div className="resume-copy">
            <span className="mini-label">KALDIĞIN YERDEN DEVAM ET</span>
            <strong>{resumeTarget?.title||(lastModule ? lastModule.title + ' — ' + lastModule.subtitle : 'İlk çalışmanı seç')}</strong>
            <p>{resumeTarget?.detail||(lastModule ? 'Son açtığın bölüme geri dönebilirsin.' : 'Bir bölüm açtığında burada görünecek.')}</p>
            <p>{loading ? 'Yerel ilerleme yükleniyor…' : 'Tamamlanan: '+progress.attempts+' çalışma · '+progress.wrong+' gerçek yanlış'}</p>
          </div>
          <button className="round-arrow" onClick={() => navigate(resumeTarget?.path||(lastModule ? last!.path : '/works'))} aria-label="Devam et"><Icon name="arrow" size={21}/></button>
        </section>
        <button type="button" className="guide-feature" onClick={() => navigate('/guide')}>
          <span className="guide-feature-mark"><Icon name="book" size={26}/></span>
          <span className="guide-feature-copy"><small>YENİ · ÖSD A1 SINAV REHBERİ</small><strong>Önce sınavı tanı, sonra soruları çöz.</strong><span>4 bölüm, 11 görev · Örnek sınav kâğıdı görselleri · Adım adım stratejiler</span></span><Icon name="chevron" size={22}/>
        </button>
        <section className="module-grid" aria-label="Çalışma modülleri">
          {modules.map((module, i) => <button className={'module-card '+module.accent} key={module.id} onClick={() => navigate('/module/'+module.id)}>
            <span className="module-icon"><ModuleIcon id={module.id}/></span>
            <span className="module-number">0{i + 1}</span>
            <strong>{module.title}</strong><span className="module-sub">{module.subtitle}</span>
            <span className="module-summary">{module.summary}</span>
            <span className="module-bottom"><span>{module.id==='lesen'?'32 soru · Kullanıma açık':module.id==='hoeren'?'30 soru · Gerçek ses':module.id==='schreiben'?'5 yazma seti · Yerel kontrol':module.id==='sprechen'?'2 sözlü prova · Ses kaydı':'Aşama '+module.stage+'te açılacak'}</span><Icon name="arrow" size={18}/></span>
          </button>)}
        </section>
        <div className="section-heading second-section"><div><span className="kicker">SINAV YOLCULUĞU</span><h2>Hedefine giden yol</h2></div></div>
        <div className="shortcuts">{stageCards.map((card) => <button key={card.path} className="shortcut" onClick={() => navigate(card.path)}>
          <span className="shortcut-symbol"><Icon name={card.icon} size={22}/></span><span><strong>{card.title}</strong><small>{card.sub}</small></span><Icon name="chevron" size={18}/></button>)}</div>
        <section className="ayda-home-services" aria-label="AYDA eğitim ve tercüme hizmetleri">
          <div className="ayda-home-services-copy"><span className="kicker">AYDA İLE DEVAM ET</span><h2>Sınavdan sonraki adımda da yanındayız.</h2><p>Canlı Almanca kursları, sınav hazırlığı ve Almanca–Türkçe yeminli tercüme hizmetlerini keşfet.</p></div>
          <button className="ayda-home-services-link" onClick={() => navigate('/services')}>AYDA hizmetlerini keşfet <Icon name="arrow" size={18}/></button>
        </section>
        <section className="support-banner"><div><span>AYDA DESTEĞİ</span><h3>Bir öğretmenle çalışmak ister misin?</h3><p>A1 konuşma provası ve yazı değerlendirme hizmetlerini demo ekranda incele.</p><button onClick={() => navigate('/support')}>Destek seçenekleri <Icon name="arrow" size={16}/></button></div><div className="support-shape"><Icon name="spark" size={42}/></div></section>
      </>}
      {path === '/services' && <ServicesView onNavigate={navigate}/>}
      {path === '/works' && <>
        <div className="page-head"><span className="kicker">A1 ÇALIŞMA ALANI</span><h1>Çalışmalar</h1><p>Her beceriyi ayrı ayrı geliştireceğiz. Hazır olduğunda ilgili alana dokun.</p></div>
        <button type="button" className="guide-feature guide-feature-slim" onClick={() => navigate('/guide')}><span className="guide-feature-mark"><Icon name="book" size={24}/></span><span className="guide-feature-copy"><small>ÖSD A1 SINAV REHBERİ</small><strong>11 görevlik sınav rehberi</strong><span>Örnek sınav sayfaları ve öğretmen tavsiyeleri</span></span><Icon name="chevron" size={19}/></button>
        <div className="works-grid">{modules.map(module=><button key={module.id} className="work-row" onClick={() => navigate('/module/'+module.id)}><span className={'work-icon '+module.accent}><ModuleIcon id={module.id}/></span><span className="work-copy"><strong>{module.title} <span>· {module.subtitle}</span></strong><small>{module.summary}</small><i>{module.id==='lesen'?'32 özgün soru · Çalışmaya başla':module.id==='hoeren'?'30 özgün soru · 6 MP3 ses dosyası':module.id==='schreiben'?'5 form + e-posta · İnternetsiz kontrol':module.id==='sprechen'?'2 prova seti · 6 özgün resim · Ses kaydı':'Aşama '+module.stage+' — Hazırlanıyor'}</i></span><Icon name="chevron" size={20}/></button>)}</div>
        <button className="exam-wide" onClick={()=>navigate('/exam')}><Icon name="clock" size={25}/><span><strong>Tam Deneme Sınavı</strong><small>Dört becerili deneme aktif</small></span><Icon name="arrow" size={20}/></button>
      </>}
      {path === '/guide' && <>
        <div className="page-head"><span className="kicker">AYDA · ÖSD ZERTIFIKAT A1</span><h1>ÖSD A1 Sınav Rehberi</h1><p>Bu bölüm soru çözme testi değil; sınav kâğıdındaki 11 görevi tanıma ve strateji öğrenme alanın. Örnek sınav sayfaları ve adım adım anlatımlar burada.</p></div>
        <section className="guide-intro"><div><span className="guide-eyebrow">4 BÖLÜM · 11 GÖREV</span><h2>Sınavda neyle karşılaşacağını öğren.</h2><p>ÖSD model sınavından kâğıt görsellerini, soruların nerede olduğunu, cevap yöntemlerini ve sık yapılan hataları incele.</p></div><a href="/rehber/a1/" className="guide-open">Tam rehberi aç <Icon name="arrow" size={20}/></a></section>
        <div className="guide-link-grid">
          {([
            {id:'lesen',name:'Lesen',tr:'Okuma',detail:'3 görev · 25 dakika',icon:'book' as IconName},
            {id:'horen',name:'Hören',tr:'Dinleme',detail:'3 görev · yaklaşık 10 dakika',icon:'headphones' as IconName},
            {id:'schreiben',name:'Schreiben',tr:'Yazma',detail:'2 görev · 20 dakika',icon:'pen' as IconName},
            {id:'sprechen',name:'Sprechen',tr:'Konuşma',detail:'3 görev · yaklaşık 10 dakika',icon:'mic' as IconName}
          ]).map(item=><a key={item.id} href={'/rehber/a1/#'+item.id} className="guide-link"><span className="guide-icon"><Icon name={item.icon} size={24}/></span><span><strong>{item.name} <small>· {item.tr}</small></strong><em>{item.detail}</em></span><Icon name="chevron" size={19}/></a>)}
        </div>
        <div className="guide-info"><h2>Rehberde başka neler var?</h2><p>Sınav günü kontrolü, yazılı ve sözlü puanlama koşulları, sınav kâğıtlarını büyütme, hazırlık kontrol listesi ve kaldığın göreve dönme.</p><p><strong>Bilgi:</strong> Rehberdeki işaretler bu tarayıcıda ayrıca kaydedilir; deneme puanını değiştirmez. Rehberin temel içeriği ve görselleri APK sürümünde yerel olarak da bulunabilir; web sürümünde ilk açılış için internet gerekir.</p><a href="https://osd.aydadil.com/a1/" target="_blank" rel="noopener noreferrer">AYDA kaynak rehberi ↗</a></div>
      </>}
      {section && <>
        <div className="breadcrumb"><button onClick={()=>navigate('/works')}><Icon name="back" size={16}/> Çalışmalar</button><Icon name="chevron" size={15}/><b>{section.title}</b></div>
        <div className={'module-title-panel '+section.accent}><span className="module-title-icon"><ModuleIcon id={section.id} size={30}/></span><div><span>A1 · {section.subtitle.toUpperCase()}</span><h1>{section.title}</h1><p>{section.summary}</p></div></div>
        {section.id==='lesen'?<LesenView/>:section.id==='hoeren'?<HoerenView/>:section.id==='schreiben'?<SchreibenView/>:section.id==='sprechen'?<SprechenView/>:<EmptyState icon="layers" title={section.title + ' çalışmaları hazırlanıyor'} description={section.detail} stage={section.stage}/>}
      </>}
      {path.startsWith('/exam') && <ExamView key={path}/>}
      {path === '/mistakes' && <><div className="page-head"><span className="kicker">TEKRAR ALANI</span><h1>Yanlışlarım</h1><p>Gerçek çözdüğün sorulardan oluşacak kişisel tekrar listen.</p></div><><LesenMistakes/><HoerenMistakes/><ExamMistakes/></></>}
      {path === '/progress' && <ProgressView/>}
      {path.startsWith('/support') && <SupportView key={path}/>}
      {path === '/about' && <>
        <div className="page-head"><span className="kicker">BİLGİ VE YASAL</span><h1>Uygulama hakkında</h1><p>ÖSD A1 Prüfungstraining · AYDA Dil Akademisi · Demo 0.11</p></div>
        <div className="panel legal"><h2>Bağımsız hazırlık materyali</h2><p>Bu uygulama AYDA Dil Akademisinin bağımsız eğitim demosudur. Resmî ÖSD ürünü değildir; ÖSD tarafından onaylandığı iddia edilmez.</p><h2>Kaynaklar ve sınav biçimi</h2><p>ÖSD Zertifikat A1 sınavının resmî yapısı ve süreleri ÖSD'nin yayımladığı güncel sınav sayfası, modellsatz broşürü ve yürütme kurallarından kontrol edilmiştir.</p><a href="https://www.osd.at/portfolio-item/osd-zertifikat-a1-za1/" target="_blank" rel="noopener noreferrer">ÖSD resmî bilgilendirme sayfası ↗</a><h2>Gizlilik</h2><p>Bu demo üyelik, ödeme ve öğrenci verisi toplamaz. Yerel çalışma bilgileri yalnızca kullandığın tarayıcının veri alanında saklanır; silersen kaybolabilir.</p><h2>Hazırlık planı</h2><p>Lesen, Hören, Schreiben ve Sprechen çalışmalarına ek olarak tam demo denemesi, gerçek ilerleme paneli, JSON yedek ve yalnız cihazda saklanan öğretmen hizmeti seçim demosu aktiftir. Gerçek eğitmen takvimi, ödeme, dosya gönderimi, öğretmen değerlendirmesi veya onaylanmış rezervasyon yoktur. Android test APK'sı üretilmiştir; Google Play Store yayını henüz yoktur.</p></div>
      </>}
    </main>
    <nav className="bottom-nav" aria-label="Alt gezinme">
      {([{id:'home',label:'Ana Sayfa',icon:'home',to:'/home'},{id:'guide',label:'Rehber',icon:'book',to:'/guide'},{id:'works',label:'Çalışmalar',icon:'grid',to:'/works'},{id:'progress',label:'İlerlemem',icon:'chart',to:'/progress'},{id:'services',label:'Hizmetler',icon:'briefcase',to:'/services'}] as {id:TabId;label:string;icon:IconName;to:string}[]).map(tab=><button key={tab.id} className={activeTab===tab.id?'active':''} aria-current={activeTab===tab.id?'page':undefined} onClick={()=>navigate(tab.to)}><Icon name={tab.icon} size={22}/><span>{tab.label}</span></button>)}
    </nav>
    <footer className="desktop-footer"><button className="footer-services" onClick={() => navigate('/services')}>Kurslar ve tercüme</button> <span>·</span> AYDA DİL AKADEMİSİ <span>·</span> ÖSD A1 Prüfungstraining <span>·</span> Demo 0.11 — 25.10.2026</footer>
  </div>
}

export default App
