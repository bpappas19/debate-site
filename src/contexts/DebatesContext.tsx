"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import {
  mockDebates,
  mockArgumentsByDebateId,
  mockUsers,
} from "@/lib/mock";
import type { Debate, Argument, CreateDebatePayload } from "@/lib/types";

type UserDebatesState = {
  debates: Debate[];
  argumentsByDebateId: Record<string, Argument[]>;
};

function payloadToDebate(payload: CreateDebatePayload): Debate {
  const id = "user-" + Date.now();
  return {
    id,
    categoryType: payload.categoryType,
    entityId: payload.symbolOrSlug,
    entityName: payload.entityName,
    symbolOrSlug: payload.symbolOrSlug,
    debateQuestion: payload.debateQuestion,
    description: payload.description,
    proVotes: 0,
    conVotes: 0,
    totalVotes: 0,
    createdAt: new Date(),
    tags: payload.tags ?? [],
    metadata: payload.metadata,
  };
}

function createArgumentFromPayload(
  debateId: string,
  content: string,
  side: "PRO" | "CON" | "HOLD"
): Argument {
  return {
    id: "user-arg-" + Date.now(),
    debateId,
    side,
    content,
    author: mockUsers[0],
    upvotes: 0,
    downvotes: 0,
    createdAt: new Date(),
  };
}

type DebatesContextType = {
  getMergedDebates: () => Debate[];
  getMergedDebate: (categoryType: string, entitySlug: string) => Debate | undefined;
  getMergedArguments: (debateId: string) => Argument[];
  addDebate: (payload: CreateDebatePayload) => Debate;
  addArgument: (debateId: string, content: string, side: "PRO" | "CON" | "HOLD") => void;
};

const DebatesContext = createContext<DebatesContextType | undefined>(undefined);

export function DebatesProvider({ children }: { children: ReactNode }) {
  const [userState, setUserState] = useState<UserDebatesState>({
    debates: [],
    argumentsByDebateId: {},
  });

  const addDebate = useCallback((payload: CreateDebatePayload): Debate => {
    const debate = payloadToDebate(payload);
    const newArgs: Argument[] = [];
    if (payload.firstArgument?.content && payload.firstArgument?.side) {
      const arg = createArgumentFromPayload(
        debate.id,
        payload.firstArgument.content,
        payload.firstArgument.side
      );
      newArgs.push(arg);
    }
    setUserState((prev) => ({
      debates: [...prev.debates, debate],
      argumentsByDebateId: {
        ...prev.argumentsByDebateId,
        [debate.id]: [...(prev.argumentsByDebateId[debate.id] ?? []), ...newArgs],
      },
    }));
    return debate;
  }, []);

  const addArgument = useCallback(
    (debateId: string, content: string, side: "PRO" | "CON" | "HOLD") => {
      const arg = createArgumentFromPayload(debateId, content, side);
      setUserState((prev) => ({
        ...prev,
        argumentsByDebateId: {
          ...prev.argumentsByDebateId,
          [debateId]: [...(prev.argumentsByDebateId[debateId] ?? []), arg],
        },
      }));
    },
    []
  );

  const getMergedDebates = useCallback((): Debate[] => {
    const map = new Map<string, Debate>();
    mockDebates.forEach((d) => map.set(`${d.categoryType}/${d.symbolOrSlug}`, d));
    userState.debates.forEach((d) => map.set(`${d.categoryType}/${d.symbolOrSlug}`, d));
    return Array.from(map.values());
  }, [userState.debates]);

  const getMergedDebate = useCallback(
    (categoryType: string, entitySlug: string): Debate | undefined => {
      const slug = entitySlug.toLowerCase();
      const fromUser = userState.debates.find(
        (d) => d.categoryType === categoryType && d.symbolOrSlug.toLowerCase() === slug
      );
      if (fromUser) return fromUser;
      return mockDebates.find(
        (d) => d.categoryType === categoryType && d.symbolOrSlug.toLowerCase() === slug
      );
    },
    [userState.debates]
  );

  const getMergedArguments = useCallback(
    (debateId: string): Argument[] => {
      const mockArgs = mockArgumentsByDebateId[debateId] ?? [];
      const userArgs = userState.argumentsByDebateId[debateId] ?? [];
      return [...mockArgs, ...userArgs];
    },
    [userState.argumentsByDebateId]
  );

  const value = useMemo(
    () => ({
      getMergedDebates,
      getMergedDebate,
      getMergedArguments,
      addDebate,
      addArgument,
    }),
    [getMergedDebates, getMergedDebate, getMergedArguments, addDebate, addArgument]
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
