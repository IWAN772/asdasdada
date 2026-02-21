import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function SectionTitle({ 
  title, 
  subtitle, 
  light = false,
  centered = true,
  className 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        'mb-12',
        centered && 'text-center',
        className
      )}
    >
      {subtitle && (
        <span className="text-amber-500 uppercase tracking-[0.3em] text-sm font-medium mb-4 block">
          {subtitle}
        </span>
      )}
      <h2 className={cn(
        'text-3xl md:text-4xl lg:text-5xl font-bold',
        light ? 'text-white' : 'text-white'
      )}>
        {title}
      </h2>
      <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 mt-6 mx-auto" />
    </motion.div>
  );
}