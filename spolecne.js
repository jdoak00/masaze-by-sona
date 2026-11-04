// Masáže by Soňa – společné funkce rezervace a administrace

// adresa webové aplikace v Google Apps Scriptu (Implementovat → Spravovat implementace)
var API = "https://script.google.com/macros/s/AKfycbzUAzfG9-2Wi-Ny0qwaw0IlCXyDLFStTzfyTbXmdkR2BjMopYzNTgWnH0GVHf3cmus/exec";
var TELEFON = "604 411 129";

/** Zavolá skript. Text/plain tělo = jednoduchý požadavek bez CORS předletu. */
function api(akce, data) {
  var telo = Object.assign({ akce: akce }, data || {});
  return fetch(API, { method: "POST", body: JSON.stringify(telo) })
    .catch(function () { throw new Error("Nepodařilo se spojit se serverem. Zkontrolujte připojení a zkuste to znovu."); })
    .then(function (odp) { return odp.json(); })
    .then(function (j) {
      if (!j.ok) throw new Error(j.chyba || "Něco se nepovedlo. Zkuste to prosím znovu.");
      return j;
    });
}

var DW = ["ne", "po", "út", "st", "čt", "pá", "so"];
var DWL = ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota"];
var MON = ["ledna", "února", "března", "dubna", "května", "června", "července", "srpna", "září", "října", "listopadu", "prosince"];
var MESICE = ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"];

function key(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function fromKey(k) { var p = k.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
function longDate(k) { var x = fromKey(k); return DWL[x.getDay()] + " " + x.getDate() + ". " + MON[x.getMonth()]; }
function shortDate(k) { var x = fromKey(k); return DW[x.getDay()] + " " + x.getDate() + ". " + (x.getMonth() + 1) + "."; }
function czk(v) { return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " Kč"; }
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function addMin(t, m) { var p = t.split(":"); var x = +p[0] * 60 + +p[1] + m; return Math.floor(x / 60) + ":" + String(x % 60).padStart(2, "0"); }
function hezkyCas(t) { return t.replace(/^0/, ""); }

// pamatování v prohlížeči (může být zakázané – pak se nic neděje)
function ulozit(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function nacist(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }

function scrollTop() { try { window.scrollTo({ top: 0 }); } catch (e) {} }
