import React, { useState } from 'react';
import { History, Check, X } from 'lucide-react';

export const HistoricalTimeline: React.FC = () => {
  const [selectedMilestone, setSelectedMilestone] = useState(3);

  const milestones = [
    {
      year: '1982',
      title: '3-Lisp & Procedural Reflection',
      author: 'Brian Cantwell Smith',
      desc: 'Formulated procedural reflection, infinite towers of interpreters, and semantic self-introspection.',
    },
    {
      year: '1991',
      title: 'CLOS Metaobject Protocol (MOP)',
      author: 'Gregor Kiczales et al.',
      desc: 'Designed the object-oriented Metaobject Protocol (MOP), separating base-level execution from meta-level protocol manipulation.',
    },
    {
      year: '2023',
      title: 'C++ Static Reflection (P2996)',
      author: 'Hana Dusíková et al.',
      desc: 'Pioneered modern static reflection in C++ using opaque handles and consteval expansion.',
    },
    {
      year: '2026',
      title: 'Reflective Rust (RRSA & CSG)',
      author: 'Reflective Rust Research Monograph',
      desc: 'Introduced Compiler Semantic Graphs (CSG), zero-cost core::meta static reflection, and compiler-certified Graph RAG agent slicing.',
    },
  ];

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <History className="w-6 h-6 text-purple-400" />
          Historical Lineage & Comparative Matrix
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Four decades of reflection research synthesized into a zero-cost systems architecture.
        </p>
      </div>

      {/* Historical Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {milestones.map((m, idx) => {
          const isSelected = selectedMilestone === idx;
          return (
            <div
              key={idx}
              onClick={() => setSelectedMilestone(idx)}
              className={`glass-panel p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20 scale-105'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-xs font-mono font-bold text-purple-400 block mb-1">{m.year}</span>
              <h3 className="font-bold text-sm text-white mb-1">{m.title}</h3>
              <span className="text-[11px] text-slate-400 block mb-2">{m.author}</span>
              <p className="text-xs text-slate-300 leading-relaxed">{m.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Comparative Feature Matrix */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 overflow-x-auto space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Language Reflection Feature Comparison Matrix
        </h3>

        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-3 px-4">Feature / Guarantee</th>
              <th className="py-3 px-4 text-cyan-400 font-bold">Reflective Rust</th>
              <th className="py-3 px-4">C++ P2996</th>
              <th className="py-3 px-4">Java / C#</th>
              <th className="py-3 px-4">Julia / Smalltalk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            <tr>
              <td className="py-3 px-4 font-semibold text-white">Zero Runtime Memory Overhead (0B)</td>
              <td className="py-3 px-4 text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Yes (Theorem 1.1)</td>
              <td className="py-3 px-4 text-emerald-400 flex items-center gap-1"><Check className="w-4 h-4" /> Yes</td>
              <td className="py-3 px-4 text-red-400 flex items-center gap-1"><X className="w-4 h-4" /> No (Heap Metadata)</td>
              <td className="py-3 px-4 text-red-400 flex items-center gap-1"><X className="w-4 h-4" /> No (Interpreter Objects)</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-white">Out-of-Process Compiler Semantic Graph</td>
              <td className="py-3 px-4 text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Yes (CSG Schema)</td>
              <td className="py-3 px-4 text-red-400 flex items-center gap-1"><X className="w-4 h-4" /> No</td>
              <td className="py-3 px-4 text-red-400 flex items-center gap-1"><X className="w-4 h-4" /> No</td>
              <td className="py-3 px-4 text-red-400 flex items-center gap-1"><X className="w-4 h-4" /> No</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-white">Graph RAG AI Agent Slicing</td>
              <td className="py-3 px-4 text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Yes (csg::slice_around)</td>
              <td className="py-3 px-4 text-red-400 flex items-center gap-1"><X className="w-4 h-4" /> No</td>
              <td className="py-3 px-4 text-red-400 flex items-center gap-1"><X className="w-4 h-4" /> No</td>
              <td className="py-3 px-4 text-red-400 flex items-center gap-1"><X className="w-4 h-4" /> No</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-white">Cross-Backend Conformance Vectors</td>
              <td className="py-3 px-4 text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> LLVM / Cranelift / GCC</td>
              <td className="py-3 px-4 text-amber-400 flex items-center gap-1">Partial (Clang)</td>
              <td className="py-3 px-4 text-emerald-400 flex items-center gap-1"><Check className="w-4 h-4" /> Yes (JVM / CLR)</td>
              <td className="py-3 px-4 text-amber-400 flex items-center gap-1">Single Backend</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
