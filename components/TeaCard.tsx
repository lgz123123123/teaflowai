import React from 'react';
import { motion } from 'framer-motion';

interface TeaCardProps {
  name: string;
  subtitle: string;
  onClick: () => void;
  selected?: boolean;
  icon?: React.ReactNode;
}

export const TeaCard: React.FC<TeaCardProps> = ({ name, subtitle, onClick, selected, icon }) => {
  // Simple heuristic: if subtitle contains non-ASCII characters (likely CJK), reduce tracking
  const isCJK = /[^\u0000-\u007F]/.test(subtitle);
  const trackingClass = isCJK ? 'tracking-normal' : 'tracking-widest';

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`
        cursor-pointer relative overflow-hidden
        w-full p-8 rounded-2xl border transition-all duration-500
        flex flex-col items-center justify-center gap-4 text-center group
        ${selected 
          ? 'bg-sage/10 border-sage/50 shadow-xl shadow-sage/10' 
          : 'bg-white/60 border-white/50 shadow-sm hover:shadow-md hover:bg-white/80'
        }
      `}
    >
      <div className={`
        text-4xl transition-colors duration-500
        ${selected ? 'text-moss' : 'text-sage/60 group-hover:text-sage'}
      `}>
        {icon}
      </div>
      <div>
        <h3 className="font-serif text-2xl text-moss mb-1 leading-relaxed">{name}</h3>
        <p className={`font-sans text-sm text-stone uppercase ${trackingClass}`}>{subtitle}</p>
      </div>
    </motion.div>
  );
};