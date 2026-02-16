"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard, 
  Banknote, 
  Check,
  Loader2,
  Sparkles,
  Plus
} from "lucide-react";
import { 
  BookingFormData, 
  Service, 
  AddOn, 
  CarCategory, 
  CATEGORY_LABELS,
  PAYMENT_METHOD_LABELS,
  PaymentMethod
} from "@/types";
import { 
  formatPriceWithCurrency, 
  calculateServicePrice,
  calculateAddOnsTotal,
  formatDate,
  formatTime
} from "@/lib/utils/pricing";
import { supabase } from "@/lib/supabase/client";

interface StepSummaryProps {
  formData: BookingFormData;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function StepSummary({ formData, isSubmitting, onSubmit }: StepSummaryProps) {
  const [service, setService] = useState<Service | null>(null);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const promises = [];

      if (formData.selectedServiceId) {
        promises.push(
          supabase
            .from("services")
            .select("*")
            .eq("id", formData.selectedServiceId)
            .single()
            .then(({ data }) => setService(data))
        );
      }

      if (formData.selectedAddOns.length > 0) {
        promises.push(
          supabase
            .from("add_ons")
            .select("*")
            .in("id", formData.selectedAddOns)
            .then(({ data }) => setAddOns(data || []))
        );
      }

      await Promise.all(promises);
      setLoading(false);
    };

    fetchData();
  }, [formData.selectedServiceId, formData.selectedAddOns]);

  const basePrice = service
    ? calculateServicePrice(service, formData.carCategory)
    : 0;

  const addOnsTotal = calculateAddOnsTotal(addOns);
  const totalPrice = basePrice + addOnsTotal;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-[#1976D2] border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-[#6b7280]">جاري تحميل تفاصيل الحجز...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">ملخص الحجز</h2>
        <p className="text-[#6b7280]">راجع تفاصيل حجزك قبل التأكيد</p>
      </div>

      {/* Car Details */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#1976D2]/20 flex items-center justify-center">
              <Car className="w-5 h-5 text-[#1976D2]" />
            </div>
            <h3 className="font-bold text-lg">بيانات السيارة</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[#6b7280]">الماركة:</span>
              <span className="mr-2 font-semibold">{formData.carBrand}</span>
            </div>
            <div>
              <span className="text-[#6b7280]">الموديل:</span>
              <span className="mr-2 font-semibold">{formData.carModel}</span>
            </div>
            <div>
              <span className="text-[#6b7280]">النوع:</span>
              <span className="mr-2 font-semibold">{CATEGORY_LABELS[formData.carCategory]}</span>
            </div>
            <div>
              <span className="text-[#6b7280]">اللون:</span>
              <span className="mr-2 font-semibold">{formData.carColor}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[#6b7280]">رقم اللوحة:</span>
              <span className="mr-2 font-semibold">{formData.plateNumber}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#1976D2]/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#1976D2]" />
            </div>
            <h3 className="font-bold text-lg">الخدمة المختارة</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">
                {service?.name_ar || 'خدمة غسيل'}
              </p>
              <p className="text-sm text-[#6b7280]">
                {service?.description}
              </p>
            </div>
            <span className="font-bold text-[#1976D2] text-lg">
              {formatPriceWithCurrency(basePrice)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Location & Time */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#1976D2]/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#1976D2]" />
            </div>
            <h3 className="font-bold text-lg">الموقع والوقت</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#6b7280]" />
              <span>{formData.address}</span>
            </div>
            {formData.googleMapsLink && (
              <div className="text-xs text-[#1976D2]">
                <a href={formData.googleMapsLink} target="_blank" rel="noopener noreferrer">
                  عرض على الخريطة
                </a>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#6b7280]" />
              <span>{formatDate(formData.preferredDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#6b7280]" />
              <span>{formatTime(formData.preferredTime)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add-ons */}
      {addOns.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#1976D2]/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-[#1976D2]" />
              </div>
              <h3 className="font-bold text-lg">إضافات</h3>
            </div>
            <div className="space-y-2">
              {addOns.map((addon) => (
                <div key={addon.id} className="flex items-center justify-between text-sm">
                  <span>{addon.name_ar}</span>
                  <span className="font-semibold">{formatPriceWithCurrency(addon.price)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Method */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#1976D2]/20 flex items-center justify-center">
              {formData.paymentMethod === 'cash' ? (
                <Banknote className="w-5 h-5 text-[#1976D2]" />
              ) : (
                <CreditCard className="w-5 h-5 text-[#1976D2]" />
              )}
            </div>
            <h3 className="font-bold text-lg">طريقة الدفع</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {PAYMENT_METHOD_LABELS[formData.paymentMethod]}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Total */}
      <Card className="bg-[#1a1a1a] text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 mb-1">الإجمالي</p>
              <p className="text-3xl font-bold">{formatPriceWithCurrency(totalPrice)}</p>
            </div>
            <Button
              size="lg"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="bg-[#1976D2] hover:bg-[#c49464] text-[#1a1a1a] font-bold px-8"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Check className="w-5 h-5 ml-2" />
                  تأكيد الحجز
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {formData.customerNotes && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">ملاحظات</h4>
          <p className="text-sm text-gray-600">{formData.customerNotes}</p>
        </div>
      )}
    </div>
  );
}
