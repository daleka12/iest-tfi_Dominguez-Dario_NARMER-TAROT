import React from 'react';

interface ElEremitaEgyptianCardProps {
  className?: string;
}

/**
 * ElEremitaEgyptianCard
 *
 * Exact high-fidelity vector reproduction of the user's uploaded Egyptian Tarot Card:
 * Arcano IX · EL EREMITA (9.jpeg).
 *
 * Visual Breakdown of the original artwork:
 * - Rounded outer border with turquoise frame and dark indigo inner margin.
 * - Upper register (Deep Violet Night Sky #250B30):
 *   - Golden solar/celestial disk radiating 3 rays of arrows downwards.
 *   - Labyrinthine linear glyph / celestial sigil across the top center.
 *   - Astrological Scorpio/Virgo composite glyph with twin dots on the upper right in gold.
 *   - Crescent / horizontal hoop symbol on the upper left.
 *   - Ornate calligraphic corner flourishes in the upper corners.
 * - Center desert landscape (Midnight Blue starry sky #07101B):
 *   - An ancient Egyptian date palm tree with textured gray trunk and detailed turquoise fronds.
 *   - The Hermit (El Eremita) walking forward towards the right:
 *     - Ancient Egyptian beard and braided nemes-style wig with striped band.
 *     - Broad beaded necklace collar (Wesekh) in deep purple/indigo.
 *     - Flowing turquoise / teal robes with natural fabric folds.
 *     - Deep purple ceremonial cloak hanging from his extended arm.
 *     - Holding a tall turquoise pilgrim staff (was-sceptre hook at top).
 *     - Holding an oil lamp bowl with a tall golden/amber flame in his left hand.
 *     - Bare feet walking upon the boundary line.
 * - Lower register:
 *   - Subterranean crypt niche with horizontal purple and turquoise striped striations.
 *   - Large golden sphere / subterranean moon disk nestled in the center.
 * - Bottom label bar:
 *   - Dark violet banner reading "EL EREMITA" in bold cream serif capitals.
 *   - Mars (♂) and Aries (♈) astrological symbols on the bottom left.
 *   - Hebrew letter Teth (ט) and number '9' on the bottom right.
 */
export const ElEremitaEgyptianCard: React.FC<ElEremitaEgyptianCardProps> = ({
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 450 780"
      className={`w-full h-full ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id="palmTrunkPattern" width="10" height="8" patternUnits="userSpaceOnUse">
          <rect width="10" height="8" fill="#4A4A4A" />
          <polygon points="0,4 5,0 10,4 5,8" fill="#7A7A7A" />
          <polygon points="5,4 10,0 10,8" fill="#2E2E2E" />
        </pattern>
        <clipPath id="eremitaClip">
          <rect x="25" y="25" width="400" height="730" rx="16" />
        </clipPath>
      </defs>

      {/* 1. OUTER CARD BORDER & BASE MARGIN */}
      {/* Outer rounded turquoise border */}
      <rect x="5" y="5" width="440" height="770" rx="28" fill="#00B3A4" />
      {/* Outer dark line */}
      <rect x="18" y="18" width="414" height="744" rx="20" fill="#0E1724" stroke="#E8D7A6" strokeWidth="2.5" />
      {/* Inner card background */}
      <rect x="25" y="25" width="400" height="730" rx="14" fill="#0D1B2A" />

      <g clipPath="url(#eremitaClip)">
        {/* ======================================================== */}
        {/* 2. UPPER REGISTER: CELESTIAL VAULT (DEEP VIOLET)        */}
        {/* ======================================================== */}
        <rect x="25" y="25" width="400" height="175" fill="#250B30" />

        {/* Upper Corner Calligraphic Flourishes in Gold */}
        {/* Top-left flourish */}
        <path
          d="M 45,50 Q 60,32 75,46 Q 80,60 65,65 Q 55,55 62,42"
          stroke="#E8D7A6"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="58" cy="68" r="1.5" fill="#E8D7A6" />

        {/* Top-right flourish */}
        <path
          d="M 405,50 Q 390,32 375,46 Q 370,60 385,65 Q 395,55 388,42"
          stroke="#E8D7A6"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="392" cy="68" r="1.5" fill="#E8D7A6" />

        {/* Geometric Labyrinthine Sigil / Celestial Hieroglyph across top center */}
        <g transform="translate(0, -18)" stroke="#E8D7A6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="miter" fill="none">
          <path d="M 155,75 L 155,95 L 305,95 L 305,80" />
          <path d="M 170,80 L 170,110 L 255,110 L 255,80" />
          <path d="M 190,80 L 190,125 L 285,125 L 285,100" />
          <path d="M 225,125 L 225,55" />
          {/* Arrowhead on top of central vertical axis */}
          <polygon points="225,50 220,60 230,60" fill="#E8D7A6" stroke="#E8D7A6" strokeWidth="1" />
          <line x1="240" y1="80" x2="240" y2="105" />
          <line x1="270" y1="80" x2="270" y2="105" />
          <line x1="290" y1="80" x2="300" y2="80" />
        </g>

        {/* Top-left glyph: elongated oval / sacred arc */}
        <path
          d="M 80,165 C 80,155 130,155 130,165 C 130,175 80,175 80,165 Z"
          stroke="#E8D7A6"
          strokeWidth="2"
          fill="none"
        />

        {/* Top-right glyph: Scorpio/Virgo composite symbol with two dots */}
        <g transform="translate(0, -30)" stroke="#E8D7A6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M 320,155 L 320,200 M 320,165 Q 330,150 340,165 L 340,200 M 340,165 Q 350,150 360,165 L 360,210 Q 360,225 345,220 Q 335,215 345,205 Q 355,200 365,215" />
          <circle cx="370" cy="175" r="3" fill="#E8D7A6" />
          <circle cx="382" cy="175" r="3" fill="#E8D7A6" />
        </g>

        {/* Central Golden Sun Disk with 3 Rays of Arrowheads */}
        <g transform="translate(225, 165)">
          {/* Disk */}
          <circle cx="0" cy="0" r="36" fill="#E8D7A6" stroke="#0E1724" strokeWidth="2" />
          {/* Left downward ray */}
          <line x1="-18" y1="36" x2="-32" y2="100" stroke="#E8D7A6" strokeWidth="2" />
          <polygon points="-22,58 -18,48 -14,58" fill="#E8D7A6" />
          <polygon points="-27,80 -23,70 -19,80" fill="#E8D7A6" />
          <polygon points="-32,100 -28,90 -24,100" fill="#E8D7A6" />

          {/* Middle downward ray */}
          <line x1="0" y1="36" x2="0" y2="100" stroke="#E8D7A6" strokeWidth="2" />
          <polygon points="-4,58 0,48 4,58" fill="#E8D7A6" />
          <polygon points="-4,80 0,70 4,80" fill="#E8D7A6" />
          <polygon points="-4,100 0,90 4,100" fill="#E8D7A6" />

          {/* Right downward ray */}
          <line x1="18" y1="36" x2="32" y2="100" stroke="#E8D7A6" strokeWidth="2" />
          <polygon points="14,58 18,48 22,58" fill="#E8D7A6" />
          <polygon points="19,80 23,70 27,80" fill="#E8D7A6" />
          <polygon points="24,100 28,90 32,100" fill="#E8D7A6" />
        </g>

        {/* Separator beam between Upper Sky and Desert Night */}
        <rect x="25" y="198" width="400" height="4" fill="#0E1724" />

        {/* ======================================================== */}
        {/* 3. MIDDLE REGISTER: DESERT NIGHT & EL EREMITA           */}
        {/* ======================================================== */}
        <rect x="25" y="202" width="400" height="422" fill="#07121E" />

        {/* Shifted main scene, crypt, and bottom cartouche (-125px Y) so full card fits 450x780 viewBox */}
        <g transform="translate(0, -125)">

        {/* Nocturnal stars in the desert sky */}
        <g fill="#FFFFFF" opacity="0.85">
          <circle cx="50" cy="265" r="1.2" />
          <circle cx="85" cy="285" r="1.4" />
          <circle cx="52" cy="455" r="1.6" />
          <line x1="52" y1="450" x2="52" y2="460" stroke="#FFFFFF" strokeWidth="0.6" />
          <line x1="47" y1="455" x2="57" y2="455" stroke="#FFFFFF" strokeWidth="0.6" />
          <circle cx="105" cy="420" r="1.2" />
          <circle cx="130" cy="510" r="1" />
          <circle cx="70" cy="540" r="1.3" />
          <circle cx="95" cy="595" r="1.2" />
          <circle cx="365" cy="275" r="1.3" />
          <circle cx="395" cy="315" r="1.5" />
          <circle cx="340" cy="390" r="1.1" />
          <circle cx="385" cy="440" r="1.4" />
          <circle cx="360" cy="530" r="1.2" />
          <circle cx="380" cy="585" r="1.3" />
          <circle cx="210" cy="300" r="1.2" />
          <circle cx="280" cy="340" r="1.5" />
        </g>

        {/* --- EGYPTIAN DATE PALM TREE --- */}
        <g id="palmTree" transform="translate(60, 400)">
          {/* Palm Trunk (patterned stone-grey column) */}
          <rect x="68" y="145" width="16" height="205" fill="url(#palmTrunkPattern)" stroke="#0E1724" strokeWidth="1.2" />
          <line x1="68" y1="145" x2="68" y2="350" stroke="#00B3A4" strokeWidth="0.8" opacity="0.6" />
          <line x1="84" y1="145" x2="84" y2="350" stroke="#0E1724" strokeWidth="1.2" />

          {/* Date fruit clusters under the crown */}
          <g fill="#A67C52" stroke="#0E1724" strokeWidth="0.8">
            <circle cx="65" cy="150" r="3" />
            <circle cx="69" cy="154" r="3" />
            <circle cx="64" cy="158" r="3" />
            <circle cx="85" cy="150" r="3" />
            <circle cx="89" cy="154" r="3" />
            <circle cx="85" cy="158" r="3" />
          </g>

          {/* Palm Fronds (Turquoise feathered leaves spreading outward) */}
          {/* Left fronds */}
          <path d="M 76,145 Q 35,130 0,160 Q 30,150 76,145 Z" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />
          <path d="M 76,145 Q 40,90 10,110 Q 45,115 76,145 Z" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />
          <path d="M 76,145 Q 60,60 50,45 Q 65,75 76,145 Z" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />

          {/* Center upward fronds */}
          <path d="M 76,145 Q 76,30 76,10 Q 80,45 76,145 Z" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />

          {/* Right fronds */}
          <path d="M 76,145 Q 92,60 102,45 Q 87,75 76,145 Z" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />
          <path d="M 76,145 Q 112,90 142,110 Q 107,115 76,145 Z" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />
          <path d="M 76,145 Q 117,130 152,160 Q 122,150 76,145 Z" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />

          {/* Leaf rib lines */}
          <g stroke="#0E1724" strokeWidth="0.8" opacity="0.7">
            <line x1="76" y1="145" x2="5" y2="155" />
            <line x1="76" y1="145" x2="15" y2="112" />
            <line x1="76" y1="145" x2="76" y2="15" />
            <line x1="76" y1="145" x2="137" y2="112" />
            <line x1="76" y1="145" x2="147" y2="155" />
          </g>
        </g>

        {/* --- EL EREMITA (THE HERMIT PILGRIM) --- */}
        <g id="eremitaFigure">
          {/* 1. Deep Purple Cloak hanging from the extended left arm */}
          <path
            d="M 285,420 
               L 330,425 
               L 358,630 
               L 315,630 
               L 285,480 Z"
            fill="#341344"
            stroke="#0E1724"
            strokeWidth="1.5"
          />
          {/* Cloak inner folds in darker purple */}
          <path d="M 325,425 L 340,630 L 325,630 Z" fill="#200A2C" />
          <line x1="330" y1="425" x2="345" y2="630" stroke="#0E1724" strokeWidth="1.2" />

          {/* 2. Flowing Turquoise Tunic / Robe */}
          <path
            d="M 235,395 
               C 210,405 200,430 215,480 
               C 220,500 215,530 205,560 
               C 195,590 185,630 180,665 
               L 255,650 
               C 275,640 280,600 282,530 
               C 285,470 290,430 285,405 
               Z"
            fill="#00B3A4"
            stroke="#0E1724"
            strokeWidth="1.8"
          />
          {/* Tunic pleats and drapery folds */}
          <g stroke="#0E1724" strokeWidth="1.2">
            <path d="M 220,440 Q 235,470 250,510" fill="none" />
            <path d="M 215,490 Q 235,530 255,570" fill="none" />
            <path d="M 210,540 Q 230,590 245,630" fill="none" />
            <path d="M 255,440 Q 265,510 270,580" fill="none" />
          </g>

          {/* 3. Wesekh Broad Collar (Necklace) */}
          <path
            d="M 220,385 C 235,375 265,375 275,385 L 280,410 C 265,420 230,420 215,410 Z"
            fill="#341344"
            stroke="#0E1724"
            strokeWidth="1.4"
          />
          {/* Beaded necklace rows */}
          <path d="M 220,395 C 235,387 265,387 275,395" stroke="#E8D7A6" strokeWidth="1.2" fill="none" />
          <path d="M 222,403 C 235,397 265,397 273,403" stroke="#00B3A4" strokeWidth="1.2" fill="none" />

          {/* 4. Head, Face & Egyptian Braided Wig */}
          {/* Back of wig */}
          <path
            d="M 225,335 C 215,355 210,385 220,405 L 245,405 C 240,385 240,360 245,340 Z"
            fill="#F4E8D1"
            stroke="#0E1724"
            strokeWidth="1.2"
          />
          {/* Striped Egyptian Nemes / Braided wig texture */}
          <g stroke="#0E1724" strokeWidth="1.2" fill="#F4E8D1">
            <rect x="220" y="340" width="26" height="8" fill="#F4E8D1" />
            <rect x="218" y="348" width="28" height="8" fill="#F4E8D1" />
            <rect x="216" y="356" width="30" height="8" fill="#F4E8D1" />
            <rect x="214" y="364" width="32" height="8" fill="#F4E8D1" />
            <rect x="215" y="372" width="30" height="8" fill="#F4E8D1" />
            <rect x="217" y="380" width="28" height="8" fill="#F4E8D1" />
            <rect x="219" y="388" width="26" height="8" fill="#F4E8D1" />
          </g>

          {/* Profile Head and Face (Looking towards the right) */}
          <path
            d="M 240,335 
               Q 255,330 265,338 
               L 268,355 
               L 272,358 
               L 267,366 
               Q 272,367 270,372 
               L 265,375 
               Q 268,382 265,390 
               L 252,390 
               L 248,375 
               Z"
            fill="#F4E8D1"
            stroke="#0E1724"
            strokeWidth="1.4"
          />
          {/* Egyptian Beard of the Elder Sage */}
          <path
            d="M 252,375 L 265,375 L 267,395 L 255,395 Z"
            fill="#F4E8D1"
            stroke="#0E1724"
            strokeWidth="1.2"
          />
          {/* Beard horizontal grooves */}
          <line x1="255" y1="380" x2="265" y2="380" stroke="#0E1724" strokeWidth="0.8" />
          <line x1="256" y1="385" x2="266" y2="385" stroke="#0E1724" strokeWidth="0.8" />
          <line x1="257" y1="390" x2="266" y2="390" stroke="#0E1724" strokeWidth="0.8" />

          {/* Egyptian Eye in profile with kohl liner */}
          <path d="M 254,354 C 258,350 265,350 268,354 C 265,357 258,357 254,354 Z" fill="#FFFFFF" stroke="#0E1724" strokeWidth="1" />
          <circle cx="261" cy="354" r="2" fill="#0E1724" />
          <line x1="268" y1="354" x2="274" y2="354" stroke="#0E1724" strokeWidth="1.2" />
          <path d="M 253,348 Q 262,346 270,348" stroke="#0E1724" strokeWidth="1.4" fill="none" />

          {/* 5. Right Arm holding the Staff */}
          {/* Upper arm and shoulder */}
          <path
            d="M 268,405 Q 295,415 305,435 L 290,448 Q 280,430 260,420 Z"
            fill="#F4E8D1"
            stroke="#0E1724"
            strokeWidth="1.2"
          />
          {/* Forearm and hand grasping the staff */}
          <path
            d="M 305,435 L 295,465 L 280,460 L 290,435 Z"
            fill="#F4E8D1"
            stroke="#0E1724"
            strokeWidth="1.2"
          />
          {/* Hand clasped around the staff */}
          <ellipse cx="295" cy="450" rx="9" ry="7" fill="#F4E8D1" stroke="#0E1724" strokeWidth="1.2" />
          <line x1="290" y1="447" x2="300" y2="447" stroke="#0E1724" strokeWidth="1" />
          <line x1="290" y1="452" x2="300" y2="452" stroke="#0E1724" strokeWidth="1" />

          {/* 6. The Was-Sceptre Pilgrim Staff in Turquoise */}
          {/* Top Was-sceptre hooked animal head */}
          <path
            d="M 285,395 C 280,365 305,360 300,380 L 295,395 Z"
            fill="#00B3A4"
            stroke="#0E1724"
            strokeWidth="1.4"
          />
          {/* Long staff pole extending down to bottom */}
          <line x1="298" y1="390" x2="340" y2="750" stroke="#00B3A4" strokeWidth="3.5" />
          <line x1="298" y1="390" x2="340" y2="750" stroke="#0E1724" strokeWidth="1" />

          {/* 7. Left Extended Arm holding the Sacred Oil Lamp */}
          {/* Extended arm in profile */}
          <path
            d="M 285,420 L 330,410 L 332,425 L 290,435 Z"
            fill="#F4E8D1"
            stroke="#0E1724"
            strokeWidth="1.2"
          />
          {/* Hand cupping the lamp handle */}
          <path d="M 330,410 L 340,412 L 340,430 L 328,428 Z" fill="#F4E8D1" stroke="#0E1724" strokeWidth="1.2" />
          <line x1="334" y1="416" x2="340" y2="416" stroke="#0E1724" strokeWidth="0.8" />
          <line x1="334" y1="421" x2="340" y2="421" stroke="#0E1724" strokeWidth="0.8" />
          <line x1="334" y1="426" x2="340" y2="426" stroke="#0E1724" strokeWidth="0.8" />

          {/* Sacred Egyptian Oil Lamp with Flame */}
          <g id="hermitLamp" transform="translate(305, 395)">
            {/* Lamp bowl dish */}
            <path
              d="M 0,15 Q 18,12 35,15 L 30,22 Q 18,22 5,20 Z"
              fill="#E8D7A6"
              stroke="#0E1724"
              strokeWidth="1.2"
            />
            {/* The Living Sacred Flame of Wisdom */}
            <path
              d="M 12,12 
                 C 10, -5 18, -30 22, -65 
                 C 25, -45 28, -35 25, -20 
                 C 28, -15 25, 0 16, 12 Z"
              fill="#E8D7A6"
              stroke="#0E1724"
              strokeWidth="1.2"
            />
            {/* Inner flame core in white */}
            <path
              d="M 14,10 
                 C 13, -2 18, -20 20, -45 
                 C 22, -30 23, -20 21, -10 
                 C 22, -5 20, 2 16, 10 Z"
              fill="#FFFFFF"
              opacity="0.9"
            />
          </g>

          {/* 8. Bare Legs in Forward Stride and Feet */}
          {/* Forward Left Leg */}
          <path
            d="M 280,600 L 285,670 L 282,725 L 275,738 L 315,745 L 318,735 L 295,730 L 295,670 L 290,600 Z"
            fill="#F4E8D1"
            stroke="#0E1724"
            strokeWidth="1.4"
          />
          {/* Heel and toes on the baseline */}
          <path d="M 275,738 L 315,745 L 318,735 L 295,730 Z" fill="#F4E8D1" stroke="#0E1724" strokeWidth="1.2" />
          <line x1="310" y1="740" x2="315" y2="740" stroke="#0E1724" strokeWidth="0.8" />
          <line x1="311" y1="743" x2="316" y2="743" stroke="#0E1724" strokeWidth="0.8" />

          {/* Rear Right Leg in Stride */}
          <path
            d="M 195,650 L 175,720 L 165,740 L 195,742 L 185,730 L 188,710 L 205,650 Z"
            fill="#F4E8D1"
            stroke="#0E1724"
            strokeWidth="1.4"
          />
          {/* Back foot */}
          <path d="M 165,740 L 195,742 L 185,730 Z" fill="#F4E8D1" stroke="#0E1724" strokeWidth="1.2" />
        </g>

        {/* Ground Baseline / Horizon Beam */}
        <line x1="25" y1="748" x2="425" y2="748" stroke="#E8D7A6" strokeWidth="2" />

        {/* ======================================================== */}
        {/* 4. LOWER REGISTER: CRYPT WITH HORIZONTAL STRIATIONS     */}
        {/* ======================================================== */}
        <rect x="25" y="750" width="400" height="120" fill="#250B30" />

        {/* Concentric / Horizontal Purple and Turquoise Lines */}
        <g strokeWidth="2.5">
          <line x1="30" y1="755" x2="420" y2="755" stroke="#00B3A4" />
          <line x1="30" y1="762" x2="420" y2="762" stroke="#522368" />
          <line x1="30" y1="769" x2="420" y2="769" stroke="#00B3A4" />
          <line x1="30" y1="776" x2="420" y2="776" stroke="#522368" />
          <line x1="30" y1="783" x2="420" y2="783" stroke="#00B3A4" />
          <line x1="30" y1="790" x2="420" y2="790" stroke="#522368" />
          <line x1="30" y1="797" x2="420" y2="797" stroke="#00B3A4" />
          <line x1="30" y1="804" x2="420" y2="804" stroke="#522368" />
          <line x1="30" y1="811" x2="420" y2="811" stroke="#00B3A4" />
          <line x1="30" y1="818" x2="420" y2="818" stroke="#522368" />
          <line x1="30" y1="825" x2="420" y2="825" stroke="#00B3A4" />
          <line x1="30" y1="832" x2="420" y2="832" stroke="#522368" />
        </g>

        {/* Subterranean Golden Sphere / Midnight Moon Disk */}
        <circle cx="225" cy="795" r="48" fill="#E8D7A6" stroke="#0E1724" strokeWidth="2.5" />

        {/* Lower arched vault border */}
        <path d="M 38,700 L 38,840 L 412,840 L 412,700" stroke="#00B3A4" strokeWidth="2.5" fill="none" />

        {/* ======================================================== */}
        {/* 5. BOTTOM CARTOUCHE: "EL EREMITA", MARS, ARIES, TETH, 9 */}
        {/* ======================================================== */}
        {/* Solid dark violet bottom banner */}
        <rect x="25" y="840" width="400" height="42" fill="#250B30" stroke="#E8D7A6" strokeWidth="2" />

        {/* Left symbols: Mars (♂) and Aries (♈) in cream/gold */}
        <g transform="translate(48, 862)" stroke="#E8D7A6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Mars ♂ */}
          <circle cx="10" cy="5" r="7" />
          <line x1="15" y1="0" x2="24" y2="-9" />
          <line x1="17" y1="-9" x2="24" y2="-9" />
          <line x1="24" y1="-9" x2="24" y2="-2" />

          {/* Aries ♈ */}
          <path d="M 36,9 L 36,-4 Q 31,-12 25,-4 M 36,-4 Q 41,-12 47,-4" />
        </g>

        {/* Center title: "EL EREMITA" in cream bold serif */}
        <text
          x="225"
          y="868"
          fill="#E8D7A6"
          fontSize="23"
          fontFamily="'Cinzel', 'Times New Roman', serif"
          fontWeight="700"
          letterSpacing="3"
          textAnchor="middle"
        >
          EL EREMITA
        </text>

        {/* Right symbols: Hebrew letter Teth (ט) + numeral '9' */}
        <g transform="translate(365, 863)">
          {/* Hebrew letter Teth ט */}
          <path
            d="M 5,5 Q 5,-10 15,-10 L 15,0 Q 15,5 10,5 Q 7,5 7,0 L 7,-5 M 15,-10 Q 23,-10 23,5 L 5,5"
            stroke="#E8D7A6"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Numeral 9 in Egyptian font style */}
          <text
            x="32"
            y="6"
            fill="#E8D7A6"
            fontSize="26"
            fontFamily="serif"
            fontWeight="bold"
          >
            9
          </text>
        </g>
        </g>
      </g>
    </svg>
  );
};
