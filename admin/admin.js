// ═══ PANOUL DE ADMINISTRARE ═══
// Editează tot cursul (site, capitole, lecții, teste, fotografii) și lista de administratori.
// Accesul e verificat de două ori: aici (is_leader) și în baza de date (regulile din supabase-admin.sql).
const C = window.CONFIG || {}, A = document.getElementById("adm");
const sb = C.SUPABASE_URL && C.SUPABASE_ANON_KEY && window.supabase ? window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY) : null;
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const clone = o => JSON.parse(JSON.stringify(o));
const src = p => !p ? "" : /^(https?:|data:|blob:)/.test(p) ? p : "../" + p;
const BUNDLED = ["dom-vedere-interioara.jpg", "april-2023-piata-unirii-din-timisoara-img.jpg", "corul-cantand.jpg", "landesarchiv-baden-wuerttemberg-staatsarchiv-freiburg-w-134.jpg",
  "piarist-church-timisoara-2023-img-12.jpg", "domul-romano-catolic-din-timisoara-2023-img.jpg", "timisoara-biserica-millennium.jpg"].map(f => "assets/" + f);
const ICON = {
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>', down: '<path d="M12 5v14M6 13l6 6 6-6"/>', del: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', save: '<path d="M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6"/>', eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  img: '<path d="M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4"/><circle cx="15" cy="9" r="1.5"/>', close: '<path d="M6 6l12 12M18 6L6 18"/>', back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
};
const ic = n => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;
const TABS = [["site", "Pagina principală"], ["curs", "Capitole și lecții"], ["foto", "Fotografii"], ["admini", "Administratori"], ["istoric", "Istoric și copii"]];

let session = null, draft = null, saved = "", updatedAt = null, tab = "curs", sel = {ci: 0, li: -1}, uploads = [], toastT = 0;
const dirty = () => draft && JSON.stringify(draft) !== saved;
const me = () => session?.user?.email || "";

function toast(t, err){
  let el = document.getElementById("toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
  el.className = "toast" + (err ? " err" : ""); el.textContent = t; el.hidden = false;
  clearTimeout(toastT); toastT = setTimeout(() => { el.hidden = true; }, err ? 7000 : 3500);
}
addEventListener("beforeunload", e => { if (dirty()) { e.preventDefault(); e.returnValue = ""; } });

// ─── ACCES ───
function loginView(msg){
  A.innerHTML = `<main class="gate"><div class="gate-card">
    <h1>Administrare</h1>
    <p>Intră cu un cont de administrator ca să editezi cursul.</p>
    <button class="btn" id="g" type="button">Continuă cu Google</button>
    <form id="otp" class="gate-form"><label for="em">Sau primește un link pe email</label><input id="em" type="email" required autocomplete="email" placeholder="nume@exemplu.ro"><button class="btn quiet" type="submit">Trimite linkul</button></form>
    <p class="msg" id="m" aria-live="polite">${esc(msg || "")}</p>
    <p class="small"><a href="../">Înapoi la site</a></p>
  </div></main>`;
  document.getElementById("g").onclick = () => sb.auth.signInWithOAuth({provider: "google", options: {redirectTo: location.origin + location.pathname}});
  document.getElementById("otp").onsubmit = async e => {
    e.preventDefault();
    const m = document.getElementById("m"); m.textContent = "Se trimite…";
    const {error} = await sb.auth.signInWithOtp({email: document.getElementById("em").value.trim(), options: {emailRedirectTo: location.origin + location.pathname}});
    m.textContent = error ? "Nu am putut trimite emailul: " + error.message : "Ți-am trimis un link. Deschide-l o singură dată.";
  };
}
function deniedView(){
  A.innerHTML = `<main class="gate"><div class="gate-card"><h1>Nu ai acces</h1>
    <p>Contul <b>${esc(me())}</b> nu este pe lista de administratori. Roagă un administrator să te adauge.</p>
    <button class="btn quiet" id="out" type="button">Deconectare</button><p class="small"><a href="../">Înapoi la site</a></p></div></main>`;
  document.getElementById("out").onclick = () => sb.auth.signOut();
}
async function gate(s){
  session = s;
  if (!sb) { A.innerHTML = `<main class="gate"><div class="gate-card"><h1>Lipsește configurarea</h1><p>Completează config.js cu datele Supabase.</p></div></main>`; return; }
  if (!s) return loginView(/error_code=otp_expired/.test(location.hash) ? "Linkul a expirat sau a fost deja folosit. Cere unul nou." : "");
  const r = await sb.rpc("is_leader");
  if (r.data !== true) return deniedView();
  if (!draft) await load();
  shell();
}
if (sb) sb.auth.onAuthStateChange((ev, s) => { if (["INITIAL_SESSION", "SIGNED_IN", "SIGNED_OUT"].includes(ev)) setTimeout(() => gate(s)); });
else gate(null);

// ─── DATE ───
const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const slug = s => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30);
function normalize(c){
  c.site = Object.assign({}, window.DEFAULT_CONTENT.site, c.site || {});
  c.chapters = (c.chapters || []).map(ch => Object.assign({id: uid("c"), t: "", d: "", tone: "paper", img: "", alt: "", cap: "", lessons: []}, ch));
  c.chapters.forEach(ch => ch.lessons = ch.lessons.map(l => Object.assign({id: uid("l"), t: "", d: "", html: "", q: []}, l)));
  return c;
}
async function load(){
  const {data, error} = await sb.from("site_content").select("data,updated_at").eq("id", "main").maybeSingle();
  if (error) toast("Nu am putut citi conținutul (" + error.message + "). Ai rulat supabase-admin.sql?", true);
  draft = normalize(clone(data && data.data ? data.data : window.DEFAULT_CONTENT));
  saved = data && data.data ? JSON.stringify(draft) : "";
  updatedAt = data ? data.updated_at : null;
}
function problems(){
  const out = [];
  draft.chapters.forEach((ch, ci) => {
    if (!ch.t.trim()) out.push({t: `Un capitol nu are titlu.`, ci, li: -1});
    if (!ch.lessons.length) out.push({t: `Capitolul „${ch.t || "fără titlu"}” nu are lecții (nu va apărea pe site).`, ci, li: -1, soft: true});
    ch.lessons.forEach((l, li) => {
      const n = `„${l.t || "fără titlu"}”`;
      if (!l.t.trim()) out.push({t: `O lecție din „${ch.t}” nu are titlu.`, ci, li});
      if (!l.q.length) out.push({t: `Lecția ${n} nu are nicio întrebare.`, ci, li});
      l.q.forEach((q, k) => {
        if (!String(q[0]).trim()) out.push({t: `Lecția ${n}: întrebarea ${k + 1} e goală.`, ci, li});
        if (q[1].filter(o => String(o).trim()).length < 2) out.push({t: `Lecția ${n}: întrebarea ${k + 1} are nevoie de cel puțin 2 variante.`, ci, li});
        if (!(q[2] >= 0 && q[2] < q[1].length) || !String(q[1][q[2]] || "").trim()) out.push({t: `Lecția ${n}: alege răspunsul corect la întrebarea ${k + 1}.`, ci, li});
      });
    });
  });
  return out;
}
async function saveAll(){
  const hard = problems().filter(p => !p.soft);
  if (hard.length) { tab = "curs"; sel = {ci: hard[0].ci, li: hard[0].li}; shell(); toast("Nu am salvat: " + hard[0].t + (hard.length > 1 ? ` (și încă ${hard.length - 1})` : ""), true); return; }
  // empty answer options are dropped; the correct index follows its option
  draft.chapters.forEach(ch => ch.lessons.forEach(l => l.q.forEach(q => { const right = q[1][q[2]]; q[1] = q[1].filter(o => String(o).trim()); q[2] = q[1].indexOf(right); })));
  const btn = document.getElementById("save"); if (btn) { btn.disabled = true; btn.querySelector("span").textContent = "Se salvează…"; }
  const now = new Date().toISOString();
  const h = await sb.from("site_content_history").insert({data: draft, saved_by: me()});
  const r = await sb.from("site_content").upsert({id: "main", data: draft, updated_at: now, updated_by: me()});
  if (r.error || h.error) { toast("Nu am putut salva: " + (r.error || h.error).message, true); shell(); return; }
  saved = JSON.stringify(draft); updatedAt = now;
  toast("Salvat. Voluntarii văd schimbările când deschid site-ul.");
  shell();
}

// ─── CADRUL ───
function shell(){
  A.innerHTML = `<header class="abar">
    <a class="abrand" href="../" title="Vezi site-ul">${ic("back")}<span>${esc(draft.site.name)}</span></a>
    <span class="astatus" id="st">${dirty() ? "Modificări nesalvate" : updatedAt ? "Salvat " + new Date(updatedAt).toLocaleString("ro-RO", {dateStyle: "short", timeStyle: "short"}) : "Încă nesalvat în baza de date"}</span>
    <a class="btn quiet small-btn" href="../" target="_blank" rel="noopener">${ic("eye")}<span>Vezi site-ul</span></a>
    <button class="btn small-btn" id="save" type="button" data-act="save">${ic("save")}<span>Salvează</span></button>
  </header>
  <div class="alayout">
    <nav class="anav" aria-label="Secțiuni">
      ${TABS.map(([k, t]) => `<button type="button" class="atab${tab === k ? " on" : ""}" data-act="tab" data-k="${k}" ${tab === k ? 'aria-current="page"' : ""}>${t}</button>`).join("")}
      <div class="who"><span>${esc(me())}</span><button class="link" type="button" data-act="logout">Deconectare</button></div>
    </nav>
    <main class="amain" id="main">${({site: siteTab, curs: courseTab, foto: photosTab, admini: () => "", istoric: historyTab})[tab]()}</main>
  </div>
  <dialog class="picker" id="picker"></dialog>`;
  if (tab === "curs") wireEditor();
  if (tab === "admini") adminsTab();
  if (tab === "foto") paintUploads();
}
const markDirty = () => { const st = document.getElementById("st"); if (st) st.textContent = dirty() ? "Modificări nesalvate" : "Salvat"; };
const F = (label, scope, f, val, opts = {}) => `<div class="afield${opts.wide ? " wide" : ""}"><label for="${scope}-${f}">${label}</label>${opts.area
  ? `<textarea id="${scope}-${f}" data-scope="${scope}" data-f="${f}" rows="${opts.rows || 3}">${esc(val)}</textarea>`
  : `<input id="${scope}-${f}" data-scope="${scope}" data-f="${f}" value="${esc(val)}"${opts.ph ? ` placeholder="${esc(opts.ph)}"` : ""}>`}${opts.help ? `<small>${opts.help}</small>` : ""}</div>`;
const P = (label, scope, f, val) => `<div class="afield wide"><span class="lbl">${label}</span><div class="pick">
  <div class="thumb">${val ? `<img src="${esc(src(val))}" alt="">` : `<span>Fără fotografie</span>`}</div>
  <div class="pick-acts"><button class="btn quiet small-btn" type="button" data-act="pick" data-scope="${scope}" data-f="${f}">${ic("img")}<span>Alege fotografia</span></button>
  ${val ? `<button class="link" type="button" data-act="unpick" data-scope="${scope}" data-f="${f}">Fără fotografie</button>` : ""}</div></div></div>`;
const obj = scope => scope === "site" ? draft.site : scope === "ch" ? draft.chapters[sel.ci] : draft.chapters[sel.ci].lessons[sel.li];

// ─── PAGINA PRINCIPALĂ ───
function siteTab(){
  const s = draft.site;
  return `<h1>Pagina principală</h1><p class="lead2">Textele și fotografiile din afara lecțiilor.</p>
  <section class="apanel"><h2>Sus, pe prima pagină</h2><div class="agrid">
    ${F("Numele cursului", "site", "name", s.name)}
    ${F("Fraza de sub titlu", "site", "lede", s.lede, {area: true, wide: true, help: "Scrie {n} acolo unde vrei numărul de lecții."})}
    ${P("Fotografia mare", "site", "heroImg", s.heroImg)}
    ${F("Descrierea fotografiei (pentru cititoare de ecran)", "site", "heroAlt", s.heroAlt, {wide: true})}
  </div></section>
  <section class="apanel"><h2>Prezentare</h2><div class="agrid">
    ${F("Titlu", "site", "introTitle", s.introTitle)}
    ${F("Text", "site", "introText", s.introText, {area: true, wide: true})}
  </div></section>
  <section class="apanel"><h2>„Ce vei ști să faci”</h2><div class="agrid">
    ${F("Titlu", "site", "topicsTitle", s.topicsTitle)}
    ${F("Lista (câte una pe rând)", "site", "topics", s.topics, {area: true, wide: true, rows: 8})}
    ${P("Fotografie", "site", "topicsImg", s.topicsImg)}
    ${F("Descrierea fotografiei", "site", "topicsAlt", s.topicsAlt)}
    ${F("Text sub fotografie", "site", "topicsCap", s.topicsCap)}
  </div></section>
  <section class="apanel"><h2>Subsol și certificat</h2><div class="agrid">
    ${F("Titlu", "site", "footTitle", s.footTitle)}
    ${F("Email de contact", "site", "email", s.email)}
    ${F("Mesaj", "site", "footText", s.footText, {area: true, wide: true})}
    ${P("Fotografia mică (timbrul)", "site", "stampImg", s.stampImg)}
    ${F("Descrierea timbrului", "site", "stampAlt", s.stampAlt)}
    ${F("Coordonatorul (apare pe certificat)", "site", "coordinator", s.coordinator, {ph: "de exemplu, Cornel Miron"})}
    ${F("Mulțumiri pentru fotografii", "site", "credits", s.credits, {area: true, wide: true, rows: 4})}
  </div></section>`;
}

// ─── CAPITOLE ȘI LECȚII ───
function courseTab(){
  const chs = draft.chapters, warn = problems();
  if (sel.ci >= chs.length) sel = {ci: Math.max(0, chs.length - 1), li: -1};
  const tree = chs.map((ch, ci) => `<li class="tch${sel.ci === ci && sel.li < 0 ? " on" : ""}">
      <div class="trow"><button class="tname" type="button" data-act="sel" data-ci="${ci}" data-li="-1"><b>${esc(ch.t || "Capitol fără titlu")}</b><small>${ch.lessons.length} lecții</small></button>
      <span class="tacts">${ci > 0 ? `<button class="ib" type="button" data-act="mvch" data-ci="${ci}" data-d="-1" aria-label="Mută capitolul mai sus">${ic("up")}</button>` : ""}${ci < chs.length - 1 ? `<button class="ib" type="button" data-act="mvch" data-ci="${ci}" data-d="1" aria-label="Mută capitolul mai jos">${ic("down")}</button>` : ""}</span></div>
      <ul>${ch.lessons.map((l, li) => `<li class="tl${sel.ci === ci && sel.li === li ? " on" : ""}"><div class="trow">
        <button class="tname" type="button" data-act="sel" data-ci="${ci}" data-li="${li}"><span>${esc(l.t || "Lecție fără titlu")}</span><small>${l.q.length} întrebări</small></button>
        <span class="tacts">${li > 0 ? `<button class="ib" type="button" data-act="mvl" data-ci="${ci}" data-li="${li}" data-d="-1" aria-label="Mută lecția mai sus">${ic("up")}</button>` : ""}${li < ch.lessons.length - 1 ? `<button class="ib" type="button" data-act="mvl" data-ci="${ci}" data-li="${li}" data-d="1" aria-label="Mută lecția mai jos">${ic("down")}</button>` : ""}</span></div></li>`).join("")}
        <li><button class="addrow" type="button" data-act="addl" data-ci="${ci}">${ic("plus")}<span>Lecție nouă</span></button></li></ul></li>`).join("");
  return `<h1>Capitole și lecții</h1><p class="lead2">Alege un capitol sau o lecție din listă. Ordinea de aici e ordinea de pe site.</p>
  ${warn.length ? `<div class="warn"><b>De rezolvat înainte de salvare:</b><ul>${warn.slice(0, 6).map(p => `<li><button class="link" type="button" data-act="sel" data-ci="${p.ci}" data-li="${p.li}">${esc(p.t)}</button></li>`).join("")}</ul></div>` : ""}
  <div class="course">
    <aside class="tree"><ul>${tree}</ul><button class="btn quiet wide" type="button" data-act="addch">${ic("plus")}<span>Capitol nou</span></button></aside>
    <section class="editor" id="editor">${chs.length ? (sel.li < 0 ? chapterForm() : lessonForm()) : `<p>Nu există încă niciun capitol. Adaugă primul.</p>`}</section>
  </div>`;
}
function chapterForm(){
  const ch = draft.chapters[sel.ci];
  return `<div class="ehead"><h2>Capitol: ${esc(ch.t || "fără titlu")}</h2><button class="btn danger small-btn" type="button" data-act="delch">${ic("del")}<span>Șterge capitolul</span></button></div>
  <div class="agrid">
    ${F("Titlul capitolului", "ch", "t", ch.t)}
    ${F("Descriere scurtă", "ch", "d", ch.d, {area: true, wide: true})}
    <div class="afield wide"><span class="lbl">Culoarea dosarului</span><div class="tones">${Object.entries(window.TONES).map(([k, t]) => `<label class="tone"><input type="radio" name="tone" value="${k}" data-scope="ch" data-f="tone" ${ch.tone === k ? "checked" : ""}><i style="background:${t.tone}"></i><span>${t.name}</span></label>`).join("")}</div></div>
    ${P("Fotografia capitolului", "ch", "img", ch.img)}
    ${F("Descrierea fotografiei", "ch", "alt", ch.alt)}
    ${F("Text sub fotografie", "ch", "cap", ch.cap)}
  </div>`;
}
const TOOLS = [["h3", "Titlu de secțiune"], ["p", "Paragraf"], ["ul", "Listă"], ["bold", "Îngroșat"], ["tip", "Casetă de sfat"], ["small", "Text mic"], ["link", "Link"], ["clear", "Fără formatare"]];
function lessonForm(){
  const ch = draft.chapters[sel.ci], l = ch.lessons[sel.li];
  return `<div class="ehead"><h2>Lecție: ${esc(l.t || "fără titlu")}</h2><button class="btn danger small-btn" type="button" data-act="dell">${ic("del")}<span>Șterge lecția</span></button></div>
  <div class="agrid">
    ${F("Titlul lecției", "ls", "t", l.t)}
    <div class="afield"><label for="mv">Capitolul</label><select id="mv" data-act-change="movech">${draft.chapters.map((c, ci) => `<option value="${ci}" ${ci === sel.ci ? "selected" : ""}>${esc(c.t || "Capitol fără titlu")}</option>`).join("")}</select></div>
    ${F("Descriere scurtă (apare în listă)", "ls", "d", l.d, {wide: true})}
  </div>
  <section class="apanel"><h3>Conținutul lecției</h3>
    <p class="small2">Fiecare „Titlu de secțiune” începe o parte nouă; progresul se măsoară pe părți.</p>
    <div class="rtebar" role="toolbar" aria-label="Formatare">${TOOLS.map(([k, t]) => `<button type="button" class="tb" data-cmd="${k}">${t}</button>`).join("")}</div>
    <div class="rte" id="rte" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Conținutul lecției">${window.cleanHTML(l.html)}</div>
  </section>
  <section class="apanel"><h3>Testul (${l.q.length} întrebări)</h3>
    <p class="small2">Bifează răspunsul corect. Voluntarul trece cu cel puțin ${Math.max(1, Math.ceil(l.q.length * 0.8))} răspunsuri corecte (80%). Variantele apar amestecate.</p>
    <div id="qs">${l.q.map((q, k) => qHTML(q, k, l.q.length)).join("")}</div>
    <button class="btn quiet" type="button" data-act="addq">${ic("plus")}<span>Întrebare nouă</span></button>
  </section>
  <section class="apanel"><h3>Copiile de siguranță ale lecției</h3>
    <p class="small2">Fiecare salvare păstrează și o copie a acestei lecții. Poți reveni doar la lecția aceasta, fără să atingi restul cursului.</p>
    <div class="rowb"><button class="btn quiet" type="button" data-act="lver">Arată versiunile salvate</button>
      <button class="btn quiet" type="button" data-act="ldl">Descarcă lecția (JSON)</button>
      <label class="btn quiet"><input type="file" accept="application/json" hidden data-limport><span>Înlocuiește dintr-un fișier</span></label></div>
    <ul class="admlist" id="lver"></ul>
  </section>`;
}
const qHTML = (q, k, n) => `<fieldset class="qe"><legend>Întrebarea ${k + 1}</legend>
  <div class="qtools">${k > 0 ? `<button class="ib" type="button" data-act="mvq" data-k="${k}" data-d="-1" aria-label="Mută întrebarea mai sus">${ic("up")}</button>` : ""}${k < n - 1 ? `<button class="ib" type="button" data-act="mvq" data-k="${k}" data-d="1" aria-label="Mută întrebarea mai jos">${ic("down")}</button>` : ""}<button class="ib" type="button" data-act="delq" data-k="${k}" aria-label="Șterge întrebarea">${ic("del")}</button></div>
  <div class="afield wide"><label for="q${k}">Întrebarea</label><textarea id="q${k}" rows="2" data-q="${k}" data-part="0">${esc(q[0])}</textarea></div>
  <div class="opts">${q[1].map((o, j) => `<div class="opt"><label class="ok"><input type="radio" name="right${k}" data-q="${k}" data-right="${j}" ${q[2] === j ? "checked" : ""}><span class="vh">Răspunsul corect</span></label>
    <input aria-label="Varianta ${j + 1}" data-q="${k}" data-o="${j}" value="${esc(o)}" placeholder="Varianta ${j + 1}">
    <button class="ib" type="button" data-act="delo" data-k="${k}" data-j="${j}" aria-label="Șterge varianta">${ic("close")}</button></div>`).join("")}
    <button class="link" type="button" data-act="addo" data-k="${k}">+ Variantă</button></div>
  <div class="afield wide"><label for="qx${k}">Explicația (apare după răspuns)</label><textarea id="qx${k}" rows="2" data-q="${k}" data-part="3">${esc(q[3])}</textarea></div>
</fieldset>`;

function wireEditor(){
  const rte = document.getElementById("rte");
  if (!rte) return;
  const l = () => draft.chapters[sel.ci].lessons[sel.li];
  const sync = () => { l().html = window.cleanHTML(rte.innerHTML); markDirty(); };
  rte.addEventListener("input", sync);
  rte.addEventListener("paste", e => { e.preventDefault(); document.execCommand("insertText", false, e.clipboardData.getData("text/plain")); });
  document.querySelector(".rtebar").addEventListener("click", e => {
    const b = e.target.closest("[data-cmd]"); if (!b) return;
    rte.focus();
    const cmd = b.dataset.cmd, block = () => { let n = getSelection().anchorNode; while (n && n.parentNode !== rte) n = n.parentNode; return n && n.nodeType === 1 ? n : null; };
    if (cmd === "h3" || cmd === "p") document.execCommand("formatBlock", false, cmd);
    else if (cmd === "ul") document.execCommand("insertUnorderedList");
    else if (cmd === "bold") document.execCommand("bold");
    else if (cmd === "link") { const u = prompt("Adresa linkului (https://…):"); if (u) document.execCommand("createLink", false, u); }
    else if (cmd === "clear") { document.execCommand("removeFormat"); document.execCommand("formatBlock", false, "p"); const bl = block(); if (bl) bl.removeAttribute("class"); }
    else if (cmd === "tip" || cmd === "small") { if (!block()) document.execCommand("formatBlock", false, "p"); const bl = block(); if (bl) bl.classList.toggle(cmd === "tip" ? "tip" : "small"); }
    sync();
  });
}

// ─── FOTOGRAFII ───
function photoCard(url, mine, pick){
  return `<figure class="ph"><img src="${esc(src(url))}" alt="" loading="lazy"><figcaption>${esc(url.split("/").pop())}</figcaption>
    <div class="phacts">${pick ? `<button class="btn small-btn" type="button" data-act="choose" data-url="${esc(url)}">Alege</button>`
      : `<button class="link" type="button" data-act="copy" data-url="${esc(url)}">Copiază adresa</button>${mine ? `<button class="link danger-t" type="button" data-act="delph" data-name="${esc(mine)}" data-url="${esc(url)}">Șterge</button>` : ""}`}</div></figure>`;
}
const uploader = () => `<label class="drop"><input type="file" accept="image/*" multiple data-upload><b>Încarcă fotografii</b><span>JPG, PNG sau WEBP. Le micșorăm automat la 1920 px.</span></label>`;
function photosTab(){
  return `<h1>Fotografii</h1><p class="lead2">Fotografiile încărcate aici pot fi alese pentru pagina principală și pentru capitole.</p>
  ${uploader()}<h2 class="h2s">Încărcate de voi</h2><div class="phgrid" id="ups"><p>Se încarcă…</p></div>
  <h2 class="h2s">Incluse în site</h2><div class="phgrid">${BUNDLED.map(u => photoCard(u, "", false)).join("")}</div>`;
}
async function listUploads(){
  const {data, error} = await sb.storage.from("photos").list("", {limit: 200, sortBy: {column: "created_at", order: "desc"}});
  uploads = error ? [] : (data || []).filter(f => f.name && !f.name.startsWith(".")).map(f => ({name: f.name, url: sb.storage.from("photos").getPublicUrl(f.name).data.publicUrl}));
  return error;
}
async function paintUploads(pick){
  const err = await listUploads(), el = document.getElementById(pick ? "pups" : "ups");
  if (el) el.innerHTML = err ? `<p>Nu pot citi fotografiile (${esc(err.message)}). Ai rulat supabase-admin.sql?</p>` : uploads.length ? uploads.map(u => photoCard(u.url, u.name, pick)).join("") : `<p>Încă nu ați încărcat nicio fotografie.</p>`;
}
async function compress(file){
  try {
    const bmp = await createImageBitmap(file), s = Math.min(1, 1920 / Math.max(bmp.width, bmp.height));
    const c = Object.assign(document.createElement("canvas"), {width: Math.round(bmp.width * s), height: Math.round(bmp.height * s)});
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    return await new Promise(r => c.toBlob(r, "image/jpeg", 0.84));
  } catch(e) { return null; }
}
async function upload(files){
  for (const f of files) {
    if (!/^image\//.test(f.type)) { toast(`„${f.name}” nu e o imagine.`, true); continue; }
    toast(`Se încarcă „${f.name}”…`);
    const blob = await compress(f);
    if (!blob) { toast(`Nu am putut citi „${f.name}”.`, true); continue; }
    const name = Date.now() + "-" + (slug(f.name.replace(/\.[^.]+$/, "")) || "foto") + ".jpg";
    const {error} = await sb.storage.from("photos").upload(name, blob, {contentType: "image/jpeg"});
    toast(error ? `Nu am putut încărca „${f.name}”: ${error.message}` : `„${f.name}” a fost încărcată.`, !!error);
  }
}
let pickTarget = null;
function openPicker(scope, f){
  pickTarget = {scope, f};
  const d = document.getElementById("picker");
  d.innerHTML = `<div class="pin"><div class="ptop"><h2>Alege o fotografie</h2><button class="close" type="button" data-act="pclose">${ic("close")}<span>Închide</span></button></div>
    ${uploader()}<h3 class="h2s">Încărcate de voi</h3><div class="phgrid" id="pups"><p>Se încarcă…</p></div>
    <h3 class="h2s">Incluse în site</h3><div class="phgrid">${BUNDLED.map(u => photoCard(u, "", true)).join("")}</div></div>`;
  d.showModal();
  paintUploads(true);
}

// ─── ADMINISTRATORI ───
async function adminsTab(){
  const main = document.getElementById("main");
  main.innerHTML = `<h1>Administratori</h1><p class="lead2">Doar aceste adrese pot intra aici și pot vedea rezultatele echipei. Fiecare intră cu Google sau cu link pe email, pe adresa de aici.</p>
    <section class="apanel"><form class="addadm" id="addadm"><div class="afield"><label for="nadm">Adaugă un email</label><input id="nadm" type="email" required placeholder="nume@exemplu.ro"></div><button class="btn" type="submit">${ic("plus")}<span>Adaugă</span></button></form>
    <ul class="admlist" id="admlist"><li>Se încarcă…</li></ul></section>`;
  const paint = async () => {
    const {data, error} = await sb.from("leaders").select("email").order("email");
    document.getElementById("admlist").innerHTML = error ? `<li>Nu pot citi lista (${esc(error.message)}). Ai rulat supabase-admin.sql?</li>` : (data || []).map(r => `<li><span>${esc(r.email)}${r.email.toLowerCase() === me().toLowerCase() ? " <small>(tu)</small>" : ""}</span>
      <button class="btn danger small-btn" type="button" data-act="deladm" data-email="${esc(r.email)}">${ic("del")}<span>Scoate</span></button></li>`).join("");
  };
  document.getElementById("addadm").onsubmit = async e => {
    e.preventDefault();
    const em = document.getElementById("nadm").value.trim().toLowerCase();
    const {error} = await sb.from("leaders").insert({email: em});
    toast(error ? "Nu am putut adăuga: " + error.message : `${em} poate intra acum în panou.`, !!error);
    if (!error) document.getElementById("nadm").value = "";
    paint();
  };
  main.addEventListener("click", async e => {
    const b = e.target.closest("[data-act=deladm]"); if (!b) return;
    const em = b.dataset.email, self = em.toLowerCase() === me().toLowerCase();
    if (!confirm(self ? "Îți scoți propriul acces. Nu vei mai putea intra aici. Continui?" : `Scoți accesul pentru ${em}?`)) return;
    const {error} = await sb.from("leaders").delete().eq("email", em);
    toast(error ? "Nu am putut scoate: " + error.message : `${em} nu mai are acces.`, !!error);
    if (self && !error) return location.reload();
    paint();
  });
  paint();
}

// ─── ISTORIC ───
function historyTab(){
  setTimeout(async () => {
    const {data, error} = await sb.from("site_content_history").select("id,saved_at,saved_by").order("saved_at", {ascending: false}).limit(30);
    const el = document.getElementById("hist");
    if (el) el.innerHTML = error ? `<li>Nu pot citi istoricul (${esc(error.message)}).</li>` : (data || []).length ? data.map(r => `<li><span>${new Date(r.saved_at).toLocaleString("ro-RO", {dateStyle: "medium", timeStyle: "short"})} · ${esc(r.saved_by || "")}</span><button class="btn quiet small-btn" type="button" data-act="restore" data-id="${r.id}">Încarcă versiunea</button></li>`).join("") : `<li>Încă nu există salvări.</li>`;
  });
  return `<h1>Istoric și copii</h1><p class="lead2">Fiecare salvare păstrează o copie. Încarcă o versiune veche, verifică și apoi apasă Salvează.</p>
  <section class="apanel"><h2>Salvări recente</h2><ul class="admlist" id="hist"><li>Se încarcă…</li></ul></section>
  <section class="apanel"><h2>Copie pe calculator</h2><div class="rowb">
    <button class="btn quiet" type="button" data-act="export">Descarcă o copie (JSON)</button>
    <label class="btn quiet"><input type="file" accept="application/json" hidden data-import><span>Încarcă dintr-o copie</span></label>
    <button class="btn danger" type="button" data-act="reset">Revino la cursul inițial</button></div></section>
  <section class="apanel"><h2>Lecții șterse</h2><p class="small2">Lecțiile care apar în salvările vechi, dar nu mai sunt în curs.</p>
    <button class="btn quiet" type="button" data-act="deleted">Caută lecții șterse</button><ul class="admlist" id="dels"></ul></section>
  <section class="apanel"><h2>Istoricul voluntarilor</h2><p class="small2">Fiecare test dat și fiecare lecție citită până la capăt, de către voluntarii conectați. Fișierele CSV se deschid în Google Sheets sau Excel.</p>
    <div class="rowb"><button class="btn quiet" type="button" data-act="csv" data-k="log">Descarcă istoricul (CSV)</button><button class="btn quiet" type="button" data-act="csv" data-k="sum">Descarcă rezultatele pe voluntar (CSV)</button></div></section>`;
}

// ─── COPII PE LECȚIE ───
const download = (name, text, type) => {
  const url = URL.createObjectURL(new Blob([text], {type}));
  Object.assign(document.createElement("a"), {href: url, download: name}).click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
};
const csv = rows => "﻿" + rows.map(r => r.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
let lvCache = [], delCache = [];
async function historyRows(){
  const {data, error} = await sb.from("site_content_history").select("saved_at,saved_by,data").order("saved_at", {ascending: false}).limit(30);
  if (error) toast("Nu pot citi istoricul: " + error.message, true);
  return data || [];
}
async function fetchAll(table, order){
  let out = [], from = 0;
  for (;;) {
    const {data, error} = await sb.from(table).select("*").order(order, {ascending: true}).range(from, from + 999);
    if (error) { toast(`Nu pot citi ${table}: ${error.message}. Ai rulat supabase-history.sql?`, true); return null; }
    out = out.concat(data); if (data.length < 1000) return out; from += 1000;
  }
}
const lessonsOf = c => (c.chapters || []).flatMap(ch => (ch.lessons || []).map(l => ({l, ch})));

// ─── ACȚIUNI ───
const move = (arr, i, d) => { const j = i + d; if (j < 0 || j >= arr.length) return; [arr[i], arr[j]] = [arr[j], arr[i]]; };
A.addEventListener("click", async e => {
  const b = e.target.closest("[data-act]"); if (!b) return;
  const a = b.dataset.act, chs = draft && draft.chapters, ch = chs && chs[sel.ci], l = ch && ch.lessons[sel.li];
  const re = () => { shell(); markDirty(); };
  if (a === "save") return saveAll();
  if (a === "logout") { if (dirty() && !confirm("Ai modificări nesalvate. Te deconectezi oricum?")) return; draft = null; return sb.auth.signOut(); }
  if (a === "tab") { tab = b.dataset.k; return shell(); }
  if (a === "sel") { sel = {ci: +b.dataset.ci, li: +b.dataset.li}; tab = "curs"; shell(); document.getElementById("editor")?.scrollIntoView({block: "start", behavior: "smooth"}); return; }
  if (a === "addch") { chs.push({id: slug("capitol nou") + "-" + Date.now().toString(36), t: "Capitol nou", d: "", tone: "paper", img: "", alt: "", cap: "", lessons: []}); sel = {ci: chs.length - 1, li: -1}; return re(); }
  if (a === "mvch") { const i = +b.dataset.ci; move(chs, i, +b.dataset.d); sel = {ci: i + +b.dataset.d, li: -1}; return re(); }
  if (a === "delch") { if (!confirm(`Ștergi capitolul „${ch.t}” cu toate cele ${ch.lessons.length} lecții? Poți reveni din Istoric până salvezi altceva.`)) return; chs.splice(sel.ci, 1); sel = {ci: 0, li: -1}; return re(); }
  if (a === "addl") { const c = chs[+b.dataset.ci]; c.lessons.push({id: uid("l"), t: "Lecție nouă", d: "", html: "<p>Scrie aici conținutul lecției.</p>", q: [["Întrebarea 1", ["Răspunsul corect", "Alt răspuns"], 0, ""]]}); sel = {ci: +b.dataset.ci, li: c.lessons.length - 1}; return re(); }
  if (a === "mvl") { const c = chs[+b.dataset.ci], i = +b.dataset.li; move(c.lessons, i, +b.dataset.d); sel = {ci: +b.dataset.ci, li: i + +b.dataset.d}; return re(); }
  if (a === "dell") { if (!confirm(`Ștergi lecția „${l.t}”? Progresul voluntarilor la ea nu mai contează.`)) return; ch.lessons.splice(sel.li, 1); sel = {ci: sel.ci, li: -1}; return re(); }
  if (a === "addq") { l.q.push(["", ["", ""], 0, ""]); return re(); }
  if (a === "delq") { if (!confirm("Ștergi întrebarea?")) return; l.q.splice(+b.dataset.k, 1); return re(); }
  if (a === "mvq") { move(l.q, +b.dataset.k, +b.dataset.d); return re(); }
  if (a === "addo") { l.q[+b.dataset.k][1].push(""); return re(); }
  if (a === "delo") { const q = l.q[+b.dataset.k], j = +b.dataset.j; if (q[1].length <= 2) return toast("O întrebare are nevoie de cel puțin 2 variante.", true); q[1].splice(j, 1); if (q[2] === j) q[2] = 0; else if (q[2] > j) q[2]--; return re(); }
  if (a === "pick") return openPicker(b.dataset.scope, b.dataset.f);
  if (a === "unpick") { obj(b.dataset.scope)[b.dataset.f] = ""; return re(); }
  if (a === "pclose") return document.getElementById("picker").close();
  if (a === "choose") { obj(pickTarget.scope)[pickTarget.f] = b.dataset.url; document.getElementById("picker").close(); return re(); }
  if (a === "copy") { try { await navigator.clipboard.writeText(new URL(src(b.dataset.url), location.href).href); toast("Adresa a fost copiată."); } catch(err) { toast("Nu am putut copia. Adresa: " + b.dataset.url, true); } return; }
  if (a === "delph") {
    const used = JSON.stringify(draft).includes(b.dataset.url);
    if (!confirm(used ? "Fotografia e folosită pe site. O ștergi oricum? Locul ei va rămâne gol." : "Ștergi fotografia?")) return;
    const {error} = await sb.storage.from("photos").remove([b.dataset.name]);
    toast(error ? "Nu am putut șterge: " + error.message : "Fotografia a fost ștearsă.", !!error);
    return paintUploads(false);
  }
  if (a === "restore") {
    if (dirty() && !confirm("Modificările nesalvate se pierd. Încarci versiunea veche?")) return;
    const {data, error} = await sb.from("site_content_history").select("data").eq("id", b.dataset.id).single();
    if (error) return toast("Nu am putut încărca: " + error.message, true);
    draft = normalize(clone(data.data)); tab = "curs"; sel = {ci: 0, li: -1}; re(); return toast("Versiunea veche e încărcată. Apasă Salvează ca să o publici.");
  }
  if (a === "lver") {
    const el = document.getElementById("lver"); el.innerHTML = "<li>Se caută…</li>";
    const seen = new Set(); lvCache = [];
    (await historyRows()).forEach(r => { const f = lessonsOf(r.data).find(x => x.l.id === l.id); if (!f) return; const k = JSON.stringify(f.l); if (seen.has(k)) return; seen.add(k); lvCache.push({at: r.saved_at, by: r.saved_by, l: f.l}); });
    el.innerHTML = lvCache.length ? lvCache.map((v, n) => `<li><span>${new Date(v.at).toLocaleString("ro-RO", {dateStyle: "medium", timeStyle: "short"})} · ${esc(v.by || "")} · „${esc(v.l.t)}”, ${v.l.q.length} întrebări${JSON.stringify(v.l) === JSON.stringify(l) ? " <small>(ca acum)</small>" : ""}</span>
      <button class="btn quiet small-btn" type="button" data-act="lrest" data-n="${n}">Revino la aceasta</button></li>`).join("") : "<li>Lecția nu apare încă în nicio salvare.</li>";
    return;
  }
  if (a === "lrest") { ch.lessons[sel.li] = clone(lvCache[+b.dataset.n].l); re(); return toast("Lecția a revenit la versiunea aleasă. Apasă Salvează ca să o publici."); }
  if (a === "ldl") return download(`lectie-${slug(l.t) || l.id}.json`, JSON.stringify(l, null, 2), "application/json");
  if (a === "deleted") {
    const el = document.getElementById("dels"); el.innerHTML = "<li>Se caută…</li>";
    const now = new Set(lessonsOf(draft).map(x => x.l.id)), found = new Map();
    (await historyRows()).forEach(r => lessonsOf(r.data).forEach(({l: hl, ch: hc}) => { if (!now.has(hl.id) && !found.has(hl.id)) found.set(hl.id, {l: hl, ch: hc.id, cht: hc.t, at: r.saved_at}); }));
    delCache = [...found.values()];
    el.innerHTML = delCache.length ? delCache.map((d, n) => `<li><span>„${esc(d.l.t)}” din „${esc(d.cht)}” · ultima dată ${new Date(d.at).toLocaleDateString("ro-RO")}</span><button class="btn quiet small-btn" type="button" data-act="undel" data-n="${n}">Pune înapoi</button></li>`).join("") : "<li>Nu am găsit lecții șterse în ultimele 30 de salvări.</li>";
    return;
  }
  if (a === "undel") {
    const d = delCache[+b.dataset.n], ci = Math.max(0, chs.findIndex(c => c.id === d.ch));
    if (!chs.length) return toast("Adaugă întâi un capitol.", true);
    chs[ci].lessons.push(clone(d.l)); delCache.splice(+b.dataset.n, 1); b.closest("li").remove(); markDirty();
    return toast(`„${d.l.t}” e din nou în „${chs[ci].t}”. Apasă Salvează ca să o publici.`);
  }
  if (a === "csv") {
    b.disabled = true;
    const day = new Date().toISOString().slice(0, 10);
    if (b.dataset.k === "log") {
      const rows = await fetchAll("activity", "id");
      if (rows) download(`istoric-voluntari-${day}.csv`, csv([["Data", "Email", "Nume", "Lecția", "Ce a făcut", "Scor", "Din", "Trecut"],
        ...rows.map(r => [new Date(r.at).toLocaleString("ro-RO"), r.email, r.name, r.lesson_title, r.kind === "test" ? "Test" : "Lecție citită", r.score, r.total, r.passed == null ? "" : r.passed ? "da" : "nu"])]), "text/csv");
    } else {
      const rows = await fetchAll("results", "updated"), ls = lessonsOf(draft).map(x => x.l);
      // older saves keyed progress by modules.js position (0..13); those map to ids m1..m14
      const fix = o => { const r = {}; for (const k in o || {}) r[/^\d+$/.test(k) ? "m" + (+k + 1) : k] = o[k]; return r; };
      if (rows) download(`rezultate-voluntari-${day}.csv`, csv([["Nume", "Email", "Curs %", "Teste trecute", "Ultima activitate", ...ls.map(x => x.t)],
        ...rows.map(r => { const sc = fix(r.scores), rd = fix((r.scores || {}).read), p = ls.length ? Math.round(ls.reduce((s, x) => s + (sc[x.id] ? 100 : 70 * Math.min(1, rd[x.id] || 0)), 0) / ls.length) : 0;
          return [r.name, r.email, p, ls.filter(x => sc[x.id]).length + "/" + ls.length, new Date(r.updated).toLocaleString("ro-RO"), ...ls.map(x => sc[x.id] || "")]; })]), "text/csv");
    }
    b.disabled = false; return;
  }
  if (a === "export") {
    const url = URL.createObjectURL(new Blob([JSON.stringify(draft, null, 2)], {type: "application/json"}));
    Object.assign(document.createElement("a"), {href: url, download: "curs-" + new Date().toISOString().slice(0, 10) + ".json"}).click();
    return setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  if (a === "reset") { if (!confirm("Înlocuiești tot cursul cu varianta inițială din cod? Poți reveni din Istoric.")) return; draft = normalize(clone(window.DEFAULT_CONTENT)); sel = {ci: 0, li: -1}; tab = "curs"; re(); return toast("Varianta inițială e încărcată. Apasă Salvează ca să o publici."); }
});
A.addEventListener("input", e => {
  const t = e.target;
  if (t.dataset.scope && t.dataset.f && t.type !== "radio") { obj(t.dataset.scope)[t.dataset.f] = t.value; markDirty(); return; }
  if (t.dataset.q !== undefined && t.type !== "radio") {
    const q = draft.chapters[sel.ci].lessons[sel.li].q[+t.dataset.q];
    if (t.dataset.o !== undefined) q[1][+t.dataset.o] = t.value; else q[+t.dataset.part] = t.value;
    markDirty();
  }
});
A.addEventListener("change", async e => {
  const t = e.target;
  if (t.type === "radio" && t.dataset.f === "tone") { obj("ch").tone = t.value; markDirty(); return; }
  if (t.type === "radio" && t.dataset.right !== undefined) { draft.chapters[sel.ci].lessons[sel.li].q[+t.dataset.q][2] = +t.dataset.right; markDirty(); return; }
  if (t.dataset.actChange === "movech") {
    const to = +t.value; if (to === sel.ci) return;
    const [les] = draft.chapters[sel.ci].lessons.splice(sel.li, 1); draft.chapters[to].lessons.push(les);
    sel = {ci: to, li: draft.chapters[to].lessons.length - 1}; shell(); markDirty(); return;
  }
  if (t.matches("[data-upload]")) { await upload([...t.files]); t.value = ""; return paintUploads(!!t.closest("#picker")); }
  if (t.matches("[data-limport]")) {
    try {
      const nl = JSON.parse(await t.files[0].text()); if (!nl.t || !Array.isArray(nl.q)) throw 0;
      const cur = draft.chapters[sel.ci].lessons[sel.li];
      draft.chapters[sel.ci].lessons[sel.li] = Object.assign({html: "", d: ""}, nl, {id: cur.id}); // keep the id so volunteers' progress still counts
      shell(); markDirty(); toast("Lecția a fost înlocuită din fișier. Apasă Salvează ca să o publici.");
    } catch(err) { toast("Fișierul nu e o lecție validă.", true); }
    t.value = ""; return;
  }
  if (t.matches("[data-import]")) {
    try { const c = JSON.parse(await t.files[0].text()); if (!c.chapters) throw 0; draft = normalize(c); sel = {ci: 0, li: -1}; tab = "curs"; shell(); markDirty(); toast("Copia e încărcată. Apasă Salvează ca să o publici."); }
    catch(err) { toast("Fișierul nu e o copie validă a cursului.", true); }
  }
});
