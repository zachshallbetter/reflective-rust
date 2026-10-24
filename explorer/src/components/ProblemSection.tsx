import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, EyeOff, ShieldCheck, Code2, Zap } from 'lucide-react';
import { audioEngine } from '../utils/audio';

export const ProblemSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'traditional' | 'rrsa'>('rrsa');

  const handleTabChange = (tab: 'traditional' | 'rrsa') => {
    setActiveTab(tab);
    audioEngine.playClick(650);
  };

  return (
    <section id="problem" className="py-24 px-6 max-w-7xl mx-auto space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-4 py-1.5 rounded-none cyber-panel-crimson text-rose-300 text-xs font-mono font-bold border border-rose-500/50 inline-flex items-center gap-2">
          <div className="cyber-corner-crimson-tl" />
          <div className="cyber-corner-crimson-br" />
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> THE METAPROGRAMMING VOID
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Why Modern Macro Metaprogramming <br />
          <span className="gradient-text-crimson">Escalates Complexity & Waste</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
          Procedural macros receive token streams rather than compiler-resolved type information. Some derives parse those tokens with crates such as syn; build-time impact varies by workload. This comparison presents a proposed compiler-reflection design, not a feature implemented by this repository.
        </p>
      </div>

      {/* Interactive Toggle Bar */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 border border-slate-800 rounded-none cyber-panel">
          <button
            onClick={() => handleTabChange('traditional')}
            className={`px-5 py-2 text-xs font-mono font-bold transition-all ${
              activeTab === 'traditional'
                ? 'bg-rose-600/30 text-rose-300 border border-rose-500/50 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Current Proc Macros (`syn` / `quote`)
          </button>
          <button
            onClick={() => handleTabChange('rrsa')}
            className={`px-5 py-2 text-xs font-mono font-bold transition-all ${
              activeTab === 'rrsa'
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Proposed API (`core::meta::Info`)
          </button>
        </div>
      </div>

      {/* Interactive Code & Architecture Comparison */}
      <div className="cyber-panel p-8 space-y-6">
        <div className="cyber-corner-tl" />
        <div className="cyber-corner-tr" />
        <div className="cyber-corner-bl" />
        <div className="cyber-corner-br" />

        {activeTab === 'traditional' ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-rose-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/20 text-rose-400 border border-rose-500/40">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-mono">Traditional Proc-Macro Token Stream Pipeline</h3>
                  <span className="text-xs text-rose-400 font-mono">Blind text token re-parsing across out-of-process binaries</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-rose-500/20 text-rose-300 text-xs font-mono font-bold border border-rose-500/40">
                No general benchmark established
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-rose-400" /> Unparsed Macro Input (`proc_macro::TokenStream`)
                </span>
                <pre className="bg-slate-950 p-4 text-xs font-mono text-rose-300 border border-rose-500/30 overflow-x-auto leading-relaxed">
{`// Procedural macro receives RAW tokens without type context
#[proc_macro_derive(MyReflect)]
pub fn derive_reflect(input: TokenStream) -> TokenStream {
    // 1. Re-parse token stream into AST via syn crate (heavy AST memory)
    let ast: DeriveInput = syn::parse(input).unwrap();
    
    // 2. Generate code strings via quote! macro
    let name = ast.ident;
    let expanded = quote! {
        impl MyReflect for #name {
            // Cannot inspect field alignment or byte offsets!
        }
    };
    expanded.into()
}`}
                </pre>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <span className="text-xs font-mono text-slate-400 uppercase">Structural Failures</span>
                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-950/80 border border-rose-500/30 space-y-1">
                    <strong className="text-rose-400 block font-bold">1. Zero Type Resolution</strong>
                    <p className="text-slate-300">A procedural macro cannot directly query rustc's resolved types or final layout through the stable proc-macro API.</p>
                  </div>
                  <div className="p-3.5 bg-slate-950/80 border border-rose-500/30 space-y-1">
                    <strong className="text-rose-400 block font-bold">2. Redundant Crate Compilations</strong>
                    <p className="text-slate-300">Some derive macros use parsing and code-generation crates such as syn, quote, and proc-macro2. The cost varies by dependency graph and build; this project has not established a general multiplier.</p>
                  </div>
                  <div className="p-3.5 bg-slate-950/80 border border-rose-500/30 space-y-1">
                    <strong className="text-rose-400 block font-bold">3. LLM Code Hallucinations</strong>
                    <p className="text-slate-300">AI tools can misinterpret code context; a compiler-backed graph might help when the underlying facts are available and trustworthy. This project has not measured a general error rate.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-cyan-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-mono">Proposed Static Reflection Pipeline (not implemented)</h3>
                  <span className="text-xs text-cyan-400 font-mono">Conceptual proposal — not available on stable Rust</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40">
                No zero-cost claim established
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" /> Illustrative proposal (`core::meta` is not available on stable Rust)
                </span>
                <pre className="bg-slate-950 p-4 text-xs font-mono text-cyan-300 border border-cyan-500/30 overflow-x-auto leading-relaxed">
{`use core::meta::{of, layout_of, fields_of, Info};

struct UserAccount {
    user_id: u64,
    privilege: u32,
    active: bool,
}

// PSEUDOCODE: proposed API; this is not compilable stable Rust.
const ACCOUNT_INFO: Info = of::<UserAccount>();
const ACCOUNT_LAYOUT = layout_of::<UserAccount>();

const_eval! {
    assert_eq!(ACCOUNT_LAYOUT.size, 16);
    assert_eq!(ACCOUNT_LAYOUT.align, 8);
}`}
                </pre>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <span className="text-xs font-mono text-slate-400 uppercase">Design goals (not established guarantees)</span>
                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-950/80 border border-cyan-500/30 space-y-1">
                    <strong className="text-cyan-400 block font-bold">1. Proposed compiler-owned handles</strong>
                    <p className="text-slate-300">If implemented, opaque handles could query compiler type context directly. This interface does not exist in the current workspace.</p>
                  </div>
                  <div className="p-3.5 bg-slate-950/80 border border-cyan-500/30 space-y-1">
                    <strong className="text-cyan-400 block font-bold">2. No measured overhead result</strong>
                    <p className="text-slate-300">Avoiding metadata for unannotated types is a design goal, not a demonstrated theorem or benchmark result.</p>
                  </div>
                  <div className="p-3.5 bg-slate-950/80 border border-cyan-500/30 space-y-1">
                    <strong className="text-cyan-400 block font-bold">3. Future compiler-backed context slicing</strong>
                    <p className="text-slate-300">Graph slicing can provide structured context only when trustworthy source facts exist; it cannot eliminate hallucinations, and this workspace has no compiler extractor.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* Traditional Macro Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="cyber-panel-crimson p-8 space-y-6"
        >
          <div className="cyber-corner-crimson-tl" />
          <div className="cyber-corner-crimson-br" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <EyeOff className="w-4 h-4" /> Traditional Token Macros
            </span>
            <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
              Unparsed Strings
            </span>
          </div>

          <ul className="space-y-4 text-xs font-mono text-slate-300">
            <li className="flex items-start gap-3 bg-slate-950/70 p-3.5 border border-rose-500/30">
              <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-rose-300 block mb-0.5">Unparsed `TokenStream` Input</strong>
                Procedural macros see token input rather than compiler-resolved type information; derive implementations may still emit code that queries runtime layout where available.
              </div>
            </li>

            <li className="flex items-start gap-3 bg-slate-950/70 p-3.5 border border-rose-500/30">
              <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-rose-300 block mb-0.5">Duplicate AST Parsing (`syn` Overhead)</strong>
                Every crate re-parses and re-constructs AST token trees out-of-process, consuming up to 40% of total build times.
              </div>
            </li>
          </ul>
        </motion.div>

        {/* Reflective Way Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="cyber-panel-cyan p-8 space-y-6"
        >
          <div className="cyber-corner-tl" />
          <div className="cyber-corner-br" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Reflective Rust (RRSA)
            </span>
            <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
              Compiler-Certified
            </span>
          </div>

          <ul className="space-y-4 text-xs font-mono text-slate-300">
            <li className="flex items-start gap-3 bg-slate-950/70 p-3.5 border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-cyan-300 block mb-0.5">Static Reflection Handles (`core::meta::Info`)</strong>
                Opaque handles operating in <code className="text-cyan-400">consteval</code> with 0 bytes memory cost for un-annotated types.
              </div>
            </li>

            <li className="flex items-start gap-3 bg-slate-950/70 p-3.5 border border-cyan-500/30">
              <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-cyan-300 block mb-0.5">Compiler Semantic Graph (CSG) Schema</strong>
                Standardized out-of-process JSON graph capturing type hierarchies, methods, and privacy bounds across LLVM, Cranelift, and GCC.
              </div>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};
