import React from 'react';
import { Activity, ShieldCheck, Zap, Server } from 'lucide-react';

type BenchmarkMetric = { label: string; status: string; value: string; target: string; sub: string };

export const BenchmarkDashboard: React.FC = () => {
  // No reproducible numeric benchmark results are published in this dashboard.
  const metrics: BenchmarkMetric[] = [];

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" />
          Local Benchmark Instrumentation
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-1">
          The benchmark crate records local diagnostic timings; this dashboard does not publish benchmark results or establish performance guarantees.
        </p>
      </div>

      {/* Theorem 1.1 Highlight Card */}
      <div className="glass-panel-glow p-6 rounded-2xl border border-cyan-500/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/40 inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> No zero-cost theorem established
          </span>
          <h3 className="text-xl font-bold text-white">Unannotated-type overhead is a design goal, not a proven result</h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed font-mono">
            This workspace does not implement the proposed compiler-reflection handles. No general zero-overhead guarantee is claimed; costs depend on the concrete implementation and build.
          </p>
        </div>

        <div className="text-center p-6 rounded-xl bg-slate-950/80 border border-slate-800 min-w-[200px]">
          <span className="text-3xl font-extrabold text-emerald-400 font-mono block">NOT PROVEN</span>
          <span className="text-[10px] text-slate-400 font-mono uppercase">No zero-cost theorem</span>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.length === 0 ? (<div className="col-span-full p-6 border border-slate-700 text-sm text-slate-300">No numeric benchmark results are published in this dashboard. Run the local benchmark example, record the exact revision/toolchain/hardware and raw results, and review them before making performance claims.</div>) : metrics.map((m, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">{m.label}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {m.status}
              </span>
            </div>

            <div className="text-2xl font-extrabold text-white font-mono">{m.value}</div>

            <div className="flex justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
              <span>Target: <span className="text-cyan-300">{m.target}</span></span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 block">{m.sub}</span>
          </div>
        ))}
      </div>

      {/* Infrastructure Server Badge */}
      <div className="p-4 rounded-xl glass-panel border border-purple-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Server className="w-5 h-5 text-purple-400" />
          <div>
            <h4 className="text-xs font-bold text-white font-mono">Reference Discovery Server (`reflective-rust-server`)</h4>
            <p className="text-[11px] text-slate-400">A bounded protocol-discovery example for exploring the proposed CSG and slicing workflow.</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-purple-400 font-mono font-bold">
          <Zap className="w-4 h-4 animate-pulse" /> Example Server
        </div>
      </div>
    </section>
  );
};
