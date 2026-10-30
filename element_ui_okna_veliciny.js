import { vzorce } from './tree_ecology_vzorce.js?v=1';

// Převod výpočetních názvů na text, barvu, jednotku a formát pro okna.
export const veliciny = {
  light: { nazev: 'Světlo', tema: 'light' },
  hydration: { nazev: 'voda', tema: 'water' },
  producingFoliage: { nazev: 'listy', tema: 'leaves' },
  co2Response: { nazev: 'Vliv CO₂', tema: 'co2' },
  photosynthesisTemperatureFactor: { nazev: 'teplota', tema: 'temperature' },
  leafArea: { nazev: 'Plocha listů', tema: 'leaves' },
  glucoseConversion: { nazev: 'Přepočet na g/min', tema: 'sugar' },
  activity: {
    nazev: 'Aktivita fotosyntézy', tema: 'light',
    jednotka: '%', nasobek: 100, desetinnaMista: 0,
    vystupId: 'ecoActivity', popisHodnoty: 'aktivita', druh: 'activity',
  },
  glucoseGramsPerMinute: {
    nazev: 'Tvorba cukrů', tema: 'sugar',
    jednotka: 'g/min', nasobek: 1, desetinnaMista: 1,
    vystupId: 'ecoGlucose', druh: 'glucose',
  },
};

export function vstupyVzorce(nazev) {
  return vzorce[nazev]?.vstupy || [];
}

export function zobrazitHodnotu(nazev, model) {
  const pravidlo = veliciny[nazev];
  return (model[nazev] * (pravidlo.nasobek ?? 1)).toLocaleString('cs-CZ', {
    maximumFractionDigits: pravidlo.desetinnaMista ?? 1,
  });
}

