import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LiveProjectButton } from './LiveProjectButton.tsx';
import { calculateCardScale } from '../utils/math.ts';
import { Network, X } from 'lucide-react';
import { ProjectVisualSlot } from './project-visuals/ProjectVisualSlot.tsx';
import { Talk2DataShowreel } from './showreels/Talk2DataShowreel.tsx';
import { SpecExecShowreel } from './showreels/SpecExecShowreel.tsx';
import { DuetShowreel } from './showreels/DuetShowreel.tsx';

gsap.registerPlugin(ScrollTrigger);

export interface AIProjectMetric {
  label: string;
  value: string;
}

export interface AIProjectItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  architectureDetails: string[];
  metrics: AIProjectMetric[];
  col1Image1: string;
  col1Image2: string;
  col2Image: string;
  githubUrl?: string;
}

export const AI_PROJECTS_DATA: AIProjectItem[] = [
  {
    id: '01',
    name: 'Talk2Data',
    category: 'Tool-Calling Data Agents',
    tagline: 'Tool-calling data agents with SELECT-only SQL validation and MCP approval gates.',
    description:
      'Natural language database interface powered by tool-calling agents. Features strict AST-level SQL validation to ensure statements are strictly SELECT-only, combined with Model Context Protocol (MCP) approval gates for secure query execution.',
    architectureDetails: [
      'AST-based SQL query validation strictly enforcing SELECT-only statements',
      'Model Context Protocol (MCP) approval gates for sensitive operations',
      'FastAPI asynchronous microservices integrated with a responsive Next.js frontend',
    ],
    metrics: [
      { label: 'Core Stack', value: 'Python · FastAPI' },
      { label: 'Frontend UI', value: 'Next.js' },
      { label: 'SQL Safety', value: 'SELECT-Only AST' },
      { label: 'Agent Protocol', value: 'MCP Approval Gates' },
    ],
    githubUrl: 'https://github.com/shabeeth2/talk2data-agents',
    col1Image1: 'col1Top',
    col1Image2: 'col1Bottom',
    col2Image: 'col2Main',
  },
  {
    id: '02',
    name: 'SpecExec',
    category: 'Speculative Agent Execution',
    tagline: 'Speculative concurrent read-only tool execution runtime for LLM agents.',
    description:
      'Speculative execution engine that detects complete tool statements while the program is still streaming, concurrently precomputes the eligible read-only calls, then replays the finished program authoritatively. Demonstrated a 51.8% median latency cut on a simulated agent tool execution benchmark without risking side effects.',
    architectureDetails: [
      'Asynchronous execution graph parallelizing predicted read-only tool calls',
      'Python AST analysis classifying tool functions into deterministic read-only operations',
      'Evaluated on simulated tool benchmark achieving 51.8% median latency reduction',
    ],
    metrics: [
      { label: 'Simulated Benchmark', value: '51.8% Latency Cut' },
      { label: 'Runtime Engine', value: 'Python · Asyncio' },
      { label: 'Tool Analysis', value: 'AST Classifier' },
      { label: 'Execution Mode', value: 'Concurrent Read-Only' },
    ],
    col1Image1: 'col1Top',
    col1Image2: 'col1Bottom',
    col2Image: 'col2Main',
  },
  {
    id: '03',
    name: 'Duet',
    category: 'Visual Artifact Review Studio',
    tagline: 'Visual review and element-level annotation tool for human and AI-generated HTML artifacts.',
    description:
      'Dedicated tool for reviewing agent work (human or AI-generated HTML artifacts) visually. Supports element-level click annotations, contextual conversation threads, persistent review sessions, live updates, automated layout checks, and standalone HTML export. Contains no internal agent loops.',
    architectureDetails: [
      'DOM element-level visual annotation overlay with coordinate-anchored comment threads',
      'Persistent JSON-backed review sessions with live SSE updates, built with FastAPI',
      'Automated layout and rendering checks with self-contained bundle export',
    ],
    metrics: [
      { label: 'Tool Scope', value: 'Visual Review Tool' },
      { label: 'Backend Stack', value: 'Python · FastAPI' },
      { label: 'Annotation Engine', value: 'Element-Level DOM' },
      { label: 'Export Format', value: 'Self-Contained HTML' },
    ],
    col1Image1: 'col1Top',
    col1Image2: 'col1Bottom',
    col2Image: 'col2Main',
  },
];

interface ProjectCardProps {
  project: AIProjectItem;
  index: number;
  totalCards: number;
  onOpenProject: (project: AIProjectItem, imageSrc?: string) => void;
  onOpenShowreel?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  totalCards,
  onOpenProject,
  onOpenShowreel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const targetScale = calculateCardScale(index, totalCards);
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  // GSAP ScrollTrigger reveal for each project card
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (cardInnerRef.current) {
        gsap.fromTo(
          cardInnerRef.current,
          {
            opacity: 0,
            y: 40,
            scale: 0.98,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[640px] md:h-[88vh] md:min-h-[680px] flex items-start justify-center w-full"
    >
      <motion.div
        style={{
          scale,
          top: `calc(4.5rem + ${index * 24}px)`,
        }}
        className="sticky w-full max-w-6xl rounded-[36px] sm:rounded-[44px] md:rounded-[50px] border border-white/15 apple-glass-card p-5 sm:p-7 md:p-8 flex flex-col gap-5 shadow-2xl overflow-hidden"
      >
        <div ref={cardInnerRef} className="flex flex-col gap-4 sm:gap-5 w-full">
          {/* Top Row: Identifier, Title, and Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-baseline gap-4 sm:gap-6 flex-wrap">
              <span
                className="font-parabole font-light text-[#D7E2EA]/90 leading-none tracking-tight select-none tabular-nums"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)' }}
              >
                {project.id}
              </span>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-[#E11D48] font-martin font-semibold flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5" />
                  {project.category}
                </span>
                <h3
                  className="font-parabole font-bold text-white leading-tight tracking-tight mt-0.5"
                  style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2.1rem)' }}
                >
                  {project.name}
                </h3>
              </div>
            </div>

            <div className="shrink-0 font-martin flex items-center gap-2.5">
              <LiveProjectButton
                label="Architecture"
                onClick={() => onOpenProject(project, project.col2Image)}
              />
            </div>
          </div>

          {/* Bottom Row: Visual-First Grid (Minimal Architecture + Live Showreel) */}
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
            {/* Left Column (Architecture Schematics) - col-span-5 */}
            <div className="order-2 md:order-1 md:col-span-5 flex flex-col gap-3.5">
              <div
                role="button"
                tabIndex={0}
                onClick={() => onOpenProject(project, 'col1Top')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenProject(project, 'col1Top');
                  }
                }}
                className="relative w-full overflow-hidden rounded-[24px] sm:rounded-[30px] group cursor-pointer border border-white/10 bg-[#141414] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48] transition-all hover:border-white/30"
                style={{ height: 'clamp(130px, 15vw, 190px)' }}
                aria-label={`View ${project.name} system topology`}
              >
                <ProjectVisualSlot projectId={project.id} slot="col1Top" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                  <span className="text-xs uppercase tracking-wider text-white font-martin bg-black/80 px-3 py-1 rounded-full border border-white/20">
                    System Architecture
                  </span>
                </div>
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => onOpenProject(project, 'col1Bottom')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenProject(project, 'col1Bottom');
                  }
                }}
                className="relative w-full overflow-hidden rounded-[24px] sm:rounded-[30px] group cursor-pointer border border-white/10 bg-[#141414] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48] transition-all hover:border-white/30"
                style={{ height: 'clamp(130px, 15vw, 190px)' }}
                aria-label={`View ${project.name} benchmark graph`}
              >
                <ProjectVisualSlot projectId={project.id} slot="col1Bottom" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                  <span className="text-xs uppercase tracking-wider text-white font-martin bg-black/80 px-3 py-1 rounded-full border border-white/20">
                    Execution Benchmark
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column (Live Inline Showreel) - col-span-7 */}
            <div className="order-1 md:order-2 md:col-span-7 flex flex-col justify-center">
              <div className="w-full overflow-hidden rounded-[24px] sm:rounded-[32px] md:rounded-[38px] border border-white/15 bg-[#0C0C0C] shadow-2xl">
                {project.id === '01' ? (
                  <Talk2DataShowreel
                    autoplay={true}
                    loop={true}
                    onClose={onOpenShowreel ? () => onOpenShowreel() : undefined}
                  />
                ) : project.id === '02' ? (
                  <SpecExecShowreel
                    autoplay={true}
                    loop={true}
                    onClose={onOpenShowreel ? () => onOpenShowreel() : undefined}
                  />
                ) : project.id === '03' ? (
                  <DuetShowreel
                    autoplay={true}
                    loop={true}
                    onClose={onOpenShowreel ? () => onOpenShowreel() : undefined}
                  />
                ) : (
                  <ProjectVisualSlot projectId={project.id} slot="col2Main" />
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface ProjectsSectionProps {
  onOpenProject: (project: AIProjectItem, imageSrc?: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onOpenProject }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [activeShowreel, setActiveShowreel] = useState<string | null>(null);

  // Keyboard Escape listener & body scroll lock for showreel modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveShowreel(null);
    };
    if (activeShowreel) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeShowreel]);

  // GSAP ScrollTrigger for section heading reveal
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          {
            opacity: 0,
            y: 45,
            filter: 'blur(8px)',
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="architectures"
      className="relative w-full bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-10 px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-28 pb-32"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Section Heading: "Architectures" in Parabole */}
        <h2
          ref={headingRef}
          className="hero-heading font-parabole font-bold text-center leading-none tracking-tight mb-16 sm:mb-20 md:mb-24 select-none"
          style={{ fontSize: 'clamp(2.6rem, 11vw, 150px)' }}
        >
          Architectures
        </h2>

        {/* 3 Sticky Stacking AI Project Cards */}
        <div className="w-full flex flex-col gap-10">
          {AI_PROJECTS_DATA.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              totalCards={AI_PROJECTS_DATA.length}
              onOpenProject={onOpenProject}
              onOpenShowreel={
                project.id === '01' || project.id === '02' || project.id === '03'
                  ? () => setActiveShowreel(project.id)
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      {/* Full-Screen Showreel Modal Player */}
      <AnimatePresence>
        {activeShowreel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActiveShowreel(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-2xl cursor-pointer"
              aria-hidden="true"
            />

            {/* Modal Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 28, stiffness: 340, bounce: 0 }}
              className="relative w-full max-w-6xl rounded-[28px] sm:rounded-[44px] apple-glass p-3 sm:p-6 md:p-8 shadow-2xl z-10 text-[#D7E2EA] my-auto flex flex-col gap-3 sm:gap-4 max-h-[96vh] overflow-y-auto font-martin"
              role="dialog"
              aria-modal="true"
              aria-label={
                activeShowreel === '03'
                  ? "Duet showreel"
                  : activeShowreel === '02'
                  ? "SpecExec showreel"
                  : "Talk2Data showreel"
              }
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2.5 sm:pb-3">
                <div className="flex items-baseline gap-2.5 sm:gap-3">
                  <span className="font-parabole font-light text-xl sm:text-3xl text-[#BBCCD7]">
                    {activeShowreel}
                  </span>
                  <div>
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#E11D48] font-bold">
                      Continuous Take · Motion Showreel
                    </span>
                    <h3 className="font-parabole text-base sm:text-xl text-white font-bold leading-tight">
                      {activeShowreel === '03'
                        ? 'Duet · Visual Artifact Review Studio'
                        : activeShowreel === '02'
                        ? 'SpecExec · Speculative Tool Execution Runtime'
                        : 'Talk2Data · Tool-Calling Data Agents'}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveShowreel(null)}
                  className="p-1.5 sm:p-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48]"
                  aria-label="Close showreel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Showreel Film Container */}
              <div className="w-full flex justify-center items-center">
                {activeShowreel === '03' ? (
                  <DuetShowreel
                    autoplay={true}
                    loop={true}
                    onClose={() => setActiveShowreel(null)}
                  />
                ) : activeShowreel === '02' ? (
                  <SpecExecShowreel
                    autoplay={true}
                    loop={true}
                    onClose={() => setActiveShowreel(null)}
                  />
                ) : (
                  <Talk2DataShowreel
                    autoplay={true}
                    loop={true}
                    onClose={() => setActiveShowreel(null)}
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
