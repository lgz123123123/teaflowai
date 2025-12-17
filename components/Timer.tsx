import React from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  duration: number; // Total duration in seconds
  timeLeft: number; // Current time left in seconds
  isActive: boolean;
  onComplete?: () => void;
  label: string;
}

export const Timer: React.FC<TimerProps> = ({ duration, timeLeft, isActive, label }) => {
  const percentage = Math.max(0, timeLeft / duration);
  // SVG Circle calculation
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (1 - percentage) * circumference;

  return (
    <div className="relative flex items-center justify-center w-80 h-80">
      {/* Outer subtle ring */}
      <div className="absolute inset-0 rounded-full border border-sage/10 scale-110" />
      
      {/* Ripple effects when active */}
      {isActive && (
        <>
          <motion.div 
            className="absolute inset-0 rounded-full border border-sage/20"
            animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div 
            className="absolute inset-0 rounded-full border border-sage/10"
            animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1 }}
          />
        </>
      )}

      {/* SVG Timer */}
      <svg className="transform -rotate-90 w-full h-full drop-shadow-lg">
        {/* Background Circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="2"
          fill="transparent"
          className="text-stone/10"
        />
        {/* Progress Circle */}
        <motion.circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          strokeLinecap="round"
          className="text-sage"
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "linear" }}
        />
      </svg>

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {/* Removed key and animation props to prevent jitter */}
        <span className="text-6xl font-serif text-moss font-light tabular-nums">
          {Math.ceil(timeLeft)}
        </span>
        <motion.span 
          className="text-sm font-sans text-stone mt-2 tracking-widest uppercase"
          animate={{ opacity: isActive ? 1 : 0.7 }}
        >
          {label}
        </motion.span>
      </div>
    </div>
  );
};