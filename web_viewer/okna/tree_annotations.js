import { oknaPodleKapitol, kontextoveTexty, pruvodceTranspiraci } from './element_ui_okna_obsah.js?v=sugar-phenology-1';
import { veliciny, vstupyVzorce, ohlasitChybuOken, vyhladitHodnotu } from './element_ui_okna_veliciny.js?v=affinity-windows-layout-2';
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

function createBalanceBar({ top, bottom, adjustable = false }) {
  const bar = document.createElement('div');
  bar.className = 'element-ui-balance-bar';
  bar.innerHTML = `
    <span class="element-ui-balance-fill" aria-hidden="true">
      <span class="element-ui-balance-track"></span>
      <span class="element-ui-balance-markers"></span>
    </span>`;
  const markers = bar.querySelector('.element-ui-balance-markers');
  for (const [side, letter] of Object.entries({ top, bottom })) {
    if (letter === undefined) continue;
    const marker = document.createElement('span');
    marker.className = `element-ui-balance-marker element-ui-balance-marker-${side}`;
    marker.classList.toggle('element-ui-balance-adjustable', adjustable && side === 'top');
    const cap = document.createElement('span');
    cap.className = 'element-ui-balance-marker-cap';
    cap.textContent = letter;
    marker.append(cap);
    markers.append(marker);
  }
  return bar;
}

const stockNumber = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 1 });

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
  const isFlowChapter = ['photosynthesis', 'prototype'].includes(panel.dataset.chapter);
  if (formula && !isFlowChapter) readout.append(formula);
  panel.insertBefore(readout, reveal);
  const edge = panel.querySelector('.annotation-frame-left');
  for (const frame of panel.querySelectorAll('.annotation-frame')) if (frame !== edge) frame.remove();
  edge.classList.add('element-ui-edge');
  const stroke = pickUiWindowStroke('vertical');
  panel.style.setProperty('--ui-edge-variant', `url("${stroke.url}")`);
  edge.dataset.variant = stroke.file;
  if (isFlowChapter && !definition.hlavni) {
    const current = footer.querySelector('.chapter-metric');
    const unavailable = document.createElement('div');
    unavailable.className = 'chapter-metric element-ui-unavailable';
    const label = document.createElement('span');
    label.textContent = definition.id === 'co2' ? 'produkce' : 'spotřeba';
    const message = document.createElement('span');
    message.textContent = 'Zatím nemáme hodnotu';
    unavailable.append(label, message);
    const respirationFields = { kyslik: 'respirationOxygen', co2: 'respirationCO2', cukry: 'respirationSugar' };
    if (respirationFields[definition.id]) {
      unavailable.classList.remove('element-ui-unavailable');
      const value = document.createElement('strong');
      value.title = 'Orientační výukový odhad dýchání';
      const output = document.createElement('output');
      output.dataset.respiration = respirationFields[definition.id];
      output.textContent = '—';
      const unit = document.createElement('span');
      unit.className = 'element-ui-unit';
      unit.textContent = 'g/min';
      value.append(output, unit);
      message.replaceWith(value);
    }
    const availability = document.createElement('div');
    availability.className = 'chapter-metric';
    const availabilityLabel = document.createElement('span');
    availabilityLabel.textContent = 'dostupnost';
    const availabilityValue = document.createElement('strong');
    availabilityValue.className = 'element-ui-availability';
    const availabilityOutput = document.createElement('output');
    availabilityOutput.textContent = '—';
    const availabilityUnit = document.createElement('span');
    availabilityUnit.className = 'element-ui-unit';
    availabilityUnit.textContent = definition.id === 'svetlo' ? '%' : 'l/h';
    availabilityValue.append(availabilityOutput, availabilityUnit);
    availability.append(availabilityLabel, availabilityValue);
    const isAvailabilityWindow = ['voda', 'svetlo'].includes(definition.id);
    const isCo2 = definition.id === 'co2';
    const topMetric = isAvailabilityWindow ? availability : isCo2 ? unavailable : current;
    const bottomMetric = isAvailabilityWindow || isCo2 ? current : unavailable;

    if (current) {
      const bar = createBalanceBar({
        top: isAvailabilityWindow ? '' : 'P',
        bottom: definition.id === 'voda' ? '' : 'S',
        adjustable: isAvailabilityWindow,
      });

      if (isAvailabilityWindow) {
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0'; slider.max = '1000'; slider.step = '1';
        slider.className = 'element-ui-flow-slider element-ui-balance-slider';
        if (definition.id === 'svetlo') {
          slider.setAttribute('aria-label', 'Dostupnost světla');
          slider.addEventListener('input', () => model.setLightAvailability(Number(slider.value) / 1000));
        } else {
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
        }
        bar.append(slider);
      }

      footer.replaceChildren(topMetric, bar, bottomMetric);
      panel.classList.add('element-ui-flow-window');
      if (definition.zasoba) {
        const { zdroj = 'model', hodnota, maximum, jednotka } = definition.zasoba;
        const stock = document.createElement('div');
        stock.className = 'element-ui-stock';
        const label = document.createElement('div');
        label.className = 'chapter-metric element-ui-stock-label';
        const labelText = document.createElement('span');
        labelText.textContent = 'zásoba';
        label.append(labelText);
        const stockBar = createBalanceBar({ top: 'Z' });
        const metric = document.createElement('div');
        metric.className = 'chapter-metric element-ui-stock-readout';
        const value = document.createElement('strong');
        const output = document.createElement('output');
        output.dataset.stockSource = zdroj;
        if (zdroj === 'model') {
          output.dataset.stockValue = hodnota;
          output.dataset.stockMaximum = maximum;
        }
        output.setAttribute('aria-label', `Zásoba – ${definition.nadpis}`);
        output.textContent = '—';
        const unit = document.createElement('span');
        unit.className = 'element-ui-unit';
        unit.textContent = jednotka;
        const trend = document.createElement('span');
        trend.className = 'element-ui-stock-trend';
        trend.setAttribute('role', 'img');
        trend.hidden = true;
        value.append(output, unit);
        metric.append(trend, value);
        stock.append(label, stockBar, metric);
        footer.append(stock);
      }
    }
  }
  toggle.classList.add('element-ui-trigger');
  toggle.setAttribute('aria-controls', reveal.id = `${body.id}-reveal`);
}


function enablePrototypeRotation(circle) {
  circle.classList.add('rotatable');
  circle.tabIndex = 0;
  circle.setAttribute('role', 'group');
  circle.setAttribute('aria-label', 'Otočný ukazatel. Pro otočení táhněte nebo použijte šipky vlevo a vpravo.');

  let rotation = 0;
  let drag = null;
  const pointerAngle = event => {
    const { left, top, width, height } = circle.getBoundingClientRect();
    return Math.atan2(event.clientY - top - height / 2, event.clientX - left - width / 2) * 180 / Math.PI;
  };
  const rotate = angle => {
    rotation = angle;
    circle.style.rotate = `${angle}deg`;
  };
  circle.addEventListener('pointerdown', event => {
    if (event.button !== 0 || drag) return;
    drag = { id: event.pointerId, offset: rotation - pointerAngle(event) };
    circle.setPointerCapture(event.pointerId);
  });
  circle.addEventListener('pointermove', event => {
    if (drag?.id === event.pointerId) rotate(drag.offset + pointerAngle(event));
  });
  circle.addEventListener('lostpointercapture', event => {
    if (drag?.id === event.pointerId) drag = null;
  });
  circle.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    rotate(rotation + (event.key === 'ArrowLeft' ? -10 : 10));
  });
}

function createSugarStock() {
  const panel = document.createElement('section');
  panel.className = 'oxygen-balance-panel';
  panel.innerHTML = `
    <h3>Zásoba cukrů</h3>
    <div class="oxygen-balance sugar-stock" aria-hidden="true">
      <div class="sugar-stock-liquid"></div>
      <svg class="sugar-stock-wave" viewBox="0 0 240 16" preserveAspectRatio="none">
        <defs>
          <g id="prototype-sugar-wave">
            <path fill="currentColor" d="M0 8 C16 3 25 2 39 7 S59 13 73 8 S94 2 105 7 Q112 11 120 8 V16 H0 Z"/>
            <path fill="none" stroke="#ffadf3" stroke-width="0.75" stroke-linecap="round"
              d="M4 10 Q20 4 32 8 M40 10 Q55 15 70 11 M76 10 Q93 4 102 9"/>
          </g>
        </defs>
        <use href="#prototype-sugar-wave"/>
        <use href="#prototype-sugar-wave" x="120"/>
      </svg>
    </div>`;
  const circle = panel.querySelector('.sugar-stock');
  return {
    panel,
    update(_production, _consumption, capacity, reserve) {
      circle.style.setProperty('--oxygen-level', `${100 * reserve / capacity}%`);
    }
  };
}

function createOxygenBalance(variant) {
  const rectangle = variant === 'rectangle';
  const panel = document.createElement('section');
  panel.className = 'oxygen-balance-panel';
  panel.setAttribute('aria-label', 'Zkušební bilance cukrů');
  panel.innerHTML = `
    <h3>${rectangle ? 'Obdélník' : 'Dělicí čáry'}</h3>
    <div class="oxygen-balance oxygen-balance-lines${rectangle ? ' oxygen-balance-rectangle' : ''}">
      <div class="oxygen-balance-reserve"><abbr title="Zásoba">Z</abbr></div>
      <div class="oxygen-balance-production"><abbr title="Produkce">P</abbr></div>
      <div><abbr title="Spotřeba">S</abbr></div>
    </div>
  `;
  const circle = panel.querySelector('.oxygen-balance');
  if (!rectangle) enablePrototypeRotation(circle);
  const [, productionSection, consumptionSection] = circle.children;
  return {
    panel,
    update(production, consumption, capacity, reserve) {
      circle.style.setProperty('--oxygen-level', `${100 * reserve / capacity}%`);
      productionSection.setAttribute('aria-hidden', String(production <= 0));
      consumptionSection.setAttribute('aria-hidden', String(consumption <= 0));
      productionSection.classList.toggle('stronger-flow', production > consumption);
      consumptionSection.classList.toggle('stronger-flow', consumption > production);
      const smaller = Math.min(production, consumption);
      const larger = Math.max(production, consumption);
      const lineScale = Math.max(capacity, 60 * (production + consumption));
      circle.style.setProperty('--oxygen-smaller-flow', String(60 * smaller / lineScale));
      circle.style.setProperty('--oxygen-larger-flow', String(60 * larger / lineScale));
      circle.classList.toggle('similar-flows', smaller > 0 && smaller >= 0.9 * larger);
      circle.classList.toggle('production-at-bottom', production > consumption);
    }
  };
}

// Static screen-space UI. Camera and tree geometry never participate in layout.
// Original content and controls are moved, so live outputs and handlers survive.
export function createTreeAnnotations({ shell, model, createSeasonControl, setElementHighlight = () => { } }) {
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
  const prototypes = [createSugarStock(), createOxygenBalance('lines'), createOxygenBalance('rectangle')];
  const capacityInput = shell.querySelector('[data-prototype-capacity]');
  model.setSugarCapacity(capacityInput.valueAsNumber);
  const sugarStockOutput = shell.querySelector('[data-prototype-sugar-stock]');
  const stockKg = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 2 });
  const previousStocks = new WeakMap();
  capacityInput.addEventListener('change', () => {
    if (capacityInput.validity.valid && Number.isSafeInteger(capacityInput.valueAsNumber)) {
      model.setSugarCapacity(capacityInput.valueAsNumber);
    }
    capacityInput.value = String(model.sugarCapacity);
  });
  const previousHighlights = new Map();
  function syncHighlights() {
    const activeTags = new Set();
    const allTags = new Set();
    for (const state of linkedWindows.values()) {
      allTags.add(state.tag);
      if (state.chapter === activeChapter && (state.open || state.hovered)) activeTags.add(state.tag);
    }
    for (const tag of allTags) {
      const active = activeTags.has(tag);
      if (previousHighlights.get(tag) === active) continue;
      previousHighlights.set(tag, active);
      setElementHighlight(tag, active);
    }
  }
  let pointerPosition = null;
  function syncWindowHover() {
    let changed = false;
    for (const [panel, state] of linkedWindows) {
      if (state.chapter !== activeChapter) {
        if (state.hovered) {
          panel.classList.remove('is-pointer-over');
          state.hovered = false;
          changed = true;
        }
        continue;
      }
      const inRect = element => {
        const rect = element.getBoundingClientRect();
        return pointerPosition && pointerPosition.x >= rect.left && pointerPosition.x <= rect.right
          && pointerPosition.y >= rect.top && pointerPosition.y <= rect.bottom;
      };
      const reveal = panel.querySelector('.annotation-reveal');
      const hovered = Boolean(pointerPosition && (inRect(panel) || (state.open && reveal && inRect(reveal))));
      if (state.hovered !== hovered) {
        panel.classList.toggle('is-pointer-over', hovered);
        state.hovered = hovered;
        changed = true;
      }
    }
    if (changed) syncHighlights();
  }
  window.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    pointerPosition = { x: event.clientX, y: event.clientY };
    syncWindowHover();
  }, { passive: true });
  window.addEventListener('pointerout', event => {
    if (event.relatedTarget) return;
    pointerPosition = null;
    syncWindowHover();
  });
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
    const userToggle = () => {
      dismissToggleHint();
      expand(!expanded);
      if (expanded && article.dataset.chapter === 'photosynthesis' && matchMedia('(max-width: 700px)').matches) {
        panel.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
      }
    };
    toggle.addEventListener('click', userToggle);
    if (panel.classList.contains('element-ui-flow-window')) {
      panel.querySelector('.element-ui-readout').addEventListener('click', event => {
        if (!event.target.closest('button, input')) userToggle();
      });
    } else if (definition && (definition.viditelnyPrepinac || ['water', 'sugar'].includes(definition.tema))) {
      h.addEventListener('click', userToggle);
    }
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
        label.textContent = value.popisHodnoty;
        metric.append(label);
      }
      const strong = document.createElement('strong');
      const output = document.createElement('output');
      const outputId = value.vystupId || `value-${definition.id}`;
      output.id = article.dataset.chapter === 'prototype' ? `prototype-${outputId}` : outputId;
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
    if (article.dataset.chapter === 'prototype') {
      const list = article.querySelector('.prototype-list');
      list.append(...prototypes.map(prototype => prototype.panel));
      const sugars = oknaPodleKapitol.photosynthesis.find(definition => definition.id === 'cukry');
      if (sugars && !kontrola.neplatnaOkna.has(sugars)) configuredCard(article, sugars);
      continue;
    }
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
      if (node.classList.contains('tree-annotation') || node.classList.contains('chapter-context-guide') || node.classList.contains('transpiration-prompt') || node.classList.contains('photosynthesis-title') || node.classList.contains('scene-chapter-title')) continue;
      if (node.classList.contains('chapter-metrics') && !node.children.length) node.remove();
      else if (mainBody) mainBody.append(node);
    }
    if (article.dataset.chapter === 'photosynthesis') {
      const windows = document.createElement('div');
      windows.className = 'photosynthesis-windows';
      windows.append(...article.querySelectorAll(':scope > .element-ui-okno'));
      article.append(windows);
    }
  }

  const seasonRow = shell.querySelector('.season-btn-row');
  seasonRow.classList.add('season-ring-accessible');
  seasonRow.setAttribute('aria-label', 'Roční období – ovládání prostorového kruhu');
  shell.append(seasonRow);
  shell.querySelector('#sharedSeasons').hidden = true;
  const seasonControl = createSeasonControl();
  const stockPrototypes = document.createElement('div');
  stockPrototypes.className = 'photosynthesis-stock-prototypes';
  stockPrototypes.hidden = true;
  stockPrototypes.setAttribute('role', 'group');
  stockPrototypes.setAttribute('aria-label', 'Kruhové ukazatele zásob');
  stockPrototypes.setAttribute('aria-keyshortcuts', 'T');
  const percentageControls = new Map();
  for (const [id, label, setting] of [
    ['cukry', 'Cukry', 'Podíl automatické produkce cukrů'],
    ['voda', 'Voda', 'Podíl automatické dostupnosti vody'],
  ]) {
    const panel = shell.querySelector(`[data-chapter="photosynthesis"][data-window-id="${id}"]`);
    const barStock = panel.querySelector('.element-ui-stock');
    const stock = barStock.cloneNode(true);
    stock.querySelector('.element-ui-stock-label span').textContent = label;
    const circle = document.createElement('div');
    circle.className = 'oxygen-balance sugar-stock element-ui-stock-circle';
    circle.setAttribute('aria-hidden', 'true');
    const fill = document.createElement('div');
    fill.className = 'sugar-stock-liquid';
    circle.append(fill);
    stock.querySelector('.element-ui-balance-bar').replaceWith(circle);
    stockPrototypes.append(stock);

    const input = document.createElement('input');
    input.type = 'range';
    input.min = '0';
    input.max = '100';
    input.value = '100';
    input.className = 'element-ui-balance-slider photosynthesis-stock-percentage';
    input.hidden = true;
    input.setAttribute('aria-label', setting);
    input.setAttribute('aria-valuetext', '100 %');
    const labelText = barStock.querySelector('.element-ui-stock-label span');
    const stockOutput = barStock.querySelector('[data-stock-source]');
    const unit = barStock.querySelector('.element-ui-unit');
    const trend = barStock.querySelector('.element-ui-stock-trend');
    input.addEventListener('input', () => {
      input.setAttribute('aria-valuetext', `${input.value} %`);
      barStock.style.setProperty('--balance-top-ratio', String(input.valueAsNumber / 100));
      applyStockPercentages();
    });
    barStock.querySelector('.element-ui-balance-bar').append(input);
    percentageControls.set(id, { barStock, input, labelText, stockOutput, unit, trend });
  }
  shell.querySelector('.time-playback-panel').after(stockPrototypes);
  const waterSlider = shell.querySelector('[data-chapter="photosynthesis"][data-window-id="voda"] .element-ui-balance-slider');

  function applyStockPercentages() {
    const enabled = !stockPrototypes.hidden;
    model.sugarProductionFraction = enabled ? percentageControls.get('cukry').input.valueAsNumber / 100 : 1;
    model.automaticWaterFraction = enabled ? percentageControls.get('voda').input.valueAsNumber / 100 : null;
    if (model.ready) model.evaluate(0);
  }

  function setStockPrototypeMode(enabled) {
    if (stockPrototypes.hidden === !enabled) return;
    stockPrototypes.hidden = !enabled;
    waterSlider.hidden = enabled;
    for (const [id, { barStock, input, labelText, stockOutput, unit, trend }] of percentageControls) {
      barStock.classList.toggle('is-percentage', enabled);
      input.hidden = !enabled;
      labelText.textContent = enabled ? (id === 'cukry' ? 'produkce' : 'dostupnost') : 'zásoba';
      unit.textContent = enabled ? '%' : (id === 'cukry' ? 'kg' : 'l');
      if (enabled) {
        trend.hidden = true;
        stockOutput.value = input.value;
        barStock.style.setProperty('--balance-top-ratio', String(input.valueAsNumber / 100));
      }
    }
    applyStockPercentages();
  }

  const smoothedValues = new Map();
  let lastDomUpdate = -Infinity;
  let prevSeasonRowHidden = null;
  let prevProtoSugarText = '';
  const barsByChapter = new Map();
  for (const bar of shell.querySelectorAll('.element-ui-values > .element-ui-balance-bar')) {
    const panel = bar.closest('.element-ui-okno');
    const panelChapter = panel?.dataset.chapter;
    if (!panelChapter) continue;
    let list = barsByChapter.get(panelChapter);
    if (!list) { list = []; barsByChapter.set(panelChapter, list); }
    list.push({
      bar,
      slider: bar.querySelector('input'),
      availabilityOutput: panel.querySelector('.element-ui-availability output'),
      windowId: panel.dataset.windowId,
      balanceKey: `${panelChapter}:${panel.dataset.windowId}`,
      isWater: panel.dataset.windowId === 'voda',
      isLight: panel.dataset.windowId === 'svetlo',
      prevTop: '', prevBottom: '', prevTopZero: null, prevBottomZero: null, prevTopShorter: null,
      prevAvail: '', prevDisabled: null, prevSliderVal: '', prevAria: ''
    });
  }
  const respByChapter = new Map();
  for (const output of shell.querySelectorAll('[data-respiration]')) {
    const panel = output.closest('.element-ui-okno');
    const panelChapter = panel?.dataset.chapter;
    if (!panelChapter) continue;
    let list = respByChapter.get(panelChapter);
    if (!list) { list = []; respByChapter.set(panelChapter, list); }
    list.push({
      output,
      key: output.dataset.respiration,
      cacheKey: `resp:${panelChapter}:${output.dataset.respiration}`,
      prevText: ''
    });
  }
  const seedOutputs = [];
  for (const definition of oknaPodleKapitol.seeds) {
    const output = shell.querySelector(`output[data-stav-obdobi="${definition.id}"]`);
    if (output) seedOutputs.push({ output, stavObdobi: definition.stavObdobi, prevText: '' });
  }
  const stockByChapter = new Map();
  for (const output of shell.querySelectorAll('[data-stock-source]')) {
    const stock = output.closest('.element-ui-stock');
    const panel = output.closest('.element-ui-okno');
    const panelChapter = panel?.dataset.chapter || (output.closest('.photosynthesis-stock-prototypes') ? 'stock-prototypes' : null);
    if (!stock || !panelChapter) continue;
    let list = stockByChapter.get(panelChapter);
    if (!list) { list = []; stockByChapter.set(panelChapter, list); }
    list.push({
      output,
      stock,
      trend: stock.querySelector('.element-ui-stock-trend'),
      percInput: stock.querySelector('.photosynthesis-stock-percentage'),
      isSugar: output.dataset.stockSource === 'cukry',
      valueKey: output.dataset.stockValue,
      maxKey: output.dataset.stockMaximum,
      prevDisplayed: '', prevTrend: null, prevTrendText: '', prevTrendTitle: '',
      prevUnavailable: null, prevRatio: ''
    });
  }

  return {
    get sugarProduction() { return model.totalSugarProduction; },
    toggleStockPrototypes() {
      setStockPrototypeMode(stockPrototypes.hidden);
    },
    closeStockPrototypes() {
      setStockPrototypeMode(false);
    },
    advanceSeason(chapter, playbackDelta) {
      return seasonControl.update(chapter, playbackDelta);
    },
    update(chapter) {
      const now = performance.now();
      const chapterChanged = chapter !== activeChapter;
      activeChapter = chapter;
      if (chapterChanged) {
        syncWindowHover();
        syncHighlights();
      }
      const activeBars = barsByChapter.get(chapter);
      const draggingSlider = activeBars?.some(entry => entry.slider?.matches(':active')) || false;
      if (!chapterChanged && !draggingSlider && now - lastDomUpdate < 50) return;
      const dt = lastDomUpdate > 0 ? (now - lastDomUpdate) / 1000 : 0.05;
      lastDomUpdate = now;
      const sugarProduction = model.totalSugarProduction;
      const sugarConsumption = model.totalSugarConsumption;
      const clamp01 = value => (Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0);
      const balanceValues = windowId => {
        const clean = value => (Number.isFinite(value) && value > 0 ? value : 0);
        if (windowId === 'svetlo') return [clean(model.light) * 100, clean(model.activity) * 100];
        if (windowId === 'voda') return [clean(model.waterInput) * 60, clean(model.waterConsumption) * 60];
        if (windowId === 'kyslik') return [clean(model.oxygenGramsPerMinute), clean(model.respirationOxygen)];
        if (windowId === 'co2') return [clean(model.respirationCO2), clean(model.co2GramsPerMinute)];
        if (windowId === 'cukry') return [clean(sugarProduction), clean(sugarConsumption)];
        return [0, 0];
      };
      if (activeBars) {
        for (const entry of activeBars) {
          const { bar, slider, availabilityOutput, windowId, balanceKey, isWater, isLight } = entry;
          const maxWater = Number(slider?.dataset.scaleMax) || waterAvailabilityMax(model);
          const [rawTop, rawBottom] = balanceValues(windowId);
          const topValue = slider?.matches(':active')
            ? (smoothedValues.set(`${balanceKey}:top`, rawTop), rawTop)
            : vyhladitHodnotu(smoothedValues, `${balanceKey}:top`, rawTop, dt);
          const bottomValue = vyhladitHodnotu(smoothedValues, `${balanceKey}:bottom`, rawBottom, dt);
          const scaleMax = isWater
            ? Math.max(maxWater, model.baseTranspiration * 1.015) * 60
            : isLight ? 100
            : windowId === 'kyslik' ? model.maxOxygenGramsPerMinute
            : windowId === 'co2' ? model.maxCo2GramsPerMinute
            : model.maxGlucoseGramsPerMinute;
          // Match the precision of the readouts: whole percentages, otherwise one decimal.
          const minimumVisible = isLight ? 0.5 : 0.05;
          const topRatio = topValue >= minimumVisible ? clamp01(topValue / scaleMax) : 0;
          const bottomRatio = bottomValue >= minimumVisible ? clamp01(bottomValue / scaleMax) : 0;
          const topRatioStr = String(topRatio);
          const bottomRatioStr = String(bottomRatio);
          if (entry.prevTop !== topRatioStr) {
            entry.prevTop = topRatioStr;
            bar.style.setProperty('--balance-top-ratio', topRatioStr);
          }
          if (entry.prevBottom !== bottomRatioStr) {
            entry.prevBottom = bottomRatioStr;
            bar.style.setProperty('--balance-bottom-ratio', bottomRatioStr);
          }
          const topZero = topRatio === 0;
          if (entry.prevTopZero !== topZero) {
            entry.prevTopZero = topZero;
            bar.classList.toggle('is-top-zero', topZero);
          }
          const bottomZero = bottomRatio === 0;
          if (entry.prevBottomZero !== bottomZero) {
            entry.prevBottomZero = bottomZero;
            bar.classList.toggle('is-bottom-zero', bottomZero);
          }
          const topShorter = topRatio <= bottomRatio;
          if (entry.prevTopShorter !== topShorter) {
            entry.prevTopShorter = topShorter;
            bar.classList.toggle('is-top-shorter', topShorter);
          }

          if (isLight && slider) {
            const lightLevel = clamp01(model.light);
            const percent = Math.round(lightLevel * 100);
            const percentText = String(percent);
            if (availabilityOutput && entry.prevAvail !== percentText) {
              entry.prevAvail = percentText;
              availabilityOutput.textContent = percentText;
            }
            const disabled = !model.ready || model.sunElevation <= 0;
            if (entry.prevDisabled !== disabled) {
              entry.prevDisabled = disabled;
              slider.disabled = disabled;
            }
            if (disabled || !slider.matches(':active')) {
              const sliderVal = String(Math.round(lightLevel * 1000));
              if (entry.prevSliderVal !== sliderVal) {
                entry.prevSliderVal = sliderVal;
                slider.value = sliderVal;
              }
            }
            const ariaText = `${percent} procent`;
            if (entry.prevAria !== ariaText) {
              entry.prevAria = ariaText;
              slider.setAttribute('aria-valuetext', ariaText);
            }
            continue;
          }
          if (slider) {
            const waterLevel = clamp01(model.waterInput / maxWater);
            if (!slider.matches(':active')) {
              const sliderVal = String(Math.round(waterLevel * 1000));
              if (entry.prevSliderVal !== sliderVal) {
                entry.prevSliderVal = sliderVal;
                slider.value = sliderVal;
              }
            }
            const displayed = Number.isFinite(model.waterInput) ? (model.waterInput * 60).toLocaleString('cs-CZ', { maximumFractionDigits: 1, minimumFractionDigits: 1 }) : '—';
            if (availabilityOutput && entry.prevAvail !== displayed) {
              entry.prevAvail = displayed;
              availabilityOutput.textContent = displayed;
            }
            const ariaText = `${displayed} litrů za hodinu`;
            if (entry.prevAria !== ariaText) {
              entry.prevAria = ariaText;
              slider.setAttribute('aria-valuetext', ariaText);
            }
            const disabled = !model.ready;
            if (entry.prevDisabled !== disabled) {
              entry.prevDisabled = disabled;
              slider.disabled = disabled;
            }
          }
        }
      }
      const activeResp = respByChapter.get(chapter);
      if (activeResp) {
        for (const entry of activeResp) {
          const raw = entry.key === 'respirationSugar' ? sugarConsumption : model[entry.key];
          const value = vyhladitHodnotu(smoothedValues, entry.cacheKey, raw, dt);
          const text = model.ready && Number.isFinite(value) ? value.toLocaleString('cs-CZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : '—';
          if (entry.prevText !== text) {
            entry.prevText = text;
            entry.output.textContent = text;
          }
        }
      }
      if (chapter === 'seeds') {
        for (const entry of seedOutputs) {
          const text = entry.stavObdobi[model.season] || '—';
          if (entry.prevText !== text) {
            entry.prevText = text;
            entry.output.textContent = text;
          }
        }
      }
      const seasonHidden = chapter === 'intro';
      if (prevSeasonRowHidden !== seasonHidden) {
        prevSeasonRowHidden = seasonHidden;
        seasonRow.hidden = seasonHidden;
      }
      if (chapter === 'intro' || !model.ready) return;
      const stockGroups = [stockByChapter.get(chapter)];
      if (!stockPrototypes.hidden) stockGroups.push(stockByChapter.get('stock-prototypes'));
      for (const activeStocks of stockGroups) {
        if (!activeStocks) continue;
        for (const entry of activeStocks) {
          const { output, stock, trend, percInput, isSugar, valueKey, maxKey } = entry;
          if (stock.classList.contains('is-percentage')) {
            const val = percInput.value;
            if (entry.prevDisplayed !== val) {
              entry.prevDisplayed = val;
              output.value = val;
            }
            continue;
          }
          const value = isSugar ? model.sugarReserve / 1000 : model[valueKey];
          const maximum = isSugar ? model.sugarCapacity / 1000 : model[maxKey];
          const available = Number.isFinite(value) && Number.isFinite(maximum) && maximum > 0;
          const displayed = available ? stockNumber.format(value) : '—';
          if (entry.prevDisplayed !== displayed && output.value !== displayed) {
            entry.prevDisplayed = displayed;
            output.value = displayed;
          }
          const previous = previousStocks.get(output);
          if (!available || previous === undefined) {
            if (entry.prevTrend !== true) {
              entry.prevTrend = true;
              trend.hidden = true;
            }
          } else if (value !== previous) {
            const growing = value > previous;
            const trendText = growing ? '→' : '←';
            const trendTitle = growing ? 'Zásoba roste' : 'Zásoba klesá';
            if (entry.prevTrendText !== trendText) {
              entry.prevTrendText = trendText;
              trend.textContent = trendText;
            }
            if (entry.prevTrendTitle !== trendTitle) {
              entry.prevTrendTitle = trendTitle;
              trend.title = trendTitle;
              trend.setAttribute('aria-label', trendTitle);
            }
            if (entry.prevTrend !== false) {
              entry.prevTrend = false;
              trend.hidden = false;
            }
          }
          previousStocks.set(output, available ? value : undefined);
          const unavailable = !available;
          if (entry.prevUnavailable !== unavailable) {
            entry.prevUnavailable = unavailable;
            stock.classList.toggle('is-unavailable', unavailable);
          }
          const ratioStr = String(available ? clamp01(value / maximum) : 0);
          if (entry.prevRatio !== ratioStr) {
            entry.prevRatio = ratioStr;
            stock.style.setProperty('--balance-top-ratio', ratioStr);
          }
        }
      }
      if (chapter !== 'prototype') return;
      const text = `${stockKg.format(model.sugarReserve / 1000)} kg`;
      if (prevProtoSugarText !== text && sugarStockOutput.value !== text) {
        prevProtoSugarText = text;
        sugarStockOutput.value = text;
      }
      for (const prototype of prototypes) {
        prototype.update(sugarProduction, sugarConsumption, model.sugarCapacity, model.sugarReserve);
      }
    }
  };
}
