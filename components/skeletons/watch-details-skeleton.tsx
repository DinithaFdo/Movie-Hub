export function WatchDetailsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-400 p-4 pt-24 md:p-8 md:pt-28 lg:px-12">
      <div className="mb-6 h-10 w-36 rounded-full bg-[#202020] skeleton" />
      <div className="grid gap-8 lg:grid-cols-[1fr_350px] xl:gap-12">
        <div className="space-y-8">
          <div className="aspect-video w-full rounded-2xl border border-white/10 bg-[#141414] skeleton" />
          <div className="space-y-4">
            <div className="h-12 w-2/3 rounded-xl bg-[#202020] skeleton" />
            <div className="h-5 w-64 rounded bg-[#202020] skeleton" />
            <div className="h-4 w-full rounded bg-[#202020] skeleton" />
            <div className="h-4 w-11/12 rounded bg-[#202020] skeleton" />
            <div className="h-4 w-10/12 rounded bg-[#202020] skeleton" />
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-white/10 bg-[#141414] p-6">
            <div className="mb-4 h-6 w-40 rounded bg-[#202020] skeleton" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 rounded-lg bg-[#1d1d1d] skeleton"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
