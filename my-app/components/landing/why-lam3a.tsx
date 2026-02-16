"use client";

import { motion } from "framer-motion";
import { Zap, Droplets, Clock, Award, Star, Users, Car, Shield } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "سرعة رهيبة",
    description: "في ثواني معدودة عربيتك تبقى لامعة كالجديد. مش محتاج تنتظر ساعات",
    emoji: "⚡",
  },
  {
    icon: Droplets,
    title: "نجيبها لحد عندك",
    description: "محتاج تغسل وأنت في البيت أو الشغل؟ احنا نيجي ليك في ثواني",
    emoji: "🚗",
  },
  {
    icon: Shield,
    title: "خامات آمنة",
    description: "منتجات عالية الجودة بأمان على الدهان. عربيتك عندنا في أمان 100%",
    emoji: "🛡️",
  },
  {
    icon: Award,
    title: "شغل محترم",
    description: "عمال مدربين بشهادات. بنغسل بعناية وبمنتهى الدقة. نظافة تضمنها",
    emoji: "✨",
  },
];

export function WhyLam3a() {
  return (
    <section id="why-lam3a" className="py-24 bg-gradient-to-b from-[#1E3A5F] to-[#0D2137] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1976D2]/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#FFA726]/10 rounded-full blur-3xl"
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-block text-4xl mb-4"
          >
            💧
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ليه تختار <span className="text-[#FFA726]">رشة</span>؟
          </h2>
          <p className="text-lg text-[#64B5F6] max-w-2xl mx-auto">
            أقوى تجربة غسيل متنقل في مصر - جرب الف差价 بنفسك!
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#FFA726]/30 transition-all duration-300 group"
            >
              <div className="text-4xl mb-4">{reason.emoji}</div>
              <div className="w-12 h-12 bg-[#1976D2]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#FFA726]/20 transition-colors">
                <reason.icon className="w-6 h-6 text-[#64B5F6] group-hover:text-[#FFA726] transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{reason.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 pt-12 border-t border-white/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "5K+", label: "سيارة غسلناها", icon: Car },
              { value: "3K+", label: "عميل سعيد", icon: Users },
              { value: "4.9", label: "التقييم", icon: Star },
              { value: "15+", label: "عامل محترف", icon: Award },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
              >
                <stat.icon className="w-6 h-6 text-[#FFA726] mx-auto mb-2" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-[#64B5F6]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
