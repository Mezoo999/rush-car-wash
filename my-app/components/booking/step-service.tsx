"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Sparkles, Flame, Crown, Check, Zap, Wind, Star } from "lucide-react";
import { BookingFormData, Service } from "@/types";
import { formatPriceWithCurrency, calculateServicePrice } from "@/lib/utils/pricing";
import { supabase } from "@/lib/supabase/client";
import { motion } from "framer-motion";

interface StepServiceProps {
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
}

const serviceIcons: Record<string, React.ElementType> = {
  fast: Wind,
  plus: Zap,
  deep: Droplets,
  vip: Crown,
};

const serviceEmojis: Record<string, string> = {
  fast: "⚡",
  plus: "✨",
  deep: "💧",
  vip: "👑",
};

export function StepService({ formData, updateFormData }: StepServiceProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: servicesData } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (servicesData) setServices(servicesData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSelectService = (service: Service) => {
    updateFormData({
      selectedServiceId: service.id,
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-[#1976D2] border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-[#1976D2]">جاري تحميل الرشات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1976D2] to-[#64B5F6] rounded-full mb-4 shadow-lg"
        >
          <Zap className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-[#1E3A5F] mb-2">اختار رشتك 🚗✨</h2>
        <p className="text-[#1976D2]">اختار نوع الرشة اللي يناسب عربيتك</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {services.map((service, index) => {
          const Icon = serviceIcons[service.id] || Droplets;
          const emoji = serviceEmojis[service.id] || "🚗";
          const price = calculateServicePrice(service, formData.carCategory);
          const isSelected = formData.selectedServiceId === service.id;

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                onClick={() => handleSelectService(service)}
                className={`cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "border-2 border-[#1976D2] bg-gradient-to-br from-[#1976D2]/10 to-[#64B5F6]/5 shadow-xl shadow-[#1976D2]/20"
                    : "border-2 border-gray-100 hover:border-[#1976D2]/50 hover:shadow-lg"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        isSelected 
                          ? "bg-gradient-to-br from-[#1976D2] to-[#64B5F6] shadow-lg"
                          : "bg-gray-100"
                      }`}
                    >
                      {isSelected ? (
                        <span className="text-2xl">{emoji}</span>
                      ) : (
                        <Icon className="w-7 h-7 text-[#1976D2]" />
                      )}
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-[#1E3A5F] text-lg">{service.name_ar}</h3>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </div>
                      
                      <p className="text-sm text-[#1976D2]/70 mb-2">{service.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="secondary" 
                          className="bg-[#1976D2]/10 text-[#1976D2] text-xs"
                        >
                          ⏱️ {service.duration_minutes} دقيقة
                        </Badge>
                        <motion.span 
                          className={`font-bold text-lg ${isSelected ? 'text-[#FFA726]' : 'text-[#1E3A5F]'}`}
                          animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {formatPriceWithCurrency(price)}
                        </motion.span>
                      </div>
                      
                      {service.features && (
                        <ul className="mt-3 space-y-1">
                          {(service.features as string[]).slice(0, 3).map((feature, i) => (
                            <li key={i} className="text-xs text-[#1976D2]/60 flex items-center gap-1">
                              <span className="text-[#FFA726]">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-[#FFA726]/10 to-[#FF9800]/10 rounded-xl p-4 border border-[#FFA726]/20"
      >
        <p className="text-sm text-[#1E3A5F] flex items-center gap-2">
          <Star className="w-4 h-4 text-[#FFA726]" />
          <strong>نصيحة:</strong> الرشة العميقة تنصح بيها للسيارات اللي محتاجة تنظيف عميق!
        </p>
      </motion.div>
    </div>
  );
}
