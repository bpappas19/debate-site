export type Side = "YES" | "NO";

export type Category = "Technology" | "Politics" | "Science" | "Philosophy" | "Society" | "Economics";

export interface User {
  id: string;
  username: string;
  avatar?: string;
  points: number;
}

export interface Argument {
  id: string;
  questionId: string;
  side: Side;
  content: string;
  author: User;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
}

export interface Question {
  id: string;
  slug: string;
  title: string;
  description?: string;
  category: Category;
  yesVotes: number;
  noVotes: number;
  totalVotes: number;
  createdAt: Date;
  resolved?: boolean;
  resolvedSide?: Side;
  resolvedAt?: Date;
  image?: string;
}
