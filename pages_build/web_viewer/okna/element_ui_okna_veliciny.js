import { vzorce } from '../ekologie/tree_ecology_vzorce.js?v=5';

// Převod výpočetních názvů na text, barvu, jednotku a formát pro okna.
export const veliciny = {
  transpiration: { nazev: 'Odpařená voda', tema: 'water', jednotka: 'l/h', nasobek: 60, desetinnaMista: 1, vystupId: 'ecoTranspiration', popisHodnoty: 'odpar' },
  inflow: { nazev: 'Příjem vody', tema: 'water', jednotka: 'l/h', nasobek: 60, desetinnaMista: 1, vystupId: 'ecoTranspirationInflow', popisHodnoty: 'příjem' },
  coolingKW: { nazev: 'Chladicí výkon', tema: 'temperature', jednotka: 'kW', desetinnaMista: 2, vystupId: 'ecoCooling', popisHodnoty: 'výkon ≈' },
  temperatureNearCanopy: { nazev: 'U koruny', tema: 'temperature', jednotka: '°C', desetinnaMista: 1, popisHodnoty: 'u koruny' },
  ambientTemperature: { nazev: 'Mimo strom', tema: 'temperature', jednotka: '°C', desetinnaMista: 1 },
  waterConsumption: { nazev: 'voda', tema: 'water' },
  light: { nazev: 'Světlo', tema: 'light' },
  lightResponse: { nazev: 'Světlo', tema: 'light' },
  hydration: { nazev: 'voda', tema: 'water' },
  activeLeafArea: { nazev: 'listy', tema: 'leaves' },
  leafGrowth: { nazev: 'rašení', tema: 'leaves', veVzorci: false },
  co2Response: { nazev: 'CO₂', tema: 'co2' },
  co2Conversion: { nazev: 'CO₂/přepočet', tema: 'co2', veVzorci: false },
  oxygenPerGlucose: { nazev: 'O₂/glukóza', tema: 'oxygen', veVzorci: false },
  photosynthesisTemperatureFactor: { nazev: 'teplota', tema: 'temperature' },
  photosynthesisEfficiency: { nazev: 'účinnost', tema: 'light' },
  glucoseConversion: { nazev: 'přepočet', tema: 'sugar', veVzorci: false },
  photosyntheticLightShare: { nazev: 'podíl', tema: 'light', veVzorci: false },
  activity: {
    nazev: 'aktivita', tema: 'light',
    jednotka: '%', nasobek: 100, desetinnaMista: 0,
    vystupId: 'ecoActivity', popisHodnoty: 'aktivita', druh: 'activity',
  },
  lightConsumption: {
    nazev: 'Spotřeba světla', tema: 'light',
    jednotka: '%', nasobek: 100, desetinnaMista: 1,
    vystupId: 'ecoLightConsumption', popisHodnoty: 'spotřeba',
  },
  glucoseGramsPerMinute: {
    nazev: 'Tvorba cukrů', tema: 'sugar',
    jednotka: 'g/min', nasobek: 1, desetinnaMista: 1,
    vystupId: 'ecoGlucose', popisHodnoty: 'produkce', druh: 'glucose',
  },
  waterConsumptionLitresPerHour: {
    nazev: 'Spotřeba vody', tema: 'water',
    jednotka: 'l/h', nasobek: 60, desetinnaMista: 1,
    vystupId: 'ecoWaterConsumption', popisHodnoty: 'spotřeba', druh: 'water',
  },
  co2GramsPerMinute: {
    nazev: 'Spotřeba CO₂', tema: 'co2',
    jednotka: 'g/min', nasobek: 1, desetinnaMista: 1,
    vystupId: 'ecoCo2Consumption', popisHodnoty: 'spotřeba', druh: 'co2',
  },
  oxygenGramsPerMinute: {
    nazev: 'Tvorba O₂', tema: 'oxygen',
    jednotka: 'g/min', nasobek: 1, desetinnaMista: 1,
    vystupId: 'ecoOxygen', popisHodnoty: 'produkce', druh: 'oxygen',
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
  return (hodnota * nasobek).toLocaleString('cs-CZ', {
    minimumFractionDigits: mista,
    maximumFractionDigits: mista,
  });
}

/** Low-pass filter for displayed telemetry values so rapid frame jitter does not flicker. */
export function vyhladitHodnotu(stav, klic, hodnota, dtSekund = 0.05, tau = 0.35) {
  if (!Number.isFinite(hodnota)) {
    stav.delete(klic);
    return hodnota;
  }
  const predchozi = stav.get(klic);
  if (!Number.isFinite(predchozi) || !Number.isFinite(dtSekund) || dtSekund <= 0) {
    stav.set(klic, hodnota);
    return hodnota;
  }
  const alpha = 1 - Math.exp(-Math.min(dtSekund, 0.5) / tau);
  const dalsi = predchozi + alpha * (hodnota - predchozi);
  stav.set(klic, dalsi);
  return dalsi;
}
