import React, { useState } from 'react';
import { History, Check, X, BookOpen, Layers } from 'lucide-react';
import { audioEngine } from '../utils/audio';

export const TimelineMatrixSection: React.FC = () => {
  const [selectedMilestone, setSelectedMilestone] = useState(3);

  const milestones = [
    {
      year: '1982',
      title: '3-Lisp & Procedural Reflection',
      author: 'Brian Cantwell Smith',
      desc: 'Formulated procedural reflection, infinite towers of interpreters, and semantic self-introspection.',
      detail: 'Introduced the reflection hypothesis: computational systems capable of reasoning about their own internal representations via evaluators.',
    },
    {
      year: '1991',
      title: 'CLOS Metaobject Protocol (MOP)',
      author: 'Gregor Kiczales et al.',
      desc: 'Formulated the Metaobject Protocol (MOP), demonstrating reflective capabilities without runtime degradation.',
      detail: 'Established class, method, slot, and generic function metaobjects, enabling language extensibility.',
    },
    {
      year: '2023',
      title: 'C++ Static Reflection (P2996)',
      author: 'Hana Dusíková et al.',
      desc: 'Pioneered modern static reflection in C++ using opaque handles and consteval expansion.',
      detail: 'Replaced syntax macros with compiler-resolved reflection handles and consteval expansion traits.',
    },
    {
      year: '2026',
      title: 'Reflective Rust (RRSA & CSG)',
      author: 'Reflective Rust Research Monograph',
      desc: 'Introduced Compiler Semantic Graphs (CSG), zero-cost core::meta static reflection, and compiler-certified Graph RAG agent slicing.',
      detail: 'Combined static reflection handles (core::meta::Info) with out-of-process CSG schemas and zero-cost opt-in VTables.',
    },
  ];

  const handleSelectMilestone = (idx: number) => {
    setSelectedMilestone(idx);
    audioEngine.playClick(750);
  };

  return (
    <section id="lineage" className="py-24 px-6 max-w-7xl mx-auto space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-4 py-1.5 rounded-none cyber-panel-gold text-amber-300 text-xs font-mono font-bold border border-amber-500/50 inline-flex items-center gap-2">
          <div className="cyber-corner-gold-tl" />
          <div className="cyber-corner-gold-br" />
          <History className="w-3.5 h-3.5 text-amber-400" /> HISTORICAL LINEAGE & COMPARATIVE MATRIX
        </span>
        <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tight font-sans">
          Four Decades of Reflection Research <br />
          <span className="gradient-text-gold">Synthesized for Systems Architecture</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
          Tracing the intellectual arc from Brian Cantwell Smith's 1982 3-Lisp reflection hypothesis to CLOS MOP, C++ P2996, and Reflective Rust.
        </p>
      </div>

      {/* Historical Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {milestones.map((m, idx) => {
          const isSelected = selectedMilestone === idx;
          return (
            <div
              key={idx}
              onClick={() => handleSelectMilestone(idx)}
              className={`cyber-panel p-6 cursor-pointer transition-all duration-300 space-y-3 ${
                isSelected
                  ? 'border-amber-500 bg-amber-500/10 shadow-2xl shadow-amber-500/20 scale-105'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {isSelected ? (
                <>
                  <div className="cyber-corner-gold-tl" />
                  <div className="cyber-corner-gold-tr" />
                  <div className="cyber-corner-gold-bl" />
                  <div className="cyber-corner-gold-br" />
                </>
              ) : (
                <>
                  <div className="cyber-corner-tl" />
                  <div className="cyber-corner-br" />
                </>
              )}

              <span className="text-xs font-mono font-bold text-amber-400 block">{m.year}</span>
              <h3 className="font-bold text-sm text-white">{m.title}</h3>
              <span className="text-[11px] font-mono text-slate-400 block">{m.author}</span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{m.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Active Milestone Inspector Drawer */}
      <div className="cyber-panel-gold p-6 space-y-3">
        <div className="cyber-corner-gold-tl" />
        <div className="cyber-corner-gold-br" />

        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h4 className="text-sm font-bold text-white font-mono uppercase">
            Milestone Deep Dive: {milestones[selectedMilestone].year} — {milestones[selectedMilestone].title}
          </h4>
        </div>
        <p className="text-xs text-slate-300 font-mono leading-relaxed pl-8">
          {milestones[selectedMilestone].detail}
        </p>
      </div>

      {/* Comparative Matrix Table */}
      <div className="cyber-panel p-8 space-y-6 overflow-x-auto">
        <div className="cyber-corner-tl" />
        <div className="cyber-corner-tr" />
        <div className="cyber-corner-bl" />
        <div className="cyber-corner-br" />

        <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" /> Reflection Feature Comparison Matrix
        </h3>

        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-4 px-4">Feature / Guarantee</th>
              <th className="py-4 px-4 text-cyan-400 font-bold">Reflective Rust (RRSA)</th>
              <th className="py-4 px-4">C++ P2996</th>
              <th className="py-4 px-4">Java / C#</th>
              <th className="py-4 px-4">Julia / Smalltalk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            <tr>
              <td className="py-4 px-4 font-semibold text-white">Zero Runtime Memory Overhead (0B)</td>
              <td className="py-4 px-4 text-emerald-400 font-bold flex items-center gap-1.5"><Check className="w-4 h-4" /> Yes (Theorem 1.1)</td>
              <td className="py-4 px-4 text-emerald-400 flex items-center gap-1.5"><Check className="w-4 h-4" /> Yes</td>
              <td className="py-4 px-4 text-rose-400 flex items-center gap-1.5"><X className="w-4 h-4" /> No (Heap Metadata)</td>
              <td className="py-4 px-4 text-rose-400 flex items-center gap-1.5"><X className="w-4 h-4" /> No (Interpreter Objects)</td>
            </tr>
            <tr>
              <td className="py-4 px-4 font-semibold text-white">Out-of-Process Compiler Semantic Graph</td>
              <td className="py-4 px-4 text-emerald-400 font-bold flex items-center gap-1.5"><Check className="w-4 h-4" /> Yes (CSG Schema)</td>
              <td className="py-4 px-4 text-rose-400 flex items-center gap-1.5"><X className="w-4 h-4" /> No</td>
              <td className="py-4 px-4 text-rose-400 flex items-center gap-1.5"><X className="w-4 h-4" /> No</td>
              <td className="py-4 px-4 text-rose-400 flex items-center gap-1.5"><X className="w-4 h-4" /> No</td>
            </tr>
            <tr>
              <td className="py-4 px-4 font-semibold text-white">Graph RAG AI Agent Slicing</td>
              <td className="py-4 px-4 text-emerald-400 font-bold flex items-center gap-1.5"><Check className="w-4 h-4" /> Yes (csg::slice_around)</td>
              <td className="py-4 px-4 text-rose-400 flex items-center gap-1.5"><X className="w-4 h-4" /> No</td>
              <td className="py-4 px-4 text-rose-400 flex items-center gap-1.5"><X className="w-4 h-4" /> No</td>
              <td className="py-4 px-4 text-rose-400 flex items-center gap-1.5"><X className="w-4 h-4" /> No</td>
            </tr>
            <tr>
              <td className="py-4 px-4 font-semibold text-white">Cross-Backend Conformance Vectors</td>
              <td className="py-4 px-4 text-emerald-400 font-bold flex items-center gap-1.5"><Check className="w-4 h-4" /> LLVM / Cranelift / GCC</td>
              <td className="py-4 px-4 text-amber-400 flex items-center gap-1.5">Partial (Clang)</td>
              <td className="py-4 px-4 text-emerald-400 flex items-center gap-1.5"><Check className="w-4 h-4" /> Yes (JVM / CLR)</td>
              <td className="py-4 px-4 text-amber-400 flex items-center gap-1.5">Single Backend</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
