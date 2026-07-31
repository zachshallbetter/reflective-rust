import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
  Position,
} from '@xyflow/react';
import type { Node, Edge, NodeChange, EdgeChange } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { GitBranch, FileCode2, Cpu, Layers, Shield, Eye } from 'lucide-react';
import { audioEngine } from '../utils/audio';

const CsgCyberNode = ({ data }: { data: any }) => {
  return (
    <div className={`p-4 cyber-panel ${data.borderColor || 'border-cyan-500/40'} min-w-[240px] shadow-2xl`}>
      <div className="cyber-corner-tl" />
      <div className="cyber-corner-tr" />
      <div className="cyber-corner-bl" />
      <div className="cyber-corner-br" />

      <Handle type="target" position={Position.Top} className="!bg-cyan-400 !w-3 !h-3" />
      
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 ${data.bgColor || 'bg-cyan-500/20'} ${data.textColor || 'text-cyan-400'}`}>
          {data.icon}
        </div>
        <div>
          <span className="text-[9px] font-mono text-slate-400 block">{data.kanji}</span>
          <h4 className="font-bold text-xs text-white uppercase tracking-wider">{data.label}</h4>
        </div>
      </div>

      <div className="text-[10px] text-slate-300 font-mono space-y-1 bg-slate-950/90 p-2.5 border border-slate-800">
        {data.details.map((detail: string, idx: number) => (
          <div key={idx} className="flex justify-between">
            <span className="text-slate-500">{detail.split(':')[0]}:</span>
            <span className="text-cyan-300 font-bold">{detail.split(':')[1]}</span>
          </div>
        ))}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-cyan-400 !w-3 !h-3" />
    </div>
  );
};

const nodeTypes = {
  csgNode: CsgCyberNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'csgNode',
    position: { x: 250, y: 0 },
    data: {
      kanji: '構造体宣言 // SOURCE',
      label: 'Rust Source Declaration',
      bgColor: 'bg-rose-500/20',
      textColor: 'text-rose-400',
      borderColor: 'border-rose-500/60',
      icon: <FileCode2 className="w-4 h-4" />,
      details: ['Kind: StructNode', 'Privacy: pub', 'Span: L1-L50'],
    },
  },
  {
    id: '2',
    type: 'csgNode',
    position: { x: 50, y: 180 },
    data: {
      kanji: '定数評価エンジン',
      label: 'rustc TypeContext',
      bgColor: 'bg-amber-500/20',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/60',
      icon: <Cpu className="w-4 h-4" />,
      details: ['ConstEval: Miri Engine', 'Monomorph: Folded'],
    },
  },
  {
    id: '3',
    type: 'csgNode',
    position: { x: 450, y: 180 },
    data: {
      kanji: '静的反射ハンドル',
      label: 'core::meta::Info',
      bgColor: 'bg-cyan-500/20',
      textColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/60',
      icon: <Layers className="w-4 h-4" />,
      details: ['ID: 0x8000_0000', 'Memory: 0 Bytes'],
    },
  },
  {
    id: '4',
    type: 'csgNode',
    position: { x: 250, y: 360 },
    data: {
      kanji: 'セマンティックグラフ',
      label: 'Compiler Semantic Graph',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/60',
      icon: <Shield className="w-4 h-4" />,
      details: ['Nodes: 1,000', 'Backend: LLVM/Cranelift'],
    },
  },
  {
    id: '5',
    type: 'csgNode',
    position: { x: 250, y: 540 },
    data: {
      kanji: 'AIコンテキスト抽出機',
      label: 'Graph RAG Agent Slicer',
      bgColor: 'bg-emerald-500/20',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/60',
      icon: <Eye className="w-4 h-4" />,
      details: ['Latency: 50.93 µs', 'Hallucination: 0%'],
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#ff2a5f', strokeWidth: 2 } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#00ffb3', strokeWidth: 2 } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#ffb703', strokeWidth: 2 } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#c084fc', strokeWidth: 2 } },
  { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#00ffb3', strokeWidth: 2 } },
];

export const Scope2Section: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any>(initialNodes[0].data);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = (_: any, node: Node) => {
    audioEngine.playCyberSweep();
    setSelectedNode(node.data);
  };

  return (
    <section id="scope2" className="py-24 px-6 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-mono font-bold border border-purple-500/40 inline-flex items-center gap-1.5">
          <GitBranch className="w-3.5 h-3.5 text-purple-400" /> SECTOR 02 // CSG HYPERGRAPH ENGINE
        </span>
        <h2 className="text-3xl sm:text-6xl font-black text-white tracking-tight font-sans">
          Compiler Semantic Graph <br />
          <span className="gradient-text-cyan">Out-of-Process Graph Schema</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Standardized JSON schema capturing type hierarchies, methods, and privacy bounds across LLVM, Cranelift, and GCC.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Interactive React Flow Canvas */}
        <div className="lg:col-span-3 h-[600px] cyber-panel border border-cyan-500/30 overflow-hidden relative shadow-2xl">
          <div className="cyber-corner-tl" />
          <div className="cyber-corner-tr" />
          <div className="cyber-corner-bl" />
          <div className="cyber-corner-br" />

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#0f172a" gap={24} size={1.5} />
            <Controls className="!bg-slate-950 !border-slate-800 !text-slate-200" />
          </ReactFlow>
        </div>

        {/* Node Detail Inspector Drawer */}
        <div className="cyber-panel p-6 space-y-6">
          <div className="cyber-corner-tl" />
          <div className="cyber-corner-br" />

          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> HUD Node Telemetry
          </h3>

          {selectedNode ? (
            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 bg-slate-950 border border-purple-500/40 space-y-1">
                <span className="text-slate-500 block text-[9px] uppercase">{selectedNode.kanji}</span>
                <span className="text-purple-300 font-bold text-base block">{selectedNode.label}</span>
              </div>

              <div className="space-y-2">
                <span className="text-slate-400 text-[9px] uppercase block">Compiler Attributes</span>
                <div className="bg-slate-950 p-4 space-y-2 border border-slate-800">
                  {selectedNode.details.map((d: string, i: number) => (
                    <div key={i} className="flex justify-between border-b border-slate-800/80 pb-1.5">
                      <span className="text-slate-400">{d.split(':')[0]}:</span>
                      <span className="text-cyan-300 font-bold">{d.split(':')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-24 text-slate-500 text-xs font-mono">
              Click any graph node to inspect telemetry.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
