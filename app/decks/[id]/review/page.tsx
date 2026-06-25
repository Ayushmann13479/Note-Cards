"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { isDueTodayOrEarlier } from "@/lib/dates";
import { scheduleCard } from "@/lib/cards";
import { getDeck, updateDeck } from "@/lib/storage";
import type { CardRating, Deck, ReviewCard } from "@/types/notecards";

export default function ReviewDeckPage() {
  const params = useParams<{ id: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [reviewAll, setReviewAll] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    setDeck(getDeck(params.id));
    setLoaded(true);
  }, [params.id]);

  const reviewCards = useMemo(() => {
    if (!deck) {
      return [];
    }

    return reviewAll ? deck.cards : deck.cards.filter((card) => isDueTodayOrEarlier(card.nextReviewDate));
  }, [deck, reviewAll]);

  const activeCard = reviewCards[activeIndex] ?? null;

  function rateCard(rating: CardRating) {
    if (!deck || !activeCard) {
      return;
    }

    const scheduledCard = scheduleCard(activeCard, rating);
    const updatedDeck = {
      ...deck,
      cards: deck.cards.map((card) => (card.id === scheduledCard.id ? scheduledCard : card)),
    };

    updateDeck(updatedDeck);
    setDeck(updatedDeck);
    setReviewedCount((count) => count + 1);
    setRevealed(false);

    const nextReviewCards = reviewAll
      ? updatedDeck.cards
      : updatedDeck.cards.filter((card) => isDueTodayOrEarlier(card.nextReviewDate));

    setActiveIndex((index) => (index >= nextReviewCards.length - 1 ? 0 : index + 1));
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

  if (!reviewCards.length) {
    return (
      <div className="grid gap-5">
        <EmptyState
          title="No cards due"
          description="You are caught up for this deck. You can still review every card if you want a fresh pass."
        />
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setReviewAll(true);
              setActiveIndex(0);
            }}
            className="rounded-md bg-[#155e75] px-4 py-2 text-sm font-semibold text-white hover:bg-[#164e63]"
          >
            Review All Cards
          </button>
          <Link href="/" className="rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:border-black/20">
            Back to Decks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-5">
      <section className="rounded-lg border border-black/10 bg-white/75 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#be123c]">Review</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight">{deck.name}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setReviewAll((value) => !value);
                setActiveIndex(0);
                setRevealed(false);
              }}
              className="rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:border-black/20"
            >
              {reviewAll ? "Due Only" : "Review All"}
            </button>
            <Link href="/" className="rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:border-black/20">
              Decks
            </Link>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm font-semibold">
          <div className="rounded-md bg-[#f7f2ea] p-3">{activeIndex + 1} / {reviewCards.length}</div>
          <div className="rounded-md bg-[#f7f2ea] p-3">{reviewedCount} reviewed</div>
          <div className="rounded-md bg-[#f7f2ea] p-3">{reviewAll ? "All cards" : "Due today"}</div>
        </div>
      </section>

      <button
        type="button"
        onClick={() => setRevealed(true)}
        className="min-h-80 rounded-lg border border-black/10 bg-white p-7 text-left shadow-lg shadow-black/5 hover:border-[#155e75]"
      >
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#155e75]">
          {revealed ? "Answer" : "Question"}
        </p>
        <div className="mt-5 text-2xl font-black leading-snug tracking-tight">{activeCard?.question}</div>
        {revealed ? <p className="mt-8 text-lg leading-8 text-black/70">{activeCard?.answer}</p> : null}
        {!revealed ? <p className="mt-8 text-sm font-semibold text-black/45">Click or tap the card to reveal the answer.</p> : null}
      </button>

      {revealed ? (
        <section className="grid gap-3 sm:grid-cols-3">
          <RatingButton label="Again" detail="Today" tone="border-rose-200 bg-rose-50 text-rose-800" onClick={() => rateCard("again")} />
          <RatingButton label="Hard" detail="Soon" tone="border-amber-200 bg-amber-50 text-amber-900" onClick={() => rateCard("hard")} />
          <RatingButton label="Easy" detail="Later" tone="border-emerald-200 bg-emerald-50 text-emerald-800" onClick={() => rateCard("easy")} />
        </section>
      ) : null}
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
