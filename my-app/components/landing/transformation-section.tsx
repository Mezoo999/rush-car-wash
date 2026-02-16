"use client";

import { motion } from "framer-motion";
import { TransformationCards } from "./rush-widgets";

export function TransformationSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
            شوف الفرق قبل وبعد الرشة 🚗✨
          </h2>
          <p className="text-lg text-[#1976D2]/70 max-w-2xl mx-auto">
            thousands of cars transformed - see the Rush magic yourself!
          </p>
        </motion.div>

        {/* Transformation Cards */}
        <TransformationCards />
      </div>
    </section>
  );
}
