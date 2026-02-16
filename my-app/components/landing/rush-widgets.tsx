"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Droplets, Sun, Cloud, Wind, Car } from "lucide-react";

// Water droplet background pattern
export function WaterDropletBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]" aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="water-droplets" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="3" fill="#1976D2" />
            <circle cx="40" cy="25" r="2" fill="#1976D2" />
            <circle cx="25" cy="45" r="4" fill="#1976D2" />
            <circle cx="55" cy="50" r="2" fill="#1976D2" />
            <circle cx="5" cy="35" r="1.5" fill="#1976D2" />
            <circle cx="50" cy="10" r="2.5" fill="#1976D2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#water-droplets)" />
      </svg>
    </div>
  );
}

// Rush Meter - Shows closest provider
export function RushMeter() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-[#1976D2]/20"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#1976D2]/10 rounded-full flex items-center justify-center">
          <Clock className="w-5 h-5 text-[#1976D2]" />
        </div>
        <div>
          <p className="text-sm text-[#1E3A5F]/60">أقرب رشة</p>
          <p className="font-bold text-[#1E3A5F] flex items-center gap-2">
            <span className="text-[#FFA726]">15 دقيقة</span>
            <span className="text-sm font-normal text-[#1976D2]">من عندك</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Daily Tip Banner
const dailyTips = [
  { text: "يوم ترابي في القاهرة! وقت الرششة بقى 🚗💨", icon: Wind },
  { text: "ماتنساش العربية قبل Weekend Trip 🏖️", icon: Sun },
  { text: "مطر اليوم؟ تعالي للرشة قبل ماالطين يجف 🌧️", icon: Droplets },
];

function getDailyTip() {
  const today = new Date();
  const index = today.getDate() % dailyTips.length;
  return dailyTips[index];
}

export function DailyTipBanner() {
  const tip = getDailyTip();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-r from-[#1976D2] to-[#64B5F6] rounded-xl p-4 text-white"
    >
      <div className="flex items-center gap-3">
        <tip.icon className="w-5 h-5 text-[#FFA726]" />
        <p className="font-medium text-sm">{tip.text}</p>
      </div>
    </motion.div>
  );
}

// Before & After Transformation Card
interface TransformationItem {
  id: number;
  before: string;
  after: string;
  title: string;
}

const transformations: TransformationItem[] = [
  {
    id: 1,
    before: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&q=80&灰度",
    after: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&q=80",
    title: "XTreme Polish",
  },
  {
    id: 2,
    before: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&q=80&灰度",
    after: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&q=80",
    title: "Interior Deep",
  },
  {
    id: 3,
    before: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=400&q=80&灰度",
    after: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=400&q=80",
    title: "Full Detailing",
  },
];

export function TransformationCards() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
      {transformations.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="flex-shrink-0 w-72 bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Before/After Images */}
          <div className="relative h-40">
            <div className="absolute inset-0 flex">
              <div className="flex-1 relative">
                <img
                  src={item.before}
                  alt="Before"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  قبل
                </span>
              </div>
              <div className="flex-1 relative">
                <img
                  src={item.after}
                  alt="After"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 bg-[#FFA726] text-white text-xs px-2 py-1 rounded">
                  بعد
                </span>
              </div>
            </div>
            {/* Comparison line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white shadow-lg" />
          </div>
          
          {/* Content */}
          <div className="p-4">
            <h3 className="font-bold text-[#1E3A5F]">{item.title}</h3>
            <p className="text-sm text-[#1976D2] mt-1">نتيجة的区别؟ خالص! ✨</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Pulse Animation CTA Button
export function PulseCTA({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <div className="relative">
      {/* Pulse rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          scale: [1, 1.5, 1.5],
          opacity: [0.5, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      >
        <div className="w-full h-full rounded-full bg-[#FFA726] opacity-30" />
      </motion.div>
      
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          scale: [1, 1.3, 1.3],
          opacity: [0.3, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.5,
        }}
      >
        <div className="w-full h-full rounded-full bg-[#FFA726] opacity-30" />
      </motion.div>

      {/* Main button */}
      <motion.button
        onClick={onClick}
        className="relative bg-[#FFA726] hover:bg-[#FF9800] text-[#1E3A5F] font-bold px-8 py-4 rounded-full shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.button>
    </div>
  );
}
