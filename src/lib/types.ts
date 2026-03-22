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

/** Generic argument side. Stocks display as Bull / Bear; other categories as Pro / Con, etc. */
export type ArgumentSide = "PRO" | "CON";

/** Legacy YES/NO for backward compatibility where needed. Maps: YES → PRO, NO → CON. */
export type Side = "YES" | "NO";

export interface User {
  id: string;
  username: string;
  avatar?: string;
  points: number;
}

/** Single argument in a debate. Side is generic (PRO/CON). */
export interface Argument {
  id: string;
  debateId: string;
  side: ArgumentSide;
  content: string;
  author: User;
  /** When true, author_username is a generated anonymous name; real author_id still stored for ownership. */
  isAnonymous?: boolean;
  /** Parent argument id when this is a reply; null for top-level. */
  parentId?: string | null;
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
  /** Creator user id; used to show Edit button and enforce update RLS. */
  authorId?: string | null;
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
  /** Snapshot display name at post time; used when is_anonymous or for legacy display. */
  author_username?: string | null;
  is_anonymous?: boolean;
  parent_id?: string | null;
  /** PostgREST may return a single object or a one-element array for FK embeds. */
  profiles?:
    | { id: string; username: string; avatar_url: string | null }
    | { id: string; username: string; avatar_url: string | null }[]
    | null;
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
  /** Optional image URL for the debate card. */
  image_url?: string | null;
  /** For stocks: { ticker, sector? }. Other categories can add their own shape. */
  metadata?: Record<string, unknown> | StockMetadata;
  firstArgument?: { content: string; side: ArgumentSide };
}

/** Payload for updating a debate. Only included fields are updated. Author-only (enforced by RLS). */
export interface UpdateDebatePayload {
  debateQuestion?: string;
  description?: string;
  entityName?: string;
  image_url?: string | null;
  tags?: string[];
  metadata?: Record<string, unknown> | StockMetadata;
}

