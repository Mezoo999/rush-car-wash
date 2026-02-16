"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  User, 
  Phone, 
  Mail, 
  Car,
  Calendar,
  ArrowRight,
  Loader2
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { User as UserType } from "@/types";
import Link from "next/link";
import { formatDate } from "@/lib/utils/pricing";

interface CustomerWithStats extends UserType {
  total_orders: number;
  total_spent: number;
  cars_count: number;
  last_order_date: string | null;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithStats | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // Fetch users with their orders and cars
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("*")
        .eq("role", "customer")
        .order("created_at", { ascending: false });

      if (usersError) throw usersError;

      // For each user, get their stats
      const customersWithStats = await Promise.all(
        (users || []).map(async (user: UserType) => {
          const { data: orders } = await supabase
            .from("orders")
            .select("total_amount, created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          const { data: cars } = await supabase
            .from("cars")
            .select("id")
            .eq("user_id", user.id);

          const typedOrders = orders as Array<{ total_amount: number; created_at: string }> | null;
          const totalOrders = typedOrders?.length || 0;
          const totalSpent = typedOrders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
          const lastOrderDate = typedOrders?.[0]?.created_at || null;

          return {
            ...user,
            total_orders: totalOrders,
            total_spent: totalSpent,
            cars_count: cars?.length || 0,
            last_order_date: lastOrderDate,
          };
        })
      );

      setCustomers(customersWithStats);
    } catch (error) {
      toast.error("فشل في تحميل بيانات العملاء");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.full_name?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#d4a574]" />
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
              <h1 className="text-xl font-bold">إدارة العملاء</h1>
              <p className="text-sm text-gray-400">قاعدة بيانات العملاء وتاريخهم</p>
            </div>
          </div>
          <Badge className="bg-[#d4a574] text-[#1a1a1a]">
            {customers.length} عميل
          </Badge>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="بحث بالاسم أو رقم الهاتف أو البريد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedCustomer(customer)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-[#d4a574]/20 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-[#d4a574]" />
                    </div>
                    <Badge variant={customer.total_orders > 0 ? "default" : "secondary"}>
                      {customer.total_orders} طلب
                    </Badge>
                  </div>

                  <h3 className="font-bold text-lg mb-1">
                    {customer.full_name || "عميل"}
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span dir="ltr">{customer.phone}</span>
                    </div>
                    
                    {customer.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-gray-600">
                      <Car className="w-4 h-4" />
                      <span>{customer.cars_count} سيارة</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>مسجل منذ {formatDate(customer.created_at)}</span>
                    </div>
                  </div>

                  {customer.total_orders > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">إجمالي المشتريات</span>
                        <span className="font-bold text-[#1a1a1a]">
                          {customer.total_spent.toLocaleString()} جنيه
                        </span>
                      </div>
                      {customer.last_order_date && (
                        <p className="text-xs text-gray-400 mt-1">
                          آخر طلب: {formatDate(customer.last_order_date)}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">لا يوجد عملاء</h3>
              <p className="text-gray-400">جرب تغيير معايير البحث</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
