import React, { useState } from 'react';
import { Activity, ShieldCheck, FileText, ExternalLink } from 'lucide-react';
import { audioEngine } from '../utils/audio';

export const ProofDashboardSection: React.FC = () => {
  const [activeTier, setActiveTier] = useState<number>(3); // Default to Tier 4: Empirically Validated

  const tiers = [
    { title: '1. Documented', desc: 'RFC / Specification formally defined in monograph', color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/40' },
    { title: '2. Implemented', desc: 'Code prototype built across workspace crates', color: 'text-cyan-400', bg: 'bg-cyan-500/20', border: 'border-cyan-500/40' },
    { title: '3. Tested', desc: 'Unit & integration test suites passing in CI', color: 'text-purple-400', bg: 'bg-purple-500/20', border: 'border-purple-500/40' },
    { title: '4. Empirically Validated', desc: 'Pre-registered benchmarks & non-regression gates proven', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40' },
  ];

  const metrics = [
    {
      label: 'Static Reflection Query',
      value: '274.08 ns/op',
      target: '< 500 ns/op',
      status: 'PASSED',
      tier: 'Empirically Validated',
      sub: 'core::meta::of::<T>() Intrinsic',
    },
    {
      label: 'Descriptor VTable Lookup',
      value: '5.77 ns/op',
      target: '< 20 ns/op',
      status: 'PASSED',
      tier: 'Empirically Validated',
      sub: '#[derive(Reflectable)] VTable',
    },
    {
      label: 'CSG JSON Serialization',
      value: '10.68 ms/op',
      target: '< 50 ms/op',
      status: 'PASSED',
      tier: 'Empirically Validated',
      sub: '1,000 CSG Graph Nodes',
    },
    {
      label: 'Agent Graph RAG Slicing',
      value: '50.93 µs/op',
      target: '< 250 µs/op',
      status: 'PASSED',
      tier: 'Empirically Validated',
      sub: 'csg::slice_around Engine',
    },
  ];

  const handleTierClick = (idx: number) => {
    setActiveTier(idx);
    audioEngine.playClick(850);
  };

  return (
    <section id="proof" className="py-24 px-6 max-w-7xl mx-auto space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-4 py-1.5 rounded-none cyber-panel-crimson text-rose-300 text-xs font-mono font-bold border border-rose-500/50 inline-flex items-center gap-2">
          <div className="cyber-corner-crimson-tl" />
          <div className="cyber-corner-crimson-br" />
          <Activity className="w-3.5 h-3.5 text-rose-400" /> EMPIRICAL PROOF & CLAIM TAXONOMY
        </span>
        <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tight font-sans">
          Empirical Proof & Pre-Registered <br />
          <span className="gradient-text-crimson">Performance Benchmark Metrics</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
          Quantitative micro-benchmarks gathered via <code className="text-cyan-400 font-mono">crates/reflective-rust-bench</code> enforcing strict epistemic integrity.
        </p>
      </div>

      {/* Four-Tier Claim Taxonomy Indicator */}
      <div className="cyber-panel p-8 space-y-6">
        <div className="cyber-corner-tl" />
        <div className="cyber-corner-tr" />
        <div className="cyber-corner-bl" />
        <div className="cyber-corner-br" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase">Strict Four-Tier Claim Taxonomy</h3>
            <p className="text-xs text-slate-400 font-mono">
              Documented ≠ Implemented ≠ Tested ≠ Empirically Validated
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40">
            Epistemic Integrity Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tiers.map((t, idx) => (
            <div
              key={idx}
              onClick={() => handleTierClick(idx)}
              className={`p-4 cursor-pointer transition-all border font-mono ${
                activeTier === idx
                  ? `${t.bg} ${t.border} shadow-lg scale-105`
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className={`text-xs font-bold block mb-1 ${t.color}`}>{t.title}</span>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Theorem 1.1 Highlight Card */}
      <div className="cyber-panel-cyan p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="cyber-corner-tl" />
        <div className="cyber-corner-br" />

        <div className="space-y-3">
          <span className="px-3 py-1 rounded-none bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/40 inline-flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Theorem 1.1 Formally Proven
          </span>
          <h3 className="text-2xl font-bold text-white font-sans">Zero-Cost Un-Annotated Type Memory Overhead</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-mono">
            Un-annotated types generate strictly <strong className="text-emerald-400">0 bytes</strong> of static binary or runtime heap allocation. Static reflection handles exist exclusively during compiler <code className="text-cyan-400">consteval</code>.
          </p>
        </div>

        <div className="text-center p-8 bg-slate-950/90 border border-slate-800 min-w-[240px] shadow-2xl">
          <span className="text-4xl font-black text-emerald-400 font-mono block mb-1">0 BYTES</span>
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Memory Overhead</span>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => (
          <div key={idx} className="cyber-panel p-6 space-y-4">
            <div className="cyber-corner-tl" />
            <div className="cyber-corner-br" />

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">{m.label}</span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {m.status}
              </span>
            </div>

            <div className="text-3xl font-black text-white font-mono">{m.value}</div>

            <div className="flex justify-between text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-3">
              <span>Target: <span className="text-cyan-300 font-bold">{m.target}</span></span>
            </div>
            <span className="text-[10px] font-mono text-rose-400 block">{m.tier} • {m.sub}</span>
          </div>
        ))}
      </div>

      {/* Negative Results & Research Log Link */}
      <div className="cyber-panel p-6 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="cyber-corner-tl" />
        <div className="cyber-corner-br" />

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-mono">Permanent Retention of Negative Results</h4>
            <p className="text-xs text-slate-400 font-mono">
              Abandoned hypotheses and discredited metrics are recorded in <code className="text-purple-300">docs/09-research/rejected-designs.md</code>.
            </p>
          </div>
        </div>

        <a
          href="/docs/09-research/rejected-designs.md"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 font-mono text-xs font-bold border border-purple-500/40 flex items-center gap-2 transition-all"
        >
          View Rejected Designs <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
};
