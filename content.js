// ═══ CONȚINUTUL CURSULUI ═══
// Varianta de bază, construită din modules.js. Când administratorii salvează din panoul /admin/,
// site-ul folosește versiunea din baza de date (tabelul site_content), iar aceasta rămâne doar rezervă.
(() => {
  const M = window.MODULES || [];
  const L = i => ({id: "m" + (i + 1), t: M[i].t, d: M[i].d, html: M[i].html, q: M[i].q});
  window.DEFAULT_CONTENT = {
    site: {
      name: "Școala Voluntarilor",
      lede: "Un curs scurt pentru voluntarii corului și ai evenimentelor pentru tineri din Timișoara: {n} lecții, câte un test și un certificat la final.",
      heroImg: "assets/dom-vedere-interioara.jpg",
      heroAlt: "Nava Domului romano-catolic Sfântul Gheorghe din Timișoara",
      introTitle: "Pregătit pentru orice seară",
      introText: "Concertele, slujbele de sărbători și întâlnirile cu tinerii merg bine când fiecare voluntar știe ce are de făcut. Cursul acesta te pregătește, în ritmul tău, de pe telefon.",
      topicsTitle: "Ce vei ști să faci",
      topicsImg: "assets/domul-romano-catolic-din-timisoara-2023-img.jpg",
      topicsAlt: "Fațada Domului romano-catolic din Timișoara",
      topicsCap: "Domul din Piața Unirii, Timișoara, 2023",
      topics: "Să primești publicul\nsă găsești un copil pierdut\nsă ții culoarele libere\nsă suni corect la 112\nsă ajuți un om care leșină\nsă asculți pe cineva care suferă\nsă calmezi o ceartă\nsă protejezi tinerii\nsă faci poze cu acord\nsă ajuți o persoană în scaun cu rotile\nsă lucrezi în echipă",
      footTitle: "Mulțumim că slujești",
      footText: "Fiecare concert și fiecare întâlnire cu tinerii se sprijină pe oameni care vin mai devreme și pleacă ultimii. Ai o întrebare sau o idee pentru o lecție nouă? Scrie-ne.",
      email: "cornelmrn18@gmail.com",
      stampImg: "assets/timisoara-biserica-millennium.jpg",
      stampAlt: "Biserica Millennium din Fabric, Timișoara",
      coordinator: "",
      credits: "Fotografii: „Dom - vedere interioara” de Popescu Camelia, CC BY-SA 3.0; „April 2023 - Piața Unirii din Timișoara - img 03” și „Domul Romano-Catolic din Timișoara (2023) - IMG 06” de Chainwit., CC BY 4.0 / CC BY-SA 4.0; Piața Unirii 1937, Willy Pragher, Landesarchiv Baden-Württemberg, CC BY 3.0; „Piarist Church, Timișoara (2023) - img 12” de Chainwit., CC BY 4.0; „Timisoara, biserica Millennium” de Turbojet, CC BY-SA 4.0. Toate prin Wikimedia Commons. Fotografia corului: arhiva corului.",
    },
    chapters: [
      {id: "echipa", t: "Echipa", d: "Cine suntem, ce spune legea și cum lucrăm împreună.", tone: "paper",
       img: "assets/april-2023-piata-unirii-din-timisoara-img.jpg", alt: "Piața Unirii din Timișoara, cu Domul romano-catolic", cap: "Piața Unirii, Timișoara, 2023", lessons: [0, 1, 5].map(L)},
      {id: "concertul", t: "Concertul", d: "Primirea publicului, focul și aglomerația, oamenii care au nevoie de ajutor.", tone: "tan",
       img: "assets/corul-cantand.jpg", alt: "Membrii corului cântând împreună într-o capelă, în fața dirijorului", cap: "Corul, cântând într-o capelă", lessons: [3, 8, 13].map(L)},
      {id: "tinerii", t: "Tinerii", d: "Evenimentele pentru adolescenți și tot ce îi ține în siguranță.", tone: "oak",
       img: "assets/landesarchiv-baden-wuerttemberg-staatsarchiv-freiburg-w-134.jpg", alt: "Piața Unirii și Domul din Timișoara într-o fotografie alb-negru din 1937", cap: "Piața Unirii, aprilie 1937", lessons: [4, 2, 7, 10, 12].map(L)},
      {id: "greu", t: "Când e greu", d: "Urgențe, oameni în suferință și conflicte. Ce faci în primele minute.", tone: "walnut",
       img: "assets/piarist-church-timisoara-2023-img-12.jpg", alt: "Biserica Piariștilor din Timișoara, cu turnul ei înalt", cap: "Biserica Piariștilor, Timișoara, 2023", lessons: [6, 9, 11].map(L)},
    ],
  };

  // the four folder colours an admin can pick for a chapter
  window.TONES = {
    paper:  {name: "Hârtie",     tone: "var(--f1)", ink: "var(--paper-ink)",  tab: "var(--f4)",    tabInk: "var(--ink)"},
    tan:    {name: "Bej",        tone: "var(--f2)", ink: "var(--accent-ink)", tab: "var(--paper)", tabInk: "var(--paper-ink)"},
    oak:    {name: "Stejar",     tone: "var(--f3)", ink: "var(--accent-ink)", tab: "var(--bg)",    tabInk: "var(--ink)"},
    walnut: {name: "Nuc închis", tone: "var(--f4)", ink: "var(--ink)",        tab: "var(--f2)",    tabInk: "var(--accent-ink)", dark: true},
  };

  // Lesson text comes from the database, so only a small set of tags survives (no scripts, no styles, no event handlers).
  const ALLOW = {H3: [], P: ["class"], UL: [], OL: [], LI: [], B: [], STRONG: [], I: [], EM: [], BR: [], DIV: ["class"], A: ["href"]};
  window.cleanHTML = html => {
    const doc = new DOMParser().parseFromString(`<div>${html || ""}</div>`, "text/html"), root = doc.body.firstChild;
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) return;
      if (n.nodeType !== 1 || !ALLOW[n.tagName]) { if (n.nodeType === 1 && !["SCRIPT", "STYLE", "IFRAME", "OBJECT"].includes(n.tagName)) { walk(n); n.replaceWith(...n.childNodes); } else n.remove(); return; }
      [...n.attributes].forEach(a => { if (!ALLOW[n.tagName].includes(a.name)) n.removeAttribute(a.name); });
      if (n.tagName === "A" && !/^(https?:|mailto:|tel:|#)/i.test(n.getAttribute("href") || "")) n.removeAttribute("href");
      if (n.hasAttribute("class") && !["tip", "small"].includes(n.getAttribute("class"))) n.removeAttribute("class");
      walk(n);
    });
    walk(root);
    return root.innerHTML;
  };
})();
