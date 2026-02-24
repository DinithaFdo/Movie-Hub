export function MovieRowSkeleton() {
  return (
    <section className="space-y-5 py-2">
      <div className="h-7 w-40 rounded-md bg-(--surface-muted) skeleton" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="h-65 w-40 shrink-0 rounded-2xl border border-white/10 bg-(--surface-muted) skeleton"
          />
        ))}
      </div>
    </section>
  );
}
