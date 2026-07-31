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
import { Cpu, Eye, FileCode2, Shield, Layers } from 'lucide-react';

// Custom CSG Node component
const CsgCustomNode = ({ data }: { data: any }) => {
  return (
    <div className={`p-4 rounded-xl glass-panel border transition-all duration-300 ${data.borderColor || 'border-cyan-500/30'} shadow-xl min-w-[220px]`}>
      <Handle type="target" position={Position.Top} className="!bg-cyan-400" />
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${data.bgColor || 'bg-cyan-500/20'} ${data.textColor || 'text-cyan-400'}`}>
          {data.icon}
        </div>
        <div>
          <h4 className="font-bold text-xs text-white">{data.label}</h4>
          <span className="text-[10px] font-mono text-slate-400">{data.subLabel}</span>
        </div>
      </div>
      <div className="text-[11px] text-slate-300 font-mono space-y-1 bg-slate-950/60 p-2 rounded-md">
        {data.details.map((detail: string, idx: number) => (
          <div key={idx} className="flex justify-between">
            <span className="text-slate-400">{detail.split(':')[0]}:</span>
            <span className="text-cyan-300 font-semibold">{detail.split(':')[1]}</span>
          </div>
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-cyan-400" />
    </div>
  );
};

const nodeTypes = {
  csgNode: CsgCustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'csgNode',
    position: { x: 250, y: 0 },
    data: {
      label: 'Rust Source File',
      subLabel: 'src/engine.rs',
      bgColor: 'bg-orange-500/20',
      textColor: 'text-orange-400',
      borderColor: 'border-orange-500/50',
      icon: <FileCode2 className="w-4 h-4" />,
      details: ['Kind: StructNode', 'Privacy: pub', 'Span: L1-L50'],
    },
  },
  {
    id: '2',
    type: 'csgNode',
    position: { x: 50, y: 180 },
    data: {
      label: 'rustc TypeContext',
      subLabel: 'TyCtxt Compiler Pass',
      bgColor: 'bg-amber-500/20',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/50',
      icon: <Cpu className="w-4 h-4" />,
      details: ['ConstEval: Miri Engine', 'Monomorph: Folded'],
    },
  },
  {
    id: '3',
    type: 'csgNode',
    position: { x: 450, y: 180 },
    data: {
      label: 'core::meta::Info',
      subLabel: 'Opaque Reflection Handle',
      bgColor: 'bg-cyan-500/20',
      textColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/50',
      icon: <Layers className="w-4 h-4" />,
      details: ['ID: 0x8000_0000', 'Memory: 0 Bytes'],
    },
  },
  {
    id: '4',
    type: 'csgNode',
    position: { x: 250, y: 360 },
    data: {
      label: 'Compiler Semantic Graph',
      subLabel: 'CSG JSON Out-of-Process',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/50',
      icon: <Shield className="w-4 h-4" />,
      details: ['Nodes: 1,000', 'Backend: LLVM/Cranelift'],
    },
  },
  {
    id: '5',
    type: 'csgNode',
    position: { x: 250, y: 540 },
    data: {
      label: 'Graph RAG Agent Slicer',
      subLabel: 'csg::slice_around engine',
      bgColor: 'bg-emerald-500/20',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/50',
      icon: <Eye className="w-4 h-4" />,
      details: ['Latency: 50.93 µs', 'Hallucination: 0%'],
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#f97316' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#38bdf8' } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#a855f7' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#a855f7' } },
  { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#10b981' } },
];

export const CsgGraphFlow: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = (_: any, node: Node) => {
    setSelectedNode(node.data);
  };

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
            Interactive Compiler Semantic Graph (CSG) Flow
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Drag nodes, click to inspect compiler IR metadata, and observe the reflection pipeline in real-time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* React Flow Canvas */}
        <div className="lg:col-span-3 h-[600px] glass-panel rounded-2xl border border-cyan-500/20 overflow-hidden relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#1e293b" gap={20} size={1} />
            <Controls className="!bg-slate-900 !border-slate-800 !text-slate-200" />
          </ReactFlow>
        </div>

        {/* Node Detail Drawer */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Node Inspection Panel
          </h3>
          {selectedNode ? (
            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30">
                <span className="text-slate-400 block text-[10px]">SELECTED ENTITY</span>
                <span className="text-cyan-300 font-bold text-base">{selectedNode.label}</span>
                <span className="text-slate-400 block text-[11px] mt-1">{selectedNode.subLabel}</span>
              </div>

              <div className="space-y-2">
                <span className="text-slate-400 text-[10px] uppercase">Compiler Attributes</span>
                <div className="bg-slate-950 p-3 rounded-lg space-y-1.5">
                  {selectedNode.details.map((d: string, i: number) => (
                    <div key={i} className="flex justify-between border-b border-slate-800/60 pb-1">
                      <span className="text-slate-400">{d.split(':')[0]}</span>
                      <span className="text-cyan-400 font-bold">{d.split(':')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs font-mono">
              Click any graph node to inspect compiler metadata.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
