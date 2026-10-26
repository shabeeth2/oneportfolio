import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Copy, Send, Mail } from 'lucide-react';
import { ContactButton } from './ContactButton.tsx';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('Agentic RAG & Hybrid Retrieval');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitted(true);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('mohamed.shabeeth@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setSubmitted(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
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

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: "spring", damping: 28, stiffness: 340, bounce: 0 }}
            className="relative w-full max-w-xl rounded-[32px] sm:rounded-[38px] apple-glass p-6 sm:p-10 shadow-2xl z-10 text-[#D7E2EA] my-auto font-martin"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-colors cursor-pointer apple-press"
              aria-label="Close contact modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!submitted ? (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#E11D48] font-martin">
                  Engineering Consultation
                </span>
                <h3
                  id="contact-modal-title"
                  className="hero-heading font-parabole font-bold text-2xl sm:text-3xl mt-1 mb-2 tracking-tight"
                >
                  Consult With Mohamed Shabeeth N
                </h3>
                <p className="text-sm text-[#D7E2EA]/75 mb-6 font-normal leading-relaxed">
                  Seeking production agentic RAG architectures, MCP tool-calling workflows, or FastAPI AI backend services? Inquire below or reach out directly.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#D7E2EA]/60 mb-1.5 font-medium">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Miller"
                      className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-[#D7E2EA] placeholder-white/20 focus:outline-none focus:border-[#E11D48] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#D7E2EA]/60 mb-1.5 font-medium">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@enterprise.ai"
                      className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-[#D7E2EA] placeholder-white/20 focus:outline-none focus:border-[#E11D48] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#D7E2EA]/60 mb-1.5 font-medium">
                      Primary AI Engineering Focus
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-[#D7E2EA] focus:outline-none focus:border-[#E11D48] transition-colors cursor-pointer"
                    >
                      <option value="Agentic RAG & Hybrid Retrieval">Agentic RAG & Hybrid Retrieval</option>
                      <option value="LLM Agents & Tool Calling (MCP)">LLM Agents & Tool Calling (MCP)</option>
                      <option value="Backend AI APIs (FastAPI & PostgreSQL)">Backend AI APIs (FastAPI & PostgreSQL)</option>
                      <option value="LLM Evaluation, Prompts & Guardrails">LLM Evaluation, Prompts & Guardrails</option>
                      <option value="Full-Stack AI Integration (Next.js)">Full-Stack AI Integration (Next.js)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#D7E2EA]/60 mb-1.5 font-medium">
                      Project Goals & Scope
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your retrieval pipeline, tool integration goals, target latency, or system requirements..."
                      className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl px-4 py-3 text-sm text-[#D7E2EA] placeholder-white/20 focus:outline-none focus:border-[#E11D48] transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full text-white font-medium uppercase tracking-widest cursor-pointer px-8 py-3 text-xs sm:text-sm select-none"
                      style={{
                        background:
                          'linear-gradient(123deg, #1C0508 7%, #E11D48 37%, #BE123C 68%, #D97706 100%)',
                        boxShadow:
                          '0px 4px 14px rgba(225, 29, 72, 0.35), inset 2px 2px 10px rgba(190, 18, 60, 0.7)',
                        outline: '2px solid white',
                        outlineOffset: '-3px',
                      }}
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Inquiry</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="text-xs text-[#D7E2EA]/70 hover:text-white flex items-center gap-1.5 py-2 px-3 rounded-lg border border-white/5 hover:border-white/20 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied Email!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy mohamed.shabeeth@gmail.com</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="hero-heading font-black uppercase text-2xl sm:text-3xl tracking-tight mb-2">
                  Message Dispatched!
                </h3>
                <p className="text-sm text-[#D7E2EA]/80 max-w-md mb-6 font-light">
                  Thank you, <span className="font-semibold text-white">{name}</span>. Your inquiry regarding{' '}
                  <span className="font-semibold text-white">{service}</span> has been queued. Mohamed Shabeeth N will review your brief promptly.
                </p>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-full border border-white/20 text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
                  >
                    Send Another
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-full bg-white text-[#0C0C0C] font-semibold text-xs uppercase tracking-widest hover:bg-white/90 transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
