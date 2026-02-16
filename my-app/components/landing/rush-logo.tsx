"use client";

import { motion } from "framer-motion";

interface RushLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function RushLogo({ size = "md", showText = true }: RushLogoProps) {
  const sizes = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 32, text: "text-2xl" },
    lg: { icon: 48, text: "text-4xl" },
  };

  return (
    <div className="flex items-center gap-2">
      {/* Water Spray Icon */}
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        className="relative"
      >
        <svg
          width={sizes[size].icon}
          height={sizes[size].icon}
          viewBox="0 0 24 24"
          fill="none"
          className="text-[#1976D2]"
        >
          {/* Water drop shape */}
          <path
            d="M12 2C12 2 5 9 5 14C5 17.866 8.134 21 12 21C15.866 21 19 17.866 19 14C19 9 12 2 12 2Z"
            fill="currentColor"
          />
          {/* Spray lines */}
          <motion.path
            d="M8 10C8 10 6 8 4 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.path
            d="M16 10C16 10 18 8 20 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
          />
          <motion.path
            d="M10 7C10 7 9 5 7 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
          />
          <motion.path
            d="M14 7C14 7 15 5 17 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.7 }}
          />
        </svg>
        
        {/* Sparkle effect */}
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 24 24"
            fill="#FFA726"
          >
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Text */}
      {showText && (
        <span className={`font-bold ${sizes[size].text} text-[#1E3A5F]`}>
          رشة
          <span className="text-[#1976D2] font-light">Rush</span>
        </span>
      )}
    </div>
  );
}

export function RushLogoWithSlogan() {
  return (
    <div className="flex flex-col">
      <RushLogo size="lg" />
      <motion.span
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xs text-[#1976D2] font-medium mt-1"
      >
        غسيل متنقل في ثواني
      </motion.span>
    </div>
  );
}
