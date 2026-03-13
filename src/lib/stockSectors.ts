/**
 * Stock sector options for create-debate form and display.
 * Backend can extend or replace with API data.
 */
export const STOCK_SECTORS = [
  "Technology",
  "Consumer Cyclical",
  "Consumer Defensive",
  "Healthcare",
  "Financial Services",
  "Industrials",
  "Basic Materials",
  "Energy",
  "Utilities",
  "Real Estate",
  "Communication Services",
] as const;

export type StockSector = (typeof STOCK_SECTORS)[number];
