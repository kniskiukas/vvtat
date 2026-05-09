'use strict';

let _prevStepIdx = -1;
let _slideClass  = '';

// ── Dispatcher ─────────────────────────────────────────────────
function renderPage(pageId) {
  const stepDef = STEPS[pageId];
  const endDef  = ENDS[pageId];
  const phase   = stepDef?.phase || (endDef ? 'end' : null);

  const stepIdx = STEP_NAV.findIndex(s => s.id === pageId);
  if (stepIdx >= 0) {
    updateMaxVisitedIndex(stepIdx);
    _slideClass = _prevStepIdx >= 0 && stepIdx !== _prevStepIdx
      ? (stepIdx > _prevStepIdx ? 'slide-forward' : 'slide-back')
      : '';
    _prevStepIdx = stepIdx;
  } else {
    _slideClass = '';
  }

  if (pageId === 'summary') {
    renderHeader('summary');
    renderSummaryPage();
    renderSidebar('summary', 'summary');
  } else if (stepDef) {
    renderHeader(phase);
    if (stepDef.type === 'info') renderInfoStep(pageId, stepDef);
    else renderChoiceStep(pageId, stepDef);
    renderSidebar(pageId, phase);
  } else if (endDef) {
    renderHeader('end');
    renderEndState(endDef);
    removeSidebar();
  } else {
    window.location.hash = '#' + idToSlug('s0');
    return;
  }

  window.scrollTo(0, 0);
}

// ── Init ───────────────────────────────────────────────────────
window.addEventListener('hashchange', () => {
  renderPage(slugToId(window.location.hash.slice(1) || idToSlug('s0')));
});

if (!window.location.hash) window.history.replaceState(null, '', '#' + idToSlug('s0'));
renderPage(slugToId(window.location.hash.slice(1) || idToSlug('s0')));
