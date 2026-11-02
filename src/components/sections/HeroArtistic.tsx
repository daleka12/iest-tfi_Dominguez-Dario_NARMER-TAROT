import React, { useState } from 'react';
import { PhysicalTarotCard } from '../cards/PhysicalTarotCard';
import { Compass, ArrowDownRight, Eye } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { EditorialBlurredHeading } from '../ui/EditorialBlurredHeading';
import { NarmerLogo } from '../ui/NarmerLogo';

interface HeroArtisticProps {
  onEnterOracle: () => void;
  onExploreChart: () => void;
  onBookSession: () => void;
}

export const HeroArtistic: React.FC<HeroArtisticProps> = ({
  onEnterOracle,
  onExploreChart,
  onBookSession,
}) => {
  const [cardTilted, setCardTilted] = useState(false);

  return (
    <section className="relative min-h-[96vh] flex flex-col justify-between px-6 sm:px-12 md:px-20 pt-28 sm:pt-32 pb-16 sm:pb-20 bg-[#0D1B2A] overflow-hidden">
      {/* Background paper texture & delicate cosmic noise */}
      <div className="absolute inset-0 paper-grain opacity-40 pointer-events-none" />

      {/* Atmospheric subtle radial depth: Deep violet #2A0E34 & Turquoise #00B3A4 over midnight blue */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#2A0E34]/40 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[420px] h-[420px] bg-[#00B3A4]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Faint astronomical coordinate markings and orbital lines */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle celestial declination lines */}
          <line x1="0" y1="48%" x2="100%" y2="48%" stroke="#E8D7A6" strokeWidth="0.5" strokeDasharray="3 9" />
          <line x1="38%" y1="0" x2="38%" y2="100%" stroke="#E8D7A6" strokeWidth="0.5" strokeDasharray="3 9" />
          
          {/* Faint large orbital arcs in turquoise & gold */}
          <circle cx="70%" cy="50%" r="380" stroke="#00B3A4" strokeWidth="0.5" fill="none" opacity="0.4" />
          <circle cx="70%" cy="50%" r="480" stroke="#E8D7A6" strokeWidth="0.5" strokeDasharray="2 6" fill="none" opacity="0.3" />
        </svg>

        {/* Marginalia coordinates text in Egyptian stone grey #7A7A7A - positioned safely out of headline zone */}
        <span className="hidden lg:block absolute top-24 right-12 xl:right-20 font-mono text-[9px] tracking-[0.25em] text-[#7A7A7A]">
          LAT 31°12'18" N · OBSERVATORIO NARMER · GABINETE SIMBÓLICO
        </span>
        <span className="hidden lg:block absolute bottom-24 right-12 xl:right-20 font-mono text-[9px] tracking-[0.25em] text-[#7A7A7A]">
          RA 14h 29m · DEC -62°40' · ARCHIVO VII · EGIPTO SAGRADO
        </span>
        <span className="hidden xl:block absolute top-32 right-24 font-handwritten text-base text-[#E8D7A6]/50 transform -rotate-6">
          el ojo que mira hacia el origen
        </span>
      </div>

      {/* Main Grid: Asymmetrical Editorial Composition */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center my-auto py-4">
        {/* Left Column: Typography & Poetic Core (Cols 1-7) */}
        <div className="lg:col-span-7 space-y-8 text-left">
          {/* Brand Emblem & Quiet Category Lead-in with Turquoise accent */}
          <div className="flex items-center gap-4">
            <NarmerLogo size="md" showSubtitle={false} className="hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="w-5 h-[1.5px] bg-[#00B3A4]" />
                <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#00B3A4]">
                  Gabinete de Exploración Simbólica
                </span>
              </div>
              <span className="font-editorial text-xs sm:text-sm tracking-[0.2em] uppercase text-[#E8D7A6]/80 mt-0.5">
                NARMER · Tarot y Psicoastrología
              </span>
            </div>
          </div>

          {/* Monumental Editorial Headline in Crema / Dorado Claro with progressive blur reveal */}
          <div className="space-y-1">
            <EditorialBlurredHeading
              as="h1"
              delay={0.1}
              duration={1.2}
              blurAmount={14}
              className="font-editorial text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.08] text-[#E8D7A6] tracking-[-0.01em]"
            >
              Leer los símbolos.
            </EditorialBlurredHeading>
            <EditorialBlurredHeading
              as="h1"
              delay={0.28}
              duration={1.25}
              blurAmount={14}
              className="font-editorial italic text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.08] text-[#FFFFFF] tracking-[-0.01em]"
            >
              Escucharte a ti.
            </EditorialBlurredHeading>
          </div>

          {/* Subtitle with generous measure */}
          <p className="max-w-xl text-base sm:text-lg md:text-xl text-[#E8D7A6]/85 font-editorial font-light leading-relaxed">
            Tarot y psicoastrología para mirar hacia adentro.
            El símbolo no te dice qué va a pasar: te ayuda a contemplar aquello que todavía no estás viendo.
          </p>

          {/* Hand-scribed notation in margin */}
          <div className="flex items-center gap-4 text-xs font-handwritten text-[#00B3A4] text-base pt-1">
            <span>«el inconsciente habla en figuras, no en sentencias»</span>
          </div>

          {/* CTAs: Magnetic buttons with Violeta profundo + Turquesa borders */}
          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <MagneticButton
              onClick={onEnterOracle}
              strength={0.32}
              className="px-7 py-3.5 rounded-none border border-[#00B3A4] bg-[#2A0E34] hover:bg-[#1E0926] text-[#E8D7A6] font-clean text-xs font-medium tracking-[0.22em] uppercase transition-all duration-300 shadow-[0_0_20px_rgba(0,179,164,0.22)] group"
            >
              <span>Entrar al oráculo</span>
              <ArrowDownRight className="w-3.5 h-3.5 text-[#00B3A4] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
            </MagneticButton>

            <MagneticButton
              onClick={onExploreChart}
              strength={0.25}
              className="px-7 py-3.5 rounded-none border border-[#7A7A7A]/40 hover:border-[#00B3A4] text-[#E8D7A6]/80 hover:text-[#00B3A4] font-clean text-xs font-medium tracking-[0.22em] uppercase transition-all duration-300"
            >
              <Compass className="w-3.5 h-3.5 text-[#00B3A4]" />
              <span>Explorar mi carta</span>
            </MagneticButton>
          </div>
        </div>

        {/* Right Column: Suspended Physical Tarot Card (Cols 8-12) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          {/* Subtle orbital ring behind the card in turquoise & gold */}
          <div className="absolute w-80 sm:w-96 h-80 sm:h-96 rounded-full border border-[#00B3A4]/30 border-dashed pointer-events-none animate-[spin_120s_linear_infinite]" />
          <div className="absolute w-[440px] h-[440px] rounded-full border border-[#E8D7A6]/15 pointer-events-none hidden sm:block" />

          {/* Floating Card with Breathing Animation */}
          <div
            className="relative cursor-pointer animate-breathing-float flex flex-col items-center"
            onMouseEnter={() => setCardTilted(true)}
            onMouseLeave={() => setCardTilted(false)}
            onClick={onEnterOracle}
            title="Haz clic para consultar el oráculo"
          >
            <PhysicalTarotCard
              cardName="LA SACERDOTISA"
              romanNumeral="II"
              themePhrase="Lo que sabes antes de poder explicarlo."
              rotation={cardTilted ? -2.5 : 1.4}
              scale={1}
            />

            {/* Handwritten note next to the card */}
            <div className="mt-5 sm:mt-0 sm:absolute sm:-bottom-8 sm:right-0 font-handwritten text-sm sm:text-base text-[#00B3A4] opacity-90 sm:transform sm:rotate-3 select-none pointer-events-none text-center">
              arcano de la intuición silenciosa →
            </div>
          </div>
        </div>
      </div>

      {/* Gentle Scroll Invitation */}
      <div className="relative z-10 mt-12 sm:mt-20 pt-6 border-t border-[#7A7A7A]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px] sm:text-[11px] font-clean tracking-[0.22em] sm:tracking-[0.25em] text-[#7A7A7A] uppercase max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00B3A4]" />
          <span>Observatorio de Arquetipos</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[#E8D7A6]/70">01 / 07 · Desciende para explorar</span>
        </div>
      </div>
    </section>
  );
};
