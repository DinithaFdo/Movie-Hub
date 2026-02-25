export function MediaGridSkeleton({ title }: { title: string }) {
  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div
        className="mb-8 h-10 w-64 rounded-xl bg-[#202020] skeleton"
        aria-label={title}
      />
      <div className="grid grid-cols-2 gap-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="mx-auto w-40 space-y-3 md:w-50">
            <div className="aspect-2/3 rounded-xl border border-white/10 bg-[#1a1a1a] skeleton" />
            <div className="h-4 w-10/12 rounded bg-[#202020] skeleton" />
            <div className="h-3 w-1/3 rounded bg-[#202020] skeleton" />
          </div>
        ))}
      </div>
    </div>
  );
}
