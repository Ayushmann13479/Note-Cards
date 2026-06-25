import type { CardRating, NewCardInput, ReviewCard } from "@/types/notecards";
import { addDays, todayDateString } from "@/lib/dates";

export function createId(prefix = "id") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function createReviewCard(input: NewCardInput): ReviewCard {
  return {
    id: createId("card"),
    question: input.question.trim(),
    answer: input.answer.trim(),
    intervalDays: 0,
    repetitions: 0,
    nextReviewDate: todayDateString(),
  };
}

export function scheduleCard(card: ReviewCard, rating: CardRating, now = new Date()): ReviewCard {
  const nextInterval = getNextInterval(card, rating);

  return {
    ...card,
    intervalDays: nextInterval,
    repetitions: rating === "again" ? 0 : card.repetitions + 1,
    nextReviewDate: todayDateString(addDays(now, nextInterval)),
    lastReviewedAt: now.toISOString(),
  };
}

function getNextInterval(card: ReviewCard, rating: CardRating) {
  if (rating === "again") {
    return 0;
  }

  if (rating === "hard") {
    return Math.max(1, Math.ceil(card.intervalDays * 1.4));
  }

  if (card.repetitions === 0) {
    return 1;
  }

  if (card.repetitions === 1) {
    return 3;
  }

  return Math.max(4, Math.ceil(card.intervalDays * 2.3));
}

export function parseMarkdownCards(markdown: string): NewCardInput[] {
  const lines = markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const cards: NewCardInput[] = [];
  let currentQuestion = "";
  let currentAnswer = "";
  let mode: "question" | "answer" | null = null;

  for (const line of lines) {
    if (/^Q:/i.test(line)) {
      pushIfComplete(cards, currentQuestion, currentAnswer);
      currentQuestion = line.replace(/^Q:\s*/i, "").trim();
      currentAnswer = "";
      mode = "question";
      continue;
    }

    if (/^A:/i.test(line)) {
      currentAnswer = line.replace(/^A:\s*/i, "").trim();
      mode = "answer";
      continue;
    }

    if (mode === "question") {
      currentQuestion = `${currentQuestion} ${line}`.trim();
    }

    if (mode === "answer") {
      currentAnswer = `${currentAnswer} ${line}`.trim();
    }
  }

  pushIfComplete(cards, currentQuestion, currentAnswer);
  return cards;
}

function pushIfComplete(cards: NewCardInput[], question: string, answer: string) {
  const cleanQuestion = question.trim();
  const cleanAnswer = answer.trim();

  if (cleanQuestion && cleanAnswer) {
    cards.push({
      question: cleanQuestion,
      answer: cleanAnswer,
    });
  }
}
