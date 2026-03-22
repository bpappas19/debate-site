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
  UpdateDebatePayload,
  DebateRow,
  ArgumentRow,
} from "./types";
import type { CategoryType, ArgumentSide } from "./types";

/** Maps legacy DB enum value HOLD to CON until migration 0002 has run. */
function normalizeArgumentSide(raw: string): ArgumentSide {
  if (raw === "HOLD") return "CON";
  return raw as ArgumentSide;
}

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
    resolvedSide:
      row.resolved_side && row.resolved_side !== "HOLD"
        ? normalizeArgumentSide(row.resolved_side)
        : undefined,
    resolvedAt: row.resolved_at ? new Date(row.resolved_at) : undefined,
    image: row.image ?? undefined,
    tags: row.tags ?? [],
    metadata: (row.metadata as Debate["metadata"]) ?? undefined,
    authorId: row.author_id ?? undefined,
  };
}

function mapRowToArgument(row: ArgumentRow): Argument {
  const raw = row.profiles;
  const profile = Array.isArray(raw) ? raw[0] ?? null : raw ?? null;
  const displayUsername =
    row.author_username != null && row.author_username !== ""
      ? row.author_username
      : profile?.username ?? "Anonymous";
  const author: User = profile
    ? {
        id: profile.id,
        username: displayUsername,
        avatar: row.is_anonymous ? undefined : (profile.avatar_url ?? undefined),
        points: 0,
      }
    : { id: row.author_id ?? "", username: displayUsername, points: 0 };
  return {
    id: row.id,
    debateId: row.debate_id,
    side: normalizeArgumentSide(row.side),
    content: row.content,
    author,
    isAnonymous: row.is_anonymous === true,
    parentId: row.parent_id ?? undefined,
    upvotes: row.upvotes ?? 0,
    downvotes: row.downvotes ?? 0,
    createdAt: new Date(row.created_at),
  };
}

// --- Reads ---

const DEBATES_SELECT = "*";

/**
 * Home: limited set of debates ordered by created_at desc.
 * Inclusion: no published/status column yet — all rows are returned; filter with
 * isEligibleForHomepage() in the app. When we add status/is_public, add e.g.:
 *   .eq("status", "published")
 * here and in fetchDebatesForCategory for consistency.
 * SQL: select * from debates [where status = 'published'] order by created_at desc limit $limit
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
 * Same inclusion note as fetchDebatesForHome: when we add status, filter here too.
 * SQL: select * from debates where category_type = $categoryType [and status = 'published'] order by created_at desc
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
  const cat = (categoryType ?? "").trim().toLowerCase();
  const slug = (entitySlug ?? "").trim().toLowerCase();
  if (!cat || !slug) return { data: null, error: null };
  const { data, error } = await supabase
    .from("debates")
    .select(DEBATES_SELECT)
    .eq("category_type", cat)
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
  const slug = (payload.symbolOrSlug ?? "").trim().toLowerCase();
  const cat = (payload.categoryType ?? "").trim().toLowerCase();
  const imageUrl =
    payload.image_url != null && String(payload.image_url).trim() !== ""
      ? String(payload.image_url).trim()
      : null;
  const row = {
    category_type: cat,
    symbol_or_slug: slug,
    entity_id: payload.symbolOrSlug ?? slug,
    entity_name: payload.entityName,
    debate_question: payload.debateQuestion,
    description: payload.description ?? null,
    metadata: payload.metadata ?? {},
    tags: payload.tags ?? [],
    author_id: authorId,
    image: imageUrl,
  };
  const { data: inserted, error } = await supabase
    .from("debates")
    .insert(row)
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data: mapRowToDebate(inserted as DebateRow), error: null };
}

/**
 * Update a debate. RLS: only author can update. Only provided fields are updated.
 */
export async function updateDebate(
  supabase: SupabaseClient,
  debateId: string,
  payload: UpdateDebatePayload
): Promise<{ data: Debate | null; error: string | null }> {
  const updates: Record<string, unknown> = {};
  if (payload.debateQuestion !== undefined) updates.debate_question = payload.debateQuestion;
  if (payload.description !== undefined) updates.description = payload.description ?? null;
  if (payload.entityName !== undefined) updates.entity_name = payload.entityName;
  if (payload.tags !== undefined) updates.tags = payload.tags;
  if (payload.metadata !== undefined) updates.metadata = payload.metadata;
  if (payload.image_url !== undefined) {
    updates.image =
      payload.image_url != null && String(payload.image_url).trim() !== ""
        ? String(payload.image_url).trim()
        : null;
  }
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabase
    .from("debates")
    .update(updates)
    .eq("id", debateId)
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data ? mapRowToDebate(data as DebateRow) : null, error: null };
}

export async function addArgument(
  supabase: SupabaseClient,
  debateId: string,
  content: string,
  side: ArgumentSide,
  authorId: string,
  options?: { authorUsername: string; isAnonymous?: boolean; parentId?: string | null }
): Promise<{ data: Argument | null; error: string | null }> {
  const row: Record<string, unknown> = {
    debate_id: debateId,
    author_id: authorId,
    side,
    content,
  };
  if (options?.authorUsername != null) {
    row.author_username = options.authorUsername;
    row.is_anonymous = options.isAnonymous === true;
  }
  if (options?.parentId != null) {
    row.parent_id = options.parentId;
  }
  const { data: inserted, error } = await supabase
    .from("arguments")
    .insert(row)
    .select("id, debate_id, author_id, side, content, upvotes, downvotes, created_at, author_username, is_anonymous, profiles(id, username, avatar_url)")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: mapRowToArgument(inserted as ArgumentRow), error: null };
}

export async function updateArgument(
  supabase: SupabaseClient,
  argumentId: string,
  content: string
): Promise<{ data: Argument | null; error: string | null }> {
  const { data: updated, error } = await supabase
    .from("arguments")
    .update({ content: content.trim() })
    .eq("id", argumentId)
    .select("*, profiles(id, username, avatar_url)")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: mapRowToArgument(updated as ArgumentRow), error: null };
}

export async function deleteArgument(
  supabase: SupabaseClient,
  argumentId: string
): Promise<{ error: string | null }> {
  const { data, error } = await supabase
    .from("arguments")
    .delete()
    .eq("id", argumentId)
    .select("id");
  if (error) return { error: error.message };
  if (!data || data.length === 0) {
    return { error: "Could not delete (forbidden or not found). Make sure the arguments DELETE policy is applied." };
  }
  return { error: null };
}

/** Argument IDs the given user has upvoted in this debate (for "liked" state). */
export async function fetchArgumentVoteIdsForDebate(
  supabase: SupabaseClient,
  debateId: string,
  userId: string
): Promise<{ data: string[]; error: string | null }> {
  const { data: args } = await supabase
    .from("arguments")
    .select("id")
    .eq("debate_id", debateId);
  const argumentIds = (args ?? []).map((a: { id: string }) => a.id);
  if (argumentIds.length === 0) return { data: [], error: null };
  const { data, error } = await supabase
    .from("argument_votes")
    .select("argument_id")
    .eq("user_id", userId)
    .in("argument_id", argumentIds);
  if (error) return { data: [], error: error.message };
  return { data: (data ?? []).map((r: { argument_id: string }) => r.argument_id), error: null };
}

export async function voteArgument(
  supabase: SupabaseClient,
  argumentId: string,
  userId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("argument_votes").insert({ argument_id: argumentId, user_id: userId });
  return { error: error ? error.message : null };
}

export async function removeArgumentVote(
  supabase: SupabaseClient,
  argumentId: string,
  userId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("argument_votes")
    .delete()
    .eq("argument_id", argumentId)
    .eq("user_id", userId);
  return { error: error ? error.message : null };
}

// TODO: Voting (debate-level pro/con) — when implemented, either:
// - derive pro_votes/con_votes from the votes table (e.g. COUNT per side), or
// - use atomic increments in SQL (UPDATE debates SET pro_votes = pro_votes + 1 WHERE id = $1).
// Do not update vote counts with read-then-write in application code (race conditions).
