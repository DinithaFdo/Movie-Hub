export function HeroSkeleton() {
  return (
    <section className="relative mb-12 overflow-hidden rounded-3xl border border-white/10 bg-(--surface) p-8 sm:p-10">
      <div className="max-w-xl space-y-4">
        <div className="h-4 w-28 rounded bg-(--surface-muted) skeleton" />
        <div className="h-12 w-4/5 rounded bg-(--surface-muted) skeleton" />
        <div className="h-12 w-2/3 rounded bg-(--surface-muted) skeleton" />
        <div className="h-4 w-full rounded bg-(--surface-muted) skeleton" />
        <div className="h-4 w-11/12 rounded bg-(--surface-muted) skeleton" />
        <div className="flex gap-3 pt-2">
          <div className="h-11 w-32 rounded-full bg-(--surface-muted) skeleton" />
          <div className="h-11 w-36 rounded-full bg-(--surface-muted) skeleton" />
        </div>
      </div>
    </section>
  );
}
