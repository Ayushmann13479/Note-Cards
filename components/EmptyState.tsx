import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <section className="rounded-lg border border-dashed border-black/20 bg-white/55 p-8 text-center shadow-sm dark:border-white/15 dark:bg-white/5">
      <div className="mx-auto mb-4 grid size-14 place-items-center rounded-md bg-[#facc15] text-2xl font-black text-black">
        ?
      </div>
      <h1 className="text-2xl font-black tracking-tight">{title}</h1>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-black/65 dark:text-white/65">{description}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        {actionHref && actionLabel ? (
          <Link
            href={actionHref}
            className="inline-flex rounded-md bg-[#155e75] px-4 py-2 text-sm font-semibold text-white hover:bg-[#164e63]"
          >
            {actionLabel}
          </Link>
        ) : null}
        {secondaryActionLabel && onSecondaryAction ? (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="inline-flex rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-semibold hover:border-black/20 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          >
            {secondaryActionLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
}
