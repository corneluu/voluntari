// ─── STARE ───
const C = window.CONFIG || {}, KEY = "scoala-voluntarilor-v1", CKEY = "scoala-voluntarilor-content";
let state = {done:{}, read:{}, name:""};
try { state = Object.assign(state, JSON.parse(localStorage.getItem(KEY)) || {}); } catch(e){}
state.read = state.read || {};
// progress used to be keyed by the lesson's position in modules.js (0..13); lessons now have ids m1..m14
const fixKeys = o => { const r = {}; for (const k in o || {}) r[/^\d+$/.test(k) ? "m" + (+k + 1) : k] = o[k]; return r; };
state.done = fixKeys(state.done); state.read = fixKeys(state.read);
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){} };
const app = document.getElementById("app");
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const here = () => location.origin + location.pathname;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
// answer order is shuffled on every attempt so the right answer isn't always in the same spot
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ─── CONȚINUT ───
// M = all lessons in course order, CH = chapters with mods = indexes into M. Built from the database copy, or content.js.
let M = [], CH = [], SITE = {};
function applyContent(c){
  SITE = Object.assign({}, window.DEFAULT_CONTENT.site, c.site || {});
  M = []; CH = [];
  (c.chapters || []).forEach(ch => {
    const mods = (ch.lessons || []).filter(l => l && l.id).map(l => { M.push(l); return M.length - 1; });
    CH.push(Object.assign({}, ch, window.TONES[ch.tone] || window.TONES.paper, {mods}));
  });
  CH = CH.filter(c => c.mods.length);
}
let cached = null;
try { cached = JSON.parse(localStorage.getItem(CKEY)); } catch(e){}
applyContent(cached && cached.data ? cached.data : window.DEFAULT_CONTENT);
const img = p => esc(p || "");
const chOf = i => CH.find(c => c.mods.includes(i));
const passMark = m => Math.max(1, Math.ceil(m.q.length * 0.8));

// ─── PROGRES ───
// Lecția citită (pe părți, la derulare) valorează până la 70%; testul trecut duce lecția la 100%.
const K = i => M[i].id;
const pct = i => state.done[K(i)] ? 100 : Math.round(70 * Math.min(1, state.read[K(i)] || 0));
const chPct = c => Math.round(c.mods.reduce((s, i) => s + pct(i), 0) / c.mods.length);
const coursePct = () => M.length ? Math.round(M.reduce((s, m, i) => s + pct(i), 0) / M.length) : 0;
const passed = () => M.filter(m => state.done[m.id]).length;
const nextModule = () => { for (const c of CH) for (const i of c.mods) if (!state.done[K(i)]) return i; return null; };
const lessonHref = i => "#lectia-" + K(i);

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
// one row per test attempt or finished reading, for the team history (Google Sheet + admin CSV)
const logActivity = (m, kind, score, total, ok) => {
  if (!sb || !session) return;
  sb.from("activity").insert({user_id: session.user.id, email: session.user.email, name: state.name, lesson_id: m.id, lesson_title: m.t, kind, score, total, passed: ok})
    .then(r => r && r.error && console.warn("activity", r.error.message));
};
let readTimer = 0;
const syncSoon = () => { clearTimeout(readTimer); readTimer = setTimeout(sync, 2500); };

async function onSession(s){
  session = s; leader = false;
  if (session) {
    if (!state.name) state.name = session.user.user_metadata?.full_name || "";
    const {data} = await sb.from("results").select("name,scores").eq("user_id", session.user.id).maybeSingle();
    if (data) { // îmbină rezultatele de pe alt dispozitiv
      const sc = fixKeys(data.scores), rd = fixKeys((data.scores || {}).read);
      for (const k in sc) if (k !== "read") state.done[k] = Math.max(sc[k], state.done[k] || 0);
      for (const k in rd) state.read[k] = Math.max(rd[k], state.read[k] || 0);
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
const goTarget = () => { const nx = nextModule(); return nx === null ? {href: "#certificat", label: "Certificatul", t: ""} : {href: lessonHref(nx), label: coursePct() > 0 ? "Continuă" : "Începe", t: M[nx].t}; };

function barHTML(){
  return `<header class="bar wrap" id="bar">
    <button class="menu-btn" type="button" data-menu aria-haspopup="dialog" aria-controls="menu" aria-label="Deschide meniul">${ic("menu")}<span>Meniu</span></button>
    <a class="mark" href="#" data-top>${esc(SITE.name)}</a>
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
    <div class="menu-top"><span class="mark">${esc(SITE.name)}</span><button class="close" type="button" data-close>${ic("close")}<span>Închide</span></button></div>
    <a class="btn wide" href="${g.href}"><span>${g.label}${g.t ? ": " + esc(g.t) : ""}</span>${ic("arrow")}</a>
    <h2 class="menu-h">Pagina</h2>
    <ul class="mlinks">
      ${L("#", "Acasă", "")}${L("#ecuson", session ? "Ecusonul meu" : "Ecusonul tău și conectarea", coursePct() + "% din curs")}${L("#cum", "Cum funcționează", "")}${L("#ce", "Ce vei ști să faci", "")}${L("#certificat", "Certificatul", passed() + " din " + M.length + " teste")}${leader ? L("#rezultate", "Rezultatele echipei", "doar coordonator") + L("admin/", "Panoul de administrare", "editează cursul") : ""}${L("#contact", "Contact", "")}
    </ul>
    ${CH.map(c => `<h2 class="menu-h"><a href="#cap-${c.id}">${esc(c.t)}</a><span>${chPct(c)}%</span></h2>
      <ul class="mlessons">${c.mods.map(i => `<li><a class="mles${state.done[K(i)] ? " done" : ""}" href="${lessonHref(i)}"><span>${esc(M[i].t)}</span><span class="pc">${state.done[K(i)] ? ic("check") : ""}${pct(i)}%</span></a></li>`).join("")}</ul>`).join("")}
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
  const cta = nx === null ? `<a class="btn dark" href="#certificat">Vezi certificatul</a>` : `<a class="btn dark" href="${lessonHref(nx)}"><span>${started ? "Continuă: " + esc(M[nx].t) : "Începe cu prima lecție"}</span>${ic("arrow")}</a>`;
  app.innerHTML = barHTML() + `
  <main>
  <section class="hero" aria-labelledby="h1">
    <div class="hero-photo"><img id="heroImg" src="${img(SITE.heroImg)}" width="1920" height="1278" alt="${esc(SITE.heroAlt)}" fetchpriority="high"></div>
    <div class="hero-copy wrap">
      <h1 id="h1" class="rv">${esc(SITE.name)}</h1>
      <p class="lede rv" style="--i:1">${esc(SITE.lede).replace("{n}", M.length)}</p>
    </div>
    <div class="stack" id="stack">
      ${CH.map((c, k) => `<a class="folder" href="#cap-${c.id}" style="--k:${k};--tone:${c.tone};--tone-ink:${c.ink};--x:${[0, 26, 52, 8, 38, 64][k % 6]}%"><span class="tab">${esc(c.t)}</span><span class="fmeta">${c.mods.length} lecții · ${chPct(c)}%</span></a>`).join("")}
      <div class="folder front" style="--k:${CH.length};--tone:var(--paper);--tone-ink:var(--paper-ink);--x:70%">
        <span class="tab">Mapa ta</span>
        <div class="row">${cta}<p>${started ? `Ai parcurs <b>${coursePct()}%</b> din curs. ` : ""}Fiecare lecție durează în jur de 15 minute și se termină cu un test scurt.</p></div>
      </div>
    </div>
  </section>

  <section class="sec wrap intro" aria-labelledby="h-intro">
    <div class="inner">
      <div class="grid top">
        <h2 id="h-intro" class="rv">${esc(SITE.introTitle)}</h2>
        <p class="note rv" style="--i:1">${esc(SITE.introText)}</p>
      </div>
      <div class="facts">
        <div class="fact rv" style="--i:0"><b>${M.length} lecții</b><span>în ${CH.length} capitole, de la primire la urgențe</span></div>
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
      <h2 id="h-topics">${esc(SITE.topicsTitle)}</h2>
      ${SITE.topicsImg ? `<img src="${img(SITE.topicsImg)}" width="1920" height="1536" alt="${esc(SITE.topicsAlt)}" loading="lazy">
      <p class="cap">${esc(SITE.topicsCap)}</p>` : ""}
      <p>${String(SITE.topics || "").split("\n").map(s => s.trim()).filter(Boolean).map(esc).join("&nbsp;· ")}</p>
    </div>
  </section>
  </main>
  ${footHTML()}`;
  paintBar(); paintBadge(); paintLogin(); wireHome(); afterRender();
}

function chapterHTML(c, k){
  return `<article class="chap wrap ${c.dark ? "dark-tone" : ""}" id="cap-${c.id}" style="--k:${k};--tone:${c.tone};--tone-ink:${c.ink};--tab:${c.tab};--tab-ink:${c.tabInk}" aria-labelledby="h-${c.id}">
    <div class="inner">
      <div class="strip"><h3 class="tab" id="h-${c.id}">${esc(c.t)}</h3><span class="meta">${c.mods.length} lecții · ${chPct(c)}%</span></div>
      <div class="grid body">
        <div class="frame rv"><div class="preview" data-preview aria-live="polite"></div>
          ${c.img ? `<figure><img src="${img(c.img)}" alt="${esc(c.alt)}" loading="lazy" width="1600" height="1000"><figcaption>${esc(c.cap)}</figcaption></figure>` : ""}</div>
        <ul class="index" data-index>
          ${c.mods.map((i, n) => `<li class="rv" style="--i:${n}"><button class="mrow" data-m="${i}" type="button">
            <strong>${esc(M[i].t)}</strong><span class="pc">${pct(i)}%</span><span class="bar2" style="--p:${pct(i) / 100}"></span><span class="d">${esc(M[i].d)}</span></button></li>`).join("")}
        </ul>
      </div>
    </div>
  </article>`;
}

function previewHTML(i){
  const p = pct(i), sc = state.done[K(i)], label = sc ? `Test trecut, ${sc} din ${M[i].q.length}` : p ? `${p}% citit` : "Neînceput";
  return `<h3>${esc(M[i].t)}</h3><p>${esc(M[i].d)}</p><p><span class="pill">${label}</span></p>`;
}

function wireHome(){
  // index with preview: pointing at a row shows that lesson in the chapter's frame and dims the others
  document.querySelectorAll(".chap").forEach(ch => {
    const idx = ch.querySelector("[data-index]"), pv = ch.querySelector("[data-preview]");
    const show = i => { pv.classList.add("fade"); setTimeout(() => { pv.innerHTML = previewHTML(i); pv.classList.remove("fade"); }, reduced ? 0 : 120); };
    const fr = idx.querySelector(".mrow"); if (!fr) return;
    const first = +fr.dataset.m;
    pv.innerHTML = previewHTML(first);
    idx.querySelectorAll(".mrow").forEach(b => {
      b.onclick = () => { location.hash = lessonHref(+b.dataset.m).slice(1); };
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
    <div class="chbars">${CH.map(c => `<div class="chbar" style="--p:${chPct(c) / 100}"><span>${esc(c.t)}</span><span>${chPct(c)}%</span><i></i></div>`).join("")}</div>`;
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
      ${SITE.stampImg ? `<div class="stamp"><img src="${img(SITE.stampImg)}" alt="${esc(SITE.stampAlt)}" loading="lazy" width="600" height="800"></div>` : ""}
      <h2 id="h-foot">${esc(SITE.footTitle)}</h2>
      <p class="msgtxt">${esc(SITE.footText)}</p>
      <div class="factions">
        ${SITE.email ? F("a", `href="mailto:${esc(SITE.email)}"`, "mail", "Scrie-ne", esc(SITE.email)) : ""}
        ${F("button", 'type="button" data-menu', "book", "Toate lecțiile", M.length + " lecții în " + CH.length + " capitole")}
        ${F("a", 'href="#ecuson"', "user", "Ecusonul tău", "progresul și conectarea")}
        ${F("a", 'href="#" data-top', "up", "Înapoi sus", "la începutul paginii")}
      </div>
      <p class="legal"><a href="privacy/">Politica de confidențialitate</a><a href="tos/">Termeni și condiții</a><span>Timișoara, România</span></p>
      <p class="imprint">${esc(SITE.name)} · ${new Date().getFullYear()} · curs intern, gratuit</p>
    </div>
    ${SITE.credits ? `<p class="credits">${esc(SITE.credits)}</p>` : ""}
  </footer>`;
}

// ─── LECȚIA ───
function lesson(i){
  view = "lesson";
  const m = M[i], c = chOf(i), pos = c.mods.indexOf(i), PASS = passMark(m), id = K(i);
  app.innerHTML = barHTML() + `<div class="readbar" id="readbar"></div>
  <main class="page wrap">
    <article class="sheet" aria-labelledby="h1">
      <a class="back-link" href="#cap-${c.id}">${ic("back")}<span>Capitolul ${esc(c.t)}</span></a>
      <h1 id="h1" class="rv">${esc(m.t)}</h1>
      <div class="facts-line rv" style="--i:1"><span>Lecția ${pos + 1} din ${c.mods.length} în capitolul ${esc(c.t)}</span><span>~15 min</span><span class="pill" id="lpct">${pct(i)}%</span></div>
      <div class="lesson-body" id="lbody"></div>
    </article>
    <form class="stub" id="quiz" aria-labelledby="h-quiz">
      <h2 id="h-quiz">Verifică ce ai învățat</h2>
      <p>${m.q.length} întrebări. Ai nevoie de cel puțin ${PASS} răspunsuri corecte.</p>
      ${m.q.map((q, k) => `<fieldset class="q" id="q${k}"><legend>${esc(q[0])}</legend>
        ${shuffle(q[1].map((o, j) => j)).map(j => `<label><input type="radio" name="q${k}" id="q${k}o${j}" value="${j}" required> <span>${esc(q[1][j])}</span></label>`).join("")}
        <p class="why" hidden></p></fieldset>`).join("")}
      <div class="result" id="res" aria-live="polite"><button class="btn dark" type="submit">Verifică răspunsurile</button></div>
    </form>
    <nav class="next" aria-label="Lecții">
      ${i > 0 ? `<a class="btn quiet" href="${lessonHref(i - 1)}">${ic("back")}<span>${esc(M[i - 1].t)}</span></a>` : "<span></span>"}
      ${i + 1 < M.length ? `<a class="btn quiet" href="${lessonHref(i + 1)}"><span>${esc(M[i + 1].t)}</span>${ic("arrow")}</a>` : `<button class="btn quiet" type="button" data-menu>${ic("book")}<span>Toate lecțiile</span></button>`}
    </nav>
  </main>`;
  // split the lesson into parts at each heading, so reading can be measured part by part
  const body = document.getElementById("lbody"), tmp = document.createElement("div");
  tmp.innerHTML = window.cleanHTML(m.html);
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
    if (f > (state.read[id] || 0)) { state.read[id] = f; save(); syncSoon(); document.getElementById("lpct").textContent = pct(i) + "%"; if (f === 1) logActivity(m, "read", null, null, null); }
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
      why.innerHTML = (ok ? "<b>Corect.</b> " : `<b>Răspunsul corect:</b> ${esc(q[1][q[2]])}. `) + esc(q[3]);
    });
    const res = document.getElementById("res");
    logActivity(m, "test", score, m.q.length, score >= PASS);
    if (score >= PASS) {
      state.done[id] = Math.max(score, state.done[id] || 0); state.read[id] = 1; save(); sync();
      document.getElementById("lpct").textContent = "100%";
      const nx = nextModule();
      res.innerHTML = `<p>${score} din ${m.q.length}. Ai trecut lecția.</p>${nx === null ? `<a class="btn dark" href="#certificat">Vezi certificatul</a>` : `<a class="btn dark" href="${lessonHref(nx)}"><span>Următoarea: ${esc(M[nx].t)}</span>${ic("arrow")}</a>`}`;
    } else {
      res.innerHTML = `<p>${score} din ${m.q.length}. Mai ai nevoie de ${PASS - score}.</p><span class="small" style="color:var(--paper-muted)">Citește explicațiile de mai sus și încearcă din nou.</span><button class="btn dark" type="button" id="again">Încearcă din nou</button>`;
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
  const rp = (sc, rd) => Math.round(M.reduce((s, m) => s + (sc[m.id] ? 100 : 70 * Math.min(1, rd[m.id] || 0)), 0) / M.length);
  document.getElementById("tbody").innerHTML = error ? `<p style="margin-top:20px">Nu am putut încărca rezultatele: ${esc(error.message)}</p>` : `
    <p style="margin-top:20px">${rows.length} voluntari au început cursul. Coloanele arată scorul cel mai bun la fiecare test, din 5.</p>
    <p style="margin-top:12px"><button class="btn dark" type="button" id="refresh">Reîncarcă</button></p>
    ${rows.length ? `<div class="tablewrap"><table><thead><tr><th>Voluntar</th><th>Curs</th><th>Teste</th>${M.map((m, i) => `<th title="${esc(m.t)}">L${i + 1}</th>`).join("")}<th>Activ</th></tr></thead><tbody>
    ${rows.map(r => { const sc = fixKeys(r.scores), rd = fixKeys((r.scores || {}).read), n = M.filter(m => sc[m.id]).length; return `<tr>
      <td>${esc(r.name || r.email || "Voluntar fără nume")}</td><td>${rp(sc, rd)}%</td><td>${n}/${M.length}</td>
      ${M.map(m => `<td>${sc[m.id] ? sc[m.id] : "–"}</td>`).join("")}
      <td>${new Date(r.updated).toLocaleDateString("ro-RO")}</td></tr>`; }).join("")}
    </tbody></table></div>` : `<p style="margin-top:20px">Încă nu a trimis nimeni rezultate. Când un voluntar conectat trece primul test, apare aici.</p>`}`;
  const rf = document.getElementById("refresh");
  if (rf) rf.onclick = teamView;
}

// ─── CERTIFICATUL ───
function cert(){
  view = "cert";
  const all = M.length > 0 && passed() === M.length;
  const date = new Date().toLocaleDateString("ro-RO", {day: "numeric", month: "long", year: "numeric"});
  app.innerHTML = barHTML() + `<main class="page wrap"><article class="sheet" aria-labelledby="h1">
    <a class="back-link" href="#">${ic("back")}<span>Înapoi la curs</span></a>
    <h1 id="h1">${all ? "Felicitări!" : "Certificatul tău"}</h1>
    ${all ? `
    <div class="field" style="margin-top:24px"><label for="name">Numele de pe certificat</label><input id="name" style="background:var(--paper-2);color:var(--paper-ink)" value="${esc(state.name)}"></div>
    <div class="cert">
      <span>Certificat de absolvire</span>
      <div class="who" id="who"></div>
      <p>a absolvit cursul <b>${esc(SITE.name)}</b>, cu toate cele ${M.length} lecții trecute.</p>
      <p class="small" style="color:var(--paper-muted)">${date} · Coordonator echipă: ${esc(SITE.coordinator) || "______________"}</p>
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
  const lm = /^lectia-(.+)$/.exec(h);
  // #lectia-m3, or an old link #lectia-3 (old links counted lessons in modules.js order, which the m-ids keep)
  const lid = lm && (/^\d+$/.test(lm[1]) ? "m" + lm[1] : lm[1]), li = lm ? M.findIndex(m => m.id === lid) : -1;
  if (li >= 0) { scrollFns = []; lesson(li); scrollTo(0, 0); }
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

// newer content saved from the admin panel replaces the bundled copy; a lesson in progress is left alone
if (sb) sb.from("site_content").select("data,updated_at").eq("id", "main").maybeSingle().then(({data}) => {
  if (!data || !data.data || (cached && cached.updated_at === data.updated_at)) return;
  try { localStorage.setItem(CKEY, JSON.stringify(data)); } catch(e){}
  cached = data; applyContent(data.data);
  if (view !== "lesson") { lastView = ""; route(); }
}).catch(() => {});
