"use client";

// TODO: wire votes table and debate_follows when UI is ready; RLS and tables exist in migration.
// Voting: derive counts from votes table or use atomic SQL increments — see debatesDataLayer.ts.

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabaseClient";
import {
  fetchDebatesForHome,
  fetchDebatesForCategory,
  fetchDebateBySlug,
  fetchArgumentsForDebate,
  fetchArgumentVoteIdsForDebate,
  createDebate as dataLayerCreateDebate,
  updateDebate as dataLayerUpdateDebate,
  addArgument as dataLayerAddArgument,
  updateArgument as dataLayerUpdateArgument,
  deleteArgument as dataLayerDeleteArgument,
  voteArgument as dataLayerVoteArgument,
  removeArgumentVote as dataLayerRemoveArgumentVote,
} from "@/lib/debatesDataLayer";
import type { Debate, Argument, CreateDebatePayload, UpdateDebatePayload } from "@/lib/types";
import type { ArgumentSide } from "@/lib/types";

type DebatesContextType = {
  // Getters (read from cache)
  getMergedDebates: () => Debate[];
  getCategoryDebates: (categoryType: string) => Debate[];
  getMergedDebate: (categoryType: string, entitySlug: string) => Debate | undefined;
  getMergedArguments: (debateId: string) => Argument[];
  // Fetches (run query, update cache)
  fetchHomeDebates: (limit?: number) => Promise<void>;
  fetchCategoryDebates: (categoryType: string) => Promise<void>;
  fetchDebate: (categoryType: string, entitySlug: string) => Promise<void>;
  loadArgumentsForDebate: (debateId: string) => Promise<void>;
  getVotedArgumentIds: (debateId: string) => string[];
  // Writes (centralized; can move to server actions later)
  addDebate: (payload: CreateDebatePayload) => Promise<Debate>;
  updateDebate: (debateId: string, payload: UpdateDebatePayload) => Promise<Debate>;
  addArgument: (debateId: string, content: string, side: ArgumentSide, options?: { postAnonymously?: boolean; parentId?: string | null }) => Promise<void>;
  updateArgument: (debateId: string, argumentId: string, content: string) => Promise<void>;
  deleteArgument: (debateId: string, argumentId: string) => Promise<void>;
  voteArgument: (debateId: string, argumentId: string) => Promise<void>;
  unvoteArgument: (debateId: string, argumentId: string) => Promise<void>;
  // Loading & error (per-query)
  homeLoading: boolean;
  homeError: string | null;
  categoryLoading: boolean;
  categoryError: string | null;
  debateLoading: boolean;
  debateError: string | null;
  argumentsLoading: boolean;
  argumentsError: string | null;
  // Backward-compat aliases for pages that still use these names
  debatesLoading: boolean;
  debatesError: string | null;
};

const DebatesContext = createContext<DebatesContextType | undefined>(undefined);

function slugKey(categoryType: string, entitySlug: string): string {
  return `${categoryType.toLowerCase()}/${entitySlug.toLowerCase()}`;
}

export function DebatesProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);

  // Caches
  const [homeDebates, setHomeDebates] = useState<Debate[]>([]);
  const [homeLoading, setHomeLoading] = useState(false);
  const [homeError, setHomeError] = useState<string | null>(null);

  const [categoryDebates, setCategoryDebates] = useState<Record<string, Debate[]>>({});
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const [debateBySlug, setDebateBySlug] = useState<Record<string, Debate>>({});
  const [debateLoading, setDebateLoading] = useState(false);
  const [debateError, setDebateError] = useState<string | null>(null);

  const [argumentsByDebateId, setArgumentsByDebateId] = useState<Record<string, Argument[]>>({});
  const [votedArgumentIdsByDebateId, setVotedArgumentIdsByDebateId] = useState<Record<string, string[]>>({});
  const [argumentsLoading, setArgumentsLoading] = useState(false);
  const [argumentsError, setArgumentsError] = useState<string | null>(null);
  const deleteIdsRef = useRef<Set<string>>(new Set());

  const fetchHomeDebates = useCallback(
    async (limit: number = 50) => {
      if (!supabase) {
        setHomeError("Supabase not configured.");
        return;
      }
      setHomeLoading(true);
      setHomeError(null);
      const { data, error } = await fetchDebatesForHome(supabase, limit);
      setHomeDebates(data);
      setHomeError(error);
      setHomeLoading(false);
    },
    [supabase]
  );

  const fetchCategoryDebates = useCallback(
    async (categoryType: string) => {
      if (!supabase) {
        setCategoryError("Supabase not configured.");
        return;
      }
      const cat = categoryType.toLowerCase();
      setCategoryLoading(true);
      setCategoryError(null);
      const { data, error } = await fetchDebatesForCategory(supabase, cat);
      setCategoryDebates((prev) => ({ ...prev, [cat]: data }));
      setCategoryError(error);
      setCategoryLoading(false);
    },
    [supabase]
  );

  const fetchDebate = useCallback(
    async (categoryType: string, entitySlug: string) => {
      if (!supabase) {
        setDebateError("Supabase not configured.");
        return;
      }
      const key = slugKey(categoryType, entitySlug);
      setDebateLoading(true);
      setDebateError(null);
      const { data, error } = await fetchDebateBySlug(
        supabase,
        (categoryType ?? "").trim().toLowerCase(),
        (entitySlug ?? "").trim().toLowerCase()
      );
      if (data) {
        setDebateBySlug((prev) => ({ ...prev, [key]: data }));
      } else if (!error && homeDebates.length > 0) {
        const found = homeDebates.find(
          (d) =>
            d.categoryType.toLowerCase() === (categoryType ?? "").trim().toLowerCase() &&
            d.symbolOrSlug.toLowerCase() === (entitySlug ?? "").trim().toLowerCase()
        );
        if (found) setDebateBySlug((prev) => ({ ...prev, [key]: found }));
      }
      setDebateError(error);
      setDebateLoading(false);
    },
    [supabase, homeDebates]
  );

  const loadArgumentsForDebate = useCallback(
    async (debateId: string) => {
      if (!supabase) return;
      setArgumentsLoading(true);
      setArgumentsError(null);
      const { data, error } = await fetchArgumentsForDebate(supabase, debateId);
      setArgumentsByDebateId((prev) => ({ ...prev, [debateId]: data }));
      setArgumentsError(error);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: voteIds } = await fetchArgumentVoteIdsForDebate(supabase, debateId, user.id);
        setVotedArgumentIdsByDebateId((prev) => ({ ...prev, [debateId]: voteIds ?? [] }));
      }
      setArgumentsLoading(false);
    },
    [supabase]
  );

  const getVotedArgumentIds = useCallback(
    (debateId: string) => votedArgumentIdsByDebateId[debateId] ?? [],
    [votedArgumentIdsByDebateId]
  );

  const getMergedDebates = useCallback(() => homeDebates, [homeDebates]);
  const getCategoryDebates = useCallback(
    (categoryType: string) => categoryDebates[categoryType.toLowerCase()] ?? [],
    [categoryDebates]
  );
  const getMergedDebate = useCallback(
    (categoryType: string, entitySlug: string) =>
      debateBySlug[slugKey(categoryType, entitySlug)],
    [debateBySlug]
  );
  const getMergedArguments = useCallback(
    (debateId: string) => argumentsByDebateId[debateId] ?? [],
    [argumentsByDebateId]
  );

  const addDebate = useCallback(
    async (payload: CreateDebatePayload): Promise<Debate> => {
      if (!supabase) throw new Error("Supabase not configured.");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be signed in to create a debate.");
      const { data, error } = await dataLayerCreateDebate(supabase, payload, user.id);
      if (error) throw new Error(error);
      if (!data) throw new Error("Failed to create debate.");
      setHomeDebates((prev) => [data, ...prev]);
      setDebateBySlug((prev) => ({
        ...prev,
        [slugKey(payload.categoryType, payload.symbolOrSlug)]: data,
      }));
      if (payload.firstArgument?.content && payload.firstArgument?.side) {
        const { data: arg, error: argErr } = await dataLayerAddArgument(
          supabase,
          data.id,
          payload.firstArgument.content,
          payload.firstArgument.side,
          user.id
        );
        if (!argErr && arg)
          setArgumentsByDebateId((prev) => ({
            ...prev,
            [data.id]: [arg],
          }));
      }
      return data;
    },
    [supabase]
  );

  const updateDebate = useCallback(
    async (debateId: string, payload: UpdateDebatePayload): Promise<Debate> => {
      if (!supabase) throw new Error("Supabase not configured.");
      const { data, error } = await dataLayerUpdateDebate(supabase, debateId, payload);
      if (error) throw new Error(error);
      if (!data) throw new Error("Failed to update debate.");
      const key = slugKey(data.categoryType, data.symbolOrSlug);
      setDebateBySlug((prev) => ({ ...prev, [key]: data }));
      setHomeDebates((prev) =>
        prev.map((d) => (d.id === data.id ? data : d))
      );
      setCategoryDebates((prev) => {
        const cat = data.categoryType.toLowerCase();
        const list = prev[cat] ?? [];
        const idx = list.findIndex((d) => d.id === data.id);
        if (idx < 0) return prev;
        const next = [...list];
        next[idx] = data;
        return { ...prev, [cat]: next };
      });
      return data;
    },
    [supabase]
  );

  const addArgument = useCallback(
    async (
      debateId: string,
      content: string,
      side: ArgumentSide,
      options?: { postAnonymously?: boolean; parentId?: string | null }
    ): Promise<void> => {
      if (!supabase) throw new Error("Supabase not configured.");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be signed in to post an argument.");
      let authorUsername: string;
      let isAnonymous = false;
      if (options?.postAnonymously) {
        const { generateAnonymousUsername } = await import("@/lib/anonymousUsername");
        authorUsername = generateAnonymousUsername();
        isAnonymous = true;
      } else {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .maybeSingle();
        authorUsername =
          profile?.username ??
          (user.user_metadata?.username as string | undefined) ??
          user.email?.split("@")[0] ??
          "User";
      }
      const { data, error } = await dataLayerAddArgument(
        supabase,
        debateId,
        content,
        side,
        user.id,
        { authorUsername, isAnonymous, parentId: options?.parentId ?? undefined }
      );
      if (error) throw new Error(error);
      if (!data) throw new Error("Failed to post argument.");
      setArgumentsByDebateId((prev) => ({
        ...prev,
        [debateId]: [...(prev[debateId] ?? []), data],
      }));
    },
    [supabase]
  );

  const updateArgument = useCallback(
    async (debateId: string, argumentId: string, content: string): Promise<void> => {
      if (!supabase) throw new Error("Supabase not configured.");
      const { data, error } = await dataLayerUpdateArgument(supabase, argumentId, content.trim());
      if (error) throw new Error(error);
      if (!data) throw new Error("Failed to update argument.");
      setArgumentsByDebateId((prev) => {
        const list = prev[debateId] ?? [];
        const next = list.map((a) => (a.id === argumentId ? data : a));
        return { ...prev, [debateId]: next };
      });
    },
    [supabase]
  );

  const deleteArgument = useCallback(
    async (debateId: string, argumentId: string): Promise<void> => {
      if (!supabase) throw new Error("Supabase not configured.");
      const { error } = await dataLayerDeleteArgument(supabase, argumentId);
      if (error) throw new Error(error);
      setArgumentsByDebateId((prev) => {
        const list = prev[debateId] ?? [];
        const idsToRemove = new Set<string>([argumentId]);
        let added = true;
        while (added) {
          added = false;
          for (const a of list) {
            if (a.parentId && idsToRemove.has(a.parentId) && !idsToRemove.has(a.id)) {
              idsToRemove.add(a.id);
              added = true;
            }
          }
        }
        deleteIdsRef.current = idsToRemove;
        const next = list.filter((a) => !idsToRemove.has(a.id));
        return { ...prev, [debateId]: next };
      });
      setVotedArgumentIdsByDebateId((prev) => {
        const idsToRemove = deleteIdsRef.current;
        return {
          ...prev,
          [debateId]: (prev[debateId] ?? []).filter((id) => !idsToRemove.has(id)),
        };
      });
      await loadArgumentsForDebate(debateId);
    },
    [supabase, loadArgumentsForDebate]
  );

  const voteArgument = useCallback(
    async (debateId: string, argumentId: string): Promise<void> => {
      if (!supabase) throw new Error("Supabase not configured.");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be signed in to like a comment.");
      const { error } = await dataLayerVoteArgument(supabase, argumentId, user.id);
      if (error) throw new Error(error);
      setVotedArgumentIdsByDebateId((prev) => ({
        ...prev,
        [debateId]: [...(prev[debateId] ?? []), argumentId],
      }));
      setArgumentsByDebateId((prev) => {
        const list = prev[debateId] ?? [];
        return {
          ...prev,
          [debateId]: list.map((a) =>
            a.id === argumentId ? { ...a, upvotes: a.upvotes + 1 } : a
          ),
        };
      });
    },
    [supabase]
  );

  const unvoteArgument = useCallback(
    async (debateId: string, argumentId: string): Promise<void> => {
      if (!supabase) throw new Error("Supabase not configured.");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await dataLayerRemoveArgumentVote(supabase, argumentId, user.id);
      if (error) throw new Error(error);
      setVotedArgumentIdsByDebateId((prev) => ({
        ...prev,
        [debateId]: (prev[debateId] ?? []).filter((id) => id !== argumentId),
      }));
      setArgumentsByDebateId((prev) => {
        const list = prev[debateId] ?? [];
        return {
          ...prev,
          [debateId]: list.map((a) =>
            a.id === argumentId ? { ...a, upvotes: Math.max(0, a.upvotes - 1) } : a
          ),
        };
      });
    },
    [supabase]
  );

  const value = useMemo(
    () => ({
      getMergedDebates,
      getCategoryDebates,
      getMergedDebate,
      getMergedArguments,
      fetchHomeDebates,
      fetchCategoryDebates,
      fetchDebate,
      loadArgumentsForDebate,
      getVotedArgumentIds,
      addDebate,
      updateDebate,
      addArgument,
      updateArgument,
      deleteArgument,
      voteArgument,
      unvoteArgument,
      homeLoading,
      homeError,
      categoryLoading,
      categoryError,
      debateLoading,
      debateError,
      argumentsLoading,
      argumentsError,
      debatesLoading: homeLoading,
      debatesError: homeError,
    }),
    [
      getMergedDebates,
      getCategoryDebates,
      getMergedDebate,
      getMergedArguments,
      fetchHomeDebates,
      fetchCategoryDebates,
      fetchDebate,
      loadArgumentsForDebate,
      getVotedArgumentIds,
      addDebate,
      updateDebate,
      addArgument,
      updateArgument,
      deleteArgument,
      voteArgument,
      unvoteArgument,
      homeLoading,
      homeError,
      categoryLoading,
      categoryError,
      debateLoading,
      debateError,
      argumentsLoading,
      argumentsError,
    ]
  );

  return (
    <DebatesContext.Provider value={value}>{children}</DebatesContext.Provider>
  );
}

export function useDebates() {
  const ctx = useContext(DebatesContext);
  if (ctx === undefined) {
    throw new Error("useDebates must be used within a DebatesProvider");
  }
  return ctx;
}
