'use strict';

const ENDS = {
  'end-rrt': {
    icon: '📡',
    title: 'Jūsų prašymą nagrinėtų RRT',
    body: 'Skundus dėl elektroninių ryšio (interneto, televizijos, mobilaus ryšio) ir pašto paslaugų priima Lietuvos Respublikos ryšių reguliavimo tarnyba (RRT).',
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
    body: 'VVTAT turi teisę atsisakyti nagrinėti vartojimo ginčą, jei ginčo suma yra mažesnė negu 20 eurų, išskyrus atvejus, kai ginčas turi reikšmės formuojant naują vartotojų teisių apsaugos praktiką ir (ar) yra kitų svarbių aplinkybių.',
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
