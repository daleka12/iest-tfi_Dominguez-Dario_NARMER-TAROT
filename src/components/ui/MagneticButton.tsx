import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  strength?: number; // Distance multiplier for attraction (default: 0.28)
  radius?: number; // Detection radius in px beyond element bounds (default: 80)
  ariaLabel?: string;
}

/**
 * MagneticButton
 *
 * Implements a subtle physical magnetic attraction pull towards the user's cursor
 * when hovered or when the pointer enters its immediate orbital proximity.
 * Uses Framer Motion springs for physical inertia, dampening, and smooth release.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  strength = 0.28,
  radius = 65,
  ariaLabel,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Physics-based spring values for smooth magnetic pull and elastic release
  const springConfig = { damping: 18, stiffness: 180, mass: 0.4 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      aria-label={ariaLabel}
      className={`relative inline-flex items-center justify-center transition-shadow duration-300 ${className} ${
        isHovered ? 'md:cursor-none' : ''
      }`}
    >
      {/* Subtle internal magnetic sheen / reflection shift */}
      <span className="relative z-10 flex items-center justify-center w-full gap-2">
        {children}
      </span>
    </motion.button>
  );
};
