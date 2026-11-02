import React from 'react';

/**
 * HangedManIllustration
 * 
 * Complete full-bleed editorial tarot card artwork for Arcano XII · El Colgado.
 * Aspect ratio: 220x340 (matches full card plate).
 * Features authentic esoteric engraving, living Tau cross, inverted figure,
 * Egyptian Hathor aureole, and antique ornamental borders.
 */
export const HangedManIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 220 340"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Radiant Solar Aura Glow */}
        <radialGradient id="hangedSolarAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00B3A4" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#E8D7A6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2A0E34" stopOpacity="0" />
        </radialGradient>

        {/* Card Background Gradient */}
        <linearGradient id="cardBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A0B22" />
          <stop offset="50%" stopColor="#0D1B2A" />
          <stop offset="100%" stopColor="#070F18" />
        </linearGradient>

        {/* Tunic Deep Violet/Turquoise Shading */}
        <linearGradient id="tunicDeepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0D1B2A" />
          <stop offset="40%" stopColor="#2A0E34" />
          <stop offset="100%" stopColor="#00B3A4" stopOpacity="0.8" />
        </linearGradient>

        {/* Golden Cord Shading */}
        <linearGradient id="goldCordGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E8D7A6" />
          <stop offset="100%" stopColor="#C4AA66" />
        </linearGradient>
      </defs>

      {/* Background Plate */}
      <rect width="220" height="340" rx="4" fill="url(#cardBgGrad)" />

      {/* Antique Ornamental Double Border */}
      <rect x="8" y="8" width="204" height="324" rx="3" stroke="#7A7A7A" strokeWidth="0.8" opacity="0.4" />
      <rect x="12" y="12" width="196" height="316" rx="2" stroke="#E8D7A6" strokeWidth="1" opacity="0.75" />
      
      {/* Corner Egyptian / Arch Brackets in Turquoise */}
      <path d="M 12,22 L 22,22 L 22,12" stroke="#00B3A4" strokeWidth="1.2" fill="none" />
      <path d="M 208,22 L 198,22 L 198,12" stroke="#00B3A4" strokeWidth="1.2" fill="none" />
      <path d="M 12,318 L 22,318 L 22,328" stroke="#00B3A4" strokeWidth="1.2" fill="none" />
      <path d="M 208,318 L 198,318 L 198,328" stroke="#00B3A4" strokeWidth="1.2" fill="none" />

      {/* Card Header Marginalia */}
      <text x="24" y="27" fill="#E8D7A6" fontSize="8" fontFamily="monospace" letterSpacing="2" opacity="0.8">ARC.XII</text>
      <text x="110" y="28" fill="#E8D7A6" fontSize="13" fontFamily="serif" fontWeight="bold" textAnchor="middle" letterSpacing="3">XII</text>
      <text x="196" y="27" fill="#00B3A4" fontSize="7" fontFamily="monospace" letterSpacing="1.5" textAnchor="end">NARMER</text>
      <line x1="20" y1="34" x2="200" y2="34" stroke="#E8D7A6" strokeWidth="0.6" opacity="0.3" />

      {/* Astrological & Sacred Geometry Backdrops */}
      <circle cx="110" cy="175" r="75" stroke="#E8D7A6" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.25" />
      <circle cx="110" cy="175" r="62" stroke="#00B3A4" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.35" />
      
      {/* Living Gallows (Tau Cross / Living Tree) */}
      {/* Vertical Living Trunks with Bark Texture */}
      <line x1="38" y1="46" x2="38" y2="282" stroke="#7A7A7A" strokeWidth="3" opacity="0.75" strokeLinecap="round" />
      <line x1="38" y1="46" x2="38" y2="282" stroke="#E8D7A6" strokeWidth="0.6" opacity="0.3" strokeDasharray="4 2" />
      
      <line x1="182" y1="46" x2="182" y2="282" stroke="#7A7A7A" strokeWidth="3" opacity="0.75" strokeLinecap="round" />
      <line x1="182" y1="46" x2="182" y2="282" stroke="#E8D7A6" strokeWidth="0.6" opacity="0.3" strokeDasharray="4 2" />

      {/* Horizontal Living Crossbeam */}
      <line x1="30" y1="52" x2="190" y2="52" stroke="#7A7A7A" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="32" y1="52" x2="188" y2="52" stroke="#E8D7A6" strokeWidth="1" opacity="0.7" />

      {/* Sprouting Living Turquoise Shoots on the Crossbeam (Life in suspension) */}
      <path d="M 52,52 Q 48,40 58,38 Q 60,46 52,52 Z" fill="#00B3A4" opacity="0.9" />
      <path d="M 72,52 Q 74,42 66,40 Q 64,48 72,52 Z" fill="#E8D7A6" opacity="0.8" />
      <path d="M 148,52 Q 146,42 154,40 Q 156,48 148,52 Z" fill="#E8D7A6" opacity="0.8" />
      <path d="M 168,52 Q 172,40 162,38 Q 160,46 168,52 Z" fill="#00B3A4" opacity="0.9" />

      {/* Tree Sprouts on Left/Right Trunks */}
      <path d="M 38,110 Q 28,105 32,98 Q 38,103 38,110 Z" fill="#00B3A4" opacity="0.75" />
      <path d="M 38,180 Q 28,185 30,192 Q 37,187 38,180 Z" fill="#E8D7A6" opacity="0.7" />
      <path d="M 182,120 Q 192,115 188,108 Q 182,113 182,120 Z" fill="#00B3A4" opacity="0.75" />
      <path d="M 182,190 Q 192,195 190,202 Q 183,197 182,190 Z" fill="#E8D7A6" opacity="0.7" />

      {/* Suspension Rope tied to crossbeam */}
      <line x1="110" y1="52" x2="110" y2="82" stroke="url(#goldCordGrad)" strokeWidth="2.2" />
      <circle cx="110" cy="82" r="3.5" fill="#E8D7A6" stroke="#2A0E34" strokeWidth="1" />

      {/* Suspended Right Leg tied at Ankle */}
      <path d="M 110,82 L 110,128" stroke="#E8D7A6" strokeWidth="4" strokeLinecap="round" />

      {/* Left Leg Crossed behind the Right Knee in the Sacred '4' Shape */}
      <path
        d="M 110,128 L 76,146 L 110,154"
        stroke="#00B3A4"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Torso & Tunic (Inverted) */}
      <path
        d="M 98,128 
           C 92,154 92,176 96,198 
           L 124,198 
           C 128,176 128,154 122,128 
           Z"
        fill="url(#tunicDeepGrad)"
        stroke="#00B3A4"
        strokeWidth="1.5"
      />

      {/* Gold Belt with Turquoise Gem */}
      <line x1="94" y1="150" x2="126" y2="150" stroke="#E8D7A6" strokeWidth="1.8" />
      <circle cx="110" cy="150" r="2.5" fill="#00B3A4" />

      {/* Arms Clasped Calmly Behind the Back (Inverted Triangle) */}
      <path d="M 96,152 L 80,172 L 100,180" stroke="#E8D7A6" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 124,152 L 140,172 L 120,180" stroke="#E8D7A6" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Inverted Neck */}
      <line x1="110" y1="198" x2="110" y2="208" stroke="#E8D7A6" strokeWidth="3" />

      {/* Luminous Awakening Aureole / Halo around the Head */}
      <circle cx="110" cy="222" r="32" fill="url(#hangedSolarAura)" />
      <circle cx="110" cy="222" r="22" stroke="#E8D7A6" strokeWidth="1.2" opacity="0.9" fill="#13091B" />
      <circle cx="110" cy="222" r="26" stroke="#00B3A4" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.85" />
      <circle cx="110" cy="222" r="30" stroke="#E8D7A6" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.5" />

      {/* Radiating Light Rays from the Mind */}
      <line x1="110" y1="246" x2="110" y2="260" stroke="#00B3A4" strokeWidth="1.5" />
      <line x1="88" y1="240" x2="78" y2="252" stroke="#E8D7A6" strokeWidth="1" />
      <line x1="132" y1="240" x2="142" y2="252" stroke="#E8D7A6" strokeWidth="1" />
      <line x1="80" y1="222" x2="68" y2="222" stroke="#00B3A4" strokeWidth="1" />
      <line x1="140" y1="222" x2="152" y2="222" stroke="#00B3A4" strokeWidth="1" />

      {/* Peaceful Head Profile (Upside Down) */}
      <circle cx="110" cy="222" r="10" fill="#E8D7A6" />
      {/* Serene Closed Eyes */}
      <path d="M 106,222 Q 108,225 110,222" stroke="#2A0E34" strokeWidth="1.2" fill="none" />
      {/* Hair Cascading Downwards Toward Heaven */}
      <path d="M 102,218 C 98,228 97,236 100,244" stroke="#00B3A4" strokeWidth="1.4" fill="none" />
      <path d="M 118,218 C 122,228 123,236 120,244" stroke="#00B3A4" strokeWidth="1.4" fill="none" />

      {/* Celestial Dew / Golden Coins of Illumination Descending */}
      <circle cx="92" cy="236" r="2" fill="#E8D7A6" opacity="0.9" />
      <circle cx="128" cy="236" r="2" fill="#E8D7A6" opacity="0.9" />
      <circle cx="84" cy="208" r="1.5" fill="#00B3A4" opacity="0.8" />
      <circle cx="136" cy="208" r="1.5" fill="#00B3A4" opacity="0.8" />
      <circle cx="110" cy="268" r="2" fill="#E8D7A6" opacity="0.9" />

      {/* Bottom Cartouche with Card Title */}
      <line x1="20" y1="292" x2="200" y2="292" stroke="#E8D7A6" strokeWidth="0.6" opacity="0.4" />
      <rect x="36" y="298" width="148" height="22" rx="2" fill="#0D1B2A" stroke="#00B3A4" strokeWidth="0.8" opacity="0.9" />
      <text
        x="110"
        y="313"
        fill="#E8D7A6"
        fontSize="10"
        fontFamily="serif"
        fontWeight="bold"
        textAnchor="middle"
        letterSpacing="2.5"
      >
        EL COLGADO
      </text>
    </svg>
  );
};
