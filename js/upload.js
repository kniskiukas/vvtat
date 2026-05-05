'use strict';

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

function setupUploadZone(key) {
  const zone  = document.getElementById('uploadZone');
  const input = document.getElementById('fileInput');
  if (!zone || !input) return;

  input.onchange  = e => { addFiles(key, Array.from(e.target.files)); e.target.value = ''; };
  zone.ondragover = e => { e.preventDefault(); zone.classList.add('drag-over'); };
  zone.ondragleave = () => zone.classList.remove('drag-over');
  zone.ondrop = e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    addFiles(key, Array.from(e.dataTransfer.files));
  };

  refreshFileList(key);
}

function updateNextButtonState() {
  const btn = document.getElementById('btnNext');
  if (!btn) return;
  const selected = document.querySelector('.option-btn.selected');
  if (!selected) { btn.disabled = true; return; }
  const uploadKey = selected.dataset.uploadKey;
  btn.disabled = uploadKey ? getFiles(uploadKey).length === 0 : false;
}

function getPageUploadKeys() {
  return [...new Set(
    [...document.querySelectorAll('.option-btn[data-upload-key]')]
      .map(b => b.dataset.uploadKey).filter(Boolean)
  )];
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
