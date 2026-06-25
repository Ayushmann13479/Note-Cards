"use client";

import { FormEvent, useMemo, useState } from "react";
import type { NewCardInput, ReviewCard } from "@/types/notecards";
import { createReviewCard, parseMarkdownCards } from "@/lib/cards";

type CardComposerProps = {
  initialCards?: ReviewCard[];
  onCardsChange: (cards: ReviewCard[]) => void;
};

const sampleMarkdown = `Q: What is a primary key?
A: A column that uniquely identifies each row in a table.
Q: What is a foreign key?
A: A column that references a primary key in another table.`;

export function CardComposer({ initialCards = [], onCardsChange }: CardComposerProps) {
  const [cards, setCards] = useState<ReviewCard[]>(initialCards);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [markdown, setMarkdown] = useState("");

  const parsedCount = useMemo(() => parseMarkdownCards(markdown).length, [markdown]);

  function syncCards(nextCards: ReviewCard[]) {
    setCards(nextCards);
    onCardsChange(nextCards);
  }

  function addManualCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input: NewCardInput = { question, answer };

    if (!input.question.trim() || !input.answer.trim()) {
      return;
    }

    syncCards([...cards, createReviewCard(input)]);
    setQuestion("");
    setAnswer("");
  }

  function importMarkdownCards() {
    const imported = parseMarkdownCards(markdown).map(createReviewCard);
    if (!imported.length) {
      return;
    }

    syncCards([...cards, ...imported]);
    setMarkdown("");
  }

  function removeCard(id: string) {
    syncCards(cards.filter((card) => card.id !== id));
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <section className="rounded-lg border border-black/10 bg-white/75 p-5 shadow-sm">
        <h2 className="text-lg font-black">Manual entry</h2>
        <form className="mt-4 grid gap-4" onSubmit={addManualCard}>
          <label className="grid gap-2 text-sm font-semibold">
            Question
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="min-h-28 resize-y rounded-md border border-black/15 bg-white px-3 py-2 font-normal outline-none focus:border-[#155e75] focus:ring-4 focus:ring-cyan-800/10"
              placeholder="What do you want to remember?"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Answer
            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              className="min-h-28 resize-y rounded-md border border-black/15 bg-white px-3 py-2 font-normal outline-none focus:border-[#155e75] focus:ring-4 focus:ring-cyan-800/10"
              placeholder="The crisp answer future-you needs."
            />
          </label>
          <button
            type="submit"
            className="rounded-md bg-[#155e75] px-4 py-2 text-sm font-semibold text-white hover:bg-[#164e63]"
          >
            Add Card
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-black/10 bg-white/75 p-5 shadow-sm">
        <h2 className="text-lg font-black">Bulk markdown paste</h2>
        <textarea
          value={markdown}
          onChange={(event) => setMarkdown(event.target.value)}
          className="mt-4 min-h-72 w-full resize-y rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-[#155e75] focus:ring-4 focus:ring-cyan-800/10"
          placeholder={sampleMarkdown}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-black/60">
            {parsedCount} {parsedCount === 1 ? "card" : "cards"} detected
          </p>
          <button
            type="button"
            onClick={importMarkdownCards}
            className="rounded-md bg-[#e11d48] px-4 py-2 text-sm font-semibold text-white hover:bg-[#be123c]"
          >
            Add Parsed Cards
          </button>
        </div>
      </section>

      <section className="lg:col-span-2">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black">Added cards</h2>
          <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white">{cards.length}</span>
        </div>
        <div className="grid gap-3">
          {cards.length ? (
            cards.map((card, index) => (
              <article key={card.id} className="rounded-lg border border-black/10 bg-white/80 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid gap-2">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#be123c]">Card {index + 1}</p>
                    <h3 className="font-bold">{card.question}</h3>
                    <p className="text-sm leading-6 text-black/65">{card.answer}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCard(card.id)}
                    className="rounded-md border border-black/10 px-3 py-1 text-sm font-semibold hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-black/20 bg-white/55 p-5 text-sm text-black/60">
              Cards you add manually or import from markdown will appear here.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
