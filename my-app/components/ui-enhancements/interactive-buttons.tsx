"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PremiumButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function PremiumButton({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  disabled,
  loading,
  icon
}: PremiumButtonProps) {
  const variants = {
    primary: "bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]",
    secondary: "bg-[#d4a574] text-[#1a1a1a] hover:bg-[#c49464]",
    outline: "border-2 border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white",
    ghost: "text-[#1a1a1a] hover:bg-[#f5f5f5]"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        onClick={onClick}
        disabled={disabled || loading}
        className={cn(
          "relative overflow-hidden rounded-full font-medium transition-all duration-300",
          variants[variant],
          sizes[size],
          className
        )}
      >
        {/* Shine Effect */}
        {!disabled && !loading && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        )}
        
        {/* Loading Spinner */}
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          />
        ) : (
          <span className="relative z-10 flex items-center gap-2">
            {icon}
            {children}
          </span>
        )}
      </Button>
    </motion.div>
  );
}

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
}

export function HoverCard({ children, className }: HoverCardProps) {
  return (
    <motion.div
      whileHover={{ 
        y: -8,
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.15)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "bg-white rounded-2xl p-6 border border-gray-100 cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MagneticButton({ children, className, onClick }: MagneticButtonProps) {
  return (
    <motion.button
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
    >
      <motion.div
        className="absolute inset-0 bg-[#d4a574] rounded-full opacity-20"
        initial={{ scale: 0 }}
        whileHover={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
      {children}
    </motion.button>
  );
}

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  label?: string;
}

export function FloatingActionButton({ icon, onClick, label }: FloatingActionButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#d4a574] text-[#1a1a1a] rounded-full shadow-lg flex items-center justify-center hover:bg-[#c49464] transition-colors"
    >
      {icon}
      {label && (
        <span className="absolute -top-8 bg-[#1a1a1a] text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {label}
        </span>
      )}
    </motion.button>
  );
}

export function BadgeAnimated({ 
  children, 
  color = "blue",
  className 
}: { 
  children: React.ReactNode; 
  color?: "blue" | "green" | "yellow" | "red" | "purple";
  className?: string;
}) {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    purple: "bg-purple-500"
  };

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium",
        colors[color],
        className
      )}
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-2 h-2 bg-white rounded-full ml-2"
      />
      {children}
    </motion.span>
  );
}
