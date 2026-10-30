// One definition for the calculation and its displayed factors.
export const vzorce = {
  photosynthesisEfficiency: {
    vstupy: ['light', 'hydration', 'co2Response', 'photosynthesisTemperatureFactor'],
    rozsah: [0, 1],
  },
  activity: {
    vstupy: ['light', 'hydration', 'activeLeafArea', 'co2Response', 'photosynthesisTemperatureFactor'],
    normalizace: { activeLeafArea: 'leafArea' },
    rozsah: [0, 1],
  },
  glucoseGramsPerMinute: {
    vstupy: ['activeLeafArea', 'photosynthesisEfficiency', 'glucoseConversion'],
  },
};

// 8 µmol CO₂/m²/s, six CO₂ per glucose, molar mass, seconds per minute.
export const konstanty = { glucoseConversion: 8e-6 / 6 * 180.156 * 60 };

const ohlaseneChyby = new Set();
function neplatnyVypocet(nazev, duvod) {
  const zprava = `Výpočet „${nazev}“: ${duvod}`;
  if (!ohlaseneChyby.has(zprava)) {
    ohlaseneChyby.add(zprava);
    console.error(zprava);
  }
  return NaN;
}

export function vypocitatVzorec(nazev, model) {
  const vzorec = Object.hasOwn(vzorce, nazev) ? vzorce[nazev] : null;
  if (!Array.isArray(vzorec?.vstupy) || !vzorec.vstupy.length) {
    return neplatnyVypocet(nazev, 'chybí platné vstupy vzorce.');
  }
  const soucin = vzorec.vstupy.reduce((value, key) => {
    let faktor = Object.hasOwn(konstanty, key) ? konstanty[key] : model[key];
    if (!Number.isFinite(faktor)) return neplatnyVypocet(nazev, `vstup „${key}“ není konečné číslo.`);
    const zaklad = vzorec.normalizace?.[key];
    if (zaklad) {
      const delitel = Object.hasOwn(konstanty, zaklad) ? konstanty[zaklad] : model[zaklad];
      if (!Number.isFinite(delitel) || delitel < 0 || (delitel === 0 && faktor !== 0)) {
        return neplatnyVypocet(nazev, `normalizace „${zaklad}“ má neplatný dělitel.`);
      }
      faktor = delitel > 0 ? faktor / delitel : 0;
    }
    return value * faktor;
  }, 1);
  if (!Number.isFinite(soucin)) return neplatnyVypocet(nazev, 'výsledek není konečné číslo.');
  return vzorec.rozsah
    ? Math.max(vzorec.rozsah[0], Math.min(vzorec.rozsah[1], soucin))
    : soucin;
}
