import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface LiveProjectButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  label?: string;
  onClick?: () => void;
  className?: string;
  showIcon?: boolean;
}

export const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  label = 'Live Project',
  onClick,
  className = '',
  showIcon = true,
  ...props
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", damping: 25, stiffness: 380 }}
      className={`group relative inline-flex items-center gap-2 rounded-full border border-[#D7E2EA]/40 text-[#D7E2EA] font-forma font-semibold uppercase tracking-wider cursor-pointer select-none transition-all duration-150 hover:bg-[#D7E2EA]/10 hover:border-white apple-press px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm ${className}`}
      aria-label={label}
      {...props}
    >
      <span>{label}</span>
      {showIcon && (
        <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#00F0FF]" />
      )}
    </motion.button>
  );
};
