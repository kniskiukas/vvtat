'use strict';

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function fileIcon(name) {
  const ext = (name || '').split('.').pop().toLowerCase();
  if (['jpg','jpeg','png','gif','webp','heic','avif'].includes(ext)) return '🖼️';
  if (ext === 'pdf') return '📕';
  if (['doc','docx'].includes(ext)) return '📄';
  return '📎';
}

function fmtSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function renderHeader(activePhase) {
  const header = document.getElementById('appHeader');
  if (!header) return;

  const phaseOrder = ['eligibility', 'category', 'documents', 'summary'];
  const activeIdx  = phaseOrder.indexOf(activePhase);

  const navHTML = PHASES.map((p, i) => {
    const isDone   = i < activeIdx;
    const isActive = p.id === activePhase;
    const isOpen   = isDone || isActive;
    const cls = [isDone ? 'done' : '', isActive ? 'active' : '', isOpen ? 'open' : 'locked'].filter(Boolean).join(' ');
    const dot = isDone ? '✓' : p.num;
    const arrow = i < PHASES.length - 1 ? '<span class="phase-arrow">›</span>' : '';
    return isOpen
      ? `<a class="phase-step ${cls}" href="#${PHASE_FIRST_STEP[p.id]}">
           <span class="phase-step-inner"><span class="phase-dot">${dot}</span><span>${p.label}</span></span>${arrow}
         </a>`
      : `<span class="phase-step ${cls}" aria-disabled="true">
           <span class="phase-step-inner"><span class="phase-dot">${dot}</span><span>${p.label}</span></span>${arrow}
         </span>`;
  }).join('');

  header.innerHTML = `
    <div class="header-inner">
      <a href="#s0" class="header-brand">
        <div class="brand-logo">VVTAT</div>
        <div class="brand-text">
          <span class="brand-name">Vartotojų teisių apsauga</span>
          <span class="brand-sub">Prašymų teikimo vedlys</span>
        </div>
      </a>
      <nav class="phase-nav">${navHTML}</nav>
    </div>`;
}

function renderHero(phase) {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const h = PHASE_HERO[phase] || PHASE_HERO.end;
  hero.style.background = PHASE_GRAD[phase] || PHASE_GRAD.end;
  hero.innerHTML = `
    <div class="hero-inner">
      <div class="hero-icon">${h.icon}</div>
      <h1 class="hero-title">${h.title}</h1>
      <p class="hero-sub">${h.sub}</p>
    </div>`;
}

function renderSidebar(activeStepId, activePhase) {
  const main = document.querySelector('.main-content');
  if (!main) return;

  let sidebar = document.getElementById('pageSidebar');
  if (!sidebar) {
    main.insertAdjacentHTML('afterbegin', '<aside class="page-sidebar" id="pageSidebar" aria-label="Greita navigacija"></aside>');
    sidebar = document.getElementById('pageSidebar');
  }
  if (!sidebar) return;

  main.classList.add('with-sidebar');
  const activeIndex = STEP_NAV.findIndex(s => s.id === activeStepId);

  const sections = PHASES.map(phase => {
    const items = STEP_NAV.filter(s => s.phase === phase.id).map(step => {
      const stepIndex = STEP_NAV.findIndex(s => s.id === step.id);
      const isActive  = step.id === activeStepId;
      const isDone    = activeIndex >= 0 && stepIndex < activeIndex;
      const isOpen    = getAnswer(step.id) !== null || stepIndex <= activeIndex || activePhase === 'summary';
      const cls = ['sidebar-step', isActive ? 'active' : '', isDone ? 'done' : '', isOpen ? 'open' : 'locked'].filter(Boolean).join(' ');
      const answer = getAnswer(step.id);
      const preview = answer ? escHtml(ANSWER_LABELS[answer] || answer) : 'Nėra pasirinkimo';

      return isOpen
        ? `<a class="${cls}" href="#${step.id}">
             <span class="sidebar-step-dot">${isDone ? '✓' : stepIndex + 1}</span>
             <span class="sidebar-step-text">
               <span class="sidebar-step-label">${escHtml(step.label)}</span>
               <span class="sidebar-step-preview">${preview}</span>
             </span>
           </a>`
        : `<span class="${cls}" aria-disabled="true">
             <span class="sidebar-step-dot">${stepIndex + 1}</span>
             <span class="sidebar-step-text">
               <span class="sidebar-step-label">${escHtml(step.label)}</span>
               <span class="sidebar-step-preview">${preview}</span>
             </span>
           </span>`;
    }).join('');

    return `
      <section class="sidebar-group">
        <div class="sidebar-group-title">${phase.label}</div>
        <div class="sidebar-group-items">${items}</div>
      </section>`;
  }).join('');

  sidebar.innerHTML = `
    <div class="sidebar-card">
      <div class="sidebar-title">Greita navigacija</div>
      <p class="sidebar-copy">Grįžkite į ankstesnį žingsnį arba peršokite į jau užpildytas dalis.</p>
      <div class="sidebar-groups">${sections}</div>
    </div>`;
}

function removeSidebar() {
  const main = document.querySelector('.main-content');
  if (main) main.classList.remove('with-sidebar');
  const sidebar = document.getElementById('pageSidebar');
  if (sidebar) sidebar.remove();
}
