"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { 
        y: -5,
        transition: { duration: 0.3 }
      } : undefined}
      className={cn(
        "relative overflow-hidden rounded-2xl backdrop-blur-xl",
        "bg-white/70 border border-white/20 shadow-xl",
        className
      )}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-[#d4a574]/10 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function GradientText({ children, className, animate = true }: GradientTextProps) {
  return (
    <motion.span
      className={cn(
        "bg-gradient-to-r from-[#d4a574] via-[#1a1a1a] to-[#d4a574]",
        "bg-clip-text text-transparent",
        animate && "bg-[length:200%_auto]",
        className
      )}
      animate={animate ? {
        backgroundPosition: ["0% center", "200% center"]
      } : undefined}
      transition={animate ? {
        duration: 5,
        repeat: Infinity,
        ease: "linear"
      } : undefined}
      style={animate ? { backgroundSize: "200% auto" } : undefined}
    >
      {children}
    </motion.span>
  );
}

interface GlowEffectProps {
  children: React.ReactNode;
  color?: string;
  intensity?: "low" | "medium" | "high";
}

export function GlowEffect({ 
  children, 
  color = "#d4a574",
  intensity = "medium" 
}: GlowEffectProps) {
  const intensities = {
    low: "blur-xl opacity-30",
    medium: "blur-2xl opacity-50",
    high: "blur-3xl opacity-70"
  };

  return (
    <div className="relative">
      {/* Glow */}
      <div 
        className={cn(
          "absolute -inset-4 rounded-full",
          intensities[intensity]
        )}
        style={{ backgroundColor: color }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

interface ParticlesProps {
  count?: number;
  color?: string;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function FloatingParticles({ count = 20, color = "#d4a574" }: ParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      left: seededRandom(i * 123) * 100,
      top: seededRandom(i * 456) * 100,
      xOffset: seededRandom(i * 789) * 20 - 10,
      duration: 3 + seededRandom(i * 321) * 2,
      delay: seededRandom(i * 654) * 2,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ 
            backgroundColor: color,
            left: `${p.left}%`,
            top: `${p.top}%`
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, p.xOffset, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

export function AuroraBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {/* Aurora Effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#d4a574]/20 via-transparent to-[#1a1a1a]/10 animate-aurora" />
        <div 
          className="absolute inset-0 bg-gradient-to-l from-[#d4a574]/10 via-transparent to-[#1a1a1a]/20 animate-aurora"
          style={{ animationDelay: "-5s" }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
}

export function SpotlightCard({ children, className }: SpotlightProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white border border-gray-100",
        className
      )}
      whileHover="hover"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4a574]/10 to-transparent"
        variants={{
          hover: {
            x: ["-100%", "100%"],
            transition: { duration: 0.6 }
          }
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

export function NumberCounter({ 
  value, 
  duration = 2,
  suffix = ""
}: { 
  value: number; 
  duration?: number;
  suffix?: string;
}) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {value}{suffix}
      </motion.span>
    </motion.span>
  );
}
