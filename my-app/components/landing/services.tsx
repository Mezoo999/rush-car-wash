"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Droplets, Sparkles, Flame, Crown, Check, Zap, Wind, Car } from "lucide-react";
import { formatPriceWithCurrency } from "@/lib/utils/pricing";

const services = [
  {
    id: "fast",
    icon: Wind,
    name: "رشة سريعة",
    description: "غسيل خارجي وداخلي كويس في ثواني",
    price: 330,
    duration: "60 دقيقة",
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=80",
    features: [
      "غسيل خارجي بفوم كويس",
      "تنظيف العجلات والكاوتش",
      "مكنسة وفرك داخلي",
      "مسح الطبلون والأبواب",
      "مسح الزجاج",
      "عطر كويس",
    ],
  },
  {
    id: "plus",
    icon: Zap,
    name: "رشة فلة",
    description: "خدمة متكاملة بتفاصيل أكتر للعناية بسيارتك",
    price: 450,
    duration: "75 دقيقة",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&q=80",
    features: [
      "كل اللي في السريعة",
      "تنظيف فتحات التكييف",
      "تلميع الطبلون",
      "تنظيف جلود المقاعد",
    ],
  },
  {
    id: "deep",
    icon: Droplets,
    name: "رشة عميقة",
    description: "تنظيف عميق بالبخار لأصغر حاجة في عربية",
    price: 600,
    duration: "90 دقيقة",
    image: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=600&q=80",
    features: [
      "تنظيف بالبخار",
      "تعقيم وتطهير",
      "إزالة الروائح",
      "تنظيف عميق",
    ],
  },
  {
    id: "vip",
    icon: Crown,
    name: "رشة VIP",
    description: "الخدمة الكاملة العناية القصوى بسيارتك",
    price: 800,
    duration: "120 دقيقة",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80",
    features: [
      "كل اللي في العميقة",
      "تلميع المصابيح",
      "تنظيف المحرك",
      "حماية طويلة",
    ],
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-[#faf8f5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
            اختار رشتك
          </h2>
          <p className="text-lg text-[#1976D2]/70 max-w-2xl mx-auto">
            اختر الخدمة اللي تناسبك من تشكيلة متنوعة تناسب كل الاحتياجات
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden rounded-2xl">
                {/* Service Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Duration Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="text-sm text-white bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full font-medium">
                      ⏱️ {service.duration}
                    </span>
                  </div>
                  
                  {/* Service Name on Image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {service.name}
                    </h3>
                  </div>
                </div>
                
                <CardContent className="p-6 flex flex-col h-full bg-white">
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPriceWithCurrency(service.price)}
                      </span>
                      <span className="text-sm text-gray-500 block">يبدأ من</span>
                    </div>
                    <div className="w-10 h-10 bg-[#d4a574] rounded-lg flex items-center justify-center">
                      <service.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Features Preview */}
                  <ul className="space-y-2 mb-6 flex-grow">
                    {service.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {service.features.length > 4 && (
                      <li className="text-sm text-[#d4a574] font-medium">
                        +{service.features.length - 4} مميزات أخرى
                      </li>
                    )}
                  </ul>

                  {/* CTA */}
                  <Button
                    className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-full"
                    onClick={() => window.location.href = "/booking"}
                  >
                    احجز الآن
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
