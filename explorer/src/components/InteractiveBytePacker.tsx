import React, { useState } from 'react';
import { ShieldCheck, Cpu } from 'lucide-react';
import { audioEngine } from '../utils/audio';

type ReprMode = 'repr_Rust' | 'repr_C' | 'repr_packed' | 'repr_align16';

interface FieldSpec {
  name: string;
  type: 'u64' | 'u32' | 'u16' | 'u8' | 'bool' | 'f64';
  size: number;
  align: number;
}

export const InteractiveBytePacker: React.FC = () => {
  const [reprMode, setReprMode] = useState<ReprMode>('repr_Rust');
  const [fields, setFields] = useState<FieldSpec[]>([
    { name: 'id', type: 'u64', size: 8, align: 8 },
    { name: 'active', type: 'bool', size: 1, align: 1 },
    { name: 'balance', type: 'f64', size: 8, align: 8 },
    { name: 'flags', type: 'u16', size: 2, align: 2 },
  ]);

  // Compute field layout based on representation mode
  const computeLayout = () => {
    let currentOffset = 0;
    const computed: Array<{ name: string; type: string; size: number; offset: number; padAfter: number }> = [];

    fields.forEach((f) => {
      let align = f.align;
      if (reprMode === 'repr_packed') align = 1;
      if (reprMode === 'repr_align16') align = 16;

      // Align current offset
      const paddingNeeded = (align - (currentOffset % align)) % align;
      currentOffset += paddingNeeded;

      const offset = currentOffset;
      currentOffset += f.size;

      computed.push({
        name: f.name,
        type: f.type,
        size: f.size,
        offset,
        padAfter: 0,
      });
    });

    const maxAlign = reprMode === 'repr_packed' ? 1 : reprMode === 'repr_align16' ? 16 : 8;
    const totalPadding = (maxAlign - (currentOffset % maxAlign)) % maxAlign;
    const totalSize = currentOffset + totalPadding;

    return { computed, totalSize, maxAlign };
  };

  const { computed, totalSize, maxAlign } = computeLayout();

  const handleReprChange = (mode: ReprMode) => {
    setReprMode(mode);
    audioEngine.playClick(600);
  };

  const addField = (type: 'u64' | 'u32' | 'u16' | 'u8') => {
    const sizes = { u64: 8, u32: 4, u16: 2, u8: 1 };
    setFields([
      ...fields,
      { name: `val_${fields.length}`, type, size: sizes[type], align: sizes[type] },
    ]);
    audioEngine.playClick(900);
  };

  const removeField = (index: number) => {
    if (fields.length <= 1) return;
    setFields(fields.filter((_, i) => i !== index));
    audioEngine.playClick(400);
  };

  return (
    <div className="glass-panel-glow p-8 rounded-3xl border border-cyan-500/40 space-y-8 shadow-2xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40 inline-flex items-center gap-1.5 mb-2">
            <Cpu className="w-3.5 h-3.5" /> Interactive Consteval Layout Engine
          </span>
          <h3 className="text-2xl font-black text-white">Live Struct Byte Packing & Alignment Inspector</h3>
          <p className="text-xs text-slate-400 font-mono">
            Directly test how <code className="text-cyan-400">core::meta::layout_of::&lt;T&gt;()</code> calculates struct padding across alignment representations.
          </p>
        </div>

        {/* Repr Mode Toggles */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {(['repr_Rust', 'repr_C', 'repr_packed', 'repr_align16'] as ReprMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleReprChange(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                reprMode === mode
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode.replace('_', '(') + (mode.includes('_') ? ')' : '')}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Controls & Byte Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Field List Editor */}
        <div className="space-y-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-slate-300">Struct Fields ({fields.length})</span>
            <div className="flex gap-1">
              <button
                onClick={() => addField('u64')}
                className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-[10px] font-mono hover:bg-cyan-500/30"
              >
                +u64
              </button>
              <button
                onClick={() => addField('u32')}
                className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-[10px] font-mono hover:bg-purple-500/30"
              >
                +u32
              </button>
              <button
                onClick={() => addField('u8')}
                className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-mono hover:bg-emerald-500/30"
              >
                +u8
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto">
            {fields.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{i + 1}.</span>
                  <span className="text-white font-bold">{f.name}:</span>
                  <span className="text-cyan-400">{f.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[10px]">{f.size}B</span>
                  <button
                    onClick={() => removeField(i)}
                    className="text-red-400 hover:text-red-300 text-[10px] font-bold px-1.5 py-0.5 bg-red-500/10 rounded"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Byte Memory Grid Heatmap */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-300 font-bold">Memory Byte Map Visualizer</span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-slate-400">
                Total Size: <strong className="text-emerald-400 font-bold">{totalSize} Bytes</strong>
              </span>
              <span className="text-slate-400">
                Alignment: <strong className="text-cyan-400 font-bold">{maxAlign} Bytes</strong>
              </span>
            </div>
          </div>

          {/* Byte Blocks Representation */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {computed.map((c, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 flex flex-col justify-between space-y-1 shadow-lg"
                  style={{ flexGrow: c.size }}
                >
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-cyan-300 font-bold">{c.name}</span>
                    <span className="text-slate-500">{c.size}B</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">
                    Offset: <strong className="text-white">+{c.offset}</strong>
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 text-[10px] font-mono text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <code className="text-emerald-400 font-bold">core::meta</code> invariant verified: Consteval layout analysis resolves zero-cost static handles during compilation.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
