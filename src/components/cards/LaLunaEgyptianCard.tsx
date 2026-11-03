import React from 'react';

export const LaLunaEgyptianCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [imgError, setImgError] = React.useState(false);

  if (!imgError) {
    return (
      <img
        src="./cards/18.jpg"
        alt="Arcano XVIII · La Luna (El Crepúsculo)"
        onError={() => setImgError(true)}
        className={`w-full h-full object-contain rounded-xl select-none ${className}`}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 450 780"
      className={`w-full h-full ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <clipPath id="lunaClip">
          <rect x="25" y="25" width="400" height="730" rx="16" />
        </clipPath>
      </defs>
      <rect x="5" y="5" width="440" height="770" rx="28" fill="#00B3A4" />
      <rect x="18" y="18" width="414" height="744" rx="20" fill="#0E1724" stroke="#E8D7A6" strokeWidth="2.5" />
      <rect x="25" y="25" width="400" height="730" rx="14" fill="#0D1B2A" />

      <g clipPath="url(#lunaClip)">
        {/* Upper celestial sky */}
        <rect x="25" y="25" width="400" height="200" fill="#250B30" />
        <g fill="#FFFFFF" opacity="0.8">
          <circle cx="70" cy="55" r="1.5" />
          <circle cx="110" cy="80" r="1.2" />
          <circle cx="340" cy="60" r="1.5" />
          <circle cx="380" cy="90" r="1.2" />
        </g>

        {/* Separator */}
        <rect x="25" y="225" width="400" height="4" fill="#0E1724" />

        {/* Nocturnal dreamscape */}
        <rect x="25" y="229" width="400" height="520" fill="#07121E" />

        {/* The Great Egyptian Full Moon with Crescent Face */}
        <g id="lunarEclipse" transform="translate(225, 275)">
          {/* Full outer halo */}
          <circle cx="0" cy="0" r="70" stroke="#00B3A4" strokeWidth="1" strokeDasharray="3 3" />
          {/* Radiant droplets / dew of heaven */}
          <g fill="#E8D7A6">
            <ellipse cx="-55" cy="-35" rx="3" ry="5" transform="rotate(-30 -55 -35)" />
            <ellipse cx="55" cy="-35" rx="3" ry="5" transform="rotate(30 55 -35)" />
            <ellipse cx="-65" cy="15" rx="3" ry="5" transform="rotate(-15 -65 15)" />
            <ellipse cx="65" cy="15" rx="3" ry="5" transform="rotate(15 65 15)" />
            <ellipse cx="-45" cy="60" rx="3" ry="5" transform="rotate(20 -45 60)" />
            <ellipse cx="45" cy="60" rx="3" ry="5" transform="rotate(-20 45 60)" />
          </g>
          {/* Full Moon Disk */}
          <circle cx="0" cy="0" r="50" fill="#E8D7A6" stroke="#0E1724" strokeWidth="2" />
          {/* Crescent Moon Face Profile */}
          <path
            d="M 5, -45 
               C 35, -25 35, 25 5, 45 
               C 18, 25 18, -25 5, -45 Z"
            fill="#250B30"
            stroke="#00B3A4"
            strokeWidth="1.2"
          />
        </g>

        {/* Two Egyptian Temple Pylons / Watchtowers */}
        {/* Left Tower */}
        <polygon points="65,390 115,390 125,560 55,560" fill="#250B30" stroke="#7A7A7A" strokeWidth="2" />
        <rect x="60" y="380" width="60" height="10" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1.2" />
        <path d="M 80,440 A 8,8 0 0,1 100,440 L 100,470 L 80,470 Z" fill="#00B3A4" />

        {/* Right Tower */}
        <polygon points="335,390 385,390 395,560 325,560" fill="#250B30" stroke="#7A7A7A" strokeWidth="2" />
        <rect x="330" y="380" width="60" height="10" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1.2" />
        <path d="M 350,440 A 8,8 0 0,1 370,440 L 370,470 L 350,470 Z" fill="#00B3A4" />

        {/* The Two Sacred Egyptian Jackals / Anubis Hounds Howling to the Moon */}
        {/* Left Jackal */}
        <g transform="translate(140, 480)" fill="#00B3A4" stroke="#0E1724" strokeWidth="1.2">
          <path d="M 10,70 L 15,35 L 28,15 L 35,5 L 32,18 L 38,20 L 32,32 L 35,70 Z" />
        </g>
        {/* Right Jackal */}
        <g transform="translate(270, 480) scale(-1, 1)" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1.2">
          <path d="M 10,70 L 15,35 L 28,15 L 35,5 L 32,18 L 38,20 L 32,32 L 35,70 Z" />
        </g>

        {/* Primordial Waters / Pool of the Nile at the bottom with Scarab / Crayfish */}
        <path
          d="M 25,560 Q 225,530 425,560 L 425,650 L 25,650 Z"
          fill="#0A1C2A"
          stroke="#00B3A4"
          strokeWidth="1.8"
        />
        {/* Water ripples */}
        <line x1="80" y1="580" x2="370" y2="580" stroke="#00B3A4" strokeWidth="1" strokeDasharray="6 8" opacity="0.7" />
        <line x1="120" y1="605" x2="330" y2="605" stroke="#00B3A4" strokeWidth="1" strokeDasharray="5 7" opacity="0.7" />

        {/* Sacred Egyptian Scarab / Crab rising from the depths */}
        <ellipse cx="225" cy="590" rx="16" ry="12" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1.2" />
        <circle cx="225" cy="580" r="7" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />

        {/* Bottom Cartouche Bar */}
        <rect x="25" y="720" width="400" height="42" fill="#250B30" stroke="#E8D7A6" strokeWidth="2" />
        <text x="225" y="748" fill="#E8D7A6" fontSize="23" fontFamily="'Cinzel', serif" fontWeight="700" letterSpacing="3" textAnchor="middle">
          LA LUNA
        </text>
        <text x="380" y="748" fill="#E8D7A6" fontSize="22" fontFamily="serif" fontWeight="bold">18</text>
      </g>
    </svg>
  );
};
