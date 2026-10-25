/* Official ZA1 model pages, exact PDF the academy previously supplied (16 pages). */
const officialA1Pdf="https://www.osd.at/wp-content/uploads/2024/04/za1_ms_hp_2024-04-10.pdf";
const officialA1Pages={
'lesen-1':{lead:'Önce durumları, sonra altı gerçek ilanı gör.',scans:[['za1-page-02.jpg',2,'Beş durum ve işaretleme alanları'],['za1-page-03.jpg',3,'Altı ilan ve ilân numaraları']]},
'lesen-2':{lead:'JA/NEIN sorularının gerçek kâğıtta nasıl düzenlendiğini gör.',scans:[['za1-page-04.jpg',4,'Üç ilan ve altı JA/NEIN sorusu']]},
'lesen-3':{lead:'Metinlerin ve resimlerin ayrı sayfalarda yer aldığını gör.',scans:[['za1-page-05.jpg',5,'Beş kısa metin'],['za1-page-06.jpg',6,'Eşleştirilecek altı resim']]},
'horen-1':{lead:'Dinlediğin beş kaydı altı fotoğrafla nasıl eşleştireceğini gör.',scans:[['za1-page-07.jpg',7,'Altı fotoğraf ve cevap alanları']]},
'horen-2':{lead:'Ses kaydındaki saat, gün, yer ve telefonu yazacağın gerçek formu gör.',scans:[['za1-hoeren-2.jpg',8,'Hören 2: mesajdan not alma formu']]},
'horen-3':{lead:'Beş konuşmacıyı izleyip hangi kutuları işaretleyeceğini gör.',scans:[['za1-hoeren-3.jpg',8,'Hören 3: konuşmacı eşleştirme tablosu']]},
'schreiben-1':{lead:'Formdaki boşlukların ve işaret kutularının yerini öğren.',scans:[['za1-page-09.jpg',9,'Form doldurma görevi ve gerçek cevap alanları']]},
'schreiben-2':{lead:'Gelen e-postayı ve tam olarak hangi üç sorunun yanıtlanacağını gör.',scans:[['za1-page-10.jpg',10,'E-posta yönergesi ve yanıt alanı']]},
'sprechen-1':{lead:'Altı konunun bulunduğu resmî kartı gör; dört konu seçeceksin.',scans:[['za1-page-11.jpg',11,'Dört konu seçerek kendini tanıtma']]},
'sprechen-2':{lead:'Üç resmin bulunduğu gerçek konuşma sayfasını gör.',scans:[['za1-page-12.jpg',12,'Sözlü 2: fotoğrafı anlatma']]},
'sprechen-3':{lead:'Sözlü 3 için aynı fotoğraftaki ortamı rol oyununa dönüştürdüğün yönergeyi gör.',scans:[['za1-page-12.jpg',12,'Sözlü 3: rol yapma ve gerçek yönerge']]}
};
function officialA1Card(taskId){
 const e=officialA1Pages[taskId];if(!e)return '';
 const isMultiPage=e.scans.length>1;
 // For Lesen 1 and 3, a second exam sheet carries the choices.
 const titles=taskId==='lesen-1'?['1. Sorular','2. İlanlar']:['1. Metinler','2. Resimler'];
 const img=([name,page,label],i)=>`<figure class="official-scan" data-official-figure="${i}" ${i?'hidden':''}><button type="button" class="official-preview zoomable" aria-label="${label}, büyütmek için dokun"><img loading="lazy" decoding="async" src="https://osd.aydadil.com/a1/assets/model/${name}" alt="ÖSD ZA1 resmî model, PDF sayfa ${page}: ${label}" width="1200" height="1700"></button><figcaption>${label} · ÖSD model sınavı sayfa ${page}</figcaption><a href="${officialA1Pdf}#page=${page}" target="_blank" rel="noopener noreferrer">Resmî PDF’de aç ↗</a></figure>`;
 const selector=isMultiPage?`<div class="official-page-selector" aria-label="Bu görevin sınav sayfaları">${e.scans.map(([name,page],i)=>`<button type="button" class="official-page-tab${i===0?' is-active':''}" data-official-page="${i}" aria-pressed="${i===0?'true':'false'}"><span class="official-page-step">${i+1}</span><span class="official-page-label">${titles[i]}<small>PDF sayfa ${page}</small></span></button>`).join('')}</div><p class="official-pages-note">Bu görev <strong>2 sayfadan</strong> oluşuyor. Soruları ve seçenekleri birlikte görmeden geçme.</p>`:'';
 return `<section class="official-evidence" data-official-task="${taskId}"><span class="official-kicker">ÖSD RESMÎ ÖRNEK SINAV</span><h5>${isMultiPage?'Bu görevin iki sınav sayfasını gör':'Gerçek sınav sayfasını gör'}</h5><p>${e.lead}</p>${selector}<div class="official-page-stage">${e.scans.map(img).join('')}</div>${isMultiPage?'<p class="official-page-live" aria-live="polite">1 / 2: Sorular ve yönergeler</p>':''}<p class="official-disclaimer">Bu görüntü ÖSD tarafından yayımlanan ZA1 model sınavından alınmıştır. Gerçek sınavda aynı soruların çıkacağı anlamına gelmez.</p></section>`;
}
const allTasks=sections.flatMap(s=>s.tasks);
const heading=(n,title)=>`<h4><span class="n">${n}</span>${title}</h4>`;
document.querySelector('#chapters').innerHTML=sections.map((s,si)=>`<section id="${s.id}" class="chapter"><div class="chapter-head"><div class="eyebrow">BÖLÜM 0${si+1}</div><h2>${s.name}<span>${s.tr}</span></h2><span class="badge">${s.time}</span><span class="badge">${s.tasks.length} görev</span><p>${s.intro}</p><nav class="task-links" aria-label="${s.name} görevleri">${s.tasks.map((t,i)=>`<a href="#${t.id}">Görev ${i+1} · ${t.title}</a>`).join('')}</nav></div>${s.tasks.map((t,i)=>{const next=allTasks[allTasks.indexOf(t)+1];return `<article class="task" id="${t.id}"><div class="task-top">${s.name} · AUFGABE ${i+1}</div><h3 class="title">${t.title}</h3>${heading(1,'Bu bölümde ne yapacağım?')}<p>${t.what}</p>${officialA1Card(t.id)}${heading(2,'Karşıma nasıl bir soru gelecek?')}<div class="example"><div class="example-label">Açıklamalı öğretici örnek · sınav sorusu değildir</div>${t.example}</div>${heading(3,'Adım adım nasıl yapacağım?')}<ol>${t.steps.map(x=>`<li>${x}</li>`).join('')}</ol>${heading(4,'Doğru düşünme yöntemi')}<p class="muted">Öğrencinin zihninden geçen düşünce</p><p class="thought">${t.think}</p>${heading(5,'Öğretmenin tavsiyesi')}<p class="tip">${t.tip}</p>${heading(6,'En sık yapılan hatalar')}<div class="two mistakes"><div><strong>KAÇIN</strong>${t.wrong}</div><div><strong>BUNU YAP</strong>${t.right}</div></div>${heading(7,'Aklında sadece bunu tut')}<p class="remember">${t.remember}</p><a class="next" href="#${next?next.id:'sozlu-video'}">${next?'Sonraki görev: '+next.title:'Sözlü sınav videosuna geç'} →</a></article>`}).join('')}${s.id==='sprechen'?`<section class="end-section" id="sozlu-video"><div class="eyebrow">İZLEYEREK TANI</div><h2>Sözlü Sınav Nasıl Geçiyor? Gerçek Bir Örnek İzle</h2><div class="video-box" id="video-box"><button type="button" id="load-video">▷ Videoyu yükle</button></div><p class="muted">Video yalnızca düğmeye bastığında YouTube’dan yüklenir; otomatik oynatılmaz.</p><a href="https://youtu.be/-m-S4tomdzY" target="_blank" rel="noopener">YouTube’da Aç ↗</a><h3>Videoyu izlerken nelere dikkat etmeliyim?</h3><ul><li>Aday nasıl konuşmaya başlıyor?</li><li>Tek kelime mi, cümleler mi kullanıyor?</li><li>Sınav görevlisi nasıl iletişim kuruyor?</li><li>Fotoğraf anlatımında nasıl ilerleniyor?</li><li>Diyalog karşılıklı nasıl sürdürülüyor?</li></ul><p class="muted">Videonun konuşma dökümü doğrulanamadığı için adaya atfedilen sözler veya zaman damgaları kullanılmadı. Yukarıdaki cümleler bağımsız öğretici örneklerdir.</p><a href="#sinav-gunu">Sınav günü rehberine geç →</a></section>`:''}</section>`).join('');
// Navigate both official sheets without hiding the second one in a disclosure.
document.querySelector('#chapters').addEventListener('click',event=>{
 const button=event.target.closest('.official-page-tab');
 if(!button)return;
 const card=button.closest('.official-evidence');
 if(!card)return;
 const page=Number(button.dataset.officialPage);
 const figures=[...card.querySelectorAll('.official-page-stage > .official-scan')];
 if(!Number.isInteger(page)||page<0||page>=figures.length)return;
 figures.forEach((figure,index)=>{figure.hidden=index!==page;});
 card.querySelectorAll('.official-page-tab').forEach((tab,index)=>{
  const current=index===page;
  tab.classList.toggle('is-active',current);
  tab.setAttribute('aria-pressed',String(current));
 });
 const status=card.querySelector('.official-page-live');
 if(status)status.textContent=(page+1)+' / '+figures.length+': '+card.querySelectorAll('.official-page-tab .official-page-label')[page].firstChild.textContent.trim();
});
const key='osd-za1-guide-v1';let state={checks:[],last:null},storageOK=true;
try{const data=JSON.parse(localStorage.getItem(key)||'null');if(data&&typeof data==='object'){state.checks=Array.isArray(data.checks)?data.checks.filter(n=>Number.isInteger(n)&&n>=0&&n<checklist.length):[];state.last=allTasks.some(t=>t.id===data.last)?data.last:null;}}catch{storageOK=false;}
function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch{storageOK=false;document.querySelector('#storage-note').textContent='Tarayıcı kalıcı kayda izin vermiyor. Seçimlerin bu sayfa açık kaldığı sürece korunur.';}}
if(!storageOK)document.querySelector('#storage-note').textContent='Tarayıcı kaydı kullanılamıyor. Seçimlerin yalnızca bu sayfa açıkken korunur.';
const checks=document.querySelector('#checks');checks.innerHTML=checklist.map(([text,anchor],i)=>`<div><label><input type="checkbox" value="${i}" ${state.checks.includes(i)?'checked':''}><span>${text} <a href="#${anchor}" aria-label="İlgili konuyu tekrar oku: ${text}">Tekrar oku</a></span></label></div>`).join('');
function status(){document.querySelector('#check-status').textContent=`${state.checks.length} / ${checklist.length} maddeyi işaretledin.`;}status();
checks.addEventListener('change',()=>{state.checks=[...checks.querySelectorAll(':checked')].map(x=>Number(x.value));save();status();});
document.querySelector('#reset').addEventListener('click',()=>{state.checks=[];checks.querySelectorAll('input').forEach(x=>x.checked=false);save();status();});
if(state.last){const r=document.querySelector('#resume');r.hidden=false;r.href='#'+state.last;}
let timer;function toast(text){const t=document.querySelector('#toast');t.textContent=text;t.style.display='block';clearTimeout(timer);timer=setTimeout(()=>t.style.display='none',2600);}
async function copy(text){try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);}else{const a=document.createElement('textarea');a.value=text;a.style.position='fixed';a.style.opacity='0';document.body.append(a);a.select();const ok=document.execCommand('copy');a.remove();if(!ok)throw Error();}toast('Almanca cümle kopyalandı.');}catch{toast('Kopyalanamadı. Cümleyi seçip elle kopyalayabilirsin.');}}
const modal=document.querySelector('#zoom');let zoomTrigger;
document.addEventListener('click',e=>{const c=e.target.closest('.copy');if(c)copy(c.parentElement.querySelector('[lang=de]').innerText);const z=e.target.closest('.zoomable');if(z){zoomTrigger=z;const photo=z.querySelector('img');document.querySelector('#zoom-content').innerHTML=z.classList.contains('official-preview')&&photo?'<img class="official-zoomed-image" src="'+photo.src+'" alt="'+photo.alt.replaceAll('"','&quot;')+'">':z.innerHTML;modal.showModal();}});
document.querySelector('#close-zoom').addEventListener('click',()=>modal.close());modal.addEventListener('close',()=>zoomTrigger?.focus());modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close();}});
document.querySelector('#load-video').addEventListener('click',()=>{document.querySelector('#video-box').innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/-m-S4tomdzY?autoplay=0" title="ÖSD Zertifikat A1 örnek sözlü sınav videosu" allow="encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';});
const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){state.last=e.target.id;save();const section=e.target.closest('.chapter').id;document.querySelectorAll('header nav a').forEach(a=>{const active=a.hash==='#'+section;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}},{rootMargin:'-15% 0px -65% 0px',threshold:0});document.querySelectorAll('.task').forEach(t=>observer.observe(t));
let ticking=false;function progress(){const total=document.documentElement.scrollHeight-innerHeight;document.querySelector('#progress').style.width=(total>0?Math.min(100,scrollY/total*100):0)+'%';ticking=false;}addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(progress);ticking=true;}},{passive:true});addEventListener('resize',progress);progress();
// Basit sayfa yönlendirmesi: aynı anda tek görev. İçerik eksiltilmez.
observer.disconnect();
document.querySelector('.hero').id='ana-sayfa';
document.querySelector('header .brand').href='#ana-sayfa';
const navLabels=['Okuma','Dinleme','Yazma','Konuşma'];
document.querySelectorAll('header nav a').forEach((a,i)=>a.textContent=navLabels[i]);
document.querySelector('footer>a[href="#"]').href='#ana-sayfa';
const quick=document.createElement('section');quick.id='home-extras';quick.innerHTML='<h2>Başka neye bakmak istersin?</h2><div class="quick-links"><a href="#baslangic">İlk kez giriyorum →</a><a href="#sozlu-video">Sözlü sınav videosu →</a><a href="#sinav-gunu">Sınav günü →</a><a href="#puanlama">Puanlama →</a><a href="#kontrol">Hazır mıyım? →</a><a href="#kaynaklar">Kaynaklar →</a></div>';
document.querySelector('.hero').after(quick);
document.querySelector('footer').id='kaynaklar';
document.querySelector('.orientation').id='cevaplar';
document.querySelectorAll('.chapter-head').forEach((head,i)=>{const s=sections[i];head.querySelector('h2').innerHTML=`${s.tr.toLocaleUpperCase('tr-TR')}<span>${s.name}</span>`;head.querySelector('.task-links').setAttribute('aria-label',s.tr+' görev seçimi');head.querySelectorAll('.task-links a').forEach((a,j)=>a.innerHTML=`<span class="pick-number">${j+1}</span><span><strong>${s.tasks[j].title}</strong><small>Görevi öğren →</small></span>`);});
allTasks.forEach((t,i)=>{const article=document.getElementById(t.id);const section=sections.find(s=>s.tasks.includes(t));const local=section.tasks.indexOf(t);const top=article.querySelector('.task-top');top.textContent=`${section.tr.toLocaleUpperCase('tr-TR')} · GÖREV ${local+1} / ${section.tasks.length}`;const steps=article.querySelectorAll('h4');const simple=['NE YAPACAĞIM?','ÖRNEĞE BAK','BÖYLE YAP','NASIL DÜŞÜNMELİYİM?','ÖĞRETMENİN TAVSİYESİ','BU HATAYA DÜŞME','BUNU HATIRLA'];steps.forEach((h,j)=>h.innerHTML=`<span class="n">${j+1}</span>${simple[j]}`);const old=article.querySelector('.next');const next=section.tasks[local+1];old.outerHTML=`<div class="task-bottom"><a class="back-button" href="#${local?section.tasks[local-1].id:section.id}">← ${local?'Önceki görev':'Görev listesi'}</a><a class="button" href="#${next?next.id:(sections[sections.indexOf(section)+1]?.id||'sozlu-video')}">${next?'Sonraki görev':'Bölüm bitti · Devam et'} →</a></div>`;});
speaking.forEach(t=>document.querySelector('#'+t.id+' .task-bottom').insertAdjacentHTML('beforebegin',aydaResources));
quick.insertAdjacentHTML('beforeend',aydaResources);
document.querySelector('footer').insertAdjacentHTML('beforeend','<h3>AYDA tekrar kaynakları</h3><p><a href="https://www.aydadil.com/a1ayda/" target="_blank" rel="noopener">A1 tekrar</a> · <a href="https://www.aydadil.com/a2ayda/" target="_blank" rel="noopener">A2 tekrar</a> · <a href="https://www.aydadil.com/b1ayda/" target="_blank" rel="noopener">B1 tekrar</a></p><p class="muted">A2 ve B1 bağlantıları daha sonraki seviyeler içindir; bu rehber yalnızca ZA1 sınavını anlatır.</p>');
const trail=document.querySelector('#page-trail');
function route(){
 let id=decodeURIComponent(location.hash.slice(1))||'ana-sayfa';if(id==='main')id='ana-sayfa';
 const task=allTasks.find(t=>t.id===id);const section=sections.find(s=>s.id===id||s.tasks.some(t=>t.id===id));
 const valid=task||section||['ana-sayfa','baslangic','cevaplar','sozlu-video','sinav-gunu','puanlama','kontrol','kaynaklar'].includes(id);if(!valid)id='ana-sayfa';
 document.querySelectorAll('main>.hero,main>#home-extras,main>.welcome,main>.orientation,main>.end-section,main>.score,main>footer').forEach(el=>el.hidden=true);
 document.querySelectorAll('.chapter').forEach(el=>el.hidden=true);
 document.querySelectorAll('.task,.chapter-head,#sozlu-video').forEach(el=>el.hidden=true);
 document.querySelector('#chapters').hidden=!(section||id==='sozlu-video');
 trail.hidden=id==='ana-sayfa';trail.innerHTML=`<a href="#ana-sayfa">← Ana sayfa</a>${section?`<span>/</span><a href="#${section.id}">${section.tr}</a>`:''}${task?`<span>/</span><strong>Görev ${section.tasks.indexOf(task)+1}</strong>`:''}`;
 if(id==='ana-sayfa'){document.querySelector('.hero').hidden=false;quick.hidden=false;const r=document.querySelector('#resume');if(state.last){r.hidden=false;r.href='#'+state.last;quick.prepend(r);}}
 else if(section){document.getElementById(section.id).hidden=false;if(task){document.getElementById(task.id).hidden=false;state.last=task.id;save();}else document.querySelector('#'+section.id+' .chapter-head').hidden=false;}
 else if(id==='sozlu-video'){document.querySelector('#sprechen').hidden=false;document.getElementById(id).hidden=false;}
 else{const el=document.getElementById(id);el.hidden=false;if(el.tagName==='DETAILS')el.open=true;if(id==='baslangic')document.querySelector('.orientation').hidden=false;}
 document.querySelectorAll('header nav a').forEach(a=>{const active=section&&a.hash==='#'+section.id;a.classList.toggle('active',!!active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 document.title=(task?task.title:section?section.tr:id==='ana-sayfa'?'ÖSD A1 Sınav Rehberi':'ÖSD A1 Rehberi')+' · Adım adım';
 scrollTo({top:0,behavior:'instant'});progress();const title=task?document.querySelector('#'+task.id+' .title'):section?document.querySelector('#'+section.id+' h2'):document.querySelector('#'+id+' h2');if(title){title.tabIndex=-1;title.focus({preventScroll:true});}
}
addEventListener('hashchange',route);route();
