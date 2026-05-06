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


function renderSidebar(activeStepId, activePhase) {
  let nav = document.getElementById('pageSidebar');
  if (!nav) {
    document.body.insertAdjacentHTML('beforeend',
      '<nav class="bottom-nav" id="pageSidebar" aria-label="Žingsnių navigacija"></nav>');
    nav = document.getElementById('pageSidebar');
  }
  if (!nav) return;

  const activeIndex = STEP_NAV.findIndex(s => s.id === activeStepId);
  const maxVisited  = getMaxVisitedIndex();

  const items = [];
  STEP_NAV.forEach((step, stepIndex) => {
    const prev = STEP_NAV[stepIndex - 1];
    if (prev && prev.phase !== step.phase) {
      items.push('<span class="bnav-phase-arrow">›</span>');
    } else if (prev) {
      items.push('<span class="bnav-step-arrow">›</span>');
    }

    const isActive = step.id === activeStepId;
    const isDone   = activeIndex >= 0 && stepIndex < activeIndex;
    const isOpen   = stepIndex <= Math.max(activeIndex, maxVisited) || getAnswer(step.id) !== null || activePhase === 'summary';
    const cls = ['bnav-pill', isActive ? 'active' : isDone ? 'done' : '', isOpen && !isActive ? 'open' : !isOpen ? 'locked' : ''].filter(Boolean).join(' ');

    items.push(isOpen && !isActive
      ? `<a class="${cls}" href="#${step.id}">${escHtml(step.label)}</a>`
      : `<span class="${cls}">${escHtml(step.label)}</span>`);
  });

  nav.innerHTML = `<div class="bnav-inner">${items.join('')}</div>`;
}

function removeSidebar() {
  const nav = document.getElementById('pageSidebar');
  if (nav) nav.remove();
}
