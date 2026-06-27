"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { ReviewSummary } from "@/components/ReviewSummary";
import { isDueTodayOrEarlier } from "@/lib/dates";
import { scheduleCard } from "@/lib/cards";
import {
  clearActiveReviewSession,
  confirmLeaveReviewSession,
  setActiveReviewSession,
} from "@/lib/reviewSession";
import { emptyRatingCounts, type SessionRatingCounts } from "@/lib/reviewStats";
import { getDeck, updateDeck } from "@/lib/storage";
import type { CardRating, Deck, ReviewCard } from "@/types/notecards";

type UndoSnapshot = {
  deck: Deck;
  sessionIndex: number;
  revealed: boolean;
  ratingCounts: SessionRatingCounts;
};

export default function ReviewDeckPage() {
  const params = useParams<{ id: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [reviewAll, setReviewAll] = useState(false);
  const [sessionCardIds, setSessionCardIds] = useState<string[]>([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [ratingCounts, setRatingCounts] = useState<SessionRatingCounts>(emptyRatingCounts);
  const [undoStack, setUndoStack] = useState<UndoSnapshot[]>([]);

  useEffect(() => {
    setDeck(getDeck(params.id));
    setLoaded(true);
  }, [params.id]);

  const dueCardIds = useMemo(() => {
    if (!deck) {
      return [];
    }

    return deck.cards.filter((card) => isDueTodayOrEarlier(card.nextReviewDate)).map((card) => card.id);
  }, [deck]);

  const sessionCards = useMemo(() => {
    if (!deck) {
      return [];
    }

    const byId = new Map(deck.cards.map((card) => [card.id, card]));
    return sessionCardIds.map((id) => byId.get(id)).filter((card): card is ReviewCard => Boolean(card));
  }, [deck, sessionCardIds]);

  const activeCard = sessionCards[sessionIndex] ?? null;
  const sessionTotal = sessionCardIds.length;
  const sessionProgress = sessionComplete ? sessionTotal : sessionIndex;
  const sessionRemaining = sessionComplete ? 0 : Math.max(sessionTotal - sessionIndex, 0);

  function beginSession(allCards: boolean) {
    if (!deck) {
      return;
    }

    const ids = allCards
      ? deck.cards.map((card) => card.id)
      : deck.cards.filter((card) => isDueTodayOrEarlier(card.nextReviewDate)).map((card) => card.id);

    setReviewAll(allCards);
    setSessionCardIds(ids);
    setSessionIndex(0);
    setSessionComplete(false);
    setRevealed(false);
    setRatingCounts(emptyRatingCounts());
    setUndoStack([]);
  }

  useEffect(() => {
    if (!deck || sessionCardIds.length) {
      return;
    }

    if (dueCardIds.length) {
      beginSession(false);
    }
  }, [deck, dueCardIds.length, sessionCardIds.length]);

  useEffect(() => {
    if (!deck || sessionComplete || !sessionTotal) {
      clearActiveReviewSession();
      return;
    }

    setActiveReviewSession({ deckId: deck.id, remaining: sessionRemaining });
  }, [deck, sessionComplete, sessionRemaining, sessionTotal]);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (sessionComplete || !sessionRemaining) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [sessionComplete, sessionRemaining]);

  const rateCard = useCallback(
    (rating: CardRating) => {
      if (!deck || !activeCard || sessionComplete) {
        return;
      }

      setUndoStack((stack) => [
        ...stack,
        {
          deck,
          sessionIndex,
          revealed,
          ratingCounts,
        },
      ]);

      const scheduledCard = scheduleCard(activeCard, rating);
      const updatedDeck = {
        ...deck,
        cards: deck.cards.map((card) => (card.id === scheduledCard.id ? scheduledCard : card)),
      };

      updateDeck(updatedDeck);
      setDeck(updatedDeck);
      setRatingCounts((counts) => ({ ...counts, [rating]: counts[rating] + 1 }));
      setRevealed(false);

      const nextIndex = sessionIndex + 1;
      if (nextIndex >= sessionCardIds.length) {
        setSessionComplete(true);
        clearActiveReviewSession();
      } else {
        setSessionIndex(nextIndex);
      }
    },
    [deck, activeCard, sessionComplete, sessionIndex, revealed, ratingCounts, sessionCardIds.length],
  );

  function undoLastRating() {
    const snapshot = undoStack[undoStack.length - 1];
    if (!snapshot) {
      return;
    }

    updateDeck(snapshot.deck);
    setDeck(snapshot.deck);
    setSessionIndex(snapshot.sessionIndex);
    setRevealed(snapshot.revealed);
    setRatingCounts(snapshot.ratingCounts);
    setSessionComplete(false);
    setUndoStack((stack) => stack.slice(0, -1));
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (sessionComplete || !activeCard) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, button")) {
        return;
      }

      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        if (!revealed) {
          setRevealed(true);
        }
        return;
      }

      if (!revealed) {
        return;
      }

      if (event.key === "1") {
        event.preventDefault();
        rateCard("again");
      }

      if (event.key === "2") {
        event.preventDefault();
        rateCard("hard");
      }

      if (event.key === "3") {
        event.preventDefault();
        rateCard("easy");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sessionComplete, activeCard, revealed, rateCard]);

  function guardedNavigate(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!confirmLeaveReviewSession()) {
      event.preventDefault();
    }
  }

  if (!loaded) {
    return null;
  }

  if (!deck) {
    return (
      <EmptyState
        title="Deck not found"
        description="This deck may have been deleted from localStorage."
        actionHref="/"
        actionLabel="Back to decks"
      />
    );
  }

  if (sessionComplete) {
    return (
      <ReviewSummary
        deckName={deck.name}
        deckId={deck.id}
        ratingCounts={ratingCounts}
        reviewAll={reviewAll}
        onReviewAgain={() => beginSession(reviewAll)}
      />
    );
  }

  if (!sessionCardIds.length) {
    return (
      <div className="grid gap-5">
        <EmptyState
          title="No cards due"
          description="You are caught up for this deck. You can still review every card if you want a fresh pass."
        />
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => beginSession(true)}
            className="rounded-md bg-[#155e75] px-4 py-2 text-sm font-semibold text-white hover:bg-[#164e63]"
          >
            Review All Cards
          </button>
          <Link
            href="/"
            onClick={guardedNavigate}
            className="rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:border-black/20 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          >
            Back to Decks
          </Link>
        </div>
      </div>
    );
  }

  const progressPercent = sessionTotal ? Math.round((sessionProgress / sessionTotal) * 100) : 0;

  return (
    <div className="mx-auto grid max-w-3xl gap-5">
      <section className="rounded-lg border border-black/10 bg-white/75 p-5 shadow-sm dark:border-white/10 dark:bg-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#be123c]">Review</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">{deck.name}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => beginSession(!reviewAll)}
              className="rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:border-black/20 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              {reviewAll ? "Due Only" : "Review All"}
            </button>
            {undoStack.length ? (
              <button
                type="button"
                onClick={undoLastRating}
                className="rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:border-black/20 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                Undo
              </button>
            ) : null}
            <Link
              href="/"
              onClick={guardedNavigate}
              className="rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:border-black/20 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              Decks
            </Link>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold text-black/60 dark:text-white/60">
            <span>{sessionProgress} / {sessionTotal} cards</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-[#155e75] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm font-semibold sm:grid-cols-4">
          <div className="rounded-md bg-[#f7f2ea] p-3 dark:bg-white/5">{sessionRemaining} left</div>
          <div className="rounded-md bg-[#f7f2ea] p-3 dark:bg-white/5">{ratingCounts.again} again</div>
          <div className="rounded-md bg-[#f7f2ea] p-3 dark:bg-white/5">{ratingCounts.hard} hard</div>
          <div className="rounded-md bg-[#f7f2ea] p-3 dark:bg-white/5">{ratingCounts.easy} easy</div>
        </div>
      </section>

      <button
        type="button"
        onClick={() => setRevealed(true)}
        className="min-h-80 rounded-lg border border-black/10 bg-white p-7 text-left shadow-lg shadow-black/5 hover:border-[#155e75] dark:border-white/10 dark:bg-white/10 dark:shadow-black/20"
      >
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#155e75]">
          {revealed ? "Answer" : "Question"}
        </p>
        <div className="mt-5 text-2xl font-black leading-snug tracking-tight">{activeCard?.question}</div>
        {revealed ? <p className="mt-8 text-lg leading-8 text-black/70 dark:text-white/70">{activeCard?.answer}</p> : null}
        {!revealed ? (
          <p className="mt-8 text-sm font-semibold text-black/45 dark:text-white/45">
            Click or tap the card to reveal. Press Space or Enter.
          </p>
        ) : null}
      </button>

      {revealed ? (
        <section className="grid gap-3 sm:grid-cols-3">
          <RatingButton label="Again" detail="Today (1)" tone="border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200" onClick={() => rateCard("again")} />
          <RatingButton label="Hard" detail="Soon (2)" tone="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200" onClick={() => rateCard("hard")} />
          <RatingButton label="Easy" detail="Later (3)" tone="border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200" onClick={() => rateCard("easy")} />
        </section>
      ) : null}

      <p className="text-center text-xs font-medium text-black/45 dark:text-white/45">
        Shortcuts: Space/Enter to reveal · 1 Again · 2 Hard · 3 Easy
      </p>
    </div>
  );
}

function RatingButton({ label, detail, tone, onClick }: { label: string; detail: string; tone: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-lg border p-4 text-left shadow-sm ${tone}`}>
      <span className="block text-lg font-black">{label}</span>
      <span className="mt-1 block text-sm font-semibold opacity-70">{detail}</span>
    </button>
  );
}
