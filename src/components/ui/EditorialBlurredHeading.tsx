import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface EditorialBlurredHeadingProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  delay?: number;
  duration?: number;
  blurAmount?: number; // Initial blur in px (default 12)
  yOffset?: number; // Subtle lift in px (default 16)
}

/**
 * EditorialBlurredHeading
 *
 * Implements a gradual optical print reveal for serif headings.
 * Simulates high-end editorial gravure printing / analog optical lens focusing
 * as the element crosses the viewport:
 * - Starts at blur(12px), opacity 0, and slight vertical offset (+16px)
 * - Gradually sharpens to blur(0px), opacity 1, and natural baseline (0px)
 * - Triggered with once: true and generous margin for seamless viewing
 */
export const EditorialBlurredHeading: React.FC<EditorialBlurredHeadingProps> = ({
  children,
  as: Component = 'h2',
  className = '',
  delay = 0.08,
  duration = 1.15,
  blurAmount = 12,
  yOffset = 16,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-10% 0px -10% 0px',
  });

  const MotionComponent = motion[Component] as typeof motion.h2;

  return (
    <div ref={ref} className="inline-block w-full">
      <MotionComponent
        initial={{
          opacity: 0,
          filter: `blur(${blurAmount}px)`,
          y: yOffset,
        }}
        animate={
          isInView
            ? {
                opacity: 1,
                filter: 'blur(0px)',
                y: 0,
              }
            : {
                opacity: 0,
                filter: `blur(${blurAmount}px)`,
                y: yOffset,
              }
        }
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1], // Smooth editorial cubic bezier
        }}
        className={className}
      >
        {children}
      </MotionComponent>
    </div>
  );
};
