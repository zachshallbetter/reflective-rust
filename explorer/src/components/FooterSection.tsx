import React, { useState } from 'react';
import { Download, Copy, Check, FileCode, BookOpen } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface FooterSectionProps {
  onOpenCorpus?: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onOpenCorpus }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    audioEngine.playClick(900);
    navigator.clipboard.writeText(window.location.origin + '/llms-full.txt');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    audioEngine.playCyberSweep();
    window.open('/llms-full.txt', '_blank');
  };

  return (
    <footer className="cyber-panel border-t border-slate-800 py-16 px-6 mt-32 bg-[#040711]">
      <div className="cyber-corner-tl" />
      <div className="cyber-corner-tr" />

      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 text-xs font-mono">
          {/* Logo & Monograph Meta */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 cyber-panel-crimson border border-rose-500/50 flex items-center justify-center font-bold text-white text-xl shadow-lg">
              <div className="cyber-corner-crimson-tl" />
              <div className="cyber-corner-crimson-br" />
              RR
            </div>
            <div>
              <span className="font-bold text-white text-base block font-mono">
                Reflective Rust Systems Architecture (RRSA)
              </span>
              <span className="text-slate-400 block text-xs">
                Research Monograph v1.0.0 • 115 Chapters (30,003 Words)
              </span>
            </div>
          </div>

          {/* Action Downloads & Corpus Badges */}
          <div className="flex flex-wrap items-center gap-4">
            {onOpenCorpus && (
              <button
                onClick={onOpenCorpus}
                className="px-4 py-2.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-xs font-mono shadow-lg hover:bg-cyan-500/30 transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" /> Read Single-File Corpus
              </button>
            )}

            <button
              onClick={handleDownload}
              className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs font-mono shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-cyan-300" /> Download `llms-full.txt` (276.5 KB)
            </button>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 cyber-panel text-slate-200 hover:text-white font-mono text-xs border border-cyan-500/40 flex items-center gap-2 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              {copied ? 'Corpus URL Copied!' : 'Copy Corpus URL'}
            </button>
          </div>
        </div>

        {/* Canonical Hierarchy Declaration */}
        <div className="p-6 bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-2 text-slate-400">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <FileCode className="w-4 h-4" /> Authority Resolution Hierarchy (AUTHORITY.md)
          </div>
          <p className="leading-relaxed">
            Architecture & Research Doctrine → Canonical Ontology & Glossary → Language Specification → Code / Substrate → Generated Artifacts. Code or generated artifacts never silently alter theory or specs.
          </p>
        </div>

        {/* Copyright & Badges */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 border-t border-slate-800/80 pt-6">
          <span>Reflective Rust Research Group © 2026. MIT / Apache-2.0 Dual License.</span>
          <div className="flex items-center gap-4 text-[11px] mt-2 sm:mt-0">
            <span className="text-emerald-400">Theorem 1.1 Verified</span>
            <span>•</span>
            <span className="text-cyan-400">0B Memory Cost</span>
            <span>•</span>
            <span className="text-purple-400">CSG Graph RAG Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
