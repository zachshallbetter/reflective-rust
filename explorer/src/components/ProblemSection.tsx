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
          Rust's macro ecosystem relies on procedural macros operating on raw, unparsed token streams devoid of type context—forcing duplicate AST parsing, inflating build times, and leaving AI tools blind.
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
            Traditional Macro (`syn` / `quote`)
          </button>
          <button
            onClick={() => handleTabChange('rrsa')}
            className={`px-5 py-2 text-xs font-mono font-bold transition-all ${
              activeTab === 'rrsa'
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Reflective Rust (`core::meta::Info`)
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
                Build Penalty: +4.2x to +11.8x
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
                    <p className="text-slate-300">Macros cannot resolve struct field sizes, field offsets, trait bounds, or monomorphized types.</p>
                  </div>
                  <div className="p-3.5 bg-slate-950/80 border border-rose-500/30 space-y-1">
                    <strong className="text-rose-400 block font-bold">2. Redundant Crate Compilations</strong>
                    <p className="text-slate-300">Every project depends on hundreds of heavy `syn`, `quote`, and `proc-macro2` AST dependencies.</p>
                  </div>
                  <div className="p-3.5 bg-slate-950/80 border border-rose-500/30 space-y-1">
                    <strong className="text-rose-400 block font-bold">3. LLM Code Hallucinations</strong>
                    <p className="text-slate-300">AI coding assistants reading raw source files fail to identify private visibility boundaries or unsafe lifetime constraints.</p>
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
                  <h3 className="text-lg font-bold text-white font-mono">Reflective Rust Static Reflection Pipeline</h3>
                  <span className="text-xs text-cyan-400 font-mono">Opaque consteval handle resolution via `core::meta`</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40">
                0 Bytes Overhead Guaranteed
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" /> Type-Safe Static Reflection Code (`core::meta`)
                </span>
                <pre className="bg-slate-950 p-4 text-xs font-mono text-cyan-300 border border-cyan-500/30 overflow-x-auto leading-relaxed">
{`use core::meta::{of, layout_of, fields_of, Info};

struct UserAccount {
    user_id: u64,
    privilege: u32,
    active: bool,
}

// Resolved at compile-time during consteval without syn or token parsing!
const ACCOUNT_INFO: Info = of::<UserAccount>();
const ACCOUNT_LAYOUT = layout_of::<UserAccount>();

const_eval! {
    assert_eq!(ACCOUNT_LAYOUT.size, 16);
    assert_eq!(ACCOUNT_LAYOUT.align, 8);
}`}
                </pre>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <span className="text-xs font-mono text-slate-400 uppercase">Architectural Guarantees</span>
                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-950/80 border border-cyan-500/30 space-y-1">
                    <strong className="text-cyan-400 block font-bold">1. Compiler-Certified Handles</strong>
                    <p className="text-slate-300">Opaque handles query compiler type context directly without token parsing or macro dependency overhead.</p>
                  </div>
                  <div className="p-3.5 bg-slate-950/80 border border-cyan-500/30 space-y-1">
                    <strong className="text-cyan-400 block font-bold">2. Zero Memory Cost (Theorem 1.1)</strong>
                    <p className="text-slate-300">Un-annotated structs generate exactly 0 bytes of static binary or runtime heap allocation.</p>
                  </div>
                  <div className="p-3.5 bg-slate-950/80 border border-cyan-500/30 space-y-1">
                    <strong className="text-cyan-400 block font-bold">3. Compiler-Certified LLM Graph RAG</strong>
                    <p className="text-slate-300">`csg::slice_around` feeds AI models exact compiler context slices, eliminating LLM hallucinations.</p>
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
                Macros operate on raw syntax strings without type resolution, field offsets, or layout padding knowledge.
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
