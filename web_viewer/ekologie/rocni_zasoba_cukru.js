import { TreeEcology } from './tree_ecology.js?v=light-slider-1';
import {
  BEECH_CALENDAR, seasonDayForPosition, beechColourForPosition,
  beechLeafFallProgress, beechLeafGrowthProgress, monthClockForSeason,
} from '../obdobi/beech_phenology.js?v=1';

const daysPerYear = 365;
const minutesPerDay = 1440;
const budburstBudget = 350;
const leafShare = 0.10;
// Teaching calibration for the mobilisable store. Live photosynthesis and respiration stay unchanged.
const surplusToStorage = 0.12;
const dormantDrawShare = 0.53;
const monthStarts = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
const quarterDays = [0, 1, 2, 3].map(seasonDayForPosition);
quarterDays.push(quarterDays[0] + daysPerYear);
function minutesPerCalendarDay(day) {
  const end = monthStarts.findIndex(start => start > day);
  return minutesPerDay / (monthStarts[end] - monthStarts[end - 1]);
}

function positionForDay(day) {
  const calendarDay = day < quarterDays[0] ? day + daysPerYear : day;
  const quarter = quarterDays.findIndex((start, i) => calendarDay >= start && calendarDay < quarterDays[i + 1]);
  return quarter + (calendarDay - quarterDays[quarter]) / (quarterDays[quarter + 1] - quarterDays[quarter]);
}

function dailySugarFlows(tree) {
  const sample = new TreeEcology();
  sample.configure({ height: tree.height, woodVolume: tree.woodVolume, crownArea: tree.crownArea });
  // A representative hydrated tree and fixed, near-neutral weather phase.
  sample.reserve = sample.capacity;
  sample.elapsedMinutes = 5 * minutesPerDay;
  const sampledDays = Array.from({ length: daysPerYear }, (_, day) => {
    const position = positionForDay(day);
    sample.setSeasonPosition(position);
    const leafGrowth = beechLeafGrowthProgress(position);
    sample.activeFoliage = leafGrowth * (1 - beechLeafFallProgress(position));
    const colourLoss = Math.max(0, (beechColourForPosition(position) - 0.25) / 0.75);
    sample.photosyntheticFoliage = sample.activeFoliage * (1 - colourLoss);

    let production = 0;
    let respiration = 0;
    for (let hour = 0.5; hour < 24; hour++) {
      const arc = Math.sin((hour - 6) * Math.PI / 12);
      sample.hourOfDay = hour;
      sample.sunElevation = Math.asin(arc * Math.cos(35 * Math.PI / 180)) * 180 / Math.PI;
      sample.evaluate(0);
      production += 60 * sample.glucoseGramsPerMinute;
      respiration += 60 * sample.respirationSugar;
    }
    const growth = day >= BEECH_CALENDAR.budburst && day < BEECH_CALENDAR.fullLeaf
      ? budburstBudget * (beechLeafGrowthProgress(positionForDay(day + 1)) - leafGrowth)
      : 0;
    const fall = beechLeafFallProgress(position);
    const fallShare = day >= BEECH_CALENDAR.leafFallStart && day < BEECH_CALENDAR.leafFallEnd
      ? (beechLeafFallProgress(positionForDay(day + 1)) - fall) / (1 - fall)
      : 0;
    return { production, respiration, growth, fallShare };
  });
  // One representative 24-hour balance per calendar month. Growth keeps its own daily timing.
  return monthStarts.slice(0, -1).flatMap((start, month) => {
    const days = sampledDays.slice(start, monthStarts[month + 1]);
    const production = days.reduce((sum, day) => sum + day.production, 0) / days.length;
    const respiration = days.reduce((sum, day) => sum + day.respiration, 0) / days.length;
    return days.map(({ growth, fallShare }) => ({ production, respiration, growth, fallShare }));
  });
}

function applyDay(start, leafStart, day, flow, capacity, fraction = 1, production = flow.production, growth = flow.growth * fraction) {
  const net = production - flow.respiration * fraction;
  const dormant = day < BEECH_CALENDAR.fullLeaf || day >= BEECH_CALENDAR.leafFallStart;
  const balance = net >= 0 ? surplusToStorage * net : net * (dormant ? dormantDrawShare : 1);
  const budburstUse = Math.min(growth, Math.max(0, start + balance));
  const toLeaves = day < BEECH_CALENDAR.leafFallStart
    ? Math.min(leafShare * Math.max(0, balance - budburstUse), leafShare * capacity - leafStart)
    : 0;
  const autumnReturn = leafStart * flow.fallShare * fraction;
  const storageLimit = day < BEECH_CALENDAR.leafFallStart ? capacity * (1 - leafShare)
    : capacity - leafStart;
  const beforeReturn = Math.min(storageLimit, Math.max(0, start + balance - budburstUse - toLeaves));
  const reserve = beforeReturn + autumnReturn;
  return { reserve, inLeaves: leafStart + toLeaves - autumnReturn, budburstUse, autumnReturn };
}

function simulateYear(flows, capacity, initialReserve) {
  let reserve = initialReserve;
  let inLeaves = 0;
  return flows.map((flow, day) => {
    const start = reserve;
    const leafStart = inLeaves;
    const result = applyDay(start, leafStart, day, flow, capacity);
    ({ reserve, inLeaves } = result);
    return { ...result, start, leafStart, flow };
  });
}

export function createAnnualSugarCurve(tree, capacity) {
  const flows = dailySugarFlows(tree);
  // Start from the stock left by the previous season, including its autumn refilling.
  const previousYear = simulateYear(flows, capacity, capacity);
  return simulateYear(flows, capacity, previousYear.at(-1).reserve);
}

export function sugarAtSeason(curve, position) {
  const date = seasonDayForPosition(position) % daysPerYear;
  const index = Math.floor(date);
  const day = curve[index];
  const minutes = minutesPerCalendarDay(index);
  return {
    reserve: day.start + (day.reserve - day.start) * (date % 1),
    budburstRate: day.budburstUse / minutes,
    autumnRate: day.autumnReturn / minutes,
  };
}

const calendarDate = position => seasonDayForPosition(position) + daysPerYear * Math.floor(position / 4);
const dayFraction = date => date - Math.floor(date);
const dayOfYear = day => ((day % daysPerYear) + daysPerYear) % daysPerYear;

export function sugarProductionFactor(tree) {
  const availableWater = tree.capacity > 0 ? tree.reserve / tree.capacity : 1;
  const water = Math.max(0, Math.min(1, availableWater / 0.35));
  const light = tree.manualLightAvailability ?? 1;
  return water * light * tree.sugarProductionFraction;
}

export function createSeasonalSugarBalance(curve, capacity) {
  let cursor;
  let start;
  let leafStart;
  let production;
  let growth;
  let appliedGrowth;
  let accountedProgress;
  let budburstRate = 0;

  return {
    update(from, to, automatic, factor, visibleGrowth) {
      const previous = calendarDate(from);
      const date = calendarDate(to);
      if (cursor === undefined || cursor !== previous || (!automatic && date !== previous) || date < previous) {
        const reference = curve[dayOfYear(Math.floor(date))];
        cursor = date;
        start = reference.start;
        leafStart = reference.leafStart;
        production = reference.flow.production * dayFraction(date);
        growth = reference.flow.growth * dayFraction(date);
        appliedGrowth = reference.budburstUse * dayFraction(date);
        accountedProgress = beechLeafGrowthProgress(to);
        budburstRate = reference.budburstUse / minutesPerCalendarDay(dayOfYear(Math.floor(date)));
      }

      // Seeking uses the reference curve. Only elapsed playback adds a new growth charge.
      const elapsedDays = date - cursor;
      const elapsedMinutes = elapsedDays > 0 ? (monthClockForSeason(to) - monthClockForSeason(from)) * minutesPerDay : 0;
      if (elapsedDays > 0 && Math.floor((cursor - BEECH_CALENDAR.budburst) / daysPerYear)
        !== Math.floor((date - BEECH_CALENDAR.budburst) / daysPerYear)) accountedProgress = 0;
      const growthChange = Number.isFinite(visibleGrowth) ? Math.max(0, visibleGrowth - accountedProgress) : 0;
      if (growthChange > 0 && elapsedDays > 0) accountedProgress = visibleGrowth;
      let growthUsed = 0;
      while (cursor < date) {
        const dayStart = Math.floor(cursor);
        const day = dayOfYear(dayStart);
        const { flow } = curve[day];
        const end = Math.min(dayStart + 1, date);
        production += flow.production * factor * (end - cursor);
        growth += budburstBudget * growthChange * (end - cursor) / elapsedDays;
        const current = applyDay(start, leafStart, day, flow, capacity, end - dayStart, production, growth);
        growthUsed += Math.max(0, current.budburstUse - appliedGrowth);
        appliedGrowth = current.budburstUse;
        if (end === dayStart + 1) {
          start = current.reserve;
          leafStart = current.inLeaves;
          production = 0;
          growth = 0;
          appliedGrowth = 0;
        }
        cursor = end;
      }
      if (elapsedMinutes > 0) budburstRate = growthUsed / elapsedMinutes;

      const day = dayOfYear(Math.floor(date));
      const { flow } = curve[day];
      const current = applyDay(start, leafStart, day, flow, capacity, dayFraction(date), production, growth);
      return {
        reserve: current.reserve,
        budburstRate,
        autumnRate: leafStart * flow.fallShare / minutesPerCalendarDay(day),
      };
    },
  };
}
