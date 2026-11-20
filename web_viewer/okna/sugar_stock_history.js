import { seasonDayForPosition } from '../obdobi/beech_phenology.js?v=month-clock-1';

const DAYS_IN_YEAR = 365;
const INNER_RADIUS = 14;
const OUTER_RADIUS = 43;
const CENTER = 50;

function point(day, radius) {
  const angle = day / DAYS_IN_YEAR * 2 * Math.PI;
  return [
    (CENTER + radius * Math.sin(angle)).toFixed(2),
    (CENTER - radius * Math.cos(angle)).toFixed(2),
  ];
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
      const date = seasonDayForPosition(position) + DAYS_IN_YEAR * Math.floor(position / 4);
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
    geometry(capacity) {
      if (!current || !Number.isFinite(capacity) || capacity <= 0) return null;
      const radius = grams => INNER_RADIUS + (OUTER_RADIUS - INNER_RADIUS) * Math.max(0, Math.min(1, grams / capacity));
      const path = daily.map(({ day, grams, connected }) => {
        const xy = point(day, radius(grams)).join(' ');
        return connected ? `L${xy}` : `M${xy}h.01`;
      }).join(' ');
      return {
        path,
        needle: [...point(current.day, INNER_RADIUS - 4), ...point(current.day, OUTER_RADIUS + 3)],
        dot: point(current.day, radius(current.grams)),
      };
    },
  };
}
