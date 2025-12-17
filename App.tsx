import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Leaf, Droplets, Thermometer, ArrowRight, RotateCcw, Globe, Sparkles, Plus, Minus, Lock, Unlock, RefreshCw, ChevronLeft, Clock, Calculator } from 'lucide-react';

import { TEA_DATA } from './constants';
import { UI_TRANSLATIONS } from './i18n';
import { TeaType, Grade, TeaGradeProfile, Language, Steep } from './types';
import { Background } from './components/Background';
import { TeaCard } from './components/TeaCard';
import { Button } from './components/Button';
import { Timer } from './components/Timer';
import { TeaGrader } from './components/TeaGrader'; // Imported
import { playGentleBell, playSoftClick, playConfirmSound } from './utils/audio';

type AppStage = 'tea-select' | 'grade-select' | 'prep' | 'brewing' | 'finish';

interface BrewConfig {
  waterTemperature: number;
  leafAmount: number;
  waterAmount: number;
  steeps: Steep[];
}

// More dynamic transitions
const pageVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, filter: 'blur(5px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, scale: 1.05, filter: 'blur(5px)', transition: { duration: 0.3 } }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// --- Custom Icons ---

interface OrganicIconProps {
  variant: 'standard' | 'high' | 'imperial';
  teaType?: TeaType; // Added teaType to distinguish styles
  className?: string;
}

const OrganicIcon = ({ variant, teaType, className }: OrganicIconProps) => {
  // Default to Gyokuro style if not specified (soft/round)
  const isSencha = teaType === TeaType.SENCHA;

  const pathVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { duration: 1.5, ease: "easeInOut" } }
  };

  const accentVariants: Variants = {
    hidden: { scale: 0, opacity: 0, y: 5 },
    visible: { scale: 1, opacity: 1, y: 0, transition: { delay: 0.8, type: "spring", stiffness: 200, damping: 10 } }
  };

  // Subtle floating animation for the entire icon
  const floatVariants: Variants = {
    animate: { 
      y: [0, -3, 0],
      transition: { duration: 5, repeat: Infinity, ease: "easeInOut" } 
    }
  };

  return (
    <motion.svg 
      viewBox="0 0 24 24" 
      className={className}
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      initial="hidden"
      animate="visible"
      whileHover="animate"
    >
      <motion.g variants={floatVariants} animate="animate">
        
        {/* SENCHA ICONS (Sharp, Needle-like, Sun) */}
        {isSencha && (
          <>
            {variant === 'standard' && (
              <>
                {/* Single Sharp Needle - More geometric and straight for Sencha */}
                <motion.path 
                  d="M12 21 L11 6 L12 2 L13 6 L12 21 Z" 
                  variants={pathVariants} 
                />
                <motion.path d="M12 16 V 6" variants={pathVariants} transition={{ delay: 0.2 }} />
              </>
            )}

            {variant === 'high' && (
              <>
                {/* Two Crossed Needles */}
                {/* Left leaning */}
                <motion.path d="M13 21 L9.5 6 L10 2" variants={pathVariants} />
                {/* Right leaning */}
                <motion.path d="M11 21 L14.5 6 L14 2" variants={pathVariants} transition={{ delay: 0.2 }} />
                {/* Connecting stem hint */}
                <motion.path d="M12 22 V 18" variants={pathVariants} />
              </>
            )}

            {variant === 'imperial' && (
              <>
                {/* Radiant Needles (Sun motif) */}
                <motion.path d="M12 21 L12 8" variants={pathVariants} />
                <motion.path d="M12 21 L7 10" variants={pathVariants} transition={{ delay: 0.1 }} />
                <motion.path d="M12 21 L17 10" variants={pathVariants} transition={{ delay: 0.1 }} />
                
                {/* Sun / Brilliance Dot at the top */}
                <motion.circle 
                  cx="12" cy="4" r="2" 
                  fill="currentColor" fillOpacity="0.8"
                  stroke="none"
                  variants={accentVariants} 
                />
                {/* Halo Ring (Subtle) */}
                <motion.path 
                  d="M8 5 C8 5 10 3 12 3 C14 3 16 5 16 5" 
                  strokeOpacity="0.5"
                  strokeWidth="1"
                  strokeDasharray="1 3"
                  variants={pathVariants}
                  transition={{ delay: 0.5 }}
                />
              </>
            )}
          </>
        )}

        {/* GYOKURO ICONS (Round, Leafy, Dew) - Default */}
        {!isSencha && (
          <>
            {variant === 'standard' && (
              <>
                {/* Single Organic Leaf - Curved and soft */}
                <motion.path 
                  d="M12 21C12 21 5 15 5 8.5C5 4.9 7.9 2 11.5 2C15.1 2 18 4.9 18 8.5C18 15 12 21 12 21Z" 
                  variants={pathVariants} 
                />
                {/* Curved Vein */}
                <motion.path 
                  d="M12 21C12 14 13 8 16 4" 
                  variants={pathVariants} 
                  transition={{ delay: 0.2, duration: 1 }}
                />
              </>
            )}

            {variant === 'high' && (
              <>
                 {/* Stem */}
                 <motion.path d="M12 22V16" variants={pathVariants} />
                 {/* Left Leaf */}
                 <motion.path d="M12 16C12 16 5 14 5 8C5 4 8 3 12 3" variants={pathVariants} transition={{ delay: 0.1 }} />
                 {/* Right Leaf */}
                 <motion.path d="M12 16C12 16 19 14 19 8C19 4 16 3 12 3" variants={pathVariants} transition={{ delay: 0.1 }} />
                 {/* Center Bud/Vein */}
                 <motion.path d="M12 10V3" variants={pathVariants} transition={{ delay: 0.3 }} />
              </>
            )}

            {variant === 'imperial' && (
              <>
                {/* Leaf holding the dew */}
                <motion.path 
                  d="M3 10C3 17 8 22 14 22C19 22 22 17 22 10C22 5 18 2 12 2"
                  variants={pathVariants} 
                />
                {/* Inner fold */}
                <motion.path d="M3 10C3 6 8 8 12 8" variants={pathVariants} />
                {/* The Precious Dew Drop */}
                <motion.circle 
                  cx="14" cy="14" r="3" 
                  fill="currentColor" fillOpacity="0.15"
                  variants={accentVariants} 
                />
                 {/* Highlight on drop (tiny detail) */}
                 <motion.path d="M15 13L15.5 12.5" strokeWidth="1" strokeOpacity="0.5" variants={accentVariants} />
              </>
            )}
          </>
        )}

      </motion.g>
    </motion.svg>
  );
};

// --- Components ---

const LanguageSelector = ({ 
  lang, 
  isOpen, 
  onToggle, 
  onSelect 
}: { 
  lang: Language; 
  isOpen: boolean; 
  onToggle: () => void; 
  onSelect: (l: Language) => void;
}) => (
  <div className="absolute top-6 right-6 z-50 flex flex-col items-end">
    <button 
      onClick={() => { playSoftClick(); onToggle(); }}
      className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-sage/20 text-moss hover:bg-white/80 transition-colors"
    >
      <Globe size={16} />
      <span className="text-xs font-sans uppercase tracking-wider font-medium">{lang.toUpperCase()}</span>
    </button>
    
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute top-full mt-2 flex flex-col bg-white/90 backdrop-blur-md rounded-xl border border-sage/10 shadow-lg overflow-hidden min-w-[120px]"
        >
          {(['en', 'jp', 'cn'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => { playSoftClick(); onSelect(l); }}
              className={`px-6 py-3 text-sm text-left hover:bg-sage/10 transition-colors ${lang === l ? 'text-moss font-bold' : 'text-stone'}`}
            >
              {l === 'en' ? 'English' : l === 'jp' ? '日本語' : '中文'}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const BackButton = ({ 
  visible, 
  onBack, 
  label 
}: { 
  visible: boolean; 
  onBack: () => void; 
  label: string; 
}) => (
  <AnimatePresence>
    {visible && (
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        onClick={() => { playSoftClick(); onBack(); }}
        className="absolute top-6 left-6 z-50 p-3 rounded-full bg-white/50 backdrop-blur-sm border border-sage/20 text-moss hover:bg-white/80 transition-colors group"
        aria-label={label}
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
      </motion.button>
    )}
  </AnimatePresence>
);

const ParamControl = ({ 
  icon: Icon, 
  value, 
  unit, 
  label, 
  onIncrease, 
  onDecrease,
  lang
}: { 
  icon: any, value: number, unit: string, label: string, 
  onIncrease: () => void, onDecrease: () => void, lang: Language
}) => (
  <motion.div 
    variants={itemVariants}
    className="flex flex-col items-center gap-1 p-3 bg-white/50 rounded-2xl border border-white relative group"
  >
     <div className="absolute -top-2 right-0 left-0 flex justify-between px-1 opacity-0 group-hover:opacity-100 transition-opacity">
       <button onClick={() => { playSoftClick(); onDecrease(); }} className="p-1 bg-white rounded-full shadow-sm hover:bg-sage/10 text-stone"><Minus size={12} /></button>
       <button onClick={() => { playSoftClick(); onIncrease(); }} className="p-1 bg-white rounded-full shadow-sm hover:bg-sage/10 text-stone"><Plus size={12} /></button>
     </div>
    <Icon className="text-sage" size={24} />
    <div className="flex items-baseline gap-0.5">
      <span className="font-serif text-xl text-moss tabular-nums">{value}</span>
      <span className="font-serif text-xs text-moss/70">{unit}</span>
    </div>
    <span className={`text-[10px] text-stone uppercase ${lang === 'en' ? 'tracking-wider' : 'tracking-normal'}`}>{label}</span>
  </motion.div>
);

// --- Main App Component ---

export default function App() {
  const [stage, setStage] = useState<AppStage>('tea-select');
  const [selectedTea, setSelectedTea] = useState<TeaType | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [steepIndex, setSteepIndex] = useState(0);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(0);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  // Settings
  const [lang, setLang] = useState<Language>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isGraderOpen, setIsGraderOpen] = useState(false); // New state for modal

  // Brewing Configuration State
  const [brewConfig, setBrewConfig] = useState<BrewConfig | null>(null);
  const [isRatioLocked, setIsRatioLocked] = useState(true);

  // Derived state
  const teaData = selectedTea ? TEA_DATA[selectedTea] : null;
  const gradeProfile: TeaGradeProfile | null = (teaData && selectedGrade) 
    ? teaData.profiles[selectedGrade] 
    : null;
  const currentSteep = brewConfig ? brewConfig.steeps[steepIndex] : null;
  
  const t = (key: keyof typeof UI_TRANSLATIONS) => UI_TRANSLATIONS[key][lang];
  
  // Helper for tracking classes
  const trackingSubtitle = lang === 'en' ? 'tracking-widest' : 'tracking-widest';
  const trackingBody = lang === 'en' ? 'tracking-wide' : 'tracking-normal';

  // Helper for dynamic steep labels (e.g. "Brew Steep 2", "2煎目を淹れる", "冲泡第2煎")
  const getSteepActionLabel = (index: number) => {
    const n = index + 1;
    switch(lang) {
      case 'jp': return `${n}煎目を淹れる`;
      case 'cn': return `冲泡第 ${n} 煎`;
      default: return `Brew Steep ${n}`;
    }
  };

  // Logic to get initial config from a grade (helper)
  const getInitialConfig = (tea: TeaType, grade: Grade): BrewConfig => {
    const profile = TEA_DATA[tea].profiles[grade];
    return {
      waterTemperature: profile.parameters.waterTemperature,
      leafAmount: profile.parameters.leafAmount,
      waterAmount: profile.parameters.waterAmount,
      steeps: [...profile.steeps]
    };
  };

  // Timer Logic
  useEffect(() => {
    let interval: number;
    if (isTimerActive && endTime) {
      interval = window.setInterval(() => {
        const now = Date.now();
        const remaining = (endTime - now) / 1000;
        
        if (remaining <= 0) {
           setTimeLeft(0);
           setIsTimerActive(false);
           setEndTime(null);
           playGentleBell();
        } else {
           setTimeLeft(remaining);
        }
      }, 100);
    } 
    return () => clearInterval(interval);
  }, [isTimerActive, endTime]);

  // Handlers
  const handleTeaSelect = (type: TeaType) => {
    playConfirmSound();
    setSelectedTea(type);
    setStage('grade-select');
  };

  const handleGradeSelect = (grade: Grade) => {
    playConfirmSound();
    setSelectedGrade(grade);
    
    // Initialize config immediately to avoid flash and race conditions
    if (selectedTea) {
       const initialConfig = getInitialConfig(selectedTea, grade);
       setBrewConfig(initialConfig);
       setIsRatioLocked(true);
    }
    
    setStage('prep');
    setSteepIndex(0);
  };

  // Callback for Grader Modal
  const handleApplyGrade = (grade: Grade) => {
    setIsGraderOpen(false);
    handleGradeSelect(grade);
  };

  const startBrewing = () => {
    if (currentSteep) {
      playSoftClick();
      const duration = currentSteep.duration;
      setTimeLeft(duration);
      setEndTime(Date.now() + duration * 1000);
      setIsTimerActive(true);
      setStage('brewing');
    }
  };

  const nextSteep = () => {
    playSoftClick();
    if (brewConfig && steepIndex < brewConfig.steeps.length - 1) {
      const nextIndex = steepIndex + 1;
      setSteepIndex(nextIndex);
      const nextDuration = brewConfig.steeps[nextIndex].duration;
      setTimeLeft(nextDuration);
      setEndTime(Date.now() + nextDuration * 1000);
      setStage('brewing');
      setIsTimerActive(true);
    } else {
      setStage('finish');
    }
  };

  const resetFlow = () => {
    playConfirmSound();
    setStage('tea-select');
    setSelectedTea(null);
    setSelectedGrade(null);
    setSteepIndex(0);
    setIsTimerActive(false);
    setEndTime(null);
  };

  // Restart session from steep 1, keeping grade/tea selection
  const restartSessionKeepSettings = () => {
    playConfirmSound();
    setSteepIndex(0);
    // We don't reload config to keep user adjustments to leaf/water
    setStage('prep');
    setIsTimerActive(false);
    setEndTime(null);
  };
  
  const handleBack = () => {
    switch (stage) {
      case 'grade-select':
        setStage('tea-select');
        setSelectedTea(null);
        break;
      case 'prep':
        setStage('grade-select');
        setSelectedGrade(null);
        break;
      case 'brewing':
        setIsTimerActive(false);
        setEndTime(null);
        setStage('prep'); // Go back to prep, steepIndex is preserved
        break;
      case 'finish':
        resetFlow();
        break;
      default:
        break;
    }
  };

  const resetParams = () => {
    playSoftClick();
    if (selectedTea && selectedGrade) {
      const initialConfig = getInitialConfig(selectedTea, selectedGrade);
      setBrewConfig(initialConfig);
      setIsRatioLocked(true);
    }
  };

  const adjustWater = (delta: number) => {
    if (!brewConfig || !gradeProfile) return;
    const newWater = Math.max(10, brewConfig.waterAmount + delta);
    let newLeaf = brewConfig.leafAmount;

    if (isRatioLocked) {
      const ratio = gradeProfile.parameters.leafAmount / gradeProfile.parameters.waterAmount;
      newLeaf = Number((newWater * ratio).toFixed(1));
    }
    setBrewConfig({ ...brewConfig, waterAmount: newWater, leafAmount: newLeaf });
  };

  const adjustLeaf = (delta: number) => {
    if (!brewConfig || !gradeProfile) return;
    const newLeaf = Math.max(0.5, Number((brewConfig.leafAmount + delta).toFixed(1)));
    let newWater = brewConfig.waterAmount;

    if (isRatioLocked) {
      const ratio = gradeProfile.parameters.leafAmount / gradeProfile.parameters.waterAmount;
      newWater = Math.round(newLeaf / ratio);
    }
    setBrewConfig({ ...brewConfig, leafAmount: newLeaf, waterAmount: newWater });
  };

  const adjustTemp = (delta: number) => {
    if (!brewConfig) return;
    // Update the temperature for the CURRENT steep
    const newSteeps = [...brewConfig.steeps];
    const newTemp = (newSteeps[steepIndex]?.temperature || brewConfig.waterTemperature) + delta;
    
    newSteeps[steepIndex] = { 
      ...newSteeps[steepIndex], 
      temperature: newTemp 
    };
    
    // Also update base water temp if we are on steep 0, just for consistency
    const newBaseTemp = steepIndex === 0 ? newTemp : brewConfig.waterTemperature;

    setBrewConfig({ ...brewConfig, waterTemperature: newBaseTemp, steeps: newSteeps });
  };

  const adjustTime = (delta: number) => {
    if (!brewConfig) return;
    const newSteeps = [...brewConfig.steeps];
    const newDuration = Math.max(5, (newSteeps[steepIndex]?.duration || 60) + delta);
    
    newSteeps[steepIndex] = { ...newSteeps[steepIndex], duration: newDuration };
    setBrewConfig({ ...brewConfig, steeps: newSteeps });
  };

  const renderTeaSelection = () => (
    <motion.div 
      key="tea-select"
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit"
      className="w-full max-w-md space-y-8"
    >
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl text-moss leading-relaxed">{t('selectTea')}</h1>
        <p className={`font-sans text-stone text-sm ${trackingBody}`}>{t('beginCalm')}</p>
      </div>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 gap-6">
        <motion.div variants={itemVariants}>
          <TeaCard 
            name={TEA_DATA[TeaType.SENCHA].name[lang]}
            subtitle={TEA_DATA[TeaType.SENCHA].tagline[lang]} 
            icon={<Leaf size={32} strokeWidth={1.5} />}
            onClick={() => handleTeaSelect(TeaType.SENCHA)} 
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <TeaCard 
            name={TEA_DATA[TeaType.GYOKURO].name[lang]}
            subtitle={TEA_DATA[TeaType.GYOKURO].tagline[lang]}
            icon={<Droplets size={32} strokeWidth={1.5} />}
            onClick={() => handleTeaSelect(TeaType.GYOKURO)} 
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );

  const renderGradeSelection = () => (
    <motion.div 
      key="grade-select"
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit"
      className="w-full max-w-md space-y-12 text-center"
    >
      <div className="space-y-2">
        <h2 className="font-serif text-3xl text-moss leading-relaxed">{teaData?.name[lang]}</h2>
        <p className="font-sans text-stone text-sm uppercase tracking-widest">
           {lang === 'en' ? teaData?.name['jp'] : teaData?.name['en']}
        </p>
      </div>

      <div className="space-y-6">
        <p className={`text-stone/80 font-sans ${trackingBody}`}>{t('chooseGrade')}</p>
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="show" 
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Standard */}
          <motion.button
            variants={itemVariants}
            onClick={() => handleGradeSelect(Grade.STANDARD)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center p-6 bg-white/40 border border-sage/10 rounded-2xl hover:bg-white/70 transition-colors gap-3"
          >
            <div className="p-3 bg-stone/10 rounded-full text-stone">
               <OrganicIcon 
                variant="standard" 
                teaType={selectedTea || undefined} 
                className="w-6 h-6" 
              />
            </div>
            <span className="text-moss font-medium">{t('standard')}</span>
          </motion.button>

          {/* High */}
          <motion.button
            variants={itemVariants}
            onClick={() => handleGradeSelect(Grade.HIGH)}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center p-6 bg-white/60 border border-sage/30 rounded-2xl shadow-sm hover:shadow-md hover:bg-white/90 transition-all gap-3 relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-sage/5 to-transparent" />
             <div className="p-3 bg-sage/10 rounded-full text-sage relative z-10">
               <OrganicIcon 
                variant="high" 
                teaType={selectedTea || undefined} 
                className="w-6 h-6" 
              />
            </div>
            <span className="text-moss font-bold relative z-10">{t('high')}</span>
          </motion.button>

          {/* Imperial */}
          <motion.button
            variants={itemVariants}
            onClick={() => handleGradeSelect(Grade.IMPERIAL)}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center p-6 bg-rice/80 border border-amber-500/20 rounded-2xl shadow-md hover:shadow-lg hover:bg-rice transition-all gap-3 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
            <div className="p-3 bg-amber-100 rounded-full text-amber-600 relative z-10">
               <OrganicIcon 
                variant="imperial" 
                teaType={selectedTea || undefined} 
                className="w-6 h-6" 
              />
            </div>
            <span className="text-amber-800 font-bold relative z-10">{t('imperial')}</span>
          </motion.button>
        </motion.div>
        
        {/* Help / Grader Button */}
        <motion.div variants={itemVariants} className="pt-4">
          <button 
            onClick={() => { playSoftClick(); setIsGraderOpen(true); }}
            className="inline-flex items-center gap-2 text-stone/70 hover:text-moss transition-colors text-xs font-sans uppercase tracking-wider group"
          >
            <Calculator size={14} className="group-hover:scale-110 transition-transform" />
            <span className="border-b border-transparent group-hover:border-moss/50 transition-colors">
              {lang === 'en' ? 'Help me choose by price' : lang === 'jp' ? '価格で判定する' : '按价格鉴定等级'}
            </span>
          </button>
        </motion.div>

      </div>
    </motion.div>
  );

  const renderPreparation = () => {
    if (!brewConfig) return null;

    return (
      <motion.div 
        key="prep"
        variants={pageVariants}
        initial="initial" animate="animate" exit="exit"
        className="w-full max-w-md space-y-8 text-center"
      >
        <div className="space-y-2">
          <h2 className="font-serif text-2xl text-moss leading-relaxed">{t('preparation')}</h2>
          <p className={`font-sans text-xs text-sage uppercase ${trackingSubtitle}`}>{t('foundation')}</p>
        </div>

        {/* Dynamic Parameters Grid */}
        <div className="relative">
          <div className="flex justify-center mb-4">
             <button 
               onClick={() => { playSoftClick(); setIsRatioLocked(!isRatioLocked); }}
               className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${isRatioLocked ? 'bg-sage/20 text-moss' : 'bg-stone/10 text-stone'}`}
             >
               {isRatioLocked ? <Lock size={12} /> : <Unlock size={12} />}
               <span className="leading-none pt-[1px]">{isRatioLocked ? t('ratioLocked') : t('ratioUnlocked')}</span>
             </button>
          </div>

          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 gap-4 text-center mb-4">
            <ParamControl 
              icon={Leaf} 
              value={brewConfig.leafAmount} 
              unit="g" 
              label={t('leaves')}
              onIncrease={() => adjustLeaf(0.5)}
              onDecrease={() => adjustLeaf(-0.5)}
              lang={lang}
            />
             <ParamControl 
              icon={Droplets} 
              value={brewConfig.waterAmount} 
              unit="ml" 
              label={t('water')}
              onIncrease={() => adjustWater(10)}
              onDecrease={() => adjustWater(-10)}
              lang={lang}
            />
            <ParamControl 
              icon={Thermometer} 
              value={brewConfig.steeps[steepIndex]?.temperature || 60} 
              unit="°C" 
              label={`${t('temp')} (${t('steep')} ${steepIndex + 1})`}
              onIncrease={() => adjustTemp(1)}
              onDecrease={() => adjustTemp(-1)}
              lang={lang}
            />
            <ParamControl 
              icon={Clock}
              value={brewConfig.steeps[steepIndex]?.duration || 60} 
              unit="s" 
              label={`${t('time')} (${t('steep')} ${steepIndex + 1})`}
              onIncrease={() => adjustTime(5)}
              onDecrease={() => adjustTime(-5)}
              lang={lang}
            />
          </motion.div>
        </div>

        <p className="font-serif italic text-stone/80 text-sm leading-relaxed px-4 min-h-[3em]">
          "{gradeProfile?.description[lang]}"
        </p>

        <div className="flex flex-col gap-3 pt-2">
          {steepIndex > 0 ? (
            <div className="flex flex-col gap-3 w-full">
              <Button onClick={startBrewing}>
                <span className="leading-none pt-[1px]">{getSteepActionLabel(steepIndex)}</span>
              </Button>
              <button 
                onClick={restartSessionKeepSettings}
                className="flex items-center justify-center gap-2 text-stone/60 hover:text-stone text-xs py-2 transition-colors"
              >
                <RotateCcw size={12} /> <span className="leading-none pt-[1px]">{t('restartSession')}</span>
              </button>
            </div>
          ) : (
             <div className="flex flex-col gap-3 w-full">
                <Button onClick={startBrewing}>
                  {t('beginFirstSteep')}
                </Button>
                 <button 
                  onClick={resetParams}
                  className="flex items-center justify-center gap-2 text-stone/60 hover:text-stone text-xs py-2 transition-colors"
                >
                  <RefreshCw size={12} /> <span className="leading-none pt-[1px]">{t('reset')}</span>
                </button>
             </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderBrewing = () => {
    const isFinished = timeLeft <= 0;
    const nextSteepConfig = brewConfig && steepIndex < (brewConfig.steeps.length - 1) 
      ? brewConfig.steeps[steepIndex + 1] 
      : null;
    
    return (
      <motion.div 
        key="brewing"
        variants={pageVariants}
        initial="initial" animate="animate" exit="exit"
        className="w-full max-w-md flex flex-col items-center justify-center space-y-8"
      >
        <div className="text-center space-y-1 relative w-full">
           <h2 className="font-serif text-xl text-moss leading-relaxed">{t('steep')} {steepIndex + 1}</h2>
           <p className="font-sans text-xs text-sage uppercase tracking-widest">
            {isFinished ? t('completed') : t('brewing')}
          </p>
          
          <div className="absolute right-0 top-1 flex items-center gap-1 bg-sage/10 px-2 py-1 rounded-full text-moss">
             <Thermometer size={14} />
             <span className="text-xs font-serif font-bold pt-[1px]">{currentSteep?.temperature}°C</span>
          </div>
        </div>

        <Timer 
          duration={currentSteep?.duration || 60} 
          timeLeft={timeLeft} 
          isActive={isTimerActive}
          label={isTimerActive ? t('remaining') : t('seconds')}
        />

        <div className="w-full min-h-[100px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {!isFinished ? (
              <motion.div 
                key="notes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4 text-center px-4"
              >
                <p className="text-stone font-serif italic text-lg leading-relaxed">
                  {currentSteep?.note[lang]}
                </p>
                {currentSteep?.flavor && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-2 p-4 bg-white/40 rounded-xl backdrop-blur-sm border border-white/50"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2 text-moss/80">
                      <Sparkles size={14} />
                      <span className="text-xs font-sans uppercase tracking-widest leading-none pt-[1px]">{t('tastingNote')}</span>
                    </div>
                    <p className="text-moss font-serif text-sm leading-relaxed">
                      {currentSteep?.flavor[lang]}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="action"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 w-full"
              >
                <p className="text-moss font-serif text-lg leading-relaxed">{t('pourMessage')}</p>
                
                {/* UP NEXT PREVIEW */}
                {nextSteepConfig && (
                   <motion.div 
                     initial={{ opacity: 0, y: 5 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.2 }}
                     className="w-full bg-sage/5 border border-sage/10 rounded-xl p-3 flex items-center justify-between px-6"
                   >
                      <div className="flex items-center gap-2 text-stone">
                        <span className="text-xs font-sans uppercase tracking-widest font-bold leading-none pt-[1px]">{t('upNext')} ({t('steep')} {steepIndex + 2})</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-moss">
                          <Thermometer size={16} />
                          <span className="font-serif font-bold leading-none pt-[1px]">{nextSteepConfig.temperature}°C</span>
                        </div>
                        <div className="flex items-center gap-1 text-moss">
                          <Clock size={16} />
                          <span className="font-serif font-bold leading-none pt-[1px]">{nextSteepConfig.duration}s</span>
                        </div>
                      </div>
                   </motion.div>
                )}

                {brewConfig && steepIndex < (brewConfig.steeps.length || 0) - 1 ? (
                   <Button onClick={nextSteep} variant="primary" className="flex items-center gap-2 mt-2">
                     <span className="leading-none pt-[1px]">{t('nextSteep')}</span> <ArrowRight size={16} />
                   </Button>
                ) : (
                  <Button onClick={() => setStage('finish')} variant="primary" className="mt-2">
                    {t('finishCeremony')}
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  const renderFinish = () => (
    <motion.div 
      key="finish"
      variants={pageVariants}
      initial="initial" animate="animate" exit="exit"
      className="w-full max-w-md text-center space-y-8"
    >
      <div className="w-24 h-24 bg-sage/10 rounded-full flex items-center justify-center mx-auto text-moss">
        <OrganicIcon 
          variant="high" 
          teaType={selectedTea || undefined} 
          className="w-12 h-12" 
        />
      </div>
      <div>
        <h2 className="font-serif text-3xl text-moss mb-4 leading-relaxed">{t('enjoyTea')}</h2>
        <p className={`font-sans text-stone leading-relaxed max-w-xs mx-auto ${trackingBody}`}>
          {t('enjoyMessage')}
        </p>
      </div>
      <div className="pt-8">
        <Button onClick={resetFlow} variant="secondary" className="flex items-center gap-2 mx-auto">
          <RotateCcw size={16} /> <span className="leading-none pt-[1px]">{t('brewAnother')}</span>
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden font-sans antialiased text-slate selection:bg-sage/20">
      <Background />
      <BackButton 
        visible={stage !== 'tea-select'} 
        onBack={handleBack} 
        label={t('goBack')}
      />
      <LanguageSelector 
        lang={lang} 
        isOpen={isLangMenuOpen} 
        onToggle={() => setIsLangMenuOpen(!isLangMenuOpen)}
        onSelect={(l) => { setLang(l); setIsLangMenuOpen(false); }}
      />
      
      {/* Grader Modal */}
      <TeaGrader 
        isOpen={isGraderOpen} 
        onClose={() => setIsGraderOpen(false)} 
        teaType={selectedTea || TeaType.SENCHA}
        lang={lang}
        onApply={handleApplyGrade}
      />

      <AnimatePresence mode="wait">
        {stage === 'tea-select' && renderTeaSelection()}
        {stage === 'grade-select' && renderGradeSelection()}
        {stage === 'prep' && renderPreparation()}
        {stage === 'brewing' && renderBrewing()}
        {stage === 'finish' && renderFinish()}
      </AnimatePresence>
      
      {/* Branding Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center opacity-30 pointer-events-none">
        <span className="font-serif text-xs tracking-[0.3em] text-stone">TEAFLOW</span>
      </div>
    </div>
  );
}