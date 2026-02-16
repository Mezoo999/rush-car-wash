"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Phone, 
  Car, 
  Clock, 
  Navigation,
  CheckCircle,
  PlayCircle,
  Flag,
  RefreshCw,
  LogOut,
  Wallet,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { useRealtimeOrders, useWorkerEarnings } from "@/lib/hooks/use-realtime";
import { Order, OrderStatus, STATUS_LABELS, STATUS_COLORS } from "@/types";
import { formatPriceWithCurrency, formatDate, formatTime } from "@/lib/utils/pricing";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { JobCardSkeleton } from "@/components/ui-enhancements/skeletons";

export default function WorkerJobsPage() {
  const router = useRouter();
  const [workerId, setWorkerId] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const { orders, loading } = useRealtimeOrders({ userId: workerId || undefined, userRole: "worker" });
  const { earnings, loading: earningsLoading } = useWorkerEarnings(workerId);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [showEarnings, setShowEarnings] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          toast.error("يرجى تسجيل الدخول أولاً");
          router.push("/worker/login");
          return;
        }

        const { data: workerData, error: workerError } = await supabase
          .from("workers")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (workerError || !workerData) {
          toast.error("ليس لديك صلاحيات عامل");
          await supabase.auth.signOut();
          router.push("/worker/login");
          return;
        }

        setWorkerId(user.id);
      } catch (err) {
        toast.error("حدث خطأ في التحقق من الصلاحيات");
        router.push("/worker/login");
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("تم تسجيل الخروج");
    router.push("/worker/login");
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingOrder(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        // @ts-expect-error - Supabase SSR types issue
        .update({ status })
        .eq("id", orderId);

      if (!error) {
        toast.success(`تم تحديث الحالة: ${STATUS_LABELS[status]}`);
        
        // Add to status history
        // @ts-expect-error - Supabase SSR types issue
        await supabase.from("order_status_history").insert({
          order_id: orderId,
          status,
          changed_by: workerId,
          notes: `تم التحديث من قبل العامل`,
        });
      } else {
        toast.error("حدث خطأ في التحديث");
      }
    } catch (err) {
      toast.error("حدث خطأ في التحديث");
    }
    setUpdatingOrder(null);
  };

  const activeOrders = orders.filter((o) => 
    ["assigned", "on_the_way", "in_progress"].includes(o.status)
  );
  
  const completedOrders = orders.filter((o) => o.status === "completed");

  const today = new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isAuthChecking || loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5]">
        <header className="bg-[#1a1a1a] text-white p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
        </header>
        <div className="p-4 space-y-4">
          <JobCardSkeleton />
          <JobCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-20">
      {/* Header */}
      <header className="bg-[#1a1a1a] text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">مهام اليوم</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{today}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEarnings(!showEarnings)}
              className="text-white hover:text-[#d4a574]"
            >
              <Wallet className="w-4 h-4 ml-1" />
              {showEarnings ? "إخفاء" : "أرباحي"}
            </Button>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <Badge className="bg-[#d4a574] text-[#1a1a1a]">
              {activeOrders.length} مهمة
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:text-[#d4a574] mr-2"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Earnings Summary */}
      <AnimatePresence>
        {showEarnings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] text-white p-4">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                ملخص الأرباح
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#d4a574]">
                    {formatPriceWithCurrency(earnings.today)}
                  </p>
                  <p className="text-xs text-gray-400">اليوم</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">
                    {formatPriceWithCurrency(earnings.week)}
                  </p>
                  <p className="text-xs text-gray-400">هذا الأسبوع</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">
                    {formatPriceWithCurrency(earnings.month)}
                  </p>
                  <p className="text-xs text-gray-400">هذا الشهر</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between text-sm">
                <span>إجمالي المهام: {earnings.totalJobs}</span>
                <span>مكتملة: {earnings.completedJobs}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 space-y-4">
        {/* Active Orders */}
        <AnimatePresence>
          {activeOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-[#d4a574]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-[#d4a574]" />
              </div>
              <p className="text-lg font-medium text-[#1a1a1a]">لا توجد مهام حالية</p>
              <p className="text-sm text-[#6b7280] mt-2">
                {completedOrders.length} مهمة مكتملة اليوم
              </p>
              {earnings.today > 0 && (
                <p className="text-sm text-[#d4a574] mt-2 font-semibold">
                  أرباح اليوم: {formatPriceWithCurrency(earnings.today)}
                </p>
              )}
            </motion.div>
          ) : (
            activeOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <JobCard 
                  order={order} 
                  onStatusChange={updateOrderStatus}
                  isUpdating={updatingOrder === order.id}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* Completed Orders */}
        {completedOrders.length > 0 && (
          <>
            <div className="pt-6 pb-2">
              <h2 className="text-sm font-semibold text-[#6b7280] flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                المهام المكتملة ({completedOrders.length})
              </h2>
            </div>
            <AnimatePresence>
              {completedOrders.slice(0, 5).map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <JobCard 
                    order={order} 
                    onStatusChange={updateOrderStatus}
                    isUpdating={updatingOrder === order.id}
                    isCompleted
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {completedOrders.length > 5 && (
              <p className="text-center text-sm text-gray-500 py-2">
                +{completedOrders.length - 5} مهام أخرى
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface JobCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  isUpdating: boolean;
  isCompleted?: boolean;
}

import { Skeleton } from "@/components/ui/skeleton";

function JobCard({ order, onStatusChange, isUpdating, isCompleted }: JobCardProps) {
  const statusSteps = [
    { status: "assigned", label: "تم التعيين", icon: CheckCircle },
    { status: "on_the_way", label: "في الطريق", icon: Navigation },
    { status: "in_progress", label: "قيد التنفيذ", icon: PlayCircle },
    { status: "completed", label: "مكتمل", icon: Flag },
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.status === order.status);
  const [showMap, setShowMap] = useState(false);

  const callCustomer = () => {
    // Customer phone not available in order data - would need to fetch separately
    toast.info("الاتصال بالعميل غير متوفر حالياً");
  };

  const openNavigation = () => {
    if (order.google_maps_link) {
      window.open(order.google_maps_link, '_blank');
    } else {
      const encodedAddress = encodeURIComponent(order.address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  return (
    <Card className={`overflow-hidden ${isCompleted ? 'opacity-70' : ''}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Car className="w-5 h-5 text-[#d4a574]" />
              <span className="font-bold text-lg">
                {order.car?.brand} {order.car?.model}
              </span>
            </div>
            <p className="text-sm text-gray-500">{order.car?.plate_number}</p>
          </div>
          <Badge className={STATUS_COLORS[order.status]}>
            {STATUS_LABELS[order.status]}
          </Badge>
        </div>

        {/* Service Info */}
        <div className="bg-[#faf8f5] rounded-lg p-3 mb-4">
          <p className="font-medium">{order.service?.name_ar || 'خدمة غسيل'}</p>
          <p className="text-sm text-[#d4a574] font-bold mt-1">
            {formatPriceWithCurrency(order.total_amount)}
          </p>
        </div>

        {/* Location & Time */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600">{order.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {formatDate(order.preferred_date)} - {formatTime(order.preferred_time)}
            </span>
          </div>
        </div>

        {/* Status Progress */}
        {!isCompleted && (
          <div className="mb-4">
            <div className="flex justify-between mb-3">
              {statusSteps.map((step, index) => (
                <div key={step.status} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                      index <= currentStepIndex
                        ? "bg-[#d4a574] text-white shadow-lg"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] sm:text-xs mt-2 text-gray-500 font-medium">{step.label}</span>
                </div>
              ))}
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#d4a574] rounded-full transition-all duration-500"
                style={{ width: `${((currentStepIndex + 1) / statusSteps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons - Larger for mobile */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Button
            variant="outline"
            className="h-12 sm:h-11 text-base font-medium touch-target"
            onClick={openNavigation}
          >
            <Navigation className="w-5 h-5" />
            الملاحة
          </Button>
          <Button
            variant="outline"
            className="h-12 sm:h-11 text-base font-medium touch-target"
            onClick={callCustomer}
          >
            <Phone className="w-5 h-5" />
            اتصال
          </Button>
        </div>

        {/* Status Update Buttons - Full width for easy tapping */}
        {!isCompleted && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="grid gap-3">
              {order.status === "assigned" && (
                <Button
                  size="lg"
                  className="w-full h-14 sm:h-12 text-base font-bold bg-[#d4a574] hover:bg-[#c49464] text-[#1a1a1a] shadow-lg"
                  onClick={() => onStatusChange(order.id, "on_the_way")}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Navigation className="w-5 h-5 ml-2" />
                      في الطريق للعميل
                    </>
                  )}
                </Button>
              )}
              {order.status === "on_the_way" && (
                <Button
                  size="lg"
                  className="w-full h-14 sm:h-12 text-base font-bold bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white shadow-lg"
                  onClick={() => onStatusChange(order.id, "in_progress")}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <PlayCircle className="w-5 h-5 ml-2" />
                      بدأغسيل السيارة
                    </>
                  )}
                </Button>
              )}
              {order.status === "in_progress" && (
                <Button
                  size="lg"
                  className="w-full h-14 sm:h-12 text-base font-bold bg-green-500 hover:bg-green-600 text-white shadow-lg"
                  onClick={() => onStatusChange(order.id, "completed")}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 ml-2" />
                      أكملت الغسيل
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
