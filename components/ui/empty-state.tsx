import Link from "next/link";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  ctaHref,
  ctaLabel,
}: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-(--border-default) bg-(--bg-elevated)/70 p-8 text-center shadow-elevation-3 backdrop-blur-xl md:p-12">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-(--primary)/25 bg-(--primary)/10 text-(--primary)">
        {icon}
      </div>
      <h2 className="mb-2 text-2xl font-bold text-(--text-primary)">{title}</h2>
      <p className="mb-7 text-(--text-tertiary)">{description}</p>
      {ctaHref && ctaLabel ? (
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-xl bg-(--primary) px-6 py-3 text-sm font-bold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--primary-light)"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
