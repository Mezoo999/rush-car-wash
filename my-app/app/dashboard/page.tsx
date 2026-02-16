"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Car, 
  Calendar, 
  MapPin, 
  Clock, 
  Star, 
  RefreshCw,
  ChevronLeft,
  Package,
  History,
  Settings,
  LogOut,
  Navigation,
  CreditCard
} from "lucide-react";
import { useRealtimeOrders } from "@/lib/hooks/use-realtime";
import { Order, OrderStatus, STATUS_LABELS, STATUS_COLORS } from "@/types";
import { formatPriceWithCurrency, formatDate, formatTime } from "@/lib/utils/pricing";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { toast } from "sonner";
import { RatingDialog } from "@/components/reviews/rating-system";

export default function CustomerDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        setUser(userData);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E3F2FD] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-[#1976D2]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#E3F2FD] flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="mb-4 text-[#1E3A5F]">يرجى تسجيل الدخول أولاً</p>
          <Link href="/booking">
            <Button className="bg-[#1976D2] hover:bg-[#1E3A5F]">الذهاب للحجز</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E3F2FD]">
      {/* Header */}
      <header className="bg-[#1E3A5F] text-white p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 bg-[#FFA726]">
              <AvatarFallback className="bg-[#FFA726] text-[#1E3A5F] font-bold">
                {user.full_name?.charAt(0) || "م"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold">{user.full_name || "عميلنا العزيز"}</h1>
              <p className="text-xs text-[#64B5F6]">{user.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="text-white hover:bg-[#1976D2]">
                <Settings className="w-4 h-4 ml-1" />
                الملف الشخصي
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-[#1976D2]">
                <ChevronLeft className="w-4 h-4 ml-1" />
                الرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 max-w-4xl">
        {/* Quick Stats */}
        <QuickStats userId={user.id} />

        {/* Tabs */}
        <Tabs defaultValue="active" className="mt-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">
              <Package className="w-4 h-4 ml-2" />
              الطلبات النشطة
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 ml-2" />
              السجل
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 ml-2" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            <ActiveOrders userId={user.id} />
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <OrderHistory userId={user.id} />
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <SettingsPanel user={user} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function QuickStats({ userId }: { userId: string }) {
  const [stats, setStats] = useState({ total: 0, completed: 0, totalSpent: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase
        .from("orders")
        .select("status, total_amount")
        .eq("user_id", userId);

      if (data) {
        const typedData = data as Array<{ status: string; total_amount: number }>;
        setStats({
          total: typedData.length,
          completed: typedData.filter((o) => o.status === "completed").length,
          totalSpent: typedData
            .filter((o) => o.status === "completed")
            .reduce((sum, o) => sum + o.total_amount, 0),
        });
      }
    };
    fetchStats();
  }, [userId]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-[#1976D2]">{stats.total}</div>
          <div className="text-sm text-[#1976D2]/70">إجمالي الطلبات</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
          <div className="text-sm text-[#1976D2]/70">مكتملة</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-[#FFA726]">
            {formatPriceWithCurrency(stats.totalSpent)}
          </div>
          <div className="text-sm text-[#1976D2]/70">إجمالي المصروفات</div>
        </CardContent>
      </Card>
    </div>
  );
}

function ActiveOrders({ userId }: { userId: string }) {
  const { orders, loading } = useRealtimeOrders({ userId, userRole: "customer" });
  const activeOrders = orders.filter((o) => 
    !["completed", "cancelled"].includes(o.status)
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#1976D2]" />
      </div>
    );
  }

  if (activeOrders.length === 0) {
    return (
      <Card className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-[#64B5F6] mb-4" />
        <p className="text-[#1976D2] mb-4">لا توجد طلبات نشطة حالياً</p>
        <Link href="/booking">
          <Button className="bg-[#FFA726] hover:bg-[#FF9800] text-[#1E3A5F]">
            اطلب رشة جديدة
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activeOrders.map((order) => (
        <OrderCard key={order.id} order={order} showTracking />
      ))}
    </div>
  );
}

function OrderHistory({ userId }: { userId: string }) {
  const { orders, loading } = useRealtimeOrders({ userId, userRole: "customer" });
  const completedOrders = orders.filter((o) => o.status === "completed");
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);

  if (loading) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#1976D2]" />
      </div>
    );
  }

  if (completedOrders.length === 0) {
    return (
      <Card className="text-center py-12">
        <History className="w-16 h-16 mx-auto text-[#64B5F6] mb-4" />
        <p className="text-[#1976D2]">لا توجد طلبات سابقة</p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {completedOrders.map((order) => (
          <OrderCard 
            key={order.id} 
            order={order} 
            showRebook 
            onRate={() => setRatingOrder(order)}
          />
        ))}
      </div>

      {ratingOrder && (
        <RatingDialog
          orderId={ratingOrder.id}
          workerId={ratingOrder.worker_id || ""}
          isOpen={!!ratingOrder}
          onClose={() => setRatingOrder(null)}
          onSubmit={() => {
            toast.success("تم إرسال التقييم بنجاح!");
            setRatingOrder(null);
          }}
        />
      )}
    </>
  );
}

function OrderCard({ order, showTracking, showRebook, onRate }: { 
  order: Order; 
  showTracking?: boolean;
  showRebook?: boolean;
  onRate?: () => void;
}) {
  const statusSteps = [
    { status: "pending", label: "معلق", icon: Clock },
    { status: "confirmed", label: "مؤكد", icon: Package },
    { status: "assigned", label: "تم التعيين", icon: Car },
    { status: "on_the_way", label: "في الطريق", icon: Navigation },
    { status: "in_progress", label: "قيد التنفيذ", icon: RefreshCw },
    { status: "completed", label: "مكتمل", icon: Star },
  ];

  const currentStep = statusSteps.findIndex((s) => s.status === order.status);

  const handleRebook = () => {
    // Store order details in localStorage for quick rebooking
    localStorage.setItem("rebook_data", JSON.stringify({
      carBrand: order.car?.brand,
      carModel: order.car?.model,
      carCategory: order.car?.category,
      serviceId: order.service_id,
    }));
    window.location.href = "/booking";
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-[#FFA726]" />
              <span className="font-bold text-[#1E3A5F]">
                {order.car?.brand} {order.car?.model}
              </span>
            </div>
            <p className="text-sm text-[#1976D2] mt-1">{order.car?.plate_number}</p>
          </div>
          <Badge className={STATUS_COLORS[order.status]}>
            {STATUS_LABELS[order.status]}
          </Badge>
        </div>

        {/* Service Info */}
        <div className="bg-[#E3F2FD] rounded-lg p-3 mb-4">
          <p className="font-medium text-[#1E3A5F]">{order.service?.name_ar || 'خدمة غسيل'}</p>
          <p className="text-[#FFA726] font-bold">{formatPriceWithCurrency(order.total_amount)}</p>
        </div>

        {/* Date & Location */}
        <div className="space-y-2 text-sm text-[#1976D2] mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(order.preferred_date)} - {formatTime(order.preferred_time)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{order.address}</span>
          </div>
        </div>

        {/* Progress Tracking */}
        {showTracking && (
          <div className="mt-4 pt-4 border-t border-[#64B5F6]">
            <div className="flex justify-between">
              {statusSteps.map((step, index) => (
                <div key={step.status} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep
                        ? "bg-[#FFA726] text-white"
                        : "bg-[#E3F2FD] text-[#1976D2]"
                    }`}
                  >
                    <step.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs mt-1 text-[#1976D2]">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rebook & Rate Buttons */}
        {showRebook && (
          <div className="mt-4 pt-4 border-t border-[#64B5F6] space-y-2">
            <Button 
              variant="outline" 
              className="w-full border-[#1976D2] text-[#1976D2]"
              onClick={handleRebook}
            >
              <RefreshCw className="w-4 h-4 ml-2" />
              حجز نفس الخدمة مرة أخرى
            </Button>
            {onRate && (
              <Button 
                className="w-full bg-[#FFA726] hover:bg-[#FF9800] text-[#1E3A5F]"
                onClick={onRate}
              >
                <Star className="w-4 h-4 ml-2" />
                قيم الخدمة
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SettingsPanel({ user }: { user: any }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("تم تسجيل الخروج");
    window.location.href = "/";
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>إعدادات الحساب</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>الاسم</Label>
            <Input value={user.full_name || ""} disabled className="mt-1" />
          </div>
          <div>
            <Label>رقم الهاتف</Label>
            <Input value={user.phone} disabled className="mt-1" dir="ltr" />
          </div>
          <div>
            <Label>البريد الإلكتروني</Label>
            <Input value={user.email || ""} disabled className="mt-1" dir="ltr" />
          </div>
          
          <Link href="/profile">
            <Button className="w-full mt-2 bg-[#FFA726] hover:bg-[#FF9800] text-[#1E3A5F]">
              <Settings className="w-4 h-4 ml-2" />
              إدارة الملف الشخصي الكامل
            </Button>
          </Link>
          
          <Button 
            variant="destructive" 
            className="w-full mt-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>روابط سريعة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link href="/profile">
            <Button variant="outline" className="w-full justify-start border-[#1976D2] text-[#1976D2]">
              <MapPin className="w-4 h-4 ml-2" />
              عناويني المحفوظة
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" className="w-full justify-start border-[#1976D2] text-[#1976D2]">
              <Car className="w-4 h-4 ml-2" />
              سياراتي
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" className="w-full justify-start border-[#1976D2] text-[#1976D2]">
              <CreditCard className="w-4 h-4 ml-2" />
              طرق الدفع
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component
function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-[#1E3A5F]">{children}</label>;
}

function Input(props: any) {
  return (
    <input
      {...props}
      className={`w-full px-3 py-2 border border-[#64B5F6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1976D2] ${props.className || ""}`}
    />
  );
}
