import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Sparkles, GitBranch, Cpu, Terminal, Activity, History, ShieldCheck, BookOpen } from 'lucide-react';
import { AudioToggle } from './AudioToggle';
import { audioEngine } from '../utils/audio';

interface HeaderNavProps {
  onOpenCorpus: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onOpenCorpus }) => {
  const { scrollYProgress } = useScroll();
  const [fps, setFps] = useState<number>(60);

  // Dynamic FPS counter simulation for cyber HUD telemetry
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const tick = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.min(60, Math.round((frameCount * 1000) / (now - lastTime))));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const scrollToSection = (id: string) => {
    audioEngine.playClick(700);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Laser Scroll Progress Bar */}
      <motion.div
        className="h-1 bg-gradient-to-r from-rose-500 via-cyan-400 via-amber-400 to-purple-500 origin-left shadow-lg shadow-cyan-400/50"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="cyber-panel border-b border-cyan-500/30 px-6 py-3 backdrop-blur-2xl bg-[#040711]/90">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & HUD Badge */}
          <div
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative w-10 h-10 rounded-none cyber-panel-crimson flex items-center justify-center border border-rose-500/60 shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <div className="cyber-corner-crimson-tl" />
              <div className="cyber-corner-crimson-br" />
              <span className="font-mono text-base font-black text-white">RR</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white tracking-wider font-mono">Reflective Rust</span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-none bg-rose-500/20 text-rose-300 border border-rose-500/50">
                  RRSA v1.0
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400/80 block">
                Compiler Semantic Graph (CSG) Framework
              </span>
            </div>
          </div>

          {/* Telemetry HUD Ticker */}
          <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 rounded-none bg-slate-950/80 border border-slate-800 text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">FPS:</span>
              <span className="text-emerald-400 font-bold">{fps}</span>
            </div>
            <div className="h-3 w-[1px] bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="text-slate-400">CSG Nodes:</span>
              <span className="text-cyan-400 font-bold">1,024</span>
            </div>
            <div className="h-3 w-[1px] bg-slate-800" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-rose-400 font-bold">0B Overhead Invariant</span>
            </div>
          </div>

          {/* Nav Quick Anchors & Audio Switch */}
          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => scrollToSection('problem')}
                className="px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all flex items-center gap-1.5 border border-transparent hover:border-cyan-500/30"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-400" /> Void
              </button>
              <button
                onClick={() => scrollToSection('scope1')}
                className="px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all flex items-center gap-1.5 border border-transparent hover:border-cyan-500/30"
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Scope I
              </button>
              <button
                onClick={() => scrollToSection('scope2')}
                className="px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all flex items-center gap-1.5 border border-transparent hover:border-cyan-500/30"
              >
                <GitBranch className="w-3.5 h-3.5 text-purple-400" /> Scope II
              </button>
              <button
                onClick={() => scrollToSection('scope3')}
                className="px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all flex items-center gap-1.5 border border-transparent hover:border-cyan-500/30"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Scope III
              </button>
              <button
                onClick={() => scrollToSection('lineage')}
                className="px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all flex items-center gap-1.5 border border-transparent hover:border-cyan-500/30"
              >
                <History className="w-3.5 h-3.5 text-amber-400" /> Lineage
              </button>
              <button
                onClick={() => scrollToSection('proof')}
                className="px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all flex items-center gap-1.5 border border-transparent hover:border-cyan-500/30"
              >
                <Activity className="w-3.5 h-3.5 text-rose-400" /> Proofs
              </button>
            </nav>

            {/* llms-full.txt Corpus Download & Viewer Modal Launcher */}
            <button
              onClick={onOpenCorpus}
              title="View or Search llms-full.txt Monograph Corpus"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-rose-500/20 text-rose-300 text-xs font-mono border border-rose-500/40 hover:bg-rose-500/30 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-rose-400" /> Read Corpus
            </button>

            <AudioToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
