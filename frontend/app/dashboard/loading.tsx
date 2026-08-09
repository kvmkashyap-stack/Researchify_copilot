export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-black p-6 lg:p-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-8">
        <div className="space-y-3">
          <div className="h-8 w-64 rounded-xl bg-white/10" />
          <div className="h-4 w-96 max-w-full rounded-lg bg-white/5" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 rounded-3xl border border-white/10 bg-white/[0.03]"
            />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="h-[520px] rounded-3xl border border-white/10 bg-white/[0.03]" />

          <div className="space-y-6">
            <div className="h-60 rounded-3xl border border-white/10 bg-white/[0.03]" />

            <div className="h-60 rounded-3xl border border-white/10 bg-white/[0.03]" />
          </div>
        </div>
      </div>
    </div>
  );
}