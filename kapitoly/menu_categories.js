// Category navigation for the controls panel. Existing inputs stay in place,
// so the main viewer event listeners keep working.
(() => {
  const panel = document.getElementById('controlsPanel');
  if (!panel) return;
  const content = panel.querySelector('.panel-content');
  const heading = panel.querySelector('.panel-header h2');
  const sections = [...content.querySelectorAll(':scope > .control-box')];
  const containingSection = id => document.getElementById(id)?.closest('.control-box');

  sections.forEach(section => { section.dataset.settingsCategory = 'general'; });
  containingSection('chkSapFlow')?.setAttribute('data-settings-category', 'photosynthesis');
  containingSection('chkDripLine')?.setAttribute('data-settings-category', 'roots');

  const rootSettings = document.createElement('div');
  rootSettings.className = 'control-box';
  rootSettings.dataset.settingsCategory = 'roots';
  const rootTitle = document.createElement('div');
  rootTitle.className = 'section-title';
  rootTitle.textContent = '🌿 Kořeny & půda';
  rootSettings.append(rootTitle);
  ['chkRoots', 'chkGround', 'chkQuickDrip'].forEach(id => {
    const row = document.getElementById(id)?.closest('.toggle-row');
    if (row) rootSettings.append(row);
  });
  const rootCamera = content.querySelector('[data-cam="roots"]');
  if (rootCamera) rootSettings.append(rootCamera);
  content.prepend(rootSettings);

  const allSections = [...content.querySelectorAll(':scope > .control-box')];
  const audienceIds = {
    photosynthesis: new Set(['chkSapFlow']),
    roots: new Set(['chkRoots', 'chkGround', 'chkQuickDrip', 'chkDripLine', 'chkDripRain'])
  };
  allSections.forEach(section => {
    const category = section.dataset.settingsCategory;
    if (category === 'general') return;
    const userIds = audienceIds[category] || new Set();
    section.querySelectorAll('input[id], button[id], [data-cam]').forEach(control => {
      const row = control.closest('.toggle-row, .slider-group, .btn-grid, .control-box') || control;
      if (row.parentElement === section) row.dataset.settingsAudience = userIds.has(control.id) || control.matches('[data-cam]') ? 'user' : 'sett';
    });
    section.querySelectorAll(':scope > *:not(.section-title)').forEach(row => {
      if (!row.dataset.settingsAudience) row.dataset.settingsAudience = 'sett';
    });
  });

  const categories = [['general', 'Obecné'], ['photosynthesis', 'Fotosyntéza'], ['roots', 'Kořeny']];
  content.id = 'settingsCategoryContent';
  const navigation = document.createElement('nav');
  navigation.className = 'settings-categories';
  navigation.setAttribute('aria-label', 'Kategorie nastavení');

  function setSectionRows(section, audience) {
    const rows = [...section.children];
    rows.forEach(row => {
      if (!row.dataset.settingsAudience) return;
      row.hidden = audience !== 'all' && row.dataset.settingsAudience !== audience;
    });
    rows.forEach((row, index) => {
      if (!row.classList.contains('section-title')) return;
      const nextTitle = rows.findIndex((child, i) => i > index && child.classList.contains('section-title'));
      const body = rows.slice(index + 1, nextTitle < 0 ? undefined : nextTitle);
      row.hidden = body.length > 0 && !body.some(child => !child.hidden);
    });
  }

  function selectCategory(category, audience = 'all', openPanel = true) {
    allSections.forEach(section => {
      section.hidden = section.dataset.settingsCategory !== category;
      if (!section.hidden) setSectionRows(section, audience);
    });
    navigation.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.category === category && button.dataset.audience === audience));
    });
    heading.textContent = `${categories.find(([key]) => key === category)[1]}${audience === 'all' ? '' : ` · ${audience === 'user' ? 'User' : 'Sett'}`}`;
    content.scrollTop = 0;
    if (openPanel) {
      panel.classList.remove('collapsed');
      document.getElementById('btnTogglePanel')?.classList.add('active');
    }
  }

  categories.forEach(([category, label]) => {
    const group = document.createElement('div');
    group.className = 'settings-category-group';
    group.dataset.category = category;
    const title = document.createElement('div');
    title.className = 'settings-category-title';
    title.textContent = label;
    const pair = document.createElement('div');
    pair.className = 'settings-category-pair';
    const audiences = category === 'general' ? ['all'] : ['user', 'sett'];
    audiences.forEach(audience => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'settings-category';
      button.dataset.category = category;
      button.dataset.audience = audience;
      button.textContent = audience === 'all' ? label : audience === 'user' ? 'User' : 'Sett';
      button.setAttribute('aria-controls', content.id);
      button.addEventListener('click', event => {
        event.stopPropagation();
        selectCategory(category, audience);
      });
      pair.append(button);
    });
    group.append(title, pair);
    navigation.append(group);
  });
  document.body.append(navigation);
  selectCategory('general', 'all', false);
})();
