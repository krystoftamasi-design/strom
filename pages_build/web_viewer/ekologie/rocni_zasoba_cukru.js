import { TreeEcology } from './tree_ecology.js?v=annual-stock-1';
import {
  BEECH_CALENDAR, seasonDayForPosition, beechColourForPosition,
  beechLeafFallProgress, beechLeafGrowthProgress,
} from '../obdobi/beech_phenology.js?v=1';

const daysPerYear = 365;
const minutesPerDay = 1440;
const quarterDays = [0, 1, 2, 3].map(seasonDayForPosition);
quarterDays.push(quarterDays[0] + daysPerYear);

function positionForDay(day) {
  const calendarDay = day < quarterDays[0] ? day + daysPerYear : day;
  const quarter = quarterDays.findIndex((start, i) => calendarDay >= start && calendarDay < quarterDays[i + 1]);
  return quarter + (calendarDay - quarterDays[quarter]) / (quarterDays[quarter + 1] - quarterDays[quarter]);
}

// Run the viewer's ecology on a separate tree under the default light and water settings.
export function simulateAnnualStocks(tree, capacity) {
  const sample = new TreeEcology();
  sample.setSeasonPosition(positionForDay(181));
  sample.configure({ height: tree.height, woodVolume: tree.woodVolume, crownArea: tree.crownArea });
  sample.setSugarCapacity(capacity);
  sample.sugarReserve = capacity / 2;
  sample.hourOfDay = 12;
  sample.sunElevation = 55;
  const daylight = Array.from({ length: 12 }, (_, hour) =>
    Math.sin((hour + 0.5) * Math.PI / 12) * Math.cos(35 * Math.PI / 180) / Math.sin(Math.PI / 3)
  ).reduce((sum, light) => sum + light, 0) / 12;

  function advance(day) {
    const position = positionForDay(day);
    if (day === BEECH_CALENDAR.budburst) sample.startSpringBudburst();
    const retained = 1 - beechLeafFallProgress(position);
    const colourLoss = Math.max(0, (beechColourForPosition(position) - 0.25) / 0.75);
    sample.activeFoliage = sample.canopyLimit * retained;
    sample.photosyntheticFoliage = sample.activeFoliage * (1 - colourLoss);
    sample.leafGrowth = beechLeafGrowthProgress(position);
    sample.setSeasonPosition(position);
    sample.step(minutesPerDay, daylight);
  }

  // Start from the default summer state, then carry that tree's reserves into January.
  for (let day = 181; day < daysPerYear; day++) advance(day);
  const sugar = [];
  const water = [];
  for (let day = 0; day <= daysPerYear; day++) {
    sugar.push({ start: sample.sugarReserve });
    water.push({ start: sample.reserve });
    if (day < daysPerYear) advance(day);
  }
  return { sugar, water };
}
