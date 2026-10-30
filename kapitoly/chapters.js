import { zobrazitHodnotu } from '../okna/element_ui_okna_veliciny.js?v=4';
import { SEASONS } from '../ekologie/tree_ecology.js?v=active-leaves-1&checks=1';
import { createTreeAnnotations } from '../okna/tree_annotations.js?v=tree-anchor-lines-4&title-test=3&checks=1';

const chapters = [
  ['intro', 'Úvod'], ['seasons', 'Období'], ['photosynthesis', 'Fotosyntéza'], ['transpiration', 'Transpirace'],
  ['roots', 'Kořeny'], ['seeds', 'Semenace']
];
const metric = (label, id, unit = '') => `<div class="chapter-metric"><span>${label}</span><strong><output id="${id}">—</output>${unit}</strong></div>`;
const rootDiagram = `<svg class="root-diagram" viewBox="0 0 300 210" role="img" aria-label="Schéma rostoucí kořenové špičky: prodlužovací, přechodová a dělivá oblast a ochranná čepička. Kořen uhýbá před překážkou.">
  <path d="M132 10 L132 75" stroke="#9aaa7a" stroke-width="30" fill="none"/>
  <path d="M132 75 L132 100" stroke="#d3bb73" stroke-width="30" fill="none"/>
  <g class="root-growing-tip"><path d="M132 100 Q132 125 144 142" stroke="#e8a976" stroke-width="27" fill="none"/>
  <path d="M144 142 Q151 152 158 151" stroke="#bc775a" stroke-width="26" stroke-linecap="round" fill="none"/>
  <circle class="root-signal" cx="133" cy="101" r="7" fill="#e6f5c4"/></g>
  <path d="M100 169 Q112 142 140 158 Q159 150 172 175 L168 188 L107 188Z" fill="#727774"/>
  <g stroke="#8c9985" stroke-width="1"><path d="M151 40 H184 M151 86 H184 M154 118 H184 M165 148 H184"/></g>
  <g fill="#d9dfd3" font-size="10" font-family="Nohemi, sans-serif"><text x="190" y="43">Prodlužovací oblast</text><text x="190" y="89">Přechodová zóna</text><text x="190" y="121">Dělivá oblast</text><text x="190" y="151">Čepička</text><text x="20" y="200">Překážka → signál → změna růstu</text></g>
</svg>`;

export function createChapters({ model, applySeason, setSun, setAzimuth, setVisualChapter, introFrame, focusRoots, project, getAnchors, getCrownBounds, createSeasonControl }) {
  document.body.classList.add('has-chapters');
  const drawer = document.getElementById('controlsPanel');
  drawer.classList.add('collapsed');
  drawer.inert = true;
  drawer.querySelector('h2').textContent = 'Nastavení zobrazení';
  const shell = document.createElement('aside');
  shell.className = 'chapter-panel';
  shell.setAttribute('aria-label', 'Obsah kapitoly a společné ovládání');
  shell.innerHTML = `
    <div class="chapter-content">
      <article data-chapter="intro">
        <h2 class="intro-title">strom</h2>
      </article>
      <article data-chapter="seasons" hidden>
        <p class="chapter-eyebrow">01 / Čas stromu</p><h2>Období stromu</h2>
        <p>Strom se mění v průběhu roku i jednoho dne. Vyzkoušejte obě časové osy a sledujte listy, slunce a stín přímo na stromu.</p>
        <div class="period-readout" aria-live="off"><span>Teď ve stromu</span><strong><output id="periodSeason">—</output> · <output id="periodTime">—</output></strong></div>
        <p>Otočte kruhem u paty stromu, nebo vyberte roční období. Zkuste se vrátit zpět a porovnejte korunu na jaře, v létě, na podzim a v zimě.</p>
        <div class="period-choice-row period-seasons" role="group" aria-label="Vybrat roční období">
          <button type="button" data-period-season="spring">Jaro</button><button type="button" data-period-season="summer">Léto</button>
          <button type="button" data-period-season="autumn">Podzim</button><button type="button" data-period-season="latefall">Zima</button>
        </div>
        <button type="button" id="periodYearPlayback" class="period-playback">Ⅱ Pozastavit rok</button>
        <p>Čas dne nastavíte posuvníkem dole. Ráno slunce vychází, v poledne je vysoko a v noci je pod obzorem. Tlačítky můžete skočit přímo na ukázkový čas.</p>
        <div class="period-choice-row period-hours" role="group" aria-label="Vybrat čas dne">
          <button type="button" data-period-hour="8">Ráno</button><button type="button" data-period-hour="12">Poledne</button><button type="button" data-period-hour="22">Noc</button>
        </div>
        <label class="period-day-cycle"><input type="checkbox" id="periodDayCycle" checked> Slunce podle hodin</label>
        <button type="button" id="periodDayPlayback" class="period-playback">Ⅱ Pozastavit čas</button>
        <p class="chapter-note">Dole můžete den pozastavit nebo zrychlit na 2× a 4×. Při ruční změně výšky či směru slunce se denní cyklus vypne; znovu jej zapnete přepínačem výše.</p>
      </article>
      <article data-chapter="photosynthesis" hidden></article>
      <article data-chapter="transpiration" hidden>
        <p class="chapter-eyebrow">03 / Cesta vody</p><h2>Transpirace</h2>
        <div class="chapter-tags"><span>Voda</span><span>Buk lesní</span></div>
        <p>Voda proudí od kořenů xylémem do listů. Odtud se odpařuje převážně průduchy. Odpar pomáhá táhnout vodu stromem a spotřebovává teplo. Zobrazený průtok je odhad toku ze zásoby vody ke koruně, včetně odparu a drobných ostatních ztrát. Příjem kořeny může současně doplňovat zásobu.</p>
        <div class="water-route" aria-label="Cesta vody"><span>Kořeny</span><i>↑</i><span>Xylém</span><i>↑</i><span>Listy → pára</span></div>
        <div class="chapter-metrics">${metric('Příjem vody', 'ecoTranspirationInflow', ' l/h')}${metric('Průtok vody stromem ≈', 'ecoTreeWaterFlow', ' l/h')}${metric('Odpařená voda', 'ecoTranspiration', ' l/h')}${metric('Chladicí výkon ≈', 'ecoCooling', ' kW')}</div>
        <div class="chapter-temperature" aria-label="Rozdíl teploty koruny a okolí"><strong><output id="ecoCanopyTemperatureDifference">—</output></strong></div>
        <p>Za světla bývá odpar vyšší. Při nedostatku vody průduchy omezují její ztráty a současně klesá chladicí účinek. V noci olistěná koruna omezuje vyzařování tepla, takže vzduch u ní může být mírně teplejší než mimo strom. Zobrazený příjem vody nepřekročí sezónní maximum kořenů.</p>
        <p class="chapter-note">Měsíční základ vychází z celostátních normálů ČHMÚ 1991–2020. Denní kolísání i několikadenní teplá a chladná období jsou výukový odhad; v létě mohou vznikat dny nad 30 °C. Odpar vody odhad ochlazuje. Nejde o předpověď počasí ani měření skutečné teploty okolí. Chladicí výkon je samostatný fyzikální odhad ve wattech, ne vypočítaná změna teploty.</p>
      </article>
      <article data-chapter="roots" hidden>
        <p class="chapter-eyebrow">04 / Pod povrchem</p><h2>Kořeny</h2>
        <div class="chapter-tags"><span>Buk lesní</span><span>Kořenové špičky</span></div>
        <p>Jemné kořeny přijímají vodu a minerální látky a předávají je do xylému. Pomáhá jim mykorhiza, soužití kořenů s houbami. Příjem omezuje suchá, utužená i dlouhodobě zamokřená půda s nedostatkem kyslíku.</p>
        <p id="ecoRootCondition" class="chapter-root-condition" role="status">Kořeny přijímají vodu.</p>
        <div class="chapter-metrics">${metric('Zamokření půdy', 'ecoWaterlogging', ' %')}</div>
        <p class="chapter-note">Orientační ukazatel: přebytečná voda se hromadí a postupně odtéká. Dlouhodobé zamokření omezuje příjem vody kořeny.</p>
        <button type="button" id="btnRootCamera" class="chapter-secondary">Přiblížit kořeny</button>
        <h3>Kořenová špička – vnímání a reakce</h3>${rootDiagram}
        <p>Rostoucí kořeny reagují na gravitaci, překážky i rozdíly ve vlhkosti. Směr růstu mění díky spolupráci buněk špičky a přilehlých růstových oblastí.</p>
        <details><summary>Jak reakce vzniká</summary><p>Čepička chrání konec kořene a podílí se na vnímání gravitace. Změna rozložení auxinu ovlivňuje prodlužování buněk a zakřivení kořene. Dotyk s překážkou může změnit jeho růst.</p><p>Reakce na vlhkost se nazývá hydrotropismus. Pokusy na huseníčku ukázaly také účast buněk kůry prodlužovací oblasti. Přesný průběh u buku zde nesimulujeme.</p><p>„Mozek kořene“ je historická, diskutovaná metafora. Rostliny nemají mozek ani neurony. Pulz ve schématu znázorňuje signalizaci a pohyb je zrychlený.</p><a href="https://www.nature.com/articles/nplants201757" target="_blank" rel="noopener">Výzkum hydrotropismu ↗</a></details>
      </article>
      <article data-chapter="seeds" hidden>
        <p class="chapter-eyebrow">05 / Další generace</p><h2>Semenace</h2>
        <div class="chapter-tags"><span>Roční období</span></div>
        <p>Život buku pokračuje v bukvicích. Jejich vývoj souvisí s ročním obdobím; bohatá úroda semen přichází jen v některých letech.</p>
        <ol class="seed-cycle"><li data-seed-season="spring"><strong>Jaro</strong><span>Rašení listů a kvetení. Pyl přenáší vítr.</span></li><li data-seed-season="summer"><strong>Léto</strong><span>Po opylení se vyvíjejí plody v číškách.</span></li><li data-seed-season="autumn"><strong>Podzim</strong><span>Číšky se otevírají a zralé bukvice padají. Část semen přenášejí živočichové.</span></li><li data-seed-season="latefall"><strong>Zima</strong><span>Semena přezimují. Vhodné podmínky umožní na jaře klíčení.</span></li></ol>
        <p class="chapter-note">Vyberte období dole a sledujte příslušnou fázi. Jde o přehled typického ročního cyklu.</p>
      </article>
    </div>
    <section class="chapter-shared manager-controlled manager-hidden" id="chapterShared" aria-label="Společné podmínky stromu" hidden>
      <div class="shared-heading"><h3>Podmínky stromu</h3><output id="ecoSeasonLabel">—</output><button type="button" class="shared-toggle" aria-expanded="true" aria-label="Skrýt podmínky stromu">−</button></div>
      <div class="shared-body">
      <div class="temperature-comparison" aria-label="Porovnání teplot vzduchu">
        <div><span>Mimo strom</span><strong><output id="ecoTemperature">—</output> °C</strong></div>
        <div><span>U koruny</span><strong><output id="ecoTemperatureNearTree">—</output> °C</strong></div>
      </div>
      <div class="reserve-heading"><span>Rozdíl koruna − okolí</span><output id="ecoTemperatureDifference">—</output></div>
      <p class="chapter-note"><output id="ecoDaylight">Denní světlo</output></p>
      <div id="sharedSeasons"></div><div id="sharedWater"></div>
      <div class="reserve-heading"><span>Sezónní maximum příjmu</span><output id="ecoWaterLimit">—</output></div>
      <div class="reserve-heading"><span>Odhad dostupné zásoby</span><output id="ecoReserve">—</output></div>
      <meter id="ecoReserveMeter" min="0" max="1" value="0.8" aria-label="Dostupná zásoba vody"></meter>
      <p id="ecoReserveTrend" class="chapter-note" role="status">Bilance vody se načítá.</p>
      <div class="reserve-heading"><span>Spotřeba</span><output id="ecoConsumption">—</output></div>
      <p id="ecoLeafState" class="chapter-note" role="status">Listy jsou zavodněné.</p>
      <p id="ecoRootState" class="chapter-note" role="status">Kořeny přijímají vodu.</p>
      <details class="shared-sun"><summary>Slunce</summary><label class="day-cycle-control"><input type="checkbox" id="chkDayNight" checked> Slunce podle denních hodin</label><div id="sharedSun"></div></details>
      <p class="chapter-note model-note">Orientační výukový model · plocha listů a zásoba vody jsou odhady · změna období upraví přítok, zásoba se mění postupně · rychlost dne a noci se řídí společnými hodinami</p>
      </div>
    </section>`;
  document.body.append(shell);

  const sharedConditions = shell.querySelector('#chapterShared');
  const sharedToggle = sharedConditions.querySelector('.shared-toggle');
  sharedToggle.addEventListener('click', () => {
    const collapsed = sharedConditions.classList.toggle('collapsed');
    sharedToggle.textContent = collapsed ? '+' : '−';
    sharedToggle.setAttribute('aria-expanded', String(!collapsed));
    sharedToggle.setAttribute('aria-label', collapsed ? 'Zobrazit podmínky stromu' : 'Skrýt podmínky stromu');
  });

  // Move the actual inputs: the existing viewer listeners keep working.
  shell.querySelector('#sharedSeasons').append(document.querySelector('.season-btn-row'));
  const waterInput = document.getElementById('sliderTreeWater');
  const waterRow = waterInput.closest('.slider-group');
  const waterSection = shell.querySelector('[data-chapter="photosynthesis"]');
  waterSection.append(waterRow);
  waterRow.className = 'slider-group shared-water';
  waterRow.removeAttribute('style');
  const waterLabel = waterRow.querySelector('.slider-label');
  const capturedLabel = document.getElementById('valTreeWater');
  capturedLabel.removeAttribute('style');
  const inflowLabel = document.createElement('label');
  inflowLabel.htmlFor = 'sliderTreeWater';
  waterLabel.replaceChildren(inflowLabel, capturedLabel);
  waterRow.replaceChildren(waterLabel, waterInput);
  for (const id of ['sliderLightRot', 'sliderSunElevation']) {
    shell.querySelector('#sharedSun').append(document.getElementById(id).closest('.slider-group'));
  }
  const winterButton = document.querySelector('[data-season="latefall"]');
  winterButton.textContent = 'Zima';
  document.getElementById('btnRootCamera').addEventListener('click', event => {
    event.currentTarget.textContent = focusRoots() ? 'Zobrazit celý strom' : 'Přiblížit kořeny';
  });
  const toggleSettings = document.getElementById('btnTogglePanel');
  function syncDrawer() {
    drawer.inert = drawer.classList.contains('collapsed');
    toggleSettings.setAttribute('aria-expanded', String(!drawer.inert));
  }
  toggleSettings.addEventListener('click', syncDrawer);
  document.getElementById('btnClosePanel').addEventListener('click', syncDrawer);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !drawer.inert) {
      drawer.classList.add('collapsed');
      toggleSettings.classList.remove('active');
      syncDrawer();
      toggleSettings.focus();
    }
  });

  const nav = document.createElement('nav');
  nav.className = 'chapter-nav';
  nav.setAttribute('aria-label', 'Kapitoly');
  nav.innerHTML = '<p>Kapitoly</p>' + chapters.map(([id, label]) => `<button type="button" data-open-chapter="${id}" aria-controls="chapter-${id}">${label}</button>`).join('');
  document.body.append(nav);
  shell.querySelectorAll('[data-chapter]').forEach(a => { a.id = `chapter-${a.dataset.chapter}`; });
  shell.classList.add('tree-overlay');
  const titleTestButton = document.createElement('button');
  titleTestButton.type = 'button';
  titleTestButton.id = 'btnBlackWindowTitles';
  titleTestButton.className = 'ui-test-window-button manager-controlled manager-hidden';
  titleTestButton.setAttribute('aria-pressed', 'false');
  titleTestButton.textContent = 'Nadpisy oken: barvy';
  titleTestButton.hidden = true;
  nav.append(titleTestButton);
  titleTestButton.addEventListener('click', () => {
    const blackWindowTitles = titleTestButton;
    const enabled = shell.classList.toggle('ui-test-black-window-titles');
    blackWindowTitles.setAttribute('aria-pressed', String(enabled));
    blackWindowTitles.textContent = enabled ? 'Nadpisy oken: černé' : 'Nadpisy oken: barvy';
  });
  const treeAnnotations = createTreeAnnotations({ shell, project, getAnchors, getCrownBounds, model, createSeasonControl });

  let chapter = 'intro', ready = false, introTime = 0, saved = null, lastUI = -Infinity, introStarted = false;
  const setInput = (id, value) => {
    const input = document.getElementById(id);
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };
  function select(id) {
    if (!chapters.some(([key]) => key === id)) return;
    if (id === 'intro' && chapter !== 'intro') {
      saved = { season: model.season, elevation: Number(document.getElementById('sliderSunElevation').value), azimuth: Number(document.getElementById('sliderLightRot').value) };
      introTime = 0;
      introStarted = false;
    } else if (chapter === 'intro' && id !== 'intro' && saved) {
      applySeason(saved.season);
      setInput('sliderSunElevation', saved.elevation);
      setInput('sliderLightRot', saved.azimuth);
    }
    chapter = id;
    titleTestButton.hidden = id !== 'photosynthesis';
    shell.querySelectorAll('[data-chapter]').forEach(a => { a.hidden = a.dataset.chapter !== id; });
    shell.querySelector('#chapterShared').hidden = id === 'intro' || id === 'seasons';
    // The Manager button controls these elements even when the active chapter changes.
    const managerOpen = document.getElementById('btnManager')?.getAttribute('aria-pressed') === 'true';
    titleTestButton.classList.toggle('manager-hidden', !managerOpen);
    shell.querySelector('#chapterShared').classList.toggle('manager-hidden', !managerOpen);
    shell.querySelector('.shared-sun').hidden = false;
    nav.querySelectorAll('button').forEach(b => {
      b.setAttribute('aria-current', b.dataset.openChapter === id ? 'page' : 'false');
    });
    drawer.classList.add('collapsed');
    syncDrawer();
    document.getElementById('btnTogglePanel').classList.remove('active');
    shell.querySelector('.chapter-content').scrollTop = 0;
    setVisualChapter(id);
    document.body.dataset.chapter = id;
  }
  nav.addEventListener('click', event => {
    const button = event.target.closest('[data-open-chapter]');
    if (button) { select(button.dataset.openChapter); shell.querySelector('article:not([hidden]) h2')?.focus({ preventScroll: true }); }
  });
  shell.querySelectorAll('h2').forEach(h => { h.tabIndex = -1; });

  const yearPlayback = shell.querySelector('.season-clock button');
  const dayPlayback = document.getElementById('btnTimePause');
  const periodYearPlayback = shell.querySelector('#periodYearPlayback');
  const periodDayPlayback = shell.querySelector('#periodDayPlayback');
  const periodDayCycle = shell.querySelector('#periodDayCycle');
  shell.querySelectorAll('[data-period-season]').forEach(button => {
    button.addEventListener('click', () => {
      shell.querySelector(`.season-btn[data-season="${button.dataset.periodSeason}"]`)?.click();
      if (ready) render();
    });
  });
  shell.querySelectorAll('[data-period-hour]').forEach(button => {
    button.addEventListener('click', () => {
      const dayCycle = document.getElementById('chkDayNight');
      if (!dayCycle.checked) {
        dayCycle.checked = true;
        dayCycle.dispatchEvent(new Event('change', { bubbles: true }));
      }
      const slider = document.getElementById('sliderTimeOfDay');
      slider.value = button.dataset.periodHour;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      if (ready) render();
    });
  });
  periodYearPlayback.addEventListener('click', () => { yearPlayback.click(); if (ready) render(); });
  periodDayPlayback.addEventListener('click', () => { dayPlayback.click(); if (ready) render(); });
  periodDayCycle.addEventListener('change', () => {
    const dayCycle = document.getElementById('chkDayNight');
    dayCycle.checked = periodDayCycle.checked;
    dayCycle.dispatchEvent(new Event('change', { bubbles: true }));
    if (ready) render();
  });

  // Keep the previous advanced settings persistence, excluding shared conditions.
  const storageKey = 'strom.settings.v1';
  let restoring = false;
  const settingInputs = () => [...drawer.querySelectorAll('input[id]')];
  function saveSettings() {
    if (!ready || restoring) return;
    const inputs = Object.fromEntries(settingInputs().map(i => [i.id, i.type === 'checkbox' ? i.checked : i.value]));
    const choices = [...drawer.querySelectorAll('[data-toon].active, [data-alphamode].active, [data-leaf-type].active')].map(b => {
      const a = ['data-toon', 'data-alphamode', 'data-leaf-type'].find(key => b.hasAttribute(key));
      return `${a}:${b.getAttribute(a)}`;
    });
    const leafCountDefault = document.getElementById('sliderLeafCount').defaultValue;
    try { localStorage.setItem(storageKey, JSON.stringify({ inputs, choices, leafCountDefault })); } catch { /* Storage is optional. */ }
  }
  drawer.addEventListener('input', saveSettings);
  drawer.addEventListener('change', saveSettings);
  drawer.addEventListener('click', event => { if (event.target.closest('button')) saveSettings(); });
  const fmt = (n, digits = 1) => n.toLocaleString('cs-CZ', { maximumFractionDigits: digits });
  const hourly = ratePerMinute => fmt(ratePerMinute * 60, 2);
  function render() {
    const out = (id, text) => { document.getElementById(id).textContent = text; };
    const season = SEASONS[model.season];
    out('ecoSeasonLabel', season.label);
    out('periodSeason', season.label);
    out('periodTime', document.getElementById('valTimeOfDay').textContent || '—');
    shell.querySelectorAll('[data-period-season]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.periodSeason === model.season));
    });
    periodYearPlayback.textContent = yearPlayback.textContent;
    periodYearPlayback.setAttribute('aria-pressed', yearPlayback.getAttribute('aria-pressed'));
    periodDayPlayback.textContent = dayPlayback.getAttribute('aria-label');
    periodDayPlayback.setAttribute('aria-pressed', dayPlayback.getAttribute('aria-pressed'));
    periodDayCycle.checked = model.dayCycleEnabled;
    out('ecoTemperature', fmt(model.ambientTemperature, 1));
    out('ecoTemperatureNearTree', fmt(model.temperatureNearCanopy, 1));
    const temperatureDifference = Math.round((model.temperatureNearCanopy - model.ambientTemperature) * 10) / 10;
    const differenceText = `${temperatureDifference < 0 ? '−' : temperatureDifference > 0 ? '+' : ''}${fmt(Math.abs(temperatureDifference), 1)} °C`;
    out('ecoTemperatureDifference', differenceText);
    out('ecoCanopyTemperatureDifference', differenceText);
    const lightPhase = model.sunElevation > 6 ? 'Den' : model.sunElevation < -6 ? 'Noc' : model.sunAzimuth < 180 ? 'Svítání' : 'Soumrak';
    out('ecoDaylight', model.dayCycleEnabled
      ? `${lightPhase} · denní cyklus`
      : 'Ruční nastavení slunce');
    out('ecoReserve', `${fmt(model.reserve)} / ${fmt(model.capacity)} l`);
    out('ecoWaterLimit', `${hourly(model.seasonalWaterLimit)} l/h`);
    document.getElementById('ecoReserveMeter').value = model.reserve / model.capacity || 0;
    out('ecoReserveTrend', model.reserve >= model.capacity - 0.001
      ? 'Zásoba je plná.'
      : model.inflow > model.consumption + 0.0001
        ? 'Zásoba se doplňuje.'
        : model.inflow < model.consumption - 0.0001
          ? 'Zásoba ubývá.'
          : 'Příjem a spotřeba jsou vyrovnané.');
    out('ecoConsumption', `${hourly(model.consumption)} l/h`);
    out('ecoLeafState', model.activeFoliage <= 0.001 ? 'Bez aktivních listů · nízká potřeba vody.' : model.hydration < 0.95 ? `Nedostatek vody · stres ${fmt((1 - model.hydration) * 100, 0)} %. Listy postupně schnou.` : model.dryness > 0.05 ? 'Voda je dostupná · listy se postupně zotavují.' : 'Voda je dostupná · listy jsou zavodněné.');
    out('ecoWaterlogging', fmt(model.waterlogging * 100, 0));
    const rootState = model.rootRot >= 0.05
      ? model.waterlogging > 0.5
        ? `Kořeny zahnívají (${fmt(model.rootRot * 100, 0)} %) · skutečný příjem vody klesá.`
        : `Kořeny se zotavují (${fmt(model.rootRot * 100, 0)} % poškození) · příjem vody je ještě omezený.`
      : model.waterlogging > 0.5
        ? 'Půda je silně zamokřená. Pokud voda neodteče, kořeny se začnou poškozovat.'
        : model.waterlogging > 0.05
          ? 'V půdě se drží přebytečná voda a postupně odtéká.'
          : 'Kořeny přijímají vodu bez zamokření.';
    out('ecoRootState', rootState);
    out('ecoRootCondition', rootState);
    document.querySelector('.root-diagram').classList.toggle('rotting', model.rootRot >= 0.05);
    for (const output of shell.querySelectorAll('output[data-ziva-velicina]')) {
      output.textContent = zobrazitHodnotu(output.dataset.zivaVelicina, model);
    }
    out('ecoTranspiration', hourly(model.transpiration));
    out('ecoTranspirationInflow', hourly(model.inflow));
    // In the single-store model, upward flow is approximated by total water use.
    out('ecoTreeWaterFlow', hourly(model.consumption));
    out('ecoCooling', fmt(model.coolingKW, 2));
    capturedLabel.textContent = `${hourly(model.waterInput)} l/h`;
    if (document.activeElement !== waterInput) waterInput.value = model.waterInput * 60;
    shell.querySelectorAll('[data-seed-season]').forEach(li => {
      const active = li.dataset.seedSeason === model.season;
      li.classList.toggle('current', active);
      if (active) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
  }
  select('intro');
  return {
    get introduction() { return chapter === 'intro'; },
    get chapter() { return chapter; },
    select,
    updateScene(playbackDelta = 0) {
      if (!ready) return;
      treeAnnotations.update(chapter, playbackDelta);
      // Refresh the current model after evaluation, even while its clock is paused.
      const now = performance.now();
      if (now - lastUI >= 50) { render(); lastUI = now; }
    },
    modelReady() {
      if (ready) { setVisualChapter(chapter); return render(); }
      ready = true;
      restoring = true;
      try {
        const state = JSON.parse(localStorage.getItem(storageKey) || 'null');
        for (const input of settingInputs()) {
          // Apply a changed default once, then keep saving subsequent manual edits.
          const value = input.id === 'sliderLeafCount' && state?.leafCountDefault !== input.defaultValue
            ? input.defaultValue : state?.inputs?.[input.id];
          if (input.type === 'checkbox' && typeof value === 'boolean') {
            input.checked = value;
            input.dispatchEvent(new Event('change', { bubbles: true }));
          } else if (input.type === 'range' && value !== undefined && Number.isFinite(Number(value))) {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
        for (const button of drawer.querySelectorAll('[data-toon], [data-alphamode], [data-leaf-type]')) {
          const a = ['data-toon', 'data-alphamode', 'data-leaf-type'].find(key => button.hasAttribute(key));
          if (state?.choices?.includes(`${a}:${button.getAttribute(a)}`) && !button.classList.contains('active')) button.click();
        }
      } catch { /* A broken or unavailable saved profile does not block the tree. */ }
      restoring = false;
      saveSettings();
      saved = { season: model.season, elevation: model.sunElevation, azimuth: Number(document.getElementById('sliderLightRot').value) };
      setVisualChapter(chapter);
      render();
    },
    tick(delta) {
      if (!ready || document.hidden) return;
      if (chapter === 'intro') {
        if (!introStarted) {
          introFrame(1, true);
          introStarted = true;
        }
        introTime += delta;
        // Keep advancing through complete years without resetting the leaf animations.
        const introYearSeconds = 18;
        const position = 1 + introTime / introYearSeconds * 4;
        introFrame(position);
      }
    }
  };
}
