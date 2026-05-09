'use strict';

function idToSlug(id) { return ID_TO_SLUG[id] || id; }
function slugToId(slug) { return SLUG_TO_ID[slug] || slug; }

function navigate(stepId) {
  window.location.hash = '#' + idToSlug(stepId);
}

function goBack() {
  window.history.back();
}

function restart() {
  clearAll();
  navigate('s0');
  renderPage('s0');
}

function confirmRestart() {
  if (confirm('Pradėjus iš naujo bus ištrinti visi jūsų duomenys. Tęsti?')) restart();
}

function advance(stepId) {
  const sel = document.querySelector('.option-btn.selected');
  if (!sel) return;
  const uploadKey = sel.dataset.uploadKey;
  if (uploadKey && getFiles(uploadKey).length === 0) {
    alert('Prašome pridėti bent vieną dokumentą prieš tęsiant.');
    return;
  }
  navigate(sel.dataset.next);
}
