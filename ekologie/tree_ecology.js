import { vypocitatVzorec } from './tree_ecology_vzorce.js?v=3';

// One water store for every chapter. Rates use litres/minute of model time.
// Species-inspired teaching presets, not a calibrated prediction of this tree.
export const SEASONS = {
  spring: { label: 'Jaro', foliage: 0.65, demand: 0.65, waterSupply: 0.68, startingReserve: 0.8, color: 0, elevation: 40 },
  summer: { label: 'Léto', foliage: 1, demand: 1, waterSupply: 0.55, startingReserve: 0.65, color: 0.25, elevation: 62 },
  autumn: { label: 'Podzim', foliage: 0.35, demand: 0.35, waterSupply: 0.38, startingReserve: 0.7, color: 0.68, elevation: 32 },
  latefall: { label: 'Zima', foliage: 0, demand: 0.04, waterSupply: 0.06, startingReserve: 0.6, color: 1, elevation: 16 }
};
export const MODEL_MINUTES_PER_SECOND = 24; // One displayed day (60 s) advances one model day.
// Parameter evidence and remaining uncertainty: EKOLOGIE_PODKLADY.md.
const FULL_CANOPY_LEAF_AREA_INDEX = 4;
const AVAILABLE_WATER_LITRES_PER_M3 = 8; // Uncalibrated teaching reserve, not measured beech capacity.
// ČHMÚ: national monthly mean temperature normals, 1991–2020 (°C).
// https://www.chmi.cz/namerena-data/historicka-data/uzemni-teplota-a-srazky
const CZECH_MONTHLY_MEAN = [-1.4, -0.4, 3.2, 8.5, 13.1, 16.5, 18.3, 17.9, 13.0, 8.2, 3.5, -0.4];
// Illustrative half-range of the daily cycle; these are not measured normals.
const DAILY_HALF_RANGE = [2.5, 3, 4, 5, 5.5, 6, 6, 5.5, 5, 4, 3, 2.5];
// Illustrative weather departures, not measured climate normals. Summer warm
// spells can lift afternoon temperatures above 30 °C; winter uses smaller swings.
const WEATHER_HALF_RANGE = [5, 5, 5, 6, 8, 10, 11, 10, 8, 6, 5, 5];
const MONTH_MID_DAYS = [14, 44, 73, 104, 134, 165, 195, 226, 257, 287, 318, 348];
const SEASON_START_DAYS = [59, 151, 243, 334, 424];
export const CO2_PPM = 420; // Fixed teaching scenario, not a live atmospheric measurement.
export const PREINDUSTRIAL_CO2_PPM = 280;
const clamp = (v, low, high) => Math.max(low, Math.min(high, v));
const smoothstep = value => value * value * (3 - 2 * value);
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
    this.sunElevation = 45;
    this.sunAzimuth = 0;
    this.dayCycleEnabled = true;
    this.sunIntensity = 1;
    this.hourOfDay = 12;
    this.waterInput = 0.1;
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
    this.light = 0;
    this.leafArea = 0;
    this.co2Response = 1;
    this.activeLeafArea = 0;
    this.photosynthesisEfficiency = 0;
    this.activeFoliage = 1;
    this.photosyntheticFoliage = 1;
    this.photosynthesisTemperatureFactor = 1;
    this.glucoseGramsPerMinute = 0;
    this.hydration = 1;
  }

  configure({ height, woodVolume, crownArea }) {
    const oldFraction = this.ready ? this.reserve / this.capacity : SEASONS[this.season].startingReserve;
    this.height = Math.max(1, height);
    this.woodVolume = Math.max(0.01, woodVolume);
    this.crownArea = Math.max(1, crownArea);
    // Stand LAI measurements support this approximate full-canopy reference;
    // applying it to an individual model crown remains an estimate.
    this.leafArea = this.crownArea * FULL_CANOPY_LEAF_AREA_INDEX;
    // Only a teaching estimate of mobilisable water, not total wood water.
    this.capacity = Math.max(1, this.woodVolume * AVAILABLE_WATER_LITRES_PER_M3);
    // Illustrative maximum rate: 0.9 L/m² leaf over 12 full-light hours.
    // Actual daily use is integrated with daylight, foliage and hydration.
    this.baseTranspiration = this.leafArea * 0.9 / 720;
    this.reserve = this.capacity * oldFraction;
    if (!this.ready) this.waterInput = this.baseTranspiration * SEASONS[this.season].waterSupply;
    this.ready = true;
    this.evaluate(0);
  }

  setSeason(key) {
    const index = Object.keys(SEASONS).indexOf(key);
    if (index >= 0) this.setSeasonPosition(index, true);
  }

  setSeasonPosition(position, resetWater = false) {
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
    if (resetWater) this.manualWaterInput = false;
    if (this.ready) {
      if (!this.manualWaterInput) this.waterInput = this.baseTranspiration * this.seasonState.waterSupply;
      this.evaluate(0);
    }
  }

  setWaterInput(litresPerMinute) {
    this.manualWaterInput = true;
    this.waterInput = Math.max(0, Number(litresPerMinute) || 0);
    if (this.ready) this.evaluate(0);
  }

  evaluate(minutes) {
    const season = this.seasonState;
    this.seasonalWaterLimit = this.baseTranspiration * season.waterSupply;
    this.excessWater = Math.max(0, this.waterInput - this.seasonalWaterLimit);
    // Surplus stays outside the tree and drains gradually; sustained
    // waterlogging damages roots and reduces uptake.
    this.inflow = Math.min(this.waterInput, this.seasonalWaterLimit * (1 - 0.8 * this.rootRot));
    this.light = clamp(Math.sin(this.sunElevation * Math.PI / 180) * this.sunIntensity / Math.sin(Math.PI / 3), 0, 1);
    // Estimate air temperature for the display and photosynthesis response.
    const seasonPhase = ((this.seasonPosition % 4) + 4) % 4;
    const quarter = Math.floor(seasonPhase);
    const dayOfYear = (SEASON_START_DAYS[quarter]
      + (SEASON_START_DAYS[quarter + 1] - SEASON_START_DAYS[quarter]) * (seasonPhase - quarter)) % 365;
    const mean = monthlyValue(CZECH_MONTHLY_MEAN, dayOfYear);
    const halfRange = monthlyValue(DAILY_HALF_RANGE, dayOfYear);
    const weatherDay = this.elapsedMinutes / 1440;
    const weatherPattern = 0.75 * Math.sin(2 * Math.PI * weatherDay / 12 + 0.8)
      + 0.25 * Math.sin(2 * Math.PI * weatherDay / 5 + 1.7);
    this.weatherTemperatureOffset = monthlyValue(WEATHER_HALF_RANGE, dayOfYear) * weatherPattern;
    const hour = ((this.hourOfDay % 24) + 24) % 24;
    const warmth = hour >= 6 && hour < 15
      ? smoothstep((hour - 6) / 9)
      : 1 - smoothstep(((hour < 6 ? hour + 24 : hour) - 15) / 15);
    this.ambientTemperature = mean + this.weatherTemperatureOffset + halfRange * (2 * warmth - 1);
    // The leaf animation supplies the attached, growing leaf-area fraction.
    const foliage = clamp(this.activeFoliage, 0, 1);
    this.stressThreshold = this.capacity * (0.12 + 0.23 * foliage * this.light);
    this.hydration = clamp(this.reserve / this.stressThreshold, 0, 1);
    const potentialTranspiration = this.baseTranspiration * foliage * this.light;
    // Residual loss remains in the dark and in winter. No negative store is possible.
    const maintenance = this.baseTranspiration * 0.015 * (0.2 + foliage * 0.8);
    const requested = potentialTranspiration * this.hydration + maintenance;
    const availableRate = minutes > 0 ? this.reserve / minutes + this.inflow : (this.reserve > 0 ? Infinity : this.inflow);
    this.consumption = Math.min(requested, availableRate);
    this.transpiration = Math.min(potentialTranspiration * this.hydration, this.consumption);
    this.coolingKW = this.transpiration / 60 * 2450; // L/min ≈ kg/min; latent heat 2450 kJ/kg.
    // Illustrative air cooling scales with actual evaporation relative to a
    // full canopy. Bare or dry trees therefore cannot produce full cooling.
    const coolingFraction = clamp(this.transpiration / Math.max(this.baseTranspiration, 0.001), 0, 1);
    // A leafy canopy limits radiative heat loss at night relative to open air.
    // Fade through twilight independently of the sun-intensity slider.
    // 0.5 °C is a teaching cap, not a measured value for this beech.
    const nightFraction = smoothstep(clamp(-this.sunElevation / 12, 0, 1));
    const retainedWarmth = 0.5 * foliage * nightFraction;
    this.temperatureNearCanopy = this.ambientTemperature - 2 * coolingFraction + retainedWarmth;
    // Teaching curve: gradual cold limitation below 10 °C and heat limitation
    // above 30 °C, reaching zero at 0/50 °C. Not a calibrated beech response.
    this.photosynthesisTemperatureFactor = smoothstep(clamp(this.ambientTemperature / 10, 0, 1))
      * (1 - smoothstep(clamp((this.ambientTemperature - 30) / 20, 0, 1)));
    this.co2Response = (CO2_PPM / (CO2_PPM + 200)) / (420 / 620);
    // Attached red leaves still affect the water balance, but only the
    // non-red portion of the canopy produces sugar in this teaching model.
    // One productive leaf quantity: area × attached non-red foliage.
    this.activeLeafArea = this.leafArea * clamp(this.photosyntheticFoliage, 0, 1);
    this.photosynthesisEfficiency = vypocitatVzorec('photosynthesisEfficiency', this);
    this.activity = vypocitatVzorec('activity', this);
    // 8 µmol CO₂/m²/s, six CO₂ per glucose; show glucose equivalent, not storage.
    this.glucoseGramsPerMinute = vypocitatVzorec('glucoseGramsPerMinute', this);
    return this;
  }

  // The viewer supplies the same model-minute increment used by its clock.
  step(minutes) {
    if (!this.ready) return this;
    minutes = Math.max(0, Number(minutes) || 0);
    const modelDays = minutes / 1440;
    // Small substeps keep stress feedback stable near an empty reservoir.
    const steps = Math.max(1, Math.ceil(minutes / 1));
    for (let i = 0; i < steps; i++) {
      this.elapsedMinutes += minutes / steps;
      this.evaluate(minutes / steps);
      this.reserve = clamp(this.reserve + (this.inflow - this.consumption) * minutes / steps, 0, this.capacity);
      // Normalised soil surplus with a two-model-day drainage time. A brief
      // oversupply builds wetness without immediately damaging roots.
      const wetnessInput = clamp(this.excessWater / Math.max(this.baseTranspiration, 0.001), 0, 2);
      const drainage = Math.exp(-(minutes / steps / 1440) / 2);
      this.waterlogging = clamp(this.waterlogging * drainage + wetnessInput * 2 * (1 - drainage), 0, 1);
    }
    const rotTarget = clamp((this.waterlogging - 0.5) / 0.5, 0, 1);
    // Damage and recovery time constants are in model days.
    const rotTime = rotTarget > this.rootRot ? 5 : 12;
    this.rootRot += (rotTarget - this.rootRot) * (1 - Math.exp(-modelDays / rotTime));
    this.evaluate(0);
    const target = this.activeFoliage > 0 ? 1 - this.hydration : 0;
    const timeConstant = target > this.dryness ? 12 : 6;
    this.dryness += (target - this.dryness) * (1 - Math.exp(-modelDays / timeConstant));
    return this;
  }
}
