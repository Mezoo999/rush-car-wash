"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car, CarFront, Crown, Plus, Check, Loader2, Zap } from "lucide-react";
import { BookingFormData, CAR_BRANDS, CarCategory, CATEGORY_LABELS, Car as CarType } from "@/types";
import { getYearsRange } from "@/lib/utils/pricing";
import { supabase } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface StepCarDetailsProps {
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
}

const carCategories: { value: CarCategory; label: string; icon: React.ElementType; description: string }[] = [
  { value: "standard", label: "🚗 عادية", icon: Car, description: "السيدان والهاتشباك" },
  { value: "suv", label: "🚙 دفع رباعي", icon: CarFront, description: "الدفع الرباعي والكروس" },
  { value: "luxury", label: "🏎️ فاخرة", icon: Crown, description: "السيارات الفاخرة" },
];

export function StepCarDetails({ formData, updateFormData }: StepCarDetailsProps) {
  const years = getYearsRange(1990);
  const [savedCars, setSavedCars] = useState<CarType[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [showNewCar, setShowNewCar] = useState(false);

  useEffect(() => {
    fetchSavedCars();
  }, []);

  const fetchSavedCars = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: cars } = await supabase
        .from('cars')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (cars) setSavedCars(cars);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoadingCars(false);
    }
  };

  const selectSavedCar = (car: CarType) => {
    updateFormData({
      carBrand: car.brand,
      carModel: car.model,
      carYear: car.year || new Date().getFullYear(),
      carColor: car.color || "",
      plateNumber: car.plate_number || "",
      carCategory: car.category,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1976D2] to-[#64B5F6] rounded-full mb-4 shadow-lg"
        >
          <Car className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-[#1E3A5F] mb-2">بيانات عربية 🚗</h2>
        <p className="text-[#1976D2]">اختر عربية من محفوظاتك أو أضف جديدة</p>
      </div>

      {/* Saved Cars */}
      {!showNewCar && savedCars.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <Label className="text-[#1E3A5F] font-semibold">عربياتي المحفوظة ⭐</Label>
          <div className="grid gap-2">
            {savedCars.map((car) => {
              const isSelected = formData.carBrand === car.brand && formData.carModel === car.model;
              return (
                <motion.button
                  key={car.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => selectSavedCar(car)}
                  className={`p-4 text-right rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-[#1976D2] bg-[#1976D2]/10 shadow-lg"
                      : "border-gray-100 hover:border-[#1976D2]/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? "bg-[#1976D2]" : "bg-gray-100"
                      }`}>
                        <Car className={`w-5 h-5 ${isSelected ? "text-white" : "text-[#1976D2]"}`} />
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#1E3A5F]">{car.brand} {car.model}</p>
                        <p className="text-xs text-[#1976D2]">{car.year} • {car.color} • {car.plate_number}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Add New Car Button */}
          <button
            onClick={() => setShowNewCar(true)}
            className="w-full p-4 rounded-xl border-2 border-dashed border-[#1976D2]/30 text-[#1976D2] hover:bg-[#1976D2]/5 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            إضافة عربية جديدة
          </button>
        </motion.div>
      )}

      {/* New Car Form */}
      <AnimatePresence>
        {(showNewCar || savedCars.length === 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {savedCars.length > 0 && !showNewCar && (
              <div className="text-center">
                <button
                  onClick={() => setShowNewCar(true)}
                  className="text-[#1976D2] hover:underline text-sm"
                >
                  + إضافة عربية جديدة
                </button>
              </div>
            )}

            {/* Car Category Selection */}
            <div className="space-y-3">
              <Label className="text-[#1E3A5F] font-semibold">نوع العربية</Label>
              <div className="grid grid-cols-3 gap-3">
                {carCategories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => updateFormData({ carCategory: category.value })}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm ${
                      formData.carCategory === category.value
                        ? "border-[#1976D2] bg-[#1976D2]/10 shadow-lg"
                        : "border-gray-100 hover:border-[#1976D2]/50"
                    }`}
                  >
                    <category.icon className={`w-6 h-6 mx-auto mb-1 ${
                      formData.carCategory === category.value ? "text-[#1976D2]" : "text-gray-400"
                    }`} />
                    <div className="font-semibold text-xs">{category.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Brand */}
              <div className="space-y-2">
                <Label className="text-[#1E3A5F]">الماركة</Label>
                <Select
                  value={formData.carBrand}
                  onValueChange={(value) => updateFormData({ carBrand: value })}
                >
                  <SelectTrigger className="border-[#1976D2]/20">
                    <SelectValue placeholder="اختر الماركة" />
                  </SelectTrigger>
                  <SelectContent>
                    {CAR_BRANDS.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Model */}
              <div className="space-y-2">
                <Label className="text-[#1E3A5F]">الموديل</Label>
                <Input
                  placeholder="例如: Corolla"
                  value={formData.carModel}
                  onChange={(e) => updateFormData({ carModel: e.target.value })}
                  className="border-[#1976D2]/20"
                />
              </div>

              {/* Year */}
              <div className="space-y-2">
                <Label className="text-[#1E3A5F]">سنة الصنع</Label>
                <Select
                  value={formData.carYear.toString()}
                  onValueChange={(value) => updateFormData({ carYear: parseInt(value) })}
                >
                  <SelectTrigger className="border-[#1976D2]/20">
                    <SelectValue placeholder="اختر السنة" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label className="text-[#1E3A5F]">اللون</Label>
                <Input
                  placeholder="أبيض، أسود..."
                  value={formData.carColor}
                  onChange={(e) => updateFormData({ carColor: e.target.value })}
                  className="border-[#1976D2]/20"
                />
              </div>
            </div>

            {/* Plate Number */}
            <div className="space-y-2">
              <Label className="text-[#1E3A5F]">رقم اللوحة</Label>
              <Input
                placeholder="أ ب 1234"
                value={formData.plateNumber}
                onChange={(e) => updateFormData({ plateNumber: e.target.value.toUpperCase() })}
                className="border-[#1976D2]/20 text-left"
                dir="ltr"
              />
            </div>

            {/* Save Car Option */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 p-3 bg-[#1976D2]/5 rounded-xl border border-[#1976D2]/20"
            >
              <input
                type="checkbox"
                id="saveCar"
                className="w-5 h-5 text-[#1976D2] rounded"
              />
              <Label htmlFor="saveCar" className="text-[#1E3A5F] cursor-pointer">
                حفظ العربية لاستخدامها في المستقبل 💾
              </Label>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
