import { oknaPodleKapitol, kontextoveTexty, pruvodceTranspiraci } from './element_ui_okna_obsah.js?v=right-windows-1';
import { veliciny, vstupyVzorce, ohlasitChybuOken } from './element_ui_okna_veliciny.js?v=transpiration-vapour-1';
import { zkontrolovatOkna } from './element_ui_okna_kontrola.js?v=seeds-1';

// Original embedded assets from ui_new.svg, at their exported stroke widths.
const strokes = {
  vertical: [
    { file: 'ui_linka_svisla_1.png', width: 9, height: 67 },
    { file: 'ui_linka_svisla_2.png', width: 7, height: 32 },
    { file: 'ui_linka_svisla_3.png', width: 6, height: 31 },
    { file: 'ui_linka_svisla_4.png', width: 8, height: 32 },
    { file: 'ui_linka_svisla_5.png', width: 7, height: 69 },
  ],
  horizontal: [
    { file: 'ui_linka_vodorovna_1.png', width: 200, height: 5 },
    { file: 'ui_linka_vodorovna_2.png', width: 201, height: 6 },
    { file: 'ui_linka_vodorovna_3.png', width: 250, height: 6 },
  ],
};
const strokeBags = { vertical: [], horizontal: [] };
const waterAvailabilityMax = model => Math.max(model.seasonalWaterLimit * 2, model.waterInput, 0.001);
function pickUiWindowStroke(direction) {
  const bag = strokeBags[direction];
  if (!bag.length) {
    bag.push(...strokes[direction]);
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
  }
  const stroke = bag.pop();
  return { ...stroke, url: new URL(`../web_assets/${stroke.file}`, import.meta.url).href };
}
function createElementUiOkno({ panel, body, reveal, toggle, model, definition }) {
  panel.classList.add('element-ui-okno');
  panel.dataset.topic ||= 'neutral';
  const footer = document.createElement('div');
  footer.className = 'element-ui-values';
  for (const metric of body.querySelectorAll('.chapter-metric')) {
    footer.append(metric);
    const strong = metric.querySelector('strong');
    for (const node of [...strong.childNodes]) {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) continue;
      const unit = document.createElement('span');
      unit.className = 'element-ui-unit';
      unit.textContent = node.textContent.trim();
      node.replaceWith(unit);
    }
  }
  // Two independent blocks: readout and scrollable detail.
  const readout = document.createElement('div');
  readout.className = 'element-ui-readout';
  const header = panel.querySelector(':scope > header');
  const formula = body.querySelector('.ui-window-formula');
  readout.append(header, footer);
  if (formula) readout.append(formula);
  panel.insertBefore(readout, reveal);
  const edge = panel.querySelector('.annotation-frame-left');
  for (const frame of panel.querySelectorAll('.annotation-frame')) if (frame !== edge) frame.remove();
  edge.classList.add('element-ui-edge');
  const stroke = pickUiWindowStroke('vertical');
  panel.style.setProperty('--ui-edge-variant', `url("${stroke.url}")`);
  edge.dataset.variant = stroke.file;
  if (panel.dataset.chapter === 'photosynthesis' && !definition.hlavni) {
    const current = footer.querySelector('.chapter-metric');
    const unavailable = document.createElement('div');
    unavailable.className = 'chapter-metric element-ui-unavailable';
    const label = document.createElement('span');
    label.textContent = definition.id === 'co2' ? 'produkce' : 'spotřeba';
    const message = document.createElement('span');
    message.textContent = 'Zatím nemáme hodnotu';
    unavailable.append(label, message);
    const availability = document.createElement('div');
    availability.className = 'chapter-metric';
    const availabilityLabel = document.createElement('span');
    availabilityLabel.textContent = 'dostupnost';
    const availabilityValue = document.createElement('strong');
    availabilityValue.className = 'element-ui-availability';
    availabilityValue.textContent = '—';
    availability.append(availabilityLabel, availabilityValue);
    const makeBar = (metric, role, reverse, interactive = false) => {
      const bar = document.createElement('div');
      bar.className = `element-ui-flow-bar${reverse ? ' is-reversed' : ''}`;
      bar.dataset.flow = role;
      const fill = document.createElement('span');
      fill.className = 'element-ui-flow-fill';
      const stroke = pickUiWindowStroke('horizontal');
      fill.style.setProperty('--ui-flow-variant', `url("${stroke.url}")`);
      bar.append(fill);
      if (interactive) {
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0'; slider.max = '1000'; slider.step = '1';
        slider.className = 'element-ui-flow-slider';
        slider.setAttribute('aria-label', 'Dostupnost vody pro kořeny');
        slider.addEventListener('pointerdown', () => {
          slider.dataset.scaleMax = String(waterAvailabilityMax(model));
        });
        for (const eventName of ['pointerup', 'pointercancel', 'lostpointercapture']) {
          slider.addEventListener(eventName, () => { delete slider.dataset.scaleMax; });
        }
        slider.addEventListener('input', () => {
          const max = Number(slider.dataset.scaleMax) || waterAvailabilityMax(model);
          if (Number.isFinite(max) && max > 0) model.setWaterInput(max * Number(slider.value) / 1000);
        });
        bar.append(slider);
      }
      footer.append(bar, metric);
    };
    if (current) {
      footer.replaceChildren();
      makeBar(definition.id === 'co2' ? unavailable : current, definition.id === 'co2' ? 'unknown' : 'measured', false);
      makeBar(definition.id === 'co2' ? current : ['voda', 'svetlo'].includes(definition.id) ? availability : unavailable,
        definition.id === 'co2' ? 'measured' : definition.id === 'voda' ? 'availability' : definition.id === 'svetlo' ? 'light-availability' : 'unknown', true, definition.id === 'voda');
      panel.classList.add('element-ui-flow-window');
    }
  }
  toggle.classList.add('element-ui-trigger');
  toggle.setAttribute('aria-controls', reveal.id = `${body.id}-reveal`);
}


// Static screen-space UI. Camera and tree geometry never participate in layout.
// Original content and controls are moved, so live outputs and handlers survive.
export function createTreeAnnotations({ shell, model, createSeasonControl, setElementHighlight = () => {} }) {
  // This hint lives only until reload; defaults opening programmatically do not dismiss it.
  const hintTimer = setTimeout(() => shell.classList.add('window-toggle-hint'),
    Math.max(0, 30000 - performance.now()));
  function dismissToggleHint() {
    clearTimeout(hintTimer);
    shell.classList.remove('window-toggle-hint');
  }
  const linkedWindows = new Map();
  const contextSelections = new Map();
  const contextGuides = new Map();
  let activeChapter = null;
  function syncHighlights() {
    const states = [...linkedWindows.values()];
    for (const tag of new Set(states.map(state => state.tag))) {
      setElementHighlight(tag, states.some(state => state.tag === tag && state.chapter === activeChapter && (state.open || state.hovered)));
    }
  }
  const content = shell.querySelector('.chapter-content');
  const kontrola = zkontrolovatOkna({
    okna: oknaPodleKapitol,
    model,
    najitOvladani: id => document.getElementById(id)?.closest('.slider-group'),
  });
  kontrola.chyby.forEach(ohlasitChybuOken);
  function updateContextGuide(chapter) {
    const guide = contextGuides.get(chapter);
    const config = kontextoveTexty[chapter];
    if (!guide || !config) return;
    const selections = contextSelections.get(chapter) || [];
    const selected = selections.at(-1);
    const title = guide.querySelector('h2');
    const next = config.varianty[selected] || config.vychozi;
    clearTimeout(guide.contextTimer);
    if (!title.textContent) {
      title.textContent = next;
      title.classList.remove('context-fading');
      return;
    }
    if (title.textContent === next) {
      title.classList.remove('context-fading');
      return;
    }
    title.classList.remove('context-fading');
    guide.contextTimer = setTimeout(() => {
      title.classList.add('context-fading');
      guide.contextTimer = setTimeout(() => {
        title.textContent = next;
        title.classList.remove('context-fading');
      }, 3000);
    }, 15000);
  }
  function addContextGuide(article, chapter) {
    const config = kontextoveTexty[chapter];
    if (!config) return;
    const guide = document.createElement('section');
    guide.className = 'chapter-context-guide';
    guide.setAttribute('aria-label', `Kontext kapitoly ${article.dataset.chapter}`);
    const title = document.createElement('h2');
    guide.append(title);
    contextGuides.set(chapter, guide);
    article.append(guide);
    updateContextGuide(chapter);
  }
  function card(article, anchor, side, title, nodes, heading = null, definition = null) {
    const panel = document.createElement('section');
    panel.className = 'tree-annotation';
    panel.dataset.chapter = article.dataset.chapter;
    panel.dataset.panelId = definition?.id || anchor;
    panel.dataset.side = side;
    if (definition) {
      panel.dataset.windowId = definition.id;
      panel.dataset.topic = definition.tema || 'neutral';
      panel.dataset.mainWindow = String(Boolean(definition.hlavni));
      panel.dataset.toggleVisible = String(Boolean(definition.viditelnyPrepinac));
      panel.dataset.formulaKind = definition.vzorecText ? 'equation' : 'inputs';
    }
    const header = document.createElement('header');
    const h = heading || document.createElement('h3');
    if (!heading) h.textContent = title;
    if (definition && /[₀-₉]/u.test(h.textContent)) {
      const digits = '₀₁₂₃₄₅₆₇₈₉';
      h.replaceChildren(...h.textContent.split(/([₀-₉]+)/u).map(part => {
        if (!/^[₀-₉]+$/u.test(part)) return document.createTextNode(part);
        const sub = document.createElement('sub');
        sub.className = 'ui-heading-subscript';
        sub.textContent = [...part].map(char => digits.indexOf(char)).join('');
        return sub;
      }));
    }
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'annotation-toggle';
    toggle.setAttribute('aria-label', `Zobrazit nebo skrýt podrobnosti: ${title}`);
    const body = document.createElement('div');
    body.className = 'annotation-body';
    body.id = `annotation-${article.dataset.chapter}-${definition?.id || anchor}`;
    const reveal = document.createElement('div');
    reveal.className = 'annotation-reveal';
    const revealInner = document.createElement('div');
    revealInner.className = 'annotation-reveal-inner';
    revealInner.append(body);
    reveal.append(revealInner);
    toggle.setAttribute('aria-controls', body.id);
    for (const edge of ['top', 'right', 'bottom', 'left']) {
      const frame = document.createElement('span');
      frame.className = `annotation-frame annotation-frame-${edge}`;
      frame.setAttribute('aria-hidden', 'true');
      panel.append(frame);
    }
    body.append(...nodes.filter(Boolean));
    panel.append(header, reveal);
    if (definition) createElementUiOkno({ panel, body, reveal, toggle, model, definition });
    if (definition) {
      for (const [eventName, hovered] of [['pointerenter', true], ['pointerleave', false]]) {
        panel.addEventListener(eventName, event => {
          if (event.pointerType === 'touch') return;
          const state = linkedWindows.get(panel);
          if (state) { state.hovered = hovered; syncHighlights(); }
        });
      }
    }
    let expanded = false;
    function expand(open) {
      expanded = open;
      if (definition) {
        linkedWindows.set(panel, { tag: definition.tema, chapter: article.dataset.chapter, open, hovered: linkedWindows.get(panel)?.hovered || false });
        syncHighlights();
        const context = kontextoveTexty[article.dataset.chapter];
        if (context?.varianty?.[definition.id]) {
          const selections = (contextSelections.get(article.dataset.chapter) || [])
            .filter(id => id !== definition.id);
          if (open) selections.push(definition.id);
          contextSelections.set(article.dataset.chapter, selections);
          updateContextGuide(article.dataset.chapter);
        }
      }
      body.inert = !open;
      body.setAttribute('aria-hidden', String(!open));
      panel.classList.toggle('collapsed', !open);
      toggle.textContent = open ? '−' : '+';
      toggle.setAttribute('aria-expanded', String(open));
    }
    const userToggle = () => { dismissToggleHint(); expand(!expanded); };
    toggle.addEventListener('click', userToggle);
    if (definition && (definition.viditelnyPrepinac || ['water', 'sugar'].includes(definition.tema))) h.addEventListener('click', userToggle);
    expand(definition ? Boolean(definition.otevrene) : article.dataset.chapter === 'intro' || article.dataset.chapter === 'seasons');
    header.append(h, toggle);
    article.append(panel);

  }

  // All configured windows use this builder; the records contain their content.
  function configuredCard(article, definition) {
    const nodes = [];
    const paragraph = (text, className = '') => {
      const node = document.createElement('p');
      node.className = className;
      node.textContent = text;
      nodes.push(node);
    };
    const value = veliciny[definition.vypocet];
    if (definition.zobrazitVzorec && value) {
      const formula = document.createElement('p');
      formula.className = 'ui-window-formula';
      try {
        if (definition.vzorecText) formula.textContent = definition.vzorecText;
        else vstupyVzorce(definition.vypocet).forEach((key, index) => {
          if (index) formula.append(document.createTextNode(' × '));
          const tag = document.createElement('span');
          tag.className = `ui-word ui-word-${veliciny[key].tema}`;
          tag.dataset.velicina = key;
          tag.textContent = veliciny[key].nazev;
          formula.append(tag);
        });
      } catch (error) {
        formula.textContent = '—';
        ohlasitChybuOken(`Okno „${definition.id}“: ${error.message}`);
      }
      nodes.push(formula);
    }
    // The fixed layout moves the formula beneath the metric.
    if (definition.popis) paragraph(definition.popis, 'ui-window-description');
    for (const text of definition.text || []) paragraph(text);
    if (definition.zobrazitHodnotu && value) {
      const metric = document.createElement('div');
      metric.className = `chapter-metric ${value.druh || 'value'}-metric`;
      if (value.popisHodnoty) {
        const label = document.createElement('span');
        label.textContent = definition.id === 'svetlo' ? 'spotřeba' : value.popisHodnoty;
        metric.append(label);
      }
      const strong = document.createElement('strong');
      const output = document.createElement('output');
      output.id = value.vystupId || `value-${definition.id}`;
      output.dataset.zivaVelicina = definition.vypocet;
      output.textContent = '—';
      strong.append(output);
      if (value.jednotka) strong.append(document.createTextNode(value.jednotka));
      metric.append(strong);
      nodes.push(metric);
    }
    if (definition.stavObdobi) {
      const metric = document.createElement('div');
      metric.className = 'chapter-metric';
      const strong = document.createElement('strong');
      const output = document.createElement('output');
      output.dataset.stavObdobi = definition.id;
      strong.append(output);
      metric.append(strong);
      nodes.push(metric);
    }
    if (definition.ovladani) {
      const input = document.getElementById(definition.ovladani.id);
      const control = input.closest('.slider-group');
      const label = control.querySelector('label');
      if (label) label.textContent = definition.ovladani.popis;
      nodes.push(control);
    }
    if (definition.odkaz) {
      const link = document.createElement('a');
      link.className = 'chapter-link';
      link.textContent = definition.odkaz.text;
      link.href = definition.odkaz.url;
      link.target = '_blank';
      link.rel = 'noopener';
      nodes.push(link);
    }
    const heading = definition.hlavni ? document.createElement('h2') : null;
    if (heading) heading.textContent = definition.nadpis;
    card(article, definition.id, definition.strana, definition.nadpis, nodes, heading, definition);
  }

  for (const article of content.querySelectorAll('article[data-chapter]')) {
    if (article.dataset.chapter === 'photosynthesis') {
      const title = document.createElement('h2');
      title.className = 'photosynthesis-title';
      title.textContent = 'Fotosyntéza';
      article.append(title);
    }
    if (kontextoveTexty[article.dataset.chapter]) addContextGuide(article, article.dataset.chapter);
    if (article.dataset.chapter === 'transpiration') {
      const guide = document.createElement('section');
      guide.className = 'chapter-context-guide';
      guide.setAttribute('aria-label', 'Jak funguje transpirace');
      const title = document.createElement('h2');
      title.textContent = pruvodceTranspiraci.nadpis;
      guide.append(title);
      article.append(guide);
    }
    const heading = article.querySelector('h2');
    const paragraphs = [...article.querySelectorAll(':scope > p')];
    const eyebrow = article.querySelector('.chapter-eyebrow');
    const tags = article.querySelector('.chapter-tags');
    const metric = id => article.querySelector(`#${id}`)?.closest('.chapter-metric');
    const detail = article.querySelector('details');
    const definitions = oknaPodleKapitol[article.dataset.chapter];
    if (definitions) {
      for (const definition of Array.isArray(definitions) ? definitions : []) {
        if (!kontrola.neplatnaOkna.has(definition)) configuredCard(article, definition);
      }
    } else if (article.dataset.chapter === 'intro') {
      // The introduction contains only a standalone title, without a window.
      continue;
    } else if (article.dataset.chapter === 'seasons') {
      card(article, 'wheel', 'left', 'Období stromu', [eyebrow, paragraphs[1],
        article.querySelector('.period-readout'), paragraphs[2], article.querySelector('.period-seasons'),
        article.querySelector('#periodYearPlayback')], heading);
      card(article, 'leaves', 'right', 'Denní čas', [paragraphs[3],
        article.querySelector('.period-hours'), article.querySelector('.period-day-cycle'),
        article.querySelector('#periodDayPlayback'), paragraphs[4]]);
    } else if (article.dataset.chapter === 'roots') {
      const tipHeading = article.querySelector('h3');
      detail.insertBefore(article.querySelector('.root-diagram'), detail.querySelector('p'));
      card(article, 'roots', 'left', 'Kořeny', [eyebrow, tags, paragraphs[1], article.querySelector('#btnRootCamera')], heading);
      card(article, 'rootTip', 'right', 'Kořenová špička', [paragraphs[2], detail], tipHeading);

    }
    // Preserve additional fields when chapter content gains another metric.
    // Only empty wrappers can be discarded; live outputs must remain in the DOM.
    const mainBody = article.querySelector('.annotation-body');
    for (const node of [...article.children]) {
      if (node.classList.contains('tree-annotation') || node.classList.contains('chapter-context-guide') || node.classList.contains('transpiration-prompt') || node.classList.contains('photosynthesis-title')) continue;
      if (node.classList.contains('chapter-metrics') && !node.children.length) node.remove();
      else if (mainBody) mainBody.append(node);
    }
  }

  const seasonRow = shell.querySelector('.season-btn-row');
  seasonRow.classList.add('season-ring-accessible');
  seasonRow.setAttribute('aria-label', 'Roční období – ovládání prostorového kruhu');
  shell.append(seasonRow);
  shell.querySelector('#sharedSeasons').hidden = true;
  const seasonControl = createSeasonControl();

  return {
    update(chapter, playbackDelta = 0) {
      activeChapter = chapter;
      for (const bar of shell.querySelectorAll('.element-ui-flow-bar')) {
        const panel = bar.closest('.element-ui-okno');
        const slider = bar.querySelector('input');
        const maxWater = Number(slider?.dataset.scaleMax) || waterAvailabilityMax(model);
        const fraction = bar.dataset.flow === 'unknown' ? 0
          : bar.dataset.flow === 'availability' ? model.waterInput / maxWater
          : bar.dataset.flow === 'light-availability' ? model.light
          : panel.dataset.windowId === 'voda' ? model.waterConsumption / (model.baseTranspiration * 1.015)
          : model.activity;
        const level = Number.isFinite(fraction) ? Math.max(0, Math.min(1, fraction)) : 0;
        bar.style.setProperty('--flow-level', `${level * 100}%`);
        if (bar.dataset.flow === 'light-availability') {
          panel.querySelector('.element-ui-availability').textContent = `${Math.round(level * 100)} %`;
        }
        if (slider) {
          if (!slider.matches(':active')) slider.value = String(Math.round(level * 1000));
          const displayed = Number.isFinite(model.waterInput) ? (model.waterInput * 60).toLocaleString('cs-CZ', { maximumFractionDigits: 1, minimumFractionDigits: 1 }) : '—';
          panel.querySelector('.element-ui-availability').textContent = `${displayed} l/h`;
          slider.setAttribute('aria-valuetext', `${displayed} litrů za hodinu`);
          slider.disabled = !model.ready;
        }
      }
      for (const definition of oknaPodleKapitol.seeds) {
        const output = shell.querySelector(`output[data-stav-obdobi="${definition.id}"]`);
        if (output) output.textContent = definition.stavObdobi[model.season] || '—';
      }
      syncHighlights();
      seasonRow.hidden = chapter === 'intro';
      seasonControl.update(chapter, playbackDelta);
    }
  };
}
