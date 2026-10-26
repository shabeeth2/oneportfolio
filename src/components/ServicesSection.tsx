import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ServiceItem {
  id: string;
  name: string;
  description: string;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: '01',
    name: 'LLM Applications & Evaluation',
    description:
      'Developing production GenAI applications with structured prompt engineering, deterministic guardrails, structured JSON outputs, and automated evaluation frameworks.',
  },
  {
    id: '02',
    name: 'Agentic Workflows & Tool Calling',
    description:
      'Architecting autonomous agents with Model Context Protocol (MCP) approval gates, tool schema validation, dynamic execution routing, and human-in-the-loop controls.',
  },
  {
    id: '03',
    name: 'RAG & Retrieval Systems',
    description:
      'Implementing production retrieval-augmented generation using Azure AI Search, dense vector indexing, hybrid keyword search, and Redis caching for grounded responses.',
  },
  {
    id: '04',
    name: 'Backend APIs & Data Layer',
    description:
      'Building robust, high-concurrency microservices with Python, FastAPI, PostgreSQL, Redis, and Java/Spring Boot for reliable and low-latency system integration.',
  },
  {
    id: '05',
    name: 'Full-Stack AI Integration',
    description:
      'Delivering end-to-end web applications with Next.js, GitHub Actions CI/CD automation, Linux environments, and Grafana monitoring for continuous observability.',
  },
];

export const ServicesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          {
            opacity: 0,
            y: 50,
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

      // Staggered reveal for service rows
      const rows = listRef.current?.querySelectorAll('.gsap-service-row');
      if (rows && rows.length > 0) {
        gsap.fromTo(
          rows,
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: listRef.current,
              start: 'top 80%',
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
      id="capabilities"
      className="relative w-full bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 z-0"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        {/* Section Heading in Parabole */}
        <h2
          ref={headingRef}
          className="text-[#0C0C0C] font-parabole font-bold text-center leading-none tracking-tight mb-16 sm:mb-20 md:mb-28 select-none"
          style={{ fontSize: 'clamp(2.8rem, 11vw, 150px)' }}
        >
          Capabilities
        </h2>

        {/* Vertical List of 5 Items */}
        <div ref={listRef} className="w-full flex flex-col border-t border-[rgba(12,12,12,0.12)]">
          {SERVICES_DATA.map((service) => (
            <div
              key={service.id}
              className="gsap-service-row w-full flex flex-col md:flex-row items-start md:items-center justify-between py-8 sm:py-10 md:py-12 border-b border-[rgba(12,12,12,0.12)] gap-4 md:gap-8 group transition-colors duration-200 hover:bg-black/[0.02] px-2 rounded-2xl"
            >
              {/* Left: Number in Parabole */}
              <span
                className="font-parabole font-light text-[#0C0C0C]/75 leading-none shrink-0 tracking-tight tabular-nums select-none"
                style={{ fontSize: 'clamp(2.8rem, 8vw, 110px)' }}
              >
                {service.id}
              </span>

              {/* Right: Stacked Name + Description */}
              <div className="flex flex-col flex-1 gap-2 md:gap-3">
                <h3
                  className="font-parabole font-bold text-[#0C0C0C] leading-tight tracking-tight"
                  style={{ fontSize: 'clamp(1.15rem, 2.3vw, 1.95rem)' }}
                >
                  {service.name}
                </h3>
                <p
                  className="font-martin text-[#0C0C0C]/75 leading-relaxed max-w-2xl text-xs sm:text-sm md:text-base tracking-normal"
                >
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
