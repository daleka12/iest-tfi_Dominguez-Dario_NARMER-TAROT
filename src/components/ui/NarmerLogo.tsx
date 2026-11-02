import React, { useState } from 'react';
import { getSupabaseStorageUrl } from '../../services/supabase';

interface NarmerLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  storagePath?: string;
}

const LOCAL_STORAGE_LOGO_KEY = 'narmer_brand_logo_img';

/**
 * NarmerEmblemSvg - High fidelity vector recreation of the Celestial Emblem:
 * - Upper crescent moon with golden bead drop
 * - Radiant 8-point celestial star of Ishtar / Sirius
 * - Radiant sun disk with 16 rays & golden sphere
 * - Double infinity / sacred loop in Turquoise (#00B3A4) and Gold (#E8D7A6)
 * - Flanking crescent moons with turquoise stars
 * - Central golden diamond star
 * - Lower dark sphere with golden crescent rim
 * - "NARMER" classical serif logotype
 * - "TAROT Y PSICOASTROLOGÍA" subtitle with turquoise center star
 */
export const NarmerEmblemSvg: React.FC<{ className?: string; showText?: boolean }> = ({
  className = '',
  showText = true,
}) => {
  return (
    <svg
      viewBox={showText ? '0 0 500 520' : '0 0 500 400'}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9F1DC" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
        <linearGradient id="turqGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5D0" />
          <stop offset="60%" stopColor="#00B3A4" />
          <stop offset="100%" stopColor="#006660" />
        </linearGradient>
        <radialGradient id="sunGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFF2D6" />
          <stop offset="50%" stopColor="#E2BD5A" />
          <stop offset="100%" stopColor="#9E761C" />
        </radialGradient>
      </defs>

      {/* --- 1. TOP CRESCENT MOON & SUSPENDED BEAD --- */}
      <g transform="translate(250, 45)">
        <path
          d="M -30,-22 C -18,12 18,12 30,-22 C 20,-5 -20,-5 -30,-22 Z"
          fill="url(#goldGrad)"
          stroke="#AA7C11"
          strokeWidth="0.8"
        />
        {/* Drop bead */}
        <line x1="0" y1="6" x2="0" y2="16" stroke="url(#goldGrad)" strokeWidth="1.5" />
        <circle cx="0" cy="18" r="4.5" fill="url(#goldGrad)" />
      </g>

      {/* --- 2. 8-POINT CELESTIAL NORTH STAR --- */}
      <g transform="translate(250, 95)" fill="url(#goldGrad)">
        {/* Vertical points */}
        <polygon points="250,75 254,95 250,115 246,95" transform="translate(-250, -95)" />
        {/* Horizontal points */}
        <polygon points="230,95 250,91 270,95 250,99" transform="translate(-250, -95)" />
        {/* Diagonal points */}
        <polygon points="236,81 250,93 264,109 250,97" transform="translate(-250, -95)" opacity="0.85" />
        <polygon points="264,81 250,93 236,109 250,97" transform="translate(-250, -95)" opacity="0.85" />
        <circle cx="0" cy="0" r="2.5" fill="#FFF2D6" />
      </g>

      {/* --- 3. DOTTED CELESTIAL ORBITAL CIRCLE --- */}
      <circle
        cx="250"
        cy="210"
        r="115"
        stroke="url(#goldGrad)"
        strokeWidth="1"
        strokeDasharray="2 6"
        opacity="0.65"
      />

      {/* --- 4. FLANKING CRESCENT MOONS & TURQUOISE STARS --- */}
      {/* Left Crescent Moon */}
      <g transform="translate(135, 210)">
        <circle cx="-16" cy="0" r="3" fill="url(#goldGrad)" />
        <circle cx="-10" cy="0" r="2" fill="url(#goldGrad)" />
        <path
          d="M 12,-16 C -3,-10 -3,10 12,16 C 4,10 4,-10 12,-16 Z"
          fill="url(#goldGrad)"
          stroke="#AA7C11"
          strokeWidth="0.8"
        />
        {/* Left 4-point turquoise diamond star */}
        <g transform="translate(28, 0)" fill="url(#turqGrad)">
          <polygon points="0,-9 2.5,0 0,9 -2.5,0" />
          <polygon points="-7,0 0,2 7,0 0,-2" />
        </g>
      </g>

      {/* Right Crescent Moon */}
      <g transform="translate(365, 210)">
        <path
          d="M -12,-16 C 3,-10 3,10 -12,16 C -4,10 -4,-10 -12,-16 Z"
          fill="url(#goldGrad)"
          stroke="#AA7C11"
          strokeWidth="0.8"
        />
        <circle cx="10" cy="0" r="2" fill="url(#goldGrad)" />
        <circle cx="16" cy="0" r="3" fill="url(#goldGrad)" />
        {/* Right 4-point turquoise diamond star */}
        <g transform="translate(-28, 0)" fill="url(#turqGrad)">
          <polygon points="0,-9 2.5,0 0,9 -2.5,0" />
          <polygon points="-7,0 0,2 7,0 0,-2" />
        </g>
      </g>

      {/* --- 5. UPPER SUN DISK & RADIANT RAYS --- */}
      <g transform="translate(250, 160)">
        {/* 16 Sun rays */}
        <g stroke="url(#goldGrad)" strokeWidth="1.2">
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            const isLong = i % 2 === 0;
            const r1 = 22;
            const r2 = isLong ? 38 : 30;
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={Math.cos(rad) * r1}
                y1={Math.sin(rad) * r1}
                x2={Math.cos(rad) * r2}
                y2={Math.sin(rad) * r2}
              />
            );
          })}
        </g>
        {/* Sun Sphere */}
        <circle cx="0" cy="0" r="18" fill="url(#sunGrad)" stroke="#AA7C11" strokeWidth="0.8" />
      </g>

      {/* --- 6. SACRED DOUBLE LOOP / INFINITY RIBBON (TURQUOISE & GOLD) --- */}
      {/* Outer Golden Embracing Brackets */}
      <path
        d="M 160,140 C 130,200 130,260 160,310 C 180,340 220,360 250,360 C 220,360 180,340 160,310"
        stroke="url(#goldGrad)"
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M 340,140 C 370,200 370,260 340,310 C 320,340 280,360 250,360 C 280,360 320,340 340,310"
        stroke="url(#goldGrad)"
        strokeWidth="2.5"
        fill="none"
      />

      {/* Primary Turquoise Interlaced Curves */}
      <path
        d="M 195,120 
           C 170,160 185,210 225,230 
           C 275,255 315,290 310,340 
           C 305,360 285,370 260,370 
           C 290,370 325,350 325,315 
           C 325,270 280,240 240,218 
           C 195,195 180,155 205,120 Z"
        fill="url(#turqGrad)"
        stroke="#006660"
        strokeWidth="1"
      />
      <path
        d="M 305,120 
           C 330,160 315,210 275,230 
           C 225,255 185,290 190,340 
           C 195,360 215,370 240,370 
           C 210,370 175,350 175,315 
           C 175,270 220,240 260,218 
           C 305,195 320,155 295,120 Z"
        fill="url(#turqGrad)"
        stroke="#006660"
        strokeWidth="1"
      />

      {/* Gold Edge Highlights on Ribbon */}
      <path
        d="M 195,120 C 170,160 185,210 225,230 C 275,255 315,290 310,340"
        stroke="url(#goldGrad)"
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M 305,120 C 330,160 315,210 275,230 C 225,255 185,290 190,340"
        stroke="url(#goldGrad)"
        strokeWidth="2.5"
        fill="none"
      />

      {/* --- 7. LOWER CENTRAL DIAMOND STAR & SPHERE --- */}
      <g transform="translate(250, 275)">
        {/* Diamond 4-point star in gold */}
        <polygon points="0,-22 18,0 0,22 -18,0" fill="url(#goldGrad)" stroke="#AA7C11" strokeWidth="0.8" />
        <polygon points="0,-16 12,0 0,16 -12,0" fill="#FFF2D6" opacity="0.6" />
        
        {/* Suspended golden bead */}
        <line x1="0" y1="22" x2="0" y2="35" stroke="url(#goldGrad)" strokeWidth="1.5" />
        <circle cx="0" cy="38" r="4.5" fill="url(#goldGrad)" />
        <circle cx="0" cy="50" r="3.5" fill="url(#goldGrad)" />

        {/* Bottom Cosmic Sphere with gold rim */}
        <circle cx="0" cy="68" r="16" fill="#0C1B2B" stroke="url(#goldGrad)" strokeWidth="2.5" />
        <path
          d="M -12,68 A 12,12 0 0,0 8,80 A 14,14 0 0,1 -12,68 Z"
          fill="url(#goldGrad)"
        />
      </g>

      {/* --- 8. LOGOTYPE: "NARMER" --- */}
      {showText && (
        <>
          <g transform="translate(250, 440)">
            <text
              x="0"
              y="0"
              fill="url(#goldGrad)"
              fontSize="68"
              fontFamily="'Cinzel', 'Times New Roman', serif"
              fontWeight="600"
              letterSpacing="14"
              textAnchor="middle"
            >
              NARMER
            </text>
          </g>

          {/* Golden Horizontal Flourish with Central Turquoise Star */}
          <g transform="translate(250, 470)">
            {/* Left rule */}
            <line x1="-155" y1="0" x2="-25" y2="0" stroke="url(#goldGrad)" strokeWidth="1.8" />
            <circle cx="-160" cy="0" r="2" fill="url(#goldGrad)" />
            <circle cx="-15" cy="0" r="3.5" fill="url(#turqGrad)" stroke="#AA7C11" strokeWidth="0.8" />

            {/* Central 4-point turquoise diamond star */}
            <g fill="url(#turqGrad)">
              <polygon points="0,-12 4,0 0,12 -4,0" />
              <polygon points="-10,0 0,3 10,0 0,-3" />
            </g>

            {/* Right rule */}
            <circle cx="15" cy="0" r="3.5" fill="url(#turqGrad)" stroke="#AA7C11" strokeWidth="0.8" />
            <line x1="25" y1="0" x2="155" y2="0" stroke="url(#goldGrad)" strokeWidth="1.8" />
            <circle cx="160" cy="0" r="2" fill="url(#goldGrad)" />
          </g>

          {/* Subtitle: "TAROT Y PSICOASTROLOGÍA" */}
          <g transform="translate(250, 505)">
            <text
              x="0"
              y="0"
              fill="url(#goldGrad)"
              fontSize="16.5"
              fontFamily="'Cinzel', 'Times New Roman', sans-serif"
              fontWeight="500"
              letterSpacing="8"
              textAnchor="middle"
            >
              TAROT Y PSICOASTROLOGÍA
            </text>
          </g>
        </>
      )}
    </svg>
  );
};

export const NarmerLogo: React.FC<NarmerLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  storagePath = 'narmer_logo.png',
}) => {
  const candidateSources = React.useMemo(() => {
    const list: string[] = [];
    try {
      const localCustom = localStorage.getItem(LOCAL_STORAGE_LOGO_KEY);
      if (localCustom) list.push(localCustom);
    } catch {
      // Ignore storage access errors
    }
    const supaLogo = getSupabaseStorageUrl('brand', storagePath);
    if (supaLogo) list.push(supaLogo);
    list.push('/cards/narmer_logo.png');
    return list;
  }, [storagePath]);

  const [srcIndex, setSrcIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16 sm:w-20 sm:h-20',
    lg: 'w-32 h-32 sm:w-40 sm:h-40',
    xl: 'w-48 h-48 sm:w-64 sm:h-64',
  }[size];

  const activeSrc = !hasError ? candidateSources[srcIndex] : null;

  const handleImgError = () => {
    if (srcIndex + 1 < candidateSources.length) {
      setSrcIndex((prev) => prev + 1);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {activeSrc && !hasError ? (
        <img
          src={activeSrc}
          alt="Emblema Celestial NARMER en Oro y Turquesa"
          referrerPolicy="no-referrer"
          onError={handleImgError}
          className={`${sizeClasses} object-contain select-none filter drop-shadow-[0_4px_16px_rgba(0,179,164,0.35)]`}
        />
      ) : (
        <NarmerEmblemSvg
          showText={showSubtitle}
          className={`${sizeClasses} filter drop-shadow-[0_4px_16px_rgba(0,179,164,0.35)]`}
        />
      )}
    </div>
  );
};
