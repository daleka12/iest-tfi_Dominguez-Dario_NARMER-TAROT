import React from 'react';

interface LaSacerdotisaEgyptianCardProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

/**
 * LaSacerdotisaEgyptianCard
 *
 * Exact high-fidelity vector reproduction of the user's uploaded Egyptian Tarot Card:
 * Arcano II · LA SACERDOTISA (2.jpeg).
 *
 * Visual Breakdown of the original artwork:
 * - Rounded outer border with turquoise frame and dark indigo margin.
 * - Upper register: Midnight starry sky with constellations (Ursa Major / Sirius symbols),
 *   a sacred white Ibis (Thoth) perched on the upper turquoise lintel beam, and astrological glyphs.
 * - Center sanctuary:
 *   - The High Priestess seated in left profile on a carved stone throne with high curved back.
 *   - Headdress: Horns of Hathor cradling the full lunar disk, with tall turquoise plumage / crown.
 *   - Traditional Egyptian braided Nemes wig with striped violet/gold headband.
 *   - Violet ceremonial mantle draped over right shoulder and arm.
 *   - Teal/turquoise pleated gown.
 *   - Right hand holding a golden Ankh (Key of Life) over her heart / breast.
 *   - Left hand resting on papyrus scroll on her lap.
 *   - Flanked by two grand Egyptian lotus/papyrus columns with stone capitals, lotus petal bands,
 *     and diamond/chevron tessellation in turquoise (#00B3A4), violet (#2A0E34), and gold (#E8D7A6).
 * - Lower register:
 *   - Arched subterranean crypt vault with concentric violet/teal radiating lines.
 *   - Two Djed pillars (gray stone and turquoise).
 *   - Number '2' in bottom right corner.
 * - Bottom label bar:
 *   - Dark violet banner reading "LA SACERDOTISA" in cream capital letters.
 *   - Crescent moon symbol on the left, Hebrew letter Beth (ב) and number '2' on the right.
 */
export const LaSacerdotisaEgyptianCard: React.FC<LaSacerdotisaEgyptianCardProps> = ({
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
        {/* Soft shadow for depth */}
        <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00B3A4" floodOpacity="0.3" />
        </filter>
        {/* Stone texture pattern for columns */}
        <pattern id="stoneTexture" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#7A7A7A" fillOpacity="0.35" />
          <circle cx="4" cy="5" r="0.8" fill="#555" opacity="0.6" />
          <circle cx="14" cy="12" r="0.7" fill="#888" opacity="0.7" />
          <circle cx="8" cy="17" r="0.9" fill="#333" opacity="0.5" />
          <circle cx="16" cy="4" r="0.6" fill="#666" opacity="0.6" />
        </pattern>
        <clipPath id="cardInnerClip">
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

      <g clipPath="url(#cardInnerClip)">
        {/* ======================================================== */}
        {/* 2. UPPER REGISTER: STARRY CELESTIAL SKY & ARCHITRAVE   */}
        {/* ======================================================== */}
        <rect x="25" y="25" width="400" height="150" fill="#07101B" />

        {/* Constellation stars (delicate 4-point crosses and points) */}
        <g fill="#FFFFFF" opacity="0.9">
          {/* Star 1 */}
          <circle cx="65" cy="55" r="1.5" />
          <line x1="65" y1="50" x2="65" y2="60" stroke="#FFFFFF" strokeWidth="0.8" />
          <line x1="60" y1="55" x2="70" y2="55" stroke="#FFFFFF" strokeWidth="0.8" />
          {/* Small twinkling stars */}
          <circle cx="120" cy="48" r="1.2" />
          <circle cx="100" cy="85" r="1" />
          <circle cx="140" cy="98" r="1.3" />
          <circle cx="280" cy="52" r="1.2" />
          <circle cx="340" cy="50" r="1.5" />
          <line x1="340" y1="46" x2="340" y2="54" stroke="#FFFFFF" strokeWidth="0.6" />
          <line x1="336" y1="50" x2="344" y2="50" stroke="#FFFFFF" strokeWidth="0.6" />
          <circle cx="380" cy="70" r="1.2" />
          <circle cx="395" cy="95" r="1.4" />
          <circle cx="370" cy="110" r="1" />
        </g>

        {/* Astrological constellation line in the sky (The Lightning / Arrow of Sagittarius / Sirius constellation) */}
        <g stroke="#E8D7A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <circle cx="240" cy="46" r="3" fill="#E8D7A6" />
          <circle cx="245" cy="56" r="3" fill="#E8D7A6" />
          <path d="M 240,46 L 200,68 L 220,78 L 190,92" />
        </g>

        {/* Right celestial glyph: Astrological Jupiter / Leo composite symbol in gold */}
        <g stroke="#E8D7A6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M 330,68 Q 345,60 350,72 Q 355,84 340,88 L 360,88 M 350,72 L 350,92" />
        </g>

        {/* Sacred Ibis Bird (Thoth - God of Wisdom & Writing) perched on the turquoise lintel */}
        <g transform="translate(80, 70)">
          {/* Ibis legs */}
          <line x1="16" y1="28" x2="16" y2="40" stroke="#000000" strokeWidth="1.2" />
          <line x1="22" y1="28" x2="22" y2="40" stroke="#000000" strokeWidth="1.2" />
          {/* Feet */}
          <line x1="13" y1="40" x2="18" y2="40" stroke="#000000" strokeWidth="1.2" />
          <line x1="19" y1="40" x2="24" y2="40" stroke="#000000" strokeWidth="1.2" />
          {/* Body */}
          <ellipse cx="20" cy="22" rx="14" ry="8" fill="#F4EDE0" stroke="#0E1724" strokeWidth="1" />
          {/* Tail feathers in dark indigo */}
          <path d="M 6,22 L 0,26 L 6,26 Z" fill="#0E1724" />
          {/* Neck */}
          <path d="M 28,20 Q 32,14 30,8" stroke="#F4EDE0" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Head */}
          <circle cx="30" cy="7" r="3" fill="#0E1724" />
          {/* Long curved bill */}
          <path d="M 32,7 Q 40,9 44,16" stroke="#0E1724" strokeWidth="1.4" fill="none" />
        </g>

        {/* Turquoise Temple Architrave (Transverse lintel beam) */}
        <rect x="25" y="110" width="400" height="18" fill="#00B3A4" stroke="#0E1724" strokeWidth="2" />
        <line x1="25" y1="113" x2="425" y2="113" stroke="#E8D7A6" strokeWidth="1" opacity="0.6" />

        {/* ======================================================== */}
        {/* 3. MIDDLE REGISTER: SANCTUARY, COLUMNS & PRIESTESS      */}
        {/* ======================================================== */}
        {/* Sanctuary dark purple wall background */}
        <rect x="25" y="128" width="400" height="390" fill="#250B30" />

        {/* --- LEFT EGYPTIAN COLUMN --- */}
        <g transform="translate(38, 128)">
          {/* Top Stone Capital */}
          <rect x="20" y="0" width="60" height="26" fill="url(#stoneTexture)" stroke="#0E1724" strokeWidth="1.8" />
          <rect x="18" y="26" width="64" height="6" fill="#00B3A4" stroke="#0E1724" strokeWidth="1.4" />

          {/* Lotus Capital Petals */}
          <path d="M 20,32 L 20,70 Q 50,78 80,70 L 80,32 Q 50,38 20,32 Z" fill="#00B3A4" stroke="#0E1724" strokeWidth="1.5" />
          {/* Petal decorations */}
          <path d="M 24,34 Q 30,58 35,68 Q 30,48 24,34 Z" fill="#2A0E34" stroke="#0E1724" strokeWidth="1" />
          <path d="M 37,34 Q 50,60 50,72 Q 50,60 63,34 Z" fill="#2A0E34" stroke="#0E1724" strokeWidth="1" />
          <path d="M 76,34 Q 70,58 65,68 Q 70,48 76,34 Z" fill="#2A0E34" stroke="#0E1724" strokeWidth="1" />
          <circle cx="35" cy="40" r="2.5" fill="#E8D7A6" />
          <circle cx="50" cy="40" r="2.5" fill="#E8D7A6" />
          <circle cx="65" cy="40" r="2.5" fill="#E8D7A6" />

          {/* Column Ring Bands */}
          <rect x="25" y="72" width="50" height="8" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1.2" />
          <rect x="25" y="80" width="50" height="12" fill="#00B3A4" stroke="#0E1724" strokeWidth="1.2" />
          {/* Vertical stripes on ring */}
          <line x1="35" y1="80" x2="35" y2="92" stroke="#0E1724" strokeWidth="1" />
          <line x1="45" y1="80" x2="45" y2="92" stroke="#0E1724" strokeWidth="1" />
          <line x1="55" y1="80" x2="55" y2="92" stroke="#0E1724" strokeWidth="1" />
          <line x1="65" y1="80" x2="65" y2="92" stroke="#0E1724" strokeWidth="1" />
          <rect x="25" y="92" width="50" height="8" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1.2" />

          {/* Diamond / Chevron Patterned Column Shaft */}
          <rect x="25" y="100" width="50" height="120" fill="#2A0E34" stroke="#0E1724" strokeWidth="1.5" />
          {/* Upper diamonds */}
          <polygon points="50,102 30,122 50,142 70,122" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />
          <polygon points="50,110 38,122 50,134 62,122" fill="#2A0E34" stroke="#E8D7A6" strokeWidth="0.8" />
          <polygon points="25,122 30,122 25,127" fill="#E8D7A6" />
          <polygon points="75,122 70,122 75,127" fill="#E8D7A6" />
          {/* Middle band */}
          <rect x="25" y="142" width="50" height="8" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1" />
          {/* Lower chevrons */}
          <polygon points="25,150 50,175 75,150" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />
          <polygon points="25,165 50,190 75,165" fill="#2A0E34" stroke="#0E1724" strokeWidth="1" />
          <polygon points="25,180 50,205 75,180" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1" />
          <polygon points="25,195 50,220 75,195" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />

          {/* Column Base Petals & Pedestal */}
          <path d="M 25,220 L 25,260 L 75,260 L 75,220 Z" fill="#00B3A4" stroke="#0E1724" strokeWidth="1.2" />
          <path d="M 28,260 Q 38,230 45,220 Q 35,240 28,260 Z" fill="#2A0E34" stroke="#0E1724" strokeWidth="1" />
          <path d="M 45,260 Q 50,225 55,260 Z" fill="#2A0E34" stroke="#0E1724" strokeWidth="1" />
          <path d="M 72,260 Q 62,230 55,220 Q 65,240 72,260 Z" fill="#2A0E34" stroke="#0E1724" strokeWidth="1" />
          {/* Stone Base Plinth */}
          <rect x="20" y="260" width="60" height="14" fill="url(#stoneTexture)" stroke="#0E1724" strokeWidth="1.5" />
        </g>

        {/* --- RIGHT EGYPTIAN COLUMN --- */}
        <g transform="translate(308, 128)">
          {/* Top Stone Capital */}
          <rect x="20" y="0" width="60" height="26" fill="url(#stoneTexture)" stroke="#0E1724" strokeWidth="1.8" />
          <rect x="18" y="26" width="64" height="6" fill="#00B3A4" stroke="#0E1724" strokeWidth="1.4" />

          {/* Lotus Capital Petals */}
          <path d="M 20,32 L 20,70 Q 50,78 80,70 L 80,32 Q 50,38 20,32 Z" fill="#00B3A4" stroke="#0E1724" strokeWidth="1.5" />
          {/* Petal decorations */}
          <path d="M 24,34 Q 30,58 35,68 Q 30,48 24,34 Z" fill="#2A0E34" stroke="#0E1724" strokeWidth="1" />
          <path d="M 37,34 Q 50,60 50,72 Q 50,60 63,34 Z" fill="#2A0E34" stroke="#0E1724" strokeWidth="1" />
          <path d="M 76,34 Q 70,58 65,68 Q 70,48 76,34 Z" fill="#2A0E34" stroke="#0E1724" strokeWidth="1" />
          <circle cx="35" cy="40" r="2.5" fill="#E8D7A6" />
          <circle cx="50" cy="40" r="2.5" fill="#E8D7A6" />
          <circle cx="65" cy="40" r="2.5" fill="#E8D7A6" />

          {/* Column Ring Bands */}
          <rect x="25" y="72" width="50" height="8" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1.2" />
          <rect x="25" y="80" width="50" height="12" fill="#00B3A4" stroke="#0E1724" strokeWidth="1.2" />
          {/* Vertical stripes on ring */}
          <line x1="35" y1="80" x2="35" y2="92" stroke="#0E1724" strokeWidth="1" />
          <line x1="45" y1="80" x2="45" y2="92" stroke="#0E1724" strokeWidth="1" />
          <line x1="55" y1="80" x2="55" y2="92" stroke="#0E1724" strokeWidth="1" />
          <line x1="65" y1="80" x2="65" y2="92" stroke="#0E1724" strokeWidth="1" />
          <rect x="25" y="92" width="50" height="8" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1.2" />

          {/* Diamond / Chevron Patterned Column Shaft */}
          <rect x="25" y="100" width="50" height="120" fill="#2A0E34" stroke="#0E1724" strokeWidth="1.5" />
          {/* Upper diamonds */}
          <polygon points="50,102 30,122 50,142 70,122" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />
          <polygon points="50,110 38,122 50,134 62,122" fill="#2A0E34" stroke="#E8D7A6" strokeWidth="0.8" />
          <polygon points="25,122 30,122 25,127" fill="#E8D7A6" />
          <polygon points="75,122 70,122 75,127" fill="#E8D7A6" />
          {/* Middle band */}
          <rect x="25" y="142" width="50" height="8" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1" />
          {/* Lower chevrons */}
          <polygon points="25,150 50,175 75,150" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />
          <polygon points="25,165 50,190 75,165" fill="#2A0E34" stroke="#0E1724" strokeWidth="1" />
          <polygon points="25,180 50,205 75,180" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1" />
          <polygon points="25,195 50,220 75,195" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />

          {/* Column Base Petals & Pedestal */}
          <path d="M 25,220 L 25,260 L 75,260 L 75,220 Z" fill="#00B3A4" stroke="#0E1724" strokeWidth="1.2" />
          <path d="M 28,260 Q 38,230 45,220 Q 35,240 28,260 Z" fill="#2A0E34" stroke="#0E1724" strokeWidth="1" />
          <path d="M 45,260 Q 50,225 55,260 Z" fill="#2A0E34" stroke="#0E1724" strokeWidth="1" />
          <path d="M 72,260 Q 62,230 55,220 Q 65,240 72,260 Z" fill="#2A0E34" stroke="#0E1724" strokeWidth="1" />
          {/* Stone Base Plinth */}
          <rect x="20" y="260" width="60" height="14" fill="url(#stoneTexture)" stroke="#0E1724" strokeWidth="1.5" />
        </g>

        {/* --- CARVED STONE THRONE --- */}
        <g id="throne">
          {/* High curved backrest */}
          <path
            d="M 280,240 C 290,260 300,290 285,350 L 280,410 C 275,420 268,430 258,430 L 245,430"
            stroke="#9E9E9E"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 280,240 C 290,260 300,290 285,350 L 280,410 C 275,420 268,430 258,430 L 245,430"
            stroke="#0E1724"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Gold and striped inlays on throne back */}
          <path d="M 270,410 L 290,415 L 285,435 L 265,430 Z" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1" />
          {/* Seat block */}
          <rect x="180" y="420" width="95" height="15" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1.5" />
          {/* Seat apron */}
          <rect x="185" y="435" width="85" height="55" fill="#1A0D22" stroke="#0E1724" strokeWidth="1.5" />
          {/* Front carved throne leg */}
          <path
            d="M 195,435 L 195,470 Q 185,490 190,520 Q 200,530 205,535 L 180,535 Q 182,510 185,490 L 185,435 Z"
            fill="#7A7A7A"
            stroke="#0E1724"
            strokeWidth="1.2"
          />
          {/* Rear throne leg */}
          <path
            d="M 265,435 L 265,470 Q 255,490 260,520 Q 270,530 275,535 L 250,535 Q 252,510 255,490 L 255,435 Z"
            fill="#7A7A7A"
            stroke="#0E1724"
            strokeWidth="1.2"
          />
        </g>

        {/* --- THE HIGH PRIESTESS (LA SACERDOTISA) --- */}
        <g id="priestess">
          {/* 1. Hathor Crown: Tall Turquoise Headdress + Cow Horns + Full Golden Lunar Disk */}
          {/* Tall turquoise crown pillar */}
          <polygon points="212,190 220,110 290,140 255,190" fill="#00B3A4" stroke="#0E1724" strokeWidth="1.5" />
          {/* Horns of Hathor (Embracing Crescent) in deep violet/purple */}
          <path
            d="M 160,95 C 195,170 285,170 300,95 C 285,145 205,145 160,95 Z"
            fill="#2A0E34"
            stroke="#0E1724"
            strokeWidth="1.5"
          />
          {/* Radiant Golden Moon / Solar Disk nestled in the horns */}
          <circle cx="230" cy="138" r="28" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1.8" />
          {/* Back feather / diadem piece */}
          <path d="M 235,165 Q 275,175 295,135 Q 255,145 235,165 Z" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1.2" />

          {/* 2. Egyptian Nemes Headdress & Braided Royal Wig */}
          {/* Striped back of wig */}
          <path
            d="M 210,195 Q 275,200 280,270 L 230,370 Q 220,300 215,250 Z"
            fill="#2A0E34"
            stroke="#0E1724"
            strokeWidth="1.5"
          />
          {/* Wig banded stripes (Turquoise & Gold) */}
          <g stroke="#0E1724" strokeWidth="1">
            <path d="M 225,230 L 265,230 L 265,240 L 225,240 Z" fill="#00B3A4" />
            <path d="M 225,240 L 265,240 L 265,250 L 225,250 Z" fill="#E8D7A6" />
            <path d="M 225,250 L 265,250 L 265,260 L 225,260 Z" fill="#00B3A4" />
            <path d="M 225,260 L 265,260 L 265,270 L 225,270 Z" fill="#E8D7A6" />
            <path d="M 227,270 L 273,270 L 270,285 L 227,285 Z" fill="#00B3A4" />
            <path d="M 228,285 L 270,285 L 266,300 L 228,300 Z" fill="#2A0E34" />
            <path d="M 229,300 L 266,300 L 260,320 L 229,320 Z" fill="#E8D7A6" />
            <path d="M 230,320 L 260,320 L 250,350 L 230,350 Z" fill="#00B3A4" />
          </g>
          {/* Uraeus / Forehead Cobra Crown Ornament */}
          <path d="M 210,248 Q 200,245 204,235 Q 212,238 210,248 Z" fill="#2A0E34" stroke="#0E1724" strokeWidth="1" />

          {/* Front bangs and side lock */}
          <polygon points="190,290 215,260 215,290" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1" />
          <line x1="195" y1="285" x2="215" y2="265" stroke="#0E1724" strokeWidth="1.2" />
          <line x1="202" y1="288" x2="215" y2="272" stroke="#0E1724" strokeWidth="1.2" />

          {/* 3. Priestess Profile Face & Neck (Classic Egyptian Profile) */}
          {/* Skin tone: warm alabaster / parchment */}
          <path
            d="M 215,250 
               L 205,275 
               L 212,282 
               L 202,298 
               Q 214,298 210,305 
               L 205,310 
               Q 216,310 212,316 
               Q 222,328 220,340 
               L 235,340 
               L 235,270 Z"
            fill="#F4E8D1"
            stroke="#0E1724"
            strokeWidth="1.4"
          />
          {/* Almond Egyptian Eye with Kohl liner */}
          <path d="M 210,280 C 215,276 225,276 228,280 C 225,284 215,284 210,280 Z" fill="#FFFFFF" stroke="#0E1724" strokeWidth="1.2" />
          <circle cx="218" cy="280" r="2.5" fill="#0E1724" />
          {/* Kohl cosmetic line extending to temple */}
          <line x1="228" y1="280" x2="236" y2="280" stroke="#0E1724" strokeWidth="1.4" />
          {/* Eyebrow */}
          <path d="M 209,275 Q 222,272 233,275" stroke="#0E1724" strokeWidth="1.6" fill="none" />
          {/* Ear with gold earring */}
          <ellipse cx="230" cy="295" rx="3.5" ry="5.5" fill="#F4E8D1" stroke="#0E1724" strokeWidth="1" />
          <circle cx="230" cy="301" r="2" fill="#E8D7A6" stroke="#0E1724" strokeWidth="0.8" />

          {/* Broad Wesekh Collar (Necklace) */}
          <path d="M 215,335 C 235,340 250,340 260,335 L 260,355 C 245,362 230,362 215,355 Z" fill="#00B3A4" stroke="#0E1724" strokeWidth="1.2" />
          <line x1="230" y1="337" x2="230" y2="359" stroke="#E8D7A6" strokeWidth="1" />
          <line x1="245" y1="337" x2="245" y2="359" stroke="#E8D7A6" strokeWidth="1" />

          {/* 4. Torso & Arms */}
          {/* Upper chest and left shoulder profile */}
          <path
            d="M 215,355 C 205,370 205,390 220,405 C 240,415 255,410 265,395 C 265,370 260,355 260,355 Z"
            fill="#F4E8D1"
            stroke="#0E1724"
            strokeWidth="1.2"
          />

          {/* Right Arm: Draped in Purple Mantle holding the Ankh */}
          <path
            d="M 175,355 Q 165,385 150,420 L 175,440 L 210,385 Q 200,365 175,355 Z"
            fill="#522368"
            stroke="#0E1724"
            strokeWidth="1.5"
          />
          {/* Purple mantle draped over lap & shoulder */}
          <path
            d="M 150,420 
               Q 135,460 115,505 
               L 135,530 
               L 175,470 
               L 185,420 Z"
            fill="#522368"
            stroke="#0E1724"
            strokeWidth="1.5"
          />
          {/* Mantle folds and fringe */}
          <line x1="120" y1="490" x2="150" y2="450" stroke="#2A0E34" strokeWidth="1.2" />
          <line x1="130" y1="510" x2="160" y2="470" stroke="#2A0E34" strokeWidth="1.2" />

          {/* Hand holding the Ankh Key of Life */}
          <path d="M 210,385 L 230,378 L 235,390 L 215,395 Z" fill="#F4E8D1" stroke="#0E1724" strokeWidth="1" />
          {/* Fingers clasped */}
          <path d="M 225,380 Q 235,382 232,392" stroke="#0E1724" strokeWidth="1" fill="none" />

          {/* Sacred Golden Ankh (Key of Life) over heart */}
          <g transform="translate(232, 388)">
            {/* Ankh loop */}
            <ellipse cx="0" cy="-10" rx="6" ry="8" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1.4" />
            <ellipse cx="0" cy="-10" rx="3" ry="5" fill="#0D1B2A" stroke="#0E1724" strokeWidth="1.2" />
            {/* Crossbar */}
            <line x1="-8" y1="-2" x2="8" y2="-2" stroke="#E8D7A6" strokeWidth="3" />
            <line x1="-8" y1="-2" x2="8" y2="-2" stroke="#0E1724" strokeWidth="1.2" />
            {/* Vertical stem */}
            <line x1="0" y1="-2" x2="0" y2="18" stroke="#E8D7A6" strokeWidth="3.2" strokeLinecap="round" />
            <line x1="0" y1="-2" x2="0" y2="18" stroke="#0E1724" strokeWidth="1.2" strokeLinecap="round" />
          </g>

          {/* Left Arm: Resting on Papyrus Scroll on Lap */}
          <path
            d="M 260,375 Q 268,410 250,440 L 210,480 L 195,470 L 235,430 Q 248,405 245,375 Z"
            fill="#F4E8D1"
            stroke="#0E1724"
            strokeWidth="1.2"
          />
          {/* Armband (armilla) */}
          <rect x="250" y="395" width="14" height="6" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />
          <line x1="250" y1="398" x2="264" y2="398" stroke="#E8D7A6" strokeWidth="1" />

          {/* Hand resting on the scroll */}
          <path d="M 195,470 Q 185,480 180,488 Q 192,492 205,480 Z" fill="#F4E8D1" stroke="#0E1724" strokeWidth="1" />

          {/* Papyrus Scroll (TORA / Book of Secret Wisdom) */}
          <g transform="translate(170, 455) rotate(-15)">
            <rect x="0" y="0" width="60" height="22" rx="3" fill="#E8D7A6" stroke="#0E1724" strokeWidth="1.4" />
            {/* Scroll text markings */}
            <line x1="8" y1="6" x2="52" y2="6" stroke="#7A7A7A" strokeWidth="1" strokeDasharray="3 2" />
            <line x1="8" y1="11" x2="48" y2="11" stroke="#7A7A7A" strokeWidth="1" strokeDasharray="4 2" />
            <line x1="8" y1="16" x2="38" y2="16" stroke="#7A7A7A" strokeWidth="1" strokeDasharray="3 3" />
          </g>

          {/* 5. Gown, Seated Legs and Bare Feet */}
          {/* Turquoise pleated long dress */}
          <path
            d="M 215,405 
               Q 180,420 155,470 
               L 135,530 
               L 165,585 
               L 190,580 
               L 185,500 
               Q 230,470 245,430 Z"
            fill="#00B3A4"
            stroke="#0E1724"
            strokeWidth="1.5"
          />
          {/* Pleat lines on dress */}
          <g stroke="#0E1724" strokeWidth="1" opacity="0.6">
            <line x1="160" y1="480" x2="140" y2="540" />
            <line x1="170" y1="490" x2="150" y2="555" />
            <line x1="180" y1="500" x2="162" y2="570" />
            <line x1="190" y1="510" x2="175" y2="580" />
          </g>

          {/* Lower legs extending forward and bare feet */}
          <path
            d="M 135,530 
               L 130,600 
               L 110,615 
               L 95,620 
               L 95,612 
               L 115,605 
               L 125,560 
               Z"
            fill="#F4E8D1"
            stroke="#0E1724"
            strokeWidth="1.4"
          />
          {/* Second foot behind */}
          <path
            d="M 140,560 
               L 140,605 
               L 125,620 
               L 108,620 
               L 120,610 
               L 132,560 Z"
            fill="#E5D6BD"
            stroke="#0E1724"
            strokeWidth="1"
          />
          {/* Toe details */}
          <line x1="97" y1="616" x2="104" y2="616" stroke="#0E1724" strokeWidth="0.8" />
          <line x1="98" y1="618" x2="105" y2="618" stroke="#0E1724" strokeWidth="0.8" />
        </g>

        {/* Temple Stone Platform Floor */}
        <rect x="25" y="600" width="400" height="24" fill="url(#stoneTexture)" stroke="#0E1724" strokeWidth="2" />
        <line x1="25" y1="600" x2="425" y2="600" stroke="#E8D7A6" strokeWidth="1.2" />

        {/* ======================================================== */}
        {/* 4. LOWER REGISTER: CRYPT VAULT, DJED PILLARS & NUMERAL  */}
        {/* ======================================================== */}
        {/* Deep Midnight Crypt Background */}
        <rect x="25" y="624" width="400" height="96" fill="#12061A" />

        {/* Arched concentric vault lines radiating downwards in violet & teal */}
        <path
          d="M 40,720 C 40,630 410,630 410,720"
          stroke="#00B3A4"
          strokeWidth="3"
          fill="#250B30"
        />
        <path
          d="M 70,720 C 70,645 380,645 380,720"
          stroke="#522368"
          strokeWidth="4"
          fill="#1A0D24"
        />
        <path
          d="M 100,720 C 100,660 350,660 350,720"
          stroke="#00B3A4"
          strokeWidth="1.8"
          fill="#0D1B2A"
        />

        {/* Diagonal radiation shading lines in the arch vault */}
        <g stroke="#2A0E34" strokeWidth="1" opacity="0.8">
          <line x1="70" y1="680" x2="120" y2="650" />
          <line x1="90" y1="695" x2="150" y2="655" />
          <line x1="110" y1="710" x2="180" y2="660" />
          <line x1="380" y1="680" x2="330" y2="650" />
          <line x1="360" y1="695" x2="300" y2="655" />
          <line x1="340" y1="710" x2="270" y2="660" />
        </g>

        {/* Central Subterranean Djed Pillar 1 (Stone Gray) */}
        <g transform="translate(180, 642)">
          {/* Base */}
          <rect x="5" y="62" width="20" height="8" fill="#7A7A7A" stroke="#0E1724" strokeWidth="1" />
          {/* Stem */}
          <rect x="9" y="24" width="12" height="42" fill="#7A7A7A" stroke="#0E1724" strokeWidth="1" />
          {/* 4 Horizontal crossbars of Stability */}
          <rect x="2" y="18" width="26" height="5" fill="#7A7A7A" stroke="#0E1724" strokeWidth="1" />
          <rect x="3" y="12" width="24" height="5" fill="#7A7A7A" stroke="#0E1724" strokeWidth="1" />
          <rect x="4" y="6" width="22" height="5" fill="#7A7A7A" stroke="#0E1724" strokeWidth="1" />
          <rect x="5" y="0" width="20" height="5" fill="#7A7A7A" stroke="#0E1724" strokeWidth="1" />
        </g>

        {/* Central Subterranean Djed Pillar 2 (Turquoise) */}
        <g transform="translate(230, 642)">
          {/* Base */}
          <rect x="5" y="62" width="20" height="8" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />
          {/* Stem */}
          <rect x="9" y="24" width="12" height="42" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />
          {/* 4 Horizontal crossbars of Stability */}
          <rect x="2" y="18" width="26" height="5" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />
          <rect x="3" y="12" width="24" height="5" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />
          <rect x="4" y="6" width="22" height="5" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />
          <rect x="5" y="0" width="20" height="5" fill="#00B3A4" stroke="#0E1724" strokeWidth="1" />
        </g>

        {/* Subterranean Corner Number '2' */}
        <text
          x="392"
          y="705"
          fill="#E8D7A6"
          fontSize="36"
          fontFamily="serif"
          fontWeight="bold"
          textAnchor="middle"
        >
          2
        </text>

        {/* Crypt perimeter frame border */}
        <path d="M 38,650 L 38,715 L 412,715 L 412,650" stroke="#00B3A4" strokeWidth="2" fill="none" />

        {/* ======================================================== */}
        {/* 5. BOTTOM CARTOUCHE: "LA SACERDOTISA", MOON, BETH, '2'   */}
        {/* ======================================================== */}
        {/* Solid dark violet bottom banner */}
        <rect x="25" y="715" width="400" height="40" fill="#250B30" stroke="#E8D7A6" strokeWidth="2" />

        {/* Left emblem: Crescent Moon in gold */}
        <g transform="translate(45, 735)">
          <path
            d="M 12,-12 A 12,12 0 1,0 12,12 A 10,10 0 1,1 12,-12 Z"
            fill="#E8D7A6"
            stroke="#0E1724"
            strokeWidth="0.8"
          />
        </g>

        {/* Center title: "LA SACERDOTISA" in cream bold serif */}
        <text
          x="220"
          y="742"
          fill="#E8D7A6"
          fontSize="24"
          fontFamily="'Cinzel', 'Times New Roman', serif"
          fontWeight="700"
          letterSpacing="3"
          textAnchor="middle"
        >
          LA SACERDOTISA
        </text>

        {/* Right symbols: Hebrew letter Beth (ב) + numeral '2' */}
        <g transform="translate(372, 735)">
          {/* Hebrew letter Beth ב */}
          <path
            d="M 2,-10 L 16,-10 L 16,8 L -2,8 L -2,5 L 12,5 L 12,-7 L 2,-7 Z"
            fill="#E8D7A6"
          />
          {/* Numeral 2 */}
          <text
            x="28"
            y="7"
            fill="#E8D7A6"
            fontSize="24"
            fontFamily="serif"
            fontWeight="bold"
          >
            2
          </text>
        </g>
      </g>
    </svg>
  );
};
