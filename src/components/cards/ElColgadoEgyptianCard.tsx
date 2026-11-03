import React from 'react';

export const ElColgadoEgyptianCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [imgError, setImgError] = React.useState(false);

  if (!imgError) {
    return (
      <img
        src="./cards/12.jpg"
        alt="Arcano XII · El Colgado (El Apostolado)"
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
        <clipPath id="colgadoClip">
          <rect x="25" y="25" width="400" height="730" rx="16" />
        </clipPath>
      </defs>
      <rect x="5" y="5" width="440" height="770" rx="28" fill="#00B3A4" />
      <rect x="18" y="18" width="414" height="744" rx="20" fill="#0E1724" stroke="#E8D7A6" strokeWidth="2.5" />
      <rect x="25" y="25" width="400" height="730" rx="14" fill="#0D1B2A" />

      <g clipPath="url(#colgadoClip)">
        {/* Upper celestial sky */}
        <rect x="25" y="25" width="400" height="200" fill="#250B30" />
        <g fill="#FFFFFF" opacity="0.8">
          <circle cx="80" cy="65" r="1.5" />
          <circle cx="370" cy="70" r="1.5" />
        </g>
        <circle cx="225" cy="80" r="28" stroke="#00B3A4" strokeWidth="2" fill="#E8D7A6" fillOpacity="0.25" />

        {/* Separator */}
        <rect x="25" y="225" width="400" height="4" fill="#0E1724" />

        {/* Sanctuary and T-cross gallows */}
        <rect x="25" y="229" width="400" height="520" fill="#07121E" />

        {/* Living Egyptian Wooden Columns / Gallows */}
        <g stroke="#7A7A7A" strokeWidth="12" strokeLinecap="round">
          <line x1="110" y1="260" x2="110" y2="640" />
          <line x1="340" y1="260" x2="340" y2="640" />
          <line x1="90" y1="260" x2="360" y2="260" />
        </g>
        {/* Vine / papyrus sproutings */}
        <g stroke="#00B3A4" strokeWidth="2" fill="none">
          <path d="M 110,320 Q 95,310 90,325" />
          <path d="M 110,420 Q 85,410 90,430" />
          <path d="M 340,320 Q 355,310 360,325" />
          <path d="M 340,420 Q 365,410 360,430" />
        </g>

        {/* Suspended Figure with Golden Halo */}
        <g id="suspendedFigure">
          {/* Suspension cord in turquoise */}
          <line x1="225" y1="260" x2="225" y2="340" stroke="#00B3A4" strokeWidth="4" />

          {/* Golden Radiant Halo around head */}
          <circle cx="225" cy="565" r="32" fill="#E8D7A6" opacity="0.9" />
          <circle cx="225" cy="565" r="40" stroke="#00B3A4" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Inverted Head in profile */}
          <circle cx="225" cy="565" r="20" fill="#F4E8D1" stroke="#0E1724" strokeWidth="1.4" />
          {/* Hair flowing downwards */}
          <path d="M 210,575 Q 225,615 240,575" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1.2" />

          {/* Tunic in Turquoise */}
          <path d="M 200,430 L 250,430 L 245,540 L 205,540 Z" fill="#00B3A4" stroke="#0E1724" strokeWidth="1.6" />

          {/* Arms folded behind back in equilateral triangle */}
          <path d="M 205,460 L 175,490 L 205,520" stroke="#F4E8D1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 245,460 L 275,490 L 245,520" stroke="#F4E8D1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

          {/* Crossed Legs (Right suspended straight, left crossed forming numeral 4) */}
          <line x1="225" y1="340" x2="225" y2="430" stroke="#F4E8D1" strokeWidth="12" strokeLinecap="round" />
          <path d="M 225,385 L 280,385 L 225,430" stroke="#522368" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Lower Ground Baseline */}
        <line x1="25" y1="640" x2="425" y2="640" stroke="#E8D7A6" strokeWidth="2" />
        <rect x="25" y="642" width="400" height="78" fill="#1A0D22" />
        <text x="390" y="695" fill="#E8D7A6" fontSize="32" fontFamily="serif" fontWeight="bold" textAnchor="middle">12</text>

        {/* Bottom Cartouche Bar */}
        <rect x="25" y="720" width="400" height="42" fill="#250B30" stroke="#E8D7A6" strokeWidth="2" />
        <text x="225" y="748" fill="#E8D7A6" fontSize="23" fontFamily="'Cinzel', serif" fontWeight="700" letterSpacing="3" textAnchor="middle">
          EL COLGADO
        </text>
        <text x="380" y="748" fill="#E8D7A6" fontSize="22" fontFamily="serif" fontWeight="bold">12</text>
      </g>
    </svg>
  );
};
