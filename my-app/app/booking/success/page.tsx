"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Phone, Clock, MessageCircle, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { createWhatsAppLink, createOrderWhatsAppMessage } from "@/lib/utils/validation";
import { Order } from "@/types";
import { supabase } from "@/lib/supabase/client";

const BUSINESS_WHATSAPP = "01031564146";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    if (!orderId) return;
    
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          car:car_id (*),
          service:service_id (*),
          package:package_id (*)
        `)
        .eq("id", orderId)
        .single();
        
      if (error) throw error;
      setOrder(data);
    } catch (error) {
      // Error handled silently - order details not critical for success page
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppMessage = () => {
    if (!order) return "مرحباً رشة، أريد تأكيد طلبي";
    
    const serviceName = order.service?.name_ar || "خدمة غسيل";
    
    return createOrderWhatsAppMessage({
      orderId: order.id,
      customerName: "عميل رشة",
      service: serviceName,
      date: order.preferred_date,
      time: order.preferred_time,
      address: order.address,
      total: order.total_amount,
    });
  };

  const whatsappLink = createWhatsAppLink(BUSINESS_WHATSAPP, getWhatsAppMessage());

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E3F2FD] flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#1976D2]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E3F2FD] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-[#FFA726]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#FFA726]" />
          </div>

          <h1 className="text-2xl font-bold text-[#1E3A5F] mb-4">
            تم استلام طلبك بنجاح!
          </h1>

          <p className="text-[#1976D2] mb-6">
            هنتواصل معاك في أقرب وقت عشان نأكد الحجز ونحدد كل التفاصيل.
            شكراً لاختيارك رشة!
          </p>

          {order && (
            <div className="bg-[#E3F2FD] rounded-lg p-4 mb-6 text-right">
              <h3 className="font-semibold text-[#1E3A5F] mb-3 text-center">تفاصيل الطلب:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#1976D2]">رقم الطلب:</span>
                  <span className="font-semibold" dir="ltr">#{order.id.slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1976D2]">الخدمة:</span>
                  <span className="font-semibold">{order.service?.name_ar || "خدمة غسيل"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1976D2]">التاريخ:</span>
                  <span className="font-semibold">{order.preferred_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1976D2]">الوقت:</span>
                  <span className="font-semibold">{order.preferred_time}</span>
                </div>
                <div className="flex justify-between border-t border-[#64B5F6] pt-2 mt-2">
                  <span className="text-[#1976D2]">الإجمالي:</span>
                  <span className="font-bold text-[#FFA726]">{order.total_amount} جنيه</span>
                </div>
              </div>
            </div>
          )}

          {/* WhatsApp CTA */}
          <div className="bg-[#FFA726]/10 border border-[#FFA726]/20 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-[#1E3A5F] mb-2 flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              تأكيد سريع عبر واتساب
            </h3>
            <p className="text-sm text-[#1976D2] mb-3">
              اضغط على الزر تحت عشان تبعت تفاصيل طلبك على واتساب ونتواصل معاك فوراً
            </p>
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white">
                <MessageCircle className="w-4 h-4 ml-2" />
                إرسال الطلب عبر واتساب
                <ExternalLink className="w-4 h-4 mr-2" />
              </Button>
            </a>
          </div>

          <div className="bg-[#E3F2FD] rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-[#1E3A5F] mb-3">معلومات التواصل:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-4 h-4 text-[#FFA726]" />
                <a href={`tel:+20${BUSINESS_WHATSAPP.slice(1)}`} className="hover:text-[#FFA726] text-[#1976D2]" dir="ltr">
                  {BUSINESS_WHATSAPP}
                </a>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-[#FFA726]" />
                <span className="text-[#1976D2]">مواعيد العمل: 9 ص - 9 م</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/dashboard">
              <Button className="w-full bg-[#1976D2] hover:bg-[#1E3A5F] text-white">
                متابعة طلباتي
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full border-[#1976D2] text-[#1976D2]">
                العودة للرئيسية
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#E3F2FD] flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#1976D2]" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
