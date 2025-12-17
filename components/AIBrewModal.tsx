import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Wind, Key, Check, ShieldCheck } from 'lucide-react';
import { fetchBrewingPlan, getApiKey } from '../utils/aiBrewing';
import { AIBrewingPlan } from '../types';
import { Button } from './Button';
import { playSoftClick, playConfirmSound } from '../utils/audio';

interface AIBrewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated: (plan: AIBrewingPlan) => void;
}

const LOADING_TEXTS = [
  "Sensing the tea leaf...",
  "感知茶性...",
  "Balancing heat and time...",
  "推演水温与平衡...",
  "Crafting the master recipe...",
  "生成大师级方案..."
];

export const AIBrewModal: React.FC<AIBrewModalProps> = ({ isOpen, onClose, onPlanGenerated }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  
  // Key Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [isSystemKey, setIsSystemKey] = useState(false);

  // Check if we have a key on mount/open
  useEffect(() => {
    if (isOpen) {
      // Check for user-overridden key first
      const localKey = localStorage.getItem('TEAFLOW_ZHIPU_KEY');
      
      // Check for environment key
      // @ts-ignore
      const envKey = import.meta.env.VITE_ZHIPU_API_KEY;

      if (localKey) {
        setHasKey(true);
        setTempKey(localKey);
        setIsSystemKey(false);
      } else if (envKey) {
        setHasKey(true);
        setIsSystemKey(true);
        setTempKey(''); // Don't show env key in input for basic privacy
      } else {
        setHasKey(false);
        setIsSystemKey(false);
      }
    }
  }, [isOpen, isSettingsOpen]);

  // Cycle loading texts
  useEffect(() => {
    let interval: number;
    if (isLoading) {
      interval = window.setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    playConfirmSound();
    setIsLoading(true);
    
    try {
      const plan = await fetchBrewingPlan(input);
      // Small artificial delay if API is too fast, to show the animation
      setTimeout(() => {
        onPlanGenerated(plan);
        setIsLoading(false);
        setInput('');
      }, 1000);
    } catch (error) {
      console.error("Failed to generate plan", error);
      setIsLoading(false);
      // In a real app, show error toast
    }
  };

  const handleSaveKey = () => {
    playConfirmSound();
    if (tempKey.trim()) {
      localStorage.setItem('TEAFLOW_ZHIPU_KEY', tempKey.trim());
      setHasKey(true);
      setIsSystemKey(false);
    } else {
      // If clearing the custom key, check if we fall back to system key
      localStorage.removeItem('TEAFLOW_ZHIPU_KEY');
      // @ts-ignore
      const envKey = import.meta.env.VITE_ZHIPU_API_KEY;
      if (envKey) {
        setHasKey(true);
        setIsSystemKey(true);
      } else {
        setHasKey(false);
      }
    }
    setIsSettingsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="absolute inset-0 bg-rice-dark/80 backdrop-blur-md transition-colors"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            className="relative w-full max-w-md bg-rice border border-white/50 rounded-3xl shadow-2xl overflow-hidden min-h-[400px] flex flex-col"
          >
            {/* Top Controls */}
            {!isLoading && (
              <div className="absolute top-0 left-0 right-0 p-6 flex justify-between z-10 pointer-events-none">
                {/* Settings Toggle (Pointer events enabled) */}
                <button 
                  onClick={() => { playSoftClick(); setIsSettingsOpen(!isSettingsOpen); }}
                  className={`pointer-events-auto p-2 rounded-full transition-colors flex items-center gap-2 ${isSettingsOpen ? 'bg-moss text-white' : 'hover:bg-stone/10 text-stone'}`}
                  title="API Key Settings"
                >
                  {isSystemKey && !isSettingsOpen ? <ShieldCheck size={18} className="text-sage" /> : <Key size={18} />}
                  {!hasKey && !isSettingsOpen && <span className="text-[10px] font-bold text-amber-500 animate-pulse">!</span>}
                </button>

                {/* Close Button (Pointer events enabled) */}
                <button 
                  onClick={onClose} 
                  className="pointer-events-auto p-2 hover:bg-stone/10 rounded-full text-stone transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
              
              {/* SETTINGS MODE */}
              {isSettingsOpen ? (
                 <div className="w-full space-y-6">
                    <div className="space-y-2">
                       <h3 className="font-serif text-xl text-moss">API Configuration</h3>
                       <p className="font-sans text-xs text-stone">
                         {isSystemKey 
                           ? "A shared System Key is currently active." 
                           : "Enter your personal Zhipu (GLM-4) Key."}
                       </p>
                    </div>
                    <div className="space-y-4">
                       <div className="relative">
                         <input 
                           type="password"
                           value={tempKey}
                           onChange={(e) => setTempKey(e.target.value)}
                           placeholder={isSystemKey ? "System Key Active (Hidden)" : "Paste key (e.g. 123...456.abc)"}
                           className="w-full p-3 bg-white border border-sage/30 rounded-xl text-moss focus:outline-none focus:border-moss transition-all text-sm font-mono placeholder:text-sage/50"
                         />
                         {isSystemKey && !tempKey && (
                           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                             <span className="flex items-center gap-2 text-sage/60 text-xs bg-white/80 px-2 py-1 rounded">
                               <ShieldCheck size={12} /> Provided by TeaFlow
                             </span>
                           </div>
                         )}
                       </div>

                       <Button onClick={handleSaveKey} className="w-full flex items-center justify-center gap-2">
                         <Check size={16} /> {tempKey ? "Use Custom Key" : "Use System Key"}
                       </Button>
                       
                       <p className="text-[10px] text-stone/50">
                         Any key you enter here is stored only in your browser and overrides the system key.
                       </p>
                    </div>
                 </div>
              ) : (
              
              /* NORMAL MODE (Loading or Input) */
              isLoading ? (
                <div className="flex flex-col items-center justify-center gap-8">
                  {/* Breathing Orb */}
                  <div className="relative">
                    <motion.div 
                      className="w-32 h-32 rounded-full bg-gradient-to-tr from-sage/30 to-champagne/30 blur-xl"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    />
                    <motion.div 
                      className="absolute inset-0 w-32 h-32 rounded-full border border-champagne/20"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: 180
                      }}
                      transition={{ 
                        duration: 8, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                    />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-champagne/60" size={24} />
                  </div>

                  {/* Cycling Text */}
                  <div className="h-6 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.p 
                        key={loadingTextIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="font-serif text-moss text-lg tracking-widest"
                      >
                        {LOADING_TEXTS[loadingTextIndex]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                /* INPUT STATE */
                <div className="w-full space-y-6 pt-6">
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-champagne/20 to-sage/10 rounded-full flex items-center justify-center mx-auto mb-4 text-champagne">
                       <Sparkles size={20} />
                    </div>
                    <h2 className="font-serif text-2xl text-moss">TeaFlow AI</h2>
                    <p className="font-sans text-xs text-stone tracking-wider uppercase">Master Brewer Service</p>
                  </div>

                  <div className="relative group">
                    <textarea 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={hasKey ? "Describe your tea (e.g., 'An aged white tea, feeling sleepy')..." : "System offline. Please configure API Key."}
                      disabled={!hasKey}
                      className="w-full h-32 p-4 bg-white/50 border border-sage/20 rounded-xl text-moss placeholder:text-stone/50 focus:outline-none focus:border-champagne/50 focus:bg-white transition-all resize-none font-serif leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="absolute bottom-3 right-3 text-stone/40">
                      <Wind size={14} />
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmit} 
                    className="w-full bg-gradient-to-r from-moss to-[#4A5D53] hover:to-moss shadow-lg shadow-moss/20 flex items-center justify-center gap-2"
                    disabled={!input.trim() || !hasKey}
                  >
                    <span>{hasKey ? "Craft Recipe" : "Key Missing"}</span>
                    <Send size={14} />
                  </Button>
                </div>
              )
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};