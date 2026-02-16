"use client";

import { motion } from "framer-motion";
import { Star, Quote, Car, Users, Heart, Clock } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "أحمد طارق",
    location: "الشيخ زايد",
    content: "والله شغل محترم! كنت محتاج أغسل عربية وأنا في الشغل، وجابولي العربية ناضفة كأنها جديدة. أنصح بيهم أي حد",
    rating: 5,
    avatar: "أ",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "محمود صلاح",
    location: "6 أكتوبر",
    content: "أول مرة أجربهم وبصراحة أعجبتني الخدمة. البيوت نضافة والعاملين محترمين. هكمل معاهم بالتأكيد",
    rating: 5,
    avatar: "م",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 3,
    name: "كريم محمد",
    location: "صاحب أسطول",
    content: "بستخدمهم لأسطول العربيات اللي عندي. فعلاً محترمين في المواعيد وجودة الشغل ممتازة. ربنا يبارك",
    rating: 5,
    avatar: "ك",
    color: "from-orange-500 to-amber-500",
  },
  {
    id: 4,
    name: "عمر يوسف",
    location: "عميل دائم",
    content: "من أكتر من 6 أشهر وأنا بأستخدم خدمتهم. فعلاً مش محتاج أروح أي مكان، بييجوا لحد عندي. نظافة",
    rating: 5,
    avatar: "ع",
    color: "from-purple-500 to-pink-500",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-[#E3F2FD] to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
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
            💬
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
            شوف اللي قالوه عملائنا
          </h2>
          <p className="text-lg text-[#1976D2] max-w-2xl mx-auto">
            +3000 عميل سعيد يستخدمنا يومياً - انضم_familyهم دلوقتي!
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border-2 border-transparent hover:border-[#1976D2]/20">
                {/* Quote Icon */}
                <div className="flex items-start justify-between mb-4">
                  <Quote className="w-8 h-8 text-[#1976D2]/30" />
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FFA726] text-[#FFA726]" />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <p className="text-[#1E3A5F] leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1E3A5F]">{testimonial.name}</h4>
                    <p className="text-sm text-[#1976D2]">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {[
            { value: "4.9", label: "التقييم", icon: Star, color: "text-[#FFA726]" },
            { value: "5K+", label: "سيارة غسلناها", icon: Car, color: "text-[#1976D2]" },
            { value: "98%", label: "نسبة الرضا", icon: Heart, color: "text-pink-500" },
            { value: "15+", label: "عامل محترف", icon: Users, color: "text-[#64B5F6]" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring" }}
              className="bg-white rounded-2xl p-6 shadow-lg text-center"
            >
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
              <div className="text-3xl font-bold text-[#1E3A5F] mb-1">{stat.value}</div>
              <div className="text-sm text-[#1976D2]">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
