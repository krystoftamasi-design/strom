import { seasonDayForPosition } from '../obdobi/beech_phenology.js?v=month-clock-1';

const DAYS_IN_YEAR = 365;
const INNER_RADIUS = 24;
const OUTER_RADIUS = 43;
const CENTER = 50;

function point(day, radius) {
  const angle = day / DAYS_IN_YEAR * 2 * Math.PI;
  return [
    (CENTER + radius * Math.sin(angle)).toFixed(2),
    (CENTER - radius * Math.cos(angle)).toFixed(2),
  ];
}

const innerEdge = `M${CENTER} ${CENTER - INNER_RADIUS}A${INNER_RADIUS} ${INNER_RADIUS} 0 0 0 ${CENTER} ${CENTER + INNER_RADIUS}A${INNER_RADIUS} ${INNER_RADIUS} 0 0 0 ${CENTER} ${CENTER - INNER_RADIUS}Z`;

export function createSugarStockHistory() {
  const daily = new Array(DAYS_IN_YEAR);
  let current;
  let coordinates = [];
  let cachedCapacity;
  let cachedReference;

  function clear() {
    daily.fill(undefined);
    current = undefined;
    coordinates = [];
  }

  function recordDay(index, day, grams) {
    daily[index] = { day, grams };
    coordinates[index] = undefined;
  }

  return {
    clear,
    sample(position, grams) {
      if (!Number.isFinite(position) || !Number.isFinite(grams)) return;
      const rawDate = seasonDayForPosition(position) + DAYS_IN_YEAR * Math.floor(position / 4);
      const wholeDay = Math.round(rawDate);
      const date = Math.abs(rawDate - wholeDay) < 1e-9 ? wholeDay : rawDate;
      const year = Math.floor(date / DAYS_IN_YEAR);
      const day = date - year * DAYS_IN_YEAR;
      const dayIndex = Math.floor(day);
      if (current?.date === date && current.grams === grams) return;
      if (current && date < current.date) clear();
      if (current) {
        const targetDate = Math.floor(date);
        const firstSkipped = Math.max(Math.floor(current.date) + 1, targetDate - (DAYS_IN_YEAR - 1));
        // A fast seek only measures its endpoints. Interpolate the days it crosses
        // so isolated points do not alternate with the older curve.
        for (let skipped = firstSkipped; skipped < targetDate; skipped++) {
          const index = ((skipped % DAYS_IN_YEAR) + DAYS_IN_YEAR) % DAYS_IN_YEAR;
          const progress = (skipped - current.date) / (date - current.date);
          recordDay(index, index, current.grams + (grams - current.grams) * progress);
        }
      }
      current = { date, day, grams };
      recordDay(dayIndex, day, grams);
    },
    geometry(capacity, reference = []) {
      if (!current || !Number.isFinite(capacity) || capacity <= 0) return null;
      const radius = grams => INNER_RADIUS + (OUTER_RADIUS - INNER_RADIUS) * Math.max(0, Math.min(1, grams / capacity));
      if (cachedCapacity !== capacity || cachedReference !== reference) {
        coordinates = [];
        cachedCapacity = capacity;
        cachedReference = reference;
      }
      for (let day = 0; day < DAYS_IN_YEAR; day++) {
        if (coordinates[day] !== undefined) continue;
        const sample = daily[day];
        const grams = sample?.grams ?? reference[day]?.start ?? 0;
        coordinates[day] = point(sample?.day ?? day, radius(grams)).join(' ');
      }
      const dot = coordinates[Math.floor(current.day)].split(' ');
      return {
        path: `M${coordinates.join('L')}Z${innerEdge}`,
        angle: current.day / DAYS_IN_YEAR * 360,
        needle: [...dot, ...point(current.day, OUTER_RADIUS + 8)],
        innerNeedle: [...point(current.day, INNER_RADIUS), ...dot],
        dot,
      };
    },
  };
}
