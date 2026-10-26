import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, Clock, Cpu, GitBranch, CheckCircle2, TrendingDown, Layers, ArrowRight, Code2 } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Slot 1: AST Read-Only Tool Classifier Visual                               */
/* -------------------------------------------------------------------------- */
export const SpecExecAstVisual: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#0B0F14] p-3 sm:p-4 flex flex-col justify-between overflow-hidden select-none font-mono">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#00d2ff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <span className="text-[11px] font-bold text-white tracking-wide">
            AST TOOL CLASSIFIER
          </span>
        </div>
        <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          READ-ONLY CERTIFIED
        </span>
      </div>

      {/* Code Signature Analysis */}
      <div className="relative z-10 my-auto py-1 text-[10.5px] leading-relaxed flex flex-col gap-1.5">
        <div className="bg-black/60 rounded-lg p-2 border border-white/10">
          <span className="text-cyan-400">@speculative_tool</span>
          <br />
          <span className="text-amber-400">async def</span>{' '}
          <span className="text-amber-300">fetch_market_chunks</span>(sym):
          <br />
          <span className="text-white/40 pl-3"># AST Visitor: ast.FunctionDef</span>
          <br />
          <span className="text-emerald-300 pl-3">return</span> await cache.get(sym)
        </div>

        <div className="flex items-center justify-between text-[9.5px] bg-white/5 p-1.5 rounded border border-white/5">
          <span className="text-white/60">MUTATION ANALYSIS:</span>
          <span className="text-emerald-400 font-bold">0 WRITE SIDE-EFFECTS</span>
          <span className="text-rose-300">SAFE FOR FORK</span>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between text-[10px] text-white/50 pt-1 border-t border-white/5">
        <span className="flex items-center gap-1 text-cyan-300">
          <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Concurrency tier: High
        </span>
        <span className="text-white/40">Python AST Parser</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Slot 2: Simulated Benchmark Comparison Chart                               */
/* -------------------------------------------------------------------------- */
export const SpecExecBenchVisual: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#0A0D12] p-3 sm:p-4 flex flex-col justify-between overflow-hidden select-none font-mono">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <TrendingDown className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] font-bold text-white tracking-wide">
            BENCHMARK LATENCY PROFILE
          </span>
        </div>
        <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
          -51.8% MEDIAN
        </span>
      </div>

      {/* Benchmark Horizontal Bars */}
      <div className="relative z-10 my-auto py-2 flex flex-col gap-3">
        {/* Sequential Bar */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-white/60">Baseline Sequential Tool Execution</span>
            <span className="text-rose-400 font-bold">764 ms</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
            <div className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full w-full" />
          </div>
        </div>

        {/* Speculative Concurrent Bar */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-cyan-300 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" /> Speculative Concurrent Runtime
            </span>
            <span className="text-emerald-400 font-bold">368 ms</span>
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '48.2%' }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-cyan-400 via-[#E11D48] to-[#F59E0B] rounded-full"
            />
          </div>
        </div>

        <div className="bg-black/50 rounded-lg p-2 border border-white/5 text-[9.5px] text-white/70 flex items-center justify-between">
          <span>Simulated local benchmark</span>
          <span className="text-emerald-400 font-semibold">5 statements, 100 ms tool latency (-51.8%)</span>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between text-[10px] text-white/50 pt-1 border-t border-white/5">
        <span>Asyncio Task Pool</span>
        <span className="text-cyan-300 font-semibold">Zero Speculative Leak</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Slot 3: Full-width Runtime Event Loop UI (Tall Column)                     */
/* -------------------------------------------------------------------------- */
export const SpecExecRuntimeUI: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[280px] sm:min-h-[350px] bg-[#070A0F] flex flex-col justify-between overflow-hidden font-mono border border-white/10">
      {/* Runtime Window Bar */}
      <div className="bg-[#0F141C] px-4 py-2.5 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-bold text-white ml-2">SpecExec Engine</span>
          <span className="text-[10px] text-white/40 hidden sm:inline">· Python Asyncio Concurrency Runtime</span>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            4 Async Coroutines Active
          </span>
        </div>
      </div>

      {/* Main Timeline Stream */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col gap-3 justify-center">
        {/* Program Stream Ingestion State */}
        <div className="bg-[#0D121B] rounded-xl p-3 border border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#E11D48] shrink-0" />
            <div>
              <span className="text-xs text-white font-semibold block font-sans">
                Program Stream Ingestion in Progress:
              </span>
              <span className="text-[11px] text-white/50">
                Detecting complete statements mid-stream... (Statement 3/5)
              </span>
            </div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold shrink-0">
            Streaming Tokens
          </span>
        </div>

        {/* Speculative Concurrency Pool Workers */}
        <div className="flex flex-col gap-2">
          <div className="text-[10px] text-white/40 uppercase tracking-wider flex items-center justify-between">
            <span>Concurrent Read-Only Execution Tasks (Precomputed Mid-Stream)</span>
            <span className="text-cyan-400">AST Policy: Confirmed Read-Only</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Worker 1 */}
            <div className="bg-black/60 rounded-xl p-2.5 border border-white/10 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-white/60">Worker #1</span>
                <span className="text-emerald-400 text-[9px] font-bold">READY</span>
              </div>
              <span className="text-[11px] font-bold text-white truncate">
                vector_search()
              </span>
              <div className="text-[9.5px] text-white/40 flex items-center justify-between">
                <span>Latency: 38ms</span>
                <span className="text-emerald-300">Cached</span>
              </div>
            </div>

            {/* Worker 2 */}
            <div className="bg-black/60 rounded-xl p-2.5 border border-cyan-500/30 bg-cyan-950/20 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-cyan-300">Worker #2</span>
                <span className="text-cyan-400 text-[9px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  PIPELINED
                </span>
              </div>
              <span className="text-[11px] font-bold text-white truncate">
                fetch_doc_metadata()
              </span>
              <div className="text-[9.5px] text-white/40 flex items-center justify-between">
                <span>Latency: 52ms</span>
                <span className="text-cyan-300">Ready</span>
              </div>
            </div>

            {/* Worker 3 */}
            <div className="bg-black/60 rounded-xl p-2.5 border border-white/10 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-white/60">Worker #3</span>
                <span className="text-emerald-400 text-[9px] font-bold">READY</span>
              </div>
              <span className="text-[11px] font-bold text-white truncate">
                query_read_replica()
              </span>
              <div className="text-[9.5px] text-white/40 flex items-center justify-between">
                <span>Latency: 64ms</span>
                <span className="text-emerald-300">Cached</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resolution Banner */}
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between text-[11px] text-emerald-300">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Authoritative replay: exact cache hits reused with 0ms wait (read-only gate enforced)
          </span>
          <span className="font-bold text-white text-xs tabular-nums">
            -51.8% LATENCY
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#0F141C] px-4 py-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50">
        <span>Simulated local benchmark: 5 statements, 100 ms tool latency</span>
        <span className="text-cyan-400 font-semibold">Simulated Benchmark Verified</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Modal Deep-Dive: Interactive Architecture Node Graph for SpecExec          */
/* -------------------------------------------------------------------------- */
interface SpecExecNode {
  id: string;
  name: string;
  role: string;
  type: string;
  details: string;
  inputs: string;
  outputs: string;
  status: string;
}

const SPECEXEC_NODES: SpecExecNode[] = [
  {
    id: 'agent_loop',
    name: 'Stream Ingestion & Detection',
    role: 'Mid-Stream Statement Detector',
    type: 'Stream AST Parser',
    details: 'Detects complete tool statements while the program is still streaming, without waiting for the full program to finish.',
    inputs: 'Streaming program tokens',
    outputs: 'Detected statement AST nodes',
    status: 'STREAM ACTIVE',
  },
  {
    id: 'ast_classifier',
    name: 'AST Tool Classifier',
    role: 'Read-Only Static Analysis',
    type: 'Python AST Analyzer',
    details: 'Inspects tool function AST for mutation operations (e.g. state write, DB mutation, disk write). Marks verified pure functions as read-only eligible.',
    inputs: 'Tool function source / bytecode AST',
    outputs: 'Read-only boolean certification',
    status: 'VERIFIED READ-ONLY',
  },
  {
    id: 'spec_scheduler',
    name: 'Concurrent Precomputation Scheduler',
    role: 'Concurrent Task Dispatcher',
    type: 'Asyncio Scheduler',
    details: 'Dispatches eligible read-only calls to run concurrently in the background as soon as their statements complete mid-stream.',
    inputs: 'Detected read-only tool statements',
    outputs: 'Dispatched async coroutine tasks',
    status: 'CONCURRENT DISPATCH',
  },
  {
    id: 'concurrency_pool',
    name: 'Asyncio Worker Pool',
    role: 'Concurrent Execution Engine',
    type: 'Python Asyncio Runtime',
    details: 'Concurrently executes read-only tool calls (e.g. search, fetch lookups) while the stream continues typing.',
    inputs: 'Parallel coroutine tasks',
    outputs: 'Precomputed result cache',
    status: 'WORKERS ACTIVE',
  },
  {
    id: 'reconciliation',
    name: 'Authoritative Replay Gate',
    role: 'Fresh Namespace Execution',
    type: 'Zero-Side-Effect Replay',
    details: 'Read-only gate: state-changing calls run only in the final authoritative replay. Exact cache hits are reused, and misses re-execute.',
    inputs: 'Final finished program + precomputed cache',
    outputs: 'Authoritative return values & state',
    status: 'READ-ONLY GATE ENFORCED',
  },
  {
    id: 'bench_metrics',
    name: 'Benchmark Telemetry',
    role: 'Simulated Local Benchmark',
    type: 'Telemetry Core',
    details: 'Evaluated on simulated local benchmark (5-statement fixture, 100 ms simulated tool latency), demonstrating 51.8% median latency cut (764 ms down to 368 ms).',
    inputs: 'Task start / completion timestamps',
    outputs: 'Median latency delta (-51.8%)',
    status: '51.8% MEDIAN CUT',
  },
];

export const SpecExecNodeGraph: React.FC<{ activeStep?: number }> = ({ activeStep = 0 }) => {
  const [selectedNode, setSelectedNode] = useState<SpecExecNode>(SPECEXEC_NODES[1]);

  return (
    <div className="w-full flex flex-col gap-4 font-mono select-none">
      {/* Topology Canvas */}
      <div className="relative w-full rounded-2xl bg-[#07090E] border border-white/15 p-4 sm:p-6 overflow-x-auto">
        <div className="min-w-[620px] flex flex-col gap-6">
          {/* Top Label */}
          <div className="flex items-center justify-between text-xs text-white/50 border-b border-white/10 pb-2">
            <span className="flex items-center gap-1.5 font-bold text-[#BBCCD7]">
              <Layers className="w-4 h-4 text-cyan-400" />
              SPECEXEC SPECULATIVE CONCURRENCY ARCHITECTURE GRAPH
            </span>
            <span className="text-[11px] text-cyan-300">Click any node to inspect data flow</span>
          </div>

          {/* Interactive Node Layout */}
          <div className="grid grid-cols-6 gap-2 sm:gap-3 items-center">
            {SPECEXEC_NODES.map((node, i) => {
              const isSelected = selectedNode.id === node.id;
              const isCurrentSimStep = activeStep > 0 && activeStep === Math.min(i + 1, 4);

              return (
                <div key={node.id} className="relative flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setSelectedNode(node)}
                    className={`w-full p-2.5 rounded-xl border transition-all text-left flex flex-col justify-between gap-1.5 cursor-pointer min-h-[92px] ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                        : isCurrentSimStep
                        ? 'border-emerald-400 bg-emerald-500/20'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-white/40">0{i + 1}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-cyan-400 animate-ping' : 'bg-cyan-500'
                        }`}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-white line-clamp-2 leading-tight">
                      {node.name}
                    </span>
                    <span className="text-[9px] text-cyan-300 truncate">
                      {node.type}
                    </span>
                  </button>

                  {/* Flow arrow between nodes */}
                  {i < SPECEXEC_NODES.length - 1 && (
                    <div className="absolute -right-2 sm:-right-2.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none text-white/20">
                      <ArrowRight className="w-3.5 h-3.5 text-white/30" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Data Flow Pulse Rail */}
          <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ x: ['-10%', '110%'] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
              className="w-24 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Node Inspector Card */}
      <div className="rounded-2xl bg-[#0D121B] border border-white/10 p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase">
              NODE INSPECTOR: {selectedNode.name}
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold">
            STATUS: {selectedNode.status}
          </span>
        </div>

        <p className="text-xs text-[#D7E2EA]/90 leading-relaxed font-sans">
          {selectedNode.details}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px]">
          <div className="bg-black/50 p-2 rounded-lg border border-white/5">
            <span className="text-white/40 block text-[9.5px]">INPUT PAYLOAD</span>
            <span className="text-cyan-300 font-mono">{selectedNode.inputs}</span>
          </div>
          <div className="bg-black/50 p-2 rounded-lg border border-white/5">
            <span className="text-white/40 block text-[9.5px]">OUTPUT DATA</span>
            <span className="text-emerald-300 font-mono">{selectedNode.outputs}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
