// ─── STARE ───
const M = window.MODULES, C = window.CONFIG || {}, PASS = 4, KEY = "scoala-voluntarilor-v1";
let state = {done:{}, read:{}, name:""};
try { state = Object.assign(state, JSON.parse(localStorage.getItem(KEY)) || {}); } catch(e){}
state.read = state.read || {};
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){} };
const app = document.getElementById("app");
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const here = () => location.origin + location.pathname;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
// answer order is shuffled on every attempt so the right answer isn't always in the same spot
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ─── CAPITOLE ───
// Indicii modulelor din modules.js (de la 0). Ordinea de aici e ordinea recomandată.
const CH = [
  {id:"echipa", t:"Echipa", d:"Cine suntem, ce spune legea și cum lucrăm împreună.", mods:[0,1,5], tone:"var(--f1)", ink:"var(--paper-ink)", tab:"var(--f4)", tabInk:"var(--ink)",
   img:"assets/april-2023-piata-unirii-din-timisoara-img.jpg", alt:"Piața Unirii din Timișoara, cu Domul romano-catolic", cap:"Piața Unirii, Timișoara, 2023"},
  {id:"concertul", t:"Concertul", d:"Primirea publicului, focul și aglomerația, oamenii care au nevoie de ajutor.", mods:[3,8,13], tone:"var(--f2)", ink:"var(--accent-ink)", tab:"var(--paper)", tabInk:"var(--paper-ink)",
   img:"assets/corul-cantand.jpg", alt:"Membrii corului cântând împreună într-o capelă, în fața dirijorului", cap:"Corul, cântând într-o capelă"},
  {id:"tinerii", t:"Tinerii", d:"Evenimentele pentru adolescenți și tot ce îi ține în siguranță.", mods:[4,2,7,10,12], tone:"var(--f3)", ink:"var(--accent-ink)", tab:"var(--bg)", tabInk:"var(--ink)",
   img:"assets/landesarchiv-baden-wuerttemberg-staatsarchiv-freiburg-w-134.jpg", alt:"Piața Unirii și Domul din Timișoara într-o fotografie alb-negru din 1937", cap:"Piața Unirii, aprilie 1937"},
  {id:"greu", t:"Când e greu", d:"Urgențe, oameni în suferință și conflicte. Ce faci în primele minute.", mods:[6,9,11], tone:"var(--f4)", ink:"var(--ink)", tab:"var(--f2)", tabInk:"var(--accent-ink)", dark:true,
   img:"assets/piarist-church-timisoara-2023-img-12.jpg", alt:"Biserica Piariștilor din Timișoara, cu turnul ei înalt", cap:"Biserica Piariștilor, Timișoara, 2023"},
];
const chOf = i => CH.find(c => c.mods.includes(i));

// ─── PROGRES ───
// Lecția citită (pe părți, la derulare) valorează până la 70%; testul trecut duce lecția la 100%.
const pct = i => state.done[i] ? 100 : Math.round(70 * Math.min(1, state.read[i] || 0));
const chPct = c => Math.round(c.mods.reduce((s, i) => s + pct(i), 0) / c.mods.length);
const coursePct = () => Math.round(M.reduce((s, m, i) => s + pct(i), 0) / M.length);
const passed = () => Object.keys(state.done).filter(k => +k < M.length).length;
const nextModule = () => { for (const c of CH) for (const i of c.mods) if (!state.done[i]) return i; return null; };

// ─── SUPABASE (login + rezultate) ───
const sb = C.SUPABASE_URL && C.SUPABASE_ANON_KEY && window.supabase ? window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY) : null;
let session = null, leader = false, view = "", queue = Promise.resolve(), loginMsg = "";
// a failed login link comes back as #error=...; explain it instead of failing silently
if (/error_code=otp_expired/.test(location.hash)) loginMsg = "Linkul a expirat sau a fost deja folosit. Cere un link nou și deschide-l o singură dată.";
else if (/[#&]error=/.test(location.hash)) loginMsg = "Conectarea nu a reușit. Încearcă din nou.";
if (loginMsg) history.replaceState(null, "", location.pathname + "#ecuson");

const sync = () => {
  if (!sb || !session) return;
  queue = queue.then(() => sb.from("results").upsert({user_id: session.user.id, name: state.name, email: session.user.email, scores: {...state.done, read: state.read}, updated: new Date().toISOString()}))
    .then(r => r && r.error && console.warn("sync", r.error.message)).catch(e => console.warn("sync", e));
};
let readTimer = 0;
const syncSoon = () => { clearTimeout(readTimer); readTimer = setTimeout(sync, 2500); };

async function onSession(s){
  session = s; leader = false;
  if (session) {
    if (!state.name) state.name = session.user.user_metadata?.full_name || "";
    const {data} = await sb.from("results").select("name,scores").eq("user_id", session.user.id).maybeSingle();
    if (data) { // îmbină rezultatele de pe alt dispozitiv
      const sc = data.scores || {};
      for (const k in sc) if (k !== "read") state.done[k] = Math.max(sc[k], state.done[k] || 0);
      for (const k in sc.read || {}) state.read[k] = Math.max(sc.read[k], state.read[k] || 0);
      if (!state.name && data.name) state.name = data.name;
    }
    save(); sync(); // trimite și progresul făcut înainte de conectare
    const r = await sb.rpc("is_leader"); leader = r.data === true;
  }
  if (view === "home") { paintBar(); paintBadge(); paintLogin(); }
}
// supabase-js recomandă să nu aștepți alte apeluri direct în acest callback
if (sb) sb.auth.onAuthStateChange((ev, s) => { if (["INITIAL_SESSION","SIGNED_IN","SIGNED_OUT"].includes(ev)) setTimeout(() => onSession(s)); });

// ─── BARA DE SUS ───
// ─── NAVIGARE: bara de sus, bara de jos (telefon), meniul ───
// small drawn icons, one stroke weight
const ICON = {
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  mail: '<path d="M3 6h18v12H3zM3 7l9 7 9-7"/>',
  user: '<path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  book: '<path d="M4 5h6a2 2 0 012 2v12a2 2 0 00-2-2H4zM20 5h-6a2 2 0 00-2 2v12a2 2 0 012-2h6z"/>',
};
const ic = n => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;
const goTarget = () => { const nx = nextModule(); return nx === null ? {href: "#certificat", label: "Certificatul", t: ""} : {href: "#lectia-" + (nx + 1), label: coursePct() > 0 ? "Continuă" : "Începe", t: M[nx].t}; };

function barHTML(){
  return `<header class="bar wrap" id="bar">
    <button class="menu-btn" type="button" data-menu aria-haspopup="dialog" aria-controls="menu" aria-label="Deschide meniul">${ic("menu")}<span>Meniu</span></button>
    <a class="mark" href="#" data-top>Școala Voluntarilor</a>
    <div class="right" id="barRight"></div>
  </header>
  <nav class="dock" aria-label="Navigare rapidă">
    <button class="btn quiet" type="button" data-menu aria-controls="menu">${ic("book")}<span>Lecțiile</span></button>
    <a class="btn" id="dockGo" href="#"><span>Continuă</span>${ic("arrow")}</a>
  </nav>
  <dialog class="menu" id="menu" aria-label="Meniu"></dialog>`;
}
function paintBar(){
  const el = document.getElementById("barRight"), g = goTarget();
  if (el) el.innerHTML = `${leader ? `<a class="barlink" href="#rezultate">Rezultatele echipei</a>` : ""}<a class="barlink" href="#ecuson">${ic("user")}<span>${session ? "Ecusonul meu" : "Conectare"}</span></a><a class="btn small-btn" href="${g.href}"><span>${g.label}</span>${ic("arrow")}</a>`;
  const d = document.getElementById("dockGo");
  if (d) { d.href = g.href; d.querySelector("span").textContent = g.label; }
}
function menuHTML(){
  const g = goTarget(), L = (h, t, s) => `<li><a class="mlink" href="${h}"${h === "#" ? " data-top" : ""}><span>${t}</span>${s ? `<small>${s}</small>` : ""}</a></li>`;
  return `<div class="menu-in">
    <div class="menu-top"><span class="mark">Școala Voluntarilor</span><button class="close" type="button" data-close>${ic("close")}<span>Închide</span></button></div>
    <a class="btn wide" href="${g.href}"><span>${g.label}${g.t ? ": " + g.t : ""}</span>${ic("arrow")}</a>
    <h2 class="menu-h">Pagina</h2>
    <ul class="mlinks">
      ${L("#", "Acasă", "")}${L("#ecuson", session ? "Ecusonul meu" : "Ecusonul tău și conectarea", coursePct() + "% din curs")}${L("#cum", "Cum funcționează", "")}${L("#ce", "Ce vei ști să faci", "")}${L("#certificat", "Certificatul", passed() + " din " + M.length + " teste")}${leader ? L("#rezultate", "Rezultatele echipei", "doar coordonator") : ""}${L("#contact", "Contact", "")}
    </ul>
    ${CH.map(c => `<h2 class="menu-h"><a href="#cap-${c.id}">${c.t}</a><span>${chPct(c)}%</span></h2>
      <ul class="mlessons">${c.mods.map(i => `<li><a class="mles${state.done[i] ? " done" : ""}" href="#lectia-${i + 1}"><span>${M[i].t}</span><span class="pc">${state.done[i] ? ic("check") : ""}${pct(i)}%</span></a></li>`).join("")}</ul>`).join("")}
  </div>`;
}
function openMenu(){
  const d = document.getElementById("menu");
  if (!d) return;
  d.innerHTML = menuHTML();
  if (d.showModal) d.showModal(); else d.setAttribute("open", "");
  d.querySelector("[data-close]").focus();
}
const closeMenu = () => { const d = document.getElementById("menu"); if (d && d.open) { if (d.close) d.close(); else d.removeAttribute("open"); } };
document.addEventListener("click", e => {
  if (e.target.closest("[data-menu]")) { e.preventDefault(); openMenu(); return; }
  if (e.target.closest("[data-close]") || e.target.id === "menu") { closeMenu(); return; }
  if (e.target.closest("[data-top]")) { if (!location.hash || location.hash === "#") { e.preventDefault(); scrollTo({top: 0, behavior: reduced ? "auto" : "smooth"}); } closeMenu(); return; }
  if (e.target.closest("#menu a")) closeMenu();
});

// ─── ACASĂ ───
function home(){
  view = "home";
  const nx = nextModule(), started = coursePct() > 0;
  const cta = nx === null ? `<a class="btn dark" href="#certificat">Vezi certificatul</a>` : `<a class="btn dark" href="#lectia-${nx + 1}"><span>${started ? "Continuă: " + M[nx].t : "Începe cu prima lecție"}</span>${ic("arrow")}</a>`;
  app.innerHTML = barHTML() + `
  <main>
  <section class="hero" aria-labelledby="h1">
    <div class="hero-photo"><img id="heroImg" src="assets/dom-vedere-interioara.jpg" width="1920" height="1278" alt="Nava Domului romano-catolic Sfântul Gheorghe din Timișoara" fetchpriority="high"></div>
    <div class="hero-copy wrap">
      <h1 id="h1" class="rv">Școala Voluntarilor</h1>
      <p class="lede rv" style="--i:1">Un curs scurt pentru voluntarii corului și ai evenimentelor pentru tineri din Timișoara: ${M.length} lecții, câte un test și un certificat la final.</p>
    </div>
    <div class="stack" id="stack">
      ${CH.map((c, k) => `<a class="folder" href="#cap-${c.id}" style="--k:${k};--tone:${c.tone};--tone-ink:${c.ink};--x:${[0, 26, 52, 8][k]}%"><span class="tab">${c.t}</span><span class="fmeta">${c.mods.length} lecții · ${chPct(c)}%</span></a>`).join("")}
      <div class="folder front" style="--k:${CH.length};--tone:var(--paper);--tone-ink:var(--paper-ink);--x:70%">
        <span class="tab">Mapa ta</span>
        <div class="row">${cta}<p>${started ? `Ai parcurs <b>${coursePct()}%</b> din curs. ` : ""}Fiecare lecție durează în jur de 15 minute și se termină cu 5 întrebări.</p></div>
      </div>
    </div>
  </section>

  <section class="sec wrap intro" aria-labelledby="h-intro">
    <div class="inner">
      <div class="grid top">
        <h2 id="h-intro" class="rv">Pregătit pentru orice seară</h2>
        <p class="note rv" style="--i:1">Concertele, slujbele de sărbători și întâlnirile cu tinerii merg bine când fiecare voluntar știe ce are de făcut. Cursul acesta te pregătește, în ritmul tău, de pe telefon.</p>
      </div>
      <div class="facts">
        <div class="fact rv" style="--i:0"><b>${M.length} lecții</b><span>în patru capitole, de la primire la urgențe</span></div>
        <div class="fact rv" style="--i:1"><b>15 minute</b><span>cât durează, în medie, o lecție</span></div>
        <div class="fact rv" style="--i:2"><b>4 din 5</b><span>răspunsuri corecte ca să treci testul</span></div>
        <div class="fact rv" style="--i:3"><b>1 certificat</b><span>după ce treci toate testele</span></div>
      </div>
    </div>
  </section>

  <section class="sec wrap badge-sec" id="ecuson" aria-labelledby="h-badge">
    <div class="inner grid">
      <div class="badge-copy">
        <h2 id="h-badge" class="rv">Ecusonul tău</h2>
        <p class="rv" style="--i:1">Scrie-ți numele și urmărește cum se umple ecusonul pe măsură ce citești lecțiile și treci testele.</p>
        <div class="field rv" style="--i:2"><label for="hname">Numele tău complet</label><input id="hname" autocomplete="name" value="${esc(state.name)}" placeholder="de exemplu, Maria Popescu"></div>
        <div class="login rv" style="--i:3" id="login"></div>
      </div>
      <div class="badge rv" style="--i:2" id="badge" aria-live="polite"></div>
    </div>
  </section>

  <section class="chapters" aria-labelledby="h-lessons">
    <div class="wrap chapters-head" id="cap"><div class="inner grid">
      <h2 id="h-lessons" class="rv">Lecțiile, pe capitole</h2>
      <p class="rv" style="--i:1">Ia-le în ordine sau începe cu ce te interesează. Procentul arată cât ai citit din fiecare lecție și dacă ai trecut testul.</p>
    </div></div>
    ${CH.map((c, k) => chapterHTML(c, k)).join("")}
  </section>

  <section class="sec wrap how" id="cum" aria-labelledby="h-how">
    <div class="inner grid">
      <div class="copy">
        <h2 id="h-how" class="rv">Cum funcționează</h2>
        <p class="rv" style="--i:1">Fiecare lecție e scurtă și practică. Citești, răspunzi la cinci întrebări, apoi treci la următoarea.</p>
      </div>
      <div class="slip rv" style="--i:1">
        <h3>Fiecare lecție</h3>
        <div class="r"><span>Citești lecția, pe părți</span><i></i><span>~10 min</span></div>
        <div class="r"><span>Răspunzi la test</span><i></i><span>5 întrebări</span></div>
        <div class="r"><span>Ca să treci</span><i></i><span>4 corecte</span></div>
        <h3>Progresul tău</h3>
        <div class="r"><span>Lecția citită până la capăt</span><i></i><span>70%</span></div>
        <div class="r"><span>Testul trecut</span><i></i><span>100%</span></div>
        <h3>La final</h3>
        <div class="r"><span>Toate cele ${M.length} lecții</span><i></i><span>~3,5 ore</span></div>
        <div class="total"><span>Certificatul tău</span><span>${passed()} / ${M.length}</span></div>
      </div>
    </div>
  </section>

  <section class="sec wrap topics" id="ce" aria-labelledby="h-topics">
    <div class="tcard rv">
      <h2 id="h-topics">Ce vei ști să faci</h2>
      <img src="assets/domul-romano-catolic-din-timisoara-2023-img.jpg" width="1920" height="1536" alt="Fațada Domului romano-catolic din Timișoara" loading="lazy">
      <p class="cap">Domul din Piața Unirii, Timișoara, 2023</p>
      <p>Să primești publicul&nbsp;· să găsești un copil pierdut&nbsp;· să ții culoarele libere&nbsp;· să suni corect la 112&nbsp;· să ajuți un om care leșină&nbsp;· să asculți pe cineva care suferă&nbsp;· să calmezi o ceartă&nbsp;· să protejezi tinerii&nbsp;· să faci poze cu acord&nbsp;· să ajuți o persoană în scaun cu rotile&nbsp;· să lucrezi în echipă</p>
    </div>
  </section>
  </main>
  ${footHTML()}`;
  paintBar(); paintBadge(); paintLogin(); wireHome(); afterRender();
}

function chapterHTML(c, k){
  return `<article class="chap wrap ${c.dark ? "dark-tone" : ""}" id="cap-${c.id}" style="--k:${k};--tone:${c.tone};--tone-ink:${c.ink};--tab:${c.tab};--tab-ink:${c.tabInk}" aria-labelledby="h-${c.id}">
    <div class="inner">
      <div class="strip"><h3 class="tab" id="h-${c.id}">${c.t}</h3><span class="meta">${c.mods.length} lecții · ${chPct(c)}%</span></div>
      <div class="grid body">
        <div class="frame rv"><div class="preview" data-preview aria-live="polite"></div>
          <figure><img src="${c.img}" alt="${c.alt}" loading="lazy" width="1600" height="1000"><figcaption>${c.cap}</figcaption></figure></div>
        <ul class="index" data-index>
          ${c.mods.map((i, n) => `<li class="rv" style="--i:${n}"><button class="mrow" data-m="${i}" type="button">
            <strong>${M[i].t}</strong><span class="pc">${pct(i)}%</span><span class="bar2" style="--p:${pct(i) / 100}"></span><span class="d">${M[i].d}</span></button></li>`).join("")}
        </ul>
      </div>
    </div>
  </article>`;
}

function previewHTML(i){
  const p = pct(i), label = state.done[i] ? `Test trecut, ${state.done[i]} din 5` : p ? `${p}% citit` : "Neînceput";
  return `<h3>${M[i].t}</h3><p>${M[i].d}.</p><p><span class="pill">${label}</span></p>`;
}

function wireHome(){
  // index with preview: pointing at a row shows that lesson in the chapter's frame and dims the others
  document.querySelectorAll(".chap").forEach(ch => {
    const idx = ch.querySelector("[data-index]"), pv = ch.querySelector("[data-preview]");
    const show = i => { pv.classList.add("fade"); setTimeout(() => { pv.innerHTML = previewHTML(i); pv.classList.remove("fade"); }, reduced ? 0 : 120); };
    const first = +idx.querySelector(".mrow").dataset.m;
    pv.innerHTML = previewHTML(first);
    idx.querySelectorAll(".mrow").forEach(b => {
      b.onclick = () => { location.hash = "lectia-" + (+b.dataset.m + 1); };
      const on = () => { idx.classList.add("dim"); idx.querySelectorAll(".mrow").forEach(x => x.classList.toggle("on", x === b)); show(+b.dataset.m); };
      b.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") on(); });
      b.addEventListener("focus", on);
    });
    idx.addEventListener("pointerleave", () => { idx.classList.remove("dim"); idx.querySelectorAll(".mrow").forEach(x => x.classList.remove("on")); });
  });
  const hn = document.getElementById("hname");
  hn.oninput = () => { state.name = hn.value; save(); paintBadge(); };
  hn.onchange = sync;
  requestAnimationFrame(() => document.getElementById("stack").classList.add("in"));
  // the hero photo moves slower than the page
  const img = document.getElementById("heroImg");
  if (!reduced) addScroll(() => { const y = scrollY; if (y < innerHeight * 1.2) img.style.translate = `0 ${y * 0.18}px`; });
}

function paintBadge(){
  const el = document.getElementById("badge");
  if (!el) return;
  const p = coursePct(), r = 40, len = 2 * Math.PI * r;
  el.innerHTML = `
    <span class="who"></span>
    <span class="role">Voluntar · Timișoara</span>
    <div class="ring"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="bgc" cx="50" cy="50" r="${r}"/><circle class="fg" cx="50" cy="50" r="${r}" stroke-dasharray="${len}" stroke-dashoffset="${len}"/></svg>
      <div><b>${p}%</b><span>${passed()} din ${M.length} teste trecute</span></div></div>
    <div class="chbars">${CH.map(c => `<div class="chbar" style="--p:${chPct(c) / 100}"><span>${c.t}</span><span>${chPct(c)}%</span><i></i></div>`).join("")}</div>`;
  el.querySelector(".who").textContent = state.name || "Numele tău";
  requestAnimationFrame(() => requestAnimationFrame(() => { const fg = el.querySelector(".fg"); if (fg) fg.style.strokeDashoffset = len * (1 - p / 100); }));
}

function paintLogin(){
  const el = document.getElementById("login");
  if (!el) return;
  if (!sb) { el.innerHTML = `<p class="small">Progresul se salvează doar pe acest dispozitiv.</p>`; return; }
  if (session) {
    el.innerHTML = `<p class="small">Conectat ca <b>${esc(session.user.email)}</b>. Progresul tău ajunge la coordonator. <button class="link" id="logout" type="button">Deconectare</button></p>`;
    document.getElementById("logout").onclick = () => sb.auth.signOut();
    return;
  }
  el.innerHTML = `
    <p>Conectează-te ca progresul să ajungă la coordonator și să îl ai pe orice telefon.</p>
    <div class="row"><button class="btn" id="google" type="button">Continuă cu Google</button></div>
    <form class="row" id="otp"><div class="field"><label for="email">Sau primește un link pe email</label><input id="email" type="email" autocomplete="email" required placeholder="nume@exemplu.ro"></div><button class="btn quiet" type="submit">Trimite linkul</button></form>
    <p class="msg" id="lmsg" aria-live="polite">${loginMsg}</p>
    <p class="small">Prin conectare ești de acord cu <a href="tos/">Termenii și condițiile</a> și <a href="privacy/">Politica de confidențialitate</a>.</p>`;
  document.getElementById("google").onclick = () => sb.auth.signInWithOAuth({provider: "google", options: {redirectTo: here()}});
  document.getElementById("otp").onsubmit = async e => {
    e.preventDefault();
    const msg = document.getElementById("lmsg");
    msg.className = "msg"; msg.textContent = "Se trimite…";
    const {error} = await sb.auth.signInWithOtp({email: document.getElementById("email").value.trim(), options: {emailRedirectTo: here()}});
    msg.className = error ? "msg err" : "msg";
    msg.textContent = loginMsg = error ? "Nu am putut trimite emailul: " + error.message + ". Încearcă din nou peste un minut." : "Ți-am trimis un link. Deschide emailul (verifică și Spam) și apasă pe link o singură dată.";
  };
}

function footHTML(){
  const F = (tag, attrs, icon, t, s) => `<${tag} class="fbtn" ${attrs}>${ic(icon)}<span><b>${t}</b><small>${s}</small></span>${ic("arrow")}</${tag}>`;
  return `<footer class="foot wrap" id="contact" aria-labelledby="h-foot">
    <svg class="scallop" viewBox="0 0 1200 50" preserveAspectRatio="none" aria-hidden="true"><path d="M0 50${" a50 50 0 0 1 100 0".repeat(12)}Z"/></svg>
    <div class="back">
      <div class="stamp"><img src="assets/timisoara-biserica-millennium.jpg" alt="Biserica Millennium din Fabric, Timișoara" loading="lazy" width="600" height="800"></div>
      <h2 id="h-foot">Mulțumim că slujești</h2>
      <p class="msgtxt">Fiecare concert și fiecare întâlnire cu tinerii se sprijină pe oameni care vin mai devreme și pleacă ultimii. Ai o întrebare sau o idee pentru o lecție nouă? Scrie-ne.</p>
      <div class="factions">
        ${F("a", 'href="mailto:cornelmrn18@gmail.com"', "mail", "Scrie-ne", "cornelmrn18@gmail.com")}
        ${F("button", 'type="button" data-menu', "book", "Toate lecțiile", M.length + " lecții în " + CH.length + " capitole")}
        ${F("a", 'href="#ecuson"', "user", "Ecusonul tău", "progresul și conectarea")}
        ${F("a", 'href="#" data-top', "up", "Înapoi sus", "la începutul paginii")}
      </div>
      <p class="legal"><a href="privacy/">Politica de confidențialitate</a><a href="tos/">Termeni și condiții</a><span>Timișoara, România</span></p>
      <p class="imprint">Școala Voluntarilor · 2026 · curs intern, gratuit</p>
    </div>
    <p class="credits">Fotografii: „Dom - vedere interioara” de Popescu Camelia, CC BY-SA 3.0; „April 2023 - Piața Unirii din Timișoara - img 03” și „Domul Romano-Catolic din Timișoara (2023) - IMG 06” de Chainwit., CC BY 4.0 / CC BY-SA 4.0; Piața Unirii 1937, Willy Pragher, Landesarchiv Baden-Württemberg, CC BY 3.0; „Piarist Church, Timișoara (2023) - img 12” de Chainwit., CC BY 4.0; „Timisoara, biserica Millennium” de Turbojet, CC BY-SA 4.0. Toate prin <a href="https://commons.wikimedia.org">Wikimedia Commons</a>. Fotografia corului: arhiva corului.</p>
  </footer>`;
}

// ─── LECȚIA ───
function lesson(i){
  view = "lesson";
  const m = M[i], c = chOf(i), pos = c.mods.indexOf(i);
  app.innerHTML = barHTML() + `<div class="readbar" id="readbar"></div>
  <main class="page wrap">
    <article class="sheet" aria-labelledby="h1">
      <a class="back-link" href="#cap-${c.id}">${ic("back")}<span>Capitolul ${c.t}</span></a>
      <h1 id="h1" class="rv">${m.t}</h1>
      <div class="facts-line rv" style="--i:1"><span>Lecția ${pos + 1} din ${c.mods.length} în capitolul ${c.t}</span><span>~15 min</span><span class="pill" id="lpct">${pct(i)}%</span></div>
      <div class="lesson-body" id="lbody"></div>
    </article>
    <form class="stub" id="quiz" aria-labelledby="h-quiz">
      <h2 id="h-quiz">Verifică ce ai învățat</h2>
      <p>Cinci întrebări. Ai nevoie de cel puțin ${PASS} răspunsuri corecte.</p>
      ${m.q.map((q, k) => `<fieldset class="q" id="q${k}"><legend>${q[0]}</legend>
        ${shuffle(q[1].map((o, j) => j)).map(j => `<label><input type="radio" name="q${k}" id="q${k}o${j}" value="${j}" required> <span>${q[1][j]}</span></label>`).join("")}
        <p class="why" hidden></p></fieldset>`).join("")}
      <div class="result" id="res" aria-live="polite"><button class="btn dark" type="submit">Verifică răspunsurile</button></div>
    </form>
    <nav class="next" aria-label="Lecții">
      ${i > 0 ? `<a class="btn quiet" href="#lectia-${i}">${ic("back")}<span>${M[i - 1].t}</span></a>` : "<span></span>"}
      ${i + 1 < M.length ? `<a class="btn quiet" href="#lectia-${i + 2}"><span>${M[i + 1].t}</span>${ic("arrow")}</a>` : `<button class="btn quiet" type="button" data-menu>${ic("book")}<span>Toate lecțiile</span></button>`}
    </nav>
  </main>`;
  // split the lesson into parts at each heading, so reading can be measured part by part
  const body = document.getElementById("lbody"), tmp = document.createElement("div");
  tmp.innerHTML = m.html;
  let part = null;
  [...tmp.children].forEach(el => {
    if (!part || el.tagName === "H3") { part = document.createElement("section"); part.className = "part rv"; body.appendChild(part); }
    part.appendChild(el);
  });
  const parts = [...body.children], seen = new Set();
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    seen.add(e.target); io.unobserve(e.target);
    const f = seen.size / parts.length;
    if (f > (state.read[i] || 0)) { state.read[i] = f; save(); syncSoon(); document.getElementById("lpct").textContent = pct(i) + "%"; }
  }), {rootMargin: "0px 0px -35% 0px"});
  parts.forEach(p => io.observe(p));
  const bar = document.getElementById("readbar");
  addScroll(() => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`; });

  document.getElementById("quiz").onsubmit = e => {
    e.preventDefault();
    let score = 0;
    m.q.forEach((q, k) => {
      const box = document.getElementById("q" + k), pick = +new FormData(e.target).get("q" + k), ok = pick === q[2], why = box.querySelector(".why");
      score += ok;
      box.className = "q " + (ok ? "right" : "wrong");
      box.querySelectorAll("label").forEach(l => { const v = +l.querySelector("input").value; l.classList.toggle("pick", v === pick); l.classList.toggle("answer", !ok && v === q[2]); });
      why.hidden = false;
      why.innerHTML = (ok ? "<b>Corect.</b> " : `<b>Răspunsul corect:</b> ${q[1][q[2]]}. `) + q[3];
    });
    const res = document.getElementById("res");
    if (score >= PASS) {
      state.done[i] = Math.max(score, state.done[i] || 0); state.read[i] = 1; save(); sync();
      document.getElementById("lpct").textContent = "100%";
      const nx = nextModule();
      res.innerHTML = `<p>${score} din 5. Ai trecut lecția.</p>${nx === null ? `<a class="btn dark" href="#certificat">Vezi certificatul</a>` : `<a class="btn dark" href="#lectia-${nx + 1}">Următoarea: ${M[nx].t}</a>`}`;
    } else {
      res.innerHTML = `<p>${score} din 5. Mai ai nevoie de ${PASS - score}.</p><span class="small" style="color:var(--paper-muted)">Citește explicațiile de mai sus și încearcă din nou.</span><button class="btn dark" type="button" id="again">Încearcă din nou</button>`;
      document.getElementById("again").onclick = () => { lesson(i); document.getElementById("quiz").scrollIntoView(); };
    }
    res.scrollIntoView({behavior: reduced ? "auto" : "smooth", block: "center"});
  };
  paintBar(); afterRender();
}

// ─── REZULTATELE ECHIPEI ───
async function teamView(){
  view = "team";
  app.innerHTML = barHTML() + `<main class="page wrap"><article class="sheet" aria-labelledby="h1"><a class="back-link" href="#">${ic("back")}<span>Înapoi la curs</span></a><h1 id="h1">Rezultatele echipei</h1><div id="tbody"><p style="margin-top:20px">Se încarcă…</p></div></article></main>`;
  paintBar();
  if (!sb || !leader) { document.getElementById("tbody").innerHTML = `<p style="margin-top:20px">Pagina e doar pentru coordonator. Conectează-te cu contul de coordonator.</p>`; return; }
  const {data, error} = await sb.from("results").select("*").order("updated", {ascending: false});
  if (view !== "team") return;
  const rows = data || [];
  const rp = sc => Math.round(M.reduce((s, m, i) => s + (sc[i] ? 100 : 70 * Math.min(1, (sc.read || {})[i] || 0)), 0) / M.length);
  document.getElementById("tbody").innerHTML = error ? `<p style="margin-top:20px">Nu am putut încărca rezultatele: ${esc(error.message)}</p>` : `
    <p style="margin-top:20px">${rows.length} voluntari au început cursul. Coloanele arată scorul cel mai bun la fiecare test, din 5.</p>
    <p style="margin-top:12px"><button class="btn dark" type="button" id="refresh">Reîncarcă</button></p>
    ${rows.length ? `<div class="tablewrap"><table><thead><tr><th>Voluntar</th><th>Curs</th><th>Teste</th>${M.map((m, i) => `<th title="${esc(m.t)}">L${i + 1}</th>`).join("")}<th>Activ</th></tr></thead><tbody>
    ${rows.map(r => { const sc = r.scores || {}, n = Object.keys(sc).filter(k => k !== "read").length; return `<tr>
      <td>${esc(r.name || r.email || "Voluntar fără nume")}</td><td>${rp(sc)}%</td><td>${n}/${M.length}</td>
      ${M.map((m, i) => `<td>${sc[i] ? sc[i] : "–"}</td>`).join("")}
      <td>${new Date(r.updated).toLocaleDateString("ro-RO")}</td></tr>`; }).join("")}
    </tbody></table></div>` : `<p style="margin-top:20px">Încă nu a trimis nimeni rezultate. Când un voluntar conectat trece primul test, apare aici.</p>`}`;
  const rf = document.getElementById("refresh");
  if (rf) rf.onclick = teamView;
}

// ─── CERTIFICATUL ───
function cert(){
  view = "cert";
  const all = passed() === M.length;
  const date = new Date().toLocaleDateString("ro-RO", {day: "numeric", month: "long", year: "numeric"});
  app.innerHTML = barHTML() + `<main class="page wrap"><article class="sheet" aria-labelledby="h1">
    <a class="back-link" href="#">${ic("back")}<span>Înapoi la curs</span></a>
    <h1 id="h1">${all ? "Felicitări!" : "Certificatul tău"}</h1>
    ${all ? `
    <div class="field" style="margin-top:24px"><label for="name">Numele de pe certificat</label><input id="name" style="background:var(--paper-2);color:var(--paper-ink)" value="${esc(state.name)}"></div>
    <div class="cert">
      <span>Certificat de absolvire</span>
      <div class="who" id="who"></div>
      <p>a absolvit cursul <b>Școala Voluntarilor</b>, cu toate cele ${M.length} lecții trecute.</p>
      <p class="small" style="color:var(--paper-muted)">${date} · Coordonator echipă: ______________</p>
    </div>
    <p style="margin-top:16px">Fă o captură de ecran și trimite-o coordonatorului.</p>` : `<p style="margin-top:20px">Ai trecut ${passed()} din ${M.length} teste. Certificatul apare aici după ultimul test.</p><p style="margin-top:20px"><a class="btn dark" href="#">Înapoi la lecții</a></p>`}
  </article></main>`;
  paintBar();
  if (!all) return;
  const who = document.getElementById("who"), inp = document.getElementById("name");
  who.textContent = state.name || "Numele tău";
  inp.oninput = () => { state.name = inp.value; save(); who.textContent = state.name || "Numele tău"; };
  inp.onchange = sync;
}

// ─── MIȘCARE ───
let scrollFns = [];
const addScroll = f => { scrollFns.push(f); f(); };
let ticking = false, lastY = 0;
addEventListener("scroll", () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    scrollFns.forEach(f => f());
    const bar = document.getElementById("bar"), y = scrollY;
    if (bar && view !== "home") bar.classList.toggle("hide", y > lastY && y > 200);
    lastY = y; ticking = false;
  });
}, {passive: true});
let revealIO = null;
function afterRender(){
  if (revealIO) revealIO.disconnect();
  revealIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); } }), {rootMargin: "0px 0px -8% 0px"});
  document.querySelectorAll(".rv").forEach(el => revealIO.observe(el));
}

// ─── RUTE ───
// #lectia-3, #rezultate, #certificat; orice altceva (#cap-..., #ecuson) e pagina principală
let lastView = "";
function route(){
  closeMenu();
  const h = location.hash.slice(1);
  const lm = /^lectia-(\d+)$/.exec(h);
  if (lm && M[+lm[1] - 1]) { scrollFns = []; lesson(+lm[1] - 1); scrollTo(0, 0); }
  else if (h === "rezultate") { scrollFns = []; teamView(); scrollTo(0, 0); }
  else if (h === "certificat") { scrollFns = []; cert(); scrollTo(0, 0); }
  else {
    if (view !== "home" || lastView !== "home") { scrollFns = []; home(); }
    const t = h && document.getElementById(h);
    if (t) t.scrollIntoView({behavior: lastView === "home" && !reduced ? "smooth" : "auto"}); else if (!h) scrollTo(0, 0);
  }
  lastView = view;
}
addEventListener("hashchange", route);
route();
