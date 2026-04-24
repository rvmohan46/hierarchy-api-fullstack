export default function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-5 shadow-sm shadow-slate-950/10">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}
