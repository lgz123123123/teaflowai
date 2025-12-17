import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, Sparkles, Scale, JapaneseYen } from 'lucide-react';
import { TeaType, Grade, Language } from '../types';
import { calculateTeaGrade } from '../utils/grader';
import { Button } from './Button';
import { playSoftClick, playConfirmSound } from '../utils/audio';

interface TeaGraderProps {
  isOpen: boolean;
  onClose: () => void;
  teaType: TeaType;
  lang: Language;
  onApply: (grade: Grade) => void;
}

export const TeaGrader: React.FC<TeaGraderProps> = ({ isOpen, onClose, teaType, lang, onApply }) => {
  const [price, setPrice] = useState<string>('');
  const [weight, setWeight] = useState<string>('100'); // Default 100g
  const [result, setResult] = useState<any>(null);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setResult(null);
      setPrice('');
    }
  }, [isOpen]);

  const handleCalculate = () => {
    playSoftClick();
    const p = parseInt(price);
    const w = parseInt(weight);
    if (!isNaN(p) && !isNaN(w)) {
      const res = calculateTeaGrade(teaType, p, w);
      setResult(res);
      if (res?.grade === Grade.IMPERIAL) {
        // Special sound for master grade could go here
        playConfirmSound();
      }
    }
  };

  const getGradeLabel = (g: Grade) => {
    switch (g) {
      case Grade.STANDARD: return lang === 'cn' ? '标准级 (Standard)' : lang === 'jp' ? '並 (Standard)' : 'Standard';
      case Grade.HIGH: return lang === 'cn' ? '特级 (Premium)' : lang === 'jp' ? '上 (Premium)' : 'Premium';
      case Grade.IMPERIAL: return lang === 'cn' ? '大师级 (Master)' : lang === 'jp' ? '極上 (Master)' : 'Master';
      default: return '';
    }
  };

  const labels = {
    title: { en: 'Analyze Grade', jp: '等級判定', cn: '茶叶等级鉴定' },
    price: { en: 'Price (JPY)', jp: '価格 (円)', cn: '价格 (日元)' },
    weight: { en: 'Weight (g)', jp: '内容量 (g)', cn: '重量 (克)' },
    calc: { en: 'Calculate', jp: '判定する', cn: '鉴定' },
    applyStandard: { en: 'Apply Recipe', jp: 'このレシピを使う', cn: '应用此方案' },
    applyMaster: { en: 'Experience Master Brew', jp: '極上の茶体験へ', cn: '体验大师级冲泡' }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate/20 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm bg-rice/95 border border-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-2">
               <div className="flex items-center gap-2 text-moss">
                 <Calculator size={18} />
                 <span className="font-serif font-medium">{labels.title[lang]}</span>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-sage/10 rounded-full transition-colors text-stone">
                 <X size={18} />
               </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-sans uppercase tracking-wider text-stone">{labels.price[lang]}</label>
                  <div className="relative">
                    <JapaneseYen size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage" />
                    <input 
                      type="number" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 bg-white border border-sage/20 rounded-xl text-moss focus:outline-none focus:border-sage transition-colors font-serif tabular-nums"
                      placeholder="2000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-sans uppercase tracking-wider text-stone">{labels.weight[lang]}</label>
                   <div className="relative">
                    <Scale size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sage" />
                    <input 
                      type="number" 
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 bg-white border border-sage/20 rounded-xl text-moss focus:outline-none focus:border-sage transition-colors font-serif tabular-nums"
                      placeholder="100"
                    />
                  </div>
                </div>
              </div>

              {/* Action or Result */}
              {!result ? (
                <Button onClick={handleCalculate} variant="secondary" className="w-full" disabled={!price || !weight}>
                  {labels.calc[lang]}
                </Button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 text-center"
                >
                  <div className="py-4 border-t border-b border-sage/10">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {result.grade === Grade.IMPERIAL ? (
                         <Sparkles className="text-champagne animate-pulse" size={18} />
                      ) : (
                         <span className="w-2 h-2 rounded-full bg-moss/50" />
                      )}
                      <span className="font-sans text-xs uppercase tracking-widest text-stone">Result</span>
                    </div>
                    
                    <h3 className={`font-serif text-2xl mb-2 ${
                      result.grade === Grade.IMPERIAL 
                        ? 'text-gradient-gold animate-shimmer font-bold' 
                        : result.grade === Grade.HIGH 
                          ? 'text-moss font-medium' 
                          : 'text-sage'
                    }`}>
                      {getGradeLabel(result.grade)}
                    </h3>
                    
                    <p className="font-serif text-sm text-stone italic max-w-[240px] mx-auto leading-relaxed">
                      "{result.reasoning[lang]}"
                    </p>
                  </div>

                  <Button 
                    onClick={() => { playConfirmSound(); onApply(result.grade); }} 
                    className={`w-full ${result.grade === Grade.IMPERIAL ? 'bg-champagne hover:bg-[#C5A028] text-white shadow-champagne/30' : ''}`}
                  >
                    {result.grade === Grade.IMPERIAL ? labels.applyMaster[lang] : labels.applyStandard[lang]}
                  </Button>
                  
                  <button 
                    onClick={() => { playSoftClick(); setResult(null); }}
                    className="text-xs text-stone/60 hover:text-stone underline decoration-stone/30"
                  >
                    {lang === 'en' ? 'Recalculate' : lang === 'jp' ? '再計算' : '重新计算'}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};