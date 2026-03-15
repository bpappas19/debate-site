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
 * DB row shape for debates (snake_case). Used when mapping from Supabase.
 * App code uses Debate (camelCase).
 */
export interface DebateRow {
  id: string;
  category_type: string;
  symbol_or_slug: string;
  entity_id: string;
  entity_name: string;
  debate_question: string;
  description: string | null;
  metadata: Record<string, unknown>;
  tags: string[];
  pro_votes: number;
  con_votes: number;
  total_votes: number;
  image: string | null;
  resolved: boolean;
  resolved_side: string | null;
  resolved_at: string | null;
  created_at: string;
  author_id: string | null;
}

/**
 * DB row shape for arguments with joined profile (snake_case).
 */
export interface ArgumentRow {
  id: string;
  debate_id: string;
  author_id: string | null;
  side: string;
  content: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  profiles?: { id: string; username: string; avatar_url: string | null } | null;
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

