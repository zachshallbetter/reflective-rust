import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Copy, Check, Download, BookOpen, Layers } from 'lucide-react';
import { audioEngine } from '../utils/audio';

interface CorpusViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CorpusViewerModal: React.FC<CorpusViewerModalProps> = ({ isOpen, onClose }) => {
  const [corpusText, setCorpusText] = useState<string>('Loading single-file context corpus (llms-full.txt)...');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      audioEngine.playCyberSweep();
      fetch('/llms-full.txt')
        .then((res) => res.text())
        .then((text) => setCorpusText(text))
        .catch(() => setCorpusText('Failed to load llms-full.txt corpus. Please ensure it is present in public/llms-full.txt.'));
    }
  }, [isOpen]);

  const handleCopy = () => {
    audioEngine.playClick(900);
    navigator.clipboard.writeText(corpusText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    audioEngine.playClick(800);
    window.open('/llms-full.txt', '_blank');
  };

  const filteredText = searchQuery
    ? corpusText
        .split('\n')
        .filter((line) => line.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 300)
        .join('\n')
    : corpusText.slice(0, 15000) + '\n\n... [Truncated preview for UI performance. Click Download or Copy for complete 276.5 KB corpus]';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="cyber-panel-cyan w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden border border-cyan-500/50 shadow-2xl relative"
          >
            <div className="cyber-corner-tl" />
            <div className="cyber-corner-tr" />
            <div className="cyber-corner-bl" />
            <div className="cyber-corner-br" />

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/30 bg-slate-950/90">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                    Single-File Research Corpus (`llms-full.txt`)
                  </h3>
                  <span className="text-xs text-cyan-400 font-mono">
                    Reflective Rust Monograph • 115 Chapters • 30,003 Words • 276.5 KB
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-300" />}
                  {copied ? 'Copied Full Corpus' : 'Copy All Text'}
                </button>

                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 bg-gradient-to-r from-rose-600 to-amber-600 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Download `.txt`
                </button>

                <button
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search Filter Bar */}
            <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search monograph chapters, theorems, API functions (e.g. core::meta, CSG, Theorem 1.1)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs font-mono text-cyan-300 placeholder-slate-500 focus:outline-none"
              />
              {searchQuery && (
                <span className="text-[10px] font-mono text-amber-400 shrink-0">
                  Filtered view active
                </span>
              )}
            </div>

            {/* Main Corpus Content Stream */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-950/90 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-cyan-500 selection:text-black">
              {filteredText}
            </div>

            {/* Footer Status Bar */}
            <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Single-Pass Deterministic Context Architecture
              </span>
              <span className="text-emerald-400 font-bold">100% Zero Search Latency for LLM Agents</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
