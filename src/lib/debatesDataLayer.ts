/**
 * Centralized data layer for debates and arguments.
 * All Supabase reads/writes go through this module so they can be moved to
 * server actions later without scattering logic across components.
 *
 * Takes a Supabase client so the same functions work from:
 * - DebatesContext (browser client)
 * - Future server actions (server client)
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Debate,
  Argument,
  User,
  CreateDebatePayload,
  DebateRow,
  ArgumentRow,
} from "./types";
import type { CategoryType, ArgumentSide } from "./types";

// --- Mappers: ensure created_at (and any date strings) become Date for UI types ---

function mapRowToDebate(row: DebateRow): Debate {
  return {
    id: row.id,
    categoryType: row.category_type as CategoryType,
    entityId: row.entity_id,
    entityName: row.entity_name,
    symbolOrSlug: row.symbol_or_slug,
    debateQuestion: row.debate_question,
    description: row.description ?? undefined,
    proVotes: row.pro_votes ?? 0,
    conVotes: row.con_votes ?? 0,
    totalVotes: row.total_votes ?? row.pro_votes + row.con_votes,
    createdAt: new Date(row.created_at),
    resolved: row.resolved ?? false,
    resolvedSide: (row.resolved_side as Debate["resolvedSide"]) ?? undefined,
    resolvedAt: row.resolved_at ? new Date(row.resolved_at) : undefined,
    image: row.image ?? undefined,
    tags: row.tags ?? [],
    metadata: (row.metadata as Debate["metadata"]) ?? undefined,
  };
}

function mapRowToArgument(row: ArgumentRow): Argument {
  const profile = row.profiles;
  const author: User = profile
    ? {
        id: profile.id,
        username: profile.username,
        avatar: profile.avatar_url ?? undefined,
        points: 0, // TODO: wire leaderboard when profiles/votes are used
      }
    : { id: "", username: "Anonymous", points: 0 };
  return {
    id: row.id,
    debateId: row.debate_id,
    side: row.side as ArgumentSide,
    content: row.content,
    author,
    upvotes: row.upvotes ?? 0,
    downvotes: row.downvotes ?? 0,
    createdAt: new Date(row.created_at),
  };
}

// --- Reads ---

const DEBATES_SELECT = "*";

/**
 * Home: limited set of debates ordered by created_at desc.
 * SQL: select * from debates order by created_at desc limit $limit
 */
export async function fetchDebatesForHome(
  supabase: SupabaseClient,
  limit: number = 50
): Promise<{ data: Debate[]; error: string | null }> {
  const { data, error } = await supabase
    .from("debates")
    .select(DEBATES_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return { data: [], error: error.message };
  return {
    data: (data ?? []).map((row: DebateRow) => mapRowToDebate(row)),
    error: null,
  };
}

/**
 * Category: debates for one category, ordered by created_at desc.
 * SQL: select * from debates where category_type = $categoryType order by created_at desc
 */
export async function fetchDebatesForCategory(
  supabase: SupabaseClient,
  categoryType: string
): Promise<{ data: Debate[]; error: string | null }> {
  const { data, error } = await supabase
    .from("debates")
    .select(DEBATES_SELECT)
    .eq("category_type", categoryType)
    .order("created_at", { ascending: false });
  if (error) return { data: [], error: error.message };
  return {
    data: (data ?? []).map((row: DebateRow) => mapRowToDebate(row)),
    error: null,
  };
}

/**
 * Debate detail: single debate by category and slug.
 * SQL: select * from debates where category_type = $categoryType and symbol_or_slug = $entitySlug limit 1
 */
export async function fetchDebateBySlug(
  supabase: SupabaseClient,
  categoryType: string,
  entitySlug: string
): Promise<{ data: Debate | null; error: string | null }> {
  const slug = entitySlug.toLowerCase();
  const { data, error } = await supabase
    .from("debates")
    .select(DEBATES_SELECT)
    .eq("category_type", categoryType)
    .eq("symbol_or_slug", slug)
    .limit(1)
    .maybeSingle();
  if (error) return { data: null, error: error.message };
  return {
    data: data ? mapRowToDebate(data as DebateRow) : null,
    error: null,
  };
}

/**
 * Arguments for a debate, ordered by created_at asc.
 * SQL: select * from arguments where debate_id = $debateId order by created_at asc
 */
export async function fetchArgumentsForDebate(
  supabase: SupabaseClient,
  debateId: string
): Promise<{ data: Argument[]; error: string | null }> {
  const { data, error } = await supabase
    .from("arguments")
    .select("*, profiles(id, username, avatar_url)")
    .eq("debate_id", debateId)
    .order("created_at", { ascending: true });
  if (error) return { data: [], error: error.message };
  return {
    data: (data ?? []).map((row: ArgumentRow) => mapRowToArgument(row)),
    error: null,
  };
}

// --- Writes (client-side for MVP; can be moved to server actions later) ---

export async function createDebate(
  supabase: SupabaseClient,
  payload: CreateDebatePayload,
  authorId: string
): Promise<{ data: Debate | null; error: string | null }> {
  const row = {
    category_type: payload.categoryType,
    symbol_or_slug: payload.symbolOrSlug,
    entity_id: payload.symbolOrSlug,
    entity_name: payload.entityName,
    debate_question: payload.debateQuestion,
    description: payload.description ?? null,
    metadata: payload.metadata ?? {},
    tags: payload.tags ?? [],
    author_id: authorId,
  };
  const { data: inserted, error } = await supabase
    .from("debates")
    .insert(row)
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data: mapRowToDebate(inserted as DebateRow), error: null };
}

export async function addArgument(
  supabase: SupabaseClient,
  debateId: string,
  content: string,
  side: ArgumentSide,
  authorId: string
): Promise<{ data: Argument | null; error: string | null }> {
  const { data: inserted, error } = await supabase
    .from("arguments")
    .insert({
      debate_id: debateId,
      author_id: authorId,
      side,
      content,
    })
    .select("*, profiles(id, username, avatar_url)")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: mapRowToArgument(inserted as ArgumentRow), error: null };
}

// TODO: Voting — when implemented, either:
// - derive pro_votes/con_votes from the votes table (e.g. COUNT per side), or
// - use atomic increments in SQL (UPDATE debates SET pro_votes = pro_votes + 1 WHERE id = $1).
// Do not update vote counts with read-then-write in application code (race conditions).
