/**
 * Generic debate platform types.
 * Stocks are one vertical (categoryType: "stocks"); other verticals can plug in later.
 */

/** Vertical/category slug — used in routing and data. */
export type CategoryType =
  | "stocks"
  | "crypto"
  | "sports"
  | "politics"
  | "products"
  | "culture";

/** Generic argument side. Stocks display as Bull / Bear / Hold; other categories as For/Against, Yes/No, etc. */
export type ArgumentSide = "PRO" | "CON" | "HOLD";

/** Legacy YES/NO for backward compatibility where needed. Maps: YES → PRO, NO → CON. */
export type Side = "YES" | "NO";

export interface User {
  id: string;
  username: string;
  avatar?: string;
  points: number;
}

/** Single argument in a debate. Side is generic (PRO/CON/HOLD). */
export interface Argument {
  id: string;
  debateId: string;
  side: ArgumentSide;
  content: string;
  author: User;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
}

/** Stock-specific metadata. Nested under Debate.metadata when categoryType === "stocks". MVP: no API fields (price, P/E, etc.). */
export interface StockMetadata {
  ticker: string;
  sector?: string;
}

/** Generic debate entity. Works for stocks, crypto, politics, etc. */
export interface Debate {
  id: string;
  categoryType: CategoryType;
  entityId: string;
  entityName: string;
  /** URL-safe identifier (e.g. ticker for stocks). */
  symbolOrSlug: string;
  debateQuestion: string;
  description?: string;
  /** Pro/bull/yes votes. */
  proVotes: number;
  /** Con/bear/no votes. */
  conVotes: number;
  totalVotes: number;
  createdAt: Date;
  resolved?: boolean;
  resolvedSide?: ArgumentSide;
  resolvedAt?: Date;
  image?: string;
  tags: string[];
  /** Category-specific metadata. For stocks: StockMetadata. */
  metadata?: Record<string, unknown> | StockMetadata;
}

/** Category config for nav and feature flags (active = has content). */
export interface CategoryConfig {
  id: CategoryType;
  label: string;
  active: boolean;
}

/**
 * Payload for creating a debate. Backend-ready: POST body can use this shape.
 * Backend maps to Debate by adding: id, entityId (= symbolOrSlug), proVotes/conVotes/totalVotes = 0, createdAt.
 */
export interface CreateDebatePayload {
  categoryType: CategoryType;
  debateQuestion: string;
  description?: string;
  entityName: string;
  symbolOrSlug: string;
  tags: string[];
  /** For stocks: { ticker, sector? }. Other categories can add their own shape. */
  metadata?: Record<string, unknown> | StockMetadata;
  firstArgument?: { content: string; side: ArgumentSide };
}

