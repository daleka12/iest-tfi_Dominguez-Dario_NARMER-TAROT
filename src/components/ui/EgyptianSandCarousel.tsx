import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Sparkles, Play, Pause } from 'lucide-react';
import { SupabaseMedia } from './SupabaseMedia';

export interface GallerySlideItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  localSrc: string;
  storagePath: string;
}

export const NARMER_GALLERY_SLIDES: GallerySlideItem[] = [
  {
    id: 'slide-01',
    number: '01',
    title: 'Emblema Celestial NARMER',
    subtitle: 'Geometría solar y fases lunares iluminadas en oro y turquesa sobre el firmamento.',
    category: 'IDENTIDAD VISUAL · HERO',
    localSrc: './cards/galeria-01.png',
    storagePath: 'galeria-01.png',
  },
  {
    id: 'slide-02',
    number: '02',
    title: 'Mazo Físico Oficial NARMER',
    subtitle: 'Baraja de 78 arcanos dispuesta sobre terciopelo púrpura en mesa ritual.',
    category: 'ARTEFACTO · 78 ARCANOS',
    localSrc: './cards/galeria-02.png',
    storagePath: 'galeria-02.png',
  },
  {
    id: 'slide-03',
    number: '03',
    title: 'Gabinete en Tinogasta',
    subtitle: 'Espacio íntimo de contemplación con vista a los cerros catamarqueños.',
    category: 'ESPACIO FÍSICO · OBSERVATORIO',
    localSrc: './cards/galeria-03.png',
    storagePath: 'galeria-03.png',
  },
  {
    id: 'slide-04',
    number: '04',
    title: 'Encuentro & Lectura en Vivo',
    subtitle: 'Diálogo simbólico frente a los arcanos bajo luz cálida de atardecer.',
    category: 'SESIÓN · ESCUCHA ACTIVA',
    localSrc: './cards/galeria-04.png',
    storagePath: 'galeria-04.png',
  },
  {
    id: 'slide-05',
    number: '05',
    title: 'Gabinete Digital en Escritorio',
    subtitle: 'Plataforma web NARMER integrada al espacio de estudio astrológico y simbólico.',
    category: 'EXPERIENCIA WEB · DESKTOP',
    localSrc: './cards/galeria-05.png',
    storagePath: 'galeria-05.png',
  },
  {
    id: 'slide-06',
    number: '06',
    title: 'El Oráculo en Dispositivo Móvil',
    subtitle: 'Consulta interactiva de La Sacerdotisa adaptada a pantallas móviles.',
    category: 'EXPERIENCIA WEB · MOBILE',
    localSrc: './cards/galeria-06.png',
    storagePath: 'galeria-06.png',
  },
  {
    id: 'slide-07',
    number: '07',
    title: 'Evolución Visual · La Sacerdotisa',
    subtitle: 'Tres etapas de refinamiento artístico: del boceto inicial a la estética definitiva.',
    category: 'PROCESO CREATIVO · ARCANO II',
    localSrc: './cards/galeria-07.png',
    storagePath: 'galeria-07.png',
  },
  {
    id: 'slide-08',
    number: '08',
    title: 'Evolución del Emblema Celestial',
    subtitle: 'Del trazo manual al trazado vectorial de alta precisión en oro y turquesa.',
    category: 'PROCESO CREATIVO · SIMBOLOGÍA',
    localSrc: './cards/galeria-08.png',
    storagePath: 'galeria-08.png',
  },
];

interface SandParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  blurRadius: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  color: string;
}

/**
 * Ícono Egipcio (Ojo de Horus & Pirámide Astral) para desplegar el carrusel 3D
 */
export const EgyptianCarouselIconSvg: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 36 36"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Marco romboidal / piramidal sagrado */}
    <polygon
      points="18,3 33,18 18,33 3,18"
      stroke="#00B3A4"
      strokeWidth="1.4"
      fill="#2A0E34"
      fillOpacity="0.55"
    />
    {/* Pirámide interior dorada */}
    <polygon
      points="18,7 29,25 7,25"
      stroke="#E8D7A6"
      strokeWidth="1.2"
      fill="#0D1B2A"
      fillOpacity="0.8"
    />
    {/* Ojo místico central y disco solar */}
    <path
      d="M 11,18.5 Q 18,13.5 25,18.5 Q 18,23.5 11,18.5 Z"
      stroke="#E8D7A6"
      strokeWidth="1.2"
      fill="#180821"
    />
    <circle cx="18" cy="18.5" r="2.3" fill="#00B3A4" />
    <circle cx="18" cy="18.5" r="0.9" fill="#E8D7A6" />
    {/* Tres granos de arena dorada inferiores */}
    <circle cx="14" cy="28.5" r="1" fill="#E8D7A6" />
    <circle cx="18" cy="29.5" r="1.2" fill="#00B3A4" />
    <circle cx="22" cy="28.5" r="1" fill="#E8D7A6" />
  </svg>
);

interface EgyptianSandCarouselProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const EgyptianSandCarousel: React.FC<EgyptianSandCarouselProps> = ({
  isOpen,
  onClose,
  onOpen,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [sandTransitionActive, setSandTransitionActive] = useState(false);

  const sandCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sandParticlesRef = useRef<SandParticle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const total = NARMER_GALLERY_SLIDES.length;

  /**
   * Dispara una ráfaga de arena difuminada del desierto egipcio entre cada transición de lámina
   */
  const triggerSandBurst = useCallback((dir: 1 | -1) => {
    setSandTransitionActive(true);
    setTimeout(() => setSandTransitionActive(false), 680);

    const canvas = sandCanvasRef.current;
    if (!canvas) return;
    const w = canvas.width || window.innerWidth;
    const h = canvas.height || window.innerHeight;

    const palette = [
      '232, 215, 166', // Oro arena papiro (#E8D7A6)
      '197, 170, 122', // Arena duna dorada (#C5AA7A)
      '0, 179, 164',   // Brillo turquesa egipcio (#00B3A4)
      '249, 241, 220', // Polvo estelar crema (#F9F1DC)
    ];

    const newParticles: SandParticle[] = [];
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
      const isSoftCloud = i < 38; // Nubes de arena muy difuminada + granos finos
      const startX =
        dir > 0
          ? w * (0.25 + Math.random() * 0.65)
          : w * (0.1 + Math.random() * 0.65);
      const startY = h * (0.15 + Math.random() * 0.7);

      newParticles.push({
        x: startX,
        y: startY,
        vx: -dir * (isSoftCloud ? 4 + Math.random() * 9 : 6 + Math.random() * 14),
        vy: (Math.random() - 0.5) * (isSoftCloud ? 3.5 : 5.5) - 0.6,
        radius: isSoftCloud ? 18 + Math.random() * 34 : 1.2 + Math.random() * 3.8,
        blurRadius: isSoftCloud ? 24 : 3,
        alpha: 0,
        maxAlpha: isSoftCloud ? 0.22 + Math.random() * 0.18 : 0.45 + Math.random() * 0.45,
        life: 0,
        maxLife: 28 + Math.floor(Math.random() * 26),
        color: palette[Math.floor(Math.random() * palette.length)],
      });
    }

    sandParticlesRef.current.push(...newParticles);
  }, []);

  const changeSlide = useCallback(
    (nextIdx: number, customDir?: 1 | -1) => {
      const normalized = ((nextIdx % total) + total) % total;
      if (normalized === activeIndex) return;
      const computedDir: 1 | -1 =
        customDir ?? (normalized > activeIndex || (activeIndex === total - 1 && normalized === 0) ? 1 : -1);
      setDirection(computedDir);
      triggerSandBurst(computedDir);
      setActiveIndex(normalized);
    },
    [activeIndex, total, triggerSandBurst]
  );

  const handleNext = useCallback(() => {
    changeSlide(activeIndex + 1, 1);
  }, [activeIndex, changeSlide]);

  const handlePrev = useCallback(() => {
    changeSlide(activeIndex - 1, -1);
  }, [activeIndex, changeSlide]);

  // Navegación por teclado cuando el carrusel está abierto
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Pase automático opcional
  useEffect(() => {
    if (!isOpen || !isAutoPlay) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5200);
    return () => clearInterval(timer);
  }, [isOpen, isAutoPlay, handleNext]);

  // Loop de renderizado del canvas de arena difuminada
  useEffect(() => {
    if (!isOpen) return;
    const canvas = sandCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const renderSand = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = sandParticlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.97;

        const progress = p.life / p.maxLife;
        if (progress >= 1) {
          particles.splice(i, 1);
          continue;
        }

        // Curva suave de aparición y disipación como bruma de arena
        const fade = progress < 0.25 ? progress / 0.25 : 1 - (progress - 0.25) / 0.75;
        p.alpha = Math.max(0, p.maxAlpha * fade);

        if (p.radius > 8) {
          // Nube de arena difuminada (gradiente radial suave)
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          grad.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
          grad.addColorStop(0.55, `rgba(${p.color}, ${p.alpha * 0.45})`);
          grad.addColorStop(1, `rgba(${p.color}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Grano de arena dorada con halo difuso
          ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(renderSand);
    };

    animFrameRef.current = requestAnimationFrame(renderSand);

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen]);

  /**
   * Calcula la distancia circular más corta en el carrusel 3D (-4 a +4)
   */
  const getCircularOffset = (idx: number) => {
    let diff = idx - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  const activeSlide = NARMER_GALLERY_SLIDES[activeIndex];

  return (
    <>
      {/* Botón Flotante Egipcio para desplegar el Carrusel 3D desde cualquier punto de la página */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => {
            if (isOpen) {
              onClose();
            } else {
              onOpen();
              setTimeout(() => triggerSandBurst(1), 120);
            }
          }}
          className={`group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full border backdrop-blur-md transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.85)] ${
            isOpen
              ? 'bg-[#2A0E34] border-[#00B3A4] text-[#E8D7A6] shadow-[0_0_25px_rgba(0,179,164,0.45)]'
              : 'bg-[#0D1B2A]/90 border-[#00B3A4]/55 text-[#E8D7A6] hover:bg-[#2A0E34] hover:border-[#00B3A4] hover:shadow-[0_0_22px_rgba(0,179,164,0.35)]'
          }`}
          title="Desplegar Galería Visual 3D · 8 Láminas NARMER"
          aria-label="Desplegar Galería Visual 3D"
        >
          <EgyptianCarouselIconSvg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300 shrink-0" />
          <div className="text-left pr-1">
            <span className="block font-mono text-[8px] tracking-[0.22em] uppercase text-[#00B3A4] leading-none">
              Archivo Visual
            </span>
            <span className="block font-editorial text-xs sm:text-sm tracking-[0.12em] text-[#E8D7A6] leading-tight mt-0.5">
              Galería 3D · 8 Láminas
            </span>
          </div>
        </button>
      </div>

      {/* Modal / Cámara Desplegable del Carrusel 3D */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-[#050B12]/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden select-none"
            role="dialog"
            aria-modal="true"
            aria-label="Galería Visual 3D Narmer"
          >
            {/* Textura de grano y halos atmosféricos */}
            <div className="absolute inset-0 paper-grain opacity-35 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[420px] bg-[#2A0E34]/40 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[500px] h-[240px] bg-[#00B3A4]/12 rounded-full blur-[130px] pointer-events-none" />

            {/* Lienzo de Arena Difuminada del Desierto (entre transiciones) */}
            <canvas
              ref={sandCanvasRef}
              className="pointer-events-none fixed inset-0 z-30"
            />

            {/* Velo de bruma de arena dorada durante el cambio de imagen */}
            <AnimatePresence>
              {sandTransitionActive && (
                <motion.div
                  initial={{ opacity: 0, filter: 'blur(20px)' }}
                  animate={{ opacity: 0.55, filter: 'blur(28px)' }}
                  exit={{ opacity: 0, filter: 'blur(35px)' }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
                >
                  <div
                    className="w-[75vw] h-[55vh] rounded-full"
                    style={{
                      background:
                        direction > 0
                          ? 'radial-gradient(ellipse at center, rgba(232,215,166,0.28) 0%, rgba(0,179,164,0.12) 45%, transparent 75%)'
                          : 'radial-gradient(ellipse at center, rgba(232,215,166,0.28) 0%, rgba(42,14,52,0.25) 45%, transparent 75%)',
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Barra Superior del Carrusel */}
            <div className="relative z-40 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-5 pb-3 flex items-center justify-between border-b border-[#E8D7A6]/15">
              <div className="flex items-center gap-3">
                <EgyptianCarouselIconSvg className="w-7 h-7 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-[#00B3A4]">
                      Cámara Visual 3D · Gabinete Narmer
                    </span>
                  </div>
                  <h2 className="font-editorial text-lg sm:text-2xl text-[#E8D7A6] font-normal leading-tight">
                    Bitácora de Arte, Universo & Proceso Simbólico
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-4">
                <button
                  onClick={() => setIsAutoPlay((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-full border font-mono text-[9px] tracking-[0.2em] uppercase flex items-center gap-1.5 transition-all ${
                    isAutoPlay
                      ? 'border-[#00B3A4] bg-[#2A0E34] text-[#E8D7A6] shadow-[0_0_12px_rgba(0,179,164,0.3)]'
                      : 'border-[#E8D7A6]/25 text-[#E8D7A6]/70 hover:text-[#00B3A4] hover:border-[#00B3A4]'
                  }`}
                  title={isAutoPlay ? 'Pausar rotación automática' : 'Iniciar rotación automática'}
                >
                  {isAutoPlay ? <Pause className="w-3 h-3 text-[#00B3A4]" /> : <Play className="w-3 h-3" />}
                  <span className="hidden sm:inline">{isAutoPlay ? 'Pase Activo' : 'Auto-Rotar'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full border border-[#E8D7A6]/25 bg-[#0D1B2A] text-[#E8D7A6] hover:text-[#00B3A4] hover:border-[#00B3A4] transition-all"
                  title="Cerrar galería (Esc)"
                  aria-label="Cerrar galería"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Escenario Central: Slider 3D Suave con Perspectiva y Difuminado de Arena */}
            <div
              className="relative z-20 flex-1 w-full max-w-7xl mx-auto flex items-center justify-center px-4 sm:px-12 overflow-hidden"
              style={{ perspective: '1500px' }}
            >
              {/* Botón Anterior */}
              <button
                onClick={handlePrev}
                className="absolute left-3 sm:left-6 z-40 p-3 sm:p-3.5 rounded-full border border-[#00B3A4]/60 bg-[#0D1B2A]/90 hover:bg-[#2A0E34] text-[#E8D7A6] hover:text-[#00B3A4] transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                aria-label="Lámina anterior"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Contenedor 3D de las 8 Láminas */}
              <div
                className="relative w-full h-[320px] sm:h-[400px] md:h-[440px] flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {NARMER_GALLERY_SLIDES.map((slide, idx) => {
                  const offset = getCircularOffset(idx);
                  const absOffset = Math.abs(offset);

                  // Solo renderizamos en el espacio 3D las láminas cercanas (-2 a +2)
                  if (absOffset > 2) return null;

                  const isCenter = offset === 0;
                  const translateX = offset * (absOffset === 1 ? 54 : 42); // %
                  const translateZ = isCenter ? 0 : absOffset === 1 ? -220 : -390;
                  const rotateY = isCenter ? 0 : offset < 0 ? 34 : -34;
                  const scale = isCenter ? 1 : absOffset === 1 ? 0.78 : 0.6;
                  const opacity = isCenter ? 1 : absOffset === 1 ? 0.58 : 0.25;
                  const zIndex = 30 - absOffset * 10;

                  return (
                    <motion.div
                      key={slide.id}
                      onClick={() => {
                        if (!isCenter) {
                          changeSlide(idx, offset > 0 ? 1 : -1);
                        }
                      }}
                      initial={false}
                      animate={{
                        x: `${translateX}%`,
                        z: translateZ,
                        rotateY,
                        scale,
                        opacity,
                        filter: isCenter
                          ? sandTransitionActive
                            ? 'blur(6px) sepia(0.28) brightness(1.12)'
                            : 'blur(0px) sepia(0) brightness(1)'
                          : `blur(${absOffset === 1 ? 2.5 : 5}px) sepia(0.15) brightness(0.75)`,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 170,
                        damping: 24,
                        mass: 0.9,
                        filter: { duration: 0.48, ease: 'easeOut' },
                      }}
                      style={{
                        zIndex,
                        transformStyle: 'preserve-3d',
                      }}
                      className={`absolute w-[84%] sm:w-[68%] md:w-[58%] lg:w-[52%] max-w-[680px] h-full rounded-2xl p-2 sm:p-3 border transition-colors duration-500 flex items-center justify-center ${
                        isCenter
                          ? 'border-[#00B3A4] bg-gradient-to-b from-[#1A0924] via-[#0D1B2A] to-[#08121D] shadow-[0_30px_80px_rgba(0,0,0,0.95),0_0_35px_rgba(0,179,164,0.3)]'
                          : 'border-[#E8D7A6]/25 bg-[#08121D]/90 cursor-pointer hover:border-[#00B3A4]/60'
                      }`}
                    >
                      {/* Marco interior de la lámina */}
                      <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#050B12] flex items-center justify-center">
                        <SupabaseMedia
                          bucket="space"
                          storagePath={slide.storagePath}
                          localFallbackSrc={slide.localSrc}
                          alt={slide.title}
                          mediaClassName="w-full h-full object-contain rounded-xl select-none"
                          fallbackContent={
                            <img
                              src={slide.localSrc}
                              alt={slide.title}
                              className="w-full h-full object-contain rounded-xl select-none"
                            />
                          }
                        />

                        {/* Insignia de número en esquina superior izquierda */}
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0D1B2A]/85 border border-[#00B3A4]/50 backdrop-blur-sm flex items-center gap-1.5">
                          <Sparkles className="w-2.5 h-2.5 text-[#00B3A4]" />
                          <span className="font-mono text-[9px] tracking-[0.22em] text-[#E8D7A6] uppercase">
                            Lámina {slide.number} / 08
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Botón Siguiente */}
              <button
                onClick={handleNext}
                className="absolute right-3 sm:right-6 z-40 p-3 sm:p-3.5 rounded-full border border-[#00B3A4]/60 bg-[#0D1B2A]/90 hover:bg-[#2A0E34] text-[#E8D7A6] hover:text-[#00B3A4] transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
                aria-label="Siguiente lámina"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Pie del Carrusel: Metadatos de la lámina activa + Miniaturas de las 8 imágenes */}
            <div className="relative z-40 w-full max-w-6xl mx-auto px-4 sm:px-8 pb-5 pt-2 flex flex-col items-center gap-4">
              {/* Información de la lámina activa con transición de arena difuminada */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(8px)' }}
                  transition={{ duration: 0.38 }}
                  className="text-center max-w-2xl"
                >
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-[#00B3A4] block">
                    {activeSlide.number} · {activeSlide.category}
                  </span>
                  <h3 className="font-editorial text-xl sm:text-2xl md:text-3xl text-[#E8D7A6] font-normal mt-0.5">
                    {activeSlide.title}
                  </h3>
                  <p className="font-editorial italic text-sm sm:text-base text-[#E8D7A6]/80 mt-0.5">
                    «{activeSlide.subtitle}»
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Tira de 8 Miniaturas Interactivas */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto max-w-full py-1 px-2">
                {NARMER_GALLERY_SLIDES.map((s, idx) => {
                  const isCurrent = idx === activeIndex;
                  return (
                    <button
                      key={s.id}
                      onClick={() => changeSlide(idx)}
                      className={`group relative w-12 h-9 sm:w-16 sm:h-11 rounded-lg overflow-hidden border transition-all duration-300 shrink-0 ${
                        isCurrent
                          ? 'border-[#00B3A4] scale-110 shadow-[0_0_15px_rgba(0,179,164,0.5)]'
                          : 'border-[#E8D7A6]/20 opacity-50 hover:opacity-90 hover:border-[#00B3A4]/50'
                      }`}
                      title={`${s.number} · ${s.title}`}
                      aria-label={`Ver ${s.title}`}
                    >
                      <img
                        src={s.localSrc}
                        alt={s.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 right-1 font-mono text-[7px] text-[#E8D7A6] bg-[#0D1B2A]/80 px-1 rounded">
                        {s.number}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

