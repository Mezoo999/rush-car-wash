"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { formatPriceWithCurrency } from "@/lib/utils/pricing";

const packages = [
  {
    id: "basic",
    name: "الباقة الأساسية",
    description: "3 غسيلات شهرياً",
    washes: 3,
    priceStandard: 900,
    priceSuv: 1100,
    features: [
      "3 غسيلات داخلي + خارجي",
      "توفير مقارنة بالغسيل الفردي",
      "زيارات مجدولة مسبقاً",
      "أولوية في الحجز",
    ],
    isPopular: false,
  },
  {
    id: "standard",
    name: "الباقة المميزة",
    description: "4 غسيلات + تنظيف بخار",
    washes: 4,
    priceStandard: 1300,
    priceSuv: 1600,
    features: [
      "4 غسيلات داخلي + خارجي",
      "تنظيف بالبخار مرة شهرياً",
      "عناية أعمق بشكل دوري",
      "أفضل قيمة من الحجز الفردي",
    ],
    isPopular: true,
  },
  {
    id: "premium",
    name: "باقة العناية المميزة",
    description: "تجربة بريميوم شاملة",
    washes: 4,
    priceStandard: 1900,
    priceSuv: 2200,
    features: [
      "4 غسيلات داخلي + خارجي",
      "تنظيف بالبخار مرتين",
      "تلميع المصابيح مرة",
      "مظهر بريميوم طوال الشهر",
    ],
    isPopular: false,
  },
];

export function Packages() {
  return (
    <section id="packages" className="py-24 bg-white">
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
            باقات الدلع
          </h2>
          <p className="text-lg text-[#1976D2]/70 max-w-2xl mx-auto">
            وفري وقتك وفلوسك مع باقاتنا الشهرية المصممة لتناسب احتياجاتك
          </p>
        </motion.div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {pkg.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-[#d4a574] text-[#1a1a1a] px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    الأكثر طلباً
                  </div>
                </div>
              )}

              <Card
                className={`h-full ${
                  pkg.isPopular
                    ? "border-2 border-[#d4a574] shadow-xl"
                    : "border-[#e5e5e5]"
                } bg-white hover:shadow-lg transition-all duration-300`}
              >
                <CardContent className="p-8">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-[#6b7280]">{pkg.description}</p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-[#faf8f5] px-4 py-2 rounded-full">
                      <span className="text-2xl font-bold text-[#d4a574]">{pkg.washes}</span>
                      <span className="text-[#6b7280]">غسيلات / شهر</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-[#e5e5e5]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#6b7280]">السيدان</span>
                      <span className="text-xl font-bold text-[#1a1a1a]">
                        {formatPriceWithCurrency(pkg.priceStandard)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#6b7280]">الدفع الرباعي</span>
                      <span className="text-xl font-bold text-[#1a1a1a]">
                        {formatPriceWithCurrency(pkg.priceSuv)}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-[#6b7280]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    className={`w-full rounded-full py-6 text-lg ${
                      pkg.isPopular
                        ? "bg-[#d4a574] hover:bg-[#c49464] text-[#1a1a1a]"
                        : "bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white"
                    }`}
                    onClick={() => window.location.href = "/booking"}
                  >
                    اشترك الآن
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-sm text-[#6b7280] mt-8"
        >
          جميع الأسعار تشمل الضرائب ومتاحة في 6 أكتوبر والشيخ زايد
        </motion.p>
      </div>
    </section>
  );
}
