import React from 'react';
import { CardImage } from './CardImage';
import { LaSacerdotisaEgyptianCard } from './LaSacerdotisaEgyptianCard';
import { ElEremitaEgyptianCard } from './ElEremitaEgyptianCard';

interface PhysicalTarotCardProps {
  cardName?: string;
  romanNumeral?: string;
  themePhrase?: string;
  rotation?: number;
  scale?: number;
  className?: string;
  interactive?: boolean;
}

export const PhysicalTarotCard: React.FC<PhysicalTarotCardProps> = ({
  cardName = 'EL EREMITA',
  romanNumeral = 'IX',
  themePhrase = 'Hay respuestas que necesitan silencio.',
  rotation = 1.2,
  scale = 1,
  className = '',
}) => {
  const isHermit = romanNumeral === 'IX' || cardName.toUpperCase().includes('EREMITA') || cardName.toUpperCase().includes('ERMITAÑO');

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        transform: `rotate(${rotation}deg) scale(${scale})`,
        transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      {/* Outer subtle shadow simulating card suspended in atmospheric dark space */}
      <div
        className="relative w-64 sm:w-72 md:w-80 h-[380px] sm:h-[440px] md:h-[500px] rounded-2xl p-1.5 sm:p-2 overflow-hidden border border-[#00B3A4]/60"
        style={{
          background: 'linear-gradient(155deg, #00B3A4 0%, #2A0E34 40%, #0D1B2A 100%)',
          boxShadow:
            '0 30px 70px -15px rgba(0, 0, 0, 0.95), 0 0 25px rgba(0, 179, 164, 0.35)',
        }}
      >
        {/* Paper texture and grain simulation */}
        <div className="absolute inset-0 paper-grain opacity-35 pointer-events-none z-10" />

        {/* Diagonal slow light sweep across card */}
        <div className="absolute -inset-full w-[250%] h-[250%] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent card-light-sweep pointer-events-none z-10" />

        {/* Card Artwork Container */}
        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner flex items-center justify-center bg-[#07101B]">
          {isHermit ? (
            <CardImage
              cardId="ermitano"
              alt="Arcano IX El Eremita"
              fallbackSvg={<ElEremitaEgyptianCard className="w-full h-full object-contain" />}
            />
          ) : (
            <CardImage
              cardId="sacerdotisa"
              alt="Arcano II La Sacerdotisa"
              fallbackSvg={<LaSacerdotisaEgyptianCard className="w-full h-full object-contain" />}
            />
          )}
        </div>
      </div>
    </div>
  );
};
