import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface EditorialSectionRevealProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  showConduit?: boolean; // Subtle editorial thread/line connecting to the previous section
  conduitLabel?: string;
}

/**
 * EditorialSectionReveal
 * 
 * Provides a fluid scroll-driven entrance (fade-in + subtle vertical translation)
 * using framer-motion's useScroll and useTransform linked to the target element's viewport intersection.
 * Connects sections as a continuous unfolding editorial volume rather than disconnected blocks.
 */
export const EditorialSectionReveal: React.FC<EditorialSectionRevealProps> = ({
  children,
  className = '',
  id,
  showConduit = true,
  conduitLabel,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of this specific section relative to viewport:
  // "start end" = top of element enters bottom of viewport
  // "start center" / "start 30%" = top of element reaches upper-middle of viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start 25%'],
  });

  // Smooth fade-in: starts transparent and gradually blooms to full opacity
  const opacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.15, 0.65, 1]);

  // Editorial vertical lift: subtle 38px translation easing into natural position (0px)
  const y = useTransform(scrollYProgress, [0, 1], [38, 0]);

  // Very slight scale breathe (0.988 -> 1) to feel organic and grounded
  const scale = useTransform(scrollYProgress, [0, 1], [0.988, 1]);

  // Conduit line growth for visual continuity between chapters
  const conduitHeight = useTransform(scrollYProgress, [0, 0.6], ['0%', '100%']);
  const conduitGlow = useTransform(scrollYProgress, [0, 0.6, 1], [0.2, 0.8, 0.4]);

  return (
    <div id={id} ref={containerRef} className={`relative ${className}`}>
      {/* Editorial connector conduit (subtle thread joining narrative chapters without overlapping content) */}
      {showConduit && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -top-7 -translate-x-1/2 z-20 flex flex-col items-center select-none"
        >
          <div className="relative w-[1px] h-5 bg-[#7A7A7A]/25 overflow-hidden">
            <motion.div
              style={{ height: conduitHeight, opacity: conduitGlow }}
              className="w-full bg-gradient-to-b from-[#00B3A4]/0 via-[#00B3A4] to-[#E8D7A6]"
            />
          </div>
          {conduitLabel && (
            <span className="px-3 py-0.5 bg-[#0D1B2A]/95 border border-[#7A7A7A]/25 font-mono text-[8px] tracking-[0.28em] uppercase text-[#E8D7A6]/75 shadow-sm whitespace-nowrap">
              {conduitLabel}
            </span>
          )}
        </div>
      )}

      {/* Fluid animated section content */}
      <motion.div
        style={{
          opacity,
          y,
          scale,
        }}
        className="w-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};
