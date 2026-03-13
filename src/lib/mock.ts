/**
 * Mock data for the debate platform.
 * Structured generically (Debate + Argument by categoryType) with stocks as the first vertical.
 * Future categories can add debates/arguments without refactoring this file.
 */
import type { Debate, Argument, User, StockMetadata } from "./types";

export const mockUsers: User[] = [
  {
    id: "1",
    username: "alice_debater",
    points: 1250,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "2",
    username: "bob_thinker",
    points: 980,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "3",
    username: "charlie_logical",
    points: 2100,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "4",
    username: "diana_wise",
    points: 1750,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: "5",
    username: "eve_analyst",
    points: 890,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
];

/** Stock metadata for each ticker (MVP: ticker + sector only, no API data). */
const stockMeta: Record<string, StockMetadata> = {
  NVDA: { ticker: "NVDA", sector: "Technology" },
  TSLA: { ticker: "TSLA", sector: "Consumer Cyclical" },
  PLTR: { ticker: "PLTR", sector: "Technology" },
  META: { ticker: "META", sector: "Technology" },
  AMD: { ticker: "AMD", sector: "Technology" },
  RKLB: { ticker: "RKLB", sector: "Industrials" },
  SOFI: { ticker: "SOFI", sector: "Financial Services" },
  HIMS: { ticker: "HIMS", sector: "Healthcare" },
  ACHR: { ticker: "ACHR", sector: "Industrials" },
};

/** All debates. At launch only stocks vertical is populated. */
export const mockDebates: Debate[] = [
  {
    id: "d-nvda",
    categoryType: "stocks",
    entityId: "nvda",
    entityName: "NVIDIA Corporation",
    symbolOrSlug: "nvda",
    debateQuestion: "Is NVIDIA fairly valued at current levels?",
    description:
      "NVIDIA dominates AI and data center GPUs. Debate whether the valuation is justified by growth and moat.",
    proVotes: 2840,
    conVotes: 1160,
    totalVotes: 4000,
    createdAt: new Date("2024-01-15"),
    tags: ["AI", "semiconductors", "data-center"],
    metadata: stockMeta.NVDA,
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
  },
  {
    id: "d-tsla",
    categoryType: "stocks",
    entityId: "tsla",
    entityName: "Tesla, Inc.",
    symbolOrSlug: "tsla",
    debateQuestion: "Will Tesla maintain EV market share as competition grows?",
    description:
      "Legacy automakers and Chinese EV makers are scaling. Can Tesla defend share and margins?",
    proVotes: 1920,
    conVotes: 2080,
    totalVotes: 4000,
    createdAt: new Date("2024-01-20"),
    tags: ["EV", "automotive", "energy"],
    metadata: stockMeta.TSLA,
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=450&fit=crop",
  },
  {
    id: "d-pltr",
    categoryType: "stocks",
    entityId: "pltr",
    entityName: "Palantir Technologies",
    symbolOrSlug: "pltr",
    debateQuestion: "Is Palantir's government and commercial growth sustainable?",
    description:
      "Palantir has grown revenue sharply. Debate durability of contracts and commercial adoption.",
    proVotes: 2150,
    conVotes: 1850,
    totalVotes: 4000,
    createdAt: new Date("2024-01-25"),
    tags: ["software", "government", "AI"],
    metadata: stockMeta.PLTR,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
  },
  {
    id: "d-meta",
    categoryType: "stocks",
    entityId: "meta",
    entityName: "Meta Platforms",
    symbolOrSlug: "meta",
    debateQuestion: "Is Meta's bet on the metaverse and AI the right capital allocation?",
    description:
      "Meta spends heavily on Reality Labs and AI. Is this the right use of cash flow?",
    proVotes: 1650,
    conVotes: 2350,
    totalVotes: 4000,
    createdAt: new Date("2024-02-01"),
    tags: ["social", "advertising", "metaverse", "AI"],
    metadata: stockMeta.META,
    image:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=450&fit=crop",
  },
  {
    id: "d-amd",
    categoryType: "stocks",
    entityId: "amd",
    entityName: "Advanced Micro Devices",
    symbolOrSlug: "amd",
    debateQuestion: "Can AMD gain meaningful datacenter share from NVIDIA?",
    description:
      "AMD has competitive MI300. Can it take durable share in AI training and inference?",
    proVotes: 2200,
    conVotes: 1800,
    totalVotes: 4000,
    createdAt: new Date("2024-02-05"),
    tags: ["AI", "semiconductors", "datacenter"],
    metadata: stockMeta.AMD,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop",
  },
  {
    id: "d-rklb",
    categoryType: "stocks",
    entityId: "rklb",
    entityName: "Rocket Lab USA",
    symbolOrSlug: "rklb",
    debateQuestion: "Is Rocket Lab the best pure-play space investment?",
    description:
      "Rocket Lab has launch and space systems. Debate its path to profitability and vs. peers.",
    proVotes: 2480,
    conVotes: 1520,
    totalVotes: 4000,
    createdAt: new Date("2024-02-10"),
    tags: ["space", "launch", "defense"],
    metadata: stockMeta.RKLB,
    image:
      "https://images.unsplash.com/photo-1446776811953-b68d0a6b1fdb?w=800&h=450&fit=crop",
  },
  {
    id: "d-sofi",
    categoryType: "stocks",
    entityId: "sofi",
    entityName: "SoFi Technologies",
    symbolOrSlug: "sofi",
    debateQuestion: "Will SoFi achieve sustained profitability and multiple expansion?",
    description:
      "SoFi is growing members and revenue. Can it prove a durable fintech model?",
    proVotes: 1980,
    conVotes: 2020,
    totalVotes: 4000,
    createdAt: new Date("2024-02-12"),
    tags: ["fintech", "lending", "banking"],
    metadata: stockMeta.SOFI,
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=450&fit=crop",
  },
  {
    id: "d-hims",
    categoryType: "stocks",
    entityId: "hims",
    entityName: "Hims & Hers Health",
    symbolOrSlug: "hims",
    debateQuestion: "Is Hims & Hers a durable telehealth and wellness brand?",
    description:
      "Hims has scaled DTC telehealth. Debate brand moat and unit economics.",
    proVotes: 2320,
    conVotes: 1680,
    totalVotes: 4000,
    createdAt: new Date("2024-02-14"),
    tags: ["healthcare", "telehealth", "DTC"],
    metadata: stockMeta.HIMS,
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=450&fit=crop",
  },
  {
    id: "d-achr",
    categoryType: "stocks",
    entityId: "achr",
    entityName: "Archer Aviation",
    symbolOrSlug: "achr",
    debateQuestion: "Will Archer win the urban air mobility race?",
    description:
      "Archer is developing eVTOLs. Debate commercialization timeline and capital needs.",
    proVotes: 1120,
    conVotes: 2880,
    totalVotes: 4000,
    createdAt: new Date("2024-02-18"),
    tags: ["eVTOL", "urban-mobility", "aviation"],
    metadata: stockMeta.ACHR,
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=450&fit=crop",
  },
];

/** Arguments keyed by debate id. Sides are generic PRO/CON (displayed as Bull/Bear for stocks). */
export const mockArgumentsByDebateId: Record<string, Argument[]> = {
  "d-nvda": [
    {
      id: "arg-nvda-1",
      debateId: "d-nvda",
      side: "PRO",
      content:
        "NVIDIA has a near-monopoly in AI training and inference. Data center growth is just starting; every major cloud and enterprise will need more GPUs. The moat is software (CUDA) plus hardware. Valuation is justified by multi-year visibility.",
      author: mockUsers[0],
      upvotes: 445,
      downvotes: 32,
      createdAt: new Date("2024-01-16"),
    },
    {
      id: "arg-nvda-2",
      debateId: "d-nvda",
      side: "CON",
      content:
        "At 60+ P/E, much of the AI buildout is already priced in. Competition from AMD, custom silicon, and potential demand digestion could compress multiples. One or two weak quarters would hit the stock hard.",
      author: mockUsers[1],
      upvotes: 289,
      downvotes: 45,
      createdAt: new Date("2024-01-16"),
    },
    {
      id: "arg-nvda-3",
      debateId: "d-nvda",
      side: "PRO",
      content:
        "CUDA ecosystem lock-in is underappreciated. Migrating workloads to AMD or in-house chips is costly and slow. NVIDIA will remain the default choice for years, supporting premium pricing and margins.",
      author: mockUsers[3],
      upvotes: 312,
      downvotes: 28,
      createdAt: new Date("2024-01-17"),
    },
  ],
  "d-tsla": [
    {
      id: "arg-tsla-1",
      debateId: "d-tsla",
      side: "PRO",
      content:
        "Tesla has brand, software, and scale. Competitors are still losing money on EVs. Cybertruck and next-gen platform can expand TAM. Energy storage is a second growth engine.",
      author: mockUsers[2],
      upvotes: 278,
      downvotes: 56,
      createdAt: new Date("2024-01-21"),
    },
    {
      id: "arg-tsla-2",
      debateId: "d-tsla",
      side: "CON",
      content:
        "Chinese OEMs are winning on cost and features. Tesla's margins have peaked; price cuts will continue. FSD and robotaxi are unproven. The stock is still priced for perfection.",
      author: mockUsers[4],
      upvotes: 301,
      downvotes: 47,
      createdAt: new Date("2024-01-21"),
    },
  ],
  "d-pltr": [
    {
      id: "arg-pltr-1",
      debateId: "d-pltr",
      side: "PRO",
      content:
        "AIP is a real product with strong adoption. Government contracts are sticky and growing. Commercial pipeline is diversifying. Margins are improving as scale kicks in.",
      author: mockUsers[0],
      upvotes: 356,
      downvotes: 42,
      createdAt: new Date("2024-01-26"),
    },
    {
      id: "arg-pltr-2",
      debateId: "d-pltr",
      side: "CON",
      content:
        "Valuation remains extreme for a company that was unprofitable for years. Competition from big cloud and specialized AI tools could cap upside. One or two contract delays would hurt sentiment.",
      author: mockUsers[1],
      upvotes: 189,
      downvotes: 64,
      createdAt: new Date("2024-01-26"),
    },
  ],
  "d-meta": [
    {
      id: "arg-meta-1",
      debateId: "d-meta",
      side: "PRO",
      content:
        "Core ads business is a cash machine. Reels and AI recommendations are engaging. Reality Labs is a long-dated option; AI investments are necessary to stay relevant.",
      author: mockUsers[3],
      upvotes: 256,
      downvotes: 78,
      createdAt: new Date("2024-02-02"),
    },
    {
      id: "arg-meta-2",
      debateId: "d-meta",
      side: "CON",
      content:
        "Metaverse spend is a sinkhole. AI capex will pressure margins. Regulatory and antitrust risks remain. Multiple could compress if growth slows.",
      author: mockUsers[2],
      upvotes: 389,
      downvotes: 33,
      createdAt: new Date("2024-02-02"),
    },
  ],
  "d-amd": [
    {
      id: "arg-amd-1",
      debateId: "d-amd",
      side: "PRO",
      content:
        "MI300 is competitive on performance and has design wins. Datacenter mix is improving. AMD can take 10–20% share in AI accelerators, which is huge revenue growth.",
      author: mockUsers[4],
      upvotes: 334,
      downvotes: 55,
      createdAt: new Date("2024-02-06"),
    },
    {
      id: "arg-amd-2",
      debateId: "d-amd",
      side: "CON",
      content:
        "NVIDIA has software and ecosystem advantage. Customers are locked in. AMD will get some share but margins may be lower. Stock already reflects a lot of optimism.",
      author: mockUsers[0],
      upvotes: 201,
      downvotes: 67,
      createdAt: new Date("2024-02-06"),
    },
  ],
  "d-rklb": [
    {
      id: "arg-rklb-1",
      debateId: "d-rklb",
      side: "PRO",
      content:
        "Neutron and space systems create a full vertical. Government and commercial demand for launch and satellites is growing. Best risk/reward in space.",
      author: mockUsers[1],
      upvotes: 412,
      downvotes: 38,
      createdAt: new Date("2024-02-11"),
    },
    {
      id: "arg-rklb-2",
      debateId: "d-rklb",
      side: "CON",
      content:
        "Space is capital-intensive and competitive. Neutron is delayed. Valuation assumes a lot of future success. One launch failure could reset the narrative.",
      author: mockUsers[3],
      upvotes: 156,
      downvotes: 92,
      createdAt: new Date("2024-02-11"),
    },
  ],
  "d-sofi": [
    {
      id: "arg-sofi-1",
      debateId: "d-sofi",
      side: "PRO",
      content:
        "Member growth and product breadth are strong. GAAP profitable. Student loan tailwind. Multiple can re-rate as the story gains credibility.",
      author: mockUsers[2],
      upvotes: 245,
      downvotes: 71,
      createdAt: new Date("2024-02-13"),
    },
    {
      id: "arg-sofi-2",
      debateId: "d-sofi",
      side: "CON",
      content:
        "Fintech multiples have compressed. Competition from banks and neobanks. Credit quality in a downturn is untested. Need to prove durable unit economics.",
      author: mockUsers[4],
      upvotes: 278,
      downvotes: 49,
      createdAt: new Date("2024-02-13"),
    },
  ],
  "d-hims": [
    {
      id: "arg-hims-1",
      debateId: "d-hims",
      side: "PRO",
      content:
        "Brand and DTC model work. Telehealth is sticky. GLP-1 and other verticals can expand TAM. Path to sustained profitability is clear.",
      author: mockUsers[0],
      upvotes: 367,
      downvotes: 41,
      createdAt: new Date("2024-02-15"),
    },
    {
      id: "arg-hims-2",
      debateId: "d-hims",
      side: "CON",
      content:
        "Valuation is rich. Competition from Ro, Amazon Pharmacy, and traditional players. Regulatory and reimbursement risks. Need to show margin expansion.",
      author: mockUsers[1],
      upvotes: 189,
      downvotes: 88,
      createdAt: new Date("2024-02-15"),
    },
  ],
  "d-achr": [
    {
      id: "arg-achr-1",
      debateId: "d-achr",
      side: "PRO",
      content:
        "Partnership with United and others de-risks commercialization. First-mover in eVTOL. If certification and scale work, upside is large.",
      author: mockUsers[3],
      upvotes: 98,
      downvotes: 134,
      createdAt: new Date("2024-02-19"),
    },
    {
      id: "arg-achr-2",
      debateId: "d-achr",
      side: "CON",
      content:
        "eVTOL is years from meaningful revenue. Capital needs are huge. Regulatory and technical risk. Many investors will get diluted or wiped out before success.",
      author: mockUsers[2],
      upvotes: 456,
      downvotes: 28,
      createdAt: new Date("2024-02-19"),
    },
  ],
};

/** Get debate by category and entity slug (e.g. stocks, nvda). */
export function getDebate(categoryType: string, entitySlug: string): Debate | undefined {
  return mockDebates.find(
    (d) => d.categoryType === categoryType && d.symbolOrSlug.toLowerCase() === entitySlug.toLowerCase()
  );
}

/** Get all debates for a category. */
export function getDebatesByCategory(categoryType: string): Debate[] {
  return mockDebates.filter((d) => d.categoryType === categoryType);
}

/** Stock debates only (for homepage and stock-focused UI). */
export const mockStockDebates = mockDebates.filter((d) => d.categoryType === "stocks");

/** Arguments for a debate. */
export function getArguments(debateId: string): Argument[] {
  return mockArgumentsByDebateId[debateId] ?? [];
}

// --- Leaderboard (can later be keyed by categoryType + entitySlug) ---
export interface LeaderboardUser {
  id: string;
  username: string;
  avatar?: string;
  upvotes7d: number;
  upvotes30d: number;
  upvotesAllTime: number;
  debatesCount: number;
  topTakeSnippet?: string;
  topTakeDebateId?: string;
  topTakeCategoryType?: string;
  topTakeEntitySlug?: string;
  topTakeSide?: "PRO" | "CON";
  topTakeUpvotes?: number;
}

export const mockLeaderboardUsers: LeaderboardUser[] = [
  {
    id: "1",
    username: "alice_debater",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    upvotes7d: 1240,
    upvotes30d: 8450,
    upvotesAllTime: 12450,
    debatesCount: 47,
    topTakeSnippet:
      "NVIDIA has a near-monopoly in AI training and inference. Data center growth is just starting...",
    topTakeDebateId: "d-nvda",
    topTakeCategoryType: "stocks",
    topTakeEntitySlug: "nvda",
    topTakeSide: "PRO" as const,
    topTakeUpvotes: 445,
  },
  {
    id: "2",
    username: "bob_thinker",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    upvotes7d: 980,
    upvotes30d: 7200,
    upvotesAllTime: 11200,
    debatesCount: 38,
    topTakeSnippet:
      "At 60+ P/E, much of the AI buildout is already priced in. Competition from AMD...",
    topTakeDebateId: "d-nvda",
    topTakeCategoryType: "stocks",
    topTakeEntitySlug: "nvda",
    topTakeSide: "CON" as const,
    topTakeUpvotes: 289,
  },
  {
    id: "3",
    username: "charlie_logical",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    upvotes7d: 1100,
    upvotes30d: 8100,
    upvotesAllTime: 11800,
    debatesCount: 42,
    topTakeSnippet: "Tesla has brand, software, and scale. Competitors are still losing money on EVs...",
    topTakeDebateId: "d-tsla",
    topTakeCategoryType: "stocks",
    topTakeEntitySlug: "tsla",
    topTakeSide: "PRO" as const,
    topTakeUpvotes: 278,
  },
  {
    id: "4",
    username: "diana_wise",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    upvotes7d: 920,
    upvotes30d: 6800,
    upvotesAllTime: 10200,
    debatesCount: 35,
    topTakeSnippet:
      "CUDA ecosystem lock-in is underappreciated. Migrating workloads to AMD or in-house chips...",
    topTakeDebateId: "d-nvda",
    topTakeCategoryType: "stocks",
    topTakeEntitySlug: "nvda",
    topTakeSide: "PRO" as const,
    topTakeUpvotes: 312,
  },
  {
    id: "5",
    username: "eve_analyst",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    upvotes7d: 750,
    upvotes30d: 5400,
    upvotesAllTime: 8900,
    debatesCount: 28,
    topTakeSnippet: "Chinese OEMs are winning on cost and features. Tesla's margins have peaked...",
    topTakeDebateId: "d-tsla",
    topTakeCategoryType: "stocks",
    topTakeEntitySlug: "tsla",
    topTakeSide: "CON" as const,
    topTakeUpvotes: 301,
  },
  {
    id: "6",
    username: "frank_debater",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    upvotes7d: 680,
    upvotes30d: 4800,
    upvotesAllTime: 7500,
    debatesCount: 24,
    topTakeSnippet: "AIP is a real product with strong adoption. Government contracts are sticky...",
    topTakeDebateId: "d-pltr",
    topTakeCategoryType: "stocks",
    topTakeEntitySlug: "pltr",
    topTakeSide: "PRO" as const,
    topTakeUpvotes: 356,
  },
  {
    id: "7",
    username: "grace_thinker",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    upvotes7d: 620,
    upvotes30d: 4200,
    upvotesAllTime: 6800,
    debatesCount: 22,
    topTakeSnippet: "Valuation remains extreme for a company that was unprofitable for years...",
    topTakeDebateId: "d-pltr",
    topTakeCategoryType: "stocks",
    topTakeEntitySlug: "pltr",
    topTakeSide: "CON" as const,
    topTakeUpvotes: 189,
  },
  {
    id: "8",
    username: "henry_logical",
    avatar:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    upvotes7d: 580,
    upvotes30d: 3900,
    upvotesAllTime: 6200,
    debatesCount: 20,
    topTakeSnippet: "Metaverse spend is a sinkhole. AI capex will pressure margins...",
    topTakeDebateId: "d-meta",
    topTakeCategoryType: "stocks",
    topTakeEntitySlug: "meta",
    topTakeSide: "CON" as const,
    topTakeUpvotes: 389,
  },
  {
    id: "9",
    username: "ivy_analyst",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    upvotes7d: 540,
    upvotes30d: 3600,
    upvotesAllTime: 5900,
    debatesCount: 18,
    topTakeSnippet: "MI300 is competitive on performance and has design wins. Datacenter mix is improving...",
    topTakeDebateId: "d-amd",
    topTakeCategoryType: "stocks",
    topTakeEntitySlug: "amd",
    topTakeSide: "PRO" as const,
    topTakeUpvotes: 334,
  },
  {
    id: "10",
    username: "jack_wise",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    upvotes7d: 490,
    upvotes30d: 3300,
    upvotesAllTime: 5400,
    debatesCount: 16,
    topTakeSnippet: "eVTOL is years from meaningful revenue. Capital needs are huge...",
    topTakeDebateId: "d-achr",
    topTakeCategoryType: "stocks",
    topTakeEntitySlug: "achr",
    topTakeSide: "CON" as const,
    topTakeUpvotes: 456,
  },
].sort((a, b) => b.upvotesAllTime - a.upvotesAllTime);
