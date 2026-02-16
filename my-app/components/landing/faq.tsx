"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";

const faqs = [
  {
    question: "الرشة بتاخد وقت؟",
    answer: "depending على نوع الرشة: السريعة 30-40 دقيقة، الفلة 60 دقيقة، العميقة 90 دقيقة. نضمن الجودة حتى لو استغرق الأمر وقتاً أطول!",
  },
  {
    question: "محتاجين مياه وكهرباء منكم؟",
    answer: "لا أبداً! إحنا نيجي بكل اللي نحتاجه. عربياتنا مجهزة بمياه نظيفة وكهرباء. أنت بس حدد المكان وإحنا نهتم بالباقي",
  },
  {
    question: "بتشتغلوا فين؟",
    answer: "بنقدم الخدمة في 6 أكتوبر والشيخ زايد وضواحيهما. لو بره المناطق دي اتصل بينا ونشوف!",
  },
  {
    question: "ممكن تغسلوا في الجراج؟",
    answer: "أيوه بالظبط! نقدر نشتغل في أي مكان: جراجك، موقف العربية، أو أي مساحة متاحة. المهم يكون في مساحة كافية.",
  },
  {
    question: "كيف بتم الدفع؟",
    answer: "نوفر: كاش عند الاستلام، فودافون كاش، أو تحويل بنكي. ومتنساش خصم 10% لو دفعت كاش!",
  },
  {
    question: "الخامات آمنة على عربية؟",
    answer: "100%! نستخدم منتجات عالية الجودة وآمنة على الدهان والداخلية. كل الخامات PH متوازن ومضمون.",
  },
  {
    question: "ممكن أحجز لأكتر من عربية؟",
    answer: "أيوه بالطبع! وكمان هنقدم لك خصم خاص على الغسيل المتعدد. اتصل بينا للاستفسار عن عروض الأسطول.",
  },
  {
    question: "إيه سياسة الإلغاء؟",
    answer: "تقدر تلغي أو تؤجل قبل الموعد بـ 4 ساعات بدون أي رسوم. لو ألغيت قبلها بأقل من 4 ساعات، هنحتفظ بـ 20% من القيمة.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-[#1E3A5F]">
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
            ❓
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            عندك سؤال؟ احنا هنا
          </h2>
          <p className="text-lg text-[#64B5F6] max-w-2xl mx-auto">
            كل اللي محتاج تعرفه عن رشة - في مكان واحد!
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="max-w-3xl mx-auto">
          <div className="grid gap-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div 
                  className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-[#FFA726]/30 transition-colors"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-right hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#1976D2]/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <HelpCircle className="w-4 h-4 text-[#64B5F6]" />
                      </div>
                      <span className="font-bold text-white text-sm md:text-base">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown 
                      className={`w-5 h-5 text-[#FFA726] transition-transform flex-shrink-0 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-5 pb-5 pr-11">
                          <p className="text-[#64B5F6] leading-relaxed text-sm">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-[#64B5F6] mb-4">لسه عندك سؤال؟</p>
          <motion.a 
            href="https://wa.me/201031564146" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-[#FFA726] hover:bg-[#FF9800] text-[#1E3A5F] px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            راسلنا على واتساب
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
