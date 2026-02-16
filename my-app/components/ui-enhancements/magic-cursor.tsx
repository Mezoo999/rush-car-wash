"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function MagicCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const trailCount = 5;
  const trailPoints = Array.from({ length: trailCount }, () => ({
    x: useMotionValue(-100),
    y: useMotionValue(-100),
  }));

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
    
    // Update trail points with delay
    trailPoints.forEach((point, index) => {
      setTimeout(() => {
        point.x.set(e.clientX);
        point.y.set(e.clientY);
      }, index * 30);
    });
  }, [cursorX, cursorY, trailPoints]);

  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isClickable = 
      target.tagName === "BUTTON" ||
      target.tagName === "A" ||
      target.closest("button") ||
      target.closest("a") ||
      target.role === "button" ||
      window.getComputedStyle(target).cursor === "pointer";
    setIsHovering(!!isClickable);
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave, handleMouseOver]);

  // Only show on devices with mouse (not touch)
  if (typeof window !== "undefined" && "ontouchstart" in window) {
    return null;
  }

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ duration: 0.15 }}
      >
        {/* Outer ring */}
        <div
          className="w-8 h-8 rounded-full border-2 border-[#d4a574] transition-all duration-150"
          style={{
            background: isHovering ? "rgba(212, 165, 116, 0.2)" : "transparent",
          }}
        />
        {/* Inner dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#d4a574] rounded-full" />
      </motion.div>

      {/* Trail effect */}
      {trailPoints.map((point, index) => (
        <motion.div
          key={index}
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          style={{
            x: point.x,
            y: point.y,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 0.3 - index * 0.05 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="rounded-full bg-[#d4a574]"
            style={{
              width: 12 - index * 2,
              height: 12 - index * 2,
            }}
          />
        </motion.div>
      ))}
    </>
  );
}
