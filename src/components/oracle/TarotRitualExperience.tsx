import React, { useState } from 'react';
import { Sparkles, RefreshCw, Eye, ArrowRight, BookOpen, Feather } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { EditorialBlurredHeading } from '../ui/EditorialBlurredHeading';
import { CardImage, SupportedArcanaId } from '../cards/CardImage';
import { LaSacerdotisaEgyptianCard } from '../cards/LaSacerdotisaEgyptianCard';
import { ElEremitaEgyptianCard } from '../cards/ElEremitaEgyptianCard';
import { LaTorreEgyptianCard } from '../cards/LaTorreEgyptianCard';
import { ElColgadoEgyptianCard } from '../cards/ElColgadoEgyptianCard';
import { LaLunaEgyptianCard } from '../cards/LaLunaEgyptianCard';
import { insertSupabaseRecord } from '../../services/supabase';

const SymbolicEgyptianArcanaSvg: React.FC<{ numeral: string; title: string }> = ({
  numeral,
  title,
}) => (
  <svg
    viewBox="0 0 450 780"
    className="w-full h-full object-contain"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <rect x="5" y="5" width="440" height="770" rx="28" fill="#00B3A4" />
    <rect x="18" y="18" width="414" height="744" rx="20" fill="#0E1724" stroke="#E8D7A6" strokeWidth="2.5" />
    <rect x="25" y="25" width="400" height="730" rx="14" fill="#0D1B2A" />
    <rect x="25" y="25" width="400" height="190" fill="#250B30" />
    <circle cx="225" cy="115" r="42" stroke="#E8D7A6" strokeWidth="2" fill="#E8D7A6" fillOpacity="0.18" />
    <circle cx="225" cy="115" r="56" stroke="#00B3A4" strokeWidth="1.2" strokeDasharray="4 6" />
    <rect x="25" y="215" width="400" height="4" fill="#0E1724" />
    <rect x="25" y="219" width="400" height="420" fill="#07121E" />
    <polygon points="225,270 125,560 325,560" stroke="#00B3A4" strokeWidth="2" fill="#250B30" fillOpacity="0.65" />
    <polygon points="225,310 155,540 295,540" stroke="#E8D7A6" strokeWidth="1.2" fill="none" strokeDasharray="4 4" />
    <circle cx="225" cy="450" r="36" fill="#0D1B2A" stroke="#E8D7A6" strokeWidth="2" />
    <text x="225" y="462" fill="#00B3A4" fontSize="34" fontFamily="'Cinzel', serif" fontWeight="700" textAnchor="middle">
      {numeral}
    </text>
    <line x1="25" y1="640" x2="425" y2="640" stroke="#E8D7A6" strokeWidth="2" />
    <rect x="25" y="642" width="400" height="78" fill="#1A0D22" />
    <path d="M 45,720 C 45,650 405,650 405,720" stroke="#00B3A4" strokeWidth="2" fill="none" />
    <rect x="25" y="720" width="400" height="35" fill="#250B30" stroke="#E8D7A6" strokeWidth="2" />
    <text
      x="225"
      y="744"
      fill="#E8D7A6"
      fontSize="21"
      fontFamily="'Cinzel', serif"
      fontWeight="700"
      letterSpacing="3"
      textAnchor="middle"
    >
      {title.toUpperCase()}
    </text>
  </svg>
);

interface DrawnCard {
  slot: string;
  subtitle: string;
  numeral: string;
  name: string;
  reflection: string;
  insight: string;
  archetypeDetail: string;
}

const DECK: Array<{
  numeral: string;
  name: string;
  reflection: string;
  pastInsight: string;
  presentInsight: string;
  unseenInsight: string;
  archetypeDetail: string;
}> = [
  {
    numeral: 'II',
    name: 'La Sacerdotisa',
    reflection: 'Lo que sabes antes de poder explicarlo.',
    pastInsight: 'Un período de gestación silenciosa o una verdad que tuviste que guardar para ti.',
    presentInsight: 'Estás ante una situación que requiere confiar en tu percepción intuitiva más que en opiniones ajenas.',
    unseenInsight: 'Aquello que callas por temor al juicio ajeno; tu sabiduría primordial pide salir a la luz.',
    archetypeDetail: 'Arquetipo del Inconsciente y el Umbral de los Misterios.',
  },
  {
    numeral: 'IX',
    name: 'El Ermitaño',
    reflection: 'Hay respuestas que necesitan silencio.',
    pastInsight: 'Un aislamiento necesario donde aprendiste a sostenerte sin aplausos exteriores.',
    presentInsight: 'Es momento de bajar la velocidad. La respuesta no está en el afuera, sino en tu propia lámpara.',
    unseenInsight: 'El miedo a caminar solo te lleva a buscar consejos donde en realidad ya tienes la respuesta.',
    archetypeDetail: 'Arquetipo del Anciano Sabio y la Retirada Sagrada.',
  },
  {
    numeral: 'XVI',
    name: 'La Torre',
    reflection: 'Lo que cae también libera.',
    pastInsight: 'Una ruptura inesperada que desmanteló una estructura rígida en tu vida.',
    presentInsight: 'Una verdad incómoda está resquebrajando una ilusión protectora para devolverte autenticidad.',
    unseenInsight: 'La resistencia a soltar lo que ya no tiene cimientos; la demolición es el inicio de la claridad.',
    archetypeDetail: 'Arquetipo de la Metanoia y la Disolución de la Máscara.',
  },
  {
    numeral: 'XII',
    name: 'El Colgado',
    reflection: 'Cambiar de perspectiva cuando nada se mueve.',
    pastInsight: 'Una renuncia consciente o un sacrificio que te obligó a mirar la realidad al revés.',
    presentInsight: 'Estás en una pausa fecunda. No fuerces la acción; la transformación ocurre en el cambio de mirada.',
    unseenInsight: 'La obsesión con el control; rendirse a los ritmos naturales no es debilidad, es sabiduría.',
    archetypeDetail: 'Arquetipo de la Iniciación y la Suspensión Voluntaria.',
  },
  {
    numeral: 'I',
    name: 'El Mago',
    reflection: 'Tienes todas las herramientas sobre la mesa.',
    pastInsight: 'El descubrimiento inicial de tu propia potencia creadora y recursos innatos.',
    presentInsight: 'La capacidad de articular palabra, deseo y acción en un solo gesto coherente.',
    unseenInsight: 'El síndrome del impostor que te hace esperar una autorización exterior que nunca llegará.',
    archetypeDetail: 'Arquetipo del Creador y la Voluntad Alquímica.',
  },
  {
    numeral: 'XVIII',
    name: 'La Luna',
    reflection: 'Las verdades que sólo se ven a oscuras.',
    pastInsight: 'Emociones reprimidas o temores ancestrales que moldearon tus formas de apego.',
    presentInsight: 'Navegas en aguas brumosas. No tomes decisiones drásticas; observa los sueños y las señales sutiles.',
    unseenInsight: 'Una herida de rechazo que proyectas sobre tu entorno actual sin darte cuenta.',
    archetypeDetail: 'Arquetipo del Océano Psíquico y la Sombra Fértil.',
  },
  {
    numeral: 'XVII',
    name: 'La Estrella',
    reflection: 'La fe después de la tormenta.',
    pastInsight: 'Un instante de sanación profunda tras una época de pérdida o sequía interior.',
    presentInsight: 'Tu energía se renueva. Estás derramando tu agua en el cauce correcto con generosidad.',
    unseenInsight: 'La dificultad para recibir y descansar en la gracia; permítete ser sostenido.',
    archetypeDetail: 'Arquetipo de la Guía Trascendente y la Esperanza Serena.',
  },
  {
    numeral: 'IV',
    name: 'El Emperador',
    reflection: 'La autoridad interior que no necesita gritar.',
    pastInsight: 'La necesidad de imponer límites estrictos o lidiar con figuras paternas de peso.',
    presentInsight: 'La construcción de orden, territorio y estabilidad material con madurez.',
    unseenInsight: 'La rigidez defensiva que te impide ser vulnerable con quienes amas.',
    archetypeDetail: 'Arquetipo del Orden Estructural y el Liderazgo Justo.',
  },
];

export const TarotRitualExperience: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [step, setStep] = useState<'input' | 'shuffling' | 'revealed'>('input');
  const [revealedCards, setRevealedCards] = useState<DrawnCard[]>([]);
  const [activeRevealedCard, setActiveRevealedCard] = useState<number>(0);

  const handleStartShuffle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setStep('shuffling');

    // Simulate ceremonial shuffle animation
    setTimeout(() => {
      // Pick 3 unique cards
      const shuffled = [...DECK].sort(() => 0.5 - Math.random());
      const selected = [
        {
          slot: 'PASADO',
          subtitle: 'La raíz oculta que te trajo hasta aquí',
          numeral: shuffled[0].numeral,
          name: shuffled[0].name,
          reflection: shuffled[0].reflection,
          insight: shuffled[0].pastInsight,
          archetypeDetail: shuffled[0].archetypeDetail,
        },
        {
          slot: 'PRESENTE',
          subtitle: 'El espejo del momento presente',
          numeral: shuffled[1].numeral,
          name: shuffled[1].name,
          reflection: shuffled[1].reflection,
          insight: shuffled[1].presentInsight,
          archetypeDetail: shuffled[1].archetypeDetail,
        },
        {
          slot: 'LO QUE PIDE SER MIRADO',
          subtitle: 'La invitación del inconsciente para tu integración',
          numeral: shuffled[2].numeral,
          name: shuffled[2].name,
          reflection: shuffled[2].reflection,
          insight: shuffled[2].unseenInsight,
          archetypeDetail: shuffled[2].archetypeDetail,
        },
      ];

      setRevealedCards(selected);
      setActiveRevealedCard(0);
      setStep('revealed');

      // Registro opcional y no bloqueante en Supabase Database si está configurado
      void insertSupabaseRecord('oracle_consultations', {
        question: question.trim(),
        past_card: `${selected[0].numeral} - ${selected[0].name}`,
        present_card: `${selected[1].numeral} - ${selected[1].name}`,
        unseen_card: `${selected[2].numeral} - ${selected[2].name}`,
        created_at: new Date().toISOString(),
      });
    }, 2800);
  };

  const handleReset = () => {
    setQuestion('');
    setStep('input');
    setRevealedCards([]);
    setActiveRevealedCard(0);
  };

  return (
    <section id="oraculo" className="py-28 px-6 sm:px-12 md:px-20 bg-[#0D1B2A] relative overflow-hidden border-t border-[#7A7A7A]/25">
      {/* Paper texture */}
      <div className="absolute inset-0 paper-grain opacity-35 pointer-events-none" />

      {/* Atmospheric glow in Violeta profundo #2A0E34 & Turquesa #00B3A4 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#2A0E34]/35 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-[#00B3A4]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#00B3A4]">
            Ritual Digital · Gabinete de Consulta
          </span>
        </div>

        {/* Section Header */}
        <EditorialBlurredHeading
          as="h2"
          delay={0.1}
          duration={1.2}
          blurAmount={12}
          className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#E8D7A6] font-normal leading-[1.1]"
        >
          Una pregunta.
        </EditorialBlurredHeading>
        <p className="mt-4 font-editorial text-base sm:text-lg text-[#E8D7A6]/80 font-light max-w-xl mx-auto leading-relaxed">
          «El Tarot no resuelve la incertidumbre: te invita a habitarla con lucidez y honestidad interior.»
        </p>

        {/* STAGE 1: INTROSPECTIVE QUESTION INPUT */}
        {step === 'input' && (
          <div className="mt-14 max-w-xl mx-auto">
            <form onSubmit={handleStartShuffle} className="space-y-8">
              <div className="p-8 border border-[#00B3A4]/35 bg-[#160B20]/90 relative rounded-none shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
                <div className="absolute -top-3 left-6 px-3 bg-[#0D1B2A] font-mono text-[9px] tracking-[0.25em] text-[#00B3A4] uppercase border border-[#00B3A4]/30">
                  Punto de partida
                </div>

                <label className="block font-editorial text-xl text-[#E8D7A6] text-left mb-2">
                  Piensa en una pregunta.
                </label>
                <p className="text-xs font-clean text-[#E8D7A6]/60 text-left font-light mb-6">
                  Evita preguntas de «sí o no». Formula algo que despierte tu propia responsabilidad (ej. <em>«¿Qué aspecto de mi sombra estoy ignorando en este vínculo?»</em> o <em>«¿Qué necesita madurar en mi vocación?»</em>).
                </p>

                <textarea
                  rows={3}
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Escríbela aquí con calma..."
                  className="w-full bg-[#070F18] border border-[#7A7A7A]/35 focus:border-[#00B3A4] p-4 text-base font-editorial text-[#E8D7A6] placeholder:text-[#E8D7A6]/30 focus:outline-none transition-colors resize-none"
                />
              </div>

              <MagneticButton
                type="submit"
                disabled={!question.trim()}
                strength={0.28}
                className="w-full py-4 border border-[#00B3A4] bg-[#2A0E34] hover:bg-[#1E0926] text-[#E8D7A6] font-clean text-xs font-medium tracking-[0.25em] uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,179,164,0.2)]"
              >
                <Feather className="w-3.5 h-3.5 text-[#00B3A4]" />
                <span>Barajar las cartas</span>
              </MagneticButton>
            </form>
          </div>
        )}

        {/* STAGE 2: CEREMONIAL SHUFFLING ANIMATION */}
        {step === 'shuffling' && (
          <div className="mt-16 py-16 flex flex-col items-center justify-center space-y-8">
            <div className="relative w-40 h-56 flex items-center justify-center">
              {/* Card 1 */}
              <div className="absolute w-32 h-48 border border-[#00B3A4]/40 bg-[#160B20] rounded transform -rotate-12 translate-x-4 animate-pulse" />
              {/* Card 2 */}
              <div className="absolute w-32 h-48 border border-[#E8D7A6]/50 bg-[#0A1420] rounded transform rotate-6 -translate-x-3 transition-transform" />
              {/* Card 3 (Center) */}
              <div className="relative w-32 h-48 border border-[#00B3A4] bg-[#2A0E34] rounded flex flex-col items-center justify-center p-3 shadow-2xl">
                <div className="w-12 h-12 rounded-full border border-[#00B3A4]/50 flex items-center justify-center text-[#00B3A4]">
                  <Sparkles className="w-5 h-5 animate-spin" />
                </div>
                <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-[#00B3A4] mt-3">
                  Sincronía
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-editorial italic text-2xl text-[#E8D7A6] block">
                «Disolviendo la certeza... convocando el símbolo»
              </span>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#7A7A7A]">
                Las cartas se ordenan para tu pregunta
              </p>
            </div>
          </div>
        )}

        {/* STAGE 3: THE THREE DRAWN REFLECTIVE CARDS */}
        {step === 'revealed' && revealedCards.length === 3 && (
          <div className="mt-12 space-y-12 animate-fadeIn text-left">
            {/* Header with original question */}
            <div className="p-4 border-b border-[#7A7A7A]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[9px] tracking-[0.25em] text-[#00B3A4] uppercase block">
                  Tu Pregunta Reflexiva
                </span>
                <p className="font-editorial text-lg text-[#E8D7A6] italic mt-0.5">
                  «{question}»
                </p>
              </div>

              <MagneticButton
                onClick={handleReset}
                strength={0.25}
                className="px-4 py-2 border border-[#7A7A7A]/40 text-xs font-clean uppercase tracking-[0.2em] text-[#E8D7A6]/80 hover:text-[#00B3A4] hover:border-[#00B3A4] transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-3 h-3 text-[#00B3A4]" />
                <span>Formular otra pregunta</span>
              </MagneticButton>
            </div>

            {/* The 3 Cards Slot Triad */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {revealedCards.map((c, idx) => {
                const isSelected = activeRevealedCard === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveRevealedCard(idx)}
                    className={`p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#00B3A4] bg-[#2A0E34] shadow-[0_15px_35px_rgba(0,0,0,0.85),0_0_20px_rgba(0,179,164,0.25)]'
                        : 'border-[#7A7A7A]/30 bg-[#0A1420] opacity-80 hover:opacity-100 hover:border-[#00B3A4]/50'
                    }`}
                  >
                    <div>
                      {/* Slot Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-[#E8D7A6]/15 mb-4">
                        <span className="font-mono text-[10px] tracking-[0.25em] text-[#00B3A4] uppercase font-bold">
                          {c.slot}
                        </span>
                        <span className="font-mono text-[10px] text-[#E8D7A6]">
                          ARC.{c.numeral}
                        </span>
                      </div>

                      <span className="font-clean text-[10px] text-[#E8D7A6]/60 block mb-3 font-light">
                        {c.subtitle}
                      </span>

                      {/* Card Title */}
                      <h4 className="font-editorial text-2xl text-[#E8D7A6] font-normal leading-tight">
                        {c.name}
                      </h4>

                      {/* Responsive Egyptian Card Illustration (supports Supabase Storage photo/video + SVG fallback for all 8 cards) */}
                      <div className="my-4 w-full max-w-[180px] aspect-[450/780] rounded-xl overflow-hidden border border-[#00B3A4]/70 shadow-[0_8px_24px_rgba(0,179,164,0.35)] bg-[#07101B] mx-auto">
                        {c.numeral === 'II' && (
                          <CardImage
                            cardId="sacerdotisa"
                            alt="Arcano II La Sacerdotisa"
                            fallbackSvg={<LaSacerdotisaEgyptianCard className="w-full h-full object-contain" />}
                          />
                        )}
                        {c.numeral === 'IX' && (
                          <CardImage
                            cardId="ermitano"
                            alt="Arcano IX El Eremita"
                            fallbackSvg={<ElEremitaEgyptianCard className="w-full h-full object-contain" />}
                          />
                        )}
                        {c.numeral === 'XVI' && (
                          <CardImage
                            cardId="torre"
                            alt="Arcano XVI La Torre"
                            fallbackSvg={<LaTorreEgyptianCard className="w-full h-full object-contain" />}
                          />
                        )}
                        {c.numeral === 'XII' && (
                          <CardImage
                            cardId="colgado"
                            alt="Arcano XII El Colgado"
                            fallbackSvg={<ElColgadoEgyptianCard className="w-full h-full object-contain" />}
                          />
                        )}
                        {c.numeral === 'XVIII' && (
                          <CardImage
                            cardId="luna"
                            alt="Arcano XVIII La Luna"
                            fallbackSvg={<LaLunaEgyptianCard className="w-full h-full object-contain" />}
                          />
                        )}
                        {c.numeral === 'I' && (
                          <CardImage
                            cardId="mago"
                            alt="Arcano I El Mago"
                            fallbackSvg={<SymbolicEgyptianArcanaSvg numeral="I" title="El Mago" />}
                          />
                        )}
                        {c.numeral === 'XVII' && (
                          <CardImage
                            cardId="estrella"
                            alt="Arcano XVII La Estrella"
                            fallbackSvg={<SymbolicEgyptianArcanaSvg numeral="XVII" title="La Estrella" />}
                          />
                        )}
                        {c.numeral === 'IV' && (
                          <CardImage
                            cardId="emperador"
                            alt="Arcano IV El Emperador"
                            fallbackSvg={<SymbolicEgyptianArcanaSvg numeral="IV" title="El Emperador" />}
                          />
                        )}
                      </div>

                      <p className="font-handwritten text-base text-[#00B3A4] mt-1 mb-4">
                        «{c.reflection}»
                      </p>

                      {/* Reflection Insight */}
                      <p className="font-clean text-xs text-[#E8D7A6]/85 font-light leading-relaxed">
                        {c.insight}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E8D7A6]/15 mt-6 text-[10px] font-mono text-[#7A7A7A] flex items-center justify-between">
                      <span>{c.archetypeDetail.split('y')[0]}</span>
                      <span className="text-[#00B3A4]">✦</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Card Deep Dive Narrative */}
            <div className="p-8 border border-[#00B3A4]/35 bg-[#160B20] relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-4 h-[1.5px] bg-[#00B3A4]" />
                <span className="font-mono text-[9px] tracking-[0.25em] text-[#00B3A4] uppercase">
                  Interpretación Profunda · {revealedCards[activeRevealedCard].slot}
                </span>
              </div>

              <h3 className="font-editorial text-2xl sm:text-3xl text-[#E8D7A6] font-normal">
                {revealedCards[activeRevealedCard].name} en tu camino
              </h3>

              <p className="mt-4 font-editorial text-base sm:text-lg text-[#E8D7A6]/90 leading-relaxed font-light">
                {revealedCards[activeRevealedCard].insight}
              </p>

              <div className="mt-6 pt-6 border-t border-[#E8D7A6]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-clean text-[#E8D7A6]/70">
                <span>Esta lectura no sella tu futuro: te devuelve el mapa para navegarlo.</span>
                <a
                  href="#sesiones"
                  className="font-clean text-xs uppercase tracking-[0.2em] text-[#00B3A4] hover:underline flex items-center gap-1.5 font-medium"
                >
                  <span>Profundizar en una sesión 1 a 1</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
