import { oknaPodleKapitol, kontextoveTexty, pruvodceTranspiraci } from './element_ui_okna_obsah.js?v=adjustable-value-1';
import { veliciny, vstupyVzorce, ohlasitChybuOken, vyhladitHodnotu } from './element_ui_okna_veliciny.js?v=light-consumption-1';
import { zkontrolovatOkna } from './element_ui_okna_kontrola.js?v=seeds-1';
import { createSugarStockHistory } from './sugar_stock_history.js?v=aligned-reference-1';
import { simulateAnnualSugarStock } from '../ekologie/rocni_zasoba_cukru.js?v=annual-stock-1';

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

function createBalanceBar({ top, bottom, editable = false }) {
  const bar = document.createElement('div');
  bar.className = 'element-ui-balance-bar';
  if (editable) {
    bar.classList.add('has-editable-value');
    bar.style.setProperty('--balance-limit-ratio', '1');
  }
  const makeLane = (side, letter, openEnd) => {
    const lane = document.createElement('div');
    lane.className = `element-ui-balance-lane element-ui-balance-lane-${side}`;
    const rail = document.createElement('span');
    rail.className = `element-ui-balance-rail element-ui-balance-rail-${side}`;
    rail.setAttribute('aria-hidden', 'true');
    const railStart = document.createElement('span');
    railStart.className = 'element-ui-balance-rail-start';
    const railMid = document.createElement('span');
    railMid.className = 'element-ui-balance-rail-mid';
    rail.append(railStart, railMid);
    if (!openEnd) {
      const railEnd = document.createElement('span');
      railEnd.className = 'element-ui-balance-rail-end';
      rail.append(railEnd);
    }
    const markers = document.createElement('span');
    markers.className = 'element-ui-balance-markers';
    markers.setAttribute('aria-hidden', 'true');
    if (letter !== undefined) {
      const marker = document.createElement('span');
      marker.className = `element-ui-balance-marker element-ui-balance-marker-${side}`;
      const fill = document.createElement('span');
      fill.className = 'element-ui-balance-marker-fill';
      const end = document.createElement('span');
      end.className = 'element-ui-balance-marker-end';
      const cap = document.createElement('span');
      cap.className = 'element-ui-balance-marker-cap';
      cap.textContent = letter;
      marker.append(fill, end, cap);
      markers.append(marker);
    }
    lane.append(rail, markers);
    if (openEnd) {
      const limit = document.createElement('span');
      limit.className = 'element-ui-balance-limit';
      limit.setAttribute('aria-hidden', 'true');
      const limitCap = document.createElement('span');
      limitCap.className = 'element-ui-balance-limit-cap';
      limitCap.textContent = '−';
      limit.append(limitCap);
      lane.append(limit);
    }
    return lane;
  };
  bar.append(makeLane('top', top, editable), makeLane('bottom', bottom, false));
  return bar;
}

const stockNumber = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 });
const sliderIsActive = ':active, [data-touch-drag]';

function enableTouchDrag(slider, handle) {
  let pointerId = null;
  let trackLeft = 0;
  let trackSpan = 1;
  let thumbHalf = 0;
  const update = event => {
    const fraction = (event.clientX - trackLeft - thumbHalf) / trackSpan;
    const previousValue = slider.value;
    slider.valueAsNumber = Math.min(1, Math.max(0, fraction)) * Number(slider.max);
    if (slider.value !== previousValue) slider.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const endDrag = event => {
    if (event.pointerId !== pointerId) return;
    if (slider.hasPointerCapture?.(pointerId)) slider.releasePointerCapture(pointerId);
    pointerId = null;
    delete slider.dataset.touchDrag;
  };
  slider.addEventListener('pointerdown', event => {
    if (event.pointerType === 'mouse' || pointerId !== null || slider.disabled) return;
    event.preventDefault();
    const track = slider.getBoundingClientRect();
    const thumb = handle.offsetWidth;
    trackLeft = track.left;
    thumbHalf = thumb / 2;
    trackSpan = Math.max(1, track.width - thumb);
    pointerId = event.pointerId;
    slider.dataset.touchDrag = '';
    slider.setPointerCapture(pointerId);
    update(event);
  });
  slider.addEventListener('pointermove', event => {
    if (event.pointerId === pointerId) update(event);
  });
  slider.addEventListener('pointerup', endDrag);
  slider.addEventListener('pointercancel', endDrag);
  slider.addEventListener('lostpointercapture', endDrag);
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
  const isFlowChapter = panel.dataset.chapter === 'photosynthesis';
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
    const isLight = definition.id === 'svetlo';
    const isWater = definition.id === 'voda';
    const isAvailabilityWindow = isLight || isWater;
    const isCo2 = definition.id === 'co2';
    const hasStock = Boolean(definition.zasoba);
    const topMetric = isAvailabilityWindow ? availability : isCo2 ? unavailable : current;
    const bottomMetric = isAvailabilityWindow || isCo2 ? current : unavailable;

    if (current) {
      const bar = createBalanceBar({
        top: isAvailabilityWindow ? '' : 'p',
        bottom: 's',
        editable: Boolean(definition.upravitelnaHodnota),
      });
      const topLane = bar.querySelector('.element-ui-balance-lane-top');

      if (definition.upravitelnaHodnota === 'dostupnost') {
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0'; slider.max = '1000'; slider.step = '1'; slider.value = slider.max;
        slider.className = 'element-ui-flow-slider element-ui-balance-slider element-ui-editable-value';
        slider.setAttribute('aria-label', 'Dostupnost světla');
        slider.addEventListener('click', event => event.stopPropagation());
        slider.addEventListener('input', () => {
          const fraction = slider.valueAsNumber / 1000;
          bar.style.setProperty('--balance-limit-ratio', String(fraction));
          model.setLightAvailability(fraction);
        });
        topLane.append(slider);
        enableTouchDrag(slider, topLane.querySelector('.element-ui-balance-limit'));
      }

      if (definition.upravitelnaHodnota === 'strop') {
        const limitSlider = document.createElement('input');
        limitSlider.type = 'range';
        limitSlider.min = '0'; limitSlider.max = '100'; limitSlider.step = '1'; limitSlider.value = '100';
        limitSlider.className = 'element-ui-balance-slider element-ui-limit-slider element-ui-editable-value';
        limitSlider.dataset.limitTarget = definition.id;
        const limitLabel = definition.id === 'cukry' ? 'Omezení produkce' : 'Omezení dostupnosti';
        limitSlider.setAttribute('aria-label', `${limitLabel} – ${definition.nadpis}`);
        limitSlider.setAttribute('aria-valuetext', '100 %');
        limitSlider.title = `${limitLabel}: 100 %`;
        limitSlider.addEventListener('click', event => event.stopPropagation());
        limitSlider.addEventListener('input', () => {
          const percent = limitSlider.valueAsNumber;
          const fraction = percent / 100;
          bar.style.setProperty('--balance-limit-ratio', String(fraction));
          limitSlider.setAttribute('aria-valuetext', `${percent} %`);
          limitSlider.title = `${limitLabel}: ${percent} %`;
          if (definition.id === 'cukry') {
            model.sugarProductionCap = fraction;
          } else if (definition.id === 'voda') {
            if (percent >= 100) {
              model.manualWaterInput = false;
              model.waterAvailabilityCap = 1;
            } else {
              model.waterAvailabilityCap = fraction;
            }
          }
          if (model.ready) model.evaluate(0);
        });
        topLane.append(limitSlider);
        enableTouchDrag(limitSlider, topLane.querySelector('.element-ui-balance-limit'));
      }

      footer.replaceChildren(topMetric, bar, bottomMetric);
      panel.classList.add('element-ui-flow-window');
      if (hasStock) {
        const { zdroj = 'model', hodnota, maximum, jednotka } = definition.zasoba;
        const stock = document.createElement('div');
        stock.className = 'element-ui-stock';
        const label = document.createElement('div');
        label.className = 'chapter-metric element-ui-stock-label';
        const labelText = document.createElement('span');
        labelText.textContent = 'zásoba';
        label.append(labelText);
        const dial = document.createElement(zdroj === 'cukry' ? 'button' : 'div');
        dial.className = 'element-ui-stock-dial';
        if (zdroj === 'cukry') {
          dial.type = 'button';
          dial.setAttribute('aria-label', 'Roční graf zásoby cukrů');
          dial.setAttribute('aria-keyshortcuts', 'T');
          dial.setAttribute('aria-pressed', 'false');
          dial.title = 'Zobrazit roční graf zásoby cukrů pod ovládáním času (T)';
        }
        const dialClip = document.createElement('span');
        dialClip.className = 'element-ui-stock-dial-clip';
        dialClip.setAttribute('aria-hidden', 'true');
        const dialFill = document.createElement('span');
        dialFill.className = 'element-ui-stock-dial-fill';
        dialClip.append(dialFill);
        const dialRing = document.createElement('span');
        dialRing.className = 'element-ui-stock-dial-ring';
        dialRing.setAttribute('aria-hidden', 'true');
        const trend = document.createElement('span');
        trend.className = 'element-ui-stock-trend';
        trend.setAttribute('role', 'img');
        trend.hidden = true;
        dial.append(dialClip, dialRing, trend);
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
        value.append(output, unit);
        metric.append(value);
        stock.append(label, dial, metric);
        footer.append(stock);
      }
    }
  }
  toggle.classList.add('element-ui-trigger');
  toggle.setAttribute('aria-controls', reveal.id = `${body.id}-reveal`);
}


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
  const previousStocks = new WeakMap();
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
  let hoverFrame = 0;
  window.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    pointerPosition = { x: event.clientX, y: event.clientY };
    if (!hoverFrame) {
      hoverFrame = requestAnimationFrame(() => {
        hoverFrame = 0;
        syncWindowHover();
      });
    }
  }, { passive: true });
  window.addEventListener('pointerout', event => {
    if (event.relatedTarget) return;
    pointerPosition = null;
    if (hoverFrame) {
      cancelAnimationFrame(hoverFrame);
      hoverFrame = 0;
    }
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
    const flowBar = article.dataset.chapter === 'photosynthesis'
      && panel.querySelector('.element-ui-balance-bar');
    if (flowBar) {
      const bottomMetric = flowBar.nextElementSibling;
      // Reserve the label below the bar so the explanation ends above it.
      const resizeDetail = new ResizeObserver(([entry]) => {
        reveal.style.setProperty('--flow-metric-below-bar', `${entry.borderBoxSize[0].blockSize}px`);
      });
      resizeDetail.observe(bottomMetric, { box: 'border-box' });
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
      output.id = outputId;
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

  const smoothedValues = new Map();
  let lastDomUpdate = -Infinity;
  let prevSeasonRowHidden = null;
  const barsByChapter = new Map();
  for (const bar of shell.querySelectorAll('.element-ui-values > .element-ui-balance-bar')) {
    const panel = bar.closest('.element-ui-okno');
    const panelChapter = panel?.dataset.chapter;
    if (!panelChapter) continue;
    let list = barsByChapter.get(panelChapter);
    if (!list) { list = []; barsByChapter.set(panelChapter, list); }
    list.push({
      bar,
      slider: bar.querySelector('.element-ui-flow-slider'),
      limitSlider: bar.querySelector('.element-ui-limit-slider'),
      availabilityOutput: panel.querySelector('.element-ui-availability output'),
      windowId: panel.dataset.windowId,
      balanceKey: `${panelChapter}:${panel.dataset.windowId}`,
      isWater: panel.dataset.windowId === 'voda',
      isLight: panel.dataset.windowId === 'svetlo',
      prevTop: '', prevBottom: '', prevTopZero: null, prevBottomZero: null,
      prevAvail: '', prevDisabled: null, prevSliderVal: '', prevAria: '',
      prevLimit: '', prevLimitDisabled: null, prevLimitVal: '', prevLimitAria: ''
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
  const sugarHistory = createSugarStockHistory();
  const sugarDial = shell.querySelector('button.element-ui-stock-dial');
  const playback = shell.querySelector('.time-playback-panel');
  let renderSugarHistory;
  if (sugarDial && playback) {
    const chart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chart.classList.add('element-ui-stock-history');
    chart.setAttribute('viewBox', '0 0 100 100');
    chart.setAttribute('role', 'img');
    chart.setAttribute('aria-label', 'Roční průběh zásoby cukrů od ledna nahoře po směru hodin');
    chart.setAttribute('hidden', '');
    chart.innerHTML = `
      <circle cx="50" cy="50" r="43" class="stock-history-capacity"/>
      <circle cx="50" cy="50" r="14" class="stock-history-zero"/>
      <path class="stock-history-ticks" d="M50 3v7 M97 50h-5 M50 97v-5 M3 50h5"/>
      <g class="stock-history-reference">
        <path opacity=".38"/><path opacity=".26"/><path opacity=".16"/><path opacity=".08"/>
      </g>
      <path class="stock-history-line"/>
      <line class="stock-history-needle"/>
      <circle class="stock-history-dot" r="4"/>
    `;
    playback.append(chart);
    const referencePaths = chart.querySelectorAll('.stock-history-reference path');
    const line = chart.querySelector('.stock-history-line');
    const needle = chart.querySelector('.stock-history-needle');
    const dot = chart.querySelector('.stock-history-dot');
    let reference = [];
    let referenceKey;
    renderSugarHistory = () => {
      const { height, woodVolume, crownArea, sugarCapacity } = model;
      const key = [height, woodVolume, crownArea, sugarCapacity].join('/');
      if (model.ready && referenceKey !== key) {
        reference = simulateAnnualSugarStock(model, sugarCapacity);
        referenceKey = key;
      }
      const geometry = sugarHistory.geometry(sugarCapacity, reference);
      line.setAttribute('d', geometry?.path ?? '');
      referencePaths.forEach((path, index) => path.setAttribute('d', geometry?.referencePaths[index] ?? ''));
      needle.style.visibility = geometry ? 'visible' : 'hidden';
      dot.style.visibility = needle.style.visibility;
      if (!geometry) return;
      ['x1', 'y1', 'x2', 'y2'].forEach((key, index) => needle.setAttribute(key, geometry.needle[index]));
      dot.setAttribute('cx', geometry.dot[0]);
      dot.setAttribute('cy', geometry.dot[1]);
    };
    sugarDial.addEventListener('click', () => {
      const showChart = sugarDial.getAttribute('aria-pressed') === 'false';
      sugarDial.setAttribute('aria-pressed', String(showChart));
      chart.toggleAttribute('hidden', !showChart);
      sugarDial.title = showChart
        ? 'Skrýt roční graf zásoby cukrů (T)'
        : 'Zobrazit roční graf zásoby cukrů pod ovládáním času (T)';
      if (showChart) renderSugarHistory();
    });
    document.addEventListener('keydown', event => {
      if (event.key.toLowerCase() !== 't' || event.defaultPrevented || event.repeat ||
        event.ctrlKey || event.altKey || event.metaKey || event.isComposing ||
        activeChapter !== 'photosynthesis' ||
        event.target.closest?.('input, textarea, select, [contenteditable]')) return;
      event.preventDefault();
      sugarDial.click();
    });
    document.getElementById('btnTimeReset')?.addEventListener('click', () => sugarHistory.clear());
  }
  for (const output of shell.querySelectorAll('[data-stock-source]')) {
    const stock = output.closest('.element-ui-stock');
    const panel = output.closest('.element-ui-okno');
    const panelChapter = panel?.dataset.chapter;
    if (!stock || !panelChapter) continue;
    let list = stockByChapter.get(panelChapter);
    if (!list) { list = []; stockByChapter.set(panelChapter, list); }
    list.push({
      output,
      stock,
      trend: stock.querySelector('.element-ui-stock-trend'),
      isSugar: output.dataset.stockSource === 'cukry',
      valueKey: output.dataset.stockValue,
      maxKey: output.dataset.stockMaximum,
      prevDisplayed: '', prevTrend: null, prevTrendDir: '', prevTrendTitle: '',
      prevUnavailable: null, prevRatio: ''
    });
  }

  return {
    get sugarProduction() { return model.totalSugarProduction; },
    advanceSeason(chapter, playbackDelta) {
      return seasonControl.update(chapter, playbackDelta);
    },
    update(chapter, continuous) {
      if (sugarDial && chapter !== 'intro') {
        sugarHistory.sample(model.seasonPosition, model.sugarReserve, continuous);
      }
      const now = performance.now();
      const chapterChanged = chapter !== activeChapter;
      activeChapter = chapter;
      if (chapterChanged) {
        syncWindowHover();
        syncHighlights();
      }
      const activeBars = barsByChapter.get(chapter);
      const draggingSlider = activeBars?.some(entry =>
        entry.slider?.matches(sliderIsActive) || entry.limitSlider?.matches(sliderIsActive)) || false;
      if (!chapterChanged && !draggingSlider && now - lastDomUpdate < 50) return;
      if (chapter === 'photosynthesis' && sugarDial?.getAttribute('aria-pressed') === 'true') {
        renderSugarHistory?.();
      }
      const dt = lastDomUpdate > 0 ? (now - lastDomUpdate) / 1000 : 0.05;
      lastDomUpdate = now;
      const sugarProduction = model.totalSugarProduction;
      const sugarConsumption = model.totalSugarConsumption;
      const clamp01 = value => (Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0);
      const balanceValues = windowId => {
        const clean = value => (Number.isFinite(value) && value > 0 ? value : 0);
        if (windowId === 'svetlo') return [clean(model.light) * 100, clean(model.lightConsumption) * 100];
        if (windowId === 'voda') return [clean(model.waterInput) * 60, clean(model.waterConsumption) * 60];
        if (windowId === 'kyslik') return [clean(model.oxygenGramsPerMinute), clean(model.respirationOxygen)];
        if (windowId === 'co2') return [clean(model.respirationCO2), clean(model.co2GramsPerMinute)];
        if (windowId === 'cukry') return [clean(sugarProduction), clean(sugarConsumption)];
        return [0, 0];
      };
      if (activeBars) {
        for (const entry of activeBars) {
          const { bar, slider, limitSlider, availabilityOutput, windowId, balanceKey, isWater, isLight } = entry;
          const maxWater = waterAvailabilityMax(model);
          const [rawTop, rawBottom] = balanceValues(windowId);
          const activelyAdjusted = Boolean(slider?.matches(sliderIsActive) || limitSlider?.matches(sliderIsActive));
          const topValue = activelyAdjusted
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
          const visibleBottom = isLight ? Math.min(bottomValue, topValue) : bottomValue;
          const bottomRatio = visibleBottom >= minimumVisible ? clamp01(visibleBottom / scaleMax) : 0;
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

          if (limitSlider) {
            const disabled = !model.ready;
            if (entry.prevLimitDisabled !== disabled) {
              entry.prevLimitDisabled = disabled;
              limitSlider.disabled = disabled;
            }
            if (!limitSlider.matches(sliderIsActive)) {
              const fraction = windowId === 'cukry'
                ? clamp01(model.sugarProductionCap)
                : clamp01(model.waterAvailabilityCap);
              const percent = Math.round(fraction * 100);
              const limitRatioStr = String(percent / 100);
              if (entry.prevLimit !== limitRatioStr) {
                entry.prevLimit = limitRatioStr;
                bar.style.setProperty('--balance-limit-ratio', limitRatioStr);
              }
              const limitVal = String(percent);
              if (entry.prevLimitVal !== limitVal) {
                entry.prevLimitVal = limitVal;
                limitSlider.value = limitVal;
              }
              const ariaText = `${percent} %`;
              if (entry.prevLimitAria !== ariaText) {
                entry.prevLimitAria = ariaText;
                limitSlider.setAttribute('aria-valuetext', ariaText);
                const limitLabel = windowId === 'cukry' ? 'Omezení produkce' : 'Omezení dostupnosti';
                limitSlider.title = `${limitLabel}: ${ariaText}`;
              }
            }
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
            const lightSetting = clamp01(model.manualLightAvailability ?? 1);
            if (!slider.matches(sliderIsActive)) {
              bar.style.setProperty('--balance-limit-ratio', String(lightSetting));
              const sliderVal = String(Math.round(lightSetting * 1000));
              if (entry.prevSliderVal !== sliderVal) {
                entry.prevSliderVal = sliderVal;
                slider.value = sliderVal;
              }
            }
            const ariaText = `${Math.round(lightSetting * 100)} procent`;
            if (entry.prevAria !== ariaText) {
              entry.prevAria = ariaText;
              slider.setAttribute('aria-valuetext', ariaText);
            }
            continue;
          }
          if (isWater && availabilityOutput) {
            const displayed = Number.isFinite(model.waterInput) ? (model.waterInput * 60).toLocaleString('cs-CZ', { maximumFractionDigits: 1, minimumFractionDigits: 1 }) : '—';
            if (entry.prevAvail !== displayed) {
              entry.prevAvail = displayed;
              availabilityOutput.textContent = displayed;
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
      const activeStocks = stockByChapter.get(chapter);
      if (activeStocks) {
        for (const entry of activeStocks) {
          const { output, stock, trend, isSugar, valueKey, maxKey } = entry;
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
            previousStocks.set(output, available ? { value, rate: 0 } : undefined);
          } else {
            const instRate = dt > 0 ? (value - previous.value) / dt : 0;
            const alpha = 1 - Math.exp(-Math.min(dt, 0.5) / 3.0);
            const rate = previous.rate + alpha * (instRate - previous.rate);
            previousStocks.set(output, { value, rate });
            const deadband = maximum * 0.0002;
            if (Math.abs(rate) > deadband) {
              const growing = rate > 0;
              const trendDir = growing ? 'up' : 'down';
              const trendTitle = growing ? 'Zásoba roste' : 'Zásoba klesá';
              if (entry.prevTrendDir !== trendDir) {
                entry.prevTrendDir = trendDir;
                trend.dataset.direction = trendDir;
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
          }
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
    }
  };
}
