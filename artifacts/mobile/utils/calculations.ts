import {
  Category,
  CATEGORY_MULTIPLIERS,
  CATEGORY_IDEAL_RIDES_PER_HOUR,
  DAY_MULTIPLIERS,
  HOURLY_TABLE,
} from "@/constants/data";

export interface PredictionResult {
  totalMin: number;
  totalMax: number;
  avgMinPerHour: number;
  avgMaxPerHour: number;
  totalHours: number;
  dayMultiplierApplied: number;
  categoryMultiplier: number;
}

export interface RealResult {
  hoursWorked: number;
  ridesPerHour: number;
  idealRidesPerHour: number;
  productivityIndex: number;
  earnedPerHour: number;
  prediction: PredictionResult | null;
  vsMinDiff: number | null;
  vsMaxDiff: number | null;
  isAboveMin: boolean | null;
  isBelowMax: boolean | null;
}

function getAdjustedTableValue(
  hour: number,
  categoryMultiplier: number,
  dayMultiplier: number
): { min: number; max: number } {
  const normalizedHour = ((hour % 24) + 24) % 24;
  const base = HOURLY_TABLE[normalizedHour] ?? { min: 30, max: 45 };
  return {
    min: base.min * categoryMultiplier * dayMultiplier,
    max: base.max * categoryMultiplier * dayMultiplier,
  };
}

export function calculatePrediction(
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
  category: Category,
  dayOfWeek: number
): PredictionResult {
  const categoryMultiplier = CATEGORY_MULTIPLIERS[category];
  const dayMultiplier = DAY_MULTIPLIERS[dayOfWeek] ?? 1.0;

  const startTotalMinutes = startHour * 60 + startMinute;
  let endTotalMinutes = endHour * 60 + endMinute;

  if (endTotalMinutes <= startTotalMinutes) {
    endTotalMinutes += 24 * 60;
  }

  const totalMinutes = endTotalMinutes - startTotalMinutes;
  const totalHours = totalMinutes / 60;

  let sumMin = 0;
  let sumMax = 0;
  let remaining = totalMinutes;
  let currentMinute = startTotalMinutes;

  while (remaining > 0) {
    const currentHour = Math.floor(currentMinute / 60);
    const minuteInHour = currentMinute % 60;
    const minutesUntilNextHour = 60 - minuteInHour;
    const minutesThisBlock = Math.min(remaining, minutesUntilNextHour);
    const proportion = minutesThisBlock / 60;
    const adjusted = getAdjustedTableValue(
      currentHour,
      categoryMultiplier,
      dayMultiplier
    );
    sumMin += adjusted.min * proportion;
    sumMax += adjusted.max * proportion;
    currentMinute += minutesThisBlock;
    remaining -= minutesThisBlock;
  }

  return {
    totalMin: sumMin,
    totalMax: sumMax,
    avgMinPerHour: totalHours > 0 ? sumMin / totalHours : 0,
    avgMaxPerHour: totalHours > 0 ? sumMax / totalHours : 0,
    totalHours,
    dayMultiplierApplied: dayMultiplier,
    categoryMultiplier,
  };
}

export function calculateReal(
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
  totalEarned: number,
  totalRides: number,
  category: Category,
  dayOfWeek: number
): RealResult {
  const startTotalMinutes = startHour * 60 + startMinute;
  let endTotalMinutes = endHour * 60 + endMinute;
  if (endTotalMinutes <= startTotalMinutes) {
    endTotalMinutes += 24 * 60;
  }
  const totalMinutes = endTotalMinutes - startTotalMinutes;
  const hoursWorked = totalMinutes / 60;

  const ridesPerHour = hoursWorked > 0 ? totalRides / hoursWorked : 0;
  const idealRidesPerHour = CATEGORY_IDEAL_RIDES_PER_HOUR[category];
  const productivityIndex = idealRidesPerHour > 0 ? ridesPerHour / idealRidesPerHour : 0;
  const earnedPerHour = hoursWorked > 0 ? totalEarned / hoursWorked : 0;

  const prediction = calculatePrediction(
    startHour,
    startMinute,
    endHour,
    endMinute,
    category,
    dayOfWeek
  );

  const vsMinDiff = totalEarned - prediction.totalMin;
  const vsMaxDiff = totalEarned - prediction.totalMax;
  const isAboveMin = totalEarned >= prediction.totalMin;
  const isBelowMax = totalEarned <= prediction.totalMax;

  return {
    hoursWorked,
    ridesPerHour,
    idealRidesPerHour,
    productivityIndex,
    earnedPerHour,
    prediction,
    vsMinDiff,
    vsMaxDiff,
    isAboveMin,
    isBelowMax,
  };
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}
