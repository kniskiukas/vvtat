'use strict';

// ── Constants ──────────────────────────────────────────────────────────────
const KEY_ANSWERS = 'vvtat_answers_v1';
const KEY_FILES   = 'vvtat_files_v1';
const MAX_MB      = 20;
const KEY_INTERNAL_NAV = 'vvtat_internal_nav_v1';

let hasResetThisPageLoad = false;

// ── Phase hero content ─────────────────────────────────────────────────────
const PHASE_HERO = {
  eligibility: {
    icon: '🔍',
    title: 'Tinkamumo tikrinimas',
    sub:   'Pirmiausia nustatysime, ar VVTAT gali jums padėti ir ar esate tinkamoje vietoje.',
  },
  category: {
    icon: '📋',
    title: 'Ginčo kategorija',
    sub:   'Tiksliau apibūdinkite ginčą, kad galėtume suformuoti tinkamą prašymą.',
  },
  documents: {
    icon: '📂',
    title: 'Dokumentų rinkimas',
    sub:   'Surinkite reikiamus dokumentus — jie sustiprins jūsų prašymą.',
  },
  summary: {
    icon: '✅',
    title: 'Prašymo santrauka',
    sub:   'Peržiūrėkite surinktą informaciją ir pereikite prie pateikimo.',
  },
  end: {
    icon: '↗️',
    title: 'Nukreipiame jus',
    sub:   'Jūsų situaciją nagrinėja kita institucija — žemiau rasite nuorodą.',
  },
};

const PHASES = [
  { id: 'eligibility', label: 'Tikrinimas', num: 1 },
  { id: 'category',    label: 'Kategorija', num: 2 },
  { id: 'documents',   label: 'Dokumentai', num: 3 },
  { id: 'summary',     label: 'Santrauka',  num: 4 },
];

const PHASE_ENTRY = {
  eligibility: 'index.html',
  category:    's4-category.html',
  documents:   'q2-01-adoc.html',
  summary:     'summary.html',
};

const STEP_NAV = [
  { id: 's0',             label: 'Jūs esate?',           phase: 'eligibility', url: 'index.html' },
  { id: 's1',             label: 'Kategorija',           phase: 'eligibility', url: 's1.html' },
  { id: 's2',             label: 'Paslaugos teikėjas',   phase: 'eligibility', url: 's2.html' },
  { id: 's3_price',       label: 'Kaina',                phase: 'eligibility', url: 's3-price.html' },
  { id: 's4_subcategory', label: 'Ginčo pobūdis',        phase: 'category',    url: 's4-category.html' },
  { id: 's5_14days',      label: '14 dienų kreipimasis', phase: 'category',    url: 's5-14days.html' },
  { id: 'q2_01_adoc',     label: 'ADoc galimybė',        phase: 'documents',   url: 'q2-01-adoc.html' },
  { id: 'q2_02_response', label: 'Pardavėjo atsakymas',  phase: 'documents',   url: 'q2-02-response.html' },
  { id: 'q2_03_purchase', label: 'Pirkimo dokumentas',   phase: 'documents',   url: 'q2-03-purchase.html' },
  { id: 'q2_04_problem',  label: 'Trūkumai / problemos', phase: 'documents',   url: 'q2-04-problem.html' },
  { id: 'q2_06_damages',  label: 'Papildomi nuostoliai', phase: 'documents',   url: 'q2-06-damages.html' },
  { id: 'summary',         label: 'Santrauka',           phase: 'summary',     url: 'summary.html' },
];

const STEP_UPLOAD_KEYS = {
  q2_02_response: ['atsakymas', 'kreipimasis'],
  q2_03_purchase: ['pirkimas'],
  q2_04_problem:  ['problema'],
  q2_06_damages:  ['zala'],
};

const PHASE_FIRST_STEP = {
  eligibility: 's0',
  category: 's4_subcategory',
  documents: 'q2_01_adoc',
  summary: 'summary',
};

const PHASE_GRAD = {
  eligibility: 'linear-gradient(130deg,#1e3a8a 0%,#2563eb 100%)',
  category:    'linear-gradient(130deg,#0369a1 0%,#2563eb 100%)',
  documents:   'linear-gradient(130deg,#0e7490 0%,#2563eb 100%)',
  summary:     'linear-gradient(130deg,#4338ca 0%,#6d28d9 100%)',
  end:         'linear-gradient(130deg,#1e3a8a 0%,#0369a1 100%)',
};

const ANSWER_LABELS = {
  fizinis:          'Fizinis asmuo',
  juridinis:        'Juridinis asmuo',
  rysiai:           'Elektroniniai ryšiai / paštas',
  finansai:         'Finansinės paslaugos',
  vartojimas:       'Vartojimo prekės / paslaugos',
  energetika:       'Energetika / komunalinės paslaugos',
  teisines:         'Teisinės paslaugos',
  maistas:          'Maistas / veterinarija',
  lt_verslas:       'Lietuva',
  eu_verslas:       'ES / Norvegija / Islandija',
  fiz_pardav:       'Privatus pardavėjas',
  kaina_taip:       'Taip (> 20 €)',
  kaina_ne:         'Ne (≤ 20 €)',
  laisvalaikis:     'Laisvalaikis / turizmas / transportas',
  preke:            'Nekokybiškas produktas',
  valymas:          'Valymo paslaugos',
  statyba:          'Statybos paslaugos',
  grozis:           'Grožis / sveikatos priežiūra',
  reklama:          'Reklamos paslaugos',
  medicina:         'Medicinos prekės',
  kita:             'Kita',
  '14d_taip':       'Taip – kreipiausi, praėjo 14 d.',
  '14d_ne':         'Ne',
  adoc_taip:        'Taip – turiu el. parašą',
  adoc_mob:         'Galiu (kompiuteriu)',
  adoc_nezinau:     'Sužinojau, tęsiu',
  adoc_ne:          'Ne – neturiu el. parašo',
  resp_rastas:      'Taip – turiu atsakymą raštu',
  resp_kreipimasis: 'Kreipiausi, bet neatsakė',
  resp_zodziai:     'Tik žodžiu / telefonu',
  resp_niekas:      'Neturiu dokumentų',
  purch_sutartis:   'Sutartis / patvirtinimas',
  purch_kvitas:     'Sąskaita / kvitas',
  purch_bankas:     'Banko mokėjimo įrodymas',
  purch_nieko:      'Nieko neturiu',
  prob_nekokybiska: 'Nekokybiška prekė',
  prob_paslauga:    'Nekokybiškas paslaugos atlikimas',
  prob_pristatymas: 'Nepristatyta / vėluoja',
  prob_pinigai:     'Negrąžina pinigų',
  prob_kita:        'Kita',
  dmg_taip:         'Taip – patyriau nuostolių',
  dmg_ne:           'Ne',
  dmg_nezinau:      'Nežinau',
};

// ── Answer storage ─────────────────────────────────────────────────────────
function getAnswer(stepId) {
  try {
    return (JSON.parse(localStorage.getItem(KEY_ANSWERS) || '{}'))[stepId] || null;
  } catch { return null; }
}

function setAnswer(stepId, value) {
  try {
    const all = JSON.parse(localStorage.getItem(KEY_ANSWERS) || '{}');
    all[stepId] = value;
    localStorage.setItem(KEY_ANSWERS, JSON.stringify(all));
  } catch {}
}

function getAllAnswers() {
  try { return JSON.parse(localStorage.getItem(KEY_ANSWERS) || '{}'); } catch { return {}; }
}

function clearAll() {
  try {
    localStorage.removeItem(KEY_ANSWERS);
    localStorage.removeItem(KEY_FILES);
    localStorage.removeItem(KEY_INTERNAL_NAV);
    sessionStorage.removeItem(KEY_INTERNAL_NAV);
    sessionStorage.clear();
    hasResetThisPageLoad = false;
  } catch {}
}

function markInternalNavigation() {
  // Intentionally left as a hook for compatibility with existing calls.
}

function clearUploadKeys(keys) {
  if (!keys.length) return;

  try {
    const store = JSON.parse(localStorage.getItem(KEY_FILES) || '{}');
    let changed = false;

    for (const key of keys) {
      if (store[key]) {
        delete store[key];
        changed = true;
      }
    }

    if (changed) {
      if (Object.keys(store).length) localStorage.setItem(KEY_FILES, JSON.stringify(store));
      else localStorage.removeItem(KEY_FILES);
      refreshFileList(keys[0]);
    }
  } catch {}
}

function clearUploadsAfterStep(stepId) {
  const targetIndex = getStepIndex(stepId);
  if (targetIndex < 0) return;

  const keys = STEP_NAV.slice(targetIndex + 1)
    .flatMap(step => STEP_UPLOAD_KEYS[step.id] || []);

  clearUploadKeys([...new Set(keys)]);
}

function resetIfDirectOpen() {
  if (hasResetThisPageLoad) return;
  hasResetThisPageLoad = true;

  try {
    const url = new URL(window.location.href);
    const isInternalNav = url.searchParams.get('_nav') === '1';

    if (isInternalNav) {
      // Consume _nav marker so reload behaves like a normal direct open.
      url.searchParams.delete('_nav');
      const search = url.searchParams.toString();
      const cleanUrl = `${url.pathname}${search ? `?${search}` : ''}${url.hash || ''}`;
      window.history.replaceState({}, '', cleanUrl);
    } else {
      clearAll();
    }
  } catch {}
}

// ── File storage ───────────────────────────────────────────────────────────
function getFiles(key) {
  try {
    return (JSON.parse(localStorage.getItem(KEY_FILES) || '{}'))[key] || [];
  } catch { return []; }
}

function _persistFileStore(store) {
  try {
    localStorage.setItem(KEY_FILES, JSON.stringify(store));
  } catch {
    // Quota exceeded — store metadata only (no dataUrl)
    try {
      const slim = {};
      for (const [k, arr] of Object.entries(store))
        slim[k] = arr.map(({ name, size, type }) => ({ name, size, type }));
      localStorage.setItem(KEY_FILES, JSON.stringify(slim));
    } catch {}
  }
}

function addFiles(key, files) {
  const maxBytes = MAX_MB * 1024 * 1024;
  let store;
  try { store = JSON.parse(localStorage.getItem(KEY_FILES) || '{}'); } catch { store = {}; }
  if (!store[key]) store[key] = [];

  for (const file of files) {
    if (file.size > maxBytes) {
      alert(`Failas „${file.name}" viršija ${MAX_MB} MB limitą.`);
      continue;
    }
    const entry = { name: file.name, size: file.size, type: file.type };
    store[key].push(entry);
    const idx = store[key].length - 1;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const s = JSON.parse(localStorage.getItem(KEY_FILES) || '{}');
        if (s[key]?.[idx]) {
          s[key][idx].dataUrl = e.target.result;
          _persistFileStore(s);
        }
      } catch {}
    };
    reader.readAsDataURL(file);
  }

  _persistFileStore(store);
  refreshFileList(key);
}

function removeFile(key, idx) {
  try {
    const store = JSON.parse(localStorage.getItem(KEY_FILES) || '{}');
    if (store[key]) store[key].splice(idx, 1);
    _persistFileStore(store);
    refreshFileList(key);
  } catch {}
}

// ── UI helpers ─────────────────────────────────────────────────────────────
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

function refreshFileList(key) {
  const list = document.getElementById('fileList');
  if (!list) return;
  const files = getFiles(key);
  list.innerHTML = files.map((f, i) => `
    <div class="file-item">
      <span class="file-icon">${fileIcon(f.name)}</span>
      <span class="file-name">${escHtml(f.name)}</span>
      <span class="file-size">${fmtSize(f.size)}</span>
      <button class="file-remove" onclick="removeFile('${key}',${i})" title="Pašalinti">✕</button>
    </div>`).join('');
  updateNextButtonState();
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function formatAnswerValue(value) {
  return ANSWER_LABELS[value] || value || '';
}

function getStepIndex(stepId) {
  return STEP_NAV.findIndex(step => step.id === stepId);
}

function getStepUrl(stepId) {
  return (STEP_NAV.find(step => step.id === stepId) || {}).url || 'index.html';
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
  const activeIndex = getStepIndex(activeStepId);
  const currentPhase = activePhase || 'eligibility';

  const sections = PHASES.map(phase => {
    const phaseSteps = STEP_NAV.filter(step => step.phase === phase.id);
    const items = phaseSteps.map(step => {
      const stepIndex = getStepIndex(step.id);
      const isActive = step.id === activeStepId;
      const isDone = activeIndex >= 0 && stepIndex < activeIndex;
      const hasAnswer = getAnswer(step.id) !== null;
      const isOpen = hasAnswer || stepIndex <= activeIndex || currentPhase === 'summary';
      const cls = [
        'sidebar-step',
        isActive ? 'active' : '',
        isDone ? 'done' : '',
        isOpen ? 'open' : 'locked',
      ].filter(Boolean).join(' ');
      const answer = getAnswer(step.id);
      return `
        <a class="${cls}" href="${isOpen ? step.url : '#'}" ${isOpen ? `onclick="return navigateToStep('${step.id}','${activeStepId || ''}')"` : 'aria-disabled="true" onclick="return false;"'}>
          <span class="sidebar-step-dot">${isDone ? '✓' : stepIndex + 1}</span>
          <span class="sidebar-step-text">
            <span class="sidebar-step-label">${escHtml(step.label)}</span>
            <span class="sidebar-step-preview">${answer ? escHtml(formatAnswerValue(answer)) : 'Nėra pasirinkimo'}</span>
            <span class="sidebar-step-phase">${phase.label}</span>
          </span>
        </a>`;
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

// ── Navigation ─────────────────────────────────────────────────────────────
function navigateToStep(targetStepId, currentStepId) {
  markInternalNavigation();
  const url = new URL(getStepUrl(targetStepId), window.location.origin);
  url.searchParams.set('_nav', '1');
  window.location.href = url.toString();
  return false;
}

function navigateToPhase(phaseId, currentStepId) {
  const targetStepId = PHASE_FIRST_STEP[phaseId] || 'index.html';
  return navigateToStep(targetStepId, currentStepId);
}

function goBackFrom(currentStepId) {
  const currentIndex = getStepIndex(currentStepId);
  if (currentIndex <= 0) {
    return navigateToStep('s0', currentStepId);
  }

  return navigateToStep(STEP_NAV[currentIndex - 1].id, currentStepId);
}

function goBack() { window.history.back(); }

function restart() {
  clearAll();
  window.location.href = 'index.html';
}

function confirmRestart() {
  if (confirm('Pradėjus iš naujo bus ištrinti visi jūsų duomenys. Tęsti?')) {
    restart();
  }
}

// ── Header & Hero rendering ────────────────────────────────────────────────
function renderHeader(activePhase, activeStepId = '') {
  const header = document.getElementById('appHeader');
  if (!header) return;

  const phaseOrder = ['eligibility','category','documents','summary'];
  const activeIdx  = phaseOrder.indexOf(activePhase);

  const navHTML = PHASES.map((p, i) => {
    const isDone   = i < activeIdx;
    const isActive = p.id === activePhase;
    const isOpen   = isDone || isActive;
    const cls      = [isDone ? 'done' : '', isActive ? 'active' : '', isOpen ? 'open' : 'locked'].filter(Boolean).join(' ');
    const dot      = isDone ? '✓' : p.num;
    const arrow    = i < PHASES.length - 1 ? '<span class="phase-arrow">›</span>' : '';
    const href     = PHASE_ENTRY[p.id] || '#';
    return isOpen ? `
      <a class="phase-step ${cls}" href="${href}" onclick="return navigateToPhase('${p.id}','${activeStepId}')">
        <span class="phase-step-inner">
          <span class="phase-dot">${dot}</span>
          <span>${p.label}</span>
        </span>${arrow}
      </a>` : `
      <span class="phase-step ${cls}" aria-disabled="true">
        <span class="phase-step-inner">
          <span class="phase-dot">${dot}</span>
          <span>${p.label}</span>
        </span>${arrow}
      </span>`;
  }).join('');

  header.innerHTML = `
    <div class="header-inner">
      <a href="index.html" class="header-brand" onclick="return navigateToStep('s0','${activeStepId}')">
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

// ── Upload zone ────────────────────────────────────────────────────────────
function setupUploadZone(key) {
  const zone  = document.getElementById('uploadZone');
  const input = document.getElementById('fileInput');
  if (!zone || !input) return;

  // Replace listeners cleanly by re-assigning
  input.onchange = e => { addFiles(key, Array.from(e.target.files)); e.target.value = ''; };
  zone.ondragover = e => { e.preventDefault(); zone.classList.add('drag-over'); };
  zone.ondragleave = ()  => zone.classList.remove('drag-over');
  zone.ondrop = e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    addFiles(key, Array.from(e.dataTransfer.files));
  };

  refreshFileList(key);
}

function isUploadRequired(btn) {
  return btn?.dataset?.uploadKey ? true : false;
}

function updateNextButtonState() {
  const btn = document.getElementById('btnNext');
  if (!btn) return;
  
  const selected = document.querySelector('.option-btn.selected');
  if (!selected) { btn.disabled = true; return; }
  
  const uploadKey = selected.dataset.uploadKey;
  if (!uploadKey) { btn.disabled = false; return; }
  
  // Upload is required — only enable if files exist
  const files = getFiles(uploadKey);
  btn.disabled = files.length === 0;
}

function showUpload(btn) {
  const section = document.getElementById('uploadSection');
  if (!section) return;
  const key = btn?.dataset?.uploadKey;

  if (!key) { section.hidden = true; updateNextButtonState(); return; }

  section.hidden = false;
  const lbl = btn.dataset.uploadLabel;
  const sub = btn.dataset.uploadSub;
  if (lbl) { const el = document.getElementById('uploadLabel');    if (el) el.textContent = lbl; }
  if (sub) { const el = document.getElementById('uploadSublabel'); if (el) el.textContent = sub; }
  setupUploadZone(key);
  updateNextButtonState();
}

function getPageUploadKeys() {
  return [...document.querySelectorAll('.option-btn[data-upload-key]')]
    .map(btn => btn.dataset.uploadKey)
    .filter(Boolean)
    .filter((key, index, keys) => keys.indexOf(key) === index);
}

// ── Page init (choice pages) ───────────────────────────────────────────────
function initPage({ stepId, phase, hasBack = true }) {
  resetIfDirectOpen();
  renderHeader(phase, stepId);
  renderHero(phase);
  renderSidebar(stepId, phase);

  const saved   = getAnswer(stepId);
  const buttons = document.querySelectorAll('.option-btn');

  // Inject actions bar
  const actionsEl = document.getElementById('actions');
  if (actionsEl) {
    actionsEl.innerHTML = `
      ${hasBack ? `<button class="btn-back" onclick="goBackFrom('${stepId}')">← Atgal</button>` : ''}
      <button class="btn-next" id="btnNext" ${saved ? '' : 'disabled'}
              onclick="advance('${stepId}')">Tęsti →</button>`;
  }

  // Restore saved selection
  if (saved) {
    const savedBtn = [...buttons].find(b => b.dataset.value === saved);
    if (savedBtn) { savedBtn.classList.add('selected'); showUpload(savedBtn); }
  }

  // Click handlers
  buttons.forEach(btn => btn.addEventListener('click', () => {
    const previous = document.querySelector('.option-btn.selected');
    const previousValue = previous?.dataset?.value;
    const selectedValue = btn.dataset.value;
    buttons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    if (previousValue !== selectedValue) {
      clearUploadKeys(getPageUploadKeys());
    }
    setAnswer(stepId, btn.dataset.value);
    showUpload(btn);
    updateNextButtonState();
  }));
}

function advance(stepId) {
  const sel = document.querySelector('.option-btn.selected');
  if (!sel) return;

  // Check if upload is required but not provided
  const uploadKey = sel.dataset.uploadKey;
  if (uploadKey) {
    const files = getFiles(uploadKey);
    if (files.length === 0) {
      alert('Prašome pridėti bent vieną dokumentą prieš tęsiant.');
      return;
    }
  }

  markInternalNavigation();
  const url = new URL(sel.dataset.next, window.location.origin);
  url.searchParams.set('_nav', '1');
  window.location.href = url.toString();
}

function initEndPage(phase) {
  resetIfDirectOpen();
  renderHeader(phase || 'end');
  renderHero(phase || 'end');
}

function initStartPage(stepId, phase) {
  resetIfDirectOpen();
  renderHeader(phase, stepId);
  renderHero(phase);
  renderSidebar(stepId, phase);
}
