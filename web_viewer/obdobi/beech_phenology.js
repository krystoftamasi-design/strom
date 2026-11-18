// Representative Czech beech calendar, not a prediction for one site/year.
// Zero-based days in a non-leap year. Sources: EKOLOGIE_PODKLADY.md.
const QUARTER_DAYS = [59, 151, 243, 334, 424];
const MONTH_DAYS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
export const BEECH_CALENDAR = Object.freeze({
  budburst: 114,       // April 25
  fullLeaf: 134,       // May 15
  colourStart: 267,    // September 25
  leafFallStart: 297,  // October 25
  leafFallEnd: 323     // November 20
});
const COLOUR_STOPS = [
  [59, 0], [114, 0], [151, 0.25],
  [267, 0.25], [272, 0.40], [287, 0.72], [303, 1], [424, 1]
];
const clamp = value => Math.max(0, Math.min(1, value));
const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t); };

export function seasonDayForPosition(position) {
  const phase = ((position % 4) + 4) % 4;
  const quarter = Math.floor(phase);
  return QUARTER_DAYS[quarter] + (QUARTER_DAYS[quarter + 1] - QUARTER_DAYS[quarter]) * (phase - quarter);
}

export function monthClockForSeason(position) {
  const date = seasonDayForPosition(position) + 365 * Math.floor(position / 4);
  const year = Math.floor(date / 365);
  const day = date - year * 365;
  const month = MONTH_DAYS.findIndex(start => start > day) - 1;
  return year * 12 + month + (day - MONTH_DAYS[month]) / (MONTH_DAYS[month + 1] - MONTH_DAYS[month]);
}

export function seasonForMonthClock(clock) {
  const year = Math.floor(clock / 12);
  const monthClock = clock - year * 12;
  const month = Math.floor(monthClock);
  const date = year * 365 + MONTH_DAYS[month] + (monthClock - month) * (MONTH_DAYS[month + 1] - MONTH_DAYS[month]);
  const seasonYear = Math.floor((date - QUARTER_DAYS[0]) / 365);
  const day = date - seasonYear * 365;
  const quarter = QUARTER_DAYS.findIndex(start => start > day) - 1;
  return seasonYear * 4 + quarter + (day - QUARTER_DAYS[quarter]) / (QUARTER_DAYS[quarter + 1] - QUARTER_DAYS[quarter]);
}

export function solarHoursForMonthClock(clock) {
  const month = Math.floor(clock);
  const progress = clock - month;
  const daylightShare = 20 / 24;
  const elapsedHours = progress < daylightShare
    ? 12 * progress / daylightShare
    : 12 + 12 * (progress - daylightShare) / (1 - daylightShare);
  // The unwrapped hour lets the water balance count a full night across midnight.
  return month * 24 + 6 + elapsedHours;
}

export function beechColourForPosition(position) {
  const day = seasonDayForPosition(position);
  for (let i = 1; i < COLOUR_STOPS.length; i++) {
    const [end, colour] = COLOUR_STOPS[i];
    const [start, previous] = COLOUR_STOPS[i - 1];
    if (day <= end) return previous + (colour - previous) * (day - start) / (end - start);
  }
  return 1;
}

export function seasonPositionForColour(colour) {
  if (colour <= 0) return 0;
  if (colour === 0.25) return 1.5;
  if (colour >= 1) return 3;
  for (let i = 1; i < COLOUR_STOPS.length; i++) {
    const [end, to] = COLOUR_STOPS[i];
    const [start, from] = COLOUR_STOPS[i - 1];
    if (to <= from || colour > to) continue;
    const day = start + (end - start) * (colour - from) / (to - from);
    const quarter = QUARTER_DAYS.findIndex((value, index) => index < 4 && day < QUARTER_DAYS[index + 1]);
    return quarter + (day - QUARTER_DAYS[quarter]) / (QUARTER_DAYS[quarter + 1] - QUARTER_DAYS[quarter]);
  }
  return 3;
}

export function beechLeafFallProgress(position) {
  const day = seasonDayForPosition(position);
  if (day < BEECH_CALENDAR.budburst) return 1;
  return ease((day - BEECH_CALENDAR.leafFallStart) / (BEECH_CALENDAR.leafFallEnd - BEECH_CALENDAR.leafFallStart));
}

export function beechLeafGrowthProgress(position) {
  return ease((seasonDayForPosition(position) - BEECH_CALENDAR.budburst) / (BEECH_CALENDAR.fullLeaf - BEECH_CALENDAR.budburst));
}
