"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check, AlertCircle } from "lucide-react";
import { BookingFormData, OrderAddOn } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { StepCarDetails } from "./step-car-details";
import { StepService } from "./step-service";
import { StepLocationTime } from "./step-location-time";
import { StepAddOns } from "./step-addons";
import { StepSummary } from "./step-summary";
import { BookingStepSkeleton } from "@/components/ui-enhancements/skeletons";

const steps = [
  { id: 1, title: "بيانات عربية", description: "قولنا عربية ايه وكودها" },
  { id: 2, title: "اختار رشة", description: " اختار نوع الرشة اللي يناسبك" },
  { id: 3, title: "فين ومع مي", description: "حدد العنوان والوقت" },
  { id: 4, title: "إضافات", description: "لو عايز إضافات للرشة" },
  { id: 5, title: "تأكيد", description: "راجع واطلب رشنتك" },
];

const initialFormData: BookingFormData = {
  carBrand: "",
  carModel: "",
  carYear: new Date().getFullYear(),
  carColor: "",
  plateNumber: "",
  carCategory: "standard",
  selectedServiceId: null,
  orderType: "single",
  address: "",
  googleMapsLink: "",
  preferredDate: "",
  preferredTime: "",
  phone: "",
  selectedAddOns: [],
  paymentMethod: "cash",
  customerNotes: "",
};

// Validation functions
const validateStep = (step: number, formData: BookingFormData): string | null => {
  switch (step) {
    case 1:
      if (!formData.carBrand) return "يرجى اختيار ماركة السيارة";
      if (!formData.carModel.trim()) return "يرجى إدخال موديل السيارة";
      if (!formData.carColor.trim()) return "يرجى إدخال لون السيارة";
      if (!formData.plateNumber.trim()) return "يرجى إدخال رقم اللوحة";
      if (formData.plateNumber.trim().length < 3) return "رقم اللوحة يجب أن يكون 3 أحرف على الأقل";
      return null;
    case 2:
      if (!formData.selectedServiceId) return "يرجى اختيار خدمة";
      return null;
    case 3:
      if (!formData.address.trim()) return "يرجى إدخال العنوان";
      if (formData.address.trim().length < 10) return "العنوان يجب أن يكون 10 أحرف على الأقل";
      if (!formData.preferredDate) return "يرجى اختيار التاريخ";
      if (!formData.preferredTime) return "يرجى اختيار الوقت";
      if (!formData.phone) return "يرجى إدخال رقم الهاتف";
      const cleanPhone = formData.phone.replace(/[\s\-()]/g, '');
      if (!/^(01[0-9]{9}|201[0-9]{9}|\+201[0-9]{9})$/.test(cleanPhone)) {
        return "رقم الهاتف غير صحيح. مثال: 01xxxxxxxxx";
      }
      return null;
    case 4:
      return null; // Add-ons are optional
    case 5:
      return null;
    default:
      return null;
  }
};

export function BookingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Load user data and initial state
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          router.push('/auth/login?redirect=/booking');
          return;
        }
        
        setUser(authUser);
        
        // Check for rebook data
        const rebookData = localStorage.getItem("rebook_data");
        if (rebookData) {
          const parsed = JSON.parse(rebookData);
          setFormData(prev => ({
            ...prev,
            carBrand: parsed.carBrand || prev.carBrand,
            carModel: parsed.carModel || prev.carModel,
            carCategory: parsed.carCategory || prev.carCategory,
            selectedServiceId: parsed.serviceId || prev.selectedServiceId,
          }));
          localStorage.removeItem("rebook_data");
        }
        
        // Load user's phone if available
        const { data: userData } = await supabase
          .from('users')
          .select('phone')
          .eq('id', authUser.id)
          .single() as { data: { phone: string } | null };
        
        if (userData?.phone) {
          setFormData(prev => ({ ...prev, phone: userData.phone }));
        }
      } catch (error) {
        console.error("Error initializing booking wizard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    init();
  }, [router]);

  const updateFormData = useCallback((data: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setValidationError(null); // Clear validation error on change
  }, []);

  const handleNext = useCallback(() => {
    const error = validateStep(currentStep, formData);
    if (error) {
      setValidationError(error);
      toast.error(error);
      return;
    }
    
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, formData]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setValidationError(null);
    }
  }, [currentStep]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      if (!user) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }
      
      // Validate data
      if (!formData.selectedServiceId) {
        throw new Error('يجب اختيار خدمة');
      }

      // Update user phone
      const { error: userUpdateError } = await (supabase as any)
        .from('users')
        .update({ phone: formData.phone })
        .eq('id', user.id);
      
      if (userUpdateError) {
        console.error("Error updating user phone:", userUpdateError);
      }
      
      // Create or update car
      let carId: string;
      const { data: existingCar, error: carCheckError } = await (supabase as any)
        .from('cars')
        .select('id')
        .eq('user_id', user.id)
        .eq('plate_number', formData.plateNumber.trim())
        .maybeSingle();
      
      if (carCheckError) {
        console.error("Error checking existing car:", carCheckError);
      }
        
      if (existingCar) {
        carId = existingCar.id;
        const { error: carUpdateError } = await (supabase as any)
          .from('cars')
          .update({
            brand: formData.carBrand,
            model: formData.carModel,
            year: formData.carYear,
            color: formData.carColor,
            category: formData.carCategory,
          })
          .eq('id', carId);
        
        if (carUpdateError) {
          throw new Error('فشل في تحديث بيانات السيارة');
        }
      } else {
        const { data: newCar, error: carError } = await (supabase as any)
          .from('cars')
          .insert({
            user_id: user.id,
            brand: formData.carBrand,
            model: formData.carModel,
            year: formData.carYear,
            color: formData.carColor,
            plate_number: formData.plateNumber.trim(),
            category: formData.carCategory,
          })
          .select()
          .single();
          
        if (carError || !newCar) {
          console.error('Car insert error:', carError);
          throw new Error(`فشل في حفظ بيانات السيارة: ${carError?.message || 'خطأ غير معروف'}`);
        }
        carId = newCar.id;
      }
      
      // Get service pricing
      let basePrice = 0;
      
      const { data: service, error: serviceError } = await (supabase as any)
        .from('services')
        .select('*')
        .eq('id', formData.selectedServiceId)
        .single();
      
      if (serviceError || !service) {
        console.error('Service fetch error:', serviceError);
        throw new Error(`فشل في تحميل بيانات الخدمة: ${serviceError?.message || 'خطأ غير معروف'}`);
      }
      
      basePrice = formData.carCategory === 'suv' ? service.base_price_suv : 
                  formData.carCategory === 'luxury' ? service.base_price_luxury : 
                  service.base_price_standard;
      
      // Calculate add-ons
      let addOnsTotal = 0;
      let addOnsWithPrices: Array<{ id: string; price: number }> = [];
      
      if (formData.selectedAddOns.length > 0) {
        const { data: addOns, error: addOnsError } = await (supabase as any)
          .from('add_ons')
          .select('id, price')
          .in('id', formData.selectedAddOns);
        
        if (addOnsError) {
          throw new Error('فشل في تحميل الإضافات');
        }
        
        if (addOns) {
          addOnsTotal = addOns.reduce((sum: number, addon: { price: number }) => sum + addon.price, 0);
          addOnsWithPrices = addOns.map((a: { id: string; price: number }) => ({ id: a.id, price: a.price }));
        }
      }
      
      const totalAmount = basePrice + addOnsTotal;
      
      // Create order
      const { data: order, error: orderError } = await (supabase as any)
        .from('orders')
        .insert({
          user_id: user.id,
          car_id: carId,
          service_id: formData.selectedServiceId,
          order_type: 'single',
          base_price: basePrice,
          category_multiplier: formData.carCategory === 'suv' ? 1.2 : formData.carCategory === 'luxury' ? 1.35 : 1.0,
          add_ons_total: addOnsTotal,
          discount_amount: 0,
          total_amount: totalAmount,
          address: formData.address.trim(),
          google_maps_link: formData.googleMapsLink || null,
          preferred_date: formData.preferredDate,
          preferred_time: formData.preferredTime,
          status: 'pending',
          worker_id: null,
          payment_method: formData.paymentMethod,
          payment_status: 'pending',
          customer_notes: formData.customerNotes || null,
          admin_notes: null,
        })
        .select()
        .single();
        
      if (orderError || !order) {
        console.error("Order creation error:", orderError);
        throw new Error('فشل في إنشاء الطلب');
      }
      
      // Add order add-ons with correct prices
      if (addOnsWithPrices.length > 0) {
        const { error: addOnsInsertError } = await (supabase as any)
          .from('order_add_ons')
          .insert(
            addOnsWithPrices.map(addon => ({
              order_id: order.id,
              add_on_id: addon.id,
              price_at_time: addon.price,
            }))
          );
        
        if (addOnsInsertError) {
          console.error("Error adding order add-ons:", addOnsInsertError);
        }
      }

      // Create order status history entry
      await (supabase as any)
        .from('order_status_history')
        .insert({
          order_id: order.id,
          status: 'pending',
          changed_by: user.id,
          notes: 'تم إنشاء الطلب',
        });

      toast.success('تم إنشاء الطلب بنجاح!');
      router.push(`/booking/success?order_id=${order.id}`);
      
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error instanceof Error ? error.message : 'حدث خطأ أثناء إنشاء الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = useCallback(() => {
    return validateStep(currentStep, formData) === null;
  }, [currentStep, formData]);

  const progress = (currentStep / steps.length) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] to-white py-6 px-4">
        <div className="max-w-2xl mx-auto">
          <BookingStepSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] to-white py-4 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A5F] mb-2">احجز رشنتك دلوقتي 🚗✨</h1>
          <p className="text-[#1976D2] text-sm sm:text-base">في ثواني عربية تكون لامعة كالجديد</p>
        </motion.div>

        {/* Progress - Enhanced for mobile */}
        <div className="mb-6 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#1E3A5F] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1976D2] text-white text-xs flex items-center justify-center">
                {currentStep}
              </span>
              من {steps.length}
            </span>
            <span className="text-sm font-medium text-[#1976D2]">{steps[currentStep - 1].title}</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-100" />
        </div>

        {/* Steps Indicator - Horizontal scrollable on mobile */}
        <div className="flex justify-between mb-6 overflow-x-auto scrollbar-hide py-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center min-w-[60px] sm:min-w-[80px] flex-shrink-0 ${
                index + 1 <= currentStep ? "opacity-100" : "opacity-40"
              }`}
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 shadow-sm ${
                  index + 1 < currentStep
                    ? "bg-green-500 text-white"
                    : index + 1 === currentStep
                    ? "bg-[#1976D2] text-[#1E3A5F] ring-4 ring-[#1976D2]/20"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {index + 1 < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-bold text-sm sm:text-base">{step.id}</span>
                )}
              </div>
              <span className="text-[10px] sm:text-xs text-center font-medium text-gray-600 leading-tight">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Validation Error - Better visibility */}
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3 text-red-700"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{validationError}</span>
          </motion.div>
        )}

        {/* Step Content */}
        <Card className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && (
                  <StepCarDetails formData={formData} updateFormData={updateFormData} />
                )}
                {currentStep === 2 && (
                  <StepService formData={formData} updateFormData={updateFormData} />
                )}
                {currentStep === 3 && (
                  <StepLocationTime formData={formData} updateFormData={updateFormData} />
                )}
                {currentStep === 4 && (
                  <StepAddOns formData={formData} updateFormData={updateFormData} />
                )}
                {currentStep === 5 && (
                  <StepSummary
                    formData={formData}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation Buttons - Mobile optimized */}
        <div className="flex justify-between gap-3 mt-6 sticky bottom-0 bg-[#faf8f5] py-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:bg-transparent safe-area-bottom">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex-1 sm:flex-none h-12 sm:h-11 text-base touch-target"
          >
            <ChevronRight className="w-5 h-5" />
            <span className="hidden sm:inline">رجوع</span>
          </Button>

          {currentStep < steps.length && (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 sm:flex-none h-12 sm:h-11 text-base bg-[#1E3A5F] hover:bg-[#2a2a2a] text-white touch-target"
            >
              التالي
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
