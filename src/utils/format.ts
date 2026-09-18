/**
 * Formats a number into Colombian Pesos (COP) currency string
 * e.g. 28000 -> "$28.000 COP"
 */
export function formatCOP(amount: number): string {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$${formatted} COP`;
}

/**
 * Check if today is Wednesday in local time (0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat)
 */
export function isTodayWednesday(): boolean {
  return new Date().getDay() === 3;
}
