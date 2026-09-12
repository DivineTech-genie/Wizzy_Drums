export function HeroVideoSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-slate-950/80 shadow-2xl">
      <div className="h-[420px] w-full animate-pulse bg-slate-800/80 md:h-[520px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_34%)]" />
      <div className="absolute left-6 top-6 h-9 w-32 rounded-full border border-white/10 bg-white/10 animate-pulse" />
      <div className="absolute right-4 top-4 h-10 w-10 rounded-full border border-white/15 bg-slate-950/65 animate-pulse" />
    </div>
  );
}

export function EventCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`event-card-skeleton-${index}`}
          className="overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="h-56 w-full animate-pulse bg-muted" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
