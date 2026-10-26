import React, { useEffect, useRef, useState } from 'react';
import { BotAvatar, BotAvatarState, BotAvatarType } from 'bot-avatars';

interface BotConfig {
  type: BotAvatarType;
  label: string;
  role: string;
  size: number;
  mobileSize: number;
  baseColor?: string;
}

const BOTS: BotConfig[] = [
  { type: 'droid', label: 'Droid', role: 'Agent Engine', size: 128, mobileSize: 74 },
  { type: 'star', label: 'Star', role: 'GenAI & RAG', size: 120, mobileSize: 70 },
  { type: 'cat', label: 'Cat', role: 'Tool Calling', size: 114, mobileSize: 66 },
  { type: 'ghost', label: 'Ghost', role: 'Evaluation & Ops', size: 110, mobileSize: 64 },
];

export const BotConvoy: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeStates, setActiveStates] = useState<BotAvatarState[]>(['default', 'default', 'default', 'default']);
  const [hoveredBot, setHoveredBot] = useState<number | null>(null);

  // Position state refs for smooth requestAnimationFrame physics loop
  const positions = useRef<{ x: number; y: number; vx: number; vy: number }[]>([
    { x: 0, y: 0, vx: 0, vy: 0 },
    { x: 0, y: 0, vx: 0, vy: 0 },
    { x: 0, y: 0, vx: 0, vy: 0 },
    { x: 0, y: 0, vx: 0, vy: 0 },
  ]);

  const targetRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const domRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track responsive screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set initial home positions centered in container
  useEffect(() => {
    const initPositions = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      // Delightful resting cluster formation in the hero center
      const homeOffsets = [
        { x: -50, y: -20 },
        { x: 45, y: -30 },
        { x: -35, y: 55 },
        { x: 50, y: 50 },
      ];

      positions.current.forEach((p, i) => {
        p.x = cx + homeOffsets[i].x;
        p.y = cy + homeOffsets[i].y;
        p.vx = 0;
        p.vy = 0;
      });

      targetRef.current.x = cx;
      targetRef.current.y = cy;
    };

    initPositions();
    window.addEventListener('resize', initPositions);
    return () => window.removeEventListener('resize', initPositions);
  }, []);

  // Listen to mousemove / pointermove across the hero section
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      // Target is relative to container
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if cursor is roughly within or near the hero
      if (
        e.clientX >= rect.left - 40 &&
        e.clientX <= rect.right + 40 &&
        e.clientY >= rect.top - 40 &&
        e.clientY <= rect.bottom + 40
      ) {
        targetRef.current.x = Math.max(50, Math.min(rect.width - 50, x));
        targetRef.current.y = Math.max(50, Math.min(rect.height - 50, y));
        targetRef.current.active = true;
      }
    };

    const handlePointerLeave = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      targetRef.current.x = rect.width / 2;
      targetRef.current.y = rect.height / 2;
      targetRef.current.active = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  // Physics animation loop using requestAnimationFrame for wiggling circle orbit around chatbox
  useEffect(() => {
    let animId: number;
    let time = 0;

    const animate = () => {
      time += 0.016;
      if (!containerRef.current) {
        animId = requestAnimationFrame(animate);
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      // Orbit radii around the central chatbox
      // Elliptical to embrace the horizontal pill shape of the chatbox
      const isMobileScreen = window.innerWidth < 640;
      const isTabletScreen = window.innerWidth < 1024;
      const baseRadiusX = isMobileScreen ? 172 : isTabletScreen ? 260 : 310;
      const baseRadiusY = isMobileScreen ? 60 : isTabletScreen ? 78 : 88;

      // Subtle dynamic tilt toward pointer if cursor is active
      const pointerOffsetX = targetRef.current.active ? (targetRef.current.x - cx) * 0.12 : 0;
      const pointerOffsetY = targetRef.current.active ? (targetRef.current.y - cy) * 0.12 : 0;
      const orbitCenterX = cx + pointerOffsetX;
      const orbitCenterY = cy + pointerOffsetY;

      const wiggleFactor = isMobileScreen ? 0.6 : 1.0;

      // Calculate each avatar's wiggling circular trajectory
      for (let i = 0; i < 4; i++) {
        // Base rotational angle evenly distributed 90 deg apart (gentle ~14s orbit)
        const angle = time * 0.45 + i * (Math.PI * 2 / 4);

        // Harmonic organic wiggle wave along the orbit path
        const wiggleRadius =
          (Math.sin(time * 2.2 + i * 1.6) * 14 +
           Math.cos(time * 1.2 + i * 2.0) * 7) * wiggleFactor;

        const wiggleAngle = Math.sin(time * 1.8 + i * 1.1) * 0.08;
        const finalAngle = angle + wiggleAngle;

        const currentRadiusX = baseRadiusX + wiggleRadius;
        const currentRadiusY = baseRadiusY + wiggleRadius * 0.65;

        const targetX = orbitCenterX + Math.cos(finalAngle) * currentRadiusX;
        const targetY = orbitCenterY + Math.sin(finalAngle) * currentRadiusY;

        // Smooth spring lerp to target position
        const p = positions.current[i];
        p.x += (targetX - p.x) * 0.1;
        p.y += (targetY - p.y) * 0.1;
      }

      // Repulsion pass to guarantee bots maintain healthy spacing
      const minDistance = isMobileScreen ? 72 : 110;
      for (let i = 0; i < 4; i++) {
        for (let j = i + 1; j < 4; j++) {
          const b1 = positions.current[i];
          const b2 = positions.current[j];
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.hypot(dx, dy);

          if (dist < minDistance && dist > 0.001) {
            const overlap = (minDistance - dist) * 0.5;
            const pushX = (dx / dist) * overlap;
            const pushY = (dy / dist) * overlap;

            b1.x -= pushX * 0.35;
            b1.y -= pushY * 0.35;
            b2.x += pushX * 0.35;
            b2.y += pushY * 0.35;
          }
        }
      }

      // Render updated positions to DOM
      for (let i = 0; i < 4; i++) {
        const dom = domRefs.current[i];
        if (dom) {
          const p = positions.current[i];
          const botSize = isMobileScreen ? BOTS[i].mobileSize : BOTS[i].size;
          const half = botSize / 2;
          dom.style.transform = `translate3d(${p.x - half}px, ${p.y - half}px, 0)`;
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isMobile]);

  // Click on avatar: trigger hopping / celebration animation
  const handleBotClick = (index: number) => {
    setActiveStates((prev) => {
      const next = [...prev];
      next[index] = next[index] === 'working' ? 'default' : 'working';
      return next;
    });

    // Reset back to default after 2.4s
    setTimeout(() => {
      setActiveStates((prev) => {
        const next = [...prev];
        next[index] = 'default';
        return next;
      });
    }, 2400);
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-10 overflow-visible select-none"
      aria-label="Interactive AI Agent Bot Squad"
    >
      {BOTS.map((bot, index) => {
        const size = isMobile ? bot.mobileSize : bot.size;
        const isHovered = hoveredBot === index;
        const state = activeStates[index];

        return (
          <div
            key={bot.type}
            ref={(el) => {
              domRefs.current[index] = el;
            }}
            className="absolute top-0 left-0 pointer-events-auto cursor-pointer transition-shadow group"
            style={{
              willChange: 'transform',
              zIndex: 15 - index,
            }}
            onClick={() => handleBotClick(index)}
            onPointerEnter={() => setHoveredBot(index)}
            onPointerLeave={() => setHoveredBot(null)}
          >
            {/* Ambient minimalist neutral halo glow (no blue colors) */}
            <div
              className={`absolute -inset-2 rounded-full blur-xl opacity-20 transition-opacity duration-300 pointer-events-none bg-white/20 ${
                isHovered ? 'opacity-60 scale-125' : 'group-hover:opacity-40'
              }`}
            />

            {/* The Bot Avatar Canvas with Crisp Tech Shading */}
            <div className="relative transform transition-transform duration-200 active:scale-95 group-hover:scale-105">
              <BotAvatar
                type={bot.type}
                size={size}
                state={state}
                shading="crisp"
                rim={0.8}
                interactive={true}
                className="drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
              />
            </div>

            {/* Subtle role tooltip on hover */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 -bottom-7 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-martin tracking-wider whitespace-nowrap bg-black/85 backdrop-blur-md border border-white/10 text-white/90 pointer-events-none transition-all duration-200 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
              }`}
            >
              <span className="font-semibold text-white">{bot.label}</span>
              <span className="text-white/40 mx-1">·</span>
              <span className="text-white/60">{bot.role}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
