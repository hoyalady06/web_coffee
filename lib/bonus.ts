export const BONUS_PERCENT = 0.05;

export function calcBonus(total: number) {
  return Math.floor(total * BONUS_PERCENT);
}
