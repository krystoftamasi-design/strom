// Filter original controls without replacing elements or their event listeners.
(() => {
  const panel = document.getElementById('controlsPanel');
  const content = panel.querySelector('.panel-content');
  const heading = panel.querySelector('.panel-header h2');
  const nav = document.querySelector('.settings-categories');
  const userSelectors = {
    general: '[data-season], #sliderSeason, #chkLeaves, #chkTrunk, [data-cam], [data-bg], #sliderLightRot, #sliderSunElevation',
    photosynthesis: '#chkSapFlow, #sliderTreeWater',
    roots: '#chkRoots, #chkGround, #chkQuickDrip, #chkDripLine, #chkDripRain, [data-cam]'
  };
  const sections = [...content.querySelectorAll(':scope > [data-settings-category]')];
  for (const section of sections) {
    const selector = userSelectors[section.dataset.settingsCategory];
    for (const row of section.children) {
      if (!row.classList.contains('section-title')) row.dataset.audience = row.matches(selector) || row.querySelector(selector) ? 'user' : 'sett';
    }
  }
  const status = document.createElement('div');
  status.className = 'settings-save-status';
  status.setAttribute('role', 'status');
  status.textContent = 'Sett se automaticky ukládá v tomto prohlížeči.';
  panel.querySelector('.panel-header').after(status);
  function select(category, audience, label, open = true) {
    if (category !== 'photosynthesis') {
      const waterLine = document.getElementById('chkSapFlow');
      if (waterLine?.checked) waterLine.click();
    }
    if (category !== 'roots') {
      const dripLine = document.getElementById('chkDripLine');
      if (dripLine?.checked) dripLine.click();
    }
    if (category === 'photosynthesis') {
      const waterLine = document.getElementById('chkSapFlow');
      if (waterLine && !waterLine.checked) waterLine.click();
    }
    if (category === 'roots') {
      const dripLine = document.getElementById('chkDripLine');
      if (dripLine && !dripLine.checked) dripLine.click();
    }
    for (const section of sections) {
      const children = [...section.children];
      children.filter(row => row.dataset.audience).forEach(row => { row.hidden = audience !== 'all' && row.dataset.audience !== audience; });
      children.forEach((row, index) => {
        if (!row.classList.contains('section-title')) return;
        const next = children.findIndex((child, i) => i > index && child.classList.contains('section-title'));
        row.hidden = !children.slice(index + 1, next < 0 ? undefined : next).some(child => child.dataset.audience && !child.hidden);
      });
      section.hidden = section.dataset.settingsCategory !== category || !children.some(row => row.dataset.audience && !row.hidden);
    }
    nav.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category && button.dataset.audience === audience)));
    heading.textContent = audience === 'all' ? label : `${label} · ${audience === 'user' ? 'User' : 'Sett'}`;
    status.hidden = audience !== 'sett';
    content.scrollTop = 0;
    if (open) {
      panel.classList.remove('collapsed');
      document.getElementById('btnTogglePanel')?.classList.add('active');
    }
  }
  // Replace only navigation buttons; all actual controls remain in place.
  for (const old of [...nav.children]) {
    const category = old.dataset.category;
    const label = old.querySelector('.settings-category-title')?.textContent || old.textContent;
    const group = document.createElement('div');
    group.className = 'settings-category-group';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', label);
    const title = document.createElement('div');
    title.className = 'settings-category-title';
    title.textContent = label;
    const pair = document.createElement('div');
    pair.className = 'settings-category-pair';
    const audiences = category === 'general' ? ['all'] : ['user', 'sett'];
    for (const audience of audiences) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'settings-category';
      button.dataset.category = category;
      button.dataset.audience = audience;
      button.textContent = audience === 'all' ? label : audience === 'user' ? 'User' : 'Sett';
      button.setAttribute('aria-label', `${label} · ${button.textContent}`);
      button.setAttribute('aria-controls', content.id);
      button.addEventListener('click', () => select(category, audience, label));
      pair.append(button);
    }
    group.append(title, pair);
    old.replaceWith(group);
  }
  select('general', 'all', 'Obecné', false);

  const storageKey = 'strom.settings.v1';
  let ready = false, restoring = false;
  const isSetting = element => element.closest('[data-audience="sett"]');
  const choices = () => [...content.querySelectorAll('[data-toon], [data-alphamode], [data-leaf-type], #btnModelOptimized, #btnModelFull')].filter(isSetting);
  const key = button => {
    const attribute = ['data-toon', 'data-alphamode', 'data-leaf-type'].find(name => button.hasAttribute(name));
    return attribute ? `${attribute}:${button.getAttribute(attribute)}` : button.id;
  };
  function save() {
    if (!ready || restoring) return;
    const inputs = {};
    content.querySelectorAll('input[id]').forEach(input => {
      if (isSetting(input)) inputs[input.id] = input.type === 'checkbox' ? input.checked : input.value;
    });
    try {
      localStorage.setItem(storageKey, JSON.stringify({inputs, choices: choices().filter(b => b.classList.contains('active') || b.getAttribute('aria-pressed') === 'true').map(key)}));
      status.textContent = 'Sett uloženo v tomto prohlížeči.';
    } catch { status.textContent = 'Prohlížeč nepovolil uložení Sett.'; }
  }
  content.addEventListener('input', save);
  content.addEventListener('change', save);
  content.addEventListener('click', event => { if (event.target.closest('button') && isSetting(event.target)) save(); });
  function restore() {
    if (ready) return;
    ready = true;
    restoring = true;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved?.inputs && typeof saved.inputs === 'object') {
        for (const [id, value] of Object.entries(saved.inputs)) {
          const input = document.getElementById(id);
          if (!input?.matches('input') || !content.contains(input) || !isSetting(input)) continue;
          if (input.type === 'checkbox') {
            if (typeof value !== 'boolean') continue;
            input.checked = value;
            input.dispatchEvent(new Event('change', {bubbles: true}));
          } else {
            if (!Number.isFinite(Number(value))) continue;
            input.value = value;
            input.dispatchEvent(new Event('input', {bubbles: true}));
          }
        }
        for (const button of choices()) if (Array.isArray(saved.choices) && saved.choices.includes(key(button)) && !button.classList.contains('active')) button.click();
        status.textContent = 'Uložené Sett obnoveno v tomto prohlížeči.';
      }
    } catch { status.textContent = 'Uložené Sett nelze načíst. Nové změny se zkusí uložit.'; }
    finally { restoring = false; }
  }
  function waitForModel() {
    const loader = document.getElementById('loader');
    if (!loader || loader.classList.contains('hidden')) return restore();
    const observer = new MutationObserver(() => {
      if (loader.classList.contains('hidden')) { observer.disconnect(); restore(); }
    });
    observer.observe(loader, {attributes: true, attributeFilter: ['class']});
  }
  if (window.treeControlsReady) waitForModel();
  else window.addEventListener('tree-controls-ready', waitForModel, {once: true});
})();
