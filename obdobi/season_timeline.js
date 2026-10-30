import { beechColourForPosition, seasonPositionForColour, seasonDayForPosition } from './beech_phenology.js?v=1';
const YEAR_SECONDS = 288;
export function seasonColorForPosition(position) {
  return beechColourForPosition(position);
}
const positionForSlider = value => seasonPositionForColour(value / 100);

// The ring and the existing season slider share one continuous position.
export function createSeasonTimeline(model) {
  const slider = document.getElementById('sliderSeason');
  slider.step = '0.1';
  let position = positionForSlider(Number(slider.value));
  let lastValue = Number(slider.value);
  let automatic = true;
  let writing = false;
  let active = false;
  let displayedDay = null;
  const clock = document.createElement('div');
  clock.className = 'season-clock';
  clock.innerHTML = '<button type="button" aria-pressed="true">Ⅱ Pozastavit rok</button>';
  document.querySelector('#chapterShared .shared-body').prepend(clock);
  const dateCard = document.createElement('aside');
  dateCard.className = 'season-date-card';
  dateCard.setAttribute('aria-label', 'Datum modelového roku');
  dateCard.innerHTML = '<span>Datum</span><output></output>';
  document.querySelector('.chapter-panel').append(dateCard);
  const button = clock.querySelector('button');
  const output = dateCard.querySelector('output');
  const dateFormat = new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'long', timeZone: 'UTC' });
  function setAutomatic(value) {
    automatic = value;
    button.textContent = automatic ? 'Ⅱ Pozastavit rok' : '▶ Pokračovat v roce';
    button.setAttribute('aria-pressed', String(automatic));
  }
  button.addEventListener('click', () => setAutomatic(!automatic));
  function readSlider() {
    const next = positionForSlider(Number(slider.value));
    // Keep the slider bidirectional. The previous monotonic conversion
    // treated every lower value as a new year and prevented going back.
    position = next + Math.floor(position / 4) * 4;
    lastValue = Number(slider.value);
    model.setSeasonPosition(position, true);
  }
  function writeSlider(resetWater = false) {
    model.setSeasonPosition(position, resetWater);
    const value = Math.round(seasonColorForPosition(position) * 1000) / 10;
    if (value === Number(slider.value)) return;
    writing = true;
    try {
      slider.value = value;
      // Do not bubble automatic frames into the advanced-settings saver.
      slider.dispatchEvent(new CustomEvent('input', { detail: { seasonPosition: position } }));
      lastValue = Number(slider.value);
    } finally { writing = false; }
  }
  slider.addEventListener('input', () => {
    if (writing || !active) return;
    setAutomatic(false);
    readSlider();
  });
  function showDate() {
    const day = Math.floor(seasonDayForPosition(position)) % 365;
    if (day !== displayedDay) {
      output.textContent = dateFormat.format(new Date(Date.UTC(2001, 0, 1) + day * 86400000));
      displayedDay = day;
    }
  }
  return {
    get position() { return position; },
    pause() { setAutomatic(false); },
    moveTo(next) {
      // The visible time ring only advances; it cannot undo elapsed time.
      if (!Number.isFinite(next) || next <= position) return;
      position = next;
      writeSlider(true);
      showDate();
    },
    update(chapter, dragging, playbackDelta = 0) {
      const wasActive = active;
      active = chapter !== 'intro';
      dateCard.hidden = !active;
      // The intro owns the season position while its presentation is playing.
      if (!active) return;
      if (!wasActive) {
        position = model.seasonPosition;
        lastValue = Number(slider.value);
      }
      if (!dragging) {
        if (Number(slider.value) !== lastValue) { readSlider(); setAutomatic(false); }
        if (automatic && playbackDelta > 0) { position += playbackDelta / YEAR_SECONDS * 4; writeSlider(); }
      }
      showDate();
    }
  };
}
