'use strict';

function getAnswer(stepId) {
  try { return (JSON.parse(localStorage.getItem(KEY_ANSWERS) || '{}'))[stepId] || null; }
  catch { return null; }
}

function setAnswer(stepId, value) {
  try {
    const all = JSON.parse(localStorage.getItem(KEY_ANSWERS) || '{}');
    all[stepId] = value;
    localStorage.setItem(KEY_ANSWERS, JSON.stringify(all));
  } catch {}
}

function getAllAnswers() {
  try { return JSON.parse(localStorage.getItem(KEY_ANSWERS) || '{}'); }
  catch { return {}; }
}

function clearAll() {
  try {
    localStorage.removeItem(KEY_ANSWERS);
    localStorage.removeItem(KEY_FILES);
    sessionStorage.clear();
  } catch {}
}

function getFiles(key) {
  try { return (JSON.parse(localStorage.getItem(KEY_FILES) || '{}'))[key] || []; }
  catch { return []; }
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
    if (file.size > maxBytes) { alert(`Failas „${file.name}" viršija ${MAX_MB} MB limitą.`); continue; }
    const entry = { name: file.name, size: file.size, type: file.type };
    store[key].push(entry);
    const idx = store[key].length - 1;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const s = JSON.parse(localStorage.getItem(KEY_FILES) || '{}');
        if (s[key]?.[idx]) { s[key][idx].dataUrl = e.target.result; _persistFileStore(s); }
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

function clearUploadKeys(keys) {
  if (!keys || !keys.length) return;
  try {
    const store = JSON.parse(localStorage.getItem(KEY_FILES) || '{}');
    let changed = false;
    for (const key of keys) { if (store[key]) { delete store[key]; changed = true; } }
    if (changed) {
      if (Object.keys(store).length) localStorage.setItem(KEY_FILES, JSON.stringify(store));
      else localStorage.removeItem(KEY_FILES);
    }
  } catch {}
}
