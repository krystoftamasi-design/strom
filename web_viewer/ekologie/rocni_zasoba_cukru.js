import { TreeEcology } from './tree_ecology.js?v=light-slider-1';
import {
  BEECH_CALENDAR, seasonDayForPosition, beechColourForPosition,
  beechLeafFallProgress, beechLeafGrowthProgress,
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
    return { production, respiration, growth };
  });
  // One representative 24-hour balance per calendar month. Growth keeps its own daily timing.
  return monthStarts.slice(0, -1).flatMap((start, month) => {
    const days = sampledDays.slice(start, monthStarts[month + 1]);
    const production = days.reduce((sum, day) => sum + day.production, 0) / days.length;
    const respiration = days.reduce((sum, day) => sum + day.respiration, 0) / days.length;
    return days.map(({ growth }) => ({ production, respiration, growth }));
  });
}

function applyDay(start, leafStart, day, flow, capacity, fraction = 1, production = flow.production) {
  const net = production - flow.respiration * fraction;
  const dormant = day < BEECH_CALENDAR.fullLeaf || day >= BEECH_CALENDAR.leafFallStart;
  const balance = net >= 0 ? surplusToStorage * net : net * (dormant ? dormantDrawShare : 1);
  const budburstUse = Math.min(flow.growth * fraction, Math.max(0, start + balance));
  const toLeaves = day < BEECH_CALENDAR.leafFallStart
    ? Math.min(leafShare * Math.max(0, balance - budburstUse), leafShare * capacity - leafStart)
    : 0;
  const autumnReturn = day === BEECH_CALENDAR.leafFallStart ? leafStart * fraction : 0;
  const storageLimit = day < BEECH_CALENDAR.leafFallStart ? capacity * (1 - leafShare)
    : day === BEECH_CALENDAR.leafFallStart ? capacity - leafStart : capacity;
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
  const day = curve[Math.floor(date)];
  return {
    reserve: day.start + (day.reserve - day.start) * (date % 1),
    budburstRate: day.budburstUse / minutesPerDay,
    autumnRate: day.autumnReturn / minutesPerDay,
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

  return {
    update(from, to, automatic, factor) {
      const previous = calendarDate(from);
      const date = calendarDate(to);
      if (cursor === undefined || cursor !== previous || (!automatic && date !== previous) || date < previous) {
        const reference = curve[dayOfYear(Math.floor(date))];
        cursor = date;
        start = reference.start;
        leafStart = reference.leafStart;
        production = reference.flow.production * dayFraction(date);
      }

      while (Math.floor(cursor) < Math.floor(date)) {
        const day = dayOfYear(Math.floor(cursor));
        const { flow } = curve[day];
        production += flow.production * factor * (1 - dayFraction(cursor));
        const completed = applyDay(start, leafStart, day, flow, capacity, 1, production);
        start = completed.reserve;
        leafStart = completed.inLeaves;
        production = 0;
        cursor = Math.floor(cursor) + 1;
      }

      const day = dayOfYear(Math.floor(date));
      const { flow } = curve[day];
      production += flow.production * factor * (date - cursor);
      cursor = date;
      const current = applyDay(start, leafStart, day, flow, capacity, dayFraction(date), production);
      const todayGrowth = applyDay(start, leafStart, day, flow, capacity, 1, flow.production * factor).budburstUse;
      return {
        reserve: current.reserve,
        budburstRate: todayGrowth / minutesPerDay,
        autumnRate: day === BEECH_CALENDAR.leafFallStart ? leafStart / minutesPerDay : 0,
      };
    },
  };
}
