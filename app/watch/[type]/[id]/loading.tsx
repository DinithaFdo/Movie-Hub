import { WatchDetailsSkeleton } from "@/components/skeletons/watch-details-skeleton";

export default function Loading() {
  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white">
      <WatchDetailsSkeleton />
    </div>
  );
}
