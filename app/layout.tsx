import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoteCards",
  description: "A minimal local-first flashcard deck builder and review app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-5">
            <Link href="/" className="group flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-md bg-[#155e75] text-lg font-black text-white shadow-sm shadow-cyan-900/20">
                N
              </span>
              <span>
                <span className="block text-xl font-black tracking-tight">NoteCards</span>
                <span className="block text-xs font-medium uppercase tracking-[0.18em] text-black/55">
                  Local-first recall
                </span>
              </span>
            </Link>
            <nav className="flex items-center gap-2">
              <Link
                href="/"
                className="rounded-md border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold shadow-sm hover:border-black/20 hover:bg-white"
              >
                Decks
              </Link>
              <Link
                href="/decks/new"
                className="rounded-md bg-[#e11d48] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-rose-900/20 hover:bg-[#be123c]"
              >
                New Deck
              </Link>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
