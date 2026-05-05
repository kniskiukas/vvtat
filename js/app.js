'use strict';

function uploadZoneHTML() {
  return `
    <div class="upload-zone" id="uploadZone">
      <input type="file" id="fileInput" multiple
             accept=".jpg,.jpeg,.png,.gif,.webp,.heic,.avif,.pdf,.doc,.docx">
      <div class="upload-zone-icon">📎</div>
      <p><strong>Vilkite failus čia</strong> arba spustelėkite</p>
      <span>JPG, PNG, PDF, DOCX — iki ${MAX_MB} MB</span>
    </div>
    <div class="file-list" id="fileList"></div>`;
}

function infoBoxHTML(info) {
  if (!info) return '';
  return `
    <div class="info-box ${info.type}">
      ${info.icon ? `<span class="info-box-icon">${info.icon}</span>` : ''}
      <div>${info.text}</div>
    </div>`;
}

// ── Choice step ────────────────────────────────────────────────
function renderChoiceStep(stepId, step) {
  const saved    = getAnswer(stepId);
  const savedOpt = saved ? step.options.find(o => o.value === saved) : null;
  const hasBack  = STEP_NAV.findIndex(s => s.id === stepId) > 0;

  const optionsHTML = step.options.map(opt => {
    const uploadAttrs = opt.uploadKey
      ? `data-upload-key="${opt.uploadKey}" data-upload-label="${escHtml(opt.uploadLabel || '')}" data-upload-sub="${escHtml(opt.uploadSub || '')}"`
      : '';
    return `
      <button class="option-btn${saved === opt.value ? ' selected' : ''}"
              data-value="${opt.value}" data-next="${opt.next}" ${uploadAttrs}>
        <span class="option-marker">${opt.marker}</span>
        <span class="option-body">
          <span class="option-title">${escHtml(opt.title)}</span>
          ${opt.desc ? `<span class="option-desc">${escHtml(opt.desc)}</span>` : ''}
        </span>
      </button>`;
  }).join('');

  document.getElementById('content').innerHTML = `
    <div class="card">
      <div class="step-label">${step.label}</div>
      <h2 class="question">${escHtml(step.question)}</h2>
      ${step.sub ? `<p class="question-sub">${escHtml(step.sub)}</p>` : ''}
      ${infoBoxHTML(step.info)}
      <div class="options">${optionsHTML}</div>
      <div class="upload-section" id="uploadSection" ${savedOpt?.uploadKey ? '' : 'hidden'}>
        <label class="upload-label" id="uploadLabel">${escHtml(savedOpt?.uploadLabel || '')}</label>
        <span class="upload-sublabel" id="uploadSublabel">${escHtml(savedOpt?.uploadSub || '')}</span>
        ${uploadZoneHTML()}
      </div>
      <div class="actions" id="actions">
        ${hasBack ? `<button class="btn-back" onclick="goBack()">← Atgal</button>` : ''}
        <button class="btn-next" id="btnNext" ${saved ? '' : 'disabled'}
                onclick="advance('${stepId}')">Tęsti →</button>
      </div>
    </div>`;

  if (savedOpt?.uploadKey) setupUploadZone(savedOpt.uploadKey);

  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prev = document.querySelector('.option-btn.selected');
      if (prev?.dataset?.value !== btn.dataset.value) clearUploadKeys(getPageUploadKeys());
      document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      setAnswer(stepId, btn.dataset.value);
      showUpload(btn);
      updateNextButtonState();
    });
  });

  updateNextButtonState();
}

// ── Info step ──────────────────────────────────────────────────
function renderInfoStep(stepId, step) {
  document.getElementById('content').innerHTML = `
    <div class="card">
      <div class="step-label">${step.label}</div>
      <h2 class="question">${escHtml(step.question)}</h2>
      ${infoBoxHTML(step.info)}
      <div class="actions">
        <button class="btn-back" onclick="goBack()">← Atgal</button>
        <a href="#${step.next}" class="btn-next">${escHtml(step.nextLabel || 'Tęsti →')}</a>
      </div>
    </div>`;
}

// ── End state ──────────────────────────────────────────────────
function renderEndState(end) {
  document.getElementById('content').innerHTML = `
    <div class="end-card">
      <div class="end-icon">${end.icon}</div>
      <div class="end-title">${escHtml(end.title)}</div>
      <div class="end-body">${escHtml(end.body)}</div>
      <div class="end-actions">
        ${end.link ? `<a href="${end.link.href}" target="_blank" rel="noopener" class="btn-external">${escHtml(end.link.label)}</a>` : ''}
        <button class="btn-ghost" onclick="goBack()">← Atgal</button>
        <button class="btn-ghost" onclick="confirmRestart()">↩ Pradėti iš naujo</button>
      </div>
    </div>`;
}

// ── Summary ────────────────────────────────────────────────────
function renderSummaryPage() {
  const answers      = getAllAnswers();
  const answeredSteps = STEP_NAV.filter(s => s.phase !== 'summary' && answers[s.id]);

  let allFiles;
  try { allFiles = JSON.parse(localStorage.getItem(KEY_FILES) || '{}'); } catch { allFiles = {}; }
  const fileCount = Object.values(allFiles).flat().length;

  const answerHTML = answeredSteps.length
    ? answeredSteps.map(s => `
        <div class="summary-item">
          <div class="summary-key">${escHtml(s.label)}</div>
          <div class="summary-val">${escHtml(ANSWER_LABELS[answers[s.id]] || answers[s.id])}</div>
        </div>`).join('')
    : '<p style="color:var(--gray-400);font-size:13px">Nėra atsakymų.</p>';

  const filesHTML = fileCount > 0
    ? `<div class="summary-files-title">📎 Pridėti dokumentai (${fileCount})</div>
       <div class="summary-file-groups">
         ${UPLOAD_GROUPS.map(g => {
           const files = allFiles[g.key] || [];
           if (!files.length) return '';
           return `
             <div class="summary-file-group">
               <div class="summary-file-group-title">${g.title}</div>
               <div class="summary-file-chip-wrap">
                 ${files.map(f => `
                   <span class="summary-file-chip">
                     ${fileIcon(f.name)} ${escHtml(f.name)}
                     ${f.size ? `<span class="summary-file-size">${fmtSize(f.size)}</span>` : ''}
                   </span>`).join('')}
               </div>
             </div>`;
         }).join('')}
       </div>`
    : `<div class="info-box neutral">
         <span class="info-box-icon">⚠️</span>
         <div>Nepridėjote jokių dokumentų. Rekomenduojame pridėti bent pirkimo įrodymą ir pardavėjo atsakymą prieš teikiant prašymą.</div>
       </div>`;

  document.getElementById('content').innerHTML = `
    <div class="card">
      <div class="step-label">Santrauka</div>
      <h2 class="question">Jūsų prašymo santrauka</h2>
      <p class="question-sub">Patikrinkite surinktą informaciją prieš pateikdami prašymą VVTAT.</p>

      <div class="summary-meta">
        <div class="summary-meta-item"><strong>${answeredSteps.length}</strong><span>užpildyti pasirinkimai</span></div>
        <div class="summary-meta-item"><strong>${fileCount}</strong><span>pridėti failai</span></div>
      </div>

      <div class="summary-grid">${answerHTML}</div>
      <hr class="section-divider">
      <div class="summary-files">${filesHTML}</div>

      <div class="info-box blue" style="margin-top:20px">
        <span class="info-box-icon">✅</span>
        <div>Puiku! Dabar galite pateikti prašymą VVTAT sistemoje. Prisijunkite per <strong>el. valdžios vartus</strong> ir pasirinkite <em>„Pateikti skundą"</em>.</div>
      </div>
      <div class="info-box neutral" style="margin-top:10px">
        <span class="info-box-icon">📄</span>
        <div><strong>ADoc failas</strong> sugeneruojamas automatiškai, kai pasirašote prašymą el. parašu VVTAT sistemoje. Turėkite paruoštus visus dokumentus prieš pradėdami pildyti.</div>
      </div>

      <div class="summary-cta">
        <div class="actions">
          <button class="btn-back" onclick="goBack()">← Atgal</button>
          <a href="https://www.vvtat.lt/vartotojams/skundu-pateikimas/392"
             target="_blank" rel="noopener" class="btn-next">Pateikti prašymą VVTAT →</a>
        </div>
        <div style="text-align:center;margin-top:14px">
          <button class="btn-ghost" onclick="confirmRestart()">↩ Pradėti iš naujo</button>
        </div>
      </div>
    </div>`;
}

// ── Dispatcher ─────────────────────────────────────────────────
function renderPage(pageId) {
  const stepDef = STEPS[pageId];
  const endDef  = ENDS[pageId];
  const phase   = stepDef?.phase || (endDef ? 'end' : null);

  if (pageId === 'summary') {
    renderHeader('summary');
    renderHero('summary');
    renderSummaryPage();
    renderSidebar('summary', 'summary');
  } else if (stepDef) {
    renderHeader(phase);
    renderHero(phase);
    if (stepDef.type === 'info') renderInfoStep(pageId, stepDef);
    else renderChoiceStep(pageId, stepDef);
    renderSidebar(pageId, phase);
  } else if (endDef) {
    renderHeader('end');
    renderHero('end');
    renderEndState(endDef);
    removeSidebar();
  } else {
    // Unknown id — fall back to start
    window.location.hash = '#s0';
    return;
  }

  window.scrollTo(0, 0);
}

// ── Init ───────────────────────────────────────────────────────
window.addEventListener('hashchange', () => {
  renderPage(window.location.hash.slice(1) || 's0');
});

renderPage(window.location.hash.slice(1) || 's0');
