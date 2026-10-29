/**
 * ═══ ȘCOALA VOLUNTARILOR → GOOGLE SHEETS ═══
 * Copiază din Supabase istoricul fiecărui voluntar (fiecare test și fiecare lecție citită)
 * și un tabel cu rezultatele fiecăruia. Se pune în foaia Google: Extensii → Apps Script.
 *
 * Pași (o singură dată):
 *  1. Lipește tot acest fișier în Apps Script și apasă Salvează.
 *  2. Reîncarcă foaia. Apare meniul „Școala Voluntarilor”.
 *  3. Școala Voluntarilor → Configurează: Project URL și cheia „service_role” din Supabase (Settings → API).
 *     Cheia rămâne în proprietățile acestui script; nu o pune în celule și nu da altora drept de editare la foaie.
 *  4. Școala Voluntarilor → Actualizează acum, apoi → Pornește actualizarea automată (la fiecare oră).
 */
const P = () => PropertiesService.getScriptProperties();

function onOpen() {
  SpreadsheetApp.getUi().createMenu("Școala Voluntarilor")
    .addItem("Configurează", "configure")
    .addItem("Actualizează acum", "sync")
    .addItem("Pornește actualizarea automată (la fiecare oră)", "startAuto")
    .addItem("Oprește actualizarea automată", "stopAuto")
    .addToUi();
}

function configure() {
  const ui = SpreadsheetApp.getUi();
  const u = ui.prompt("Supabase", "Project URL (de exemplu https://abcd.supabase.co):", ui.ButtonSet.OK_CANCEL);
  if (u.getSelectedButton() !== ui.Button.OK) return;
  const k = ui.prompt("Supabase", "Cheia service_role (Settings → API). Rămâne doar în acest script:", ui.ButtonSet.OK_CANCEL);
  if (k.getSelectedButton() !== ui.Button.OK) return;
  P().setProperties({SUPABASE_URL: u.getResponseText().trim().replace(/\/+$/, "").replace(/\/rest\/v1$/, ""), SUPABASE_KEY: k.getResponseText().trim()});
  ui.alert("Gata. Acum apasă Școala Voluntarilor → Actualizează acum.");
}

function api_(path) {
  const url = P().getProperty("SUPABASE_URL"), key = P().getProperty("SUPABASE_KEY");
  if (!url || !key) throw new Error("Rulează întâi Școala Voluntarilor → Configurează.");
  const r = UrlFetchApp.fetch(url + "/rest/v1/" + path, {headers: {apikey: key, Authorization: "Bearer " + key}, muteHttpExceptions: true});
  if (r.getResponseCode() >= 300) throw new Error("Supabase a răspuns " + r.getResponseCode() + ": " + r.getContentText().slice(0, 300));
  return JSON.parse(r.getContentText());
}

function sheet_(name, header) {
  const ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sh.getLastRow() === 0 && header) { sh.appendRow(header); sh.setFrozenRows(1); sh.getRange(1, 1, 1, header.length).setFontWeight("bold"); }
  return sh;
}

function sync() {
  // 1. Istoric: only new rows are appended, so nothing already copied is ever overwritten
  const log = sheet_("Istoric", ["ID", "Data", "Email", "Nume", "Lecția", "Ce a făcut", "Scor", "Din", "Trecut"]);
  let last = log.getLastRow() <= 1 ? 0 : +(P().getProperty("LAST_ID") || 0), added = 0;
  for (;;) {
    const rows = api_("activity?select=*&id=gt." + last + "&order=id.asc&limit=1000");
    if (!rows.length) break;
    log.getRange(log.getLastRow() + 1, 1, rows.length, 9).setValues(rows.map(r => [r.id, new Date(r.at), r.email || "", r.name || "", r.lesson_title || "",
      r.kind === "test" ? "Test" : "Lecție citită", r.score == null ? "" : r.score, r.total == null ? "" : r.total, r.passed == null ? "" : r.passed ? "da" : "nu"]));
    last = rows[rows.length - 1].id; added += rows.length; P().setProperty("LAST_ID", String(last));
    if (rows.length < 1000) break;
  }

  // 2. Rezultate: rewritten every time from the current state
  const content = api_("site_content?id=eq.main&select=data");
  const lessons = content.length ? [].concat(...(content[0].data.chapters || []).map(c => c.lessons || [])) : [];
  // older saves keyed progress by lesson position (0..13); those are lessons m1..m14
  const fix = o => { const r = {}; for (const k in o || {}) r[/^\d+$/.test(k) ? "m" + (+k + 1) : k] = o[k]; return r; };
  const res = api_("results?select=*&order=name.asc");
  const header = ["Nume", "Email", "Curs %", "Teste trecute", "Ultima activitate"].concat(lessons.map(l => l.t));
  const rows = res.map(r => {
    const sc = fix(r.scores), rd = fix((r.scores || {}).read);
    const p = lessons.length ? Math.round(lessons.reduce((s, l) => s + (sc[l.id] ? 100 : 70 * Math.min(1, rd[l.id] || 0)), 0) / lessons.length) : "";
    return [r.name || "", r.email || "", p, lessons.filter(l => sc[l.id]).length + "/" + lessons.length, new Date(r.updated)].concat(lessons.map(l => sc[l.id] || ""));
  });
  const sum = sheet_("Rezultate");
  sum.clearContents();
  sum.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight("bold");
  if (rows.length) sum.getRange(2, 1, rows.length, header.length).setValues(rows);
  sum.setFrozenRows(1);

  const info = sheet_("Info");
  info.getRange("A1:B3").setValues([["Ultima actualizare", new Date()], ["Rânduri noi în Istoric", added], ["Voluntari în Rezultate", rows.length]]);
}

function startAuto() {
  stopAuto();
  ScriptApp.newTrigger("sync").timeBased().everyHours(1).create();
  SpreadsheetApp.getUi().alert("Foaia se actualizează singură la fiecare oră.");
}

function stopAuto() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === "sync").forEach(t => ScriptApp.deleteTrigger(t));
}
