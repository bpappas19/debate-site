"use client";

// TODO: wire votes table and debate_follows when UI is ready; RLS and tables exist in migration.
// Voting: derive counts from votes table or use atomic SQL increments — see debatesDataLayer.ts.

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabaseClient";
import {
  fetchDebatesForHome,
  fetchDebatesForCategory,
  fetchDebateBySlug,
  fetchArgumentsForDebate,
  createDebate as dataLayerCreateDebate,
  addArgument as dataLayerAddArgument,
} from "@/lib/debatesDataLayer";
import type { Debate, Argument, CreateDebatePayload } from "@/lib/types";
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
  // Writes (centralized; can move to server actions later)
  addDebate: (payload: CreateDebatePayload) => Promise<Debate>;
  addArgument: (debateId: string, content: string, side: ArgumentSide) => Promise<void>;
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
  const [argumentsLoading, setArgumentsLoading] = useState(false);
  const [argumentsError, setArgumentsError] = useState<string | null>(null);

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
        categoryType.toLowerCase(),
        entitySlug
      );
      if (data) setDebateBySlug((prev) => ({ ...prev, [key]: data }));
      setDebateError(error);
      setDebateLoading(false);
    },
    [supabase]
  );

  const loadArgumentsForDebate = useCallback(
    async (debateId: string) => {
      if (!supabase) return;
      setArgumentsLoading(true);
      setArgumentsError(null);
      const { data, error } = await fetchArgumentsForDebate(supabase, debateId);
      setArgumentsByDebateId((prev) => ({ ...prev, [debateId]: data }));
      setArgumentsError(error);
      setArgumentsLoading(false);
    },
    [supabase]
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

  const addArgument = useCallback(
    async (debateId: string, content: string, side: ArgumentSide): Promise<void> => {
      if (!supabase) throw new Error("Supabase not configured.");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be signed in to post an argument.");
      const { data, error } = await dataLayerAddArgument(
        supabase,
        debateId,
        content,
        side,
        user.id
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
      addDebate,
      addArgument,
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
      addDebate,
      addArgument,
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
