import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, MessageSquare, Download, CheckCircle2, Crosshair, Layers, ArrowRight, Code2, Sparkles, FileCode } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Slot 1: DOM Element Coordinate Inspector Visual                            */
/* -------------------------------------------------------------------------- */
export const DuetDomOverlayVisual: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#110E14] p-3 sm:p-4 flex flex-col justify-between overflow-hidden select-none font-mono">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#E11D48_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <Crosshair className="w-4 h-4 text-rose-400" />
          <span className="text-[11px] font-bold text-white tracking-wide">
            DOM COORDINATE INSPECTOR
          </span>
        </div>
        <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          BOUNDING BOX ACTIVE
        </span>
      </div>

      {/* DOM Coordinate Bounding Box Display */}
      <div className="relative z-10 my-auto py-1 text-[10.5px] leading-relaxed flex flex-col gap-1.5">
        <div className="bg-black/60 rounded-lg p-2 border border-rose-500/30 relative">
          <div className="flex items-center justify-between text-[10px] text-white/50 mb-1">
            <span className="text-rose-300 font-bold">&lt;button#cta-submit.hero-btn&gt;</span>
            <span className="text-emerald-400 font-mono">x: 240, y: 114</span>
          </div>
          <div className="text-[9.5px] text-slate-300 flex items-center justify-between">
            <span>Dimensions: 184px × 44px</span>
            <span className="text-rose-300">Anchor: Pin #02</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9.5px] bg-white/5 p-1.5 rounded border border-white/5">
          <span className="text-white/60">SELECTION TYPE:</span>
          <span className="text-cyan-300 font-mono">CSS Selector (.hero-btn)</span>
          <span className="text-emerald-400">100% Deterministic</span>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between text-[10px] text-white/50 pt-1 border-t border-white/5">
        <span className="flex items-center gap-1 text-rose-300">
          <CheckCircle2 className="w-3 h-3 text-rose-400" /> Coordinate Anchored
        </span>
        <span className="text-white/40">Pure DOM Target Engine</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Slot 2: Session Persistence & HTML Exporter Visual                         */
/* -------------------------------------------------------------------------- */
export const DuetExportPipeVisual: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#120E15] p-3 sm:p-4 flex flex-col justify-between overflow-hidden select-none font-mono">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#E11D48]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <Download className="w-4 h-4 text-emerald-400" />
          <span className="text-[11px] font-bold text-white tracking-wide">
            STANDALONE HTML EXPORT
          </span>
        </div>
        <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
          ZERO RUNTIME DEP
        </span>
      </div>

      {/* Pipeline Flow */}
      <div className="relative z-10 my-auto py-2 flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
          <div className="bg-white/5 border border-white/10 rounded-lg p-1.5 flex flex-col items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-rose-400 mb-1" />
            <span className="font-semibold text-white">Review Pins</span>
            <span className="text-[8.5px] text-white/50">Coordinates</span>
          </div>

          <div className="bg-[#E11D48]/20 border border-[#E11D48]/40 rounded-lg p-1.5 flex flex-col items-center justify-center">
            <FileCode className="w-3.5 h-3.5 text-cyan-300 mb-1" />
            <span className="font-semibold text-white">FastAPI Store</span>
            <span className="text-[8.5px] text-rose-300 font-bold">Inlined</span>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-lg p-1.5 flex flex-col items-center justify-center">
            <Download className="w-3.5 h-3.5 text-emerald-400 mb-1" />
            <span className="font-semibold text-white">Export .html</span>
            <span className="text-[8.5px] text-emerald-400 font-bold">Self-Contained</span>
          </div>
        </div>

        {/* Export Spec Description */}
        <div className="bg-black/60 rounded-lg p-2 border border-white/5 text-[9.5px] text-white/70 leading-snug">
          Single compiled file containing embedded styles, DOM coordinates, and active review commentary without external network dependencies.
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between text-[10px] text-white/50 pt-1 border-t border-white/5">
        <span>Persistent FastAPI Sessions</span>
        <span className="text-emerald-400 font-semibold">100% Portable Bundle</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Slot 3: Full-width Visual Review Studio UI (Tall Column)                   */
/* -------------------------------------------------------------------------- */
export const DuetReviewStudioUI: React.FC = () => {
  const [selectedPin, setSelectedPin] = useState<number>(2);

  return (
    <div className="relative w-full h-full min-h-[280px] sm:min-h-[350px] bg-[#0C0A10] flex flex-col justify-between overflow-hidden font-mono border border-white/10">
      {/* Studio Window Bar */}
      <div className="bg-[#15121A] px-4 py-2.5 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-bold text-white ml-2">Duet Artifact Review Studio</span>
          <span className="text-[10px] text-white/40 hidden sm:inline">· Session #084 · FastAPI Backend</span>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Layout Verified
          </span>
          <span className="px-2 py-0.5 rounded bg-[#E11D48]/30 text-rose-200 border border-[#E11D48]/50">
            Export Ready
          </span>
        </div>
      </div>

      {/* Main Review Workspace Area */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col sm:flex-row gap-3 items-stretch justify-center">
        {/* Rendered HTML Artifact Mock with Coordinate Pins */}
        <div className="relative flex-1 rounded-xl bg-black/60 border border-white/10 p-4 flex flex-col justify-between overflow-hidden min-h-[170px]">
          <div className="flex items-center justify-between text-[10px] text-white/40 border-b border-white/5 pb-2">
            <span>PREVIEW: checkout-checkout-modal.html</span>
            <span className="text-emerald-400">Viewport: 100% Fluid</span>
          </div>

          {/* Simulated HTML Elements on Canvas */}
          <div className="my-auto py-2 flex flex-col gap-3">
            <div className="relative p-2 rounded border border-dashed border-white/20 bg-white/5">
              <span className="text-xs text-white font-sans font-semibold">
                Complete Your Subscription
              </span>
              <button
                type="button"
                onClick={() => setSelectedPin(1)}
                className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-[#E11D48] text-white text-[10px] font-bold flex items-center justify-center shadow-lg border border-white/40 cursor-pointer"
              >
                1
              </button>
            </div>

            <div className="relative p-2.5 rounded border-2 border-[#E11D48] bg-[#E11D48]/10 flex items-center justify-between">
              <span className="text-xs text-rose-200 font-sans font-medium">
                Confirm & Start 14-Day Trial
              </span>
              <button
                type="button"
                onClick={() => setSelectedPin(2)}
                className="w-5 h-5 rounded-full bg-[#E11D48] text-white text-[10px] font-bold flex items-center justify-center shadow-lg border border-white/40 cursor-pointer animate-pulse"
              >
                2
              </button>
            </div>
          </div>

          <div className="text-[9.5px] text-white/30 flex items-center justify-between">
            <span>DOM Coordinates Overlay Active</span>
            <span>Click pin to inspect thread</span>
          </div>
        </div>

        {/* Review Comments & Context Panel */}
        <div className="w-full sm:w-64 rounded-xl bg-[#14101A] border border-white/10 p-3 flex flex-col justify-between text-xs gap-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
              Pin #{selectedPin} Discussion
            </span>
            <span className="text-[9px] text-emerald-400">OPEN</span>
          </div>

          <div className="flex-1 flex flex-col gap-1.5 font-sans text-[11px] text-[#D7E2EA]/90 leading-relaxed">
            {selectedPin === 2 ? (
              <>
                <div className="bg-black/50 p-2 rounded-lg border border-white/5">
                  <span className="text-rose-300 font-semibold block text-[10px]">
                    Reviewer Note:
                  </span>
                  "Ensure button contrast ratio satisfies WCAG 2.1 AA against dark background. Padding increased to 12px 24px."
                </div>
                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Layout verification: Passed
                </div>
              </>
            ) : (
              <div className="bg-black/50 p-2 rounded-lg border border-white/5">
                <span className="text-rose-300 font-semibold block text-[10px]">
                  Header Note:
                </span>
                "Title text typography updated to match brand token typography."
              </div>
            )}
          </div>

          <button
            type="button"
            className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3 h-3 text-emerald-400" />
            <span>Download Standalone HTML</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#15121A] px-4 py-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50">
        <span>Artifact Scope: Pure Visual Review Studio (No Agent Loops)</span>
        <span className="text-rose-300 font-semibold">FastAPI Persistent Sessions</span>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Modal Deep-Dive: Interactive Architecture Node Graph for Duet              */
/* -------------------------------------------------------------------------- */
interface DuetNode {
  id: string;
  name: string;
  role: string;
  type: string;
  details: string;
  inputs: string;
  outputs: string;
  status: string;
}

const DUET_NODES: DuetNode[] = [
  {
    id: 'ingestion',
    name: 'HTML Artifact Ingestion',
    role: 'Document Ingestion & Sanitization',
    type: 'Parser Engine',
    details: 'Loads human or AI-generated HTML/CSS/JS artifacts into isolated shadow environment without script interference.',
    inputs: 'Raw HTML source / generated DOM bundle',
    outputs: 'Isolated sandboxed document tree',
    status: 'ACTIVE',
  },
  {
    id: 'coordinate_engine',
    name: 'DOM Coordinate Overlay',
    role: 'Element Targeting & Coordinates',
    type: 'DOM Binding Engine',
    details: 'Calculates exact viewport bounding rect coordinates (x, y, width, height) and generates persistent CSS selectors for pinpoint element targeting.',
    inputs: 'Click event on document node',
    outputs: 'Element coordinate anchor & CSS selector',
    status: 'ACTIVE',
  },
  {
    id: 'comment_thread',
    name: 'Annotation & Chat Thread',
    role: 'Contextual Comment System',
    type: 'Review Core',
    details: 'Binds human and reviewer comments directly to coordinate pins, supporting threaded discussion and resolution tracking.',
    inputs: 'Coordinate pin ID + user annotation text',
    outputs: 'Thread record with resolution state',
    status: 'THREADED',
  },
  {
    id: 'session_store',
    name: 'FastAPI Persistent Sessions',
    role: 'Session State & Persistence',
    type: 'Python FastAPI Backend',
    details: 'Persists ongoing review sessions across reloads, saving annotated snapshots and document revisions.',
    inputs: 'Session update delta',
    outputs: 'Persisted review session record',
    status: 'SYNCHRONIZED',
  },
  {
    id: 'layout_checker',
    name: 'Automated Layout Inspector',
    role: 'Automated Layout Audit Core',
    type: 'Layout Check Core',
    details: 'Automated layout audit detecting clipped text, overflow and unreachable content across viewport sizes.',
    inputs: 'Rendered DOM dimensions & text bounding rects',
    outputs: 'Layout audit status (clipped text, overflow, unreachable content)',
    status: 'LAYOUT AUDIT OK',
  },
  {
    id: 'standalone_export',
    name: 'Self-Contained Exporter',
    role: 'Zero-Dependency HTML Bundler',
    type: 'HTML Compiler',
    details: 'Compiles the reviewed artifact, annotations, coordinate pins, and styling into a self-contained HTML file distributable via email or static hosting.',
    inputs: 'Artifact DOM + active session annotations',
    outputs: 'Portable standalone .html bundle',
    status: 'EXPORT READY',
  },
];

export const DuetNodeGraph: React.FC<{ activeStep?: number }> = ({ activeStep = 0 }) => {
  const [selectedNode, setSelectedNode] = useState<DuetNode>(DUET_NODES[1]);

  return (
    <div className="w-full flex flex-col gap-4 font-mono select-none">
      {/* Topology Canvas */}
      <div className="relative w-full rounded-2xl bg-[#09070D] border border-white/15 p-4 sm:p-6 overflow-x-auto">
        <div className="min-w-[620px] flex flex-col gap-6">
          {/* Top Label */}
          <div className="flex items-center justify-between text-xs text-white/50 border-b border-white/10 pb-2">
            <span className="flex items-center gap-1.5 font-bold text-[#BBCCD7]">
              <Layers className="w-4 h-4 text-[#E11D48]" />
              DUET ARTIFACT REVIEW STUDIO ARCHITECTURE GRAPH
            </span>
            <span className="text-[11px] text-rose-300">Click any node to inspect data flow</span>
          </div>

          {/* Interactive Node Layout */}
          <div className="grid grid-cols-6 gap-2 sm:gap-3 items-center">
            {DUET_NODES.map((node, i) => {
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
                          isSelected ? 'bg-[#E11D48] animate-ping' : 'bg-rose-400'
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
                  {i < DUET_NODES.length - 1 && (
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
              transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
              className="w-24 h-full bg-gradient-to-r from-transparent via-[#E11D48] to-transparent rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Node Inspector Card */}
      <div className="rounded-2xl bg-[#14101A] border border-white/10 p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold text-white uppercase">
              NODE INSPECTOR: {selectedNode.name}
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-semibold">
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
