import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Minimize2, Trash2, ArrowUpRight, Bot, User, CornerDownLeft, X } from 'lucide-react';
import { BorderBeam } from 'border-beam';
import { askPortfolioAI, findProjectById, ChatMessage, ChatAction } from '../utils/portfolioKnowledge.ts';
import { AIProjectItem } from './ProjectsSection.tsx';

interface HeroAiChatProps {
  onOpenContact: () => void;
  onOpenProject?: (project: AIProjectItem) => void;
}

const DEFAULT_SUGGESTIONS = [
  'What is SpecExec?',
  'Talk2Data SQL safety',
  'TCS AI Engineer role',
  'Consult with Shabeeth',
];

export const HeroAiChat: React.FC<HeroAiChatProps> = ({ onOpenContact, onOpenProject }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Scoped ref for the messages container (NEVER scrolls the window)
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ONLY inside the messages container, never the window
  useEffect(() => {
    if (isExpanded && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping, isExpanded]);

  // Handle outside click to minimize smoothly
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
        if (messages.length === 0) {
          setIsExpanded(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [messages.length]);

  const handleActionClick = (action: ChatAction) => {
    if (action.type === 'open_contact') {
      onOpenContact();
    } else if (action.type === 'open_project' && action.projectId && onOpenProject) {
      const project = findProjectById(action.projectId);
      if (project) {
        onOpenProject(project);
      }
    } else if (action.type === 'scroll_section' && action.payload) {
      const el = document.getElementById(action.payload);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action.type === 'ask_query' && action.payload) {
      handleSendMessage(action.payload);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputValue).trim();
    if (!text || isTyping) return;

    // Expand window immediately on submit without shifting layout
    if (!isExpanded) {
      setIsExpanded(true);
    }

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      // Query the server-side Gemini 3.8 Flash model or rich local engine
      const res = await askPortfolioAI(text, updatedMessages);
      
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        tags: res.tags,
        actions: res.actions,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: "I encountered a brief connection issue. Mohamed Shabeeth is an AI Engineer at TCS specializing in Agentic RAG, AST-verified SQL tool-calling (Talk2Data), and Speculative Execution (SpecExec, 51.8% latency reduction). Feel free to inspect his projects or connect for consulting.",
        actions: [
          { label: 'Inspect SpecExec', type: 'open_project', projectId: '02' },
          { label: 'Inspect Talk2Data', type: 'open_project', projectId: '01' },
          { label: 'Consult With Me', type: 'open_contact' },
        ],
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === 'Escape' && isExpanded) {
      setIsExpanded(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMessages([]);
    setIsTyping(false);
    setIsExpanded(false);
  };

  return (
    <div
      ref={chatContainerRef}
      className={`relative z-30 pointer-events-auto transition-all duration-300 flex flex-col items-center mx-auto ${
        isExpanded
          ? 'w-[calc(100vw-28px)] max-w-[480px] sm:max-w-[540px] md:max-w-[580px]'
          : 'w-[calc(100vw-36px)] max-w-[340px] sm:max-w-[400px] md:max-w-[460px]'
      }`}
      style={{
        transformOrigin: 'center center',
      }}
    >
      <div className="relative w-full">
        <AnimatePresence initial={false} mode="sync">
          {/* EXPANDED CHAT CARD */}
          {isExpanded ? (
            <motion.div
              key="expanded-chat"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full flex flex-col rounded-2xl overflow-hidden apple-glass font-martin shadow-[0_24px_70px_rgba(0,0,0,0.9),0_0_30px_rgba(255,255,255,0.04)]"
              style={{
                maxHeight: 'min(70vh, 500px)',
              }}
            >
              {/* Glass specular ambient shine */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

              {/* Chat Header */}
              <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 border border-white/20">
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-white">
                        AI Architecture Copilot
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.08] text-zinc-300 border border-white/[0.08] font-mono">
                        Gemini 3.8
                      </span>
                    </div>
                    <p className="text-[11px] text-[#D7E2EA]/60 leading-none mt-0.5">
                      SpecExec, Talk2Data, Agentic RAG & TCS Award
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClear}
                      title="Clear conversation"
                      className="p-1.5 rounded-lg text-[#D7E2EA]/60 hover:text-rose-400 hover:bg-white/[0.06] transition-colors cursor-pointer apple-press"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    title="Minimize chat"
                    className="p-1.5 rounded-lg text-[#D7E2EA]/60 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer apple-press"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages Scroll Area - Scoped internally to messagesContainerRef */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto px-3.5 sm:px-4 py-3 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 text-left font-martin"
              >
                {messages.length === 0 ? (
                  <div className="py-3 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 mb-2 text-white">
                      <Bot className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-white font-medium">
                      Ask about Mohamed Shabeeth&apos;s AI engineering
                    </p>
                    <p className="text-[11px] text-[#D7E2EA]/50 mt-1 max-w-sm mx-auto leading-relaxed">
                      Explore live architectures, benchmark statistics, tool-calling pipelines, or connect for consulting.
                    </p>

                    <div className="flex flex-wrap gap-1.5 justify-center mt-3 max-w-md mx-auto">
                      {DEFAULT_SUGGESTIONS.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleSendMessage(item)}
                          className="text-[11px] px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/25 text-[#D7E2EA]/90 hover:text-white transition-all text-left flex items-center gap-1 group cursor-pointer apple-press"
                        >
                          <span>{item}</span>
                          <ArrowUpRight className="w-3 h-3 text-white/60 group-hover:text-white transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.sender === 'assistant' && (
                          <div className="w-6 h-6 rounded-md bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}

                        <div
                          className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-white/15 border border-white/25 text-white rounded-br-xs'
                              : 'bg-white/[0.06] border border-white/[0.12] text-[#E0E9F0] rounded-bl-xs backdrop-blur-md'
                          }`}
                        >
                          <div className="whitespace-pre-wrap space-y-1.5">
                            {msg.text.split('\n').map((line, idx) => {
                              const parts = line.split(/(\*\*.*?\*\*)/g);
                              return (
                                <p key={idx} className={line.startsWith('•') ? 'pl-2 text-[#D7E2EA]/90' : ''}>
                                  {parts.map((p, pIdx) => {
                                    if (p.startsWith('**') && p.endsWith('**')) {
                                      return (
                                        <strong key={pIdx} className="text-white font-semibold">
                                          {p.slice(2, -2)}
                                        </strong>
                                      );
                                    }
                                    return <span key={pIdx}>{p}</span>;
                                  })}
                                </p>
                              );
                            })}
                          </div>

                          {/* Tags */}
                          {msg.tags && msg.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-white/[0.06]">
                              {msg.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-zinc-300 font-mono"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Deep Interactive Actions */}
                          {msg.actions && msg.actions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-white/[0.06]">
                              {msg.actions.map((act, actIdx) => (
                                <button
                                  key={actIdx}
                                  type="button"
                                  onClick={() => handleActionClick(act)}
                                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white transition-all cursor-pointer shadow-xs"
                                >
                                  <span>{act.label}</span>
                                  <ArrowUpRight className="w-3 h-3 text-white/70" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {msg.sender === 'user' && (
                          <div className="w-6 h-6 rounded-md bg-white/[0.1] border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                            <User className="w-3.5 h-3.5 text-white/90" />
                          </div>
                        )}
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex gap-2.5 items-center">
                        <div className="w-6 h-6 rounded-md bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                          <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
                        </div>
                        <div className="bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"
                            style={{ animationDelay: '150ms' }}
                          />
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"
                            style={{ animationDelay: '300ms' }}
                          />
                          <span className="text-[10px] text-[#D7E2EA]/60 font-mono ml-1">
                            Analyzing engineering architecture...
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Quick Prompt Pill Scroller (if messages exist) */}
              {messages.length > 0 && (
                <div className="px-3 py-1.5 border-t border-white/[0.06] bg-white/[0.01] flex items-center gap-1.5 overflow-x-auto scrollbar-none font-martin">
                  <span className="text-[10px] text-[#D7E2EA]/40 shrink-0 font-mono uppercase">Quick:</span>
                  {DEFAULT_SUGGESTIONS.slice(0, 3).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleSendMessage(item)}
                      className="text-[10px] whitespace-nowrap px-2 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#D7E2EA]/80 hover:text-white border border-white/[0.06] transition-colors shrink-0 cursor-pointer"
                    >
                      {item.length > 28 ? item.slice(0, 28) + '...' : item}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Bar */}
              <div className="p-2 sm:p-2.5 border-t border-white/[0.08] bg-black/60 font-martin">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask about SpecExec, Talk2Data, Agentic RAG, TCS award..."
                      className="w-full bg-white/[0.06] hover:bg-white/[0.09] focus:bg-white/[0.12] border border-white/[0.12] focus:border-white/40 rounded-xl px-3 py-1.5 sm:py-2 text-xs text-white placeholder-[#D7E2EA]/40 outline-hidden transition-all focus:ring-1 focus:ring-white/20 font-martin"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="p-2 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_2px_12px_rgba(255,255,255,0.2)] cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-black" />
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            /* IDLE COMPACT LIQUID GLASS CAPSULE */
            <motion.div
              key="compact-capsule"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-2 w-full font-martin"
            >
              {/* Main Liquid Glass Input Pill with Monochrome BorderBeam */}
              <BorderBeam
                size="md"
                colorVariant="mono"
                strength={0.6}
                theme="dark"
                className="w-full"
              >
                <div
                  onClick={() => {
                    setIsExpanded(true);
                    setTimeout(() => {
                      inputRef.current?.focus({ preventScroll: true });
                    }, 60);
                  }}
                  className="group w-full flex items-center gap-2.5 px-4 py-2.5 sm:py-3 rounded-full backdrop-blur-2xl bg-[#121216]/90 hover:bg-[#18181f]/95 border border-white/[0.16] hover:border-white/40 shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_24px_rgba(255,255,255,0.05),inset_0_1px_1px_rgba(255,255,255,0.25)] transition-all cursor-text relative overflow-hidden apple-press"
                >
                  {/* Specular sheen line */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                  {/* AI Sparkle Icon with clean monochrome glass styling */}
                  <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 border border-white/20 shrink-0 group-hover:scale-105 transition-transform text-white">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[11px] sm:text-xs text-[#D7E2EA]/75 group-hover:text-white truncate select-none transition-colors">
                      Ask AI about Shabeeth&apos;s architectures & work...
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="hidden md:inline-flex items-center gap-1 text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-white/[0.06] text-[#D7E2EA]/60 border border-white/[0.08]">
                      Ask AI
                      <CornerDownLeft className="w-2.5 h-2.5" />
                    </span>
                    <div className="p-1 sm:p-1.5 rounded-full bg-white/[0.08] group-hover:bg-white group-hover:text-black text-[#D7E2EA]/80 transition-all">
                      <Send className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </div>
                  </div>
                </div>
              </BorderBeam>

              {/* Minimal quick suggestion chips */}
              <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto max-w-full justify-center pt-0.5">
                {[
                  { text: 'SpecExec 51.8% Latency', query: 'Tell me about SpecExec latency benchmark' },
                  { text: 'Talk2Data SQL Agent', query: 'How does Talk2Data validate SQL with AST?' },
                  { text: 'TCS AI Innovator', query: 'What is the TCS AI Fridays Innovator Award?' },
                ].map((chip) => (
                  <button
                    key={chip.text}
                    type="button"
                    onClick={() => {
                      setIsExpanded(true);
                      handleSendMessage(chip.query);
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-full backdrop-blur-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/25 text-[#D7E2EA]/70 hover:text-white transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0 apple-press"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                    <span>{chip.text}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
