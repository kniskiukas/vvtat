/* =============================================================
   VVTAT Complaint Wizard — app.js
   ============================================================= */

// ── Storage keys ─────────────────────────────────────────────
const KEY_ANSWERS = 'vvtat_answers_v1';
const KEY_FILES   = 'vvtat_files_v1';
const MAX_MB      = 4;

// ── Phase definitions ─────────────────────────────────────────
const PHASES = [
  { id: 'eligibility', label: 'Tikrinimas',  num: 1 },
  { id: 'category',    label: 'Kategorija',  num: 2 },
  { id: 'documents',   label: 'Dokumentai',  num: 3 },
  { id: 'summary',     label: 'Santrauka',   num: 4 },
];

const PHASE_HERO = {
  eligibility: {
    icon:  '🔍',
    title: 'Tinkamumo tikrinimas',
    sub:   'Pirmiausia nustatysime, ar VVTAT gali jums padėti ir ar esate tinkamoje vietoje.',
  },
  category: {
    icon:  '📋',
    title: 'Ginčo kategorija',
    sub:   'Tiksliau apibūdinkite ginčą, kad galėtume suformuoti tinkamą prašymą.',
  },
  documents: {
    icon:  '📂',
    title: 'Dokumentų rinkimas',
    sub:   'Surinkite reikiamus dokumentus — jie sustiprins jūsų prašymą.',
  },
  summary: {
    icon:  '✅',
    title: 'Prašymo santrauka',
    sub:   'Peržiūrėkite surinktą informaciją ir pereikite prie pateikimo.',
  },
  end: {
    icon:  '↗️',
    title: 'Nukreipiame jus',
    sub:   'Jūsų situaciją nagrinėja kita institucija — žemiau rasite nuorodą.',
  },
};

// ── Step definitions ─────────────────────────────────────────
const STEPS = {

  // ── Eligibility ─────────────────────────────────────────────
  s0: {
    phase: 'eligibility', label: 'Žingsnis 1 / 4',
    question: 'Jūs esate?',
    sub: 'VVTAT nagrinėja tik fizinių asmenų (vartotojų) skundus prieš verslą.',
    options: [
      { id: 'fizinis',   title: 'Fizinis asmuo',    desc: 'Kreipiuosi kaip privatus vartotojas', next: 's1' },
      { id: 'juridinis', title: 'Juridinis asmuo',  desc: 'Atstovauju įmonę ar organizaciją',    next: 'end_juridinis' },
    ],
  },

  s1: {
    phase: 'eligibility', label: 'Žingsnis 2 / 4',
    question: 'Jūs kreipiatės dėl?',
    sub: 'Pasirinkite kategoriją, kuri geriausiai atspindi jūsų situaciją.',
    options: [
      { id: 'rysiai',     title: 'Elektroninių ryšių arba pašto paslaugų', desc: 'Internetas, televizija, mobilusis ryšys, paštas', next: 'end_rrt' },
      { id: 'finansai',   title: 'Finansinių paslaugų', desc: 'Bankai, draudimas, kredito unijos, investicinės įmonės', next: 'end_lb' },
      { id: 'vartojimas', title: 'Vartojimo prekių ar kitų paslaugų', desc: 'Laisvalaikis, turizmas, valymas, remontas, statyba, grožis, medicina ir kt.', next: 's2' },
      { id: 'energetika', title: 'Energetikos įmonių veiklos ar komunalinių paslaugų', desc: 'Dujos, elektra, šiluma, vanduo', next: 'end_vert' },
      { id: 'teisines',   title: 'Teisinių paslaugų (advokatų)',  desc: 'Ginčai dėl advokato suteiktų paslaugų', next: 'end_advokatura' },
      { id: 'maistas',    title: 'Maisto produktų ar veterinarinių paslaugų', desc: 'Maisto sauga, kokybė, veterinarija', next: 'end_vmvt' },
    ],
  },

  s2: {
    phase: 'eligibility', label: 'Žingsnis 3 / 4',
    question: 'Identifikuokite paslaugos teikėją',
    sub: 'Kur yra registruotas pardavėjas arba paslaugos teikėjas?',
    options: [
      { id: 'lt_verslas',   title: 'Lietuvoje registruotas verslas', desc: 'Pardavėjas yra juridinis asmuo, veikiantis Lietuvoje', next: 's3_price' },
      { id: 'eu_verslas',   title: 'ES, Norvegijoje ar Islandijoje registruotas verslas', desc: 'Pardavėjas registruotas kitoje ES šalyje', next: 'end_ecc' },
      { id: 'fiz_pardav',   title: 'Privatus asmuo (neprofesionalus pardavėjas)', desc: 'Pvz. pirkimas iš skelbimų portalo, ne iš verslo', next: 'end_fiz_pardav' },
    ],
  },

  s3_price: {
    phase: 'eligibility', label: 'Žingsnis 4 / 4',
    question: 'Ar jūsų įsigytos prekės ar paslaugos kaina viršija 20 eurų?',
    sub: 'VVTAT nenagrinėja ginčų, kai ginčo suma mažesnė nei 20 eurų.',
    options: [
      { id: 'kaina_taip', title: 'Taip, kaina viršija 20 eurų',    next: 's4_subcategory' },
      { id: 'kaina_ne',   title: 'Ne, kaina neviršija 20 eurų',    next: 'end_kaina' },
    ],
  },

  // ── Category ─────────────────────────────────────────────────
  s4_subcategory: {
    phase: 'category', label: 'Žingsnis 1 / 2',
    question: 'Kokio pobūdžio yra jūsų ginčas?',
    sub: 'Pasirinkite, kuri sritis geriausiai apibūdina problemą.',
    options: [
      { id: 'laisvalaikis', title: 'Laisvalaikio, turizmo arba transporto paslaugos', next: 's5_14days' },
      { id: 'preke',        title: 'Prekė nekokybiška, sugedo arba nepristatyta',     next: 's5_14days' },
      { id: 'valymas',      title: 'Cheminio valymo ar valymo paslaugos',             next: 's5_14days' },
      { id: 'statyba',      title: 'Statybos paslaugos',                              next: 's5_14days' },
      { id: 'grozis',       title: 'Grožio ar sveikatos priežiūros paslaugos',        next: 's5_14days' },
      { id: 'reklama',      title: 'Reklamos paslaugos',                              next: 's5_14days' },
      { id: 'medicina',     title: 'Medicinos prekės',                                next: 's5_14days' },
      { id: 'kita',         title: 'Kita vartojimo paslauga ar prekė',                next: 's5_14days' },
    ],
  },

  s5_14days: {
    phase: 'category', label: 'Žingsnis 2 / 2',
    question: 'Ar jau kreipėtės į pardavėją raštu ir praėjo 14 dienų?',
    sub: 'Prieš kreipiantis į VVTAT, būtina pirmiausia raštu pateikti pretenziją pardavėjui ir suteikti jam 14 kalendorinių dienų atsakyti.',
    info: { type: 'neutral', icon: 'ℹ️', text: '<strong>Pastaba:</strong> Jei nesikreipėte – išsiųskite pretenziją el. paštu arba registruotu laišku, palaukite 14 dienų ir grįžkite.' },
    options: [
      { id: '14d_taip', title: 'Taip – kreipiausi raštu ir praėjo 14 dienų arba negavau atsakymo', next: 'q2_01_adoc' },
      { id: '14d_ne',   title: 'Ne – dar nesikreipiau arba terminas dar nesibaigė',                 next: 'end_14days' },
    ],
  },

  // ── Documents ─────────────────────────────────────────────────
  q2_01_adoc: {
    phase: 'documents', label: 'Dokumentai 1 / 5',
    question: 'Ar galėsite pateikti prašymą ADoc formatu?',
    sub: 'Prašymai VVTAT teikiami elektroniniu parašu pasirašytu dokumentu (ADoc).',
    info: { type: 'blue', icon: '📄', text: '<strong>ADoc</strong> – elektroniniu parašu pasirašyto dokumento formatas. Pasirašoma per <em>Mobile ID</em>, <em>Smart-ID</em> arba USB raktą.' },
    options: [
      { id: 'adoc_taip',    title: 'Taip – turiu el. parašą ir galiu pasirašyti', next: 'q2_02_response' },
      { id: 'adoc_mob',     title: 'Galiu, bet ADoc neatidarau telefone',         desc: 'Rekomenduojame pildyti kompiuteryje', next: 'q2_02_response' },
      { id: 'adoc_nezinau', title: 'Nežinau, kas yra ADoc',                       next: 'q2_01_adoc_explain' },
      { id: 'adoc_ne',      title: 'Ne – neturiu el. parašo arba nemoku',         next: 'end_adoc_ne' },
    ],
  },

  q2_01_adoc_explain: {
    phase: 'documents', label: 'Dokumentai 1 / 5',
    type: 'info',
    question: 'Kas yra ADoc?',
    sub: null,
    infoHTML: `
      <div class="info-box blue">
        <span class="info-box-icon">📄</span>
        <div>
          <strong>ADoc</strong> – tai elektroniniu parašu pasirašyto dokumento formatas.<br><br>
          Dažniausiai jis sukuriamas automatiškai, kai pasirašote prašymą el. parašu
          (pvz., per <em>Mobile ID</em>, <em>Smart-ID</em> ar USB el. parašo raktą).<br><br>
          <strong>Patarimas:</strong> Jei neatidarote telefone – atidarykite kompiuteriu.
        </div>
      </div>`,
    nextLabel: 'Supratau, tęsti',
    next: 'q2_02_response',
  },

  q2_02_response: {
    phase: 'documents', label: 'Dokumentai 2 / 5',
    question: 'Ar turite pardavėjo atsakymą į jūsų pretenziją?',
    sub: 'Pardavėjo atsakymas arba jūsų kreipimosi kopija yra svarbus įrodymas.',
    options: [
      {
        id: 'resp_rastas',
        title: 'Taip – turiu atsakymą raštu',
        desc: 'El. laiškas, oficialus raštas, savitarnos žinutė ar pan.',
        upload: { key: 'atsakymas', label: 'Pridėti atsakymo kopiją', sub: 'PDF, nuotrauka, screenshot (el. laiško, savitarnos žinutės, oficialaus rašto)' },
        next: 'q2_03_purchase',
      },
      {
        id: 'resp_kreipimasis',
        title: 'Ne – neatsakė, bet turiu savo kreipimosi kopiją',
        desc: 'Išsiųsto el. laiško screenshot, registruoto laiško kvitas, savitarnos pranešimas',
        upload: { key: 'kreipimasis', label: 'Pridėti kreipimosi kopiją', sub: 'El. laiško screenshot, registruoto laiško kvitas, savitarnos pranešimas' },
        next: 'q2_03_purchase',
      },
      { id: 'resp_zodziai', title: 'Kreipiausi tik žodžiu arba telefonu', next: 'end_zodziai' },
      { id: 'resp_niekas',  title: 'Neturiu nei atsakymo, nei kreipimosi kopijos', next: 'end_no_evidence' },
    ],
  },

  q2_03_purchase: {
    phase: 'documents', label: 'Dokumentai 3 / 5',
    question: 'Kokį pirkimo dokumentą turite?',
    sub: 'Pirkimo įrodymas yra būtinas prašymui.',
    options: [
      {
        id: 'purch_sutartis',
        title: 'Sutartis arba užsakymo / pirkimo patvirtinimas',
        desc: 'PVM sąskaita faktūra, sąskaita, mokėjimo kortelės čekis ir pan.',
        upload: { key: 'pirkimas', label: 'Pridėti sutartį arba patvirtinimą', sub: 'PDF, nuotrauka arba screenshot' },
        next: 'q2_04_problem',
      },
      {
        id: 'purch_kvitas',
        title: 'Sąskaita faktūra arba kvitas',
        upload: { key: 'pirkimas', label: 'Pridėti sąskaitos arba kvito kopiją', sub: 'PDF arba nuotrauka' },
        next: 'q2_04_problem',
      },
      {
        id: 'purch_bankas',
        title: 'Tik banko mokėjimo įrodymas',
        desc: 'Banko sąskaitos išrašas arba pavedimo kvitas',
        upload: { key: 'pirkimas', label: 'Pridėti banko išrašą arba pavedimo kvitą', sub: 'PDF arba screenshot' },
        next: 'q2_04_problem',
      },
      { id: 'purch_nieko', title: 'Nieko neturiu', next: 'end_no_purchase' },
    ],
  },

  q2_04_problem: {
    phase: 'documents', label: 'Dokumentai 4 / 5',
    question: 'Kokie buvo pastebėti trūkumai ar problemos?',
    sub: 'Pasirinkite situaciją – ji lems, kokius įrodymus rekomenduosime pridėti.',
    options: [
      {
        id: 'prob_nekokybiska',
        title: 'Prekė nekokybiška arba sugedo',
        desc: 'Rekomenduojama: nuotrauka / video, serviso išvada, garantinis aktas',
        upload: { key: 'problema', label: 'Pridėti trūkumo įrodymus', sub: 'Nuotrauka, video, serviso išvada, garantinis aktas' },
        next: 'q2_06_damages',
      },
      {
        id: 'prob_paslauga',
        title: 'Paslauga atlikta nekokybiškai',
        desc: 'Rekomenduojama: sutartis, darbų aktai, susirašinėjimas, nuotraukos',
        upload: { key: 'problema', label: 'Pridėti paslaugos įrodymus', sub: 'Sutartis, darbų aktai, nuotraukos prieš / po, susirašinėjimas' },
        next: 'q2_06_damages',
      },
      {
        id: 'prob_pristatymas',
        title: 'Nepristatė arba vėluoja pristatymas',
        desc: 'Rekomenduojama: užsakymo patvirtinimas, susirašinėjimas, siuntos sekimas',
        upload: { key: 'problema', label: 'Pridėti pristatymo įrodymus', sub: 'Užsakymo patvirtinimas, susirašinėjimas, siuntos sekimo screenshot' },
        next: 'q2_06_damages',
      },
      {
        id: 'prob_pinigai',
        title: 'Negrąžina pinigų arba atsisako tenkinti pretenziją',
        desc: 'Rekomenduojama: pretenzija + atsakymas, mokėjimo įrodymas',
        upload: { key: 'problema', label: 'Pridėti įrodymus', sub: 'Pretenzija, atsakymas, mokėjimo patvirtinimas, susirašinėjimas' },
        next: 'q2_06_damages',
      },
      {
        id: 'prob_kita',
        title: 'Kita',
        desc: 'Pridėkite įrodymus, aiškiai parodančius aplinkybes',
        upload: { key: 'problema', label: 'Pridėti turimus įrodymus', sub: 'Nuotraukos, susirašinėjimas, dokumentai' },
        next: 'q2_06_damages',
      },
    ],
  },

  q2_06_damages: {
    phase: 'documents', label: 'Dokumentai 5 / 5',
    question: 'Ar patyrėte papildomų nuostolių (žalą)?',
    sub: 'Pvz. mokėjote už remontą, ekspertizę, papildomą siuntimą ar panašiai.',
    options: [
      {
        id: 'dmg_taip',
        title: 'Taip – patyriau papildomų nuostolių',
        desc: 'Pridėkite žalos įrodymus: sąskaitas, kvitus, pavedimų patvirtinimus',
        upload: { key: 'zala', label: 'Pridėti žalos įrodymus', sub: 'Sąskaitos, kvitai, ekspertizės aktas, pavedimų patvirtinimai' },
        next: 'summary',
      },
      { id: 'dmg_ne',     title: 'Ne – papildomų nuostolių nepatyriau', next: 'summary' },
      { id: 'dmg_nezinau', title: 'Nežinau – žalą galėsiu patikslinti vėliau', next: 'summary' },
    ],
  },

  summary: {
    phase: 'summary', label: 'Santrauka',
    type: 'summary',
    question: 'Jūsų prašymo santrauka',
    sub: 'Patikrinkite surinktą informaciją prieš pateikdami prašymą VVTAT.',
  },
};

// ── End states ────────────────────────────────────────────────
const ENDS = {
  end_juridinis: {
    icon: '🏢', phase: 'end',
    title: 'Juridiniams asmenims negalime padėti',
    body: 'Valstybinė vartotojų teisių apsaugos tarnyba nagrinėja tik fizinių asmenų (vartotojų) skundus prieš verslą.\n\nJuridiniams asmenims rekomenduojame kreiptis į teismą arba tarpininkavimo paslaugas.',
  },
  end_rrt: {
    icon: '📡', phase: 'end',
    title: 'Jūsų skundą nagrinėja RRT',
    body: 'Skundus dėl elektroninių ryšio ir pašto paslaugų (interneto, televizijos, mobilaus ryšio) priima Lietuvos Respublikos ryšių reguliavimo tarnyba.',
    url: 'https://rrt.lt/', urlLabel: 'Atidaryti RRT svetainę →',
  },
  end_lb: {
    icon: '🏦', phase: 'end',
    title: 'Jūsų skundą nagrinėja Lietuvos bankas',
    body: 'Skundus dėl finansinių paslaugų (bankai, draudimas, kredito unijos, investiciniai fondai ir kt.) priima Lietuvos bankas.',
    url: 'https://www.lb.lt/', urlLabel: 'Atidaryti Lietuvos banko svetainę →',
  },
  end_vert: {
    icon: '⚡', phase: 'end',
    title: 'Jūsų skundą nagrinėja VERT',
    body: 'Skundus dėl energetikos įmonių veiklos ir komunalinių paslaugų (dujos, elektra, šiluma, vanduo) priima Valstybinė energetikos reguliavimo taryba.',
    url: 'https://www.vert.lt/Puslapiai/default.aspx', urlLabel: 'Atidaryti VERT svetainę →',
  },
  end_advokatura: {
    icon: '⚖️', phase: 'end',
    title: 'Jūsų skundą nagrinėja Lietuvos advokatūra',
    body: 'Ginčus dėl teisinių paslaugų (advokatų) nagrinėja Lietuvos advokatūros advokatų taryba.',
    url: 'https://www.advokatura.lt/', urlLabel: 'Atidaryti Advokatūros svetainę →',
  },
  end_vmvt: {
    icon: '🥗', phase: 'end',
    title: 'Jūsų skundą nagrinėja VMVT',
    body: 'Skundus dėl maisto saugos, kokybės ir veterinarinių pažeidimų priima Valstybinė maisto ir veterinarijos tarnyba.',
    url: 'https://vmvt.lrv.lt/lt/', urlLabel: 'Atidaryti VMVT svetainę →',
  },
  end_ecc: {
    icon: '🇪🇺', phase: 'end',
    title: 'Kreipkitės į Europos vartotojų centrą',
    body: 'Skundus dėl ES šalių, Norvegijos ir Islandijos įmonių nagrinėja Europos vartotojų centras Lietuvoje (ECC Lietuva).',
    url: 'https://ecc.lt/', urlLabel: 'Atidaryti ECC Lietuva svetainę →',
  },
  end_fiz_pardav: {
    icon: '🤝', phase: 'end',
    title: 'VVTAT nenagrinėja ginčų tarp privačių asmenų',
    body: 'Valstybinė vartotojų teisių apsaugos tarnyba nagrinėja tik ginčus tarp vartotojo ir verslo (juridinio asmens).\n\nGinčai tarp privačių asmenų nagrinėjami teisme.',
  },
  end_kaina: {
    icon: '💶', phase: 'end',
    title: 'Ginčo suma per maža',
    body: 'VVTAT nenagrinėja ginčų, kai ginčo suma mažesnė nei 20 eurų.\n\nGalite bandyti spręsti ginčą tiesiogiai su pardavėju arba kreiptis į teismą.',
  },
  end_14days: {
    icon: '📬', phase: 'end',
    title: 'Pirmiausia kreipkitės į pardavėją raštu',
    body: 'Prieš teikiant skundą VVTAT, privalote raštu kreiptis į pardavėją ir suteikti jam 14 kalendorinių dienų atsakyti.\n\nJeigu per 14 dienų pardavėjas nepateiks atsakymo arba atsakymas jūsų netenkins — tuomet turėsite teisę kreiptis į VVTAT.\n\nPatarimas: siųskite el. paštu arba registruotu laišku ir išsaugokite kopiją.',
    canReturn: true,
  },
  end_adoc_ne: {
    icon: '🖊️', phase: 'end',
    title: 'Reikės pagalbos arba kito kreipimosi būdo',
    body: 'Jei negalite pateikti ADoc formato prašymo, galite:\n\n• Paprašyti artimo žmogaus pagalbos pildant prašymą kompiuteryje\n• Atvykti į VVTAT tiesiogiai\n• Atsisiųsti Word šabloną, atspausdinti ir pateikti fiziškai',
    canReturn: true,
  },
  end_zodziai: {
    icon: '📩', phase: 'end',
    title: 'Pirmiausia išsiųskite pretenziją raštu',
    body: 'Žodinis kreipimasis netinka kaip įrodymas.\n\n1. Išsiųskite pretenziją el. paštu arba registruotu laišku\n2. Išsaugokite išsiuntimo kopiją\n3. Grįžkite ir pildykite prašymą iš naujo',
    canReturn: true,
  },
  end_no_evidence: {
    icon: '🔍', phase: 'end',
    title: 'Pabandykite atkurti kreipimosi įrodymą',
    body: 'Pabandykite atkurti bent vieną įrodymą:\n\n• El. laišką arba žinutę\n• Savitarnos pranešimą\n• Registruoto laiško kvitą\n\nSuradę — grįžkite ir pildykite prašymą iš naujo.',
    canReturn: true,
  },
  end_no_purchase: {
    icon: '🧾', phase: 'end',
    title: 'Pirkimo įrodymas būtinas',
    body: 'Bent vienas pirkimo įrodymas yra beveik visada būtinas.\n\nPabandykite gauti:\n• Sąskaitą iš pardavėjo\n• Banko išrašą ar pavedimo kvitą\n• Užsakymo patvirtinimą el. paštu\n\nSuradę — grįžkite ir pildykite prašymą iš naujo.',
    canReturn: true,
  },
};

// ── Answer display labels ─────────────────────────────────────
const ANSWER_LABELS = {
  fizinis: 'Fizinis asmuo', juridinis: 'Juridinis asmuo',
  rysiai: 'Elektroniniai ryšiai / paštas', finansai: 'Finansinės paslaugos',
  vartojimas: 'Vartojimo prekės / paslaugos', energetika: 'Energetika / komunalinės',
  teisines: 'Teisinės paslaugos', maistas: 'Maistas / veterinarija',
  lt_verslas: 'Lietuva', eu_verslas: 'ES / Norvegija / Islandija', fiz_pardav: 'Privatus pardavėjas',
  kaina_taip: 'Taip (> 20 €)', kaina_ne: 'Ne (≤ 20 €)',
  laisvalaikis: 'Laisvalaikis / turizmas / transportas', preke: 'Nekokybiškas produktas',
  valymas: 'Valymo paslaugos', statyba: 'Statybos paslaugos',
  grozis: 'Grožis / sveikata', reklama: 'Reklama',
  medicina: 'Medicinos prekės', kita: 'Kita',
  '14d_taip': 'Taip – kreipiausi, praėjo 14 d.',  '14d_ne': 'Ne',
  adoc_taip: 'Taip – turiu el. parašą', adoc_mob: 'Galiu (kompiuteriu)',
  adoc_nezinau: 'Sužinojau, tęsiu', adoc_ne: 'Ne – neturiu el. parašo',
  resp_rastas: 'Taip – turiu atsakymą raštu', resp_kreipimasis: 'Kreipiausi, bet neatsakė',
  resp_zodziai: 'Tik žodžiu / telefonu', resp_niekas: 'Neturiu jokių dokumentų',
  purch_sutartis: 'Sutartis / patvirtinimas', purch_kvitas: 'Sąskaita / kvitas',
  purch_bankas: 'Banko mokėjimo įrodymas', purch_nieko: 'Nieko neturiu',
  prob_nekokybiska: 'Nekokybiška prekė', prob_paslauga: 'Nekokybiškas paslaugos atlikimas',
  prob_pristatymas: 'Nepristatyta / vėluoja', prob_pinigai: 'Negrąžina pinigų',
  prob_kita: 'Kita',
  dmg_taip: 'Taip – patyriau nuostolių', dmg_ne: 'Ne', dmg_nezinau: 'Nežinau',
};

const STEP_LABELS = {
  s0: 'Asmens tipas', s1: 'Kategorija', s2: 'Paslaugos teikėjas',
  s3_price: 'Kaina', s4_subcategory: 'Ginčo pobūdis', s5_14days: 'Kreipimasis į pardavėją',
  q2_01_adoc: 'ADoc galimybė', q2_01_adoc_explain: 'ADoc galimybė',
  q2_02_response: 'Pardavėjo atsakymas', q2_03_purchase: 'Pirkimo dokumentas',
  q2_04_problem: 'Trūkumai / problemos', q2_06_damages: 'Papildomi nuostoliai',
};

// ── State ─────────────────────────────────────────────────────
const state = {
  history: [],          // step id stack
  answers: {},          // stepId -> optionId
  direction: 'forward', // 'forward' | 'back'
};

// File store: key -> [{ name, size, type, dataUrl? }]
// In-memory + mirrored to localStorage where possible
const fileStore = {};

// ── Storage helpers ───────────────────────────────────────────
function saveAnswers() {
  try { localStorage.setItem(KEY_ANSWERS, JSON.stringify(state.answers)); } catch(_) {}
}

function loadAnswers() {
  try {
    const raw = localStorage.getItem(KEY_ANSWERS);
    if (raw) Object.assign(state.answers, JSON.parse(raw));
  } catch(_) {}
}

function saveFiles() {
  try {
    // Store only metadata if too large; full data otherwise
    const slim = {};
    for (const [k, arr] of Object.entries(fileStore)) {
      slim[k] = arr.map(f => ({ name: f.name, size: f.size, type: f.type, dataUrl: f.dataUrl }));
    }
    localStorage.setItem(KEY_FILES, JSON.stringify(slim));
  } catch(e) {
    // localStorage full — store metadata only
    try {
      const meta = {};
      for (const [k, arr] of Object.entries(fileStore)) {
        meta[k] = arr.map(f => ({ name: f.name, size: f.size, type: f.type }));
      }
      localStorage.setItem(KEY_FILES, JSON.stringify(meta));
    } catch(_) {}
  }
}

function loadFiles() {
  try {
    const raw = localStorage.getItem(KEY_FILES);
    if (raw) {
      const parsed = JSON.parse(raw);
      for (const [k, arr] of Object.entries(parsed)) {
        fileStore[k] = arr;
      }
    }
  } catch(_) {}
}

// ── Router ────────────────────────────────────────────────────
function navigate(stepId, direction = 'forward') {
  state.direction = direction;
  window.location.hash = stepId;
}

function goBack() {
  const prev = state.history.pop();
  if (!prev) return;
  navigate(prev, 'back');
}

function restart() {
  state.history = [];
  state.answers = {};
  state.direction = 'forward';
  for (const k of Object.keys(fileStore)) delete fileStore[k];
  try { localStorage.removeItem(KEY_ANSWERS); localStorage.removeItem(KEY_FILES); } catch(_) {}
  navigate('s0');
}

window.addEventListener('hashchange', () => {
  const stepId = window.location.hash.slice(1) || 's0';
  render(stepId);
});

// ── Hero updater ──────────────────────────────────────────────
let currentHeroPhase = null;

function updateHero(phase) {
  const h = PHASE_HERO[phase] || PHASE_HERO.end;
  const hero = document.getElementById('hero');
  if (currentHeroPhase !== phase) {
    document.getElementById('heroIcon').textContent  = h.icon;
    document.getElementById('heroTitle').textContent = h.title;
    document.getElementById('heroSub').textContent   = h.sub;
    hero.className = 'hero phase-' + phase;
    currentHeroPhase = phase;
  }
  updatePhaseNav(phase);
}

function updatePhaseNav(activePhase) {
  const phaseOrder = ['eligibility', 'category', 'documents', 'summary'];
  const activeIdx = phaseOrder.indexOf(activePhase);
  const nav = document.getElementById('phaseNav');
  nav.innerHTML = PHASES.map((p, i) => {
    const isDone   = i < activeIdx;
    const isActive = p.id === activePhase;
    const cls = isDone ? 'done' : isActive ? 'active' : '';
    const arrow = i < PHASES.length - 1
      ? `<span class="phase-arrow">›</span>` : '';
    return `
      <div class="phase-step ${cls}">
        <span class="phase-step-inner">
          <span class="phase-dot">${isDone ? '✓' : p.num}</span>
          <span>${p.label}</span>
        </span>
        ${arrow}
      </div>`;
  }).join('');
}

// ── Render dispatcher ─────────────────────────────────────────
function render(stepId) {
  if (!stepId || stepId === '') { stepId = 's0'; }

  // Track history (only push if navigating forward to a new step)
  if (state.direction === 'forward') {
    const prev = state.history[state.history.length - 1];
    if (prev !== stepId) state.history.push(stepId);
  }

  if (ENDS[stepId])       { renderEnd(stepId); return; }
  const step = STEPS[stepId];
  if (!step) return;

  updateHero(step.phase);

  if (step.type === 'summary') { renderSummary(); return; }
  if (step.type === 'info')    { renderInfo(stepId, step); return; }
  renderChoice(stepId, step);
}

// ── Choice step ───────────────────────────────────────────────
function renderChoice(stepId, step) {
  const selected   = state.answers[stepId];
  const selectedOp = step.options.find(o => o.id === selected);
  const slideClass = state.direction === 'back' ? 'slide-right' : 'slide-left';

  const infoHTML = step.info
    ? `<div class="info-box ${step.info.type}" style="margin-bottom:18px">
         <span class="info-box-icon">${step.info.icon}</span>
         <div>${step.info.text}</div>
       </div>`
    : '';

  const optionsHTML = step.options.map((opt, i) => `
    <button class="option-btn ${selected === opt.id ? 'selected' : ''}"
            onclick="selectOption('${stepId}', '${opt.id}')">
      <span class="option-marker">${String.fromCharCode(65 + i)}</span>
      <span class="option-body">
        <span class="option-title">${opt.title}</span>
        ${opt.desc ? `<span class="option-desc">${opt.desc}</span>` : ''}
      </span>
    </button>`).join('');

  const uploadHTML = (selected && selectedOp && selectedOp.upload)
    ? buildUploadSection(selectedOp.upload.key, selectedOp.upload.label, selectedOp.upload.sub)
    : '';

  const canBack = state.history.length > 1;

  document.getElementById('app').innerHTML = `
    <div class="card ${slideClass}">
      <div class="step-label">${step.label}</div>
      <div class="question">${step.question}</div>
      ${step.sub ? `<div class="question-sub">${step.sub}</div>` : ''}
      ${infoHTML}
      <div class="options">${optionsHTML}</div>
      ${uploadHTML}
      <div class="actions">
        ${canBack ? `<button class="btn-back" onclick="goBack()">← Atgal</button>` : ''}
        <button class="btn-next" id="btnNext"
                onclick="advance('${stepId}')"
                ${!selected ? 'disabled' : ''}>
          Tęsti →
        </button>
      </div>
    </div>`;

  if (selected && selectedOp && selectedOp.upload) {
    attachDragDrop(selectedOp.upload.key);
  }
}

// ── Info step ─────────────────────────────────────────────────
function renderInfo(stepId, step) {
  const canBack = state.history.length > 1;
  const slideClass = state.direction === 'back' ? 'slide-right' : 'slide-left';
  document.getElementById('app').innerHTML = `
    <div class="card ${slideClass}">
      <div class="step-label">${step.label}</div>
      <div class="question">${step.question}</div>
      <div class="info-page-body">${step.infoHTML}</div>
      <div class="actions">
        ${canBack ? `<button class="btn-back" onclick="goBack()">← Atgal</button>` : ''}
        <button class="btn-next" onclick="navigate('${step.next}')">
          ${step.nextLabel || 'Tęsti →'}
        </button>
      </div>
    </div>`;
}

// ── End state ─────────────────────────────────────────────────
function renderEnd(endId) {
  const e = ENDS[endId];
  updateHero(e.phase || 'end');
  const canBack = state.history.length > 1;
  document.getElementById('app').innerHTML = `
    <div class="end-card">
      <div class="end-icon">${e.icon}</div>
      <div class="end-title">${e.title}</div>
      <div class="end-body">${e.body}</div>
      <div class="end-actions">
        ${e.url ? `<a href="${e.url}" target="_blank" rel="noopener" class="btn-external">${e.urlLabel}</a>` : ''}
        ${canBack ? `<button class="btn-ghost" onclick="goBack()">← Atgal</button>` : ''}
        <button class="btn-ghost" onclick="restart()">↩ Pradėti iš naujo</button>
      </div>
    </div>`;
}

// ── Summary ───────────────────────────────────────────────────
function renderSummary() {
  updateHero('summary');
  const canBack = state.history.length > 1;
  const slideClass = state.direction === 'back' ? 'slide-right' : 'slide-left';

  const answerRows = Object.entries(state.answers)
    .filter(([k]) => STEP_LABELS[k])
    .map(([stepId, optId]) => `
      <div class="summary-item">
        <div class="summary-key">${STEP_LABELS[stepId]}</div>
        <div class="summary-val">${ANSWER_LABELS[optId] || optId}</div>
      </div>`).join('');

  const allFiles = Object.entries(fileStore).flatMap(([k, arr]) =>
    (arr || []).map(f => ({ group: k, ...f }))
  );
  const filesHTML = allFiles.length
    ? `<div class="summary-files">
         <div class="summary-files-title">📎 Pridėti dokumentai (${allFiles.length})</div>
         <div>${allFiles.map(f => `
           <span class="summary-file-chip">
             ${fileIcon(f.name)} ${f.name}
             ${f.size ? `<span style="opacity:.6;font-size:10px">${fmtSize(f.size)}</span>` : ''}
           </span>`).join('')}
         </div>
       </div>`
    : `<div class="info-box neutral">
         <span class="info-box-icon">⚠️</span>
         <div>Nepridėjote jokių dokumentų. Rekomenduojame pridėti bent pirkimo įrodymą ir pardavėjo atsakymą prieš teikiant prašymą.</div>
       </div>`;

  document.getElementById('app').innerHTML = `
    <div class="card ${slideClass}">
      <div class="step-label">Santrauka</div>
      <div class="question">Jūsų prašymo santrauka</div>
      <div class="question-sub">${STEPS.summary.sub}</div>

      <div class="summary-grid">${answerRows}</div>
      <hr class="section-divider">
      ${filesHTML}

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
          ${canBack ? `<button class="btn-back" onclick="goBack()">← Atgal</button>` : ''}
          <a href="https://www.vvtat.lt/vartotojams/skundu-pateikimas/392"
             target="_blank" rel="noopener" class="btn-next">
            Pateikti prašymą VVTAT →
          </a>
        </div>
        <div style="text-align:center;margin-top:14px">
          <button class="btn-ghost" onclick="restart()">↩ Pradėti iš naujo</button>
        </div>
      </div>
    </div>`;
}

// ── Option selection ──────────────────────────────────────────
function selectOption(stepId, optId) {
  const prev = state.answers[stepId];
  state.answers[stepId] = optId;
  saveAnswers();

  // If selection changed, clear any previously uploaded files for the old option's upload key
  if (prev && prev !== optId) {
    const step = STEPS[stepId];
    const prevOpt = step && step.options.find(o => o.id === prev);
    if (prevOpt && prevOpt.upload && prevOpt.upload.key) {
      fileStore[prevOpt.upload.key] = [];
      saveFiles();
    }
  }

  // Re-render in place (same direction, no history push)
  const savedDir = state.direction;
  state.direction = 'forward';
  const step = STEPS[stepId];
  renderChoice(stepId, step);
  state.direction = savedDir;
}

function advance(stepId) {
  const selected = state.answers[stepId];
  if (!selected) return;
  const step = STEPS[stepId];
  const opt  = step.options.find(o => o.id === selected);
  if (!opt) return;
  navigate(opt.next);
}

// ── File upload ───────────────────────────────────────────────
function buildUploadSection(key, label, sub) {
  const files = fileStore[key] || [];
  const listHTML = files.map((f, i) => fileItemHTML(key, i, f)).join('');
  return `
    <div class="upload-section">
      <span class="upload-label">${label}</span>
      <span class="upload-sublabel">${sub}</span>
      <div class="upload-zone" id="zone_${key}">
        <input type="file" multiple accept="image/*,.pdf,.doc,.docx"
               onchange="handleFileInput('${key}', this)">
        <div class="upload-zone-icon">📎</div>
        <p><strong>Pasirinkite failus</strong> arba nutempkite čia</p>
        <span>PDF, nuotrauka, screenshot · maks. ${MAX_MB} MB vienas failas</span>
      </div>
      <div class="file-list" id="list_${key}">${listHTML}</div>
    </div>`;
}

function fileItemHTML(key, idx, f) {
  return `
    <div class="file-item" id="fi_${key}_${idx}">
      <span class="file-icon">${fileIcon(f.name)}</span>
      <span class="file-name">${f.name}</span>
      <span class="file-size">${fmtSize(f.size)}</span>
      <button class="file-remove" onclick="removeFile('${key}',${idx})" title="Pašalinti">✕</button>
    </div>`;
}

function fileIcon(name) {
  const ext = (name || '').split('.').pop().toLowerCase();
  if (['jpg','jpeg','png','gif','webp','heic'].includes(ext)) return '🖼️';
  if (ext === 'pdf') return '📕';
  if (['doc','docx'].includes(ext)) return '📄';
  return '📎';
}

function fmtSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function handleFileInput(key, input) {
  addFiles(key, Array.from(input.files));
  input.value = '';
}

function addFiles(key, files) {
  if (!fileStore[key]) fileStore[key] = [];
  const maxBytes = MAX_MB * 1024 * 1024;
  let warned = false;

  for (const file of files) {
    if (file.size > maxBytes) {
      alert(`Failas „${file.name}" yra per didelis (maks. ${MAX_MB} MB).`);
      continue;
    }
    const entry = { name: file.name, size: file.size, type: file.type };
    fileStore[key].push(entry);

    // Read as base64 for localStorage
    const reader = new FileReader();
    const idx = fileStore[key].length - 1;
    reader.onload = (e) => {
      if (fileStore[key] && fileStore[key][idx]) {
        fileStore[key][idx].dataUrl = e.target.result;
        saveFiles();
      }
    };
    reader.readAsDataURL(file);
  }

  refreshFileList(key);
  saveFiles();
}

function removeFile(key, idx) {
  if (fileStore[key]) fileStore[key].splice(idx, 1);
  refreshFileList(key);
  saveFiles();
}

function refreshFileList(key) {
  const list = document.getElementById('list_' + key);
  if (!list) return;
  const files = fileStore[key] || [];
  list.innerHTML = files.map((f, i) => fileItemHTML(key, i, f)).join('');
}

function attachDragDrop(key) {
  const zone = document.getElementById('zone_' + key);
  if (!zone) return;
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    addFiles(key, Array.from(e.dataTransfer.files));
  });
}

// ── Init ──────────────────────────────────────────────────────
loadAnswers();
loadFiles();

const initial = window.location.hash.slice(1) || 's0';
render(initial);
