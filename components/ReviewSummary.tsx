import Link from "next/link";
import type { SessionRatingCounts } from "@/lib/reviewStats";
import { totalRated } from "@/lib/reviewStats";

type ReviewSummaryProps = {
  deckName: string;
  deckId: string;
  ratingCounts: SessionRatingCounts;
  reviewAll: boolean;
  onReviewAgain?: () => void;
};

export function ReviewSummary({ deckName, deckId, ratingCounts, reviewAll, onReviewAgain }: ReviewSummaryProps) {
  const total = totalRated(ratingCounts);

  return (
    <div className="mx-auto grid max-w-3xl gap-5">
      <section className="rounded-lg border border-black/10 bg-white/75 p-8 text-center shadow-sm dark:border-white/10 dark:bg-white/10">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#be123c]">Session complete</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">{deckName}</h1>
        <p className="mt-2 text-sm text-black/65 dark:text-white/65">
          {total} card{total === 1 ? "" : "s"} reviewed in this {reviewAll ? "full deck" : "due"} session.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <SummaryStat label="Again" value={ratingCounts.again} tone="border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200" />
          <SummaryStat label="Hard" value={ratingCounts.hard} tone="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200" />
          <SummaryStat label="Easy" value={ratingCounts.easy} tone="border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200" />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {onReviewAgain ? (
            <button
              type="button"
              onClick={onReviewAgain}
              className="rounded-md bg-[#155e75] px-4 py-2 text-sm font-semibold text-white hover:bg-[#164e63]"
            >
              Review Again
            </button>
          ) : (
            <Link
              href={`/decks/${deckId}/review`}
              className="rounded-md bg-[#155e75] px-4 py-2 text-sm font-semibold text-white hover:bg-[#164e63]"
            >
              Review Again
            </Link>
          )}
          <Link href="/" className="rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:border-black/20 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
            Back to Decks
          </Link>
        </div>
      </section>
    </div>
  );
}

function SummaryStat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`rounded-lg border p-4 ${tone}`}>
      <p className="text-sm font-semibold opacity-70">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
    </div>
  );
}
