import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Database,
  Terminal,
  BarChart3,
  Check,
  MousePointer2,
  Code2,
  Lock,
  Layers,
  Sparkles,
  ArrowRight,
  Maximize2
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

const expoOut = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

const springSettle = (progress: number, damping = 14, freq = 18) => {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  const decay = Math.exp(-damping * progress);
  const osc = Math.cos(freq * progress * (1 - progress));
  return 1 - decay * osc;
};

export interface Talk2DataShowreelProps {
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
  onClose?: () => void;
}

export const Talk2DataShowreel: React.FC<Talk2DataShowreelProps> = ({
  autoplay = true,
  loop = true,
  className = '',
  onClose
}) => {
  const TOTAL_DURATION = 20.0; // 20-second continuous take showreel
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
      setCurrentTime(18.5); // Jump directly to clean end card
      setIsPlaying(false);
    }

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        setCurrentTime(18.5);
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

  // ==========================================
  // BEAT 1: Prompt Bar & Typing (t: 0.0 -> 3.2s)
  // ==========================================
  const fullPromptText = "Which region has the most revenue?";
  const promptEntrance = smootherstep(0.0, 0.5, t);
  const typingProgress = smootherstep(0.5, 2.5, t);
  const charsCount = Math.floor(typingProgress * fullPromptText.length);
  const displayedPrompt = fullPromptText.slice(0, charsCount);
  const caretVisible = (Math.floor(t * 4) % 2 === 0) && t < 2.9;
  const promptEnterHit = smootherstep(2.6, 2.9, t);

  // Carry 1: Prompt bar morphs into App Window (t: 2.9 -> 3.8s)
  const morphToWindow = smootherstep(2.9, 3.8, t);
  const windowScale = 0.55 + morphToWindow * 0.45;
  const windowWidth = 620 + morphToWindow * 340; // 620px -> 960px
  const windowHeight = 64 + morphToWindow * 456; // 64px -> 520px

  // ========================================================
  // BEAT 2: Schema Inspection: agent calls getSchema() (t: 3.5 -> 5.8s)
  // ========================================================
  const schemaOpacity = smootherstep(3.4, 4.0, t) * (1 - smootherstep(5.6, 6.2, t));
  const schemaProgress = smootherstep(3.6, 4.8, t);
  const tableOrdersPulsed = smootherstep(3.8, 4.4, t);
  const tableRegionsPulsed = smootherstep(4.1, 4.7, t);
  const tableRevenuePulsed = smootherstep(4.4, 5.0, t);
  const connectionLineDraw = smootherstep(4.5, 5.4, t);

  // =========================================================================
  // BEAT 3: SQL SELECT Assembly + AST Validation Stamp + Strike INSERT (t: 5.6 -> 9.2s)
  // =========================================================================
  const sqlSectionOpacity = smootherstep(5.6, 6.2, t) * (1 - smootherstep(9.2, 9.8, t));
  const sqlTypingLine1 = smootherstep(5.8, 6.6, t);
  const sqlTypingLine2 = smootherstep(6.3, 7.0, t);
  const sqlTypingLine3 = smootherstep(6.7, 7.4, t);
  
  // Stray INSERT statement appears, gets struck through and rejected
  const insertStmtEntrance = smootherstep(6.5, 7.0, t);
  const strikeThroughProgress = smootherstep(7.2, 7.7, t);
  const insertRejectFade = 1 - smootherstep(7.8, 8.4, t);

  // SELECT validation stamp lands with firm squash/settle
  const stampTrigger = smootherstep(7.6, 8.1, t);
  const stampSpring = springSettle(smootherstep(7.6, 8.1, t), 12, 16);
  const stampScale = 1.3 - stampSpring * 0.3;

  // Dead-still rest #1: Between t = 8.1s and 9.2s, frame is 100% still!
  // No motion, viewer absorbs validated query & stamp.

  // ===============================================================
  // BEAT 4: Validated Query Unfurls into Regional Bar Chart (t: 9.2 -> 12.2s)
  // ===============================================================
  // Carry 3: The SELECT query line literally unfurls into the chart X/Y axes!
  const queryToChartTransition = smootherstep(9.2, 9.9, t);
  const chartSectionOpacity = smootherstep(9.3, 9.9, t) * (1 - smootherstep(12.3, 13.0, t));

  // Regional bar heights rising with spring easing
  const barWestRise = springSettle(smootherstep(9.9, 10.7, t), 12, 14);
  const barEastRise = springSettle(smootherstep(10.1, 10.9, t), 12, 14);
  const barNorthRise = springSettle(smootherstep(10.3, 11.1, t), 12, 14);
  const barSouthRise = springSettle(smootherstep(10.5, 11.3, t), 12, 14);

  // Evidence cursor hover on West bar displaying verified record tooltip
  const cursorToWestProgress = smootherstep(10.8, 11.4, t);
  const evidenceTooltipOpacity = smootherstep(11.2, 11.6, t);

  // Dead-still rest #2: Between t = 11.6s and 12.2s, frame is dead still on the verified chart evidence.

  // =========================================================================
  // BEAT 5: Chart grows into Saved Dashboard Card with Inspectable SQL Chip (t: 12.2 -> 14.5s)
  // =========================================================================
  // Carry 4: The chart scales and docks into a saved dashboard widget card!
  const dashboardCardMorph = smootherstep(12.2, 12.9, t);
  const dashboardSectionOpacity = smootherstep(12.3, 12.8, t) * (1 - smootherstep(16.8, 17.4, t));

  // Cursor moves to inspectable [SQL] chip
  const cursorToSqlProgress = smootherstep(13.0, 13.6, t);
  const sqlDrawerOpen = smootherstep(13.6, 14.2, t);

  // ========================================================================
  // BEAT 6: Explicit MCP Approval Gate & Cursor Click (t: 14.5 -> 17.0s)
  // ========================================================================
  const mcpGateEntrance = springSettle(smootherstep(14.5, 15.1, t), 14, 18);
  const mcpCursorMove = smootherstep(15.2, 15.9, t);
  const mcpClickReaction = smootherstep(15.9, 16.2, t);
  const mcpApprovedStamp = smootherstep(16.1, 16.5, t);
  const mcpClickSquash = mcpClickReaction > 0 && mcpClickReaction < 0.9 ? 0.94 : 1.0;

  // ========================================================
  // BEAT 7: Fold into End Card (t: 17.0 -> 20.0s)
  // ========================================================
  // Carry 5: Approval chip folds inward and blooms into the Talk2Data Wordmark!
  const foldToCenter = smootherstep(17.0, 17.8, t);
  const endCardEntrance = springSettle(smootherstep(17.6, 18.5, t), 11, 14);
  const endCardOpacity = smootherstep(17.5, 18.1, t);
  const endBadgeScale = 1.15 - (endCardEntrance * 0.15);


  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-[#0C0C0C] rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden select-none font-martin text-white ${className}`}
      role="region"
      aria-label="Talk2Data showreel"
    >
      {/* 1. Subtle Ambient Studio Glow (#E11D48 Signature Crimson Accent) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse 65% 55% at 50% ${
            t < 17 ? '45%' : '50%'
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
            Talk2Data · One-Take Showreel
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
        
        {/* ======================================================================= */}
        {/* CARRIER: App Window / Prompt Bar (Survives from Beat 1 into Beats 2-6)   */}
        {/* ======================================================================= */}
        {t < 17.4 && (
          <div
            className="relative transition-all duration-75 flex flex-col items-center justify-center"
            style={{
              opacity: t < 17.0 ? 1 : 1 - foldToCenter,
              transform: `scale(${
                t < 17.0
                  ? windowScale * (1 - dashboardCardMorph * 0.12)
                  : (1 - foldToCenter * 0.9)
              }) translateY(${t < 17.0 ? 0 : foldToCenter * 10}px)`,
              transformOrigin: 'center center'
            }}
          >
            {/* The Morphing Window Container */}
            <div
              className="relative rounded-2xl md:rounded-[24px] border border-white/15 bg-[#121216]/90 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-75"
              style={{
                width: `${Math.min(windowWidth, 880)}px`,
                minHeight: `${Math.min(windowHeight, 480)}px`,
                maxHeight: '490px'
              }}
            >
              {/* Window Title Bar */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="ml-2 text-xs text-white/50 font-martin font-light tracking-wide">
                    {morphToWindow < 0.5 ? "Natural Language Prompt" : "Talk2Data · Local Agent Workbench"}
                  </span>
                </div>

                {/* Question Chip on top right once window expands */}
                {morphToWindow > 0.4 && (
                  <div className="flex items-center gap-1.5 bg-[#E11D48]/15 border border-[#E11D48]/30 px-2.5 py-1 rounded-full">
                    <Sparkles className="w-3 h-3 text-[#E11D48]" />
                    <span className="text-[11px] text-white/90 truncate max-w-[240px]">
                      {fullPromptText}
                    </span>
                  </div>
                )}
              </div>

              {/* Window Body */}
              <div className="relative flex-1 p-4 sm:p-6 flex flex-col justify-between">
                
                {/* ---------------------------------------------------- */}
                {/* BEAT 1 CONTENT: Prompt Bar Initial Typing State      */}
                {/* ---------------------------------------------------- */}
                {morphToWindow < 0.4 && (
                  <div className="flex items-center justify-between h-full px-2">
                    <div className="flex items-center gap-3">
                      <Terminal className="w-4 h-4 text-[#E11D48]" />
                      <span className="text-sm sm:text-base text-white font-martin tracking-wide">
                        {displayedPrompt}
                        {caretVisible && <span className="inline-block w-2 h-4 ml-0.5 bg-[#E11D48]" />}
                      </span>
                    </div>
                    <div
                      className={`text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-md border font-martin transition-all ${
                        promptEnterHit > 0.5
                          ? 'bg-[#E11D48] text-white border-[#E11D48] scale-95 shadow-[0_0_12px_rgba(225,29,72,0.5)]'
                          : 'bg-white/5 text-white/40 border-white/10'
                      }`}
                    >
                      Return ↵
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------- */}
                {/* BEAT 2 CONTENT: Schema Inspection (getSchema first)     */}
                {/* ------------------------------------------------------- */}
                {t >= 3.4 && t < 6.2 && (
                  <div
                    className="flex flex-col justify-center gap-4 py-2 transition-opacity duration-200"
                    style={{ opacity: schemaOpacity }}
                  >
                    {/* Agent step banner */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/8">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-[#E11D48]" />
                        <span className="text-xs uppercase tracking-wider text-[#E11D48] font-bold">
                          Step 1: Agent Calls getSchema()
                        </span>
                      </div>
                      <span className="text-[10px] text-white/50 tracking-wider">
                        Zero SQL queries until schema verified
                      </span>
                    </div>

                    {/* 3 Inspectable Schema Tables */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Table 1: orders */}
                      <div
                        className={`p-3 rounded-xl border transition-all duration-300 ${
                          tableOrdersPulsed > 0.5
                            ? 'bg-[#181822] border-[#E11D48]/50 shadow-[0_0_15px_rgba(225,29,72,0.15)]'
                            : 'bg-white/[0.02] border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-white mb-2">
                          <span>orders</span>
                          <span className="text-[9px] text-[#E11D48] font-mono">TABLE</span>
                        </div>
                        <div className="text-[11px] text-white/60 space-y-1 font-mono">
                          <div className="text-[#00F0FF]/90 font-medium">• id (int PK)</div>
                          <div className="text-[#E11D48] font-bold">• region_id (fk)</div>
                          <div className="text-white font-bold">• amount (decimal)</div>
                          <div>• created_at (ts)</div>
                        </div>
                      </div>

                      {/* Table 2: regions */}
                      <div
                        className={`p-3 rounded-xl border transition-all duration-300 ${
                          tableRegionsPulsed > 0.5
                            ? 'bg-[#181822] border-[#E11D48]/50 shadow-[0_0_15px_rgba(225,29,72,0.15)]'
                            : 'bg-white/[0.02] border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-white mb-2">
                          <span>regions</span>
                          <span className="text-[9px] text-[#E11D48] font-mono">TABLE</span>
                        </div>
                        <div className="text-[11px] text-white/60 space-y-1 font-mono">
                          <div className="text-[#E11D48] font-bold">• id (int PK)</div>
                          <div className="text-white font-bold">• name (varchar)</div>
                          <div>• tax_zone (text)</div>
                          <div>• active (bool)</div>
                        </div>
                      </div>

                      {/* Table 3: revenue view */}
                      <div
                        className={`p-3 rounded-xl border transition-all duration-300 ${
                          tableRevenuePulsed > 0.5
                            ? 'bg-[#181822] border-white/20'
                            : 'bg-white/[0.02] border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-white mb-2">
                          <span>customers</span>
                          <span className="text-[9px] text-white/40 font-mono">TABLE</span>
                        </div>
                        <div className="text-[11px] text-white/40 space-y-1 font-mono">
                          <div>• id (uuid)</div>
                          <div>• tier (varchar)</div>
                          <div>• country (code)</div>
                        </div>
                      </div>
                    </div>

                    {/* Join Recognition Banner */}
                    <div
                      className="mt-1 p-2 rounded-lg bg-black/50 border border-white/10 flex items-center justify-between text-xs text-white/80 transition-all duration-300"
                      style={{ opacity: connectionLineDraw }}
                    >
                      <span className="text-[11px] text-[#D7E2EA]/70">
                        Join Candidate: <code className="text-white">orders.region_id = regions.id</code>
                      </span>
                      <span className="text-[10px] text-[#E11D48] font-bold">
                        SCHEMA CONTEXT READY
                      </span>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------------- */}
                {/* BEAT 3 CONTENT: SQL SELECT Assembly + AST Validation + Reject INSERT */}
                {/* ------------------------------------------------------------------- */}
                {t >= 5.6 && t < 9.8 && (
                  <div
                    className="flex flex-col justify-between h-full py-1 gap-3 transition-opacity duration-200"
                    style={{ opacity: sqlSectionOpacity }}
                  >
                    {/* Header: AST SQL Gate */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/8">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-[#E11D48]" />
                        <span className="text-xs uppercase tracking-wider text-white font-bold">
                          Step 2: AST Safety Verification
                        </span>
                      </div>
                      <span className="text-[10px] text-white/50 tracking-wider">
                        Strict AST Grammar · Mutations Blocked
                      </span>
                    </div>

                    {/* Validated SQL SELECT Box */}
                    <div className="relative p-3.5 rounded-xl bg-black/60 border border-white/15 font-mono text-xs sm:text-[13px] leading-relaxed text-white/90">
                      <div className="text-[#00F0FF]/90 font-medium">
                        SELECT <span className="text-white">r.name AS region, SUM(o.amount) AS total_revenue</span>
                      </div>
                      <div className="text-white/70">
                        FROM <span className="text-white">orders o</span> JOIN <span className="text-white">regions r</span> ON o.region_id = r.id
                      </div>
                      <div className="text-white/70">
                        GROUP BY <span className="text-white">r.name</span> ORDER BY <span className="text-white">total_revenue DESC;</span>
                      </div>

                      {/* Firm Validation Stamp landing at t: 7.6s */}
                      {t >= 7.6 && (
                        <div
                          className="absolute right-4 top-3 sm:top-3.5 flex items-center gap-1.5 bg-[#00F0FF]/10 border border-[#00F0FF] text-[#00F0FF] px-3 py-1.5 rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-transform duration-75"
                          style={{
                            transform: `scale(${stampScale}) rotate(-2deg)`,
                            opacity: clamp(stampTrigger * 2, 0, 1)
                          }}
                        >
                          <ShieldCheck className="w-4 h-4 text-[#00F0FF]" />
                          <span className="text-xs font-bold uppercase tracking-wider font-martin">
                            SELECT-only · Passed
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Stray Dangerous Statement (Struck through and rejected) */}
                    {insertStmtEntrance > 0.05 && (
                      <div
                        className="relative p-3 rounded-xl bg-red-950/20 border border-red-500/30 flex items-center justify-between text-xs font-mono transition-opacity duration-300"
                        style={{ opacity: insertRejectFade }}
                      >
                        <div className="relative">
                          <span className="text-red-300 line-through">
                            INSERT INTO audit_log VALUES ('unauthorized_mutation');
                          </span>
                          {/* Strike-through line */}
                          <div
                            className="absolute left-0 top-1/2 h-[2px] bg-red-500"
                            style={{ width: `${strikeThroughProgress * 100}%` }}
                          />
                        </div>

                        {strikeThroughProgress > 0.4 && (
                          <div className="flex items-center gap-1 text-[11px] text-red-400 font-bold bg-red-900/40 px-2 py-0.5 rounded border border-red-500/40">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>BLOCKED (Mutation Denied)</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ------------------------------------------------------------------- */}
                {/* BEAT 4 CONTENT: Regional Revenue Bar Chart with Axis & Scale        */}
                {/* ------------------------------------------------------------------- */}
                {t >= 9.2 && t < 12.8 && (
                  <div
                    className="flex flex-col justify-between h-full py-1 gap-2 transition-opacity duration-200"
                    style={{ opacity: chartSectionOpacity }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/8">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-[#E11D48]" />
                        <span className="text-xs uppercase tracking-wider text-white font-bold">
                          Step 3: Safe SQL Query Execution
                        </span>
                      </div>
                      <span className="text-[10px] text-[#00F0FF] tracking-wider font-mono border border-[#00F0FF]/30 px-2 py-0.5 rounded-full bg-[#00F0FF]/10">
                        Sample data
                      </span>
                    </div>

                    {/* Bar Chart Canvas with Visible Axis Scale */}
                    <div className="relative flex-1 flex items-end justify-between pt-6 pb-2 px-6 sm:px-12">
                      {/* Persistent Sample Data Tag */}
                      <div className="absolute top-2 right-6 sm:right-12 px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-white/50 font-mono tracking-wider">
                        Sample data
                      </div>

                      {/* Y-Axis Gridlines & Scale */}
                      <div className="absolute inset-x-6 sm:inset-x-12 inset-y-4 flex flex-col justify-between pointer-events-none opacity-20">
                        <div className="w-full border-b border-white/40 flex items-center justify-between text-[9px] font-mono">
                          <span>800</span>
                        </div>
                        <div className="w-full border-b border-white/20 flex items-center justify-between text-[9px] font-mono">
                          <span>600</span>
                        </div>
                        <div className="w-full border-b border-white/20 flex items-center justify-between text-[9px] font-mono">
                          <span>400</span>
                        </div>
                        <div className="w-full border-b border-white/60 flex items-center justify-between text-[9px] font-mono">
                          <span>0</span>
                        </div>
                      </div>

                      {/* 4 Regional Bars */}
                      {/* Bar 1: Region A (Highest) */}
                      <div className="relative z-10 flex flex-col items-center gap-1.5 w-16 sm:w-20">
                        <span className="text-[11px] font-bold text-white tabular-nums">
                          {Math.round(610 * barWestRise)}
                        </span>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-[#BE123C] to-[#E11D48] shadow-[0_0_20px_rgba(225,29,72,0.4)] border-t border-x border-white/30"
                          style={{ height: `${160 * barWestRise}px` }}
                        />
                        <span className="text-xs font-bold text-[#00F0FF] uppercase tracking-wider">
                          Region A
                        </span>

                        {/* Evidence Tooltip on first bar */}
                        {t >= 11.2 && (
                          <div
                            className="absolute -top-11 left-1/2 -translate-x-1/2 bg-black/90 border border-[#00F0FF] text-white px-3 py-1.5 rounded-lg shadow-xl text-[10px] whitespace-nowrap z-30 transition-opacity duration-200 font-mono"
                            style={{ opacity: evidenceTooltipOpacity }}
                          >
                            <span className="text-[#00F0FF] font-bold">Region A: 610</span>
                            <span className="text-white/60 ml-1.5">• Sample data</span>
                          </div>
                        )}
                      </div>

                      {/* Bar 2: Region B */}
                      <div className="relative z-10 flex flex-col items-center gap-1.5 w-16 sm:w-20">
                        <span className="text-[11px] text-white/80 tabular-nums">
                          {Math.round(550 * barEastRise)}
                        </span>
                        <div
                          className="w-full rounded-t-lg bg-white/30 border-t border-x border-white/30"
                          style={{ height: `${140 * barEastRise}px` }}
                        />
                        <span className="text-xs text-white/70 uppercase tracking-wider">
                          Region B
                        </span>
                      </div>

                      {/* Bar 3: Region C */}
                      <div className="relative z-10 flex flex-col items-center gap-1.5 w-16 sm:w-20">
                        <span className="text-[11px] text-white/80 tabular-nums">
                          {Math.round(420 * barNorthRise)}
                        </span>
                        <div
                          className="w-full rounded-t-lg bg-white/20 border-t border-x border-white/20"
                          style={{ height: `${105 * barNorthRise}px` }}
                        />
                        <span className="text-xs text-white/70 uppercase tracking-wider">
                          Region C
                        </span>
                      </div>

                      {/* Bar 4: Region D */}
                      <div className="relative z-10 flex flex-col items-center gap-1.5 w-16 sm:w-20">
                        <span className="text-[11px] text-white/80 tabular-nums">
                          {Math.round(380 * barSouthRise)}
                        </span>
                        <div
                          className="w-full rounded-t-lg bg-white/10 border-t border-x border-white/20"
                          style={{ height: `${85 * barSouthRise}px` }}
                        />
                        <span className="text-xs text-white/70 uppercase tracking-wider">
                          Region D
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------------- */}
                {/* BEAT 5 CONTENT: Saved Dashboard Card with Inspectable SQL Chip      */}
                {/* ------------------------------------------------------------------- */}
                {t >= 12.2 && t < 16.8 && (
                  <div
                    className="flex flex-col justify-between h-full py-1 gap-2.5 transition-opacity duration-200"
                    style={{ opacity: dashboardSectionOpacity }}
                  >
                    {/* Saved Dashboard Card Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#E11D48]" />
                        <span className="text-xs uppercase tracking-wider text-white font-bold">
                          Dashboard Card · Regional Revenue
                        </span>
                      </div>

                      {/* The Inspectable SQL Chip (Every widget's SQL is inspectable) */}
                      <div
                        className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-mono font-bold transition-all duration-300 ${
                          sqlDrawerOpen > 0.4
                            ? 'bg-[#E11D48] text-white border-[#E11D48] shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                            : 'bg-white/10 text-white/90 border-white/20 hover:border-white'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>SQL</span>
                        <span className="text-[9px] uppercase tracking-wider ml-1 opacity-70">
                          Inspect
                        </span>
                      </div>
                    </div>

                    {/* Mini version of the Chart in the saved card */}
                    <div className="flex-1 bg-black/40 rounded-xl p-3 border border-white/10 flex items-center justify-between gap-4">
                      <div className="flex-1 flex flex-col gap-1.5">
                        <span className="text-[11px] text-white/50 uppercase tracking-wider">
                          Top Performing Territory · Sample
                        </span>
                        <div className="text-xl sm:text-2xl font-bold font-parabole text-white flex items-baseline gap-2">
                          Region A <span className="text-sm font-martin text-[#E11D48] font-semibold">610</span>
                        </div>
                        <span className="text-[11px] text-white/60">
                          Automated safe aggregation across orders table
                        </span>
                      </div>

                      {/* Mini bar sparkline */}
                      <div className="flex items-end gap-1.5 h-16 w-32 border-b border-white/20 pb-1 px-2">
                        <div className="flex-1 bg-[#E11D48] rounded-t h-[90%]" />
                        <div className="flex-1 bg-white/30 rounded-t h-[65%]" />
                        <div className="flex-1 bg-white/20 rounded-t h-[50%]" />
                        <div className="flex-1 bg-white/15 rounded-t h-[35%]" />
                      </div>
                    </div>

                    {/* Opened SQL Inspector Drawer */}
                    {sqlDrawerOpen > 0.1 && (
                      <div
                        className="p-3 rounded-xl bg-black/80 border border-[#E11D48]/40 font-mono text-xs text-white/90 flex flex-col gap-1 transition-all"
                        style={{
                          transform: `translateY(${(1 - sqlDrawerOpen) * 10}px)`,
                          opacity: sqlDrawerOpen
                        }}
                      >
                        <div className="flex items-center justify-between text-[10px] text-[#E11D48] font-bold uppercase tracking-wider">
                          <span>Inspectable Query Behind Widget</span>
                          <span>AST Validated</span>
                        </div>
                        <code className="text-white/80 text-[11px]">
                          SELECT r.name, SUM(amount) FROM orders JOIN regions GROUP BY 1 ORDER BY 2 DESC
                        </code>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* BEAT 6: Explicit MCP Approval Gate (Never automatic, requires click) */}
            {/* ------------------------------------------------------------------- */}
            {t >= 14.5 && t < 17.2 && (
              <div
                className="absolute inset-0 flex items-center justify-center p-4 z-40"
                style={{
                  opacity: clamp(mcpGateEntrance * 1.5, 0, 1),
                  transform: `scale(${0.9 + mcpGateEntrance * 0.1})`
                }}
              >
                {/* Modal Dialog Card */}
                <div className="w-full max-w-md rounded-2xl bg-[#16161C] border border-[#E11D48]/60 p-5 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col gap-3.5 backdrop-blur-2xl">
                  {/* Gate Title */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#E11D48]" />
                      <span className="text-xs uppercase tracking-wider text-white font-bold font-martin">
                        MCP Approval Gate
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-400 border border-amber-400/40 px-2 py-0.5 rounded-full font-mono font-medium">
                      Requires Approval
                    </span>
                  </div>

                  {/* Body description */}
                  <div className="text-xs text-white/80 space-y-1">
                    <p className="font-semibold text-white">
                      Agent requested: <code className="text-[#00F0FF] font-mono">export_to_bi(channel='metabase')</code>
                    </p>
                    <p className="text-[11px] text-white/60">
                      Model Context Protocol calls with external side-effects are never executed automatically.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg border border-white/15 text-white/60 text-xs font-martin"
                    >
                      Reject
                    </button>
                    
                    {/* The Approve Button (Cursor visibly clicks this) */}
                    <div
                      className={`relative px-4 py-2 rounded-lg border text-xs font-martin font-bold transition-transform duration-100 flex items-center gap-1.5 ${
                        mcpApprovedStamp > 0.5
                          ? 'bg-[#00F0FF] text-black border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.5)]'
                          : 'bg-[#E11D48] text-white border-[#E11D48] shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                      }`}
                      style={{ transform: `scale(${mcpClickSquash})` }}
                    >
                      {mcpApprovedStamp > 0.5 ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Approved & Dispatched</span>
                        </>
                      ) : (
                        <>
                          <span>Approve MCP Call</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* VISIBLE CAUSE: The Operator Cursor (Visible cause of click at t: 15.2 -> 16.5) */}
        {/* ==================================================================== */}
        {t >= 15.2 && t < 16.6 && (
          <div
            className="absolute z-50 pointer-events-none transition-all duration-75"
            style={{
              left: `${46 + mcpCursorMove * 16}%`,
              top: `${42 + mcpCursorMove * 14}%`,
              transform: `translate(-50%, -50%) scale(${mcpClickSquash})`
            }}
          >
            <MousePointer2 className="w-6 h-6 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] fill-white/20" />
            {mcpClickReaction > 0.3 && (
              <div className="absolute -inset-2 rounded-full border border-[#00F0FF] animate-ping" />
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* BEAT 7: FOLD INTO END CARD (t: 17.0 -> 20.0s)                         */}
        {/* ==================================================================== */}
        {t >= 17.2 && (
          <div
            className="relative z-30 flex flex-col items-center justify-center text-center max-w-2xl px-6 transition-all duration-100"
            style={{
              opacity: endCardOpacity,
              transform: `scale(${endBadgeScale})`
            }}
          >
            {/* Luminous Title in font-parabole */}
            <h1
              className="font-parabole font-bold text-white tracking-tight leading-none text-5xl sm:text-7xl md:text-8xl drop-shadow-[0_0_40px_rgba(225,29,72,0.35)]"
            >
              Talk2Data
            </h1>

            {/* Subtitle in clean tracking */}
            <div className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg uppercase tracking-widest text-[#E11D48] font-martin font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
              Tool-Calling Data Agents
              <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
            </div>

            {/* 4 Core Pillars Strip */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 font-martin text-xs text-white/80">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                SELECT-Only AST
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                Schema-First Inspection
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                MCP Approval Gates
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                Inspectable SQL
              </span>
            </div>

            {/* Exact Required Footer Notice */}
            <div className="mt-10 sm:mt-12 text-[11px] sm:text-xs text-white/40 font-martin font-light tracking-wide border-t border-white/10 pt-3">
              Illustrated flow - not a recording of a live model call
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
