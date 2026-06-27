import type { CardRating } from "@/types/notecards";

export type SessionRatingCounts = Record<CardRating, number>;

export function emptyRatingCounts(): SessionRatingCounts {
  return { again: 0, hard: 0, easy: 0 };
}

export function totalRated(counts: SessionRatingCounts) {
  return counts.again + counts.hard + counts.easy;
}
