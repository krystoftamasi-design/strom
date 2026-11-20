import { vypocitatVzorec, konstanty } from './tree_ecology_vzorce.js?v=5';
import { BEECH_CALENDAR, seasonDayForPosition } from '../obdobi/beech_phenology.js?v=month-clock-1';

// One water store and one sugar store for every chapter. Rates use litres/min and g/min of model time.
// Species-inspired teaching presets, not a calibrated prediction of this tree.
export const SEASONS = {
  spring: { label: 'Jaro', foliage: 0.65, demand: 0.65, waterSupply: 0.68, startingReserve: 0.8, color: 0, elevation: 40 },
  summer: { label: 'Léto', foliage: 1, demand: 1, waterSupply: 0.55, startingReserve: 0.65, color: 0.25, elevation: 62 },
  autumn: { label: 'Podzim', foliage: 0.35, demand: 0.35, waterSupply: 0.38, startingReserve: 0.7, color: 0.68, elevation: 32 },
  latefall: { label: 'Zima', foliage: 0, demand: 0.04, waterSupply: 0.06, startingReserve: 0.6, color: 1, elevation: 16 }
};
export const MODEL_MINUTES_PER_SECOND = 24; // One displayed day (60 s) advances one model day.
export const SUGAR_BUDBURST_COST = 14000; // g of sugar needed for a full spring canopy (Apr 25 – May 13).
export const SUGAR_AUTUMN_RETURN = 3000; // g returned from a full canopy during leaf fall (Oct 25 – Nov 20).
const SURPLUS_TO_STORAGE = 0.10;
const BUDBURST_MINUTES = (BEECH_CALENDAR.fullLeaf - BEECH_CALENDAR.budburst) * 1440;
const AUTUMN_RETURN_MINUTES = (BEECH_CALENDAR.leafFallEnd - BEECH_CALENDAR.leafFallStart) * 1440;
// Parameter evidence and remaining uncertainty: EKOLOGIE_PODKLADY.md.
const FULL_CANOPY_LEAF_AREA_INDEX = 4;
const AVAILABLE_WATER_LITRES_PER_M3 = 250; // Teaching reserve (tree + root-zone soil, ~3–4 summer days).
const AUTOMATIC_WATER_SUPPLY_FRACTION = 0.9;
// ČHMÚ: national monthly mean temperature normals, 1991–2020 (°C).
// https://www.chmi.cz/namerena-data/historicka-data/uzemni-teplota-a-srazky
const CZECH_MONTHLY_MEAN = [-1.4, -0.4, 3.2, 8.5, 13.1, 16.5, 18.3, 17.9, 13.0, 8.2, 3.5, -0.4];
// Illustrative half-range of the daily cycle; these are not measured normals.
const DAILY_HALF_RANGE = [2.5, 3, 4, 5, 5.5, 6, 6, 5.5, 5, 4, 3, 2.5];
// Illustrative weather departures, not measured climate normals. Summer warm
// spells can lift afternoon temperatures above 30 °C; winter uses smaller swings.
const WEATHER_HALF_RANGE = [5, 5, 5, 6, 8, 10, 11, 10, 8, 6, 5, 5];
const MONTH_MID_DAYS = [14, 44, 73, 104, 134, 165, 195, 226, 257, 287, 318, 348];
export const CO2_PPM = 420; // Fixed teaching scenario, not a live atmospheric measurement.
export const PREINDUSTRIAL_CO2_PPM = 280;
const clamp = (v, low, high) => Math.max(low, Math.min(high, v));
const smoothstep = value => value * value * (3 - 2 * value);
// European beech (Fagus sylvatica) teaching curve: optimum 18–25 °C,
// cold limitation down to 0 °C and heat limitation down to 42 °C.
const photosynthesisTempFactor = temp =>
  smoothstep(clamp(temp / 18, 0, 1)) * (1 - smoothstep(clamp((temp - 25) / 17, 0, 1)));
const calendarDate = position => seasonDayForPosition(position) + 365 * Math.floor(position / 4);
function monthlyValue(values, day) {
  let next = MONTH_MID_DAYS.findIndex(midpoint => day < midpoint);
  if (next < 0) next = 12;
  const previous = (next + 11) % 12;
  const nextMonth = next % 12;
  const previousDay = next === 0 ? MONTH_MID_DAYS[11] - 365 : MONTH_MID_DAYS[next - 1];
  const nextDay = next === 12 ? MONTH_MID_DAYS[0] + 365 : MONTH_MID_DAYS[next];
  const fraction = (day - previousDay) / (nextDay - previousDay);
  return values[previous] + (values[nextMonth] - values[previous]) * fraction;
}

export class TreeEcology {
  constructor() {
    this.ready = false;
    this.season = 'summer';
    this.seasonPosition = 1;
    this.seasonState = { ...SEASONS[this.season] };
    this.manualWaterInput = false;
    this.manualWaterInputValue = 0;
    this.automaticWaterFraction = null;
    this.sugarProductionFraction = 1;
    this.sugarProductionCap = 1;
    this.waterAvailabilityCap = 1;
    this.sunElevation = 45;
    this.sunAzimuth = 0;
    this.dayCycleEnabled = true;
    this.sunIntensity = 1;
    this.manualLightAvailability = null;
    this.hourOfDay = 12;
    this.waterInput = 0.1;
    this.waterConsumption = 0;
    this.waterConsumptionLitresPerHour = 0;
    this.inflow = 0;
    this.seasonalWaterLimit = 0;
    this.excessWater = 0;
    this.waterlogging = 0;
    this.rootRot = 0;
    this.reserve = 0;
    this.capacity = 0;
    this.dryness = 0;
    this.elapsedMinutes = 0;
    this.consumption = 0;
    this.transpiration = 0;
    this.coolingKW = 0;
    this.temperatureNearCanopy = 0;
    this.ambientTemperature = 0;
    this.weatherTemperatureOffset = 0;
    this.activity = 0;
    this.lightConsumption = 0;
    this.light = 0;
    this.leafArea = 0;
    this.co2Response = 1;
    this.lightResponse = 1;
    this.activeLeafArea = 0;
    this.leafGrowth = 1;
    this.canopyLimit = 1;
    this.droughtFall = 0;
    this.photosynthesisEfficiency = 0;
    this.activeFoliage = 1;
    this.photosyntheticFoliage = 1;
    this.photosynthesisTemperatureFactor = 1;
    this.glucoseGramsPerMinute = 0;
    this.oxygenGramsPerMinute = 0;
    this.co2GramsPerMinute = 0;
    this.maxGlucoseGramsPerMinute = 7;
    this.maxOxygenGramsPerMinute = 7;
    this.maxCo2GramsPerMinute = 9;
    this.respirationFraction = 0;
    this.respirationSugar = 0;
    this.respirationOxygen = 0;
    this.respirationCO2 = 0;
    this.budburstRate = 0;
    this.autumnReturnRate = 0;
    this.totalSugarProduction = 0;
    this.totalSugarConsumption = 0;
    this.sugarCapacity = 40000;
    this.sugarReserve = 20000;
    this.hydration = 1;
    this.springHydration = 1;
  }

  configure({ height, woodVolume, crownArea }) {
    const oldFraction = this.ready ? this.reserve / this.capacity : SEASONS[this.season].startingReserve;
    this.height = Math.max(1, height);
    this.woodVolume = Math.max(0.01, woodVolume);
    this.crownArea = Math.max(1, crownArea);
    // Stand LAI measurements support this approximate full-canopy reference;
    // applying it to an individual model crown remains an estimate.
    this.leafArea = this.crownArea * FULL_CANOPY_LEAF_AREA_INDEX;
    this.maxGlucoseGramsPerMinute = this.leafArea * konstanty.glucoseConversion;
    this.maxOxygenGramsPerMinute = this.maxGlucoseGramsPerMinute * konstanty.oxygenPerGlucose;
    this.maxCo2GramsPerMinute = this.leafArea * konstanty.co2Conversion;
    // Only a teaching estimate of mobilisable water, not total wood water.
    this.capacity = Math.max(1, this.woodVolume * AVAILABLE_WATER_LITRES_PER_M3);
    // Illustrative maximum rate: 0.9 L/m² leaf over 12 full-light hours.
    // Actual daily use is integrated with daylight, foliage and hydration.
    this.baseTranspiration = this.leafArea * 0.9 / 720;
    this.reserve = this.capacity * oldFraction;
    this.ready = true;
    this.evaluate(0);
  }

  setSugarCapacity(grams) {
    if (!Number.isFinite(grams) || grams <= 0) return;
    this.sugarCapacity = grams;
    this.sugarReserve = clamp(this.sugarReserve, 0, grams);
  }

  startSpringBudburst() {
    const sugarShare = clamp(this.sugarReserve / SUGAR_BUDBURST_COST, 0, 1);
    const waterShare = clamp(this.springHydration, 0, 1);
    this.canopyLimit = Math.min(sugarShare, waterShare);
    return this.canopyLimit;
  }

  setSeason(key) {
    const index = Object.keys(SEASONS).indexOf(key);
    if (index >= 0) this.setSeasonPosition(index, true);
  }

  setSeasonPosition(position, resetInputs = false) {
    if (!Number.isFinite(position)) return;
    this.seasonPosition = position;
    const keys = Object.keys(SEASONS);
    const phase = ((position % 4) + 4) % 4;
    const index = Math.floor(phase);
    const blend = phase - index;
    this.season = keys[index];
    const from = SEASONS[this.season];
    const to = SEASONS[keys[(index + 1) % 4]];
    for (const key of ['waterSupply', 'demand', 'foliage', 'elevation']) {
      this.seasonState[key] = from[key] + (to[key] - from[key]) * blend;
    }
    if (resetInputs) {
      this.manualWaterInput = false;
      this.manualLightAvailability = null;
    }
    if (this.ready) {
      this.evaluate(0);
    }
  }

  setWaterInput(litresPerMinute) {
    this.manualWaterInput = true;
    this.manualWaterInputValue = Math.max(0, Number(litresPerMinute) || 0);
    this.waterInput = this.manualWaterInputValue;
    if (this.ready) this.evaluate(0);
  }

  setLightAvailability(fraction) {
    if (!Number.isFinite(fraction)) return;
    this.manualLightAvailability = clamp(fraction, 0, 1);
    if (this.ready) this.evaluate(0);
  }

  evaluate(minutes) {
    const season = this.seasonState;
    const weatherDay = this.elapsedMinutes / 1440;
    const rainWave = 0.55 * Math.sin(2 * Math.PI * weatherDay / 14)
      + 0.35 * Math.sin(2 * Math.PI * weatherDay / 6.5);
    const rainFactor = clamp(1 + 0.7 * rainWave, 0.25, 1.75);
    this.seasonalWaterLimit = this.baseTranspiration * season.waterSupply;
    const naturalWater = this.seasonalWaterLimit * AUTOMATIC_WATER_SUPPLY_FRACTION * rainFactor * (this.automaticWaterFraction ?? 1);
    const waterBarMax = Math.max(this.seasonalWaterLimit * 2, this.baseTranspiration * 1.015, 0.001);
    const waterCap = clamp(this.waterAvailabilityCap, 0, 1);
    const cappedWater = waterCap < 1 ? Math.min(naturalWater, waterBarMax * waterCap) : naturalWater;
    this.waterInput = this.manualWaterInput && this.automaticWaterFraction === null && waterCap >= 1
      ? this.manualWaterInputValue
      : cappedWater;
    this.excessWater = Math.max(0, this.waterInput - this.seasonalWaterLimit);
    // Surplus stays outside the tree and drains gradually; sustained
    // waterlogging damages roots and reduces uptake.
    this.inflow = Math.min(this.waterInput, this.seasonalWaterLimit * (1 - 0.8 * this.rootRot));
    const daylight = clamp(Math.sin(this.sunElevation * Math.PI / 180) * this.sunIntensity / Math.sin(Math.PI / 3), 0, 1);
    this.light = this.sunElevation > 0 ? (this.manualLightAvailability ?? daylight) : 0;
    // Estimate air temperature for the display and photosynthesis response.
    const dayOfYear = seasonDayForPosition(this.seasonPosition) % 365;
    const mean = monthlyValue(CZECH_MONTHLY_MEAN, dayOfYear);
    const halfRange = monthlyValue(DAILY_HALF_RANGE, dayOfYear);
    const weatherPattern = 0.75 * Math.sin(2 * Math.PI * weatherDay / 12 + 0.8)
      + 0.25 * Math.sin(2 * Math.PI * weatherDay / 5 + 1.7);
    this.weatherTemperatureOffset = monthlyValue(WEATHER_HALF_RANGE, dayOfYear) * weatherPattern;
    const hour = ((this.hourOfDay % 24) + 24) % 24;
    const warmth = hour >= 6 && hour < 15
      ? smoothstep((hour - 6) / 9)
      : 1 - smoothstep(((hour < 6 ? hour + 24 : hour) - 15) / 15);
    this.ambientTemperature = mean + this.weatherTemperatureOffset + halfRange * (2 * warmth - 1);
    // The leaf animation supplies the attached leaf fraction; leafGrowth scales budburst separately.
    const foliage = clamp(this.activeFoliage, 0, 1);
    const growth = clamp(this.leafGrowth, 0, 1);
    const effectiveFoliage = foliage * growth;
    const frostFactor = smoothstep(clamp(this.ambientTemperature / 5, 0, 1));
    this.stressThreshold = this.capacity * (0.12 + 0.23 * effectiveFoliage * this.light);
    this.hydration = clamp(this.reserve / this.stressThreshold, 0, 1);
    const potentialTranspiration = this.baseTranspiration * effectiveFoliage * this.light * frostFactor;
    // Residual loss remains in the dark and in winter. No negative store is possible.
    const maintenance = this.baseTranspiration * 0.015 * (0.2 + effectiveFoliage * 0.8);
    const requested = potentialTranspiration * this.hydration + maintenance;
    const availableRate = minutes > 0 ? this.reserve / minutes + this.inflow : (this.reserve > 0 ? Infinity : this.inflow);
    this.consumption = Math.min(requested, availableRate);
    this.waterConsumption = this.consumption;
    this.waterConsumptionLitresPerHour = this.waterConsumption;
    this.transpiration = Math.min(potentialTranspiration * this.hydration, this.consumption);
    this.coolingKW = this.transpiration / 60 * 2450; // L/min ≈ kg/min; latent heat 2450 kJ/kg.
    // Illustrative air cooling scales with actual evaporation relative to a
    // full canopy. Bare or dry trees therefore cannot produce full cooling.
    const coolingFraction = clamp(this.transpiration / Math.max(this.baseTranspiration, 0.001), 0, 1);
    // A leafy canopy limits radiative heat loss at night relative to open air.
    // Fade through twilight independently of the sun-intensity slider.
    // 0.5 °C is a teaching cap, not a measured value for this beech.
    const nightFraction = smoothstep(clamp(-this.sunElevation / 12, 0, 1));
    const retainedWarmth = 0.5 * effectiveFoliage * nightFraction;
    this.temperatureNearCanopy = this.ambientTemperature - 2 * coolingFraction + retainedWarmth;
    this.photosynthesisTemperatureFactor = photosynthesisTempFactor(this.ambientTemperature);
    this.co2Response = (CO2_PPM / (CO2_PPM + 200)) / (420 / 620);
    const kLight = 0.25;
    this.lightResponse = (this.light / (this.light + kLight)) / (1 / (1 + kLight));
    // Active leaf area reflects attached non-red leaves; leafGrowth multiplies the formula outside.
    this.activeLeafArea = this.leafArea * clamp(this.photosyntheticFoliage, 0, 1);
    const baseEfficiency = vypocitatVzorec('photosynthesisEfficiency', this) * this.sugarProductionFraction;
    const baseActivity = vypocitatVzorec('activity', this) * this.sugarProductionFraction;
    const naturalGlucose = this.activeLeafArea * clamp(this.leafGrowth, 0, 1) * baseEfficiency * konstanty.glucoseConversion;
    const capGlucose = clamp(this.sugarProductionCap, 0, 1) * Math.max(this.maxGlucoseGramsPerMinute, 0.0001);
    const capScale = naturalGlucose > capGlucose && naturalGlucose > 0 ? capGlucose / naturalGlucose : 1;
    this.photosynthesisEfficiency = baseEfficiency * capScale;
    this.activity = baseActivity * capScale;
    this.lightConsumption = vypocitatVzorec('lightConsumption', this);
    // 8 µmol CO₂/m²/s, six CO₂ per glucose; show glucose equivalent, not storage.
    this.glucoseGramsPerMinute = vypocitatVzorec('glucoseGramsPerMinute', this);
    this.oxygenGramsPerMinute = vypocitatVzorec('oxygenGramsPerMinute', this);
    this.co2GramsPerMinute = vypocitatVzorec('co2GramsPerMinute', this);
    // Illustrative whole-tree maintenance respiration: bare dormant trees use 20% of full-canopy rate.
    this.respirationFraction = 0.15 * Math.pow(2, (clamp(this.ambientTemperature, -10, 40) - 20) / 10)
      * (0.2 + 0.8 * effectiveFoliage);
    const demandedRespiration = this.leafArea * konstanty.glucoseConversion * this.respirationFraction;
    this.budburstRate = dayOfYear >= BEECH_CALENDAR.budburst && dayOfYear < BEECH_CALENDAR.fullLeaf
      ? this.canopyLimit * SUGAR_BUDBURST_COST / BUDBURST_MINUTES
      : 0;
    this.autumnReturnRate = dayOfYear >= BEECH_CALENDAR.leafFallStart && dayOfYear < BEECH_CALENDAR.leafFallEnd
      ? this.canopyLimit * (1 - clamp(this.droughtFall, 0, 1)) * SUGAR_AUTUMN_RETURN / AUTUMN_RETURN_MINUTES
      : 0;
    this.totalSugarProduction = this.glucoseGramsPerMinute + this.autumnReturnRate;
    this.respirationSugar = this.sugarReserve > 0
      ? demandedRespiration
      : Math.min(demandedRespiration, this.totalSugarProduction);
    this.respirationOxygen = this.respirationSugar * konstanty.oxygenPerGlucose;
    this.respirationCO2 = this.respirationSugar * (konstanty.co2Conversion / konstanty.glucoseConversion);
    this.totalSugarConsumption = this.respirationSugar + this.budburstRate;
    return this;
  }

  getSugarStorageRate(daytimeLight = null) {
    let meanGlucose = this.glucoseGramsPerMinute;
    let meanRespiration = this.respirationSugar;
    if (daytimeLight !== null) {
      const dayOfYear = seasonDayForPosition(this.seasonPosition) % 365;
      const meanTemp = monthlyValue(CZECH_MONTHLY_MEAN, dayOfYear) + this.weatherTemperatureOffset;
      const meanTempFactor = photosynthesisTempFactor(meanTemp);
      const kLight = 0.25;
      const meanLightResponse = (daytimeLight / (daytimeLight + kLight)) / (1 / (1 + kLight));
      const dayEfficiency = meanLightResponse * this.hydration * this.co2Response
        * meanTempFactor * this.sugarProductionFraction;
      const dayGlucose = this.activeLeafArea * clamp(this.leafGrowth, 0, 1) * dayEfficiency * konstanty.glucoseConversion;
      const capGlucose = clamp(this.sugarProductionCap, 0, 1) * Math.max(this.maxGlucoseGramsPerMinute, 0.0001);
      meanGlucose = 0.5 * Math.min(dayGlucose, capGlucose);
      const effectiveFoliage = clamp(this.activeFoliage, 0, 1) * clamp(this.leafGrowth, 0, 1);
      const meanRespFrac = 0.15 * Math.pow(2, (clamp(meanTemp, -10, 40) - 20) / 10) * (0.2 + 0.8 * effectiveFoliage);
      meanRespiration = this.leafArea * konstanty.glucoseConversion * meanRespFrac;
    }
    const net = (meanGlucose + this.autumnReturnRate) - (meanRespiration + this.budburstRate);
    const storageShare = SURPLUS_TO_STORAGE + 0.15 * clamp((0.75 - this.canopyLimit) / 0.75, 0, 1);
    return net >= 0 ? net * storageShare : net;
  }

  advanceSugarOnSeek(fromPosition, toPosition, daytimeLight = null) {
    const startCal = calendarDate(fromPosition);
    const endCal = calendarDate(toPosition);
    if (!Number.isFinite(startCal) || !Number.isFinite(endCal) || endCal <= startCal) return;
    const light = daytimeLight ?? this.light;
    const kLight = 0.25;
    const meanLightResponse = (light / (light + kLight)) / (1 / (1 + kLight));
    const capGlucose = clamp(this.sugarProductionCap, 0, 1) * Math.max(this.maxGlucoseGramsPerMinute, 0.0001);
    const droughtLoss = 1 - clamp(this.droughtFall, 0, 1);
    let cursor = startCal;
    while (cursor < endCal) {
      const calDay = Math.floor(cursor);
      const day = ((calDay % 365) + 365) % 365;
      if (cursor > startCal && cursor === calDay && day === BEECH_CALENDAR.budburst) {
        this.startSpringBudburst();
      }
      const next = Math.min(endCal, calDay + 1);
      const spanDays = next - cursor;
      const growth = day < BEECH_CALENDAR.budburst || day >= BEECH_CALENDAR.leafFallEnd ? 0
        : smoothstep(clamp((day - BEECH_CALENDAR.budburst) / (BEECH_CALENDAR.fullLeaf - BEECH_CALENDAR.budburst), 0, 1));
      const fall = day < BEECH_CALENDAR.budburst ? 1
        : smoothstep(clamp((day - BEECH_CALENDAR.leafFallStart) / (BEECH_CALENDAR.leafFallEnd - BEECH_CALENDAR.leafFallStart), 0, 1));
      const colourLoss = smoothstep(clamp((day - BEECH_CALENDAR.colourStart) / (303 - BEECH_CALENDAR.colourStart), 0, 1));
      const activeFoliage = this.canopyLimit * (1 - fall) * droughtLoss;
      const photosyntheticFoliage = activeFoliage * (1 - colourLoss);
      const effectiveFoliage = activeFoliage * growth;
      const meanTemp = monthlyValue(CZECH_MONTHLY_MEAN, day);
      const meanTempFactor = photosynthesisTempFactor(meanTemp);
      const dayEfficiency = meanLightResponse * this.hydration * this.co2Response
        * meanTempFactor * this.sugarProductionFraction;
      const dayGlucose = this.leafArea * photosyntheticFoliage * growth * dayEfficiency * konstanty.glucoseConversion;
      const meanGlucose = 0.5 * Math.min(dayGlucose, capGlucose);
      const meanRespFrac = 0.15 * Math.pow(2, (clamp(meanTemp, -10, 40) - 20) / 10) * (0.2 + 0.8 * effectiveFoliage);
      const meanRespiration = this.leafArea * konstanty.glucoseConversion * meanRespFrac;
      const budburstRate = day >= BEECH_CALENDAR.budburst && day < BEECH_CALENDAR.fullLeaf
        ? this.canopyLimit * SUGAR_BUDBURST_COST / BUDBURST_MINUTES
        : 0;
      const autumnReturnRate = day >= BEECH_CALENDAR.leafFallStart && day < BEECH_CALENDAR.leafFallEnd
        ? this.canopyLimit * droughtLoss * SUGAR_AUTUMN_RETURN / AUTUMN_RETURN_MINUTES
        : 0;
      const net = (meanGlucose + autumnReturnRate) - (meanRespiration + budburstRate);
      const storageShare = SURPLUS_TO_STORAGE + 0.15 * clamp((0.75 - this.canopyLimit) / 0.75, 0, 1);
      const rate = net >= 0 ? net * storageShare : net;
      this.sugarReserve = clamp(this.sugarReserve + rate * spanDays * 1440, 0, this.sugarCapacity);
      cursor = next;
    }
  }

  // The viewer supplies the same model-minute increment used by its clock.
  step(minutes, daytimeLight = null) {
    if (!this.ready) return this;
    minutes = Math.max(0, Number(minutes) || 0);
    const modelDays = minutes / 1440;
    // Small substeps keep stress feedback stable near an empty reservoir.
    const steps = Math.max(1, Math.ceil(minutes / 1));
    const meanWaterBalance = daytimeLight !== null;
    if (meanWaterBalance) this.evaluate(0);
    const effectiveFoliage = clamp(this.activeFoliage, 0, 1) * clamp(this.leafGrowth, 0, 1);
    const frostFactor = smoothstep(clamp(this.ambientTemperature / 5, 0, 1));
    const threshold = this.capacity * (0.12 + 0.23 * effectiveFoliage * (daytimeLight ?? 0));
    const meanTranspiration = this.baseTranspiration * effectiveFoliage * (daytimeLight ?? 0) * frostFactor / 2;
    const maintenance = this.baseTranspiration * 0.015 * (0.2 + effectiveFoliage * 0.8);
    for (let i = 0; i < steps; i++) {
      this.elapsedMinutes += minutes / steps;
      if (!meanWaterBalance) this.evaluate(minutes / steps);
      const waterUse = meanWaterBalance
        ? maintenance + meanTranspiration * clamp(this.reserve / threshold, 0, 1)
        : this.consumption;
      this.reserve = clamp(this.reserve + (this.inflow - waterUse) * minutes / steps, 0, this.capacity);
      // Normalised soil surplus with a two-model-day drainage time. A brief
      // oversupply builds wetness without immediately damaging roots.
      const wetnessInput = clamp(this.excessWater / Math.max(this.baseTranspiration, 0.001), 0, 2);
      const drainage = Math.exp(-(minutes / steps / 1440) / 2);
      this.waterlogging = clamp(this.waterlogging * drainage + wetnessInput * 2 * (1 - drainage), 0, 1);
    }
    if (minutes > 0) {
      this.sugarReserve = clamp(this.sugarReserve + this.getSugarStorageRate(daytimeLight) * minutes, 0, this.sugarCapacity);
    }
    const rotTarget = clamp((this.waterlogging - 0.5) / 0.5, 0, 1);
    // Damage and recovery time constants are in model days.
    const rotTime = rotTarget > this.rootRot ? 5 : 12;
    this.rootRot += (rotTarget - this.rootRot) * (1 - Math.exp(-modelDays / rotTime));
    this.evaluate(0);
    // Multi-day rolling hydration so a single dry day on April 25 does not cap the whole year's canopy.
    this.springHydration += (this.hydration - this.springHydration) * (1 - Math.exp(-modelDays / 10));
    const target = effectiveFoliage > 0 ? 1 - this.hydration : 0;
    const timeConstant = target > this.dryness ? 12 : 6;
    this.dryness += (target - this.dryness) * (1 - Math.exp(-modelDays / timeConstant));
    return this;
  }
}
