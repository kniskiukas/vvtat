'use strict';

const PHASES = [
  { id: 'eligibility', label: 'Tikrinimas', num: 1 },
  { id: 'category',    label: 'Kategorija', num: 2 },
  { id: 'documents',   label: 'Dokumentai', num: 3 },
  { id: 'summary',     label: 'Santrauka',  num: 4 },
];

const ANSWER_LABELS = {
  fizinis:          'Fizinis asmuo',
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

const STEP_NAV = [
  { id: 's0',             label: 'Jūs esate?',           phase: 'eligibility' },
  { id: 's1',             label: 'Kategorija',           phase: 'eligibility' },
  { id: 's2',             label: 'Paslaugos teikėjas',   phase: 'eligibility' },
  { id: 's3_price',       label: 'Kaina',                phase: 'eligibility' },
  { id: 's4_subcategory', label: 'Prašymo pobūdis',      phase: 'category'    },
  { id: 's5_14days',      label: '14 dienų kreipimasis', phase: 'category'    },
  { id: 'q2_01_adoc',     label: 'ADoc galimybė',        phase: 'documents'   },
  { id: 'q2_02_response', label: 'Pardavėjo atsakymas',  phase: 'documents'   },
  { id: 'q2_03_purchase', label: 'Pirkimo dokumentas',   phase: 'documents'   },
  { id: 'q2_04_problem',  label: 'Trūkumai / problemos', phase: 'documents'   },
  { id: 'q2_06_damages',  label: 'Papildomi nuostoliai', phase: 'documents'   },
  { id: 'summary',        label: 'Santrauka',            phase: 'summary'     },
];

const SLUG_TO_ID = {
  'jus-esate':               's0',
  'kategorija':              's1',
  'paslaugos-teikejo-salis': 's2',
  'kaina':                   's3_price',
  'praasymo-pobudis':        's4_subcategory',
  '14-dienu-terminas':       's5_14days',
  'el-parasas':              'q2_01_adoc',
  'el-parasas-info':         'q2_01_explain',
  'pardavejo-atsakymas':     'q2_02_response',
  'pirkimo-irodymas':        'q2_03_purchase',
  'trukumu-irodymai':        'q2_04_problem',
  'nuostoliai':              'q2_06_damages',
  'santrauka':               'summary',
  'prasymas-rrt':            'end-rrt',
  'prasymas-lb':             'end-lb',
  'prasymas-vert':           'end-vert',
  'prasymas-advokatura':     'end-advokatura',
  'prasymas-vmvt':           'end-vmvt',
  'prasymas-ecc':            'end-ecc',
  'prasymas-privatus':       'end-fiz-pardav',
  'prasymas-kita':           'end-kita',
  'prasymas-kaina':          'end-kaina',
  'prasymas-14-dienu':       'end-14days',
  'prasymas-adoc':           'end-adoc-ne',
  'prasymas-zodinis':        'end-zodziai',
  'prasymas-be-irodymu':     'end-no-evidence',
  'prasymas-be-pirkimo':     'end-no-purchase',
};

const ID_TO_SLUG = Object.fromEntries(Object.entries(SLUG_TO_ID).map(([k, v]) => [v, k]));

const PHASE_FIRST_STEP = {
  eligibility: 's0',
  category:    's4_subcategory',
  documents:   'q2_01_adoc',
  summary:     'summary',
};

const STEP_UPLOAD_KEYS = {
  q2_02_response: ['atsakymas', 'kreipimasis'],
  q2_03_purchase: ['pirkimas'],
  q2_04_problem:  ['problema'],
  q2_06_damages:  ['zala'],
};

const UPLOAD_GROUPS = [
  { key: 'atsakymas',   title: 'Pardavėjo atsakymas' },
  { key: 'kreipimasis', title: 'Jūsų kreipimasis' },
  { key: 'pirkimas',    title: 'Pirkimo dokumentai' },
  { key: 'problema',    title: 'Trūkumų / problemų įrodymai' },
  { key: 'zala',        title: 'Žalos dokumentai' },
];
