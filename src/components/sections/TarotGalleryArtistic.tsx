import React, { useState } from 'react';
import { motion } from 'motion/react';
import { EditorialBlurredHeading } from '../ui/EditorialBlurredHeading';
import { CardImage, SupportedArcanaId } from '../cards/CardImage';
import { LaSacerdotisaEgyptianCard } from '../cards/LaSacerdotisaEgyptianCard';
import { ElEremitaEgyptianCard } from '../cards/ElEremitaEgyptianCard';
import { LaTorreEgyptianCard } from '../cards/LaTorreEgyptianCard';
import { ElColgadoEgyptianCard } from '../cards/ElColgadoEgyptianCard';
import { LaLunaEgyptianCard } from '../cards/LaLunaEgyptianCard';

interface FloatingArcana {
  id: string;
  numeral: string;
  name: string;
  reflection: string;
  archetype: string;
  tilt: number;
  offsetY: number;
  symbolColor: string;
  svgGraphic: 'priestess' | 'hermit' | 'tower' | 'hanged' | 'moon';
}

const ARCANA_LIST: FloatingArcana[] = [
  {
    id: 'sacerdotisa',
    numeral: 'II',
    name: 'La Sacerdotisa',
    reflection: 'Lo que sabes antes de poder explicarlo.',
    archetype: 'El inconsciente y la intuición que aguarda en silencio.',
    tilt: -2.2,
    offsetY: 0,
    symbolColor: '#00B3A4',
    svgGraphic: 'priestess',
  },
  {
    id: 'ermitano',
    numeral: 'IX',
    name: 'El Ermitaño',
    reflection: 'Hay respuestas que necesitan silencio.',
    archetype: 'La lámpara interior; retirarse del ruido para escuchar lo esencial.',
    tilt: 1.8,
    offsetY: 28,
    symbolColor: '#E8D7A6',
    svgGraphic: 'hermit',
  },
  {
    id: 'torre',
    numeral: 'XVI',
    name: 'La Torre',
    reflection: 'Lo que cae también libera.',
    archetype: 'El colapso de la coraza ilusoria; el relámpago que despierta.',
    tilt: -1.2,
    offsetY: -16,
    symbolColor: '#2A0E34',
    svgGraphic: 'tower',
  },
  {
    id: 'colgado',
    numeral: 'XII',
    name: 'El Colgado',
    reflection: 'Cambiar de perspectiva cuando nada se mueve.',
    archetype: 'La pausa voluntaria; ver el mundo invertido para entender su peso.',
    tilt: 2.5,
    offsetY: 20,
    symbolColor: '#00B3A4',
    svgGraphic: 'hanged',
  },
  {
    id: 'luna',
    numeral: 'XVIII',
    name: 'La Luna',
    reflection: 'Las verdades que sólo se ven a oscuras.',
    archetype: 'El territorio de los sueños, la sombra fértil y el agua primordial.',
    tilt: -2.8,
    offsetY: 6,
    symbolColor: '#E8D7A6',
    svgGraphic: 'moon',
  },
];

export const TarotGalleryArtistic: React.FC = () => {
  const [activeCardId, setActiveCardId] = useState<string>('sacerdotisa');
  const activeCard = ARCANA_LIST.find((c) => c.id === activeCardId) || ARCANA_LIST[0];

  return (
    <section id="tarot" className="py-28 px-6 sm:px-12 md:px-20 bg-[#070F18] relative overflow-hidden border-t border-[#7A7A7A]/25">
      {/* Background paper texture & grain */}
      <div className="absolute inset-0 paper-grain opacity-40 pointer-events-none" />

      {/* Very faint background contour diagram */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#00B3A4]/15 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header: Bookish Editorial Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-[1.5px] bg-[#00B3A4]" />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#00B3A4]">
                Capítulo I · El Alfabeto del Alma
              </span>
            </div>
            <EditorialBlurredHeading
              as="h2"
              delay={0.12}
              duration={1.2}
              blurAmount={12}
              className="font-editorial text-4xl sm:text-5xl md:text-6xl text-[#E8D7A6] font-normal leading-[1.1]"
            >
              78 maneras de mirarte.
            </EditorialBlurredHeading>
            <p className="mt-4 font-editorial text-base sm:text-lg text-[#E8D7A6]/80 font-light leading-relaxed">
              Cada arcano no es un pronóstico del mañana: es un espejo que nombra un estado de tu mundo interno.
              Pasa el cursor o selecciona cada carta para contemplar su resonancia.
            </p>
          </div>

          {/* Active Card Quote Showcase in deep violet #2A0E34 */}
          <div className="p-6 border border-[#00B3A4]/35 bg-[#1A0B22] max-w-sm rounded-none shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            <span className="font-mono text-[9px] tracking-[0.25em] text-[#00B3A4] uppercase block mb-1">
              Arcano {activeCard.numeral} · {activeCard.name}
            </span>
            <p className="font-editorial italic text-lg sm:text-xl text-[#E8D7A6] leading-snug">
              «{activeCard.reflection}»
            </p>
            <p className="mt-2 text-xs font-clean text-[#E8D7A6]/75 leading-relaxed font-light">
              {activeCard.archetype}
            </p>
          </div>
        </div>

        {/* Asymmetrical Suspended Cards Constellation (Responsive grid without mobile overlap) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-8 lg:gap-5 items-center pt-4 pb-8" style={{ perspective: 1200 }}>
          {ARCANA_LIST.map((card) => {
            const isActive = activeCardId === card.id;
            const desktopOffsetClass =
              card.offsetY > 20
                ? 'lg:mt-10'
                : card.offsetY > 10
                ? 'lg:mt-7'
                : card.offsetY > 0
                ? 'lg:mt-3'
                : card.offsetY < 0
                ? 'lg:-mt-6'
                : '';

            return (
              <motion.div
                key={card.id}
                onMouseEnter={() => setActiveCardId(card.id)}
                onClick={() => setActiveCardId(card.id)}
                className={`cursor-pointer group flex flex-col items-center ${desktopOffsetClass}`}
                initial={{
                  y: 0,
                  rotateZ: card.tilt,
                  rotateX: 0,
                  rotateY: 0,
                  scale: 1,
                }}
                whileHover={{
                  y: -14,
                  rotateZ: card.tilt * 0.35,
                  rotateX: -8,
                  rotateY: card.tilt > 0 ? 9 : -9,
                  scale: 1.055,
                  transition: {
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                  },
                }}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Physical Card Plate */}
                <div
                  className={`w-full max-w-[220px] aspect-[450/780] rounded-xl transition-all duration-500 relative overflow-hidden flex flex-col justify-between ${
                    isActive
                      ? 'border border-[#00B3A4] shadow-[0_24px_50px_rgba(0,0,0,0.95),0_0_20px_rgba(0,179,164,0.3)]'
                      : 'border border-[#7A7A7A]/30 opacity-80 hover:opacity-100 hover:border-[#00B3A4]/60 shadow-[0_12px_30px_rgba(0,0,0,0.7)]'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Fine paper grain */}
                  <div className="absolute inset-0 paper-grain opacity-30 pointer-events-none z-10" />

                  {/* Subtle 3D glossy light sweep reflection on hover */}
                  <div className="absolute -inset-full w-[250%] h-[250%] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -rotate-12 z-10" />

                  {/* Card Artwork filling full card canvas */}
                  <div className="w-full h-full bg-[#07101B] flex items-center justify-center p-0.5">
                    {card.id === 'sacerdotisa' && (
                      <CardImage
                        cardId="sacerdotisa"
                        alt="Arcano II La Sacerdotisa"
                        fallbackSvg={<LaSacerdotisaEgyptianCard className="w-full h-full object-contain" />}
                      />
                    )}
                    {card.id === 'ermitano' && (
                      <CardImage
                        cardId="ermitano"
                        alt="Arcano IX El Eremita"
                        fallbackSvg={<ElEremitaEgyptianCard className="w-full h-full object-contain" />}
                      />
                    )}
                    {card.id === 'torre' && (
                      <CardImage
                        cardId="torre"
                        alt="Arcano XVI La Torre"
                        fallbackSvg={<LaTorreEgyptianCard className="w-full h-full object-contain" />}
                      />
                    )}
                    {card.id === 'colgado' && (
                      <CardImage
                        cardId="colgado"
                        alt="Arcano XII El Colgado"
                        fallbackSvg={<ElColgadoEgyptianCard className="w-full h-full object-contain" />}
                      />
                    )}
                    {card.id === 'luna' && (
                      <CardImage
                        cardId="luna"
                        alt="Arcano XVIII La Luna"
                        fallbackSvg={<LaLunaEgyptianCard className="w-full h-full object-contain" />}
                      />
                    )}
                  </div>
                </div>

                {/* Micro indicator below card */}
                <div
                  className={`mt-3 w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-[#00B3A4] scale-125' : 'bg-[#7A7A7A]/30'
                  }`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
