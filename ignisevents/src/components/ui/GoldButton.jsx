import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function GoldButton({ 
  children, 
  variant = 'primary', 
  size = 'default',
  className,
  ...props 
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black hover:from-amber-400 hover:via-yellow-400 hover:to-amber-500 shadow-lg shadow-amber-500/25',
    outline: 'border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black shadow-sm',
    ghost: 'text-amber-600 hover:bg-amber-500/12',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    default: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'font-semibold rounded-sm uppercase tracking-wider transition-all duration-300',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}