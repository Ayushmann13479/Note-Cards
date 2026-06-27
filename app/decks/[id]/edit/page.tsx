"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CardComposer } from "@/components/CardComposer";
import { EmptyState } from "@/components/EmptyState";
import { getDeck, updateDeck } from "@/lib/storage";
import type { Deck, ReviewCard } from "@/types/notecards";

export default function EditDeckPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [name, setName] = useState("");
  const [cards, setCards] = useState<ReviewCard[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedDeck = getDeck(params.id);
    setDeck(storedDeck);
    setName(storedDeck?.name ?? "");
    setCards(storedDeck?.cards ?? []);
    setLoaded(true);
  }, [params.id]);

  function saveDeck() {
    if (!deck) {
      return;
    }

    if (!name.trim()) {
      setError("Deck name is required.");
      return;
    }

    if (!cards.length) {
      setError("A deck needs at least one card.");
      return;
    }

    updateDeck({ ...deck, name: name.trim(), cards });
    router.push("/");
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

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-black/10 bg-white/75 p-6 shadow-sm dark:border-white/10 dark:bg-white/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#be123c]">Edit Deck</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">{deck.name}</h1>
          </div>
          <Link href="/" className="rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:border-black/20 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
            Cancel
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <label className="grid gap-2 text-sm font-semibold">
            Deck name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-md border border-black/15 bg-white px-3 py-3 text-base font-normal outline-none focus:border-[#155e75] focus:ring-4 focus:ring-cyan-800/10 dark:border-white/15 dark:bg-white/5 dark:text-white"
            />
          </label>
          <button type="button" onClick={saveDeck} className="rounded-md bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/80">
            Save Changes
          </button>
        </div>
        {error ? <p className="mt-3 text-sm font-semibold text-[#be123c]">{error}</p> : null}
      </section>
      <CardComposer initialCards={cards} onCardsChange={setCards} />
    </div>
  );
}
