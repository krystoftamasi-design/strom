import assert from 'node:assert/strict';
import { TreeEcology } from '../ekologie/tree_ecology.js';
import { vzorce, vypocitatVzorec } from '../ekologie/tree_ecology_vzorce.js?v=5';
import { veliciny, vstupyVzorce, zobrazitHodnotu } from '../okna/element_ui_okna_veliciny.js?v=simple-window-1';
import { zkontrolovatOkna } from '../okna/element_ui_okna_kontrola.js?v=simple-window-1';
import { oknaPodleKapitol } from '../okna/element_ui_okna_obsah.js';

const model = new TreeEcology();
const nastaveni = {
  okna: oknaPodleKapitol,
  model,
  body: Object.fromEntries(oknaPodleKapitol.photosynthesis.map(okno => [okno.bod, [0, 0, 0]])),
  najitOvladani: id => id === 'sliderTreeWater',
};
assert.deepEqual(zkontrolovatOkna(nastaveni).chyby, [], 'Fresh model must be valid before geometry loads');
model.configure({ height: 24, woodVolume: 4, crownArea: 100 });
assert.deepEqual(zkontrolovatOkna(nastaveni).chyby, [], 'Configured model must be valid');
assert.deepEqual(vstupyVzorce('glucoseGramsPerMinute'),
  ['activeLeafArea', 'light', 'hydration', 'co2Response', 'photosynthesisTemperatureFactor']);

const vstupy = vzorce.activity.vstupy;
try {
  vzorce.activity.vstupy = ['glucoseGramsPerMinute'];
  vzorce.photosynthesisEfficiency.vstupy.push('activity');
  const report = zkontrolovatOkna(nastaveni);
  assert(report.chyby.some(chyba => chyba.includes('Kruhový odkaz')));
  assert(report.neplatnaOkna.has(oknaPodleKapitol.photosynthesis[0]));
  assert.throws(() => vstupyVzorce('activity'), /Kruhový odkaz/);
} finally {
  vzorce.activity.vstupy = vstupy;
  vzorce.photosynthesisEfficiency.vstupy.pop();
}

try {
  vzorce.activity.vstupy = [...vstupy, 'missingSource'];
  assert(zkontrolovatOkna(nastaveni).chyby.some(chyba => chyba.includes('missingSource')));
} finally { vzorce.activity.vstupy = vstupy; }

const voda = veliciny.hydration;
try {
  delete veliciny.hydration;
  const report = zkontrolovatOkna(nastaveni);
  assert(report.chyby.some(chyba => chyba.includes('hydration')));
  assert(report.neplatnaOkna.has(oknaPodleKapitol.photosynthesis[0]));
} finally { veliciny.hydration = voda; }
try {
  veliciny.hydration = { ...voda, tema: 'missingColor' };
  assert(zkontrolovatOkna(nastaveni).chyby.some(chyba => chyba.includes('missingColor')));
} finally { veliciny.hydration = voda; }

const extra = { ...oknaPodleKapitol.photosynthesis[0], id: 'dalsi-okno' };
const duplicate = zkontrolovatOkna({ ...nastaveni, okna: {
  photosynthesis: [...oknaPodleKapitol.photosynthesis, extra],
} });
assert(duplicate.neplatnaOkna.has(extra), 'Repeated output ID must be rejected');
assert.deepEqual(zkontrolovatOkna({ ...nastaveni, body: {} }).chyby, [], 'Static windows do not depend on tree anchors');
assert.deepEqual(zkontrolovatOkna({ ...nastaveni, body: undefined }).chyby, [], 'Static windows work before geometry loads');
const legacyWindow = { ...oknaPodleKapitol.photosynthesis[0], bod: 'missingAnchor' };
assert(zkontrolovatOkna({ ...nastaveni, okna: { photosynthesis: [legacyWindow] }, body: {} }).neplatnaOkna.has(legacyWindow),
  'An explicitly configured legacy anchor must still be valid');
assert.deepEqual(zkontrolovatOkna({ ...nastaveni, najitOvladani: () => null }).chyby, [],
  'Windows without controls remain valid');

const zpravy = [];
const puvodniError = console.error;
try {
  console.error = zprava => zpravy.push(zprava);
  for (const hodnota of [NaN, Infinity, -Infinity, undefined, '0.5']) {
    assert.equal(zobrazitHodnotu('activity', { activity: hodnota }), '—');
  }
  assert.equal(zpravy.length, 1, 'Repeated display errors must only be reported once');
  assert.equal(zobrazitHodnotu('unknown', model), '—');
  assert.equal(zobrazitHodnotu('activity', { activity: 0.53 }), '53');
  assert.equal(zobrazitHodnotu('glucoseGramsPerMinute', { glucoseGramsPerMinute: 0 }), '0,0');
  assert.equal(zobrazitHodnotu('glucoseGramsPerMinute', { glucoseGramsPerMinute: 3.2 }), '3,2');
  assert(Number.isNaN(vypocitatVzorec('missingFormula', model)));
  assert(Number.isNaN(vypocitatVzorec('activity', { ...model, hydration: Infinity })));
} finally { console.error = puvodniError; }

assert.deepEqual(zkontrolovatOkna(nastaveni).chyby, [], 'Checks must not mutate valid definitions');
const invalidTextFormula = { ...oknaPodleKapitol.transpiration[0], vzorecText: '' };
assert(zkontrolovatOkna({ ...nastaveni, okna: { transpiration: [invalidTextFormula] } }).neplatnaOkna.has(invalidTextFormula),
  'An empty displayed formula must be rejected');
assert(oknaPodleKapitol.transpiration.every(okno => okno.zobrazitVzorec && okno.vzorecText),
  'Every numeric transpiration window must display its actual relation');
assert(!oknaPodleKapitol.transpiration.some(okno => okno.id === 'prutok'), 'Removed flow window must stay absent');
console.log('PASS: startup definitions, cycles, missing sources/labels/colors, duplicate IDs, controls and invalid numbers.');
