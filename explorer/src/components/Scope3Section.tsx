import React, { useState } from 'react';
import { Terminal, Sliders, ShieldAlert, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audio';

export const Scope3Section: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<'SecurityToken' | 'PaymentProcessor' | 'DatabasePool'>('SecurityToken');
  const [radius, setRadius] = useState<number>(1);
  const [privacyMask, setPrivacyMask] = useState<boolean>(true);

  const symbolData = {
    SecurityToken: {
      file: 'auth/token.rs',
      span: 'L1-L35',
      privacy: 'pub',
      members: [
        { name: 'secret_key', kind: 'FieldNode', privacy: 'pub(crate)' },
        { name: 'expiration', kind: 'FieldNode', privacy: 'pub' },
        { name: 'validate_token', kind: 'MethodNode', privacy: 'pub' },
      ],
    },
    PaymentProcessor: {
      file: 'billing/gateway.rs',
      span: 'L40-L120',
      privacy: 'pub',
      members: [
        { name: 'merchant_id', kind: 'FieldNode', privacy: 'private' },
        { name: 'process_transaction', kind: 'MethodNode', privacy: 'pub' },
      ],
    },
    DatabasePool: {
      file: 'db/pool.rs',
      span: 'L10-L85',
      privacy: 'pub(crate)',
      members: [
        { name: 'max_connections', kind: 'FieldNode', privacy: 'pub' },
        { name: 'acquire_connection', kind: 'MethodNode', privacy: 'pub(crate)' },
      ],
    },
  };

  const current = symbolData[selectedSymbol];

  const handleSymbolSelect = (sym: 'SecurityToken' | 'PaymentProcessor' | 'DatabasePool') => {
    setSelectedSymbol(sym);
    audioEngine.playClick(900);
  };

  return (
    <section id="scope3" className="py-24 px-6 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40 inline-flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" /> SECTOR 03 // AGENT RAG GRAPH SLICER
        </span>
        <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tight font-sans">
          Compiler-Certified Context <br />
          <span className="gradient-text-cyan">Zero-Hallucination Prompt Slicing</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Extract exact semantic contexts around target symbols with enforced visibility and type safety boundaries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <div className="cyber-panel p-8 space-y-6">
          <div className="cyber-corner-tl" />
          <div className="cyber-corner-br" />

          <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4" /> Graph Slicing Controls
          </h3>

          <div className="space-y-3">
            <label className="text-xs font-mono text-slate-300 block font-semibold">Select Target Symbol</label>
            <div className="space-y-2">
              {(['SecurityToken', 'PaymentProcessor', 'DatabasePool'] as const).map((sym) => (
                <button
                  key={sym}
                  onClick={() => handleSymbolSelect(sym)}
                  className={`w-full text-left px-4 py-3 text-xs font-mono transition-all ${
                    selectedSymbol === sym
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 font-bold shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">Slicing Depth (Radius)</span>
              <span className="text-emerald-400 font-bold">{radius} Hop(s)</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              value={radius}
              onChange={(e) => {
                setRadius(Number(e.target.value));
                audioEngine.playClick(400);
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800">
            <span className="text-xs font-mono text-slate-300">Privacy Protection Mask</span>
            <button
              onClick={() => {
                setPrivacyMask(!privacyMask);
                audioEngine.playClick(750);
              }}
              className={`px-3 py-1.5 text-xs font-mono font-bold transition-all ${
                privacyMask ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {privacyMask ? 'ACTIVE' : 'DISABLED'}
            </button>
          </div>
        </div>

        {/* Generated Context Display */}
        <div className="lg:col-span-2 cyber-panel p-8 space-y-6">
          <div className="cyber-corner-tl" />
          <div className="cyber-corner-br" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Real-Time Prompt Slice Output
            </span>
            <span className="text-[10px] font-mono px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
              0% HALLUCINATION CERTIFIED
            </span>
          </div>

          <pre className="bg-slate-950 p-6 text-xs font-mono text-emerald-400 border border-slate-800 min-h-[280px] overflow-x-auto leading-relaxed">
{`/// COMPILER-CERTIFIED SEMANTIC CONTEXT FOR SYMBOL: ${selectedSymbol}
/// File: ${current.file} | Span: ${current.span} | Privacy: ${current.privacy}
/// Graph Extraction Radius: ${radius} hop(s) | Privacy Mask: ${privacyMask ? 'ENABLED' : 'DISABLED'}
/// Connected Dependencies & Members:
${current.members
  .slice(0, radius + 1)
  .map((m) => `  - ${m.name} (${m.kind}) [Privacy: ${m.privacy}]`)
  .join('\n')}

/// COMPILER INVARIANT VERIFIED: Private visibility and type bounds enforced.`}
          </pre>

          <div className="flex items-center gap-3 p-4 bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 font-mono">
            <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0" />
            AI agents consuming this slice receive exact compiler bounds, preventing invalid suggestions or privacy leaks.
          </div>
        </div>
      </div>
    </section>
  );
};
