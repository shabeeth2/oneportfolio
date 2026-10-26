import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, CheckCircle2, Cpu, ArrowRight, Activity, Network, Layers } from 'lucide-react';
import { AIProjectItem, AIProjectMetric } from './ProjectsSection.tsx';
import { Talk2DataNodeGraph } from './project-visuals/Talk2DataVisuals.tsx';
import { SpecExecNodeGraph } from './project-visuals/SpecExecVisuals.tsx';
import { DuetNodeGraph } from './project-visuals/DuetVisuals.tsx';
import { ProjectVisualSlot, ProjectVisualSlotType } from './project-visuals/ProjectVisualSlot.tsx';

interface ArchitectureModalProps {
  isOpen: boolean;
  project: AIProjectItem | null;
  activeImage: string | null;
  onClose: () => void;
  onOpenContact: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  project,
  activeImage,
  onClose,
  onOpenContact,
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [viewMode, setViewMode] = useState<'graph' | 'schematic'>('graph');
  const [selectedSlot, setSelectedSlot] = useState<ProjectVisualSlotType>('col2Main');

  useEffect(() => {
    if (activeImage === 'col1Top' || activeImage === 'col1Bottom' || activeImage === 'col2Main') {
      setSelectedSlot(activeImage);
    } else {
      setSelectedSlot('col2Main');
    }
    setViewMode('graph');
  }, [project, activeImage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setSimulationStep(0);
      setIsSimulating(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(1);
    setTimeout(() => setSimulationStep(2), 600);
    setTimeout(() => setSimulationStep(3), 1300);
    setTimeout(() => {
      setSimulationStep(4);
      setIsSimulating(false);
    }, 2000);
  };

  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl cursor-pointer"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 28, stiffness: 340, bounce: 0 }}
          className="relative w-full max-w-5xl rounded-[32px] sm:rounded-[44px] apple-glass p-5 sm:p-8 shadow-2xl z-10 text-[#D7E2EA] my-auto flex flex-col gap-6 max-h-[92vh] overflow-y-auto font-martin"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-baseline gap-3">
              <span className="font-parabole font-light text-2xl sm:text-3xl text-[#BBCCD7]">
                {project.id}
              </span>
              <div>
                <h3 className="font-parabole font-bold text-xl sm:text-2xl text-white tracking-tight">
                  {project.name}
                </h3>
                <span className="text-xs uppercase tracking-wider text-[#E11D48] font-martin font-semibold">
                  {project.category} · System Architecture
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-full border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-colors cursor-pointer apple-press"
              aria-label="Close architecture preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Featured Architecture Diagram / Visual */}
          <div className="relative w-full rounded-[24px] sm:rounded-[36px] overflow-hidden bg-black/50 border border-white/10 p-2 sm:p-4 flex flex-col gap-3">
            {/* View Mode Toggle Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2 px-1 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#E11D48]" />
                <span className="text-xs font-mono font-semibold text-[#BBCCD7] uppercase">
                  {project.name} Architecture Explorer
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setViewMode('graph')}
                  className={`px-3 py-1 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'graph'
                      ? 'bg-[#E11D48] text-white font-semibold'
                      : 'text-white/60 hover:text-white bg-white/5'
                  }`}
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>Interactive Node Graph</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('schematic')}
                  className={`px-3 py-1 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'schematic'
                      ? 'bg-[#E11D48] text-white font-semibold'
                      : 'text-white/60 hover:text-white bg-white/5'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Live UI & Schematics</span>
                </button>
              </div>
            </div>

            {/* Visual Viewport */}
            <div className="w-full">
              {viewMode === 'graph' ? (
                <>
                  {project.id === '01' && <Talk2DataNodeGraph activeStep={simulationStep} />}
                  {project.id === '02' && <SpecExecNodeGraph activeStep={simulationStep} />}
                  {project.id === '03' && <DuetNodeGraph activeStep={simulationStep} />}
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[11px] font-mono pb-1 flex-wrap">
                    <span className="text-white/40">Select View:</span>
                    <button
                      type="button"
                      onClick={() => setSelectedSlot('col2Main')}
                      className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                        selectedSlot === 'col2Main' ? 'bg-[#E11D48] text-white font-bold' : 'text-white/50 hover:text-white bg-white/5'
                      }`}
                    >
                      {project.id === '01' ? 'Studio UI' : project.id === '02' ? 'Event Loop Runtime' : 'Artifact Review Studio'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSlot('col1Top')}
                      className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                        selectedSlot === 'col1Top' ? 'bg-[#E11D48] text-white font-bold' : 'text-white/50 hover:text-white bg-white/5'
                      }`}
                    >
                      {project.id === '01' ? 'AST Validator' : project.id === '02' ? 'AST Classifier' : 'DOM Coordinate Inspector'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSlot('col1Bottom')}
                      className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                        selectedSlot === 'col1Bottom' ? 'bg-[#E11D48] text-white font-bold' : 'text-white/50 hover:text-white bg-white/5'
                      }`}
                    >
                      {project.id === '01' ? 'MCP Approval Gate' : project.id === '02' ? 'Benchmark Profile' : 'Standalone HTML Export'}
                    </button>
                  </div>
                  <div className="w-full rounded-2xl overflow-hidden border border-white/10 min-h-[300px]">
                    <ProjectVisualSlot projectId={project.id} slot={selectedSlot} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Benchmark Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#181818] border border-white/5 rounded-2xl p-4">
            {project.metrics.map((m: AIProjectMetric, idx: number) => (
              <div key={idx} className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-[#D7E2EA]/60 font-mono">
                  {m.label}
                </span>
                <span className="text-base sm:text-lg font-bold text-white tracking-tight tabular-nums mt-0.5">
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* Description & Technical Architecture Highlights */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              System Engineering Overview
            </h4>
            <p className="text-sm sm:text-base text-[#D7E2EA]/80 font-light leading-relaxed">
              {project.description}
            </p>
            <div className="mt-2 flex flex-col gap-2">
              {project.architectureDetails.map((detail: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#D7E2EA]/90">
                  <CheckCircle2 className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

            {/* Interactive Live Benchmark Simulation */}
            <div className="bg-[#161616] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#BBCCD7]" />
                  <span className="text-xs uppercase tracking-wider font-semibold text-white">
                    Interactive Pipeline Runner
                  </span>
                </div>
                <button
                  type="button"
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isSimulating ? 'Executing...' : 'Run Benchmark Probe'}</span>
                </button>
              </div>

              <div className="w-full bg-[#0D0D0D] border border-white/10 rounded-xl p-3 font-mono text-xs text-[#D7E2EA]/80">
                <div className="flex items-center justify-between text-white/50 text-[10px] pb-1 border-b border-white/5 mb-2">
                  <span>INSPECTOR STATUS: {simulationStep === 4 ? 'READY' : simulationStep > 0 ? 'PROCESSING' : 'IDLE'}</span>
                  <span>TARGET: {project.name.toUpperCase()}</span>
                </div>
                {simulationStep === 0 && (
                  <p className="text-white/40 italic">
                    {project.id === '01' && 'Click "Run Benchmark Probe" to test AST query parsing, SELECT-only validation, and MCP approval gate.'}
                    {project.id === '02' && 'Click "Run Benchmark Probe" to evaluate read-only AST classification and 51.8% latency reduction.'}
                    {project.id === '03' && 'Click "Run Benchmark Probe" to test element coordinate binding and self-contained HTML export.'}
                  </p>
                )}
                {simulationStep >= 1 && (
                  <div className="text-purple-300">
                    {project.id === '01' && '[STEP 1] Ingesting natural language query · Generating candidate SQL abstract syntax tree...'}
                    {project.id === '02' && '[STEP 1] Detecting complete tool statements mid-stream · Classifying read-only calls via Python AST...'}
                    {project.id === '03' && '[STEP 1] Parsing DOM tree of target HTML artifact · Indexing interactive elements...'}
                  </div>
                )}
                {simulationStep >= 2 && (
                  <div className="text-cyan-300">
                    {project.id === '01' && '[STEP 2] AST validation passed: strictly SELECT-only verified · Non-destructive constraint OK'}
                    {project.id === '02' && '[STEP 2] Read-only status confirmed · Concurrently precomputing eligible calls in background'}
                    {project.id === '03' && '[STEP 2] Anchoring coordinate overlay · Synchronizing review sessions in persistent FastAPI store'}
                  </div>
                )}
                {simulationStep >= 3 && (
                  <div className="text-emerald-300">
                    {project.id === '01' && '[STEP 3] MCP protocol approval gate confirmed · Executing safe query over read-only SQL source'}
                    {project.id === '02' && '[STEP 3] Concurrent precomputation complete · Authoritative replay in fresh namespace reuses cache'}
                    {project.id === '03' && '[STEP 3] Automated layout audit clean · Compiling element-level annotations & review thread'}
                  </div>
                )}
                {simulationStep === 4 && (
                  <div className="text-white font-semibold pt-1 border-t border-white/5 mt-1 flex items-center justify-between">
                    <span>
                      {project.id === '01' && 'RESULT: Safe Query Completed (SELECT-only verified · MCP Gate Passed)'}
                      {project.id === '02' && 'RESULT: Benchmark Verified (51.8% Median Latency Cut · Zero Side Effects)'}
                      {project.id === '03' && 'RESULT: Artifact Ready (Element Annotations Active · Self-Contained HTML Export Ready)'}
                    </span>
                    <span className="text-emerald-400">PASSED</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
              <span className="text-xs text-[#D7E2EA]/60 font-light">
                Architected & Built by Mohamed Shabeeth N
              </span>

              <div className="flex items-center gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span>View GitHub Repo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenContact();
                  }}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white transition-transform active:scale-95 cursor-pointer"
                  style={{
                    background:
                      'linear-gradient(123deg, #1C0508 7%, #E11D48 37%, #BE123C 68%, #D97706 100%)',
                    boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
                  }}
                >
                  <span>Consult on this Architecture</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  };
