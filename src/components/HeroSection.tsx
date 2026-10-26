import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { BotConvoy } from './BotConvoy.tsx';
import { ContactButton } from './ContactButton.tsx';
import { HeroAiChat } from './HeroAiChat.tsx';
import { AIProjectItem } from './ProjectsSection.tsx';

interface HeroSectionProps {
  onOpenContact: () => void;
  onOpenProject?: (project: AIProjectItem) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenContact, onOpenProject }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (targetId === 'contact') {
      onOpenContact();
      return;
    }
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nameContainerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLSpanElement>(null);

  // GSAP out-of-frame reveal animation with staggered character entrance & gradient metallic sheen
  useEffect(() => {
    const ctx = gsap.context(() => {
      // "Hi, I am" in Martin Mono sliding upward into frame
      if (introRef.current) {
        gsap.fromTo(
          introRef.current,
          {
            yPercent: 130,
            opacity: 0,
            filter: 'blur(8px)',
          },
          {
            yPercent: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.95,
            ease: 'power3.out',
            delay: 0.1,
          }
        );
      }

      // "SHABEETH" individual characters revealing out of frame with stagger
      gsap.fromTo(
        '.hero-char',
        {
          yPercent: 140,
          opacity: 0,
          rotateX: 45,
          scale: 0.94,
          filter: 'blur(10px)',
        },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.1,
          stagger: 0.05,
          ease: 'power4.out',
          delay: 0.2,
        }
      );
    }, nameContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[680px] flex flex-col justify-between overflow-hidden bg-[#0C0C0C]">
      {/* 1. Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 350, bounce: 0 }}
        className="relative w-full px-5 sm:px-6 md:px-10 pt-5 md:pt-8 z-30"
        aria-label="Main Navigation"
      >
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between w-full font-martin">
          <a
            href="#about"
            onClick={(e) => handleNavClick(e, 'about')}
            className="text-[#D7E2EA] font-semibold uppercase tracking-wider text-sm lg:text-base transition-all duration-150 hover:text-white apple-press"
          >
            About
          </a>
          <a
            href="#capabilities"
            onClick={(e) => handleNavClick(e, 'capabilities')}
            className="text-[#D7E2EA] font-semibold uppercase tracking-wider text-sm lg:text-base transition-all duration-150 hover:text-white apple-press"
          >
            Capabilities
          </a>
          <a
            href="#architectures"
            onClick={(e) => handleNavClick(e, 'architectures')}
            className="text-[#D7E2EA] font-semibold uppercase tracking-wider text-sm lg:text-base transition-all duration-150 hover:text-white apple-press"
          >
            Architectures
          </a>
          <button
            type="button"
            onClick={onOpenContact}
            className="text-[#D7E2EA] font-semibold uppercase tracking-wider text-sm lg:text-base transition-all duration-150 hover:text-white bg-transparent border-0 cursor-pointer apple-press"
          >
            Contact
          </button>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-between w-full font-martin">
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group text-decoration-none apple-press"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />
            <span className="font-extrabold tracking-wider uppercase text-base text-white">SHABEETH</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-white tracking-wider border border-white/10">
              AI
            </span>
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenContact}
              className="text-xs uppercase tracking-wider font-semibold px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-[#D7E2EA] apple-press cursor-pointer"
            >
              Contact
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-[#D7E2EA] hover:text-white apple-press cursor-pointer flex items-center justify-center"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", damping: 28, stiffness: 340, bounce: 0 }}
              className="absolute top-full left-4 right-4 mt-2 p-4 apple-glass rounded-2xl z-50 flex flex-col gap-1.5 md:hidden font-martin"
            >
              <a
                href="#about"
                onClick={(e) => {
                  handleNavClick(e, 'about');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider text-[#D7E2EA] hover:bg-white/10 apple-press transition-colors"
              >
                <span>About</span>
                <ArrowRight size={16} className="text-white/40" />
              </a>
              <a
                href="#capabilities"
                onClick={(e) => {
                  handleNavClick(e, 'capabilities');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider text-[#D7E2EA] hover:bg-white/10 apple-press transition-colors"
              >
                <span>Capabilities</span>
                <ArrowRight size={16} className="text-white/40" />
              </a>
              <a
                href="#architectures"
                onClick={(e) => {
                  handleNavClick(e, 'architectures');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider text-[#D7E2EA] hover:bg-white/10 apple-press transition-colors"
              >
                <span>Architectures</span>
                <ArrowRight size={16} className="text-white/40" />
              </a>
              <div className="pt-2 mt-1 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    onOpenContact();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-center uppercase tracking-wider flex items-center justify-center gap-2 apple-press cursor-pointer"
                >
                  <Sparkles size={16} />
                  <span>Consult With Me</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* 2. Centralized Hero Stage: Name Placed Above Chatbox + Circling Wiggling Avatars + Minimal Central Chatbox */}
      <div className="relative flex-1 w-full flex flex-col items-center justify-center px-4 my-auto z-20">
        {/* Name Out of Frame Reveal with Opalescent Metallic Gradient Animation */}
        <div
          ref={nameContainerRef}
          className="pb-2 sm:pb-3 mb-8 sm:mb-9 md:mb-10 text-center select-none pointer-events-none"
          style={{ perspective: 1200 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-4 md:gap-5 leading-none">
            {/* "Hi, I am" in Martin Mono - masked out of frame */}
            <div className="overflow-hidden py-1">
              <span
                ref={introRef}
                className="inline-block font-martin uppercase tracking-widest text-zinc-400 font-semibold text-[3.8vw] sm:text-[2.6vw] md:text-[2vw] lg:text-[1.6vw] sm:mb-1 will-change-transform"
              >
                Hi, I am
              </span>
            </div>

            {/* "SHABEETH" in Parabole - Staggered character reveal from out of frame with metallic gradient */}
            <div className="flex items-center overflow-hidden py-1">
              {'SHABEETH'.split('').map((char, index) => (
                <div key={index} className="overflow-hidden inline-block">
                  <span
                    className="hero-char inline-block font-parabole font-black uppercase tracking-tight text-[11.5vw] sm:text-[9.5vw] md:text-[8.5vw] lg:text-[7.5vw] gradient-reveal-name leading-none will-change-transform"
                  >
                    {char}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Central Stage Anchor for Chatbox & Orbiting Bots */}
        <div className="relative flex flex-col items-center justify-center w-full max-w-[580px]">
          {/* Orbiting Wiggling Avatars circling directly around the chatbox */}
          <BotConvoy />

          {/* Centralized Minimal Monochromatic Chatbox */}
          <HeroAiChat onOpenContact={onOpenContact} onOpenProject={onOpenProject} />
        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="w-full flex justify-between items-end px-5 sm:px-6 md:px-10 pb-5 sm:pb-6 md:pb-8 z-20 pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300, bounce: 0, delay: 0.25 }}
          className="pointer-events-auto text-[#D7E2EA]/90 font-martin font-normal uppercase tracking-wide leading-snug max-w-[170px] sm:max-w-[260px] md:max-w-[340px]"
          style={{ fontSize: 'clamp(0.72rem, 1.15vw, 1.1rem)' }}
        >
          an ai engineer building production agentic rag applications, tool-calling systems & llm solutions
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300, bounce: 0, delay: 0.35 }}
          className="pointer-events-auto"
        >
          <ContactButton onClick={onOpenContact} label="Consult With Me" />
        </motion.div>
      </div>
    </section>
  );
};

