import React from 'react';
import { ArrowUp, Mail, Github, Linkedin, Twitter, Network, Terminal } from 'lucide-react';

interface FooterSectionProps {
  onOpenContact: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onOpenContact }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-[#0C0C0C] border-t border-white/10 px-6 md:px-12 py-12 sm:py-16 text-[#D7E2EA] z-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Column: Brand & Title */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <span className="hero-heading font-parabole font-bold text-2xl sm:text-3xl tracking-tight">
            Mohamed Shabeeth N
          </span>
          <span className="text-xs uppercase tracking-wider text-[#E11D48] font-martin font-semibold mt-1 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            AI Engineer (GenAI / LLM applications) · Chennai, India
          </span>
          <p className="text-xs text-[#D7E2EA]/70 mt-3 max-w-sm font-martin font-normal leading-relaxed">
            Building production agentic RAG applications, MCP tool-calling workflows, and resilient backend AI microservices.
          </p>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex items-center gap-6 sm:gap-8 text-xs sm:text-sm uppercase tracking-wider font-martin font-semibold">
          <a
            href="#about"
            className="hover:text-white transition-colors apple-press"
          >
            About
          </a>
          <a
            href="#capabilities"
            className="hover:text-white transition-colors apple-press"
          >
            Capabilities
          </a>
          <a
            href="#architectures"
            className="hover:text-white transition-colors apple-press"
          >
            Architectures
          </a>
          <button
            type="button"
            onClick={onOpenContact}
            className="hover:text-white transition-colors bg-transparent border-0 cursor-pointer uppercase font-semibold text-xs sm:text-sm text-[#D7E2EA] apple-press"
          >
            Contact
          </button>
        </div>

        {/* Right Column: Social Links & Back to Top */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/shabeeth2"
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-full border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-colors flex items-center justify-center cursor-pointer apple-press"
            aria-label="GitHub Profile of Mohamed Shabeeth"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com/in/shabeeth"
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-full border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-colors flex items-center justify-center cursor-pointer apple-press"
            aria-label="LinkedIn Profile of Mohamed Shabeeth"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="mailto:mohamed.shabeeth@gmail.com"
            className="p-3 rounded-full border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-colors flex items-center justify-center cursor-pointer apple-press"
            aria-label="Send email to Mohamed Shabeeth"
          >
            <Mail className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={scrollToTop}
            className="p-3 rounded-full border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-colors flex items-center justify-center cursor-pointer group ml-1 apple-press"
            aria-label="Scroll to top of page"
          >
            <ArrowUp className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#D7E2EA]/40 uppercase tracking-wider font-martin font-normal">
        <span>© {new Date().getFullYear()} Mohamed Shabeeth N · AI Engineer (GenAI / LLM applications)</span>
        <span>Chennai, India · Open-Source Contributor</span>
      </div>
    </footer>
  );
};
