"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Percent, Clock, Star, Zap, Sparkles } from "lucide-react";

const offers = [
  {
    icon: Gift,
    title: "أول رشة هدية",
    description: "مع أول طلب هتلاقي معطر فاخر مع عربية. جربنا وهتحبنا",
    badge: "🎁",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Percent,
    title: "خصم الدلع",
    description: "اشترك في باقة شهرية ووفري لحد 25% من السعر",
    badge: "💰",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Clock,
    title: "احجز بدري",
    description: "احجز من يوم لـ 3 أيام قبل واختار الوقت اللي يناسبك",
    badge: "⏰",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "صديق Rush",
    description: "كل رشة بتحصل على نقاط وتستبدلها بخصم في المرة الجاية",
    badge: "🏆",
    gradient: "from-orange-500 to-amber-500",
    comingSoon: true,
  },
];

export function Offers() {
  return (
    <section id="offers" className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-[#FFA726]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute -bottom-20 -right-20 w-[300px] h-[300px] bg-[#1976D2]/10 rounded-full blur-3xl"
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
            className="inline-block text-5xl mb-4"
          >
            🎉
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
            عروض رشة الخاصة
          </h2>
          <p className="text-lg text-[#1976D2] max-w-2xl mx-auto">
            عروض وتخفيضات حصصرية - استغلها قبل ما تخلص!
          </p>
        </motion.div>

        {/* Offers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <Card className={`h-full ${offer.comingSoon ? 'opacity-80' : ''} bg-white border-2 border-transparent hover:border-[#1976D2]/30 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden`}>
                {/* Gradient top bar */}
                <div className={`h-2 bg-gradient-to-r ${offer.gradient}`} />
                
                <CardContent className="p-6">
                  {/* Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${offer.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <offer.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-2xl">{offer.badge}</span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-[#1E3A5F] mb-2">
                    {offer.title}
                  </h3>
                  <p className="text-sm text-[#1976D2]/70 leading-relaxed">
                    {offer.description}
                  </p>

                  {offer.comingSoon && (
                    <div className="mt-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#FFA726]" />
                      <span className="text-xs font-bold text-[#FFA726]">Coming Soon</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-[#1976D2] mb-4">
            تابعنا على السوشيال ميديا عشان تعرف أحدث العروض أول بأول
          </p>
          <div className="flex justify-center gap-4">
            {[
              { icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z", color: "#1877F2" },
              { icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z", color: "#E4405F" },
            ].map((social, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-gradient-to-br from-[#1976D2] to-[#1E3A5F] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d={social.icon} />
                </svg>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
