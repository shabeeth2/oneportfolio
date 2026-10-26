/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from './components/HeroSection.tsx';
import { MarqueeSection } from './components/MarqueeSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { ProjectsSection, AIProjectItem } from './components/ProjectsSection.tsx';
import { ContactModal } from './components/ContactModal.tsx';
import { ArchitectureModal } from './components/ArchitectureModal.tsx';
import { FooterSection } from './components/FooterSection.tsx';

// Robust Error Boundary to guarantee no white screen crash can ever occur
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-screen bg-[#0C0C0C] text-[#D7E2EA] flex flex-col items-center justify-center p-6 text-center font-mono">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-4 text-rose-400">
            !
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Portfolio Recovery Mode</h2>
          <p className="text-xs text-white/60 max-w-md mb-6 leading-relaxed">
            An unexpected render boundary was caught. Click below to refresh the interactive studio canvas.
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-6 py-2.5 rounded-full bg-[#E11D48] text-white text-xs uppercase font-bold tracking-wider hover:bg-[#E11D48]/80 transition-colors cursor-pointer"
          >
            Reload Portfolio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<AIProjectItem | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    // Graceful startup timer to ensure fonts, assets, and 3D bot avatars hydrate without flickering
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenContact = () => {
    setIsContactOpen(true);
  };

  const handleCloseContact = () => {
    setIsContactOpen(false);
  };

  const handleOpenProject = (project: AIProjectItem, imageSrc?: string) => {
    setSelectedProject(project);
    setActiveImage(imageSrc || project.col2Image);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
    setActiveImage(null);
  };

  return (
    <ErrorBoundary>
      <div
        className="relative w-full min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#E11D48] selection:text-white"
        style={{ overflowX: 'clip' }}
      >
        {/* Animated Loading Screen */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="loading-screen"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0C0C0C] text-[#D7E2EA] font-mono pointer-events-none select-none"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-radial from-[#E11D48] to-transparent opacity-80 animate-pulse" />
                <div className="absolute inset-0 border-2 border-rose-500/30 border-t-[#F59E0B] rounded-full animate-spin" />
              </div>
              <div className="mt-6 text-sm font-bold tracking-widest uppercase text-white font-parabole">
                SHABEETH
              </div>
              <div className="mt-1.5 text-[11px] text-[#D7E2EA]/60 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                AI Engineer · Loading Systems
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="w-full flex flex-col" style={{ overflowX: 'clip' }}>
          {/* 1. HeroSection */}
          <HeroSection onOpenContact={handleOpenContact} onOpenProject={handleOpenProject} />

          {/* 2. MarqueeSection (Below-Hero Continuous Showreels) */}
          <MarqueeSection onOpenProject={handleOpenProject} />

          {/* 3. AboutSection */}
          <AboutSection onOpenContact={handleOpenContact} />

          {/* 4. ServicesSection (Capabilities) */}
          <ServicesSection />

          {/* 5. ProjectsSection (Architectures) */}
          <ProjectsSection onOpenProject={handleOpenProject} />

          {/* Footer */}
          <FooterSection onOpenContact={handleOpenContact} />
        </main>

        {/* Modals & Dialogs */}
        <ContactModal
          isOpen={isContactOpen}
          onClose={handleCloseContact}
        />

        <ArchitectureModal
          isOpen={!!selectedProject}
          project={selectedProject}
          activeImage={activeImage}
          onClose={handleCloseProject}
          onOpenContact={handleOpenContact}
        />
      </div>
    </ErrorBoundary>
  );
}
