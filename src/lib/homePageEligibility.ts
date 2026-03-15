/**
 * Homepage/category inclusion logic: which debates are valid and shown on the main feed.
 *
 * RULES:
 * - Only show debates that are valid, published, and meant for public display.
 * - Exclude drafts, deleted/hidden, or anything not ready for public display.
 *
 * CURRENT STATE: The DB has no `published`, `status`, `is_public`, or `is_hidden` column yet.
 * Until we add one (e.g. status = 'published' or is_public = true), we treat all debates
 * returned by the API as eligible. When a column is added, update:
 * 1. supabase migration (add column + default)
 * 2. fetchDebatesForHome / fetchDebatesForCategory in debatesDataLayer.ts (.eq('status', 'published'))
 * 3. This filter to match (e.g. exclude drafts if stored in client-only shape).
 */
import type { Debate } from "./types";

export function isEligibleForHomepage(debate: Debate): boolean {
  // When we add status: return debate.status === 'published';
  // When we add is_hidden: return !debate.isHidden;
  return true;
}
