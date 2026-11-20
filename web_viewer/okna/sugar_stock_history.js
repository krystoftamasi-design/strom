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
  const largeArc = Number(end - start > DAYS_IN_YEAR / 2);
  return `M${edge}L${point(end, INNER_RADIUS).join(' ')}A${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 0 ${point(start, INNER_RADIUS).join(' ')}Z`;
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
    geometry(capacity, reference = []) {
      if (!current || !Number.isFinite(capacity) || capacity <= 0) return null;
      const radius = grams => INNER_RADIUS + (OUTER_RADIUS - INNER_RADIUS) * Math.max(0, Math.min(1, grams / capacity));
      const recordedRuns = [];
      for (const sample of daily) {
        if (!sample.connected) recordedRuns.push([]);
        recordedRuns.at(-1).push(sample);
      }
      const path = recordedRuns.map(run => fillRun(run, radius)).join('');
      // Keep separate areas across jumps in time or changes of opacity.
      const recorded = new Set(daily.filter(sample => sample.connected).map(sample => sample.dayIndex - 1));
      const referenceRuns = [[], [], [], [], []];
      const pastBand = referenceRuns.length - 1;
      const remainingDays = DAYS_IN_YEAR - current.day;
      const today = Math.floor(current.day);
      const start = reference[today]?.start;
      const end = reference[today + 1]?.start;
      const referenceNow = start + (end - start) * (current.day - today);
      const offset = current.grams - referenceNow;
      for (let day = 0; day < reference.length; day++) {
        const next = reference[day + 1];
        if (!next || recorded.has(day)) continue;
        const future = day >= today;
        const fromDay = future ? Math.max(day, current.day) : day;
        const ahead = Math.max(0, fromDay - current.day) / remainingDays;
        const band = future ? Math.min(pastBand - 1, Math.floor(ahead * pastBand)) : pastBand;
        const fromGrams = day === today ? current.grams : reference[day].start + (future ? offset : 0);
        const toGrams = next.start + (future ? offset : 0);
        const runs = referenceRuns[band];
        if (runs.at(-1)?.at(-1)?.day !== fromDay) runs.push([{ day: fromDay, grams: fromGrams }]);
        runs.at(-1).push({ day: day + 1, grams: toGrams });
      }
      return {
        path,
        referencePaths: referenceRuns.map(runs => runs.map(run => fillRun(run, radius)).join('')),
        needle: [...point(current.day, radius(current.grams)), ...point(current.day, OUTER_RADIUS + 8)],
        dot: point(current.day, radius(current.grams)),
      };
    },
  };
}
