"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CardComposer } from "@/components/CardComposer";
import { createDeck } from "@/lib/storage";
import type { ReviewCard } from "@/types/notecards";

export default function NewDeckPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [cards, setCards] = useState<ReviewCard[]>([]);
  const [error, setError] = useState("");

  function saveDeck() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Give the deck a name first.");
      return;
    }

    if (!cards.length) {
      setError("Add at least one card before saving.");
      return;
    }

    const deck = createDeck({ name: trimmedName, cards });
    router.push(`/decks/${deck.id}/review`);
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-black/10 bg-white/75 p-6 shadow-sm dark:border-white/10 dark:bg-white/10">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#be123c]">New Deck</p>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <label className="grid gap-2 text-sm font-semibold">
            Deck name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-md border border-black/15 bg-white px-3 py-3 text-base font-normal outline-none focus:border-[#155e75] focus:ring-4 focus:ring-cyan-800/10 dark:border-white/15 dark:bg-white/5 dark:text-white"
              placeholder="Database fundamentals"
            />
          </label>
          <button
            type="button"
            onClick={saveDeck}
            className="rounded-md bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/80"
          >
            Save Deck
          </button>
        </div>
        {error ? <p className="mt-3 text-sm font-semibold text-[#be123c]">{error}</p> : null}
      </section>
      <CardComposer onCardsChange={setCards} />
    </div>
  );
}
