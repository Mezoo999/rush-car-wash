"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Download, 
  Eye, 
  Phone, 
  MapPin, 
  Calendar,
  User,
  Car,
  ArrowRight,
  Filter,
  X
} from "lucide-react";
import { useRealtimeOrders } from "@/lib/hooks/use-realtime";
import { Order, OrderStatus, STATUS_LABELS, PAYMENT_METHOD_LABELS } from "@/types";
import { formatPriceWithCurrency, formatDate } from "@/lib/utils/pricing";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  assigned: "bg-purple-500",
  on_the_way: "bg-orange-500",
  in_progress: "bg-cyan-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

export default function AdminOrdersPage() {
  const { orders, loading } = useRealtimeOrders({ userRole: "admin" });
  const [workers, setWorkers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.car?.plate_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.slice(0, 8).includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesDate = !dateFilter || order.preferred_date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const exportToCSV = () => {
    const headers = [
      "Order ID", "Date", "Customer", "Phone", "Car", "Service", 
      "Address", "Preferred Date", "Time", "Status", "Total", "Payment"
    ];
    
    const rows = filteredOrders.map(order => [
      order.id,
      order.created_at,
      "عميل",
      "-",
      `${order.car?.brand} ${order.car?.model} (${order.car?.plate_number})`,
      order.service?.name_ar || "خدمة غسيل",
      order.address,
      order.preferred_date,
      order.preferred_time,
      STATUS_LABELS[order.status],
      order.total_amount,
      PAYMENT_METHOD_LABELS[order.payment_method]
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    
    toast.success("تم تصدير الطلبات بنجاح");
  };

  const assignWorker = async (orderId: string, workerId: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        // @ts-expect-error - Supabase SSR types issue
        .update({ worker_id: workerId, status: "assigned" })
        .eq("id", orderId);

      if (!error) {
        toast.success("تم تعيين العامل بنجاح");
      }
    } catch (err) {
      toast.error("فشل في تعيين العامل");
    }
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        // @ts-expect-error - Supabase SSR types issue
        .update({ status })
        .eq("id", orderId);

      if (!error) {
        toast.success(`تم تحديث الحالة إلى: ${STATUS_LABELS[status]}`);
      }
    } catch (err) {
      toast.error("فشل في تحديث الحالة");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#d4a574] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1a1a1a] text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="icon" className="text-white">
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">إدارة الطلبات</h1>
              <p className="text-sm text-gray-400">عرض وإدارة جميع الطلبات</p>
            </div>
          </div>
          <Button onClick={exportToCSV} variant="outline" className="text-white border-white hover:bg-white/10">
            <Download className="w-4 h-4 ml-2" />
            تصدير CSV
          </Button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="بحث برقم اللوحة أو العنوان أو رقم الهاتف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
                  className="border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">جميع الحالات</option>
                  {Object.entries(STATUS_LABELS).map(([status, label]) => (
                    <option key={status} value={status}>{label}</option>
                  ))}
                </select>
                
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-auto"
                />
                
                {(searchTerm || statusFilter !== "all" || dateFilter) && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setDateFilter("");
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Grid */}
        <div className="grid gap-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600">لا توجد طلبات</h3>
                <p className="text-gray-400">جرب تغيير معايير البحث</p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid lg:grid-cols-12 gap-4 items-start">
                      {/* Order Info */}
                      <div className="lg:col-span-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-sm text-gray-500">#{order.id.slice(-6).toUpperCase()}</span>
                          <Badge className={`${statusColors[order.status]} text-white text-xs`}>
                            {STATUS_LABELS[order.status]}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg">
                          {order.service?.name_ar || 'خدمة غسيل'}
                        </h3>
                        <p className="text-2xl font-bold text-[#1a1a1a]">
                          {formatPriceWithCurrency(order.total_amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {PAYMENT_METHOD_LABELS[order.payment_method]}
                        </p>
                      </div>

                      {/* Customer & Car */}
                      <div className="lg:col-span-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>عميل</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-gray-400" />
                          <span>{order.car?.brand} {order.car?.model}</span>
                        </div>
                        <p className="text-sm text-gray-500" dir="ltr">{order.car?.plate_number}</p>
                      </div>

                      {/* Location & Time */}
                      <div className="lg:col-span-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                          <span className="text-sm">{order.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(order.preferred_date)} - {order.preferred_time}</span>
                        </div>
                        {order.google_maps_link && (
                          <a 
                            href={order.google_maps_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline"
                          >
                            عرض على الخريطة
                          </a>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="lg:col-span-3 flex flex-col gap-2">
                        {!order.worker ? (
                          <select
                            className="border rounded-lg px-3 py-2 text-sm w-full"
                            onChange={(e) => e.target.value && assignWorker(order.id, e.target.value)}
                            value=""
                          >
                            <option value="">تعيين عامل...</option>
                            {workers.map((w) => (
                              <option key={w.id} value={w.user_id}>
                                {w.user?.full_name || w.employee_id}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="text-sm bg-gray-100 rounded-lg px-3 py-2">
                            <span className="text-gray-500">العامل: </span>
                            <span className="font-medium">{order.worker.full_name}</span>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {order.status === "pending" && (
                            <Button
                              size="sm"
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => updateStatus(order.id, "confirmed")}
                            >
                              تأكيد
                            </Button>
                          )}
                          {order.status === "confirmed" && (
                            <Button
                              size="sm"
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                              onClick={() => updateStatus(order.id, "assigned")}
                            >
                              تعيين
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4 ml-1" />
                            التفاصيل
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
