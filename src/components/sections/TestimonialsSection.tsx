import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles, Pause, Play } from 'lucide-react';
import { EditorialBlurredHeading } from '../ui/EditorialBlurredHeading';
import { fetchSupabaseTable } from '../../services/supabase';

interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  sessionType: string;
  archetype: string;
  year: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    quote:
      'Tenía reservas respecto a la astrología por prejuicios del horóscopo comercial. La sesión en Narmer fue de una precisión terapéutica quirúrgica. Me ayudó a nombrar dinámicas inconscientes que llevaba años trabajando en supervisión clínica.',
    author: 'Dra. Mariana Albarracín',
    role: 'Psicóloga Clínica & Terapeuta Gestalt',
    location: 'Córdoba, Argentina',
    sessionType: 'Carta Natal Psicoastrológica',
    archetype: 'El Espejo de la Sombra',
    year: '2025',
  },
  {
    id: 't2',
    quote:
      'Agendé la consulta en un momento de bloqueo vocacional crítico, dudando si cerrar un estudio de ocho años. El análisis de tránsitos y los arcanos me dieron una claridad milimétrica sobre los ciclos que se agotaban. Seis meses después refundé mi proyecto con paz mental.',
    author: 'Lic. Sebastián Rosales',
    role: 'Director Creativo & Estratega',
    location: 'Ciudad de México',
    sessionType: 'Revolución Solar & Ciclos',
    archetype: 'El Colapso de la Torre',
    year: '2025',
  },
  {
    id: 't3',
    quote:
      'Llegamos a la consulta en medio de tensiones recurrentes de convivencia. Entender la diferencia en nuestros mapas de apego y el contrato kármico mutuo cambió para siempre cómo nos comunicamos. Dejamos de culparnos y empezamos a colaborar.',
    author: 'Camila Valenzuela & Tomás Herrera',
    role: 'Arquitectos & Docentes',
    location: 'Santiago, Chile',
    sessionType: 'Sinastría & Dinámica Vincular',
    archetype: 'La Tercera Entidad',
    year: '2026',
  },
  {
    id: 't4',
    quote:
      'No fue una predicción: fue una revelación de lo que mi intuición ya sabía pero mi mente racional se negaba a escuchar. La lectura del Tarot Egipcio me devolvió el timón en un momento de bifurcación vital definitiva.',
    author: 'Lucía Benítez',
    role: 'Investigadora en Bioética',
    location: 'Barcelona, España',
    sessionType: 'Tarot Egipcio Evolutivo',
    archetype: 'El Umbral de la Sacerdotisa',
    year: '2026',
  },
  {
    id: 't5',
    quote:
      'Un espacio íntimo, solemne y despojado de dogma. En Narmer los símbolos operan como una partitura viva. Salí con herramientas concretas y una sensación de reconciliación profunda con mi propia historia.',
    author: 'Martín Echeverría',
    role: 'Músico & Compositor',
    location: 'Montevideo, Uruguay',
    sessionType: 'Tarot + Carta Natal',
    archetype: 'El Sendero del Eremita',
    year: '2025',
  },
];

export const TestimonialsSection: React.FC = () => {
  const [items, setItems] = useState<TestimonialItem[]>(TESTIMONIALS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_DURATION = 8000; // 8 seconds slow contemplative cycle

  useEffect(() => {
    let active = true;
    fetchSupabaseTable<TestimonialItem>('testimonials', 'select=*').then((remoteRows) => {
      if (!active || !remoteRows || remoteRows.length === 0) return;
      const byId = new Map<string, TestimonialItem>();
      TESTIMONIALS.forEach((t) => byId.set(t.id, t));
      remoteRows.forEach((row) => {
        if (row.id && row.quote && row.author) {
          byId.set(row.id, { ...byId.get(row.id), ...row });
        }
      });
      setItems(Array.from(byId.values()));
    });
    return () => {
      active = false;
    };
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, items.length]);

  const active = items[currentIndex] || items[0];

  return (
    <section
      id="testimonios"
      className="py-28 px-6 sm:px-12 md:px-20 bg-[#070F18] relative overflow-hidden border-t border-[#7A7A7A]/25"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Resonancias y testimonios de consultantes"
    >
      {/* Paper grain & atmospheric radial glows */}
      <div className="absolute inset-0 paper-grain opacity-35 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#2A0E34]/25 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#00B3A4]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Astronomical faint declination lines */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="35%" x2="100%" y2="35%" stroke="#E8D7A6" strokeWidth="0.5" strokeDasharray="2 8" />
          <line x1="0" y1="85%" x2="100%" y2="85%" stroke="#E8D7A6" strokeWidth="0.5" strokeDasharray="2 8" />
          <circle cx="85%" cy="50%" r="220" stroke="#00B3A4" strokeWidth="0.5" strokeDasharray="3 7" fill="none" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#E8D7A6]/15">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1.5px] bg-[#00B3A4]" />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#00B3A4]">
                Capítulo IV · Resonancias & Huellas
              </span>
            </div>

            <EditorialBlurredHeading
              as="h2"
              delay={0.12}
              duration={1.2}
              blurAmount={12}
              className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#E8D7A6] font-normal leading-[1.15]"
            >
              Lo que el símbolo despierta.
            </EditorialBlurredHeading>

            <p className="font-editorial text-sm sm:text-base text-[#E8D7A6]/75 font-light max-w-xl">
              Palabras de consultantes que cruzaron el umbral y tradujeron los arcanos y planetas en claridad existencial.
            </p>
          </div>

          {/* Navigation Controls: Discreet, Minimalist & Tactile */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="p-2 text-[#E8D7A6]/60 hover:text-[#00B3A4] transition-colors border border-[#E8D7A6]/20 rounded-full"
              title={isPaused ? 'Reanudar transición automática' : 'Pausar transición'}
              aria-label={isPaused ? 'Reanudar pase automático' : 'Pausar pase automático'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            <div className="flex items-center gap-1.5 border border-[#E8D7A6]/20 rounded-full p-1 bg-[#0D1B2A]/70 backdrop-blur-sm">
              <button
                onClick={handlePrev}
                className="p-2 text-[#E8D7A6]/80 hover:text-[#00B3A4] hover:bg-[#2A0E34]/80 rounded-full transition-all"
                aria-label="Testimonio anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-mono text-[11px] tracking-widest text-[#E8D7A6]/70 px-2 select-none">
                {String(currentIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </span>

              <button
                onClick={handleNext}
                className="p-2 text-[#E8D7A6]/80 hover:text-[#00B3A4] hover:bg-[#2A0E34]/80 rounded-full transition-all"
                aria-label="Siguiente testimonio"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Slow-Fading Testimonial Stage */}
        <div className="relative min-h-[280px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col justify-between h-full"
            >
              {/* Category & Session Badge */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#00B3A4] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#00B3A4]" />
                  {active.sessionType}
                </span>
                <span className="text-[#7A7A7A]/50">·</span>
                <span className="font-handwritten text-sm text-[#E8D7A6]/70">
                  «{active.archetype}»
                </span>
                <span className="text-[#7A7A7A]/50">·</span>
                <span className="font-mono text-[10px] text-[#7A7A7A]">
                  Registro {active.year}
                </span>
              </div>

              {/* Central Poetic Quote */}
              <blockquote className="font-editorial italic font-normal text-xl sm:text-2xl md:text-3xl text-[#E8D7A6] leading-relaxed md:leading-[1.45] tracking-[-0.01em] max-w-4xl">
                «{active.quote}»
              </blockquote>

              {/* Author Attribution Meta */}
              <div className="mt-10 pt-6 border-t border-[#E8D7A6]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <cite className="not-italic font-editorial text-lg sm:text-xl text-[#E8D7A6] font-medium block">
                    {active.author}
                  </cite>
                  <p className="font-clean text-xs text-[#E8D7A6]/70 tracking-wide font-light">
                    {active.role} · <span className="text-[#00B3A4]">{active.location}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00B3A4]/80 shadow-[0_0_8px_rgba(0,179,164,0.6)]" />
                  <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#E8D7A6]/60">
                    Consulta individual en vivo
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Minimalist Progress Indicators */}
        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-[#7A7A7A]/20">
          <div className="flex items-center gap-2.5">
            {items.map((t, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={t.id}
                  onClick={() => goToSlide(idx)}
                  className="group py-2 focus:outline-none"
                  aria-label={`Ir al testimonio de ${t.author}`}
                  title={t.author}
                >
                  <div className="relative h-[2px] transition-all duration-700 overflow-hidden bg-[#E8D7A6]/20 rounded-full w-8 sm:w-12">
                    {isActive ? (
                      <motion.div
                        className="absolute inset-0 bg-[#00B3A4]"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{
                          duration: isPaused ? 0 : SLIDE_DURATION / 1000,
                          ease: 'linear',
                        }}
                      />
                    ) : (
                      <div className="w-0 group-hover:w-full h-full bg-[#E8D7A6]/40 transition-all duration-300" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#7A7A7A]">
            GABINETE NARMER · ARCHIVO DE TESTIMONIOS
          </span>
        </div>
      </div>
    </section>
  );
};
