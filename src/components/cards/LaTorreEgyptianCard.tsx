import React from 'react';

export const LaTorreEgyptianCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 450 780"
      className={`w-full h-full ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <clipPath id="torreClip">
          <rect x="25" y="25" width="400" height="730" rx="16" />
        </clipPath>
      </defs>
      <rect x="5" y="5" width="440" height="770" rx="28" fill="#00B3A4" />
      <rect x="18" y="18" width="414" height="744" rx="20" fill="#0E1724" stroke="#E8D7A6" strokeWidth="2.5" />
      <rect x="25" y="25" width="400" height="730" rx="14" fill="#0D1B2A" />

      <g clipPath="url(#torreClip)">
        {/* Upper celestial sky */}
        <rect x="25" y="25" width="400" height="200" fill="#250B30" />
        {/* Stars */}
        <g fill="#FFFFFF" opacity="0.8">
          <circle cx="80" cy="65" r="1.5" />
          <circle cx="120" cy="90" r="1.2" />
          <circle cx="340" cy="70" r="1.5" />
          <circle cx="370" cy="110" r="1.2" />
        </g>
        {/* Celestial glyphs */}
        <circle cx="225" cy="80" r="30" stroke="#E8D7A6" strokeWidth="1.8" fill="#E8D7A6" fillOpacity="0.2" />

        {/* Separator */}
        <rect x="25" y="225" width="400" height="4" fill="#0E1724" />

        {/* Center sanctuary night sky */}
        <rect x="25" y="229" width="400" height="520" fill="#07121E" />

        {/* The Sacred Egyptian Fortress Tower */}
        <g id="egyptianTower" transform="translate(145, 270)">
          {/* Lightning striking the crown */}
          <path
            d="M 80, -35 L 70, 20 L 95, 15 L 75, 75 L 105, 70 L 60, 160"
            stroke="#00B3A4"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 80, -35 L 70, 20 L 95, 15 L 75, 75 L 105, 70 L 60, 160"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            fill="none"
          />

          {/* Falling golden sparks / yods of spiritual awakening */}
          <g fill="#E8D7A6">
            <ellipse cx="20" cy="120" rx="3" ry="6" transform="rotate(-20 20 120)" />
            <ellipse cx="40" cy="90" rx="3" ry="6" transform="rotate(15 40 90)" />
            <ellipse cx="120" cy="110" rx="3" ry="6" transform="rotate(30 120 110)" />
            <ellipse cx="140" cy="140" rx="3" ry="6" transform="rotate(-15 140 140)" />
            <ellipse cx="10" cy="170" rx="3" ry="6" transform="rotate(40 10 170)" />
            <ellipse cx="150" cy="190" rx="3" ry="6" transform="rotate(-30 150 190)" />
          </g>

          {/* Detached Golden Crown */}
          <polygon points="50,45 110,45 125,15 95,28 80,10 65,28 35,15" fill="#E8D7A6" stroke="#0E1724" strokeWidth="2" transform="rotate(12 80 30)" />

          {/* Stone Tower Body */}
          <polygon points="50,60 110,60 125,360 35,360" fill="#250B30" stroke="#00B3A4" strokeWidth="2" />
          {/* Stone masonry courses */}
          <line x1="48" y1="110" x2="112" y2="110" stroke="#E8D7A6" strokeWidth="1" opacity="0.6" />
          <line x1="46" y1="160" x2="114" y2="160" stroke="#E8D7A6" strokeWidth="1" opacity="0.6" />
          <line x1="44" y1="210" x2="116" y2="210" stroke="#E8D7A6" strokeWidth="1" opacity="0.6" />
          <line x1="41" y1="260" x2="119" y2="260" stroke="#E8D7A6" strokeWidth="1" opacity="0.6" />
          <line x1="38" y1="310" x2="122" y2="310" stroke="#E8D7A6" strokeWidth="1" opacity="0.6" />

          {/* Arched windows with turquoise glow */}
          <path d="M 70,125 A 10,10 0 0,1 90,125 L 90,150 L 70,150 Z" fill="#00B3A4" stroke="#0E1724" strokeWidth="1.2" />
          <path d="M 68,225 A 12,12 0 0,1 92,225 L 92,255 L 68,255 Z" fill="#00B3A4" stroke="#0E1724" strokeWidth="1.2" />

          {/* Gateway Portal */}
          <path d="M 65,300 A 15,15 0 0,1 95,300 L 95,360 L 65,360 Z" fill="#0E1724" stroke="#E8D7A6" strokeWidth="1.5" />
        </g>

        {/* Lower Register: Crypt and Base Ground */}
        <line x1="25" y1="630" x2="425" y2="630" stroke="#E8D7A6" strokeWidth="2" />
        <rect x="25" y="632" width="400" height="88" fill="#1A0D22" />
        <path d="M 40,720 C 40,640 410,640 410,720" stroke="#00B3A4" strokeWidth="2.5" fill="none" />
        <text x="390" y="695" fill="#E8D7A6" fontSize="32" fontFamily="serif" fontWeight="bold" textAnchor="middle">16</text>

        {/* Bottom Cartouche Bar */}
        <rect x="25" y="720" width="400" height="42" fill="#250B30" stroke="#E8D7A6" strokeWidth="2" />
        <text x="225" y="748" fill="#E8D7A6" fontSize="23" fontFamily="'Cinzel', serif" fontWeight="700" letterSpacing="3" textAnchor="middle">
          LA TORRE
        </text>
        <text x="380" y="748" fill="#E8D7A6" fontSize="22" fontFamily="serif" fontWeight="bold">16</text>
      </g>
    </svg>
  );
};
