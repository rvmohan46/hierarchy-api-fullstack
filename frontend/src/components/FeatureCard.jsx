export default function FeatureCard({ label, description }) {
  return (
    <div className="rounded-3xl border border-slate-800/90 bg-slate-900/95 p-4">
      <p className="font-semibold text-white">{label}</p>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}
