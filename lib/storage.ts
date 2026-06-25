"use client";

import type { Deck, ReviewCard } from "@/types/notecards";
import { createId } from "@/lib/cards";

const STORAGE_KEY = "notecards.decks.v1";

type CreateDeckInput = {
  name: string;
  cards: ReviewCard[];
};

export function getDecks(): Deck[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Deck[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getDeck(id: string) {
  return getDecks().find((deck) => deck.id === id) ?? null;
}

export function createDeck(input: CreateDeckInput) {
  const now = new Date().toISOString();
  const deck: Deck = {
    id: createId("deck"),
    name: input.name.trim(),
    cards: input.cards,
    createdAt: now,
    updatedAt: now,
  };

  saveDecks([deck, ...getDecks()]);
  return deck;
}

export function updateDeck(updatedDeck: Deck) {
  const decks = getDecks().map((deck) =>
    deck.id === updatedDeck.id ? { ...updatedDeck, updatedAt: new Date().toISOString() } : deck,
  );
  saveDecks(decks);
}

export function deleteDeck(id: string) {
  saveDecks(getDecks().filter((deck) => deck.id !== id));
}

function saveDecks(decks: Deck[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}
