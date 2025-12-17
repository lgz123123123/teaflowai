import React from 'react';
import { motion } from 'framer-motion';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-rice pointer-events-none">
      {/* Traditional Pattern Overlay (Seigaiha - Waves) */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='50' viewBox='0 0 100 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 A 50 50 0 0 1 100 50' fill='none' stroke='%235F6F65' stroke-width='1'/%3E%3Cpath d='M0 50 A 40 40 0 0 1 80 50' fill='none' stroke='%235F6F65' stroke-width='1'/%3E%3Cpath d='M0 50 A 30 30 0 0 1 60 50' fill='none' stroke='%235F6F65' stroke-width='1'/%3E%3Cpath d='M0 50 A 20 20 0 0 1 40 50' fill='none' stroke='%235F6F65' stroke-width='1'/%3E%3Cpath d='M0 50 A 10 10 0 0 1 20 50' fill='none' stroke='%235F6F65' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 40px'
        }}
      />

      {/* Primary Blob (Sage) */}
      <motion.div 
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sage/15 rounded-full mix-blend-multiply filter blur-[80px]"
        animate={{
          x: [0, 50, -20, 0],
          y: [0, 30, 10, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Secondary Blob (Moss) */}
      <motion.div 
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-moss/10 rounded-full mix-blend-multiply filter blur-[100px]"
        animate={{
          x: [0, -30, 20, 0],
          y: [0, -50, -20, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Tertiary Blob (Warm/Stone) - Adds balance to the greens */}
      <motion.div 
        className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-[#E6D7C3]/20 rounded-full mix-blend-multiply filter blur-[90px]"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Washi Paper Texture - Subtle Noise */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      
      {/* Vignette for focus */}
      <div className="absolute inset-0 bg-radial-gradient-to-c from-transparent via-transparent to-rice-dark/40" style={{background: 'radial-gradient(circle, transparent 40%, rgba(239, 236, 230, 0.4) 100%)'}}></div>
    </div>
  );
};