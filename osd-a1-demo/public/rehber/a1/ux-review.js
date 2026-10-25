/* AYDA UX review layer: additive, A1/A2 shared. No live deployment. */
(() => {
  'use strict';
  if (typeof sections === 'undefined' || !document.querySelector('#chapters')) return;
  const level = /\/a2\/?/i.test(location.pathname) ? 'A2' : 'A1';
  const tasks = sections.flatMap(s => s.tasks);
  const known = new Set(tasks.map(t => t.id));
  const key = 'ayda-osd-' + level.toLowerCase() + '-learned-v1';
  let completed = new Set();
  let storageAvailable = true;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(saved)) completed = new Set(saved.filter(id => known.has(id)));
  } catch (err) { storageAvailable = false; }

  const make = (tag, cls, text) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const write = () => {
    try {
      localStorage.setItem(key, JSON.stringify([...completed]));
    } catch (err) {
      storageAvailable = false;
      const note = document.querySelector('#study-storage-note');
      if (note) note.textContent = 'Bu tarayıcı ilerlemeyi kalıcı kaydedemiyor. İşaretler sadece bu oturumda kalabilir.';
    }
  };

  const summary = make('aside','study-progress-summary');
  summary.innerHTML = '<div><span class="study-eyebrow">SENİN İLERLEMEN</span><strong class="study-total" aria-live="polite"></strong><small>Her görevi öğrenince işaretleyebilirsin.</small></div><div class="study-track" role="progressbar" aria-label="Öğrenilen görevler" aria-valuemin="0"><i></i></div><p id="study-storage-note">İlerlemen bu cihazın tarayıcısında saklanır; başka cihazlara aktarılmaz.</p>';
  const extras = document.querySelector('#home-extras');
  if (extras) extras.prepend(summary);

  const titleRow = (parent, label, node) => {
    const row = make('div','study-label-row');
    row.append(make('span','study-eyebrow',label),node);
    parent.append(row);
    return row;
  };
  const checkboxes = new Map();

  for (const section of sections) {
    for (let i = 0; i < section.tasks.length; i++) {
      const task = section.tasks[i];
      const article = document.getElementById(task.id);
      if (!article) continue;
      const paper = article.querySelector(':scope > .official-evidence');
      const introTitle = article.querySelector(':scope > h4');
      const introText = introTitle && introTitle.nextElementSibling;
      const nav = article.querySelector(':scope > .task-bottom');
      if (!paper || !introTitle || !introText || !nav) continue;

      const counter = make('div','study-task-counter');
      counter.innerHTML = '<span>ÖĞRENME REHBERİ</span><strong>Görev ' + (i+1) + ' / ' + section.tasks.length + '</strong>';
      article.querySelector('.title').after(counter);

      const workspace = make('div','study-workspace');
      const paperColumn = make('div','study-paper-column');
      const learnColumn = make('div','study-learning-column');
      paperColumn.append(paper);
      learnColumn.append(introTitle,introText);

      const quick = make('section','study-quick');
      titleRow(quick,'ÖNCE BUNU YAP',make('span','study-spark','★'));
      const ol = make('ol','study-quick-steps');
      (task.steps || []).slice(0,2).forEach(step => {
        const li = make('li');
        li.textContent = step.replace(/<[^>]*>/g,'').trim();
        ol.append(li);
      });
      quick.append(ol);
      learnColumn.append(quick);

      const detail = make('details','study-detail');
      const disclosure = make('summary','study-detail-summary','Örnekleri ve ayrıntılı sınav stratejilerini göster');
      detail.append(disclosure);
      const inner = make('div','study-detail-content');
      let item = paper.nextElementSibling;
      // Reparent all lesson material without changing the content or order.
      // After paper was moved, collect current article nodes between intro and nav.
      const children = [...article.children];
      const from = children.indexOf(nav);
      const reserved = new Set([article.querySelector('.task-top'),article.querySelector('.title'),counter,nav,workspace]);
      for (const element of children) {
        if (element === nav) break;
        if (reserved.has(element) || element === introTitle || element === introText || element === paper) continue;
        if (element.classList && element.classList.contains('ayda-resources')) continue;
        if (element.matches && element.matches('h4, p, ol, ul, .example, .think, .tip, .remember, div, blockquote, section, table, figure')) {
          inner.append(element);
        }
      }
      // Any remaining material before navigation belongs in the expandable details.
      for (const element of [...article.children]) {
        if (element === nav) break;
        if (reserved.has(element)) continue;
        inner.append(element);
      }
      detail.append(inner);
      learnColumn.append(detail);

      const done = make('label','study-done');
      const box = make('input');
      box.type = 'checkbox';
      box.checked = completed.has(task.id);
      box.setAttribute('aria-label',task.title + ' görevini öğrendim');
      done.append(box,make('span','','Bu görevi öğrendim'));
      checkboxes.set(task.id,box);
      box.addEventListener('change', () => {
        if (box.checked) completed.add(task.id);
        else completed.delete(task.id);
        write();
        paint();
      });
      learnColumn.append(done,nav);
      workspace.append(paperColumn,learnColumn);
      article.append(workspace);

      const paperHint = make('div','study-image-hint','Görsele dokun → büyüt, yakınlaştır ve kaydır');
      paper.querySelector('h5')?.after(paperHint);
      const scan = paper.querySelector('.official-preview');
      if (scan) scan.setAttribute('title','ÖSD örnek sınav sayfasını büyüt');
    }
  }

  const icon = '✓';
  function paint() {
    const total = tasks.length;
    const learned = completed.size;
    if (extras) {
      summary.querySelector('.study-total').textContent = learned + ' / ' + total + ' görev öğrenildi';
      const bar = summary.querySelector('.study-track');
      bar.setAttribute('aria-valuemax',String(total));
      bar.setAttribute('aria-valuenow',String(learned));
      bar.querySelector('i').style.width = (100*learned/total) + '%';
      if (!storageAvailable) summary.querySelector('#study-storage-note').textContent = 'İşaretler bu tarayıcıda kalıcı saklanamıyor.';
    }
    for (const section of sections) {
      const count = section.tasks.filter(t => completed.has(t.id)).length;
      const idx = sections.indexOf(section);
      const tile = document.querySelectorAll('.section-cards > a')[idx];
      if (tile) {
        let stat = tile.querySelector('.study-tile-count');
        if (!stat) { stat = make('span','study-tile-count');tile.querySelector('h2')?.after(stat); }
        stat.textContent = count + ' / ' + section.tasks.length + ' öğrenildi';
      }
      const head = document.querySelector('#' + section.id + ' .chapter-head');
      if (head) {
        let stat = head.querySelector('.study-chapter-progress');
        if (!stat) { stat = make('p','study-chapter-progress');head.querySelector('.task-links')?.before(stat); }
        stat.textContent = count + ' / ' + section.tasks.length + ' görevi öğrendin';
        head.querySelectorAll('.task-links a').forEach((a,i) => {
          const done = completed.has(section.tasks[i].id);
          a.classList.toggle('study-finished-link',done);
          const small = a.querySelector('small');
          if (small) small.textContent = done ? icon + ' Öğrenildi · Tekrar bak' : 'Görevi öğren →';
        });
      }
    }
    checkboxes.forEach((box,id) => {
      box.checked = completed.has(id);
      box.closest('.study-done')?.classList.toggle('is-complete',box.checked);
    });
  }
  paint();

  // Lightbox: fit the page on opening; provide explicit zoom controls on mobile and desktop.
  const modal = document.getElementById('zoom');
  const area = document.getElementById('zoom-content');
  if (modal && area) {
    const toolbar = make('div','study-zoom-toolbar');
    const less = make('button','study-zoom-button','−');
    const reset = make('button','study-zoom-button study-zoom-reset','Sayfaya sığdır');
    const more = make('button','study-zoom-button','+');
    [less,reset,more].forEach(b => b.type = 'button');
    less.setAttribute('aria-label','Uzaklaştır');
    more.setAttribute('aria-label','Yakınlaştır');
    toolbar.append(less,reset,more);
    area.before(toolbar);
    let imageWidth = 0;
    const naturalFit = () => Math.min(850,Math.max(260,window.innerWidth-72));
    const update = () => {
      const img = area.querySelector('.official-zoomed-image');
      if (!img) { toolbar.hidden = true; return; }
      toolbar.hidden = false;
      img.style.setProperty('width',imageWidth + 'px','important');
      img.style.setProperty('min-width',imageWidth + 'px','important');
      img.style.setProperty('max-width','none','important');
    };
    new MutationObserver(() => { imageWidth = naturalFit();update(); }).observe(area,{childList:true});
    more.addEventListener('click',() => { imageWidth = Math.min(2400,Math.round(imageWidth*1.4));update(); });
    less.addEventListener('click',() => { imageWidth = Math.max(260,Math.round(imageWidth/1.4));update(); });
    reset.addEventListener('click',() => { imageWidth = naturalFit();update();area.scrollTo({left:0,top:0}); });
    toolbar.hidden = true;
  }
})();