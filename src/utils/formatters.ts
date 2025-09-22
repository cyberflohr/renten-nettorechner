// src/utils/formatters.ts

/**
 * Formats a number as currency in EUR.
 * @param value - The number to format.
 * @returns The formatted currency string.
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formats a number as a percentage.
 * @param value - The number to format (e.g., 0.1 for 10%).
 * @returns The formatted percentage string.
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
};
