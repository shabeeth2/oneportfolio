import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ContactButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  label?: string;
  onClick?: () => void;
  className?: string;
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  label = 'Contact Me',
  onClick,
  className = '',
  ...props
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", damping: 25, stiffness: 400 }}
      className={`relative inline-flex items-center justify-center rounded-full text-white font-forma font-semibold uppercase tracking-widest cursor-pointer select-none transition-shadow duration-150 px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base apple-press ${className}`}
      style={{
        background: 'linear-gradient(123deg, #1C0508 7%, #E11D48 37%, #BE123C 68%, #D97706 100%)',
        boxShadow: '0px 4px 14px rgba(225, 29, 72, 0.35), inset 0px 1px 1px rgba(255, 255, 255, 0.4), inset 2px 2px 10px rgba(190, 18, 60, 0.7)',
        outline: '1.5px solid rgba(255, 255, 255, 0.9)',
        outlineOffset: '-2px',
      }}
      aria-label={label}
      {...props}
    >
      <span className="relative z-10 drop-shadow-sm">{label}</span>
    </motion.button>
  );
};
