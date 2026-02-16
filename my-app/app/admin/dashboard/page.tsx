"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Car, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  MapPin,
  RefreshCw,
  Search,
  Bell,
  TrendingUp,
  TrendingDown,
  Calendar,
  Star,
  AlertTriangle
} from "lucide-react";
import { useRealtimeOrders } from "@/lib/hooks/use-realtime";
import { Order, OrderStatus, STATUS_LABELS, STATUS_COLORS } from "@/types";
import { formatPriceWithCurrency, formatDate, formatTime } from "@/lib/utils/pricing";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { DashboardStatsSkeleton, OrdersTableSkeleton } from "@/components/ui-enhancements/skeletons";

const supabase = createClient();

interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  activeWorkers: number;
  pendingOrders: number;
  completionRate: number;
  averageOrderValue: number;
}

export default function AdminDashboardPage() {
  const { orders, loading, error } = useRealtimeOrders({ userRole: "admin" });
  const [workers, setWorkers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 0,
    todayRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    activeWorkers: 0,
    pendingOrders: 0,
    completionRate: 0,
    averageOrderValue: 0,
  });
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Fetch workers for assignment
  useEffect(() => {
    const fetchWorkers = async () => {
      const { data } = await supabase
        .from("workers")
        .select("*, user:users(*)")
        .eq("is_active", true);
      if (data) setWorkers(data);
    };
    fetchWorkers();
  }, []);

  // Calculate comprehensive stats
  useEffect(() => {
    if (!orders.length) return;

    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const todayOrders = orders.filter((o) => o.created_at.startsWith(today));
    const weekOrders = orders.filter((o) => o.created_at >= weekAgo);
    const monthOrders = orders.filter((o) => o.created_at >= monthAgo);
    
    const completedOrders = orders.filter((o) => o.status === "completed");
    const completionRate = orders.length > 0 
      ? Math.round((completedOrders.length / orders.length) * 100) 
      : 0;

    setStats({
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + o.total_amount, 0),
      weeklyRevenue: weekOrders
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + o.total_amount, 0),
      monthlyRevenue: monthOrders
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + o.total_amount, 0),
      activeWorkers: workers.length,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      completionRate,
      averageOrderValue: completedOrders.length > 0
        ? Math.round(completedOrders.reduce((sum, o) => sum + o.total_amount, 0) / completedOrders.length)
        : 0,
    });
  }, [orders, workers]);

  const assignWorker = async (orderId: string, workerId: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        // @ts-expect-error - Supabase SSR types issue
        .update({ worker_id: workerId, status: "assigned" })
        .eq("id", orderId);

      if (!error) {
        toast.success("تم تعيين العامل بنجاح");
        
        // Add status history
        // @ts-expect-error - Supabase SSR types issue
        await supabase.from("order_status_history").insert({
          order_id: orderId,
          status: "assigned",
          notes: `تم التعيين للعامل`,
        });
      } else {
        throw error;
      }
    } catch (err) {
      toast.error("فشل في تعيين العامل");
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        // @ts-expect-error - Supabase SSR types issue
        .update({ status })
        .eq("id", orderId);

      if (!error) {
        toast.success(`تم تحديث الحالة إلى: ${STATUS_LABELS[status]}`);
        
        // @ts-expect-error - Supabase SSR types issue
        await supabase.from("order_status_history").insert({
          order_id: orderId,
          status,
          notes: `تم التحديث من لوحة التحكم`,
        });
      } else {
        throw error;
      }
    } catch (err) {
      toast.error("فشل في تحديث الحالة");
    }
  };

  const bulkAssignWorker = async (workerId: string) => {
    if (selectedOrders.length === 0) {
      toast.error("يرجى اختيار طلبات أولاً");
      return;
    }

    try {
      const { error } = await supabase
        .from("orders")
        // @ts-expect-error - Supabase SSR types issue
        .update({ worker_id: workerId, status: "assigned" })
        .in("id", selectedOrders);

      if (!error) {
        toast.success(`تم تعيين العامل لـ ${selectedOrders.length} طلب`);
        setSelectedOrders([]);
      }
    } catch (err) {
      toast.error("فشل في التعيين الجماعي");
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = 
        order.car?.plate_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id?.slice(0, 8).includes(searchTerm);
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter === "today") {
        matchesDate = order.created_at.startsWith(new Date().toISOString().split("T")[0]);
      } else if (dateFilter === "week") {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        matchesDate = order.created_at >= weekAgo;
      } else if (dateFilter === "month") {
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        matchesDate = order.created_at >= monthAgo;
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const pendingOrdersCount = orders.filter(o => o.status === "pending").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-[#1a1a1a] text-white px-6 py-4">
          <Skeleton className="h-8 w-48" />
        </header>
        <div className="p-6 space-y-6">
          <DashboardStatsSkeleton />
          <OrdersTableSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">خطأ في تحميل البيانات</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dark Header */}
      <header className="bg-[#1a1a1a] text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#d4a574] rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-[#1a1a1a]" />
            </div>
            <div>
              <h1 className="text-xl font-bold">لمعة - لوحة التحكم</h1>
              <p className="text-sm text-gray-400">نظام إدارة الطلبات المباشر</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm">متصل مباشرة</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="طلبات اليوم"
            value={stats.todayOrders}
            icon={Clock}
            color="bg-blue-500"
            trend={stats.todayOrders > 5 ? "up" : "neutral"}
          />
          <StatCard
            title="إيرادات اليوم"
            value={formatPriceWithCurrency(stats.todayRevenue)}
            icon={DollarSign}
            color="bg-green-500"
            trend={stats.todayRevenue > 1000 ? "up" : "neutral"}
            subtitle={`الأسبوع: ${formatPriceWithCurrency(stats.weeklyRevenue)}`}
          />
          <StatCard
            title="إيرادات الشهر"
            value={formatPriceWithCurrency(stats.monthlyRevenue)}
            icon={TrendingUp}
            color="bg-purple-500"
            trend="up"
            subtitle={`متوسط: ${formatPriceWithCurrency(stats.averageOrderValue)}`}
          />
          <StatCard
            title="طلبات معلقة"
            value={stats.pendingOrders}
            icon={AlertTriangle}
            color="bg-orange-500"
            alert={stats.pendingOrders > 5}
            subtitle={`معدل الإكمال: ${stats.completionRate}%`}
          />
        </div>

        {/* Quick Actions */}
        {selectedOrders.length > 0 && (
          <Card className="bg-[#d4a574]/10 border-[#d4a574]">
            <CardContent className="p-4 flex items-center justify-between">
              <span className="font-semibold">{selectedOrders.length} طلب محدد</span>
              <div className="flex gap-2">
                <select
                  className="text-sm border rounded p-2"
                  onChange={(e) => e.target.value && bulkAssignWorker(e.target.value)}
                  value=""
                >
                  <option value="">تعيين عامل...</option>
                  {workers.map((w) => (
                    <option key={w.id} value={w.user_id}>
                      {w.user?.full_name || w.employee_id}
                    </option>
                  ))}
                </select>
                <Button variant="outline" size="sm" onClick={() => setSelectedOrders([])}>
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters - Enhanced layout */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row gap-0">
              {/* Search */}
              <div className="relative flex-1 p-4 border-b lg:border-b-0 lg:border-l border-gray-100">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="بحث برقم اللوحة أو العنوان أو رقم الهاتف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-12 h-12 bg-gray-50 border-0 focus:bg-white"
                />
              </div>
              
              {/* Date Filter */}
              <div className="p-4 border-b lg:border-b-0 lg:border-l border-gray-100 min-w-[180px]">
                <select
                  className="w-full h-12 px-4 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">كل التواريخ</option>
                  <option value="today">اليوم</option>
                  <option value="week">هذا الأسبوع</option>
                  <option value="month">هذا الشهر</option>
                </select>
              </div>
              
              {/* Status Filter Pills */}
              <div className="p-4 flex gap-2 overflow-x-auto scrollbar-hide">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                  className="flex-shrink-0 h-10"
                >
                  الكل
                </Button>
                {Object.entries(STATUS_LABELS).slice(0, 5).map(([status, label]) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className={`flex-shrink-0 h-10 ${statusFilter === status ? STATUS_COLORS[status as OrderStatus] : ""}`}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>الطلبات ({filteredOrders.length})</span>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
                <span className="text-sm text-gray-400">محدث لحظياً</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-2">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders(filteredOrders.map(o => o.id));
                          } else {
                            setSelectedOrders([]);
                          }
                        }}
                        className="rounded"
                      />
                    </th>
                    <th className="text-right py-3 px-4">رقم الطلب</th>
                    <th className="text-right py-3 px-4">السيارة</th>
                    <th className="text-right py-3 px-4">الخدمة</th>
                    <th className="text-right py-3 px-4">التاريخ</th>
                    <th className="text-right py-3 px-4">الحالة</th>
                    <th className="text-right py-3 px-4">العامل</th>
                    <th className="text-right py-3 px-4">المبلغ</th>
                    <th className="text-right py-3 px-4">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-2">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedOrders([...selectedOrders, order.id]);
                              } else {
                                setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                              }
                            }}
                            className="rounded"
                          />
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">
                          #{order.id.slice(0, 8)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span>{order.car?.brand} {order.car?.model}</span>
                            <span className="text-sm text-gray-500">{order.car?.plate_number}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {order.service?.name_ar || 'خدمة غسيل'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span>{formatDate(order.preferred_date)}</span>
                            <span className="text-sm text-gray-500">{formatTime(order.preferred_time)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={`${STATUS_COLORS[order.status]} text-white`}>
                            {STATUS_LABELS[order.status]}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {order.worker ? (
                            <span>{order.worker.full_name || order.worker_id?.slice(0, 8)}</span>
                          ) : (
                            <select
                              className="text-sm border rounded p-1"
                              onChange={(e) => e.target.value && assignWorker(order.id, e.target.value)}
                              value=""
                            >
                              <option value="">اختر عامل</option>
                              {workers.map((w) => (
                                <option key={w.id} value={w.user_id}>
                                  {w.user?.full_name || w.employee_id}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="py-3 px-4 font-bold">
                          {formatPriceWithCurrency(order.total_amount)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            {order.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateOrderStatus(order.id, "confirmed")}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-500"
                              onClick={() => updateOrderStatus(order.id, "cancelled")}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            {filteredOrders.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                لا توجد طلبات مطابقة للبحث
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  alert?: boolean;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
}

function StatCard({ title, value, icon: Icon, color, alert, trend, subtitle }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative"
    >
      <Card className={`overflow-hidden ${alert ? 'ring-2 ring-red-500' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">{title}</p>
              <h3 className="text-2xl font-bold">{value}</h3>
              {subtitle && (
                <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
              )}
            </div>
            <div className={`${color} p-3 rounded-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
          {trend && trend !== "neutral" && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend === "up" ? "text-green-500" : "text-red-500"
            }`}>
              {trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{trend === "up" ? "↑" : "↓"}</span>
            </div>
          )}
        </CardContent>
        {alert && (
          <div className="absolute top-2 left-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
        )}
      </Card>
    </motion.div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
