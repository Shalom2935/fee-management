import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency or plain number.
 * @param amount The numeric amount to format.
 * @param currency The ISO 4217 currency code (e.g., 'XOF', 'XAF', 'USD', 'EUR'). Defaults to 'XOF'.
 * @param locale The locale for formatting rules (e.g., 'fr-FR', 'en-US'). Defaults to 'fr-FR'.
 * @param showCurrency Whether to show the currency symbol/code. Defaults to true.
 * @returns A formatted string.
 */
export function formatCurrency(amount: number, currency = "XOF", locale = 'fr-FR', showCurrency = true): string {
  if (!showCurrency) {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0, // Adjust if you need cents/centimes
    maximumFractionDigits: 0, // Adjust if you need cents/centimes
  }).format(amount);
}
