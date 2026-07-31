import React, { useState } from 'react';
import { Cpu, Play, CheckCircle2, Zap } from 'lucide-react';
import { InteractiveBytePacker } from './InteractiveBytePacker';
import { audioEngine } from '../utils/audio';

export const Scope1Section: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [queryTarget, setQueryTarget] = useState<'PlayerAccount' | 'NetworkPacket' | 'CryptoKey'>('PlayerAccount');
  const [output, setOutput] = useState<string | null>(null);

  const structsData = {
    PlayerAccount: {
      code: `use core::meta::{of, layout_of, fields_of, Info};

struct PlayerAccount {
    id: u64,
    score: u32,
    active: bool,
}

const INFO: Info = of::<PlayerAccount>();
const LAYOUT = layout_of::<PlayerAccount>();`,
      simOutput: `==================================================
  Reflective Rust core::meta Consteval Execution
==================================================
1. Querying core::meta::of::<PlayerAccount>()
   -> Handle ID: 0x8000_0000_0000_0010 (Kind: Struct)
2. Memory Layout Attributes (layout_of):
   -> Size     : 16 bytes
   -> Alignment: 8 bytes
3. Inspecting Fields (fields_of):
   └─ Field 0: 'id'       (offset 0, type: u64, size: 8B)
   └─ Field 1: 'score'    (offset 8, type: u32, size: 4B)
   └─ Field 2: 'active'   (offset 12, type: bool, size: 1B)
==================================================
 Theorem 1.1 Invariant: 0 Bytes Runtime Memory Overhead!
==================================================`,
    },
    NetworkPacket: {
      code: `use core::meta::{of, layout_of, fields_of, Info};

#[repr(packed)]
struct NetworkPacket {
    sequence: u32,
    checksum: u16,
    flags: u8,
}

const INFO: Info = of::<NetworkPacket>();
const LAYOUT = layout_of::<NetworkPacket>();`,
      simOutput: `==================================================
  Reflective Rust core::meta Consteval Execution
==================================================
1. Querying core::meta::of::<NetworkPacket>()
   -> Handle ID: 0x8000_0000_0000_0020 (Kind: Packed Struct)
2. Memory Layout Attributes (layout_of):
   -> Size     : 7 bytes
   -> Alignment: 1 byte
3. Inspecting Fields (fields_of):
   └─ Field 0: 'sequence' (offset 0, type: u32, size: 4B)
   └─ Field 1: 'checksum' (offset 4, type: u16, size: 2B)
   └─ Field 2: 'flags'    (offset 6, type: u8, size: 1B)
==================================================
 Theorem 1.1 Invariant: 0 Bytes Runtime Memory Overhead!
==================================================`,
    },
    CryptoKey: {
      code: `use core::meta::{of, layout_of, fields_of, Info};

#[repr(align(16))]
struct CryptoKey {
    bytes: [u8; 32],
    key_id: u32,
}

const INFO: Info = of::<CryptoKey>();
const LAYOUT = layout_of::<CryptoKey>();`,
      simOutput: `==================================================
  Reflective Rust core::meta Consteval Execution
==================================================
1. Querying core::meta::of::<CryptoKey>()
   -> Handle ID: 0x8000_0000_0000_0030 (Kind: Aligned Struct)
2. Memory Layout Attributes (layout_of):
   -> Size     : 48 bytes
   -> Alignment: 16 bytes
3. Inspecting Fields (fields_of):
   └─ Field 0: 'bytes'    (offset 0, type: [u8; 32], size: 32B)
   └─ Field 1: 'key_id'   (offset 32, type: u32, size: 4B)
==================================================
 Theorem 1.1 Invariant: 0 Bytes Runtime Memory Overhead!
==================================================`,
    },
  };

  const handleSelectStruct = (st: 'PlayerAccount' | 'NetworkPacket' | 'CryptoKey') => {
    setQueryTarget(st);
    setOutput(null);
    audioEngine.playClick(600);
  };

  const runSimulation = () => {
    audioEngine.playClick(520);
    setIsRunning(true);
    setOutput(null);
    setTimeout(() => {
      setIsRunning(false);
      audioEngine.playKernelExecution();
      setOutput(structsData[queryTarget].simOutput);
    }, 550);
  };

  return (
    <section id="scope1" className="py-24 px-6 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-4 py-1.5 rounded-none cyber-panel-cyan text-cyan-300 text-xs font-mono font-bold border border-cyan-500/50 inline-flex items-center gap-2">
          <div className="cyber-corner-tl" />
          <div className="cyber-corner-br" />
          <Cpu className="w-3.5 h-3.5 text-cyan-400" /> SCOPE I: STATIC SEMANTIC REFLECTION
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Compile-Time Introspection <br />
          <span className="gradient-text-cyan">Via Opaque `core::meta` Handles</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
          Inspect memory layouts, field offsets, and monomorphized types directly during <code className="text-cyan-400 font-mono font-bold">consteval</code> without generating any runtime heap overhead.
        </p>
      </div>

      {/* Code Editor & Terminal Grid */}
      <div className="cyber-panel p-8 space-y-6">
        <div className="cyber-corner-tl" />
        <div className="cyber-corner-tr" />
        <div className="cyber-corner-bl" />
        <div className="cyber-corner-br" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-cyan-500/30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 uppercase font-bold">Target Struct:</span>
            <div className="flex gap-2">
              {(['PlayerAccount', 'NetworkPacket', 'CryptoKey'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSelectStruct(s)}
                  className={`px-3 py-1 text-xs font-mono transition-all ${
                    queryTarget === s
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:scale-105 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-rose-600/30 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" />
            {isRunning ? 'Executing Consteval Miri...' : 'Run Reflection Intrinsic'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Source Code Editor Window */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-2">
              <Zap className="w-4 h-4 text-rose-400" /> Source Code (`src/main.rs`)
            </span>
            <pre className="bg-slate-950 p-5 text-xs font-mono text-slate-200 overflow-x-auto border border-slate-800 leading-relaxed min-h-[250px]">
{structsData[queryTarget].code}
            </pre>
          </div>

          {/* Execution Terminal */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Miri Consteval Intrinsic Output
            </span>
            <div className="bg-slate-950 p-5 text-xs font-mono text-emerald-400 border border-slate-800 min-h-[250px] overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {isRunning ? (
                <div className="flex items-center gap-2 text-rose-400 py-16 justify-center">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  Evaluating static handles within consteval engine...
                </div>
              ) : output ? (
                output
              ) : (
                <span className="text-slate-500">Click 'Run Reflection Intrinsic' to execute static handle queries.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Struct Byte Alignment & Layout Inspector */}
      <InteractiveBytePacker />
    </section>
  );
};
