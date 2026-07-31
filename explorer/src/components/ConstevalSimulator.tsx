import React, { useState } from 'react';
import { Play, CheckCircle2, Cpu, Zap } from 'lucide-react';

export const ConstevalSimulator: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const runSimulation = () => {
    setIsRunning(true);
    setOutput(null);
    setTimeout(() => {
      setIsRunning(false);
      setOutput(`==================================================
  Reflective Rust core::meta Consteval Execution
==================================================
1. Querying core::meta::of::<PlayerAccount>()
   -> Handle ID: 0x8000_0000_0000_0010 (Kind: Struct)
2. Memory Layout Attributes (layout_of):
   -> Size     : 16 bytes
   -> Alignment: 8 bytes
3. Inspecting Fields (fields_of):
   └─ Field 0: 'id'       (offset 0, type: u64)
   └─ Field 1: 'score'    (offset 8, type: u32)
   └─ Field 2: 'active'   (offset 12, type: bool)
==================================================
 Theorem 1.1 Invariant: 0 Bytes Runtime Memory Overhead!
==================================================`);
    }, 600);
  };

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-6 h-6 text-orange-400" />
          Interactive Consteval vs Runtime Reflection Simulator
        </h2>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Compare traditional procedural macro token parsing with Reflective Rust static handles (<code className="text-cyan-400">core::meta::Info</code>).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Input Window */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-400" /> Reflective Rust Source Code
            </span>
            <button
              onClick={runSimulation}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              {isRunning ? 'Compiling in consteval...' : 'Run Simulation'}
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-200 overflow-x-auto border border-slate-800 leading-relaxed">
{`use reflective_rust_meta::{of, layout_of, fields_of, Info};

struct PlayerAccount {
    id: u64,
    score: u32,
    active: bool,
}

const PLAYER_INFO: Info = of::<PlayerAccount>();
const PLAYER_LAYOUT = layout_of::<PlayerAccount>();

fn main() {
    let fields = fields_of(PLAYER_INFO);
    println!("Struct Size: {} bytes", PLAYER_LAYOUT.size);
}`}
          </pre>
        </div>

        {/* Execution Output Window */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Consteval Execution Terminal
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-emerald-400 border border-slate-800 min-h-[220px] overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {isRunning ? (
              <div className="flex items-center gap-2 text-orange-400 py-10 justify-center">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                Executing consteval Miri intrinsic queries...
              </div>
            ) : output ? (
              output
            ) : (
              <span className="text-slate-500">Click 'Run Simulation' to execute compile-time reflection.</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
