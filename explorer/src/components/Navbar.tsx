import React from 'react';
import { Cpu, GitBranch, Layers, Sparkles, Terminal, Activity } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'csg-graph', label: 'CSG Graph Flow', icon: GitBranch },
    { id: 'consteval', label: 'Consteval Simulator', icon: Cpu },
    { id: 'lineage', label: 'Lineage & Matrix', icon: Layers },
    { id: 'graph-rag', label: 'AI Agent Slicer', icon: Terminal },
    { id: 'benchmarks', label: 'Benchmarks & Proof', icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-cyan-500/20 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <span className="font-mono text-xl font-bold text-white">RR</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-white">Reflective Rust</h1>
              <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                v1.0.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">Compiler Semantic Graph Architecture</p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
