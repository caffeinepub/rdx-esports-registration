import { Flame } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"intro" | "reveal" | "exit">("intro");

  useEffect(() => {
    // Phase 1: intro particles & logo build-up (1.2s)
    const t1 = setTimeout(() => setPhase("reveal"), 1200);
    // Phase 2: full reveal (1.6s)
    const t2 = setTimeout(() => setPhase("exit"), 2800);
    // Phase 3: exit wipe -> done (0.8s)
    const t3 = setTimeout(() => onComplete(), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  // Ember particles
  const embers = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1.2,
    size: 3 + Math.random() * 5,
    duration: 1.5 + Math.random() * 1.5,
  }));

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          key="splash"
          data-ocid="splash.panel"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "oklch(0.06 0.01 270)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* ── Radial fire glow ── */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "reveal" ? 1 : 0.3 }}
            transition={{ duration: 1 }}
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 60%, oklch(0.55 0.25 22 / 0.45) 0%, oklch(0.62 0.28 18 / 0.2) 40%, transparent 75%)",
            }}
          />

          {/* ── Ember particles ── */}
          {embers.map((e) => (
            <motion.div
              key={e.id}
              className="absolute rounded-full"
              style={{
                left: `${e.x}%`,
                bottom: "-8px",
                width: e.size,
                height: e.size,
                background: `oklch(${0.7 + Math.random() * 0.2} 0.28 ${18 + Math.random() * 40})`,
                boxShadow: `0 0 ${e.size * 2}px currentColor`,
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{
                y: [0, -(300 + Math.random() * 400)],
                opacity: [0, 1, 0.8, 0],
                x: [0, (Math.random() - 0.5) * 80],
              }}
              transition={{
                delay: e.delay,
                duration: e.duration,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: Math.random() * 0.8,
                ease: "easeOut",
              }}
            />
          ))}

          {/* ── Hex grid ── */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle, oklch(0.78 0.18 75) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          {/* ── Centre content ── */}
          <div className="relative z-10 flex flex-col items-center gap-6 text-center px-4">
            {/* Flame icon pulse */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: [0, 1.3, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 0.7, ease: "backOut" }}
            >
              <Flame
                className="w-14 h-14"
                style={{ color: "oklch(0.78 0.22 50)" }}
              />
            </motion.div>

            {/* Logo */}
            <motion.img
              src="/assets/uploads/20260307_210819-1.png"
              alt="INFERNO'26 Logo"
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "backOut" }}
              style={{
                filter: "drop-shadow(0 0 28px oklch(0.78 0.18 75 / 0.7))",
              }}
            />

            {/* RDX ESPORTS line */}
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.05em" }}
              animate={
                phase === "reveal"
                  ? { opacity: 1, letterSpacing: "0.45em" }
                  : { opacity: 0.4, letterSpacing: "0.15em" }
              }
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-display text-xs uppercase text-gold/70 tracking-[0.4em]"
            >
              RDX ESPORTS PRESENTS
            </motion.p>

            {/* INFERNO'26 */}
            <motion.h1
              initial={{ opacity: 0, y: 40, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.7, ease: "backOut" }}
              className="font-display font-black uppercase leading-none"
              style={{
                fontSize: "clamp(3rem, 15vw, 7rem)",
                background:
                  "linear-gradient(180deg, oklch(0.98 0.04 85) 0%, oklch(0.78 0.22 60) 50%, oklch(0.55 0.28 18) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 40px oklch(0.78 0.18 75 / 0.5))",
              }}
            >
              INFERNO'26
            </motion.h1>

            {/* Animated divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="h-0.5 w-48 md:w-72 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.78 0.18 75), oklch(0.55 0.25 22), transparent)",
                boxShadow: "0 0 12px oklch(0.78 0.18 75 / 0.6)",
              }}
            />

            {/* TOURNAMENT tag */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={phase === "reveal" ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="px-5 py-2 rounded-full font-display text-xs font-black uppercase tracking-[0.35em]"
              style={{
                background: "oklch(0.55 0.25 22 / 0.2)",
                border: "1px solid oklch(0.55 0.25 22 / 0.6)",
                color: "oklch(0.88 0.15 55)",
                boxShadow: "0 0 20px oklch(0.55 0.25 22 / 0.25)",
              }}
            >
              TOURNAMENT 2026
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="relative w-48 md:w-64 h-0.5 rounded-full overflow-hidden"
              style={{ background: "oklch(0.2 0.01 270)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.55 0.25 22), oklch(0.78 0.18 75))",
                  boxShadow: "0 0 8px oklch(0.78 0.18 75 / 0.8)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.9, duration: 1.8, ease: "easeInOut" }}
              />
            </motion.div>
          </div>

          {/* ── Bottom fire rim ── */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-24"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{
              background:
                "linear-gradient(0deg, oklch(0.55 0.25 22 / 0.35) 0%, transparent 100%)",
              transformOrigin: "bottom",
            }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
