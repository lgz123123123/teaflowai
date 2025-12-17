import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'text';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = '',
  disabled = false
}) => {
  const baseClasses = "relative px-8 py-3 rounded-full font-sans tracking-wide transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-moss text-white shadow-lg shadow-moss/20 hover:bg-moss/90",
    secondary: "bg-white border border-sage/30 text-moss hover:bg-sage/5 hover:border-sage/50",
    text: "text-stone hover:text-moss bg-transparent"
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};