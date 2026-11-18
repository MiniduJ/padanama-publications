/**
 * Utility functions for currency and monetary calculations in Sri Lankan Rupee (LKR)
 * All database records store money strictly in integer cents (1 LKR = 100 cents).
 */

export function formatLkr(cents: number, locale: "si" | "en" | "ta" = "si"): string {
  const rupees = cents / 100;
  const formattedNumber = new Intl.NumberFormat("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);

  switch (locale) {
    case "si":
      return `රු. ${formattedNumber}`;
    case "ta":
      return `ரூ. ${formattedNumber}`;
    case "en":
    default:
      return `Rs. ${formattedNumber}`;
  }
}

export function centsToLkr(cents: number): number {
  return cents / 100;
}

export function lkrToCents(rupees: number): number {
  return Math.round(rupees * 100);
}
