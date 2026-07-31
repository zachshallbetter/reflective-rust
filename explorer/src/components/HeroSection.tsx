import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Layers, Terminal, Sparkles, ShieldCheck, Cpu } from 'lucide-react';
import { CompilerCanvasHero } from './CompilerCanvasHero';
import { audioEngine } from '../utils/audio';

export const HeroSection: React.FC = () => {
  const scrollToSection = (id: string) => {
    audioEngine.playCyberSweep();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-28 pb-20 overflow-hidden bg-neo-grid crt-overlay">
      {/* HTML5 Neo-Edo Cyber Particle Physics Canvas */}
      <CompilerCanvasHero />

      {/* Cyber-Torii Visual Framing Elements */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-full max-w-7xl h-1 bg-gradient-to-r from-transparent via-rose-500/40 to-transparent pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[85%] max-w-6xl h-[2px] bg-rose-500/20 pointer-events-none" />

      {/* Floating Vertical Japanese Kanji Parallax Backdrops */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 text-8xl font-black text-rose-500/5 tracking-widest writing-vertical pointer-events-none select-none font-sans">
        反射的ラスト
      </div>
      <div className="absolute top-1/2 right-8 -translate-y-1/2 text-8xl font-black text-cyan-500/5 tracking-widest writing-vertical pointer-events-none select-none font-sans">
        型構造解析
      </div>

      {/* Cyber Ambient Glow Spotlights */}
      <div className="absolute top-1/4 -left-48 w-[650px] h-[650px] bg-rose-600/15 rounded-full blur-[150px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-48 w-[650px] h-[650px] bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none animate-pulse-slow" />

      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8 pointer-events-none">
        {/* Monograph Badge Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-none cyber-panel-crimson text-xs font-mono text-rose-300 border border-rose-500/60 shadow-2xl pointer-events-auto"
        >
          <div className="cyber-corner-crimson-tl" />
          <div className="cyber-corner-crimson-tr" />
          <div className="cyber-corner-crimson-bl" />
          <div className="cyber-corner-crimson-br" />
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="text-white font-black tracking-wider">[RRSA-MONOGRAPH-2026]</span>
          <span className="text-rose-400 border-l border-rose-500/40 pl-3">
            コンパイル時メタプログラミング & CSG
          </span>
        </motion.div>

        {/* AAA Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white leading-[1.08] pointer-events-auto"
        >
          REDEFINING RUST VIA <br />
          <span className="gradient-text-crimson">REFLECTIVE ARCHITECTURE</span>
        </motion.h1>

        {/* Hero Narrative Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-slate-300 text-base sm:text-xl font-normal max-w-3xl mx-auto leading-relaxed pointer-events-auto font-sans"
        >
          Eliminating procedural macro token-stream parsing with compiler-certified static reflection 
          (<code className="text-cyan-400 font-mono font-bold">core::meta</code>), out-of-process Compiler Semantic Graphs (CSG), 
          and zero-cost opt-in VTables—delivering <strong className="text-emerald-400 font-semibold">0 bytes memory overhead for un-annotated types</strong>.
        </motion.p>

        {/* Tactical Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-5 pt-4 pointer-events-auto"
        >
          <button
            onClick={() => scrollToSection('problem')}
            onMouseEnter={() => audioEngine.playClick(800)}
            className="relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white font-bold text-sm shadow-2xl shadow-rose-600/40 hover:scale-105 transition-all duration-200 uppercase font-mono tracking-wider"
          >
            <div className="cyber-corner-tl" />
            <div className="cyber-corner-tr" />
            <div className="cyber-corner-bl" />
            <div className="cyber-corner-br" />
            <Terminal className="w-4 h-4 text-cyan-300" /> Enter The Paradigm Shift <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>
          <button
            onClick={() => scrollToSection('scope2')}
            onMouseEnter={() => audioEngine.playClick(600)}
            className="relative flex items-center gap-3 px-8 py-4 cyber-panel text-slate-200 hover:text-white font-bold text-sm transition-all duration-200 border border-cyan-500/40 hover:border-cyan-400 uppercase font-mono tracking-wider"
          >
            <div className="cyber-corner-tl" />
            <div className="cyber-corner-tr" />
            <div className="cyber-corner-bl" />
            <div className="cyber-corner-br" />
            <Layers className="w-4 h-4 text-cyan-400" /> Launch CSG Graph Flow
          </button>
        </motion.div>

        {/* Telemetry Key Metric Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-5 pt-10 text-left pointer-events-auto max-w-5xl mx-auto"
        >
          <div
            onClick={() => scrollToSection('scope1')}
            onMouseEnter={() => audioEngine.playClick(900)}
            className="cyber-panel p-5 space-y-1.5 cursor-pointer hover:border-cyan-400 transition-all group"
          >
            <div className="cyber-corner-tl" />
            <div className="cyber-corner-br" />
            <span className="text-slate-400 text-[10px] font-mono uppercase block flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-rose-400" /> RESEARCH CORPUS
            </span>
            <span className="text-3xl font-black text-white font-mono block group-hover:text-cyan-300 transition-colors">115</span>
            <span className="text-xs text-rose-400 font-mono">Monograph Chapters</span>
          </div>

          <div
            onClick={() => scrollToSection('proof')}
            onMouseEnter={() => audioEngine.playClick(900)}
            className="cyber-panel p-5 space-y-1.5 cursor-pointer hover:border-emerald-400 transition-all group"
          >
            <div className="cyber-corner-tl" />
            <div className="cyber-corner-br" />
            <span className="text-slate-400 text-[10px] font-mono uppercase block flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> INVARIANT 1.1
            </span>
            <span className="text-3xl font-black text-emerald-400 font-mono block">0 BYTES</span>
            <span className="text-xs text-slate-400 font-mono">Un-annotated Overhead</span>
          </div>

          <div
            onClick={() => scrollToSection('proof')}
            onMouseEnter={() => audioEngine.playClick(900)}
            className="cyber-panel p-5 space-y-1.5 cursor-pointer hover:border-cyan-400 transition-all group"
          >
            <div className="cyber-corner-tl" />
            <div className="cyber-corner-br" />
            <span className="text-slate-400 text-[10px] font-mono uppercase block flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" /> VTABLE LATENCY
            </span>
            <span className="text-3xl font-black text-cyan-400 font-mono block">5.77 ns</span>
            <span className="text-xs text-slate-400 font-mono">Dynamic Dispatch</span>
          </div>

          <div
            onClick={() => scrollToSection('scope3')}
            onMouseEnter={() => audioEngine.playClick(900)}
            className="cyber-panel p-5 space-y-1.5 cursor-pointer hover:border-amber-400 transition-all group"
          >
            <div className="cyber-corner-tl" />
            <div className="cyber-corner-br" />
            <span className="text-slate-400 text-[10px] font-mono uppercase block flex items-center gap-1">
              <Terminal className="w-3 h-3 text-amber-400" /> AI GRAPH RAG
            </span>
            <span className="text-3xl font-black text-amber-400 font-mono block">-84.3%</span>
            <span className="text-xs text-slate-400 font-mono">Token Context Reduction</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
