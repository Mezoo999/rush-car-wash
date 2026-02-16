"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Clock, Zap, Car, Phone } from "lucide-react";

const serviceAreas = [
  {
    name: "الشيخ زايد",
    coverage: "100%",
    features: ["الحي الأول", "الحي الثاني", "الحي الثالث", "الحي الرابع", "الحي الخامس", "الحي السادس", "الحي السابع", "الحي الثامن"],
    emoji: "🏙️",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "6 أكتوبر",
    coverage: "100%",
    features: ["الحي الأول", "الحي الثاني", "الحي الثالث", "الحي الرابع", "منطقة الشركات", "الوردي", "الأكثرام"],
    emoji: "🏗️",
    color: "from-green-500 to-emerald-500",
  },
];

const nearbyAreas = [
  "الحصري", "العبور", "الهدى", "بدر", "الروبيكي"
];

export function ServiceAreasSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-[#E3F2FD]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-block text-5xl mb-4"
          >
            🗺️
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
            بنغطي مناطق كتير! 🎯
          </h2>
          <p className="text-lg text-[#1976D2] max-w-2xl mx-auto">
            بنجيب الرشة لحد عندك في الشيخ زايد و6 أكتوبر
          </p>
        </motion.div>

        {/* Main Areas */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {serviceAreas.map((area, areaIndex) => (
            <motion.div
              key={area.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: areaIndex * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-transparent hover:border-[#1976D2]/30 transition-all"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${area.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-4xl mb-2 block">{area.emoji}</span>
                    <h3 className="text-2xl font-bold">{area.name}</h3>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                      <span className="text-2xl font-bold">{area.coverage}</span>
                      <p className="text-xs">تغطية</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coverage Areas */}
              <div className="p-6">
                <h4 className="font-bold text-[#1E3A5F] mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1976D2]" />
                  الأحياء المشمولة:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {area.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-[#1976D2]/10 text-[#1976D2] rounded-full text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#FFA726]/20 to-[#FF9800]/20 rounded-2xl p-6 border-2 border-[#FFA726]/30">
            <h4 className="font-bold text-[#1E3A5F] mb-4 flex items-center gap-2 justify-center">
              <Zap className="w-5 h-5 text-[#FFA726]" />
              مناطق قريباً:
            </h4>
            <div className="flex flex-wrap justify-center gap-3">
              {nearbyAreas.map((area) => (
                <span
                  key={area}
                  className="px-4 py-2 bg-white text-[#1976D2] rounded-full font-medium shadow-sm"
                >
                  🚧 {area}
                </span>
              ))}
            </div>
            <p className="text-center text-sm text-[#1976D2]/70 mt-4">
              لو منطقتك مش موجودة؟ راسلنا وهنضيفها! 💬
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.a
            href="/booking"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-[#FFA726] hover:bg-[#FF9800] text-[#1E3A5F] font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Car className="w-5 h-5" />
            احجز رشة دلوقتي
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
