import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  isGlint?: boolean;
}

const PALETTE_COLORS = [
  'rgba(232, 215, 166, ', // #E8D7A6 Crema / dorado claro (oro faraónico)
  'rgba(0, 179, 164, ',  // #00B3A4 Turquesa (lapislázuli / fayenza egipcia)
  'rgba(42, 14, 52, ',   // #2A0E34 Violeta profundo (misterio sacerdotal)
  'rgba(122, 122, 122, ', // #7A7A7A Gris piedra (basalto / papiro)
  'rgba(13, 27, 42, ',   // #0D1B2A Azul noche (firmamento de Nut)
];

/**
 * EgyptianOrbitalCursor
 *
 * An artistic Egyptian symbolic cursor fusing sacred geometry from ancient dynasties:
 * - Center Point: The All-Seeing Eye of Horus (Udyat) / Solar Disk of Ra in Cream Gold & Turquoise.
 * - Inertial Reticle: An Egyptian cartouche / winged solar disk astrolabe with sacred cardinal hieroglyphs,
 *   ouroboros / sundial markings, and feather of Ma'at orientation.
 * - Stardust Trail: Sacred incense dust (Kyphi) & gold leaf embers drifting organically behind cursor movement.
 */
export const OrbitalCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastPosRef = useRef({ x: -100, y: -100 });
  const isPointerRef = useRef(false);

  useEffect(() => {
    isPointerRef.current = isPointer;
  }, [isPointer]);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const media = window.matchMedia('(pointer: fine)');
    if (!media.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isWindowActive = true;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    const spawnParticles = (currentX: number, currentY: number, interactive: boolean) => {
      const dx = currentX - lastPosRef.current.x;
      const dy = currentY - lastPosRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 4) return;

      const count = interactive ? (Math.random() < 0.65 ? 2 : 1) : (Math.random() < 0.4 ? 1 : 0);
      if (count === 0 && Math.random() > 0.3) return;

      for (let i = 0; i < Math.max(1, count); i++) {
        const angle = Math.random() * Math.PI * 2;
        const dispersionRadius = Math.random() * (interactive ? 22 : 14);
        const px = currentX + Math.cos(angle) * dispersionRadius;
        const py = currentY + Math.sin(angle) * dispersionRadius;

        const colorBase = interactive
          ? (Math.random() < 0.5 ? PALETTE_COLORS[0] : Math.random() < 0.8 ? PALETTE_COLORS[1] : PALETTE_COLORS[2])
          : PALETTE_COLORS[Math.floor(Math.random() * PALETTE_COLORS.length)];

        particlesRef.current.push({
          x: px,
          y: py,
          vx: (Math.random() - 0.5) * 0.55 - dx * 0.04,
          vy: (Math.random() - 0.5) * 0.55 - dy * 0.04 - 0.16, // incense smoke drift
          size: Math.random() * (interactive ? 1.9 : 1.3) + 0.6,
          alpha: Math.random() * 0.5 + 0.35,
          decay: Math.random() * 0.016 + 0.012,
          color: colorBase,
          isGlint: Math.random() < 0.18,
        });
      }

      if (particlesRef.current.length > 60) {
        particlesRef.current.splice(0, particlesRef.current.length - 60);
      }

      lastPosRef.current = { x: currentX, y: currentY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      setPos({ x, y });
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = Boolean(
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA' ||
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[role="button"]') ||
          target.closest('[role="tab"]') ||
          target.closest('[data-cursor-interactive="true"]') ||
          target.classList.contains('cursor-pointer') ||
          window.getComputedStyle(target).cursor === 'pointer'
        );
        setIsPointer(interactive);
        spawnParticles(x, y, interactive);
      } else {
        spawnParticles(x, y, false);
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => {
      isWindowActive = false;
      setIsVisible(false);
    };
    const handleMouseEnter = () => {
      isWindowActive = true;
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    const renderLoop = () => {
      if (!isWindowActive) {
        animationFrameId = requestAnimationFrame(renderLoop);
        return;
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `${p.color}${Math.max(0, p.alpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Delicate glint cross (hieroglyphic star motif)
        if (p.isGlint && p.alpha > 0.25) {
          ctx.strokeStyle = `rgba(232, 215, 166, ${p.alpha * 0.8})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x - p.size * 2.2, p.y);
          ctx.lineTo(p.x + p.size * 2.2, p.y);
          ctx.moveTo(p.x, p.y - p.size * 2.2);
          ctx.lineTo(p.x, p.y + p.size * 2.2);
          ctx.stroke();
        }
      }

      // Smooth inertia for trailing Egyptian talisman ring
      setTrail((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.18,
        y: prev.y + (pos.y - prev.y) * 0.18,
      }));

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [pos.x, pos.y]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
      {/* Canvas for sacred Egyptian incense dust & gold leaf particle trail */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0"
      />

      {/* Trailing Sacred Egyptian Talisman / Astrolabe Reticle */}
      <div
        className={`fixed transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out z-10 flex items-center justify-center ${
          isMouseDown
            ? 'w-10 h-10 scale-90'
            : isPointer
            ? 'w-14 h-14 scale-110'
            : 'w-9 h-9'
        }`}
        style={{
          left: `${trail.x}px`,
          top: `${trail.y}px`,
        }}
      >
        <svg
          viewBox="0 0 60 60"
          className={`w-full h-full transition-transform duration-700 ${
            isPointer ? 'rotate-45' : 'rotate-0'
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Outer Egyptian Sacred Ring */}
          <circle
            cx="30"
            cy="30"
            r="26"
            stroke={isPointer ? '#00B3A4' : '#E8D7A6'}
            strokeWidth="0.8"
            strokeDasharray={isPointer ? '2 3' : '3 4'}
            opacity={isPointer ? 0.9 : 0.45}
            className="animate-[spin_40s_linear_infinite]"
          />

          {/* Inner concentric ring in aged stone */}
          <circle
            cx="30"
            cy="30"
            r="19"
            stroke="#7A7A7A"
            strokeWidth="0.6"
            opacity={0.35}
          />

          {/* 4 Cardinal Sacred Rays / Solar Axis */}
          <line x1="30" y1="2" x2="30" y2="9" stroke="#E8D7A6" strokeWidth="0.9" opacity={0.8} />
          <line x1="30" y1="51" x2="30" y2="58" stroke="#E8D7A6" strokeWidth="0.9" opacity={0.8} />
          <line x1="2" y1="30" x2="9" y2="30" stroke="#E8D7A6" strokeWidth="0.9" opacity={0.8} />
          <line x1="51" y1="30" x2="58" y2="30" stroke="#E8D7A6" strokeWidth="0.9" opacity={0.8} />

          {/* Egyptian Ankh / Solar Wings Petals (when hovering interactive element) */}
          {isPointer && (
            <g opacity="0.85">
              {/* Turquoise cartouche corner notches */}
              <circle cx="30" cy="5" r="1.5" fill="#00B3A4" />
              <circle cx="30" cy="55" r="1.5" fill="#00B3A4" />
              <circle cx="5" cy="30" r="1.5" fill="#00B3A4" />
              <circle cx="55" cy="30" r="1.5" fill="#00B3A4" />

              {/* Diamond cartouche frame */}
              <polygon
                points="30,12 48,30 30,48 12,30"
                stroke="#00B3A4"
                strokeWidth="0.7"
                fill="#2A0E34"
                fillOpacity="0.25"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Center Sacred Ankh (Cruz Egipcia) Glow Accent */}
      <div
        className="fixed transform -translate-x-1/2 -translate-y-[3px] z-20 pointer-events-none transition-transform duration-150"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      >
        <div
          className={`rounded-full transition-all duration-200 ${
            isPointer
              ? 'w-5 h-5 bg-[#00B3A4]/25 blur-[6px]'
              : 'w-3.5 h-3.5 bg-[#E8D7A6]/20 blur-[5px]'
          }`}
        />
      </div>
    </div>
  );
};
