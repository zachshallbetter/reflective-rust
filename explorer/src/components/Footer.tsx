import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-slate-800 py-12 px-6 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center font-bold text-orange-400">
            RR
          </div>
          <div>
            <span className="font-bold text-white block">Reflective Rust Systems Architecture Monograph</span>
            <span>Version 1.0.0 (Canonical Release)</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> 0 Bytes Memory Overhead Proven
          </span>
          <span className="text-slate-500">MIT / Apache-2.0 Dual License</span>
        </div>
      </div>
    </footer>
  );
};
