// ─── STARE ───
const M = window.MODULES, C = window.CONFIG || {}, PASS = 4, KEY = "scoala-voluntarilor-v1";
let state = {done:{}, name:""};
try { state = Object.assign(state, JSON.parse(localStorage.getItem(KEY)) || {}); } catch(e){}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){} };
const app = document.getElementById("app");
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const here = () => location.origin + location.pathname;

// ─── SUPABASE (login + rezultate) ───
const sb = C.SUPABASE_URL && C.SUPABASE_ANON_KEY && window.supabase ? window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY) : null;
let session = null, leader = false, team = [], view = "home", queue = Promise.resolve(), loginMsg = "";
const sync = () => {
  if (!sb || !session) return;
  queue = queue.then(() => sb.from("results").upsert({user_id: session.user.id, name: state.name, email: session.user.email, scores: state.done, updated: new Date().toISOString()}))
    .then(r => r && r.error && console.warn("sync", r.error.message)).catch(e => console.warn("sync", e));
};

async function onSession(s){
  session = s; leader = false;
  if (session) {
    if (!state.name) state.name = session.user.user_metadata?.full_name || "";
    const {data} = await sb.from("results").select("name,scores").eq("user_id", session.user.id).maybeSingle();
    if (data) { // îmbină rezultatele de pe alt dispozitiv
      for (const k in data.scores || {}) state.done[k] = Math.max(data.scores[k], state.done[k] || 0);
      if (!state.name && data.name) state.name = data.name;
    }
    save(); sync(); // trimite și progresul făcut înainte de conectare
    const r = await sb.rpc("is_leader"); leader = r.data === true;
  }
  if (view === "home") home();
}
// supabase-js recomandă să nu aștepți alte apeluri direct în acest callback
if (sb) sb.auth.onAuthStateChange((ev, s) => { if (["INITIAL_SESSION","SIGNED_IN","SIGNED_OUT"].includes(ev)) setTimeout(() => onSession(s)); });

function loginBox(){
  if (!sb) return `<p class="small">Rezultatele se salvează doar pe acest dispozitiv.</p>`;
  if (session) return `<p class="small">Conectat ca <b>${esc(session.user.email)}</b>. Rezultatele tale ajung la coordonator. <button class="linkbtn" id="logout">Deconectare</button></p>`;
  return `<div class="login">
    <p><b>Conectează-te</b> ca rezultatele tale să ajungă la coordonator și să le ai pe orice telefon.</p>
    <div class="row" style="margin-top:0"><button class="btn google" id="google">Continuă cu Google</button></div>
    <form class="field" id="otp" style="margin-top:0"><input id="email" type="email" required placeholder="sau emailul tău" aria-label="Email"><button class="btn ghost" type="submit">Trimite link pe email</button></form>
    <div class="msg" id="lmsg" aria-live="polite">${loginMsg}</div>
  </div>`;
}
function wireLogin(){
  if (!sb) return;
  const out = document.getElementById("logout");
  if (out) out.onclick = () => sb.auth.signOut();
  const g = document.getElementById("google");
  if (g) g.onclick = () => sb.auth.signInWithOAuth({provider: "google", options: {redirectTo: here()}});
  const f = document.getElementById("otp");
  if (f) f.onsubmit = async e => {
    e.preventDefault();
    const msg = document.getElementById("lmsg");
    msg.className = "msg"; msg.textContent = "Se trimite…";
    const {error} = await sb.auth.signInWithOtp({email: document.getElementById("email").value.trim(), options: {emailRedirectTo: here()}});
    msg.className = error ? "msg err" : "msg";
    msg.textContent = loginMsg = error ? "Nu am putut trimite emailul: " + error.message + ". Încearcă din nou peste un minut." : "Ți-am trimis un link. Deschide emailul (verifică și Spam) și apasă pe link.";
  };
}

// ─── ECRANE ───
async function teamView(){
  view = "team";
  app.innerHTML = `<button class="btn ghost" id="back">← Toate modulele</button><p class="small" style="margin-top:22px">Se încarcă…</p>`;
  document.getElementById("back").onclick = home;
  const {data, error} = await sb.from("results").select("*").order("updated", {ascending: false});
  if (view !== "team") return;
  team = data || [];
  app.innerHTML = `
  <button class="btn ghost" id="back">← Toate modulele</button>
  <div class="eyebrow" style="margin-top:22px">Doar pentru coordonator</div>
  <h2>Rezultatele echipei</h2>
  <p class="lead">${team.length} voluntari au început cursul. Scorul e cel mai bun rezultat la fiecare test (din 5).</p>
  <div class="row"><button class="btn ghost" id="refresh">Reîncarcă</button></div>
  ${error ? `<div class="tip">Nu am putut încărca rezultatele: ${esc(error.message)}</div>` : team.length ? `<div class="tablewrap"><table><thead><tr><th>Voluntar</th><th>Module</th>${M.map((m,i)=>`<th title="${esc(m.t)}">M${i+1}</th>`).join("")}<th>Ultima activitate</th></tr></thead><tbody>
  ${team.map(r => { const sc = r.scores || {}, n = Object.keys(sc).length; return `<tr>
    <td>${esc(r.name || r.email || "Voluntar fără nume")}</td><td><span class="pill ${n>=M.length?"done":""}">${n}/${M.length}</span></td>
    ${M.map((m,i)=>`<td>${sc[i] ? sc[i] : "–"}</td>`).join("")}
    <td>${new Date(r.updated).toLocaleDateString("ro-RO")}</td></tr>`; }).join("")}
  </tbody></table></div>` : `<div class="tip">Încă nu a trimis nimeni rezultate. Când un voluntar conectat trece primul test, apare aici.</div>`}`;
  document.getElementById("back").onclick = home;
  document.getElementById("refresh").onclick = teamView;
}

function home(){
  view = "home";
  const n = Object.keys(state.done).filter(k => k < M.length).length, all = n === M.length;
  app.innerHTML = `
  <div class="eyebrow">Curs pentru voluntari · cor și tineret</div>
  <h1>Școala Voluntarilor</h1>
  <p class="lead">${M.length} module scurte, fiecare cu un test de 5 întrebări. Treci testul cu cel puțin ${PASS} răspunsuri corecte. La final primești certificatul.</p>
  ${loginBox()}
  ${leader ? `<div class="row"><button class="btn" id="team">Rezultatele echipei</button></div>` : ""}
  <div class="field"><input id="hname" placeholder="Numele tău complet" value="${esc(state.name)}" aria-label="Numele tău complet"></div>
  <div class="progress"><div class="bar"><i style="width:${n/M.length*100}%"></i></div>
  <div class="small">${n} din ${M.length} module terminate</div></div>
  <ol class="list">${M.map((m,i)=>`<li><button class="mod" data-i="${i}">
    <div class="num">${i+1}</div><div><strong>${m.t}</strong><span>${m.d}</span></div>
    <div class="pill ${state.done[i]?"done":""}">${state.done[i]?"Trecut "+state.done[i]+"/5":"~15 min"}</div></button></li>`).join("")}</ol>
  ${all ? `<div class="row"><button class="btn" id="cert">Vezi certificatul</button></div>` : ""}`;
  app.querySelectorAll(".mod").forEach(b => b.onclick = () => lesson(+b.dataset.i));
  if (all) document.getElementById("cert").onclick = cert;
  if (leader) document.getElementById("team").onclick = teamView;
  const hn = document.getElementById("hname");
  hn.oninput = () => { state.name = hn.value; save(); };
  hn.onchange = sync;
  wireLogin();
  scrollTo(0,0);
}

function lesson(i){
  view = "lesson";
  const m = M[i];
  app.innerHTML = `
  <button class="btn ghost" id="back">← Toate modulele</button>
  <div class="lesson" style="margin-top:22px">
    <div class="eyebrow">Modulul ${i+1} din ${M.length}</div>
    <h2>${m.t}</h2>${m.html}
  </div>
  <form class="quiz" id="quiz">
    <div class="eyebrow">Test</div><h2>Verifică ce ai învățat</h2>
    ${m.q.map((q,k)=>`<div class="q" id="q${k}"><p>${k+1}. ${q[0]}</p>
      ${q[1].map((o,j)=>`<label><input type="radio" name="m${i}q${k}" id="m${i}q${k}o${j}" value="${j}" required> <span>${o}</span></label>`).join("")}
      <div class="why" hidden></div></div>`).join("")}
    <div class="row"><button class="btn" type="submit">Verifică răspunsurile</button></div>
    <div class="result" id="res" aria-live="polite"></div>
  </form>`;
  document.getElementById("back").onclick = home;
  document.getElementById("quiz").onsubmit = e => {
    e.preventDefault();
    let score = 0;
    m.q.forEach((q,k) => {
      const pick = +new FormData(e.target).get(`m${i}q${k}`), ok = pick === q[2], box = document.getElementById("q"+k), why = box.querySelector(".why");
      score += ok;
      box.className = "q " + (ok ? "right" : "wrong");
      why.hidden = false;
      why.innerHTML = (ok ? "<b>Corect.</b> " : `<b>Răspunsul corect:</b> ${q[1][q[2]]}. `) + q[3];
    });
    const res = document.getElementById("res");
    if (score >= PASS) {
      state.done[i] = Math.max(score, state.done[i] || 0); save(); sync();
      res.innerHTML = `${score}/5 – ai trecut modulul! <div class="row"><button class="btn" type="button" id="next">${i+1 < M.length ? "Modulul următor →" : "Înapoi la module"}</button></div>`;
      document.getElementById("next").onclick = () => i+1 < M.length ? lesson(i+1) : home();
    } else {
      res.innerHTML = `${score}/5 – ai nevoie de cel puțin ${PASS}. Citește explicațiile și încearcă din nou. <div class="row"><button class="btn ghost" type="button" id="again">Încearcă din nou</button></div>`;
      document.getElementById("again").onclick = () => lesson(i);
    }
  };
  scrollTo(0,0);
}

function cert(){
  view = "cert";
  const date = new Date().toLocaleDateString("ro-RO", {day:"numeric", month:"long", year:"numeric"});
  app.innerHTML = `
  <button class="btn ghost" id="back">← Toate modulele</button>
  <h2 style="margin-top:22px">Felicitări! Ai terminat cursul.</h2>
  <div class="field"><input id="name" placeholder="Numele tău complet" value="${esc(state.name)}" aria-label="Numele tău complet"></div>
  <div class="cert">
    <div class="eyebrow">Certificat de absolvire</div>
    <div class="who" id="who"></div>
    <p>a absolvit cursul <b>Școala Voluntarilor</b>, cu toate cele ${M.length} module trecute.</p>
    <p class="small">${date} · Coordonator echipă: ______________</p>
  </div>
  <p class="small">Fă o captură de ecran și trimite-o coordonatorului.</p>`;
  const who = document.getElementById("who"), inp = document.getElementById("name");
  who.textContent = state.name || "Numele tău";
  document.getElementById("back").onclick = home;
  inp.oninput = () => { state.name = inp.value; save(); who.textContent = state.name || "Numele tău"; };
  inp.onchange = sync;
}

home();
