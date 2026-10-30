import { vzorce } from '../ekologie/tree_ecology_vzorce.js?v=3';

// Převod výpočetních názvů na text, barvu, jednotku a formát pro okna.
export const veliciny = {
  light: { nazev: 'Světlo', tema: 'light' },
  hydration: { nazev: 'voda', tema: 'water' },
  activeLeafArea: { nazev: 'listy', tema: 'leaves' },
  co2Response: { nazev: 'CO₂', tema: 'co2' },
  photosynthesisTemperatureFactor: { nazev: 'teplota', tema: 'temperature' },
  photosynthesisEfficiency: { nazev: 'účinnost', tema: 'light' },
  glucoseConversion: { nazev: 'přepočet', tema: 'sugar', veVzorci: false },
  activity: {
    nazev: 'aktivita', tema: 'light',
    jednotka: '%', nasobek: 100, desetinnaMista: 0,
    vystupId: 'ecoActivity', popisHodnoty: 'aktivita', druh: 'activity',
  },
  glucoseGramsPerMinute: {
    nazev: 'Tvorba cukrů', tema: 'sugar',
    jednotka: 'g/min', nasobek: 1, desetinnaMista: 1,
    vystupId: 'ecoGlucose', druh: 'glucose',
  },
};

export function vstupyVzorce(nazev, cesta = []) {
  if (cesta.includes(nazev)) {
    throw new Error(`Kruhový odkaz ve vzorcích: ${[...cesta, nazev].join(' → ')}`);
  }
  const vzorec = Object.hasOwn(vzorce, nazev) ? vzorce[nazev] : null;
  if (!Array.isArray(vzorec?.vstupy) || !vzorec.vstupy.length) {
    throw new Error(`Vzorec „${nazev}“ nemá platné vstupy.`);
  }
  // Expand intermediate calculations to their actual inputs for the visual tags.
  return vzorec.vstupy.flatMap(key => {
    if (veliciny[key]?.veVzorci === false) return [];
    if (Object.hasOwn(vzorce, key)) return vstupyVzorce(key, [...cesta, nazev]);
    if (!Object.hasOwn(veliciny, key)) throw new Error(`Vzorec „${nazev}“: chybí popisek veličiny „${key}“.`);
    return [key];
  });
}

const ohlaseneChyby = new Set();
export function ohlasitChybuOken(zprava) {
  if (ohlaseneChyby.has(zprava)) return;
  ohlaseneChyby.add(zprava);
  console.error(`[Okna u stromu] ${zprava}`);
}

export function zobrazitHodnotu(nazev, model) {
  const pravidlo = Object.hasOwn(veliciny, nazev) ? veliciny[nazev] : null;
  const nasobek = pravidlo?.nasobek ?? 1;
  const mista = pravidlo?.desetinnaMista ?? 1;
  const hodnota = model?.[nazev];
  if (!pravidlo || !Number.isFinite(hodnota) || !Number.isFinite(nasobek)
      || !Number.isInteger(mista) || mista < 0 || mista > 20
      || !Number.isFinite(hodnota * nasobek)) {
    ohlasitChybuOken(`Veličina „${nazev}“ má neplatnou hodnotu nebo formát; zobrazuje se —.`);
    return '—';
  }
  return (hodnota * nasobek).toLocaleString('cs-CZ', { maximumFractionDigits: mista });
}
