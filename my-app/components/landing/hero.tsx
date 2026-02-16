"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Play, Star, Award, Shield } from "lucide-react";
import Image from "next/image";
import { MagicalParticles, FloatingShapes } from "@/components/ui-enhancements/magical-particles";
import { MagneticButton, GlowButton } from "@/components/ui-enhancements/magnetic-button";
import { RushMeter, DailyTipBanner, WaterDropletBackground } from "./rush-widgets";

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#E3F2FD] via-[#BBDEFB] to-[#E3F2FD]">
      {/* Water Droplet Background Pattern */}
      <WaterDropletBackground />
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Magical Particles */}
        <MagicalParticles />
        <FloatingShapes />
        
        {/* Floating Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-[#1976D2]/30 to-[#64B5F6]/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-[#1E3A5F]/10 to-transparent rounded-full blur-3xl"
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(#1E3A5F 1px, transparent 1px), linear-gradient(90deg, #1E3A5F 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center lg:text-right order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#1976D2]/30 rounded-full px-4 py-2 mb-6 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-[#1976D2]" />
              <span className="text-sm font-medium text-[#1E3A5F]">غسيل متنقل في ثواني</span>
            </motion.div>

            {/* Rush Meter Widget */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <RushMeter />
            </motion.div>

            {/* Daily Tip Banner */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <DailyTipBanner />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1E3A5F] leading-tight mb-6"
              style={{ fontFamily: "var(--font-tajawal), sans-serif" }}
            >
              سيارتك
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="inline-block text-[#FFA726] mx-2"
              >
                بتلمع
              </motion.span>
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl font-light text-[#1976D2]">
                وأنت في بيتك
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-[#1E3A5F]/70 mb-4 max-w-xl mx-auto lg:mx-0"
            >
              خدمة غسيل سيارات متنقلة في الشيخ زايد والـ 6 أكتوبر. غيرنا يجيلك في بيتك أو في مكان شغلك
            </motion.p>

            {/* Starting Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <span className="text-[#FFA726] font-bold text-2xl">من 330 جنيه</span>
              <span className="text-[#1976D2] text-sm mr-2">• وأسعارنا في المتناول</span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <GlowButton
                className="bg-[#1976D2] hover:bg-[#1565C0] text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:shadow-2xl"
                onClick={() => window.location.href = "/booking"}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                اطلب رشة دلوقتي
              </GlowButton>
              <MagneticButton
                className="border-2 border-[#1976D2] text-[#1976D2] hover:bg-[#1976D2] hover:text-white px-8 py-6 text-lg rounded-full transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                مستني إيه؟ رشة في ثواني
              </MagneticButton>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap justify-center lg:justify-start gap-6 mt-10"
            >
              {[
                { icon: Shield, text: "خامات آمنة" },
                { icon: Star, text: "تقييم 4.9/5" },
                { icon: Award, text: "+1000 سيارة" },
              ].map((badge, index) => (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full"
                >
                  <badge.icon className="w-4 h-4 text-[#1976D2]" />
                  <span className="text-sm font-medium text-[#1E3A5F]">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Car Visual */}
          <motion.div
            style={{ y: y1 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main Card - Real Car Wash Image */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
              >
                <div className="relative aspect-[4/3]">
                  <img 
                    src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80"
                    alt="غسيل سيارات متنقل"
                    className="w-full h-full object-cover"
                  />
                  {/* Simple dark overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Content on Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-3xl font-bold text-white mb-2">لمعة</h3>
                    <p className="text-white/90 text-lg">غسيل سيارات متنقل في الشيخ زايد والـ 6 أكتوبر</p>
                    <div className="flex items-center gap-4 mt-4">
                      <span className="text-2xl font-bold text-white">من 330 جنيه</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Stats - Simple Cards */}
              <motion.div
                style={{ y: y2 }}
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg border border-gray-200 z-20"
              >
                <div className="p-3 flex items-center gap-2">
                  <div className="text-green-500 font-bold text-lg">✓</div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">1000+</div>
                    <div className="text-xs text-gray-500">عميل سعيد</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg border border-gray-200 z-20"
              >
                <div className="p-3 flex items-center gap-2">
                  <div className="text-amber-500 text-lg">⭐</div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">4.9</div>
                    <div className="text-xs text-gray-500">تقييم</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ 
            y: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut",
            scale: { duration: 1.5, repeat: Infinity }
          }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => scrollToSection("how-it-works")}
        >
          <div className="w-12 h-20 rounded-full border-2 border-[#1976D2]/30 flex items-start justify-center p-2">
            <motion.div 
              animate={{ y: [0, 32, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-3 bg-[#1976D2] rounded-full"
            />
          </div>
          <span className="text-sm text-[#1E3A5F]">اكتشف المزيد</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
