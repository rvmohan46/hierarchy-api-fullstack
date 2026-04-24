export default function ListPanel({ title, items, compact }) {
  return (
    <div className={`rounded-3xl border border-slate-800/90 bg-slate-900/95 p-4 ${compact ? 'text-sm' : ''}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">{title}</h3>
        <span className="rounded-full bg-slate-800 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-400">{items.length}</span>
      </div>
      <div className="mt-3 space-y-2">
        {items.length === 0 ? (
          <p className="text-slate-500">None</p>
        ) : (
          items.map((item, index) => (
            <div key={index} className="rounded-2xl border border-slate-800/80 bg-slate-950 px-3 py-2 text-slate-300">
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
