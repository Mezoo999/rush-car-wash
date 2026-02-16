"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Sparkles } from "lucide-react";
import { BookingFormData, AddOn } from "@/types";
import { formatPriceWithCurrency, calculateAddOnsTotal } from "@/lib/utils/pricing";
import { supabase } from "@/lib/supabase/client";

interface StepAddOnsProps {
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
}

export function StepAddOns({ formData, updateFormData }: StepAddOnsProps) {
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddOns = async () => {
      const { data } = await supabase
        .from("add_ons")
        .select("*")
        .eq("is_active", true)
        .order("created_at");

      if (data) setAddOns(data);
      setLoading(false);
    };

    fetchAddOns();
  }, []);

  const toggleAddOn = (addOnId: string) => {
    const newSelectedAddOns = formData.selectedAddOns.includes(addOnId)
      ? formData.selectedAddOns.filter((id) => id !== addOnId)
      : [...formData.selectedAddOns, addOnId];

    updateFormData({ selectedAddOns: newSelectedAddOns });
  };

  const selectedAddOnsData = addOns.filter((addon) =>
    formData.selectedAddOns.includes(addon.id)
  );

  const addOnsTotal = calculateAddOnsTotal(selectedAddOnsData);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-[#1976D2] border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-[#6b7280]">جاري تحميل الإضافات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">خدمات إضافية</h2>
        <p className="text-[#6b7280]">اختار الإضافات اللي تحب تضيفها لغسيلة سيارتك</p>
      </div>

      {addOns.length === 0 ? (
        <div className="text-center py-12 bg-[#faf8f5] rounded-xl">
          <Sparkles className="w-12 h-12 text-[#1976D2] mx-auto mb-4" />
          <p className="text-[#6b7280]">لا توجد إضافات متاحة حالياً</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addOns.map((addon) => {
            const isSelected = formData.selectedAddOns.includes(addon.id);

            return (
              <Card
                key={addon.id}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "border-2 border-[#1976D2] bg-[#1976D2]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => toggleAddOn(addon.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? "bg-[#1976D2]/20" : "bg-gray-100"
                        }`}
                      >
                        <Plus
                          className={`w-5 h-5 ${
                            isSelected ? "text-[#1976D2]" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{addon.name_ar}</h3>
                        {addon.description && (
                          <p className="text-sm text-[#6b7280]">{addon.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-[#1976D2]">
                        {formatPriceWithCurrency(addon.price)}
                      </span>
                      <Switch
                        checked={isSelected}
                        onCheckedChange={() => toggleAddOn(addon.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  {addon.duration_minutes && (
                    <div className="mt-3">
                      <Badge variant="secondary" className="text-xs">
                        +{addon.duration_minutes} دقيقة
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add-ons Total */}
      {selectedAddOnsData.length > 0 && (
        <div className="bg-[#faf8f5] border border-[#1976D2]/20 rounded-xl p-4 mt-6">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#1a1a1a]">
              الإضافات المختارة ({selectedAddOnsData.length})
            </span>
            <span className="font-bold text-[#1976D2]">
              {formatPriceWithCurrency(addOnsTotal)}
            </span>
          </div>
          <div className="mt-2 space-y-1">
            {selectedAddOnsData.map((addon) => (
              <div
                key={addon.id}
                className="flex items-center justify-between text-sm text-[#6b7280]"
              >
                <span>{addon.name_ar}</span>
                <span>{formatPriceWithCurrency(addon.price)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-[#6b7280] bg-[#faf8f5] p-3 rounded-lg">
        * الإضافات اختيارية وممكن تضيفها أو تشيلها في أي وقت قبل تأكيد الحجز
      </p>
    </div>
  );
}
