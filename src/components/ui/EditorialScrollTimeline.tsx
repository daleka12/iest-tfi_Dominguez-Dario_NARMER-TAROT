import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

/**
 * EditorialScrollTimeline
 *
 * A refined, minimalist timeline progress bar positioned at the extreme top of the viewport.
 * Uses Framer Motion's useScroll with physics-based spring damping for an organic, paper-weight scroll sensation.
 * Rendered with the official brand palette:
 * - Base track: Faint Egyptian stone grey (#7A7A7A / 15%)
 * - Active progress line: Gradient spanning Night Blue (#0D1B2A), Deep Violet (#2A0E34), Turquoise (#00B3A4), and Cream/Gold (#E8D7A6)
 * - Leading celestial cursor: Microscopic radiant point with a subtle turquoise halo marking the exact reading coordinate
 */
export const EditorialScrollTimeline: React.FC = () => {
  const { scrollYProgress } = useScroll();

  // Smooth out rapid scrolling gestures with editorial inertia
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  // Calculate percentage for subtle Roman chapter indicator or glow intensity
  const glowOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 0.8, 0.8, 1]);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none select-none h-[2px]"
    >
      {/* Background guide track (analog editorial hairline) */}
      <div className="absolute inset-0 bg-[#7A7A7A]/15 backdrop-blur-[1px]" />

      {/* Primary dynamic progress line */}
      <motion.div
        style={{ scaleX }}
        className="h-full origin-left bg-gradient-to-r from-[#2A0E34] via-[#00B3A4] to-[#E8D7A6] relative"
      >
        {/* Subtle leading aura / astrolabe spark at the frontier */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#E8D7A6] -mr-1 shadow-[0_0_8px_#00B3A4,0_0_14px_rgba(232,215,166,0.8)]"
        />
      </motion.div>
    </div>
  );
};
