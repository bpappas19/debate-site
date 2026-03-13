/**
 * Category/vertical config. Only "stocks" is active at launch.
 * Other categories are placeholders for future expansion.
 * To add a new category: add id/label here, set active: true when ready,
 * then add debates in mock.ts with that categoryType and (optional) metadata shape.
 */
import type { CategoryConfig } from "./types";

export const CATEGORIES: CategoryConfig[] = [
  { id: "stocks", label: "Stocks", active: true },
  { id: "crypto", label: "Crypto", active: false },
  { id: "sports", label: "Sports", active: false },
  { id: "politics", label: "Politics", active: false },
  { id: "products", label: "Products", active: false },
  { id: "culture", label: "Culture", active: false },
];

export const ACTIVE_CATEGORIES = CATEGORIES.filter((c) => c.active);
export const getCategoryByType = (type: string): CategoryConfig | undefined =>
  CATEGORIES.find((c) => c.id === type);
