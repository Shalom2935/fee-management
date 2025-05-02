import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency.
 * @param amount The numeric amount to format.
 * @param currency The ISO 4217 currency code (e.g., 'XOF', 'XAF', 'USD', 'EUR'). Defaults to 'XOF'.
 * @param locale The locale for formatting rules (e.g., 'fr-FR', 'en-US'). Defaults to 'fr-FR'.
 * @returns A formatted currency string.
 */
export function formatCurrency(amount: number, currency = "XOF", locale = 'fr-FR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0, // Adjust if you need cents/centimes
    maximumFractionDigits: 0, // Adjust if you need cents/centimes
  }).format(amount);
}
