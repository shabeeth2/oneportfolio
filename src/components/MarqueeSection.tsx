import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, ArrowUpRight, Sparkles, ExternalLink } from 'lucide-react';
import { AI_PROJECTS_DATA, AIProjectItem } from './ProjectsSection.tsx';
import { Talk2DataShowreel } from './showreels/Talk2DataShowreel.tsx';
import { SpecExecShowreel } from './showreels/SpecExecShowreel.tsx';
import { DuetShowreel } from './showreels/DuetShowreel.tsx';

interface MarqueeSectionProps {
  onOpenProject: (project: AIProjectItem, imageSrc?: string) => void;
}

export const MarqueeSection: React.FC<MarqueeSectionProps> = ({ onOpenProject }) => {
  const [activeTab, setActiveTab] = useState<'01' | '02' | '03'>('01');

  const currentProject = AI_PROJECTS_DATA.find((p) => p.id === activeTab) || AI_PROJECTS_DATA[0];

  return (
    <section
      id="showreel"
      className="relative w-full bg-[#0C0C0C] pt-20 sm:pt-28 md:pt-36 pb-16 px-4 sm:px-6 md:px-10 overflow-hidden select-none font-martin text-white"
      aria-label="Systems in Motion · Continuous Take Showreels"
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Header Kicker & Headline */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#E11D48] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Continuous-Take Motion Showreels</span>
          </div>
          <h2
            className="font-parabole font-bold text-white text-center leading-none tracking-tight"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 4rem)' }}
          >
            Systems in Motion
          </h2>
          <p className="text-xs sm:text-sm text-[#D7E2EA]/60 max-w-xl mx-auto mt-3">
            Pure deterministic motion captures illustrating complete agent execution loops.
          </p>

          {/* Interactive Project Switcher Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 p-1.5 rounded-full bg-white/[0.04] border border-white/10 mt-6 backdrop-blur-md">
            {AI_PROJECTS_DATA.map((proj) => {
              const isActive = activeTab === proj.id;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => setActiveTab(proj.id as '01' | '02' | '03')}
                  className={`relative px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'text-white bg-white/15 border border-white/30 shadow-[0_0_20px_rgba(225,29,72,0.3)]'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                  aria-pressed={isActive}
                >
                  <span className="text-[10px] font-mono text-[#00F0FF] tabular-nums">{proj.id}</span>
                  <span>{proj.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Cinema Showreel Stage */}
        <div className="w-full relative rounded-[28px] sm:rounded-[38px] md:rounded-[44px] border border-white/15 bg-[#101014] p-3 sm:p-5 md:p-6 shadow-2xl overflow-hidden flex flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full flex flex-col items-center justify-center"
            >
              {activeTab === '01' ? (
                <Talk2DataShowreel autoplay={true} loop={true} />
              ) : activeTab === '02' ? (
                <SpecExecShowreel autoplay={true} loop={true} />
              ) : (
                <DuetShowreel autoplay={true} loop={true} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Minimal Project Info Strip */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10 px-2 sm:px-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-[#E11D48] font-bold flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5" />
                {currentProject.category}
              </span>
              <span className="text-white/20">·</span>
              <span className="text-white/70 truncate max-w-md">
                {currentProject.tagline}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {currentProject.githubUrl && (
                <a
                  href={currentProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white/80 hover:text-white transition-all flex items-center gap-1.5 text-xs"
                >
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 text-[#00F0FF]" />
                </a>
              )}
              <button
                type="button"
                onClick={() => onOpenProject(currentProject, currentProject.col2Image)}
                className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <span>Architecture</span>
                <ArrowUpRight className="w-3 h-3 text-[#00F0FF]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
