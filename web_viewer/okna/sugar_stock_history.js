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

function fillRun(run, radius) {
  if (run.length < 2) return '';
  const start = run[0].day;
  const end = run.at(-1).day;
  const edge = run.map(({ day, grams }) => point(day, radius(grams)).join(' ')).join('L');
  const innerArc = day => `A${INNER_RADIUS} ${INNER_RADIUS} 0 0 0 ${point(day, INNER_RADIUS).join(' ')}`;
  return `M${edge}L${point(end, INNER_RADIUS).join(' ')}${innerArc((end + start) / 2)}${innerArc(start)}Z`;
}

export function createSugarStockHistory() {
  const daily = [];
  let current;

  function clear() {
    daily.length = 0;
    current = undefined;
  }

  return {
    clear,
    sample(position, grams, continuous) {
      if (!Number.isFinite(position) || !Number.isFinite(grams)) return;
      const rawDate = seasonDayForPosition(position) + DAYS_IN_YEAR * Math.floor(position / 4);
      const wholeDay = Math.round(rawDate);
      const date = Math.abs(rawDate - wholeDay) < 1e-9 ? wholeDay : rawDate;
      const year = Math.floor(date / DAYS_IN_YEAR);
      const day = date - year * DAYS_IN_YEAR;
      const dayIndex = Math.floor(day);
      if (current && (year !== current.year || date < current.date)) clear();

      const previousDay = daily.at(-1);
      if (previousDay?.dayIndex === dayIndex) {
        previousDay.day = day;
        previousDay.grams = grams;
      } else {
        const connected = Boolean(continuous && previousDay?.dayIndex === dayIndex - 1);
        daily.push({ dayIndex, day, grams, connected });
      }
      current = { date, year, day, grams };
    },
    geometry(capacity, reference = []) {
      if (!current || !Number.isFinite(capacity) || capacity <= 0) return null;
      const radius = grams => INNER_RADIUS + (OUTER_RADIUS - INNER_RADIUS) * Math.max(0, Math.min(1, grams / capacity));
      // Fill the elapsed year with live samples and use the typical year for skipped dates.
      const elapsed = [];
      for (const sample of daily) {
        if (!sample.connected) {
          const firstMissingDay = Math.floor(elapsed.at(-1)?.day ?? -1) + 1;
          for (let day = firstMissingDay; day < sample.day && day < reference.length; day++) {
            elapsed.push({ day, grams: reference[day].start });
          }
        }
        elapsed.push(sample);
      }
      return {
        path: fillRun(elapsed, radius),
        needle: [...point(current.day, radius(current.grams)), ...point(current.day, OUTER_RADIUS + 8)],
        dot: point(current.day, radius(current.grams)),
      };
    },
  };
}
