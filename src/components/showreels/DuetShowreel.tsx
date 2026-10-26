import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  MousePointer2,
  CheckCircle2,
  MessageSquare,
  Send,
  Sparkles,
  Maximize2,
  FileCode,
  Layers,
  ArrowRight,
  ShieldCheck,
  Radio,
  Sliders
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

export interface DuetShowreelProps {
  autoplay?: boolean;
  loop?: boolean;
  className?: string;
  onClose?: () => void;
}

export const DuetShowreel: React.FC<DuetShowreelProps> = ({
  autoplay = true,
  loop = true,
  className = '',
  onClose,
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
      setCurrentTime(18.5); // Static clean end frame
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

  // ========================================================
  // BEAT TIMINGS & CONTINUOUS CARRY MATHEMATICS
  // ========================================================
  
  // Beat 1: Artifact Page Lands on Quiet Desk (t: 0.0 -> 3.6s)
  const artifactLanding = springSettle(smootherstep(0.2, 1.4, t), 12, 14);
  const artifactY = (1 - artifactLanding) * 50;
  const artifactOpacity = smootherstep(0.1, 0.9, t);

  // Human Cursor Trajectory (Visible cause of every action)
  // Cursor moves from offstage (bottom right) -> Heading element -> Click -> Send Button -> End
  let cursorX = 850;
  let cursorY = 560;
  let cursorClickPulse = 0;

  if (t < 1.5) {
    // Entering frame
    const p = smootherstep(0.5, 1.5, t);
    cursorX = 900 - p * 360;
    cursorY = 600 - p * 380;
  } else if (t < 3.8) {
    // Hovering headline to click
    const p = smootherstep(1.5, 3.2, t);
    cursorX = 540 + (1 - p) * 40;
    cursorY = 220 + (1 - p) * 30;
    if (t >= 3.2 && t <= 3.8) {
      cursorClickPulse = Math.sin((t - 3.2) / 0.6 * Math.PI);
    }
  } else if (t < 7.2) {
    // Resting slightly off headline
    cursorX = 570;
    cursorY = 230;
  } else if (t < 10.4) {
    // Moving towards "Send to Agent" button in sidebar
    const p = smootherstep(8.4, 9.8, t);
    cursorX = 570 + p * 350;
    cursorY = 230 + p * 230;
    if (t >= 9.8 && t <= 10.4) {
      cursorClickPulse = Math.sin((t - 9.8) / 0.6 * Math.PI);
    }
  } else {
    // Retracting away
    const p = smootherstep(10.5, 12.0, t);
    cursorX = 920 + p * 200;
    cursorY = 460 + p * 150;
  }

  // Beat 2: Element Click & Annotation Pin (t: 3.2 -> 7.2s)
  // Carry: The headline element transforms into the pin's coordinate anchor
  const pinDrop = springSettle(smootherstep(3.2, 4.0, t), 14, 18);
  const threadCardOpen = springSettle(smootherstep(3.8, 4.7, t), 13, 16);

  // Beat 3: Feedback Message & "Send to Agent" (t: 7.0 -> 10.5s)
  // Carry: The pin thread comment text flows into the sidebar chat box
  const chatMessageFull = "Tighten the headline spacing";
  const typeMessageProg = smootherstep(7.2, 8.8, t);
  const chatChars = Math.floor(typeMessageProg * chatMessageFull.length);
  const sendButtonPressed = smootherstep(9.7, 10.1, t) * (1 - smootherstep(10.2, 10.6, t));

  // Beat 4: SSE Stream Pulse & Revision v2 Growth (t: 10.2 -> 14.6s)
  // Carry: Dispatched message travels along live SSE pipe, returning as v2 revision
  const ssePulseProg = clamp((t - 10.2) / 1.6, 0, 1);
  const ssePulseActive = t >= 10.2 && t <= 12.2;
  const revisionGrowth = springSettle(smootherstep(11.8, 13.0, t), 12, 16);
  
  // Headline spacing visibly fixes:
  // v1: letter-spacing 0.08em (loose/awkward), line-height 1.6
  // v2: letter-spacing -0.03em (tight/crisp), line-height 1.15
  const isV2 = revisionGrowth > 0.5;
  const currentLetterSpacing = `${0.08 - revisionGrowth * 0.11}em`;
  const currentLineHeight = `${1.6 - revisionGrowth * 0.45}`;

  // Beat 5: Approved Seal Stamp & Timeline (t: 14.2 -> 17.2s)
  // Carry: Pinned revision receives human sign-off; approved seal stamps down
  const approvedSealStamp = springSettle(smootherstep(14.4, 15.2, t), 14, 18);
  const timelineGather = smootherstep(15.0, 16.2, t);
  
  // Rest period: t: 15.6s to 17.2s (dead-still rest admiring the verified artifact)

  // Beat 6: Fold to End Card (t: 17.2 -> 20.0s)
  // Carry: The approved seal and timeline fold into the center to form the Duet wordmark
  const foldToEndProg = smootherstep(17.2, 18.0, t);
  const endCardEntrance = springSettle(smootherstep(17.8, 18.8, t), 12, 15);
  const endCardOpacity = smootherstep(17.6, 18.2, t);

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-[#0C0C0C] rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden select-none font-martin text-white ${className}`}
      role="region"
      aria-label="Duet showreel"
    >
      {/* 1. Subtle Ambient Studio Glow (#E11D48 Signature Crimson Accent) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse 65% 55% at 50% ${
            t < 17 ? '48%' : '50%'
          }, rgba(225, 29, 72, 0.22) 0%, rgba(12, 12, 12, 0) 70%)`,
        }}
      />

      {/* 2. Precision Lattice Background (quiet ground, 70% negative space) */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* 3. Minimal Cinema Header */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-2 border-b border-white/8 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-pulse" />
          <span className="text-xs tracking-wider uppercase text-white/90 font-medium">
            Duet · One-Take Showreel
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
            transformOrigin: 'center center',
          }}
        >
          {/* ================================================================ */}
          {/* BEATS 1 - 5: Desk, Artifact Review Window & Sidebar              */}
          {/* ================================================================ */}
          {t < 18.0 && (
            <div
              className="absolute inset-0 flex items-center justify-center p-10 transition-all duration-100"
              style={{
                opacity: 1 - foldToEndProg,
                transform: `scale(${1 - foldToEndProg * 0.12})`,
              }}
            >
              {/* Studio Desk Surface Container (1140 x 580) */}
              <div
                className="w-[1140px] h-[580px] rounded-[32px] border border-white/15 bg-[#121216]/90 backdrop-blur-2xl shadow-2xl p-6 flex gap-6 relative overflow-hidden"
                style={{
                  opacity: artifactOpacity,
                  transform: `translateY(${artifactY}px)`,
                }}
              >
                {/* ---------------- Left Canvas: The HTML Artifact (720px wide) ---------------- */}
                <div className="flex-1 bg-[#181820] rounded-2xl border border-white/10 p-6 flex flex-col justify-between relative overflow-hidden">
                  
                  {/* Browser Bar / Window Top */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="text-[18px] font-mono text-white/70 ml-3 flex items-center gap-2">
                        <FileCode className="w-5 h-5 text-[#E11D48]" />
                        artifact_v{isV2 ? '2' : '1'}.html
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[20px] font-bold uppercase tracking-wider px-4 py-1 rounded-full font-martin transition-all ${
                        isV2
                          ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/60 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                          : 'bg-amber-500/30 text-amber-300 border border-amber-500/60'
                      }`}>
                        {isV2 ? 'Revision v2' : 'Revision v1'}
                      </span>
                    </div>
                  </div>

                  {/* Rendered HTML Page Body */}
                  <div className="flex-1 py-6 flex flex-col justify-center relative">
                    
                    {/* Mock Nav */}
                    <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg mb-8 border border-white/5">
                      <div className="w-20 h-3 bg-white/20 rounded" />
                      <div className="flex gap-3">
                        <div className="w-12 h-2.5 bg-white/10 rounded" />
                        <div className="w-12 h-2.5 bg-white/10 rounded" />
                        <div className="w-12 h-2.5 bg-white/10 rounded" />
                      </div>
                    </div>

                    {/* THE TARGET ELEMENT: Hero Headline */}
                    <div
                      className={`relative p-5 rounded-2xl border transition-all duration-300 ${
                        pinDrop > 0.05
                          ? 'border-[#E11D48] bg-[#E11D48]/10 shadow-[0_0_30px_rgba(225,29,72,0.25)]'
                          : 'border-dashed border-white/20 hover:border-white/40'
                      }`}
                    >
                      {/* Element coordinate tag */}
                      {pinDrop > 0.1 && (
                        <div
                          className="absolute -top-5 left-6 px-4 py-1.5 rounded-full bg-[#E11D48] text-white text-[20px] font-mono font-bold tracking-wider uppercase flex items-center gap-2 shadow-xl transition-all"
                          style={{ transform: `scale(${pinDrop})` }}
                        >
                          <span>&lt;h1#hero-heading&gt;</span>
                        </div>
                      )}

                      {/* Morphing headline text */}
                      <h1
                        className="font-parabole font-bold text-white transition-all duration-500 select-none"
                        style={{
                          fontSize: '34px',
                          letterSpacing: currentLetterSpacing,
                          lineHeight: currentLineHeight,
                        }}
                      >
                        Autonomous Code Intelligence Platform
                      </h1>

                      <p className="mt-3 text-[18px] text-white/60 font-martin max-w-lg leading-relaxed">
                        Continuous feedback loop for agent review sessions. Visual element anchoring with persistent session stores.
                      </p>

                      {/* ANNOTATION PIN (Carried directly into the comment thread) */}
                      {pinDrop > 0.1 && (
                        <div
                          className="absolute -right-4 -top-4 w-10 h-10 rounded-full bg-gradient-to-tr from-[#E11D48] to-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.7)] flex items-center justify-center text-white border-2 border-white transition-transform"
                          style={{
                            transform: `scale(${pinDrop})`,
                          }}
                        >
                          <MessageSquare className="w-5 h-5 fill-white text-black" />
                        </div>
                      )}

                      {/* Floating comment card anchored to pin (t: 3.8 -> 7.5s) */}
                      {t >= 3.8 && t < 8.2 && (
                        <div
                          className="absolute left-6 top-full mt-4 w-[440px] p-5 rounded-2xl bg-[#0F0F14]/95 border-2 border-[#E11D48]/80 shadow-[0_0_30px_rgba(0,0,0,0.9)] backdrop-blur-md z-30 transition-all font-martin"
                          style={{
                            opacity: threadCardOpen * (1 - smootherstep(7.4, 8.2, t)),
                            transform: `scale(${threadCardOpen}) translateY(${(1 - threadCardOpen) * 10}px)`,
                          }}
                        >
                          <div className="flex items-center justify-between text-[18px] text-[#00F0FF] font-bold uppercase mb-2">
                            <span>Comment Thread #1</span>
                            <span className="text-white/60">Reviewer</span>
                          </div>
                          <div className="text-[20px] text-white leading-snug font-medium">
                            "Tighten the headline spacing"
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Secondary mock cards */}
                    <div className="grid grid-cols-3 gap-3 mt-6">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-white/10 mb-2" />
                        <div className="w-16 h-2 bg-white/20 rounded mb-1" />
                        <div className="w-12 h-2 bg-white/10 rounded" />
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-white/10 mb-2" />
                        <div className="w-16 h-2 bg-white/20 rounded mb-1" />
                        <div className="w-12 h-2 bg-white/10 rounded" />
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="w-8 h-8 rounded-lg bg-white/10 mb-2" />
                        <div className="w-16 h-2 bg-white/20 rounded mb-1" />
                        <div className="w-12 h-2 bg-white/10 rounded" />
                      </div>
                    </div>

                  </div>

                  {/* APPROVED EMBOSSED STAMP (Beat 5) */}
                  {approvedSealStamp > 0.05 && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all"
                      style={{
                        opacity: approvedSealStamp,
                        transform: `scale(${1.2 - approvedSealStamp * 0.2})`,
                      }}
                    >
                      <div className="px-8 py-5 rounded-2xl border-2 border-emerald-400 bg-emerald-950/80 shadow-[0_0_50px_rgba(52,211,153,0.35)] flex items-center gap-4 text-emerald-300 font-parabole">
                        <ShieldCheck className="w-12 h-12 text-emerald-400" />
                        <div>
                          <div className="text-4xl font-bold tracking-wider uppercase">
                            Approved
                          </div>
                          <div className="text-[20px] font-martin uppercase tracking-widest text-emerald-200">
                            Artifact Verified · Session Finalized
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom footer bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[18px] text-white/60 font-martin">
                    <span className="flex items-center gap-2">
                      <Radio className={`w-4 h-4 ${ssePulseActive ? 'text-[#00F0FF] animate-pulse' : 'text-white/40'}`} />
                      SSE Live Session Active (FastAPI Store)
                    </span>
                    <span className="text-[#00F0FF] font-bold">Duet Review</span>
                  </div>

                </div>

                {/* ---------------- Right Sidebar: Review & Agent Dispatch (360px) ---------------- */}
                <div className="w-[360px] bg-[#14141c] rounded-2xl border border-white/10 p-5 flex flex-col justify-between">
                  
                  {/* Sidebar Header */}
                  <div className="pb-3 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-[20px] font-bold uppercase tracking-wider text-white">
                        Review Console
                      </span>
                      <span className="text-[15px] text-[#E11D48] font-mono font-bold border border-[#E11D48]/40 px-2.5 py-0.5 rounded-full">
                        Human Gate
                      </span>
                    </div>
                  </div>

                  {/* Live Feed / Active Thread (Carried from Pin) */}
                  <div className="flex-1 py-3 flex flex-col gap-3 overflow-hidden">
                    
                    {/* Thread Context Badge */}
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between text-[16px] text-[#00F0FF] font-bold uppercase">
                        <span>Selected Target</span>
                        <span className="text-[20px] font-mono text-white">&lt;h1&gt;</span>
                      </div>
                      <div className="text-[18px] text-white/70 mt-1 font-mono">
                        spacing: {isV2 ? '-0.03em' : '+0.08em'}
                      </div>
                    </div>

                    {/* Chat Input Field (Typing simulation in Beat 3) */}
                    <div className="p-3.5 rounded-xl bg-black/60 border border-white/15 flex flex-col gap-2">
                      <div className="text-[16px] uppercase tracking-wider text-white/60 font-bold">
                        Directive
                      </div>
                      <div className="text-[20px] font-mono text-white min-h-[44px] flex items-center leading-snug">
                        <span>{chatMessageFull.slice(0, chatChars)}</span>
                        {t >= 7.2 && t < 9.0 && (
                          <span className="inline-block w-2.5 h-5 bg-[#E11D48] ml-1 animate-pulse" />
                        )}
                      </div>

                      {/* "Send to Agent" Action Button */}
                      <div className="pt-1 flex justify-end">
                        <button
                          type="button"
                          className={`px-4 py-2 rounded-xl text-[16px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                            sendButtonPressed > 0.5
                              ? 'bg-[#00F0FF] text-black scale-95 shadow-[0_0_20px_rgba(0,240,255,0.8)]'
                              : t >= 9.2
                              ? 'bg-gradient-to-r from-[#E11D48] to-[#00F0FF] text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                              : 'bg-white/10 text-white/50'
                          }`}
                        >
                          <Send className="w-4 h-4" />
                          <span>Send to Agent</span>
                        </button>
                      </div>
                    </div>

                    {/* SSE Pipe Visual Connector (Beat 4) */}
                    {t >= 9.8 && (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-1.5 transition-all duration-300">
                        <div className="flex items-center justify-between text-[16px] text-white/80 uppercase font-bold">
                          <span>SSE Stream</span>
                          <span className="text-[#00F0FF] font-mono text-[16px]">FastAPI</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#E11D48] via-[#00F0FF] to-emerald-400 transition-all duration-100"
                            style={{ width: `${ssePulseProg * 100}%` }}
                          />
                        </div>
                        <div className="text-[18px] font-mono text-white/90 font-medium">
                          {isV2 ? '✓ Patch applied' : 'Streaming feedback...'}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Session Timeline Summary (Beat 5) */}
                  <div className="pt-3 border-t border-white/10">
                    <div className="text-[20px] font-bold text-white mb-2 flex items-center justify-between">
                      <span>Session Log</span>
                      <span className="text-[16px] text-white/50">FastAPI</span>
                    </div>

                    <div className="flex items-center gap-2 text-[20px] font-mono font-bold">
                      <span className="px-3 py-1 rounded bg-white/10 text-white/80">v1</span>
                      <span className="text-white/40">→</span>
                      <span className={`px-3 py-1 rounded transition-colors ${t >= 3.8 ? 'bg-[#E11D48]/40 text-[#00F0FF] border border-[#00F0FF]/50' : 'bg-white/5 text-white/30'}`}>
                        Pin
                      </span>
                      <span className="text-white/40">→</span>
                      <span className={`px-3 py-1 rounded transition-colors ${isV2 ? 'bg-emerald-500/40 text-emerald-300 border border-emerald-500/50' : 'bg-white/5 text-white/30'}`}>
                        v2
                      </span>
                    </div>
                  </div>

                </div>

              </div>

              {/* HUMAN CURSOR HAND (Visible cause of every action) */}
              <div
                className="absolute pointer-events-none z-50 transition-transform duration-75"
                style={{
                  left: `${cursorX}px`,
                  top: `${cursorY}px`,
                  transform: `scale(${1 - cursorClickPulse * 0.2})`,
                }}
              >
                <div className="relative">
                  <MousePointer2 className="w-6 h-6 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] fill-white" />
                  {cursorClickPulse > 0.1 && (
                    <span
                      className="absolute -top-1 -left-1 w-8 h-8 rounded-full border-2 border-[#00F0FF] animate-ping"
                    />
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ================================================================ */}
          {/* BEAT 6: End Card (t: 17.2 -> 20.0s)                              */}
          {/* ================================================================ */}
          {t >= 17.2 && (
            <div
              className="relative z-30 flex flex-col items-center justify-center text-center max-w-3xl px-8 transition-all duration-100"
              style={{
                opacity: endCardOpacity,
                transform: `scale(${1.15 - endCardEntrance * 0.15})`,
              }}
            >
              {/* Grand Display Title in font-parabole */}
              <h1 className="font-parabole font-bold text-white tracking-tight leading-none text-7xl sm:text-8xl drop-shadow-[0_0_40px_rgba(225,29,72,0.35)]">
                Duet
              </h1>

              {/* Subtitle in clean tracking */}
              <div className="mt-4 text-base sm:text-lg uppercase tracking-widest text-[#E11D48] font-martin font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
                Review agent work visually
                <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
              </div>

              {/* 4 Core Architectural Capabilities */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 font-martin text-xs text-white/80">
                <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
                  Element-Level DOM Anchoring
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
                  Live SSE Updates
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
                  JSON-Backed SessionStore
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
                  Zero Autonomous Loops
                </span>
              </div>

              {/* Exact Required Footer Notice */}
              <div className="mt-12 text-xs text-white/40 font-martin font-light tracking-wide border-t border-white/10 pt-3">
                HTML is the new markdown.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
