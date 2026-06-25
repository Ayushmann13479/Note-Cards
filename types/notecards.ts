export type CardRating = "again" | "hard" | "easy";

export type ReviewCard = {
  id: string;
  question: string;
  answer: string;
  intervalDays: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewedAt?: string;
};

export type Deck = {
  id: string;
  name: string;
  cards: ReviewCard[];
  createdAt: string;
  updatedAt: string;
};

export type NewCardInput = {
  question: string;
  answer: string;
};
