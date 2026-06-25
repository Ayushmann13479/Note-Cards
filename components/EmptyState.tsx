import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({ title, description, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <section className="rounded-lg border border-dashed border-black/20 bg-white/55 p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 grid size-14 place-items-center rounded-md bg-[#facc15] text-2xl font-black text-black">
        ?
      </div>
      <h1 className="text-2xl font-black tracking-tight">{title}</h1>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-black/65">{description}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-5 inline-flex rounded-md bg-[#155e75] px-4 py-2 text-sm font-semibold text-white hover:bg-[#164e63]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </section>
  );
}
