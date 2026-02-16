"use client";

import { motion } from "framer-motion";
import { Car, MapPin, Sparkles, Zap, Droplets } from "lucide-react";

const steps = [
  {
    icon: Zap,
    title: "اختار رشك",
    description: "من بين 4 أنواع - سريعة، فلة، عميقة، أو VIP",
    emoji: "⚡",
  },
  {
    icon: MapPin,
    title: "قولنا فين",
    description: "حدد عنوانك وموعدك واحنا نيجي لحد عندك",
    emoji: "📍",
  },
  {
    icon: Droplets,
    title: "رش ودوب",
    description: "فريقنا يجيلك في minutes ويخلص الشغل وأنت مرتاح",
    emoji: "💦",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#E3F2FD]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
            🚀
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
            ازاي تطلب رشة؟
          </h2>
          <p className="text-lg text-[#1976D2] max-w-2xl mx-auto">
            في 3 خطوات بس عربيتك تبقى لامعة كالجديد!_records
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "80%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                  className="hidden md:block absolute top-12 left-[60%] h-[3px] bg-gradient-to-r from-[#1976D2] to-[#FFA726] rounded-full"
                />
              )}

              <div className="text-center bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#1976D2]/30">
                {/* Step Number & Icon */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(25, 118, 210, 0.4)",
                        "0 0 0 20px rgba(25, 118, 210, 0)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full"
                  />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-[#1976D2] to-[#64B5F6] rounded-full flex items-center justify-center shadow-lg">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FFA726] text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>

                {/* Emoji */}
                <div className="text-4xl mb-4">{step.emoji}</div>

                {/* Content */}
                <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">
                  {step.title}
                </h3>
                <p className="text-[#1976D2]/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = "/booking"}
            className="inline-flex items-center gap-2 bg-[#FFA726] hover:bg-[#FF9800] text-[#1E3A5F] font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Sparkles className="w-5 h-5" />
            اطلب رشة دلوقتي
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
