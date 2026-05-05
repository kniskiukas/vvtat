// summary.js — renders the full summary from localStorage

resetIfDirectOpen();
renderHeader('summary', 'summary');
renderHero('summary');
renderSidebar('summary', 'summary');

// ── Display labels ────────────────────────────────────────────
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

const STEP_LABELS = {
  s0: 'Asmens tipas',
  s1: 'Ginčo kategorija',
  s2: 'Paslaugos teikėjas',
  s3_price: 'Kaina',
  s4_subcategory: 'Ginčo pobūdis',
  s5_14days: 'Kreipimasis į pardavėją',
  q2_01_adoc: 'ADoc galimybė',
  q2_02_response: 'Pardavėjo atsakymas',
  q2_03_purchase: 'Pirkimo dokumentas',
  q2_04_problem: 'Trūkumai / problemos',
  q2_06_damages: 'Papildomi nuostoliai',
};

const UPLOAD_GROUPS = [
  { key: 'atsakymas', title: 'Pardavėjo atsakymas' },
  { key: 'kreipimasis', title: 'Jūsų kreipimasis' },
  { key: 'pirkimas', title: 'Pirkimo dokumentai' },
  { key: 'problema', title: 'Trūkumų / problemų įrodymai' },
  { key: 'zala', title: 'Žalos dokumentai' },
];

const STEP_ORDER = [
  's0',
  's1',
  's2',
  's3_price',
  's4_subcategory',
  's5_14days',
  'q2_01_adoc',
  'q2_02_response',
  'q2_03_purchase',
  'q2_04_problem',
  'q2_06_damages',
];

const STEP_DISPLAY = [
  { stepId: 's0',             label: 'Asmens tipas' },
  { stepId: 's1',             label: 'Ginčo kategorija' },
  { stepId: 's2',             label: 'Paslaugos teikėjas' },
  { stepId: 's3_price',       label: 'Kaina' },
  { stepId: 's4_subcategory', label: 'Ginčo pobūdis' },
  { stepId: 's5_14days',      label: 'Kreipimasis į pardavėją' },
  { stepId: 'q2_01_adoc',     label: 'ADoc galimybė' },
  { stepId: 'q2_02_response', label: 'Pardavėjo atsakymas' },
  { stepId: 'q2_03_purchase', label: 'Pirkimo dokumentas' },
  { stepId: 'q2_04_problem',  label: 'Trūkumai / problemos' },
  { stepId: 'q2_06_damages',  label: 'Papildomi nuostoliai' },
];

// ── Render answer grid ────────────────────────────────────────
const answers = getAllAnswers();
const answeredSteps = STEP_ORDER.filter(stepId => answers[stepId]);

const summaryMeta = document.createElement('div');
summaryMeta.className = 'summary-meta';
summaryMeta.innerHTML = `
  <div class="summary-meta-item"><strong>${answeredSteps.length}</strong><span>užpildyti pasirinkimai</span></div>
  <div class="summary-meta-item"><strong>${Object.values(JSON.parse(localStorage.getItem('vvtat_files_v1') || '{}')).flat().length}</strong><span>pridėti failai</span></div>`;
document.querySelector('.card').insertBefore(summaryMeta, document.getElementById('summaryAnswers'));

const answerHTML = STEP_DISPLAY
  .filter(({ stepId }) => answers[stepId])
  .map(({ stepId, label }) => `
    <div class="summary-item">
      <div class="summary-key">${label}</div>
      <div class="summary-val">${ANSWER_LABELS[answers[stepId]] || answers[stepId]}</div>
    </div>`)
  .join('');

document.getElementById('summaryAnswers').innerHTML = answerHTML || '<p style="color:var(--gray-400);font-size:13px">Nėra atsakymų.</p>';

// ── Render file chips ─────────────────────────────────────────
let allFiles;
try { allFiles = JSON.parse(localStorage.getItem('vvtat_files_v1') || '{}'); } catch { allFiles = {}; }

const fileEntries = Object.values(allFiles).flat();

const filesContainer = document.getElementById('summaryFiles');
if (fileEntries.length > 0) {
  filesContainer.innerHTML = `
    <div class="summary-files-title">📎 Pridėti dokumentai (${fileEntries.length})</div>
    <div class="summary-file-groups">
      ${UPLOAD_GROUPS.map(group => {
        const files = allFiles[group.key] || [];
        if (!files.length) return '';
        return `
          <div class="summary-file-group">
            <div class="summary-file-group-title">${group.title}</div>
            <div class="summary-file-chip-wrap">
              ${files.map(f => `
                <span class="summary-file-chip">
                  ${fileIcon(f.name)} ${escHtml(f.name)}
                  ${f.size ? `<span class="summary-file-size">${fmtSize(f.size)}</span>` : ''}
                </span>`).join('')}
            </div>
          </div>`;
      }).join('')}
    </div>`;
} else {
  filesContainer.innerHTML = `
    <div class="info-box neutral">
      <span class="info-box-icon">⚠️</span>
      <div>Nepridėjote jokių dokumentų. Rekomenduojame pridėti bent pirkimo įrodymą ir pardavėjo atsakymą prieš teikiant prašymą.</div>
    </div>`;
}
