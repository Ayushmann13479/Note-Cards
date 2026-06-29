# NoteCards

NoteCards is a minimal local-first flashcard app built with Next.js App Router, TypeScript, and Tailwind CSS. It lets you create small decks manually or from a simple markdown Q&A shorthand, then review due cards with a lightweight spaced-repetition flow.

Everything is stored in browser `localStorage`. There is no backend, database, auth, or external API in V1.


<img width="1917" height="902" alt="image" src="https://github.com/user-attachments/assets/a890bc67-b6df-4968-ac3f-d5e2a98af19c" />


<img width="1712" height="861" alt="image" src="https://github.com/user-attachments/assets/bfc45f0d-78dd-45bd-b4fd-148ddf2e3d47" />



## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

For a production check:

```bash
npm run build
npm start
```

## Markdown Shorthand

Paste cards as repeated `Q:` and `A:` pairs. Blank lines are ignored, and text is trimmed.

```text
Q: What is a primary key?
A: A column that uniquely identifies each row in a table.

Q: What is a foreign key?
A: A column that references a primary key in another table.
```

On import, each complete question/answer pair becomes a card. Incomplete pairs are ignored.

## V1 Features

- Create decks with a name and cards.
- Add cards manually with question and answer fields.
- Bulk import cards from `Q:` / `A:` markdown shorthand.
- Store decks and card review metadata in browser `localStorage`.
- List decks with card count, created date, due count, edit, review, and delete actions.
- Review due cards one at a time with question-first reveal.
- Rate revealed cards as Again, Hard, or Easy using a simple SM-2-lite interval scheduler.
- Review all cards even when no cards are due.

## Folder Structure

```text
app/                  Next.js App Router pages
components/           Reusable UI components
types/                Shared TypeScript domain types
lib/cards.ts          Card creation, markdown parsing, scheduler logic
lib/dates.ts          Date helpers
lib/storage.ts        localStorage persistence adapter
```

The storage layer is intentionally small and isolated so a later backend, auth system, or LLM generation flow can be added without rewriting the UI.

## Roadmap

Each of these is a good candidate for a separate commit or PR:

- LLM-powered flashcard generation from raw notes using the Gemini API.
- Full SM-2 scheduling with ease factor, lapses, and review history.
- Deck tags, categories, and filters.
- Progress stats with retention charts and a review-streak heatmap.
- Cloze-deletion style cards.
- Export and import as JSON, CSV, or Anki-compatible format.
- Migrate from `localStorage` to Postgres plus auth for multi-device sync.
- Dark mode with persisted theme preference.
