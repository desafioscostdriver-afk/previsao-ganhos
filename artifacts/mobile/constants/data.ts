export type Category = "X" | "Confort" | "Black";

export const CATEGORY_MULTIPLIERS: Record<Category, number> = {
  X: 1.0,
  Confort: 1.100,
  Black: 1.267,
};

export const CATEGORY_LABELS: Record<Category, string> = {
  X: "Uber X / 99 Pop",
  Confort: "Confort / 99 Plus",
  Black: "Black",
};

export const CATEGORY_IDEAL_RIDES_PER_HOUR: Record<Category, number> = {
  X: 3.4,
  Confort: 2.8,
  Black: 2.2,
};

export const DAY_MULTIPLIERS: Record<number, number> = {
  0: 1.275,
  1: 1.0,
  2: 1.0,
  3: 1.0,
  4: 1.0,
  5: 1.0,
  6: 1.156,
};

export const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const HOURLY_TABLE: Record<number, { min: number; max: number }> = {
  0: { min: 33.24, max: 43.46 },
  1: { min: 32.02, max: 40.23 },
  2: { min: 32.53, max: 40.73 },
  3: { min: 20.07, max: 37.31 },
  4: { min: 23.45, max: 39.12 },
  5: { min: 33.54, max: 39.12 },
  6: { min: 34.54, max: 39.91 },
  7: { min: 37.58, max: 41.23 },
  8: { min: 37.61, max: 41.72 },
  9: { min: 34.62, max: 41.73 },
  10: { min: 29.31, max: 45.98 },
  11: { min: 29.31, max: 45.98 },
  12: { min: 31.87, max: 48.12 },
  13: { min: 31.87, max: 48.25 },
  14: { min: 30.87, max: 45.12 },
  15: { min: 30.89, max: 46.42 },
  16: { min: 36.87, max: 49.48 },
  17: { min: 45.32, max: 54.89 },
  18: { min: 46.32, max: 56.39 },
  19: { min: 47.32, max: 59.73 },
  20: { min: 49.39, max: 57.24 },
  21: { min: 37.45, max: 54.32 },
  22: { min: 36.45, max: 52.17 },
  23: { min: 36.98, max: 51.17 },
};
