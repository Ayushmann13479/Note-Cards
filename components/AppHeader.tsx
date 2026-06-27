"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { confirmLeaveReviewSession } from "@/lib/reviewSession";
import { ThemeToggle } from "@/components/ThemeToggle";

function handleNavClick(event: React.MouseEvent<HTMLAnchorElement>, pathname: string) {
  if (!pathname.includes("/review")) {
    return;
  }

  if (!confirmLeaveReviewSession()) {
    event.preventDefault();
  }
}

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-5 dark:border-white/10">
      <Link
        href="/"
        onClick={(event) => handleNavClick(event, pathname)}
        className="group flex items-center gap-3"
      >
        <span className="grid size-11 place-items-center rounded-md bg-[#155e75] text-lg font-black text-white shadow-sm shadow-cyan-900/20">
          N
        </span>
        <span>
          <span className="block text-xl font-black tracking-tight">NoteCards</span>
          <span className="block text-xs font-medium uppercase tracking-[0.18em] text-black/55 dark:text-white/55">
            Local-first recall
          </span>
        </span>
      </Link>
      <nav className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="/"
          onClick={(event) => handleNavClick(event, pathname)}
          className="rounded-md border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold shadow-sm hover:border-black/20 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
        >
          Decks
        </Link>
        <Link
          href="/decks/new"
          onClick={(event) => handleNavClick(event, pathname)}
          className="rounded-md bg-[#e11d48] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-rose-900/20 hover:bg-[#be123c]"
        >
          New Deck
        </Link>
      </nav>
    </header>
  );
}
