import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Terminal,
  Activity,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  Maximize2,
  Sparkles,
  GitBranch,
  Timer
} from 'lucide-react';

// Pure easing and interpolation functions for deterministic frame calculation
const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

const smoothstep = (min: number, max: number, value: number) => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
};

const smootherstep = (min: number, max: number, value: number) => {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * x * (x * (x * 6 - 15) + 10);
};

const springSettle = (progress: number, damping = 14, freq = 18) => {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  const decay = Math.exp(-damping * progress);
  const osc = Math.cos(freq * progress * (1 - progress));
  return 1 - decay * osc;
};

export interface SpecExecShowreelProps {
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
  onClose?: () => void;
}

export const SpecExecShowreel: React.FC<SpecExecShowreelProps> = ({
  autoplay = true,
  loop = true,
  className = '',
  onClose
}) => {
  const TOTAL_DURATION = 18.0; // 18-second continuous take showreel
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoplay);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageWrapperRef = useRef<HTMLDivElement>(null);
  const [stageScale, setStageScale] = useState<number>(1);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // ResizeObserver ensuring exact 1280x720 scale-to-fit without clipping at ANY viewport width
  useEffect(() => {
    const handleResize = () => {
      if (stageWrapperRef.current) {
        const { clientWidth, clientHeight } = stageWrapperRef.current;
        if (clientWidth > 0 && clientHeight > 0) {
          const scaleX = clientWidth / 1280;
          const scaleY = clientHeight / 720;
          // Scale to fit while maintaining 16:9 inner stage
          setStageScale(Math.min(scaleX, scaleY));
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    const ro = new ResizeObserver(handleResize);
    if (stageWrapperRef.current) ro.observe(stageWrapperRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      ro.disconnect();
    };
  }, []);

  // Check user preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    if (mediaQuery.matches) {
      setCurrentTime(16.5); // Static clean end frame
      setIsPlaying(false);
    }

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        setCurrentTime(16.5);
        setIsPlaying(false);
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Continuous animation loop driving deterministic clock
  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) {
      lastTimestampRef.current = null;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const step = (timestamp: number) => {
      if (lastTimestampRef.current !== null) {
        const delta = (timestamp - lastTimestampRef.current) / 1000;
        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= TOTAL_DURATION) {
            return loop ? 0 : TOTAL_DURATION;
          }
          return next;
        });
      }
      lastTimestampRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, loop, prefersReducedMotion]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const t = currentTime;

  // ========================================================
  // BEAT 1: Streamed Program & Statement Detection (t: 0.0 -> 4.8s)
  // ========================================================
  const stmt1Full = 'a = search("checkout latency")';
  const stmt2Full = 'b = search("payment failures")';
  const stmt3Full = 'c = fetch(a[0])';

  // Typing progress for statements
  const type1Prog = smootherstep(0.4, 1.6, t);
  const type2Prog = smootherstep(1.8, 3.0, t);
  const type3Prog = smootherstep(3.2, 4.2, t);

  const stmt1Chars = Math.floor(type1Prog * stmt1Full.length);
  const stmt2Chars = Math.floor(type2Prog * stmt2Full.length);
  const stmt3Chars = Math.floor(type3Prog * stmt3Full.length);

  // Statement completion triggers (the instant statement is parsed complete mid-stream!)
  const stmt1Complete = smootherstep(1.6, 1.9, t);
  const stmt2Complete = smootherstep(3.0, 3.3, t);
  const stmt3Complete = smootherstep(4.2, 4.5, t);

  // Carry 1: Typed statements lift off the page into parallel execution lanes
  const liftStmt1 = smootherstep(1.7, 2.3, t);
  const liftStmt2 = smootherstep(3.1, 3.7, t);
  const liftStmt3 = smootherstep(4.3, 4.8, t);

  // ========================================================
  // BEAT 2: Parallel Concurrent Speculation Lanes (t: 4.8 -> 7.8s)
  // ========================================================
  const lanesSectionOpacity = smootherstep(1.8, 2.4, t) * (1 - smootherstep(7.8, 8.4, t));
  const lane1ExecProgress = clamp((t - 2.1) / 2.2, 0, 1);
  const lane2ExecProgress = clamp((t - 3.4) / 2.0, 0, 1);
  const lane3ExecProgress = clamp((t - 4.5) / 1.6, 0, 1);

  // Stream window fades down as focus shifts to concurrent execution
  const streamWindowOpacity = 1 - smootherstep(5.4, 6.4, t);

  // ========================================================
  // BEAT 3: Race - Baseline vs. Speculative (t: 7.8 -> 11.5s)
  // ========================================================
  // Carry 2: Lane chips stack directly into timeline racing bars
  const raceSectionOpacity = smootherstep(7.6, 8.2, t) * (1 - smootherstep(11.5, 12.1, t));
  
  // Baseline bar crawls slowly (764 ms total)
  const baselineFill = clamp((t - 8.0) / 3.0, 0, 1);
  
  // Speculative concurrent bar fills fast and snappy (368 ms)
  const concurrentFill = springSettle(smootherstep(8.0, 9.4, t), 12, 16);

  // Comparison metric counter settlement (-51.8%)
  const latencyBadgeSpring = springSettle(smootherstep(9.3, 9.9, t), 13, 16);
  const counterValue = Math.min(51.8, (smootherstep(9.2, 9.8, t) * 51.8)).toFixed(1);

  // Dead-still rest between t: 10.1s and 11.5s (1.4s pure hold on benchmark numbers)

  // ========================================================
  // BEAT 4: Correctness Beat - Authoritative Replay (t: 11.5 -> 14.8s)
  // ========================================================
  // Carry 3: Race bars fold into single authoritative replay track
  const replaySectionOpacity = smootherstep(11.4, 12.0, t) * (1 - smootherstep(14.8, 15.4, t));
  const replayFoldProgress = smootherstep(11.5, 12.2, t);
  const replayItem1 = smootherstep(12.3, 12.8, t);
  const replayItem2 = smootherstep(12.9, 13.4, t);
  const replayItem3 = smootherstep(13.5, 14.0, t);
  const stampCorrectness = springSettle(smootherstep(13.8, 14.3, t), 12, 16);

  // ========================================================
  // BEAT 5: Fold into End Card (t: 14.8 -> 18.0s)
  // ========================================================
  // Carry 4: Authoritative card folds into central seed and expands into End Card
  const foldToEnd = smootherstep(14.8, 15.6, t);
  const endCardEntrance = springSettle(smootherstep(15.4, 16.3, t), 12, 14);
  const endCardOpacity = smootherstep(15.3, 15.9, t);
  const endBadgeScale = 1.15 - (endCardEntrance * 0.15);

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-[#0C0C0C] rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden select-none font-martin text-white ${className}`}
      role="region"
      aria-label="SpecExec showreel"
    >
      {/* 1. Subtle Ambient Studio Glow (#E11D48 Signature Crimson Accent) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse 65% 55% at 50% ${
            t < 15 ? '48%' : '50%'
          }, rgba(225, 29, 72, 0.22) 0%, rgba(12, 12, 12, 0) 70%)`
        }}
      />

      {/* 2. Precision Lattice Background (quiet ground, 70% negative space) */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* 3. Minimal Cinema Header */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-2 border-b border-white/8 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-pulse" />
          <span className="text-xs tracking-wider uppercase text-white/90 font-medium">
            SpecExec · One-Take Showreel
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Theater view"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN CONTINUOUS CANVAS: Exact 1280x720 Scaled Inner Stage             */}
      {/* ========================================================================= */}
      <div
        ref={stageWrapperRef}
        className="relative w-full aspect-[16/9] max-h-[min(65vh,720px)] flex items-center justify-center overflow-hidden shrink-0"
      >
        <div
          className="absolute left-1/2 top-1/2 origin-center flex items-center justify-center pointer-events-none"
          style={{
            width: '1280px',
            height: '720px',
            transform: `translate(-50%, -50%) scale(${stageScale})`,
            transformOrigin: 'center center'
          }}
        >
          {/* ================================================================ */}
          {/* BEAT 1 & 2: Stream Terminal Window & Concurrent Execution Lanes  */}
          {/* ================================================================ */}
          {t < 8.0 && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-12 transition-all duration-100"
              style={{
                opacity: t < 7.6 ? 1 : 1 - (t - 7.6) / 0.4,
                transform: `scale(${1 - smootherstep(7.2, 7.8, t) * 0.08})`
              }}
            >
              {/* Outer Workbench Box */}
              <div className="w-[1040px] rounded-[28px] border border-white/15 bg-[#121216]/90 backdrop-blur-xl shadow-2xl p-8 flex flex-col gap-6">
                
                {/* Header status */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-[#E11D48]" />
                    <span className="text-sm font-bold uppercase tracking-wider text-white">
                      LLM Program Stream Ingestion
                    </span>
                    <span className="text-xs text-[#00F0FF] border border-[#00F0FF]/30 px-2.5 py-0.5 rounded-full font-mono">
                      AST Statement Boundary Hook
                    </span>
                  </div>
                  <span className="text-xs text-white/50 font-mono">
                    Hiding tool latency behind streamed tokens
                  </span>
                </div>

                {/* 3 Parallel Execution Lanes (Lifted off stream mid-generation) */}
                <div className="flex flex-col gap-3 min-h-[220px]">
                  {/* Lane A */}
                  <div
                    className={`relative p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                      liftStmt1 > 0.1
                        ? 'bg-[#181824] border-[#E11D48]/60 shadow-[0_0_20px_rgba(225,29,72,0.2)]'
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#E11D48]/20 border border-[#E11D48]/50 flex items-center justify-center text-xs font-bold text-[#E11D48]">
                        A
                      </div>
                      <div>
                        <div className="text-sm font-mono font-bold text-white">
                          a = search("checkout latency")
                        </div>
                        <div className="text-xs text-white/50 flex items-center gap-2 mt-0.5">
                          <span>AST: read-only deterministic</span>
                          <span>•</span>
                          <span className="text-[#00F0FF]">
                            {lane1ExecProgress >= 1 ? 'Cached in memory (4 results)' : 'Precomputing concurrent call...'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress track */}
                    <div className="flex items-center gap-3">
                      <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#E11D48] to-[#00F0FF] transition-all"
                          style={{ width: `${lane1ExecProgress * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-white/80 w-16 text-right tabular-nums">
                        {lane1ExecProgress >= 1 ? 'Done' : `${Math.round(lane1ExecProgress * 100)}%`}
                      </span>
                    </div>
                  </div>

                  {/* Lane B */}
                  <div
                    className={`relative p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                      liftStmt2 > 0.1
                        ? 'bg-[#181824] border-[#E11D48]/60 shadow-[0_0_20px_rgba(225,29,72,0.2)]'
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#E11D48]/20 border border-[#E11D48]/50 flex items-center justify-center text-xs font-bold text-[#E11D48]">
                        B
                      </div>
                      <div>
                        <div className="text-sm font-mono font-bold text-white">
                          b = search("payment failures")
                        </div>
                        <div className="text-xs text-white/50 flex items-center gap-2 mt-0.5">
                          <span>AST: read-only deterministic</span>
                          <span>•</span>
                          <span className="text-[#00F0FF]">
                            {lane2ExecProgress >= 1 ? 'Cached in memory (2 results)' : 'Precomputing concurrent call...'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#E11D48] to-[#00F0FF] transition-all"
                          style={{ width: `${lane2ExecProgress * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-white/80 w-16 text-right tabular-nums">
                        {lane2ExecProgress >= 1 ? 'Done' : `${Math.round(lane2ExecProgress * 100)}%`}
                      </span>
                    </div>
                  </div>

                  {/* Lane C */}
                  <div
                    className={`relative p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                      liftStmt3 > 0.1
                        ? 'bg-[#181824] border-[#E11D48]/60 shadow-[0_0_20px_rgba(225,29,72,0.2)]'
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#E11D48]/20 border border-[#E11D48]/50 flex items-center justify-center text-xs font-bold text-[#E11D48]">
                        C
                      </div>
                      <div>
                        <div className="text-sm font-mono font-bold text-white">
                          c = fetch(a[0])
                        </div>
                        <div className="text-xs text-white/50 flex items-center gap-2 mt-0.5">
                          <span>Resolved dependency from memory</span>
                          <span>•</span>
                          <span className="text-[#00F0FF]">
                            {lane3ExecProgress >= 1 ? 'Ready for Authoritative Replay' : 'Fetching via Lane A cache...'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#E11D48] to-[#00F0FF] transition-all"
                          style={{ width: `${lane3ExecProgress * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-white/80 w-16 text-right tabular-nums">
                        {lane3ExecProgress >= 1 ? 'Done' : `${Math.round(lane3ExecProgress * 100)}%`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Active Stream Line (Typing character by character) */}
                <div
                  className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-sm leading-relaxed transition-opacity duration-300"
                  style={{ opacity: streamWindowOpacity }}
                >
                  <div className="flex items-center justify-between text-xs text-white/40 mb-2 font-martin uppercase">
                    <span>LLM Stream Output (Active Generation)</span>
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Streaming Tokens
                    </span>
                  </div>

                  <div className="space-y-1 text-white/80">
                    <div className="flex items-center gap-2">
                      <span className="text-[#E11D48] font-bold">1:</span>
                      <span>{stmt1Full.slice(0, stmt1Chars)}</span>
                      {t < 1.7 && <span className="inline-block w-2 h-4 bg-[#E11D48] animate-pulse" />}
                    </div>

                    {t >= 1.8 && (
                      <div className="flex items-center gap-2">
                        <span className="text-[#E11D48] font-bold">2:</span>
                        <span>{stmt2Full.slice(0, stmt2Chars)}</span>
                        {t < 3.1 && <span className="inline-block w-2 h-4 bg-[#E11D48] animate-pulse" />}
                      </div>
                    )}

                    {t >= 3.2 && (
                      <div className="flex items-center gap-2">
                        <span className="text-[#E11D48] font-bold">3:</span>
                        <span>{stmt3Full.slice(0, stmt3Chars)}</span>
                        {t < 4.3 && <span className="inline-block w-2 h-4 bg-[#E11D48] animate-pulse" />}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* BEAT 3: The Race — Baseline (764 ms) vs. Concurrent (368 ms)     */}
          {/* ================================================================ */}
          {t >= 7.6 && t < 12.0 && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-12 transition-all duration-100"
              style={{
                opacity: raceSectionOpacity,
                transform: `scale(${1 - smootherstep(11.4, 12.0, t) * 0.05})`
              }}
            >
              <div className="w-[1040px] rounded-[32px] border border-white/15 bg-[#121216]/95 backdrop-blur-xl shadow-2xl p-10 flex flex-col gap-8">
                
                {/* Race Title Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Timer className="w-6 h-6 text-[#E11D48]" />
                    <div>
                      <h2 className="text-xl font-bold font-parabole text-white leading-tight">
                        Execution Latency Benchmark Race
                      </h2>
                      <span className="text-xs uppercase tracking-wider text-[#E11D48] font-martin font-medium">
                        Simulated Agent Tool Benchmark · Pure Read-Only Workload
                      </span>
                    </div>
                  </div>

                  {/* Latency Reduction Badge */}
                  <div
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF] shadow-[0_0_30px_rgba(0,240,255,0.25)] transition-transform duration-75"
                    style={{
                      transform: `scale(${latencyBadgeSpring})`
                    }}
                  >
                    <Zap className="w-5 h-5 text-[#00F0FF]" />
                    <span className="text-lg font-bold font-martin text-white tabular-nums">
                      -{counterValue}%
                    </span>
                    <span className="text-xs uppercase tracking-wider text-[#00F0FF] font-martin font-bold">
                      Median Cut
                    </span>
                  </div>
                </div>

                {/* Two Racing Tracks */}
                <div className="flex flex-col gap-6 py-2">
                  
                  {/* Track 1: Sequential Baseline (Crawls across) */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-martin uppercase">
                      <span className="text-white/60">Sequential Baseline Execution</span>
                      <span className="text-white/80 font-bold tabular-nums">
                        {baselineFill >= 0.99 ? 'Baseline 764 ms' : `${Math.round(baselineFill * 764)} ms`}
                      </span>
                    </div>

                    <div className="relative w-full h-11 bg-white/5 rounded-xl border border-white/10 overflow-hidden flex items-center px-4">
                      <div
                        className="absolute inset-y-0 left-0 bg-white/20 transition-all duration-75"
                        style={{ width: `${baselineFill * 100}%` }}
                      />
                      <span className="relative z-10 text-xs font-mono text-white/80">
                        Serial waiting: Stream completes → Tool A (240ms) → Tool B (280ms) → Tool C (244ms)
                      </span>
                    </div>
                  </div>

                  {/* Track 2: Speculative Concurrent (Fills fast and lands snappily!) */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-martin uppercase">
                      <span className="text-[#00F0FF] font-bold">SpecExec Concurrent Speculation</span>
                      <span className="text-[#00F0FF] font-bold tabular-nums text-sm">
                        {concurrentFill >= 0.99 ? 'Concurrent 368 ms' : `${Math.round(concurrentFill * 368)} ms`}
                      </span>
                    </div>

                    <div className="relative w-full h-12 bg-white/5 rounded-xl border border-[#E11D48]/50 shadow-[0_0_25px_rgba(225,29,72,0.2)] overflow-hidden flex items-center px-4">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#F59E0B] transition-all duration-75"
                        style={{ width: `${concurrentFill * 48.2}%` }} // Lands at 48.2% width = 368 / 764
                      />
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <span className="text-xs font-mono text-white font-bold drop-shadow">
                          Concurrent precomputation overlaps with stream generation
                        </span>
                        {concurrentFill > 0.9 && (
                          <span className="text-xs uppercase tracking-wider font-bold bg-black/60 px-3 py-1 rounded-full border border-[#00F0FF] text-[#00F0FF] font-martin">
                            368 ms · 51.8% Latency Cut
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Subtext info */}
                <div className="text-xs text-white/50 border-t border-white/10 pt-4 flex items-center justify-between font-martin">
                  <span>Hiding tool execution behind streamed tokens without risking side effects</span>
                  <span className="text-[#00F0FF]">Precomputed results cached securely in memory</span>
                </div>

              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* BEAT 4: Correctness Beat — Authoritative Replay                  */}
          {/* ================================================================ */}
          {t >= 11.4 && t < 15.4 && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-12 transition-all duration-100"
              style={{
                opacity: replaySectionOpacity,
                transform: `scale(${1 - foldToEnd * 0.1})`
              }}
            >
              <div className="w-[1040px] rounded-[32px] border border-white/15 bg-[#121216]/95 backdrop-blur-xl shadow-2xl p-10 flex flex-col gap-6">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#00F0FF]" />
                    <div>
                      <h2 className="text-xl font-bold font-parabole text-white leading-tight">
                        Authoritative Replay · Fresh Namespace
                      </h2>
                      <span className="text-xs uppercase tracking-wider text-[#00F0FF] font-martin font-medium">
                        Stream finished → Authoritative deterministic pass
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-martin uppercase text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    Zero Side Effects
                  </span>
                </div>

                {/* 3 Replay Verification Steps */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Step 1 */}
                  <div
                    className={`p-5 rounded-2xl border transition-all duration-300 ${
                      replayItem1 > 0.5
                        ? 'bg-[#181824] border-[#00F0FF]/50 shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                        : 'bg-white/[0.02] border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-[#00F0FF] font-bold font-martin uppercase mb-2">
                      <span>Statement 1</span>
                      <span>Exact Cache Hit</span>
                    </div>
                    <div className="text-sm font-mono text-white font-semibold">
                      a = search("checkout latency")
                    </div>
                    <div className="text-xs text-white/50 mt-2">
                      Precomputed output matched. Reused from cache with 0 ms overhead.
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div
                    className={`p-5 rounded-2xl border transition-all duration-300 ${
                      replayItem2 > 0.5
                        ? 'bg-[#181824] border-[#00F0FF]/50 shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                        : 'bg-white/[0.02] border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-[#00F0FF] font-bold font-martin uppercase mb-2">
                      <span>Statement 2</span>
                      <span>Exact Cache Hit</span>
                    </div>
                    <div className="text-sm font-mono text-white font-semibold">
                      b = search("payment failures")
                    </div>
                    <div className="text-xs text-white/50 mt-2">
                      Precomputed output matched. Reused from cache with 0 ms overhead.
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div
                    className={`p-5 rounded-2xl border transition-all duration-300 ${
                      replayItem3 > 0.5
                        ? 'bg-[#181824] border-[#E11D48]/50 shadow-[0_0_20px_rgba(225,29,72,0.15)]'
                        : 'bg-white/[0.02] border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-[#E11D48] font-bold font-martin uppercase mb-2">
                      <span>Statement 3</span>
                      <span>Deterministic Pass</span>
                    </div>
                    <div className="text-sm font-mono text-white font-semibold">
                      c = fetch(a[0])
                    </div>
                    <div className="text-xs text-white/50 mt-2">
                      Executed in clean fresh namespace without state corruption.
                    </div>
                  </div>
                </div>

                {/* Safety Guarantee Stamp */}
                <div
                  className="p-4 rounded-xl bg-black/60 border border-[#00F0FF]/40 flex items-center justify-between font-martin text-xs text-white transition-all duration-75"
                  style={{ transform: `scale(${stampCorrectness})` }}
                >
                  <span className="text-[#00F0FF] font-bold tracking-wide">
                    authoritative replay - fresh namespace - exact cache hits reused, misses re-execute
                  </span>
                  <span className="text-[11px] text-white/60 bg-white/10 px-2.5 py-1 rounded-md">
                    Verified Correctness
                  </span>
                </div>

              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* BEAT 5: End Card (t: 14.8 -> 18.0s)                              */}
          {/* ================================================================ */}
          {t >= 15.0 && (
            <div
              className="relative z-30 flex flex-col items-center justify-center text-center max-w-3xl px-8 transition-all duration-100"
              style={{
                opacity: endCardOpacity,
                transform: `scale(${endBadgeScale})`
              }}
            >
              {/* Grand Display Title in font-parabole */}
              <h1 className="font-parabole font-bold text-white tracking-tight leading-none text-7xl sm:text-8xl drop-shadow-[0_0_40px_rgba(225,29,72,0.35)]">
                SpecExec
              </h1>

              {/* Subtitle in clean tracking */}
              <div className="mt-4 text-base sm:text-lg uppercase tracking-widest text-[#E11D48] font-martin font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
                Speculative Tool Execution Runtime
                <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
              </div>

              {/* 4 Core Pillars Strip */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 font-martin text-xs text-white/80">
                <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
                  Stream Statement Detection
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
                  Concurrent Read-Only Execution
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
                  Authoritative Replay
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
                  -51.8% Median Latency Cut
                </span>
              </div>

              {/* Exact Required Footer Notice */}
              <div className="mt-12 text-xs text-white/40 font-martin font-light tracking-wide border-t border-white/10 pt-3">
                Simulated local benchmark - independent workload - not a production claim
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
