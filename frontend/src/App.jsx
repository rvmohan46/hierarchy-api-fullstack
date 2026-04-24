import { useState } from 'react';
import StatCard from './components/StatCard';
import FeatureCard from './components/FeatureCard';
import ListPanel from './components/ListPanel';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL || '/api/bfhl';
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: input.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean) }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('Failed to call the API. Make sure the backend is running on port 3001.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="rounded-[32px] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/80">Hierarchy Analyzer</p>
              <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Inspect node relationships with a clean visual flow.</h1>
              <p className="mt-4 max-w-2xl text-sm text-slate-400">
                Paste edges like <span className="font-mono text-cyan-200">A-&gt;B</span> and view detected trees, cycles, invalid entries and duplicate edges.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setInput('')}
              className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-500/15"
            >
              Reset
            </button>
          </div>
        </header>

        <main className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Input</h2>
                  <p className="mt-1 text-sm text-slate-400">Use commas or new lines to separate relationships.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setInput('A->B, A->C, B->D, X->Y, Y->Z, Z->X')}
                  className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-200 ring-1 ring-white/10 transition hover:bg-slate-700"
                >
                  Load sample
                </button>
              </div>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="A->B, A->C, B->D"
                className="mt-5 min-h-[220px] w-full resize-none rounded-3xl border border-slate-800 bg-slate-950/95 px-4 py-4 font-mono text-slate-100 outline-none transition focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/10"
              />
              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-400">Tip: Uppercase letters only, and avoid self-loops like <span className="font-mono">A-&gt;A</span>.</p>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? 'Analyzing...' : 'Run analysis'}
                </button>
              </div>
            </div>

            {result && (
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Total Trees" value={result.summary.total_trees} />
                <StatCard label="Total Cycles" value={result.summary.total_cycles} />
                <StatCard label="Largest Root" value={result.summary.largest_tree_root || '—'} />
              </div>
            )}

            {result?.hierarchies?.map((hierarchy, index) => (
              <article key={index} className="rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Root</p>
                    <h3 className="mt-1 text-2xl font-semibold text-white">{hierarchy.root}</h3>
                  </div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${hierarchy.has_cycle ? 'bg-rose-500/15 text-rose-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
                    {hierarchy.has_cycle ? 'Cycle detected' : 'Tree'}
                  </span>
                </div>
                <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-900 p-4 text-sm leading-6 text-slate-300">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(hierarchy.tree, null, 2)}</pre>
                </div>
                {hierarchy.depth != null && <p className="mt-4 text-sm text-slate-400">Depth: {hierarchy.depth}</p>}
              </article>
            ))}
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/10">
              <h2 className="text-lg font-semibold text-white">Why this tool?</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">The API validates edge notation, detects cycles, deduplicates repeat edges, and builds structured hierarchies.</p>
              <div className="mt-6 space-y-3">
                <FeatureCard label="Cycle detection" description="Flags loops and returns a cyclic result without depth." />
                <FeatureCard label="Duplicate filtering" description="Keeps the first edge and reports repeated edges once." />
                <FeatureCard label="Summary insights" description="Shows total trees, cycles, and the largest root." />
              </div>
            </div>

            {result && (
              <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Validation</h2>
                  <span className="rounded-full bg-slate-800 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-400">Live</span>
                </div>
                <div className="mt-5 space-y-4">
                  <ListPanel title="Invalid Entries" items={result.invalid_entries} compact />
                  <ListPanel title="Duplicate Edges" items={result.duplicate_edges} compact />
                </div>
              </div>
            )}
          </aside>
        </main>
      </div>
    </div>
  );
}
