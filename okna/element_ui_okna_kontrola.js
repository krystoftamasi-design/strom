import { vzorce, konstanty } from '../ekologie/tree_ecology_vzorce.js?v=3';
import { veliciny, vstupyVzorce } from './element_ui_okna_veliciny.js?v=4';

const temata = new Set(['neutral', 'light', 'water', 'leaves', 'co2', 'temperature', 'sugar', 'oxygen', 'roots']);
const ma = (objekt, klic) => objekt != null && Object.hasOwn(objekt, klic);
const text = hodnota => typeof hodnota === 'string' && hodnota.trim().length > 0;

// Read-only startup check; invalid records are returned to the renderer to skip.
export function zkontrolovatOkna({ okna, model, body, najitOvladani }) {
  const chyby = new Set();
  const neplatnaOkna = new Set();
  const neplatneVzorce = new Set();
  const neplatneVeliciny = new Set();
  const zdroj = klic => text(klic) && (ma(konstanty, klic)
    ? Number.isFinite(konstanty[klic]) : ma(model, klic) && typeof model[klic] === 'number');

  for (const [klic, pravidlo] of Object.entries(veliciny)) {
    const chyba = zprava => {
      chyby.add(`Veličina „${klic}“: ${zprava}`);
      neplatneVeliciny.add(klic);
    };
    if (!text(pravidlo?.nazev)) chyba('chybí popisek.');
    if (!temata.has(pravidlo?.tema)) chyba(`neplatné barevné téma „${pravidlo?.tema}“.`);
    if (!zdroj(klic)) chyba('chybí číselný zdroj v modelu nebo konstantách.');
    if (pravidlo?.nasobek !== undefined && !Number.isFinite(pravidlo.nasobek)) chyba('neplatný násobek.');
    if (pravidlo?.desetinnaMista !== undefined && (!Number.isInteger(pravidlo.desetinnaMista)
      || pravidlo.desetinnaMista < 0 || pravidlo.desetinnaMista > 20)) chyba('neplatný počet desetinných míst.');
    if (pravidlo?.jednotka !== undefined && typeof pravidlo.jednotka !== 'string') chyba('neplatná jednotka.');
  }

  const hotove = new Set();
  function projitVzorec(klic, cesta = []) {
    if (cesta.includes(klic)) {
      chyby.add(`Kruhový odkaz ve vzorcích: ${[...cesta, klic].join(' → ')}`);
      for (const uzel of cesta.slice(cesta.indexOf(klic))) neplatneVzorce.add(uzel);
      return false;
    }
    if (hotove.has(klic)) return !neplatneVzorce.has(klic);
    const vzorec = vzorce[klic];
    const chyba = zprava => {
      chyby.add(`Vzorec „${klic}“: ${zprava}`);
      neplatneVzorce.add(klic);
    };
    if (!zdroj(klic)) chyba('chybí číselný výstup v modelu.');
    if (!Array.isArray(vzorec?.vstupy) || !vzorec.vstupy.length || !vzorec.vstupy.every(text)) {
      chyba('chybí platný seznam vstupů.');
      hotove.add(klic);
      return false;
    }
    const normalizace = vzorec.normalizace ?? {};
    if (!normalizace || typeof normalizace !== 'object' || Array.isArray(normalizace)) {
      chyba('neplatná normalizace.');
    }
    const delitele = normalizace && typeof normalizace === 'object' && !Array.isArray(normalizace)
      ? Object.entries(normalizace) : [];
    for (const [vstup, delitel] of delitele) {
      if (!vzorec.vstupy.includes(vstup)) chyba(`normalizace odkazuje na neexistující vstup „${vstup}“.`);
      if (!zdroj(delitel)) chyba(`chybí zdroj dělitele „${delitel}“.`);
    }
    for (const vstup of [...vzorec.vstupy, ...delitele.map(([, delitel]) => delitel)]) {
      if (!zdroj(vstup)) chyba(`chybí zdroj vstupu „${vstup}“.`);
      if (neplatneVeliciny.has(vstup)) chyba(`vstup „${vstup}“ má neplatný převodník.`);
      if (ma(vzorce, vstup) && !projitVzorec(vstup, [...cesta, klic])) chyba(`vstup „${vstup}“ má neplatný vzorec.`);
    }
    if (vzorec.rozsah !== undefined && (!Array.isArray(vzorec.rozsah) || vzorec.rozsah.length !== 2
      || !vzorec.rozsah.every(Number.isFinite) || vzorec.rozsah[0] > vzorec.rozsah[1])) chyba('neplatný rozsah výsledku.');
    hotove.add(klic);
    return !neplatneVzorce.has(klic);
  }
  for (const klic of Object.keys(vzorce)) projitVzorec(klic);

  const vystupy = new Set();
  const ovladace = new Set();
  for (const [kapitola, zaznamy] of Object.entries(okna)) {
    if (!Array.isArray(zaznamy)) {
      chyby.add(`Kapitola „${kapitola}“: okna musí být seznam.`);
      continue;
    }
    const ids = new Set();
    for (const okno of zaznamy) {
      const chyba = zprava => {
        chyby.add(`Okno „${kapitola}/${okno?.id || '?'}“: ${zprava}`);
        neplatnaOkna.add(okno);
      };
      if (!okno || typeof okno !== 'object') { chyba('neplatný záznam.'); continue; }
      if (!text(okno.id) || /\s/.test(okno.id) || ids.has(okno.id)) chyba('chybí jedinečné ID bez mezer.');
      if (!text(okno.nadpis)) chyba('chybí nadpis.');
      if (!['left', 'right'].includes(okno.strana)) chyba('strana musí být left nebo right.');
      if (!temata.has(okno.tema ?? 'neutral')) chyba(`neplatné téma „${okno.tema}“.`);
      if (!ma(body, okno.bod)) chyba(`neexistuje bod stromu „${okno.bod}“.`);
      if (okno.text !== undefined && (!Array.isArray(okno.text) || !okno.text.every(v => typeof v === 'string'))) chyba('text musí být seznam odstavců.');
      for (const pole of ['hlavni', 'otevrene', 'zobrazitVzorec', 'zobrazitHodnotu']) {
        if (okno[pole] !== undefined && typeof okno[pole] !== 'boolean') chyba(`pole „${pole}“ musí být true nebo false.`);
      }
      if (okno.vypocet !== undefined || okno.zobrazitVzorec || okno.zobrazitHodnotu) {
        if (!ma(veliciny, okno.vypocet) || neplatneVeliciny.has(okno.vypocet)) chyba(`neplatná veličina „${okno.vypocet}“.`);
        if (neplatneVzorce.has(okno.vypocet)) chyba(`výpočet „${okno.vypocet}“ má neplatné vstupy.`);
        if (okno.zobrazitVzorec) {
          try {
            for (const vstup of vstupyVzorce(okno.vypocet)) {
              if (!zdroj(vstup) || neplatneVeliciny.has(vstup)) chyba(`neplatný vstup „${vstup}“.`);
            }
          } catch (error) { chyba(error.message); }
        }
        if (okno.zobrazitHodnotu) {
          const id = veliciny[okno.vypocet]?.vystupId || `value-${okno.id}`;
          if (vystupy.has(id)) chyba(`opakované ID výstupu „${id}“.`);
        }
      }
      if (okno.ovladani && (!text(okno.ovladani.id) || !najitOvladani(okno.ovladani.id) || ovladace.has(okno.ovladani.id))) {
        chyba(`ovládání „${okno.ovladani.id}“ chybí nebo je použité vícekrát.`);
      }
      if (!neplatnaOkna.has(okno)) {
        ids.add(okno.id);
        if (okno.zobrazitHodnotu) vystupy.add(veliciny[okno.vypocet].vystupId || `value-${okno.id}`);
        if (okno.ovladani) ovladace.add(okno.ovladani.id);
      }
    }
  }
  return { chyby: [...chyby], neplatnaOkna };
}
