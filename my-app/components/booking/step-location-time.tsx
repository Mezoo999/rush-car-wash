"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Calendar, Clock, Navigation, Phone, Sparkles, Zap } from "lucide-react";
import { validateEgyptianPhone, formatPhoneToInternational } from "@/lib/utils/validation";
import { useState } from "react";
import { motion } from "framer-motion";
import { BookingFormData, TIME_SLOTS, SERVICE_AREAS } from "@/types";
import { getTomorrowDate, getMaxBookingDate } from "@/lib/utils/pricing";

interface StepLocationTimeProps {
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
}

export function StepLocationTime({ formData, updateFormData }: StepLocationTimeProps) {
  const tomorrow = getTomorrowDate();
  const maxDate = getMaxBookingDate(30);
  const [phoneError, setPhoneError] = useState("");
  const [selectedArea, setSelectedArea] = useState(formData.address || "");

  const handlePhoneChange = (value: string) => {
    const formattedPhone = formatPhoneToInternational(value);
    updateFormData({ phone: formattedPhone });
    
    if (value && !validateEgyptianPhone(value)) {
      setPhoneError("رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 01");
    } else {
      setPhoneError("");
    }
  };

  const quickAddresses = [
    { area: "الشيخ زايد", detail: "الحي الأول", emoji: "🏠" },
    { area: "الشيخ زايد", detail: "الحي الثاني", emoji: "🏢" },
    { area: "6 أكتوبر", detail: "الحي الأول", emoji: "🏘️" },
    { area: "6 أكتوبر", detail: "الحي الثاني", emoji: "🏗️" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1976D2] to-[#64B5F6] rounded-full mb-4 shadow-lg"
        >
          <MapPin className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-[#1E3A5F] mb-2">فين ومع مي؟ 📍</h2>
        <p className="text-[#1976D2]">قولنا فين نيجي ونختار الوقت المناسب</p>
      </div>

      {/* Service Areas Map Visual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1976D2]/10 to-[#64B5F6]/5 rounded-2xl p-6 border-2 border-[#1976D2]/20"
      >
        <h3 className="font-bold text-[#1E3A5F] mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#FFA726]" />
          مناطق الخدمة المتاحة
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {SERVICE_AREAS.map((area) => (
            <motion.div
              key={area}
              whileHover={{ scale: 1.02 }}
              className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                selectedArea.includes(area)
                  ? "border-[#1976D2] bg-[#1976D2]/10"
                  : "border-[#1976D2]/20 bg-white/50 hover:border-[#1976D2]/40"
              }`}
              onClick={() => {
                setSelectedArea(area);
                updateFormData({ address: area });
              }}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1976D2]" />
                <span className="font-semibold text-[#1E3A5F] text-sm">{area}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-[#1976D2]/70 mt-3 text-center">
          ✨ بنغطي الشيخ زايد و6 أكتوبر - قريباً مناطق جديدة!
        </p>
      </motion.div>

      {/* Quick Address Selection */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FFA726]" />
          أو اختار من العناوين السريعة:
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {quickAddresses.map((addr, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="p-3 text-right bg-white border-2 border-[#1976D2]/20 rounded-xl hover:border-[#1976D2] transition-all"
              onClick={() => {
                const fullAddress = `${addr.emoji} ${addr.area}، ${addr.detail}`;
                setSelectedArea(fullAddress);
                updateFormData({ address: fullAddress });
              }}
            >
              <span className="text-sm">{addr.emoji} {addr.area}</span>
              <p className="text-xs text-[#1976D2]">{addr.detail}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address" className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#1976D2]" />
          العنوان بالتفصيل
        </Label>
        <Textarea
          id="address"
          placeholder="مثال: الشيخ زايد، الحي الثاني، شارع 10، عمارة 5..."
          value={formData.address}
          onChange={(e) => {
            setSelectedArea(e.target.value);
            updateFormData({ address: e.target.value });
          }}
          className="min-h-[100px] border-[#1976D2]/20 focus:border-[#1976D2]"
        />
      </div>

      {/* Google Maps Link */}
      <div className="space-y-2">
        <Label htmlFor="maps" className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#1976D2]" />
          رابط Google Maps (اختياري) 📍
        </Label>
        <Input
          id="maps"
          type="url"
          placeholder="https://maps.google.com/..."
          value={formData.googleMapsLink}
          onChange={(e) => updateFormData({ googleMapsLink: e.target.value })}
          dir="ltr"
          className="border-[#1976D2]/20 focus:border-[#1976D2]"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#1976D2]" />
            امتى تيجي؟ 📅
          </Label>
          <Input
            id="date"
            type="date"
            min={tomorrow}
            max={maxDate}
            value={formData.preferredDate}
            onChange={(e) => updateFormData({ preferredDate: e.target.value })}
            className="border-[#1976D2]/20 focus:border-[#1976D2]"
          />
        </div>

        {/* Time */}
        <div className="space-y-2">
          <Label htmlFor="time" className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1976D2]" />
            أي وقت؟ ⏰
          </Label>
          <Select
            value={formData.preferredTime}
            onValueChange={(value) => updateFormData({ preferredTime: value })}
          >
            <SelectTrigger id="time" className="border-[#1976D2]/20 focus:border-[#1976D2]">
              <SelectValue placeholder="اختر الوقت" />
            </SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-[#1976D2]" />
          رقمك عشان نتواصل معاك 📱
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="01XX XXX XXXX"
          value={formData.phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          dir="ltr"
          className={phoneError ? "border-red-500" : "border-[#1976D2]/20 focus:border-[#1976D2]"}
        />
        {phoneError && (
          <p className="text-sm text-red-500">{phoneError}</p>
        )}
      </div>

      {/* Time Slots Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-[#1976D2]/10 to-[#FFA726]/10 rounded-xl p-4 border border-[#1976D2]/20"
      >
        <h4 className="font-bold text-[#1E3A5F] mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FFA726]" />
          مواعيد العمل:
        </h4>
        <ul className="space-y-1 text-sm text-[#1976D2]">
          <li>🕐 كل الأيام من 9 ص لـ 9 م</li>
          <li>📅 احجز قبلها بـ 24 ساعة على الأقل</li>
          <li>⚡ الأوقات المبكرة بتنتهي سريعاً - أحجز دلوقتي!</li>
        </ul>
      </motion.div>
    </div>
  );
}
