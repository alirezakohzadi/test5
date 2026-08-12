import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingBag, Search, FileText, Moon, Volume2, VolumeX, Eye, ArrowLeft, Heart, X } from 'lucide-react';

interface MascotProps {
  cartCount: number;
  onOpenSearch?: () => void;
  onOpenCart?: () => void;
  onOpenPrescription?: () => void;
}

type MascotState =
  | 'idle'
  | 'walk'
  | 'lookAround'
  | 'wave'
  | 'jump'
  | 'celebrate'
  | 'point'
  | 'sleep'
  | 'peek'
  | 'rest';

interface Particle {
  id: number;
  x: number;
  y: number;
  symbol: string;
  color: string;
  scale: number;
}

export const Mascot: React.FC<MascotProps> = ({
  cartCount,
  onOpenSearch,
  onOpenCart,
  onOpenPrescription,
}) => {
  // Mascot state machine
  const [state, setState] = useState<MascotState>('idle');
  const [posX, setPosX] = useState<number>(82); // percentage from left (default bottom right)
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [isNearCursor, setIsNearCursor] = useState<boolean>(false);
  const [cursorOffset, setCursorOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [speechBubble, setSpeechBubble] = useState<string | null>('سلام! من نوژی هستم، دستیار سلامت نوژاشاپ! 👋');
  const [showSpeech, setShowSpeech] = useState<boolean>(true);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Refs for tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const behaviorIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevCartCountRef = useRef<number>(cartCount);

  // Helper sound synthesizers using Web Audio API for cute 8-bit sound effects
  const playCuteSound = useCallback((type: 'happy' | 'jump' | 'cart' | 'wake' | 'sleep') => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'happy' || type === 'cart') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.3); // C6
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'jump') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } else if (type === 'wake') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch {
      // Ignore audio context errors gracefully
    }
  }, [isMuted]);

  // Spawn particle effects (celebration, hearts, zzz)
  const spawnParticles = useCallback((type: 'gold' | 'hearts' | 'zzz' | 'stars') => {
    const newParticles: Particle[] = [];
    const count = type === 'gold' ? 12 : 6;
    const symbols =
      type === 'gold'
        ? ['✨', '⭐', '🎉', '🛍️', '💚']
        : type === 'hearts'
        ? ['💚', '💖', '✨']
        : type === 'zzz'
        ? ['Z', 'z', '․']
        : ['✨', '🌟', '✦'];

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x: (Math.random() - 0.5) * 80,
        y: -10 - Math.random() * 40,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        color: type === 'gold' ? '#D4AF37' : type === 'hearts' ? '#0D7366' : '#8A9996',
        scale: 0.8 + Math.random() * 0.6,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 1800);
  }, []);

  // Natural Blinking Timer
  useEffect(() => {
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
      const nextBlink = 2500 + Math.random() * 4500;
      blinkIntervalRef.current = setTimeout(triggerBlink, nextBlink);
    };
    blinkIntervalRef.current = setTimeout(triggerBlink, 3000);

    return () => {
      if (blinkIntervalRef.current) clearTimeout(blinkIntervalRef.current);
    };
  }, []);

  // Cart addition reaction trigger!
  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      // Cart item added!
      setState('celebrate');
      setSpeechBubble('هورا! محصول به سبد خرید شما اضافه شد! 🎉🛍️');
      setShowSpeech(true);
      spawnParticles('gold');
      playCuteSound('cart');

      const timer = setTimeout(() => {
        setState('idle');
      }, 4000);

      prevCartCountRef.current = cartCount;
      return () => clearTimeout(timer);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount, spawnParticles, playCuteSound]);

  // Inactivity & Mouse Movements
  useEffect(() => {
    const resetInactivity = () => {
      if (state === 'sleep') {
        setState('idle');
        setSpeechBubble('سلام دوباره! بیدار شدم! 😊');
        setShowSpeech(true);
        playCuteSound('wake');
        setTimeout(() => setShowSpeech(false), 3000);
      }

      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(() => {
        if (!isDragging) {
          setState('sleep');
          setSpeechBubble('چرت زدن کوتاه... 💤');
          setShowSpeech(true);
          spawnParticles('zzz');
          playCuteSound('sleep');
        }
      }, 12000); // Sleep after 12s of inactivity
    };

    const handleMouseMove = (e: MouseEvent) => {
      resetInactivity();

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mascotX = rect.left + rect.width / 2;
        const mascotY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - mascotX, e.clientY - mascotY);

        if (dist < 140) {
          setIsNearCursor(true);
          setCursorOffset({
            x: Math.max(-12, Math.min(12, (e.clientX - mascotX) / 8)),
            y: Math.max(-8, Math.min(8, (e.clientY - mascotY) / 8)),
          });
        } else {
          setIsNearCursor(false);
          setCursorOffset({ x: 0, y: 0 });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', resetInactivity);
    window.addEventListener('click', resetInactivity);
    window.addEventListener('keydown', resetInactivity);

    resetInactivity();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', resetInactivity);
      window.removeEventListener('click', resetInactivity);
      window.removeEventListener('keydown', resetInactivity);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [state, isDragging, spawnParticles, playCuteSound]);

  // Autonomous Behavior Loop (Walking, Waving, Pointing, Looking Around)
  useEffect(() => {
    if (state === 'sleep' || state === 'celebrate' || isDragging) return;

    const runRandomBehavior = () => {
      const rand = Math.random();

      if (rand < 0.35) {
        // Walk to new safe position along bottom screen (between 15% and 85%)
        const targetX = Math.floor(18 + Math.random() * 66);
        setDirection(targetX < posX ? 'left' : 'right');
        setState('walk');
        setPosX(targetX);

        setTimeout(() => {
          setState('idle');
        }, 3500);
      } else if (rand < 0.55) {
        // Wave greeting
        setState('wave');
        setSpeechBubble('نوژاشاپ؛ داروخانه آنلاین همیشه همراه شما 🌿');
        setShowSpeech(true);
        playCuteSound('happy');
        setTimeout(() => {
          setState('idle');
          setShowSpeech(false);
        }, 4000);
      } else if (rand < 0.70) {
        // Point toward search or cart
        setState('point');
        const tips = [
          'ارسال نسخه آنلاین و مشاوره رایگان با داروساز 📝',
          'جستجوی سریع محصولات و مکمل‌های اصل 🔎',
          'تخفیف‌های استثنایی کلکسیون طلایی 🌟',
        ];
        setSpeechBubble(tips[Math.floor(Math.random() * tips.length)]);
        setShowSpeech(true);
        setTimeout(() => {
          setState('idle');
          setShowSpeech(false);
        }, 4500);
      } else if (rand < 0.85) {
        // Look around
        setState('lookAround');
        setTimeout(() => setState('idle'), 3000);
      } else {
        // Jump with joy
        setState('jump');
        spawnParticles('stars');
        playCuteSound('jump');
        setTimeout(() => setState('idle'), 1800);
      }
    };

    behaviorIntervalRef.current = setInterval(runRandomBehavior, 9000);

    return () => {
      if (behaviorIntervalRef.current) clearInterval(behaviorIntervalRef.current);
    };
  }, [state, posX, isDragging, spawnParticles, playCuteSound]);

  // Handle Mascot Click
  const handleMascotClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
    setShowSpeech(true);
    if (state === 'sleep') {
      setState('idle');
      playCuteSound('wake');
      setSpeechBubble('سلام! چطور می‌تونم کمکت کنم؟ 😊');
    } else {
      setState('jump');
      playCuteSound('happy');
      spawnParticles('hearts');
      setSpeechBubble('جانم! در خدمت شما هستم 💚');
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 z-40 select-none transition-all duration-1000 ease-out"
      style={{
        left: `${posX}%`,
        transform: 'translateX(-50%)',
      }}
    >
      {/* Floating Particle Container */}
      <div className="absolute inset-0 pointer-events-none z-50">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, y: p.y, x: p.x, scale: p.scale }}
              animate={{
                opacity: 0,
                y: p.y - 60,
                x: p.x + (Math.random() - 0.5) * 40,
                scale: p.scale * 1.3,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              className="absolute font-black text-sm drop-shadow-md"
              style={{ color: p.color }}
            >
              {p.symbol}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Speech Bubble Above Mascot */}
      <AnimatePresence>
        {showSpeech && speechBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute bottom-[105px] right-1/2 translate-x-1/2 w-56 sm:w-64 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-[#0D7366]/20 text-right z-50 pointer-events-auto"
          >
            <div className="flex items-start justify-between gap-2">
              <button
                onClick={() => setShowSpeech(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <p className="text-xs font-semibold text-slate-800 leading-relaxed font-['Vazirmatn']">
                {speechBubble}
              </p>
            </div>
            {/* Bubble Tail */}
            <div className="absolute -bottom-2 right-1/2 translate-x-1/2 w-3 h-3 bg-white border-b border-r border-[#0D7366]/20 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Mascot Action Menu Popover */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-[110px] right-1/2 translate-x-1/2 w-64 bg-slate-900/95 text-white backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-[#D4AF37]/40 z-50 pointer-events-auto dir-rtl"
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
              <div className="flex items-center gap-1.5 text-[#D4AF37]">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold">دستیار هوشمند نوژی</span>
              </div>
              <button
                onClick={() => setShowMenu(false)}
                className="text-white/60 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenSearch?.();
                }}
                className="flex items-center gap-1.5 p-2 rounded-xl bg-white/10 hover:bg-[#0D7366] transition-colors text-right font-medium"
              >
                <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>جستجوی دارو</span>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenPrescription?.();
                }}
                className="flex items-center gap-1.5 p-2 rounded-xl bg-white/10 hover:bg-[#0D7366] transition-colors text-right font-medium"
              >
                <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>ارسال نسخه</span>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenCart?.();
                }}
                className="flex items-center gap-1.5 p-2 rounded-xl bg-white/10 hover:bg-[#0D7366] transition-colors text-right font-medium"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>سبد خرید ({cartCount})</span>
              </button>

              <button
                onClick={() => {
                  setState('celebrate');
                  spawnParticles('gold');
                  playCuteSound('happy');
                  setSpeechBubble('برق و رقص سلامتی نوژاشاپ! 💃✨');
                  setShowMenu(false);
                }}
                className="flex items-center gap-1.5 p-2 rounded-xl bg-white/10 hover:bg-[#0D7366] transition-colors text-right font-medium"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>رقص نوژی</span>
              </button>
            </div>

            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/70">
              <button
                onClick={() => setIsMuted((prev) => !prev)}
                className="flex items-center gap-1 text-white/80 hover:text-white"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
                <span>{isMuted ? 'صدای افکت خاموش' : 'صدای افکت روشن'}</span>
              </button>

              <button
                onClick={() => {
                  setState('sleep');
                  setSpeechBubble('شب بخیر! چرت کوتاهم شروع شد 💤');
                  setShowMenu(false);
                }}
                className="flex items-center gap-1 text-white/80 hover:text-white"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-300" />
                <span>استراحت</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Vector Mascot Character Body */}
      <motion.div
        drag
        dragConstraints={{ left: -300, right: 300, top: -200, bottom: 20 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        onClick={handleMascotClick}
        animate={{
          y:
            state === 'jump'
              ? [0, -45, 0]
              : state === 'celebrate'
              ? [0, -25, -5, -20, 0]
              : state === 'walk'
              ? [0, -4, 0, -4, 0]
              : [0, -2, 0],
          rotate:
            state === 'walk'
              ? direction === 'left'
                ? [-3, 3, -3]
                : [3, -3, 3]
              : state === 'celebrate'
              ? [-6, 6, -6, 6, 0]
              : state === 'sleep'
              ? 8
              : isNearCursor
              ? cursorOffset.x * 0.4
              : 0,
          scale: state === 'sleep' ? 0.92 : state === 'jump' ? [1, 1.12, 0.95, 1] : 1,
        }}
        transition={{
          y:
            state === 'jump'
              ? { duration: 0.6, ease: 'easeOut' }
              : state === 'walk'
              ? { repeat: Infinity, duration: 0.5 }
              : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
          rotate:
            state === 'walk'
              ? { repeat: Infinity, duration: 0.5 }
              : { duration: 0.4 },
        }}
        className="relative w-20 h-24 sm:w-22 sm:h-26 cursor-grab active:cursor-grabbing group pointer-events-auto"
        title="نوژی - دستیار نوژاشاپ (کلیک کنید)"
      >
        {/* Soft Ground Shadow Disc */}
        <motion.div
          animate={{
            scale: state === 'jump' ? [1, 0.5, 1] : state === 'walk' ? [0.9, 1.05, 0.9] : [0.95, 1, 0.95],
            opacity: state === 'jump' ? [0.4, 0.15, 0.4] : 0.35,
          }}
          transition={{ repeat: Infinity, duration: state === 'walk' ? 0.5 : 2.5 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-3 bg-slate-950/40 rounded-full blur-xs pointer-events-none"
        />

        {/* SVG Mascot Character Vector */}
        <svg
          viewBox="0 0 100 120"
          className="w-full h-full overflow-visible drop-shadow-xl"
        >
          <defs>
            {/* Body Teal Gradient */}
            <linearGradient id="tealBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0D7366" />
              <stop offset="60%" stopColor="#0A584E" />
              <stop offset="100%" stopColor="#073F38" />
            </linearGradient>

            {/* Gold Accents Gradient */}
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F4E291" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#A38220" />
            </linearGradient>

            {/* Belly Cream Gradient */}
            <linearGradient id="creamBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E6F4F1" />
            </linearGradient>
          </defs>

          {/* Golden Antenna / Leaf Crown on Top */}
          <motion.g
            animate={{
              rotate: state === 'celebrate' ? [-15, 15, -15] : state === 'walk' ? [-8, 8, -8] : [-3, 3, -3],
            }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            transformOrigin="50px 20px"
          >
            {/* Stem */}
            <path
              d="M 50 22 Q 50 12 50 8"
              stroke="#D4AF37"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Leaf 1 Left */}
            <path
              d="M 50 10 C 42 4 40 14 50 18 C 50 18 50 10 50 10 Z"
              fill="url(#goldGrad)"
            />
            {/* Leaf 2 Right */}
            <path
              d="M 50 10 C 58 4 60 14 50 18 C 50 18 50 10 50 10 Z"
              fill="url(#goldGrad)"
            />
            {/* Sparkling Gold Star Top */}
            <circle cx="50" cy="7" r="3.5" fill="#FFF" />
            <circle cx="50" cy="7" r="2" fill="#D4AF37" />
          </motion.g>

          {/* Ears / Side Flaps */}
          <path
            d="M 22 45 C 12 40 12 58 24 58 Z"
            fill="url(#tealBodyGrad)"
          />
          <path
            d="M 78 45 C 88 40 88 58 76 58 Z"
            fill="url(#tealBodyGrad)"
          />

          {/* Main Body (Soft Teardrop Capsule) */}
          <path
            d="M 50 20 C 72 20 80 38 80 62 C 80 86 70 98 50 98 C 30 98 20 86 20 62 C 20 38 28 20 50 20 Z"
            fill="url(#tealBodyGrad)"
            stroke="#108273"
            strokeWidth="1.5"
          />

          {/* Cream Belly Patch */}
          <path
            d="M 50 50 C 65 50 70 65 70 82 C 70 92 60 95 50 95 C 40 95 30 92 30 82 C 30 65 35 50 50 50 Z"
            fill="url(#creamBellyGrad)"
            opacity="0.95"
          />

          {/* Golden Pharmacy / Botanical Emblem on Belly */}
          <g transform="translate(50, 72) scale(0.7)">
            <path
              d="M 0 -8 L 0 8 M -8 0 L 8 0"
              stroke="#D4AF37"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="0" cy="0" r="10" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
          </g>

          {/* Eyes Container */}
          <g transform={`translate(${isNearCursor ? cursorOffset.x : 0}, ${isNearCursor ? cursorOffset.y : 0})`}>
            {/* Sleep Eyes */}
            {state === 'sleep' ? (
              <g stroke="#1A1C1D" strokeWidth="3" strokeLinecap="round" fill="none">
                <path d="M 36 44 Q 42 50 46 44" />
                <path d="M 54 44 Q 58 50 64 44" />
              </g>
            ) : isBlinking ? (
              /* Blink Eyes (Horizontal lines) */
              <g stroke="#1A1C1D" strokeWidth="3.5" strokeLinecap="round">
                <line x1="34" y1="44" x2="44" y2="44" />
                <line x1="56" y1="44" x2="66" y2="44" />
              </g>
            ) : state === 'celebrate' ? (
              /* Heart / Star Happy Eyes */
              <g fill="#D4AF37">
                <path d="M 38 42 C 38 38 34 38 34 42 C 34 45 38 48 38 48 C 38 48 42 45 42 42 C 42 38 38 38 38 42 Z" />
                <path d="M 60 42 C 60 38 56 38 56 42 C 56 45 60 48 60 48 C 60 48 64 45 64 42 C 64 38 60 38 60 42 Z" />
              </g>
            ) : (
              /* Normal Big Shiny Pupil Eyes */
              <g>
                {/* Left Eye Pupil */}
                <circle cx="38" cy="43" r="6" fill="#1A1C1D" />
                <circle cx="36.5" cy="41" r="2.2" fill="#FFFFFF" />
                <circle cx="40" cy="45" r="1" fill="#FFFFFF" />

                {/* Right Eye Pupil */}
                <circle cx="62" cy="43" r="6" fill="#1A1C1D" />
                <circle cx="60.5" cy="41" r="2.2" fill="#FFFFFF" />
                <circle cx="64" cy="45" r="1" fill="#FFFFFF" />
              </g>
            )}

            {/* Cute Rosy Blush Cheeks */}
            <circle cx="30" cy="49" r="4.5" fill="#FF8A9E" opacity="0.65" />
            <circle cx="70" cy="49" r="4.5" fill="#FF8A9E" opacity="0.65" />

            {/* Animated Mouth */}
            {state === 'celebrate' || state === 'jump' ? (
              /* Big Happy Open Smile with Tongue */
              <path
                d="M 42 53 Q 50 62 58 53 Z"
                fill="#FF5271"
              />
            ) : state === 'sleep' ? (
              /* Quiet Sleep Mouth */
              <path
                d="M 47 52 Q 50 54 53 52"
                stroke="#1A1C1D"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              /* Standard Gentle Smile */
              <path
                d="M 44 52 Q 50 57 56 52"
                stroke="#1A1C1D"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </g>

          {/* Left Arm */}
          <motion.path
            d="M 22 60 Q 12 65 18 76 C 22 80 26 72 26 64 Z"
            fill="url(#tealBodyGrad)"
            animate={{
              rotate: state === 'celebrate' ? [0, -35, 0] : 0,
            }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            transformOrigin="22px 60px"
          />

          {/* Right Arm (Waving or Pointing) */}
          <motion.path
            d={
              state === 'point'
                ? "M 78 60 Q 96 55 98 62 C 96 68 84 68 78 64 Z"
                : "M 78 60 Q 88 65 82 76 C 78 80 74 72 74 64 Z"
            }
            fill="url(#tealBodyGrad)"
            animate={{
              rotate:
                state === 'wave'
                  ? [0, -40, 10, -40, 0]
                  : state === 'celebrate'
                  ? [0, 35, 0]
                  : 0,
            }}
            transition={{
              rotate:
                state === 'wave'
                  ? { repeat: Infinity, duration: 0.8 }
                  : { repeat: Infinity, duration: 0.6 },
            }}
            transformOrigin="78px 60px"
          />

          {/* Feet / Paws */}
          <g>
            {/* Left Foot */}
            <motion.ellipse
              cx="38"
              cy="98"
              rx="9"
              ry="5"
              fill="url(#goldGrad)"
              animate={{
                cy: state === 'walk' ? [98, 92, 98] : 98,
              }}
              transition={{ repeat: Infinity, duration: 0.4, ease: 'linear' }}
            />
            {/* Right Foot */}
            <motion.ellipse
              cx="62"
              cy="98"
              rx="9"
              ry="5"
              fill="url(#goldGrad)"
              animate={{
                cy: state === 'walk' ? [92, 98, 92] : 98,
              }}
              transition={{ repeat: Infinity, duration: 0.4, ease: 'linear' }}
            />
          </g>
        </svg>
      </motion.div>
    </div>
  );
};
