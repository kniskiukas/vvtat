'use strict';

const KEY_ANSWERS  = 'vvtat_answers_v1';
const KEY_FILES    = 'vvtat_files_v1';
const KEY_MAX_STEP = 'vvtat_max_step_v1';
const MAX_MB      = 20;

const PHASES = [
  { id: 'eligibility', label: 'Tikrinimas', num: 1 },
  { id: 'category',    label: 'Kategorija', num: 2 },
  { id: 'documents',   label: 'Dokumentai', num: 3 },
  { id: 'summary',     label: 'Santrauka',  num: 4 },
];

const PHASE_HERO = {
  eligibility: { icon: '🔍', title: 'Tinkamumo tikrinimas', sub: 'Pirmiausia nustatysime, ar VVTAT gali jums padėti ir ar esate tinkamoje vietoje.' },
  category:    { icon: '📋', title: 'prašymo kategorija',     sub: 'Tiksliau apibūdinkite prašymą, kad galėtume suformuoti tinkamą prašymą.' },
  documents:   { icon: '📂', title: 'Dokumentų rinkimas',   sub: 'Surinkite reikiamus dokumentus — jie sustiprins jūsų prašymą.' },
  summary:     { icon: '✅', title: 'Prašymo santrauka',    sub: 'Peržiūrėkite surinktą informaciją ir pereikite prie pateikimo.' },
  end:         { icon: '↗️', title: 'Nukreipiame jus',       sub: 'Jūsų situaciją nagrinėja kita institucija — žemiau rasite nuorodą.' },
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

// Ordered step list used for sidebar, progress, and back navigation
const STEP_NAV = [
  { id: 's0',             label: 'Jūs esate?',           phase: 'eligibility' },
  { id: 's1',             label: 'Kategorija',           phase: 'eligibility' },
  { id: 's2',             label: 'Paslaugos teikėjas',   phase: 'eligibility' },
  { id: 's3_price',       label: 'Kaina',                phase: 'eligibility' },
  { id: 's4_subcategory', label: 'prašymo pobūdis',        phase: 'category'    },
  { id: 's5_14days',      label: '14 dienų kreipimasis', phase: 'category'    },
  { id: 'q2_01_adoc',     label: 'ADoc galimybė',        phase: 'documents'   },
  { id: 'q2_02_response', label: 'Pardavėjo atsakymas',  phase: 'documents'   },
  { id: 'q2_03_purchase', label: 'Pirkimo dokumentas',   phase: 'documents'   },
  { id: 'q2_04_problem',  label: 'Trūkumai / problemos', phase: 'documents'   },
  { id: 'q2_06_damages',  label: 'Papildomi nuostoliai', phase: 'documents'   },
  { id: 'summary',        label: 'Santrauka',            phase: 'summary'     },
];

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

const STEPS = {
  s0: {
    phase: 'eligibility',
    label: 'Žingsnis 1 / 4',
    question: 'Jūs esate?',
    sub: 'VVTAT nagrinėja tik ginčus, kilusius tarp fizinių asmenų (vartotojų) ir verslo subjektų',
    options: [
      { value: 'fizinis',   next: 's1',           marker: 'A', title: 'Fizinis asmuo',    desc: 'Prekes ar paslaugas įsigijau asmeniniais, su verslu nesusijusiais, tikslais' },
      { value: 'juridinis', next: 'end-juridinis', marker: 'B', title: 'Juridinis asmuo', desc: 'Atstovauju įmonei ar organizacijai' },
    ],
  },
  s1: {
    phase: 'eligibility',
    label: 'Žingsnis 2 / 4',
    question: 'Jūs kreipiatės dėl?',
    sub: 'Pasirinkite kategoriją, kuri geriausiai atspindi jūsų situaciją.',
    options: [
      { value: 'rysiai',     next: 'end-rrt',       marker: 'A', title: 'Elektroninių ryšių arba pašto paslaugų',             desc: 'Internetas, televizija, mobilusis ryšys, paštas' },
      { value: 'finansai',   next: 'end-lb',         marker: 'B', title: 'Finansinių paslaugų',                                desc: 'Bankai, draudimas, kredito unijos, investicinės įmonės ir kt.' },
      { value: 'maistas',    next: 'end-vmvt',       marker: 'C', title: 'Maisto produktų ar veterinarinių paslaugų',          desc: 'Maisto sauga, kokybė, veterinariniai pažeidimai' },
      { value: 'energetika', next: 'end-vert',       marker: 'D', title: 'Energetikos įmonių veiklos ar komunalinių paslaugų', desc: 'Dujos, elektra, šiluma, vanduo' },
      { value: 'teisines',   next: 'end-advokatura', marker: 'E', title: 'Teisinių paslaugų (advokatų)',                       desc: 'prašymai dėl advokato suteiktų paslaugų' },
      { value: 'vartojimas', next: 's2',             marker: 'F', title: 'Vartojimo prekių ar kitų paslaugų',                  desc: 'Ne maisto prekių (avalynės, drabužių, elektrotechnikos prietaisų, baldų ir kt.), laisvalaikio ir turizmo, statybų rangos, remonto, grožio ir kt. paslaugų' },
    ],
  },
  s2: {
    phase: 'eligibility',
    label: 'Žingsnis 3 / 4',
    question: 'Identifikuokite paslaugos teikėją / prekės pardavėją',
    sub: 'Kur yra registruotas pardavėjas arba paslaugos teikėjas, dėl kurio teikiate prašymą?',
    options: [
      { value: 'lt_verslas', next: 's3_price',       marker: 'A', title: 'Lietuvoje registruotas verslas',                          desc: 'Pardavėjas / paslaugos teikėjas yra juridinis asmuo ar fizinis asmuo, vykdantis individualią veiklą, Lietuvoje' },
      { value: 'eu_verslas', next: 'end-ecc',         marker: 'B', title: 'Europos Sąjungoje, Norvegijoje ar Islandijoje registruotas verslas',      desc: 'Pardavėjas registruotas kitoje Europos Sąjungos šalyje ar Europos Ekonomikos zonos valstybėje' },
      { value: 'fiz_pardav', next: 'end-fiz-pardav',  marker: 'C', title: 'Privatus asmuo (neprofesionalus pardavėjas)',              desc: 'Pavyzdžiui, pirkimas per skelbimų portalą iš privataus asmens' },
      { value : 'kita',       next: 'end-kita',         marker: 'D', title: 'Kitas atvejis',                                              desc: 'Pardavėjas yra už ES ribų arba nežinau, kas tai yra' },
    ],
  },
  s3_price: {
    phase: 'eligibility',
    label: 'Žingsnis 4 / 4',
    question: 'Ar jūsų įsigytos prekės ar paslaugos kaina viršija 20 eurų?',
    options: [
      { value: 'kaina_taip', next: 's4_subcategory', marker: 'A', title: 'Taip, kaina viršija 20 eurų' },
      { value: 'kaina_ne',   next: 'end-kaina',      marker: 'B', title: 'Ne, kaina neviršija 20 eurų' },
    ],
  },
  s4_subcategory: {
    phase: 'category',
    label: 'Kategorija 1 / 2',
    question: 'Kokio pobūdžio yra jūsų prašymas?',
    sub: 'Pasirinkite, kuri sritis geriausiai apibūdina problemą.',
    options: [
      { value: 'preke',        next: 's5_14days', marker: 'A', title: 'Prekė nekokybiška, sugedo arba nepristatyta' },
      { value: 'laisvalaikis', next: 's5_14days', marker: 'B', title: 'Laisvalaikio, turizmo arba transporto paslaugos' },
      { value: 'valymas',      next: 's5_14days', marker: 'C', title: 'Cheminio valymo ar valymo paslaugos' },
      { value: 'statyba',      next: 's5_14days', marker: 'D', title: 'Statybos paslaugos' },
      { value: 'grozis',       next: 's5_14days', marker: 'E', title: 'Grožio ar sveikatos priežiūros paslaugos' },
      { value: 'kita',         next: 's5_14days', marker: 'H', title: 'Kita vartojimo paslauga ar prekė' },
    ],
  },
  s5_14days: {
    phase: 'category',
    label: 'Kategorija 2 / 2',
    question: 'Ar jau kreipėtės į pardavėją raštu ir praėjo 14 dienų?',
    options: [
      { value: '14d_taip', next: 'q2_01_adoc', marker: 'A', title: 'Taip — kreipiausi raštu ir praėjo 14 dienų arba pardavėjas neatsakė' },
      { value: '14d_ne',   next: 'end-14days', marker: 'B', title: 'Ne — dar nesikreipiau arba terminas dar nesibaigė' },
    ],
  },
  q2_01_adoc: {
    phase: 'documents',
    label: 'Dokumentai 1 / 5',
    question: 'Ar galėsite pateikti prašymą ADoc formatu?',
    sub: 'Prašymai VVTAT teikiami elektroniniu parašu pasirašytu dokumentu (ADoc).',
    info: { type: 'blue', icon: '📄', text: 'ADoc — elektroniniu parašu pasirašyto dokumento formatas. Pasirašoma per Mobile ID, Smart-ID arba USB raktą.' },
    options: [
      { value: 'adoc_taip',    next: 'q2_02_response', marker: 'A', title: 'Taip — turiu el. parašą ir galiu pasirašyti' },
      { value: 'adoc_mob',     next: 'q2_02_response', marker: 'B', title: 'Galiu, bet ADoc neatidarau telefone', desc: 'Rekomenduojame pildyti kompiuteryje' },
      { value: 'adoc_nezinau', next: 'q2_01_explain',  marker: 'C', title: 'Nežinau, kas yra ADoc',               desc: 'Paaiškiname ir tęsiame' },
      { value: 'adoc_ne',      next: 'end-adoc-ne',    marker: 'D', title: 'Ne — neturiu el. parašo arba nemoku' },
    ],
  },
  q2_01_explain: {
    phase: 'documents',
    type: 'info',
    label: 'Dokumentai 1 / 5',
    question: 'Kas yra ADoc?',
    info: { type: 'blue', icon: '📄', text: 'ADoc — tai elektroniniu parašu pasirašyto dokumento formatas. Dažniausiai jis sukuriamas automatiškai, kai pasirašote prašymą el. parašu (pvz., per Mobile ID, Smart-ID ar USB el. parašo raktą). Patarimas: Jei neatidarote telefone — atidarykite kompiuteriu.' },
    next: 'q2_02_response',
    nextLabel: 'Supratau, tęsti →',
  },
  q2_02_response: {
    phase: 'documents',
    label: 'Dokumentai 2 / 5',
    question: 'Ar turite pardavėjo atsakymą į jūsų pretenziją?',
    sub: 'Pardavėjo atsakymas arba jūsų kreipimosi kopija yra svarbus įrodymas.',
    options: [
      { value: 'resp_rastas',      next: 'q2_03_purchase',  marker: 'A', title: 'Taip — turiu atsakymą raštu',                          desc: 'El. laiškas, oficialus raštas, savitarnos žinutė ar pan.',               uploadKey: 'atsakymas',   uploadLabel: 'Pridėti atsakymo kopiją',       uploadSub: 'PDF, nuotrauka arba screenshot (el. laiško, savitarnos žinutės, oficialaus rašto)' },
      { value: 'resp_kreipimasis', next: 'q2_03_purchase',  marker: 'B', title: 'Ne — neatsakė, bet turiu savo kreipimosi kopiją',      desc: 'Išsiųsto el. laiško screenshot, registruoto laiško kvitas, savitarnos pranešimas', uploadKey: 'kreipimasis', uploadLabel: 'Pridėti savo kreipimosi kopiją', uploadSub: 'El. laiško screenshot, registruoto laiško kvitas, savitarnos pranešimas' },
      { value: 'resp_zodziai',     next: 'end-zodziai',     marker: 'C', title: 'Kreipiausi tik žodžiu arba telefonu' },
      { value: 'resp_niekas',      next: 'end-no-evidence', marker: 'D', title: 'Neturiu nei atsakymo, nei kreipimosi kopijos' },
    ],
  },
  q2_03_purchase: {
    phase: 'documents',
    label: 'Dokumentai 3 / 5',
    question: 'Kokį pirkimo dokumentą turite?',
    sub: 'Pirkimo įrodymas yra būtinas prašymui.',
    options: [
      { value: 'purch_sutartis', next: 'q2_04_problem',   marker: 'A', title: 'Sutartis arba užsakymo / pirkimo patvirtinimas', desc: 'PVM sąskaita faktūra, sąskaita, mokėjimo kortelės čekis ir pan.', uploadKey: 'pirkimas', uploadLabel: 'Pridėti sutartį arba pirkimo patvirtinimą', uploadSub: 'PVM sąskaita faktūra, sąskaita, mokėjimo kortelės čekis, sutartis ir pan. (PDF arba nuotrauka)' },
      { value: 'purch_kvitas',   next: 'q2_04_problem',   marker: 'B', title: 'Sąskaita faktūra arba kvitas',                                                                                                    uploadKey: 'pirkimas', uploadLabel: 'Pridėti sąskaitos arba kvito kopiją',           uploadSub: 'PDF arba nuotrauka' },
      { value: 'purch_bankas',   next: 'q2_04_problem',   marker: 'C', title: 'Tik banko mokėjimo įrodymas',                    desc: 'Banko sąskaitos išrašas arba pavedimo kvitas',                   uploadKey: 'pirkimas', uploadLabel: 'Pridėti banko išrašą arba pavedimo kvitą',   uploadSub: 'PDF arba screenshot iš banko programėlės' },
      { value: 'purch_nieko',    next: 'end-no-purchase', marker: 'D', title: 'Nieko neturiu' },
    ],
  },
  q2_04_problem: {
    phase: 'documents',
    label: 'Dokumentai 4 / 5',
    question: 'Kokie buvo pastebėti trūkumai ar problemos?',
    sub: 'Pasirinkite situaciją — ji lems, kokius įrodymus rekomenduosime pridėti.',
    options: [
      { value: 'prob_nekokybiska', next: 'q2_06_damages', marker: 'A', title: 'Prekė nekokybiška arba sugedo',                       desc: 'Rekomenduojama: nuotrauka / video, serviso išvada, garantinis aktas',      uploadKey: 'problema', uploadLabel: 'Pridėti trūkumo įrodymus',           uploadSub: 'Nuotrauka, video, serviso išvada, garantinis aktas' },
      { value: 'prob_paslauga',    next: 'q2_06_damages', marker: 'B', title: 'Paslauga atlikta nekokybiškai',                       desc: 'Rekomenduojama: sutartis, darbų aktai, susirašinėjimas, nuotraukos',       uploadKey: 'problema', uploadLabel: 'Pridėti paslaugos kokybės įrodymus', uploadSub: 'Sutartis, darbų aktai, nuotraukos prieš / po, susirašinėjimas' },
      { value: 'prob_pristatymas', next: 'q2_06_damages', marker: 'C', title: 'Nepristatė arba vėluoja pristatymas',                desc: 'Rekomenduojama: užsakymo patvirtinimas, siuntos sekimas, susirašinėjimas', uploadKey: 'problema', uploadLabel: 'Pridėti pristatymo įrodymus',        uploadSub: 'Užsakymo patvirtinimas, siuntos sekimo screenshot, susirašinėjimas' },
      { value: 'prob_pinigai',     next: 'q2_06_damages', marker: 'D', title: 'Negrąžina pinigų arba atsisako tenkinti pretenziją', desc: 'Rekomenduojama: pretenzija + atsakymas, mokėjimo įrodymas',               uploadKey: 'problema', uploadLabel: 'Pridėti įrodymus',                  uploadSub: 'Pretenzija, atsakymas, mokėjimo patvirtinimas, susirašinėjimas' },
      { value: 'prob_kita',        next: 'q2_06_damages', marker: 'E', title: 'Kita',                                               desc: 'Pridėkite įrodymus, aiškiai parodančius aplinkybes',                      uploadKey: 'problema', uploadLabel: 'Pridėti turimus įrodymus',           uploadSub: 'Nuotraukos, susirašinėjimas, dokumentai' },
    ],
  },
  q2_06_damages: {
    phase: 'documents',
    label: 'Dokumentai 5 / 5',
    question: 'Ar patyrėte papildomų nuostolių (žalą)?',
    sub: 'Pvz. mokėjote už remontą, ekspertizę, papildomą siuntimą ar panašiai.',
    options: [
      { value: 'dmg_taip',    next: 'summary', marker: 'A', title: 'Taip — patyriau papildomų nuostolių',           desc: 'Pridėkite žalos įrodymus: sąskaitas, kvitus, pavedimų patvirtinimus', uploadKey: 'zala', uploadLabel: 'Pridėti žalos įrodymus', uploadSub: 'Sąskaitos, kvitai, ekspertizės aktas, pavedimų patvirtinimai' },
      { value: 'dmg_ne',      next: 'summary', marker: 'B', title: 'Ne — papildomų nuostolių nepatyriau' },
      { value: 'dmg_nezinau', next: 'summary', marker: 'C', title: 'Nežinau — žalą galėsiu patikslinti vėliau', desc: 'Tęskite be šio dokumento, vėliau galėsite pridėti' },
    ],
  },
};

const ENDS = {
  'end-juridinis': {
    icon: '🏢',
    title: 'Juridiniams asmenims negalime padėti',
    body: 'Nesame įgalioti nagrinėti juridinių asmenų prašymų. VVTAT nagrinėja tik ginčus, kilusius tarp fizinių asmenų (vartotojų) ir verslo subjektų. Juridiniams asmenims rekomenduojame kreiptis į bendrosios kompetencijos teismą ar spręsti kilusį ginčą derybų keliu.',
  },
  'end-rrt': {
    icon: '📡',
    title: 'Jūsų prašymą nagrinėtų RRT',
    body: 'Skundus dėl elektroninių ryšio (interneto, televizijos, mobilaus ryšio) ir pašto paslaugų  priima Lietuvos Respublikos ryšių reguliavimo tarnyba (RRT).',
    link: { href: 'https://rrt.lt/veiklos-sritys/vartotoju-teisiu-apsauga/informacija-del-ginco-nagrinejimo', label: 'Atidaryti RRT svetainę →' },
  },
  'end-lb': {
    icon: '🏦',
    title: 'Jūsų prašymą nagrinėtų Lietuvos bankas',
    body: 'Skundus dėl finansinių paslaugų (bankai, draudimas, kredito unijos, investiciniai fondai ir kt.) priima Lietuvos bankas.',
    link: { href: 'https://www.lb.lt/lt/spreskite-ginca-su-finansiniu-paslaugu-teikeju', label: 'Atidaryti Lietuvos banko svetainę →' },
  },
  'end-vert': {
    icon: '⚡',
    title: 'Jūsų prašymą nagrinėtų VERT',
    body: 'Skundus dėl energetikos įmonių veiklos ir komunalinių paslaugų (dujos, elektra, šiluma, vanduo) priima Valstybinė energetikos reguliavimo taryba.',
    link: { href: 'https://www.vert.lt/Puslapiai/vartotojams/vartotoju-teisiu-apsauga.aspx', label: 'Atidaryti VERT svetainę →' },
  },
  'end-advokatura': {
    icon: '⚖️',
    title: 'Jūsų prašymą nagrinėtų Lietuvos advokatūra',
    body: 'Skundus dėl teisinių paslaugų (advokatų) priima Lietuvos advokatūros advokatų taryba.',
    link: { href: 'https://www.advokatura.lt/duk/', label: 'Atidaryti Advokatūros svetainę →' },
  },
  'end-vmvt': {
    icon: '🥗',
    title: 'Jūsų prašymą nagrinėtų VMVT',
    body: 'Skundus dėl maisto saugos, kokybės ir veterinarinių pažeidimų priima Valstybinė maisto ir veterinarijos tarnyba.',
    link: { href: 'https://vmvt.lrv.lt/lt/visuomenei/praneskite-mums/', label: 'Atidaryti VMVT svetainę →' },
  },
  'end-ecc': {
    icon: '🇪🇺',
    title: 'Kreipkitės į Europos vartotojų centrą',
    body: 'Skundus dėl ES šalių, Norvegijos ir Islandijos įmonių prekių ir paslaugų priima Europos vartotojų centras Lietuvoje (ECC Lietuva).',
    link: { href: 'https://ecc.lt/pateikti-skunda/', label: 'Atidaryti ECC Lietuva svetainę →' },
  },
  'end-kita': {
    icon: '❓',
    title: 'Kitas atvejis',
    body: 'VVTAT nėra įgaliota nagrinėti vartojimo ginčo, kilusio tarp Lietuvos vartotojo ir ne Lietuvoje ar kitoje ES valstybėje narėje, Islandijoje ar Norvegijoje registruoto pardavėjo / paslaugos teikėjo. Kilus ginčui vartotojai turėtų kreiptis į verslininką tiesiogiai, o jei tai nepadeda – į atitinkamą vartotojų teisių apsaugos instituciją pardavėjo šalyje, savo banką (siekiant pasinaudoti pinigų grąžinimu dėl nesąžiningo sandorio).',
  },
  'end-fiz-pardav': {
    icon: '🤝',
    title: 'VVTAT nenagrinėja ginčų tarp privačių asmenų',
    body: 'VVTAT nagrinėja tik ginčus, kilusius tarp fizinių asmenų (vartotojų) ir verslo subjektų. Kilus ginčui tarp privačių asmenų, rekomenduojame kreiptis į bendrosios kompetencijos teismą ar spręsti kilusį ginčą derybų keliu.',
  },
  'end-kaina': {
    icon: '💶',
    title: 'Jei ginčo suma mažesnė nei 20 EUR',
    body: 'VVTAT turi teisę atsisakyti nagrinėti vartojimo ginčą, jei ginčo suma yra mažesnė negu 20 eurų, išskyrus atvejus, kai ginčas turi reikšmės formuojant naują vartotojų teisių apsaugos praktiką ir (ar) yra kitų svarbių aplinkybių',
    next: 's4_subcategory',
  },
  'end-14days': {
    icon: '📬',
    title: 'Pirmiausia kreipkitės į pardavėją / paslaugos teikėją raštu',
    body: 'Prieš teikiant prašymą VVTAT, privalote raštu kreiptis į pardavėją / paslaugos teikėją, nurodyti savo reikalavimą ir suteikti jam 14 kalendorinių dienų atsakyti.\n\nJeigu per 14 dienų pardavėjas nepateiks atsakymo arba atsakymas jūsų netenkins — tuomet jūsų situaciją nagrinės VVTAT.\n\nPatarimas: kreipkitės el. paštu, SMS žinute ar registruotu laišku ir išsisaugokite kopiją.',
  },
  'end-zodziai': {
    icon: '📩',
    title: 'Pirmiausia išsiųskite pretenziją raštu',
    body: 'Ginčo nagrinėjimui būtini rašytiniai įrodymai.\n\n1. Išsiųskite pretenziją el. paštu arba registruotu laišku\n2. Išsaugokite išsiuntimo kopiją\n3. Grįžkite ir pildykite prašymą iš naujo',
  },
  'end-no-evidence': {
    icon: '🔍',
    title: 'Pabandykite atkurti kreipimosi įrodymą',
    body: 'Pabandykite atkurti bent vieną įrodymą:\n• El. laišką arba žinutę\n• Savitarnos pranešimą\n• Registruoto laiško kvitą\n\nSuradę — grįžkite ir pildykite prašymą iš naujo.',
  },
  'end-no-purchase': {
    icon: '🧾',
    title: 'Pirkimo įrodymas būtinas',
    body: 'Pabandykite gauti:\n• Sąskaitą iš pardavėjo\n• Banko išrašą ar pavedimo kvitą\n• Užsakymo patvirtinimą el. paštu\n\nSuradę — grįžkite ir pildykite prašymą iš naujo.',
  },
  'end-adoc-ne': {
    icon: '🖊️',
    title: 'Reikės pagalbos arba kito kreipimosi būdo',
    body: 'Jei negalite pateikti ADoc formato prašymo, galite:\n• Paprašyti artimo žmogaus pagalbos pildant prašymą kompiuteryje\n• Atvykti į VVTAT tiesiogiai\n• Atsisiųsti Word šabloną, atspausdinti ir pateikti fiziškai',
    link: { href: 'Vartotojo-prašymo-forma.docx', label: '⬇ Atsisiųsti Word šabloną' },
  },
};
