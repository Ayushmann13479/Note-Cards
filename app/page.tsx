"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { deleteDeck, getDecks } from "@/lib/storage";
import { formatDate, isDueTodayOrEarlier } from "@/lib/dates";
import type { Deck } from "@/types/notecards";

export default function HomePage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setDecks(getDecks());
    setLoaded(true);
  }, []);

  const totalCards = useMemo(() => decks.reduce((total, deck) => total + deck.cards.length, 0), [decks]);
  const dueCards = useMemo(
    () => decks.reduce((total, deck) => total + deck.cards.filter((card) => isDueTodayOrEarlier(card.nextReviewDate)).length, 0),
    [decks],
  );

  function handleDelete(id: string) {
    const deck = decks.find((item) => item.id === id);
    if (!deck || !window.confirm(`Delete "${deck.name}"? This cannot be undone.`)) {
      return;
    }

    deleteDeck(id);
    setDecks(getDecks());
  }

  if (!loaded) {
    return null;
  }

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 md:grid-cols-[1.4fr_0.6fr_0.6fr]">
        <div className="rounded-lg border border-black/10 bg-white/70 p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#be123c]">Deck library</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Build small decks. Review what is due.</h1>
        </div>
        <div className="rounded-lg border border-black/10 bg-[#155e75] p-6 text-white shadow-sm">
          <p className="text-sm font-semibold text-white/70">Total cards</p>
          <p className="mt-3 text-4xl font-black">{totalCards}</p>
        </div>
        <div className="rounded-lg border border-black/10 bg-[#facc15] p-6 text-black shadow-sm">
          <p className="text-sm font-semibold text-black/60">Due today</p>
          <p className="mt-3 text-4xl font-black">{dueCards}</p>
        </div>
      </section>

      {decks.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {decks.map((deck) => {
            const dueCount = deck.cards.filter((card) => isDueTodayOrEarlier(card.nextReviewDate)).length;

            return (
              <article key={deck.id} className="rounded-lg border border-black/10 bg-white/80 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black tracking-tight">{deck.name}</h2>
                    <p className="mt-1 text-sm text-black/60">Created {formatDate(deck.createdAt)}</p>
                  </div>
                  <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white">
                    {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"}
                  </span>
                </div>
                <div className="mt-5 rounded-md bg-[#f7f2ea] p-3 text-sm font-semibold text-black/70">
                  {dueCount ? `${dueCount} due now` : "Nothing due yet"}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href={`/decks/${deck.id}/review`}
                    className="rounded-md bg-[#155e75] px-3 py-2 text-sm font-semibold text-white hover:bg-[#164e63]"
                  >
                    Review
                  </Link>
                  <Link
                    href={`/decks/${deck.id}/edit`}
                    className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-semibold hover:border-black/20"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(deck.id)}
                    className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-semibold hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <EmptyState
          title="No decks yet"
          description="Create your first deck manually or paste a few Q:/A: markdown pairs. Everything stays in this browser."
          actionHref="/decks/new"
          actionLabel="Create a deck"
        />
      )}
    </div>
  );
}
