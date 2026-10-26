import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Database, Terminal, Lock, Code2, Server, ArrowRight, Table, Layers } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Slot 1: AST SQL Validator Visual                                            */
/* -------------------------------------------------------------------------- */
export const Talk2DataAstVisual: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full bg-[#0D0D12] p-3 sm:p-4 flex flex-col justify-between overflow-hidden select-none font-mono">
      {/* Background grid accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#E11D48_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] font-bold text-white tracking-wide">
            AST SQL VALIDATOR
          </span>
        </div>
        <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          SELECT-ONLY ENFORCED
        </span>
      </div>

      {/* AST Code Tree Visualization */}
      <div className="relative z-10 my-auto py-1 text-[11px] leading-relaxed flex flex-col gap-1.5">
        <div className="bg-black/60 rounded-lg p-2 border border-white/10 text-[10.5px]">
          <span className="text-rose-400 font-semibold">SELECT</span>{' '}
          <span
            onMouseEnter={() => setHoveredNode('projection')}
            onMouseLeave={() => setHoveredNode(null)}
            className={`cursor-pointer transition-colors px-1 rounded ${
              hoveredNode === 'projection' ? 'bg-rose-900/60 text-rose-200' : 'text-slate-300'
            }`}
          >
            r.name, SUM(amount) AS total_revenue
          </span>{' '}
          <span className="text-rose-400 font-semibold">FROM</span>{' '}
          <span
            onMouseEnter={() => setHoveredNode('table')}
            onMouseLeave={() => setHoveredNode(null)}
            className={`cursor-pointer transition-colors px-1 rounded ${
              hoveredNode === 'table' ? 'bg-cyan-900/60 text-cyan-200' : 'text-cyan-300'
            }`}
          >
            orders o JOIN regions r ON o.region_id = r.id
          </span>{' '}
          <span className="text-rose-400 font-semibold">GROUP BY</span>{' '}
          <span
            onMouseEnter={() => setHoveredNode('filter')}
            onMouseLeave={() => setHoveredNode(null)}
            className={`cursor-pointer transition-colors px-1 rounded ${
              hoveredNode === 'filter' ? 'bg-amber-900/60 text-amber-200' : 'text-amber-300'
            }`}
          >
            r.name
          </span>
        </div>

        {/* AST Inspection Tags */}
        <div className="flex items-center gap-2 text-[9.5px]">
          <span className="text-white/40">DISALLOWED AST NODES:</span>
          <span className="text-rose-400/80 line-through">DROP</span>
          <span className="text-rose-400/80 line-through">UPDATE</span>
          <span className="text-rose-400/80 line-through">DELETE</span>
          <span className="text-rose-400/80 line-through">INSERT</span>
        </div>
      </div>

      {/* Footer Status */}
      <div className="relative z-10 flex items-center justify-between text-[10px] text-white/60 pt-1 border-t border-white/5">
        <span className="flex items-center gap-1 text-emerald-400">
          <Check className="w-3 h-3" /> 0 Mutating Tokens Found
        </span>
        <span className="text-white/40">Python AST Parser</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Slot 2: MCP Approval Protocol Gate Visual                                  */
/* -------------------------------------------------------------------------- */
export const Talk2DataMcpVisual: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#0E0B12] p-3 sm:p-4 flex flex-col justify-between overflow-hidden select-none font-mono">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E11D48]/10 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-rose-400" />
          <span className="text-[11px] font-bold text-white tracking-wide">
            MCP APPROVAL GATE
          </span>
        </div>
        <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-semibold">
          JSON-RPC 2.0 PROTOCOL
        </span>
      </div>

      {/* Flow Visualization */}
      <div className="relative z-10 my-auto py-2 flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
          <div className="bg-white/5 border border-white/10 rounded-lg p-1.5 flex flex-col items-center justify-center">
            <Terminal className="w-3.5 h-3.5 text-cyan-400 mb-1" />
            <span className="font-semibold text-white">Agent Tool</span>
            <span className="text-[8.5px] text-white/50">tools/call</span>
          </div>

          <div className="bg-[#E11D48]/20 border border-[#E11D48]/40 rounded-lg p-1.5 flex flex-col items-center justify-center relative">
            <div className="absolute -top-1.5 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <Lock className="w-3.5 h-3.5 text-rose-300 mb-1" />
            <span className="font-semibold text-white">MCP Gate</span>
            <span className="text-[8.5px] text-emerald-400 font-bold">Approved</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-1.5 flex flex-col items-center justify-center">
            <Database className="w-3.5 h-3.5 text-emerald-400 mb-1" />
            <span className="font-semibold text-white">Target SQL DB</span>
            <span className="text-[8.5px] text-white/50">Safe Exec</span>
          </div>
        </div>

        {/* Handshake Payload Snippet */}
        <div className="bg-black/70 rounded-md p-2 border border-white/10 text-[9.5px] text-slate-300 overflow-hidden leading-snug">
          <span className="text-white/40">{"// MCP Handshake Payload"}</span>
          <br />
          <span className="text-rose-300">"method"</span>: <span className="text-emerald-300">"tools/call"</span>,
          <br />
          <span className="text-rose-300">"safety_gate"</span>: <span className="text-cyan-300">"verified_select_only"</span>,
          <br />
          <span className="text-rose-300">"mcp_status"</span>: <span className="text-emerald-400">"approved"</span>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between text-[10px] text-white/50 pt-1 border-t border-white/5">
        <span>FastAPI Asynchronous Gateway</span>
        <span className="text-rose-300 font-semibold">JSON-RPC Handshake Verified</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Slot 3: Full-width Studio UI + Pipeline (Tall Column)                      */
/* -------------------------------------------------------------------------- */
export const Talk2DataStudioUI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'preview' | 'schema' | 'query'>('preview');

  return (
    <div className="relative w-full h-full min-h-[280px] sm:min-h-[350px] bg-[#0A0A0E] flex flex-col justify-between overflow-hidden font-mono border border-white/10">
      {/* Studio Window Bar */}
      <div className="bg-[#121218] px-4 py-2.5 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-bold text-white ml-2">Talk2Data Studio</span>
          <span className="text-[10px] text-white/40 hidden sm:inline">· Next.js + FastAPI Agent Engine</span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px]">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveTab('preview'); }}
            className={`px-2 py-0.5 rounded transition-colors ${
              activeTab === 'preview' ? 'bg-[#E11D48] text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            Studio UI
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveTab('query'); }}
            className={`px-2 py-0.5 rounded transition-colors ${
              activeTab === 'query' ? 'bg-[#E11D48] text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            AST Pipeline
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveTab('schema'); }}
            className={`px-2 py-0.5 rounded transition-colors ${
              activeTab === 'schema' ? 'bg-[#E11D48] text-white font-semibold' : 'text-white/60 hover:text-white'
            }`}
          >
            SQL Sources
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col gap-3 justify-center">
        {/* Natural Language Prompt Input Bar */}
        <div className="bg-[#14141E] rounded-xl p-2.5 sm:p-3 border border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Terminal className="w-4 h-4 text-[#E11D48] shrink-0" />
            <span className="text-xs sm:text-sm text-white/90 truncate font-sans">
              "Which region has the most revenue?"
            </span>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-md bg-[#E11D48]/30 border border-[#E11D48]/50 text-rose-200 shrink-0 font-mono">
            Agent Dispatched
          </span>
        </div>

        {/* Validated SQL Generated Box */}
        <div className="bg-black/70 rounded-xl p-3 border border-white/10 text-xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px] text-white/50">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> AST VALIDATION PASSED (SELECT-ONLY)
            </span>
            <span className="text-rose-300">MCP APPROVED</span>
          </div>
          <code className="text-[11px] sm:text-xs text-slate-300">
            <span className="text-rose-400 font-bold">SELECT</span> r.name, SUM(amount) AS total_revenue{' '}
            <span className="text-rose-400 font-bold">FROM</span> orders o{' '}
            <span className="text-rose-400 font-bold">JOIN</span> regions r ON o.region_id = r.id{' '}
            <span className="text-rose-400 font-bold">GROUP BY</span> r.name{' '}
            <span className="text-rose-400 font-bold">ORDER BY</span> total_revenue <span className="text-rose-400 font-bold">DESC</span>{' '}
            <span className="text-rose-400 font-bold">LIMIT</span> 1;
          </code>
        </div>

        {/* Live Result Table */}
        <div className="rounded-xl overflow-hidden border border-white/10 bg-black/50 text-[11px]">
          <div className="grid grid-cols-4 bg-white/5 px-3 py-2 text-[10px] text-white/60 font-semibold border-b border-white/10">
            <span>REGION</span>
            <span>TRANSACTIONS</span>
            <span>TOTAL REVENUE</span>
            <span className="text-right">STATUS</span>
          </div>
          <div className="divide-y divide-white/5">
            <div className="grid grid-cols-4 px-3 py-1.5 text-white/80">
              <span className="font-sans font-medium text-white">West</span>
              <span className="text-white/40">14,208</span>
              <span className="text-emerald-400 font-semibold">$248,500</span>
              <span className="text-right text-emerald-300 text-[10px]">VERIFIED</span>
            </div>
            <div className="grid grid-cols-4 px-3 py-1.5 text-white/80">
              <span className="font-sans font-medium text-white">East</span>
              <span className="text-white/40">11,450</span>
              <span className="text-emerald-400 font-semibold">$182,300</span>
              <span className="text-right text-emerald-300 text-[10px]">VERIFIED</span>
            </div>
            <div className="grid grid-cols-4 px-3 py-1.5 text-white/80">
              <span className="font-sans font-medium text-white">Central</span>
              <span className="text-white/40">8,920</span>
              <span className="text-emerald-400 font-semibold">$124,100</span>
              <span className="text-right text-emerald-300 text-[10px]">VERIFIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Ribbon */}
      <div className="bg-[#121218] px-4 py-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> MCP Gate: Active
          </span>
          <span className="text-white/40">SQLAlchemy: SQLite · PostgreSQL (Read-Only)</span>
        </div>
        <span className="text-rose-300 font-semibold">SELECT-Only AST Enforced</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Modal Deep-Dive: Interactive Architecture Node Graph for Talk2Data         */
/* -------------------------------------------------------------------------- */
interface Talk2DataNode {
  id: string;
  name: string;
  role: string;
  type: string;
  details: string;
  inputs: string;
  outputs: string;
  status: string;
}

const TALK2DATA_NODES: Talk2DataNode[] = [
  {
    id: 'input',
    name: 'Natural Language Input',
    role: 'User Query & Intent Ingestion',
    type: 'Frontend (Next.js)',
    details: 'Receives user query, enforces sanitization, passes conversation context to agent orchestrator.',
    inputs: 'Raw text query (e.g. "Which region has the most revenue?")',
    outputs: 'Normalized intent payload + schema context',
    status: 'ACTIVE',
  },
  {
    id: 'agent',
    name: 'Tool-Calling Agent Core',
    role: 'LLM Function Call Planning',
    type: 'FastAPI / Python Service',
    details: 'Decides tool calls and constructs candidate SQL queries using schema representations.',
    inputs: 'Intent payload & table schema definitions',
    outputs: 'Unvalidated Candidate SQL string',
    status: 'READY',
  },
  {
    id: 'ast',
    name: 'Python AST Validator',
    role: 'Syntax Tree Safety Gate',
    type: 'AST Security Engine',
    details: 'Traverses SQL parse tree; strictly enforces SelectStmt root; blocks any drop, delete, update or insert tokens.',
    inputs: 'Candidate SQL query string',
    outputs: 'Validated safe AST or Rejected Syntax Exception',
    status: 'ENFORCED (SELECT-ONLY)',
  },
  {
    id: 'mcp',
    name: 'MCP Approval Protocol Gate',
    role: 'Model Context Protocol Handshake',
    type: 'Security Protocol',
    details: 'Evaluates tool call request against permission boundaries and issues cryptographically signed execution ticket.',
    inputs: 'Validated SELECT query + session claims',
    outputs: 'Approved JSON-RPC 2.0 execution payload',
    status: 'APPROVED',
  },
  {
    id: 'db',
    name: 'Read-Only SQL Sources',
    role: 'Read-Only Database Querying',
    type: 'SQLAlchemy Engine',
    details: 'SQLAlchemy connections using read-only database accounts, with SQLite and PostgreSQL as the first target dialects.',
    inputs: 'Approved SELECT query',
    outputs: 'Tabular result records (JSON serialized)',
    status: 'READ-ONLY CERTIFIED',
  },
  {
    id: 'studio',
    name: 'Studio UI & Data Grid',
    role: 'Interactive Visualization',
    type: 'Next.js Frontend',
    details: 'Renders response data table, inspection metadata, AST verification breakdown, and latency metrics.',
    inputs: 'Tabular records + execution telemetry',
    outputs: 'Rendered responsive UI grid',
    status: 'SYNCHRONIZED',
  },
];

export const Talk2DataNodeGraph: React.FC<{ activeStep?: number }> = ({ activeStep = 0 }) => {
  const [selectedNode, setSelectedNode] = useState<Talk2DataNode>(TALK2DATA_NODES[2]);

  return (
    <div className="w-full flex flex-col gap-4 font-mono select-none">
      {/* Topology Canvas */}
      <div className="relative w-full rounded-2xl bg-[#09090D] border border-white/15 p-4 sm:p-6 overflow-x-auto">
        <div className="min-w-[620px] flex flex-col gap-6">
          {/* Top Label */}
          <div className="flex items-center justify-between text-xs text-white/50 border-b border-white/10 pb-2">
            <span className="flex items-center gap-1.5 font-bold text-[#BBCCD7]">
              <Layers className="w-4 h-4 text-[#E11D48]" />
              TALK2DATA SYSTEM ARCHITECTURE GRAPH
            </span>
            <span className="text-[11px] text-rose-300">Click any node to inspect data flow</span>
          </div>

          {/* Interactive Node Layout */}
          <div className="grid grid-cols-6 gap-2 sm:gap-3 items-center">
            {TALK2DATA_NODES.map((node, i) => {
              const isSelected = selectedNode.id === node.id;
              const isCurrentSimStep = activeStep > 0 && activeStep === Math.min(i + 1, 4);

              return (
                <div key={node.id} className="relative flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setSelectedNode(node)}
                    className={`w-full p-2.5 rounded-xl border transition-all text-left flex flex-col justify-between gap-1.5 cursor-pointer min-h-[92px] ${
                      isSelected
                        ? 'border-[#E11D48] bg-[#E11D48]/20 shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                        : isCurrentSimStep
                        ? 'border-emerald-400 bg-emerald-500/20'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-white/40">0{i + 1}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-[#E11D48] animate-ping' : 'bg-emerald-400'
                        }`}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-white line-clamp-2 leading-tight">
                      {node.name}
                    </span>
                    <span className="text-[9px] text-rose-300 truncate">
                      {node.type}
                    </span>
                  </button>

                  {/* Flow arrow between nodes */}
                  {i < TALK2DATA_NODES.length - 1 && (
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
              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
              className="w-24 h-full bg-gradient-to-r from-transparent via-[#E11D48] to-transparent rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Node Inspector Card */}
      <div className="rounded-2xl bg-[#14141C] border border-white/10 p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold text-white uppercase">
              NODE INSPECTOR: {selectedNode.name}
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
            STATUS: {selectedNode.status}
          </span>
        </div>

        <p className="text-xs text-[#D7E2EA]/90 leading-relaxed font-sans">
          {selectedNode.details}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px]">
          <div className="bg-black/50 p-2 rounded-lg border border-white/5">
            <span className="text-white/40 block text-[9.5px]">INPUT PAYLOAD</span>
            <span className="text-rose-300 font-mono">{selectedNode.inputs}</span>
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
