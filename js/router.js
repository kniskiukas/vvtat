'use strict';

function navigate(stepId) {
  window.location.hash = '#' + stepId;
}

function goBack() {
  window.history.back();
}

function restart() {
  clearAll();
  window.location.hash = '#s0';
  // Force re-render since hash may not change if already on s0
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
