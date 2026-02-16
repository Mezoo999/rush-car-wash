"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data for orders
const orders = [
  {
    id: "ORD-001",
    customer: "أحمد محمد",
    service: "غسيل كامل",
    date: "2025-02-10",
    status: "completed",
    worker: "محمد علي",
    amount: 250,
  },
  {
    id: "ORD-002",
    customer: "خالد محمود",
    service: "تلميع داخلي",
    date: "2025-02-10",
    status: "in_progress",
    worker: "أحمد حسن",
    amount: 180,
  },
  {
    id: "ORD-003",
    customer: "سارة أحمد",
    service: "غسيل خارجي",
    date: "2025-02-09",
    status: "pending",
    worker: "غير محدد",
    amount: 120,
  },
  {
    id: "ORD-004",
    customer: "محمد عبدالله",
    service: "باقة VIP",
    date: "2025-02-09",
    status: "completed",
    worker: "علي محمود",
    amount: 450,
  },
  {
    id: "ORD-005",
    customer: "فاطمة حسن",
    service: "غسيل كامل",
    date: "2025-02-09",
    status: "cancelled",
    worker: "-",
    amount: 250,
  },
  {
    id: "ORD-006",
    customer: "عمر خالد",
    service: "تلميع خارجي",
    date: "2025-02-08",
    status: "completed",
    worker: "محمد علي",
    amount: 150,
  },
  {
    id: "ORD-007",
    customer: "نور الدين",
    service: "غسيل كامل",
    date: "2025-02-08",
    status: "in_progress",
    worker: "أحمد حسن",
    amount: 250,
  },
  {
    id: "ORD-008",
    customer: "ليلى أحمد",
    service: "تلميع داخلي",
    date: "2025-02-08",
    status: "pending",
    worker: "غير محدد",
    amount: 180,
  },
];

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  completed: { label: "مكتمل", variant: "default" },
  in_progress: { label: "قيد التنفيذ", variant: "secondary" },
  pending: { label: "قيد الانتظار", variant: "outline" },
  cancelled: { label: "ملغي", variant: "destructive" },
};

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
  in_progress: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
  pending: "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
};

export function OrdersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
          <Input
            placeholder="البحث في الطلبات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 text-right border-[#e5e5e5]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#6b7280]" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] border-[#e5e5e5]">
              <SelectValue placeholder="جميع الحالات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="completed">مكتمل</SelectItem>
              <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
              <SelectItem value="pending">قيد الانتظار</SelectItem>
              <SelectItem value="cancelled">ملغي</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg border-[#e5e5e5]">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f5f5f5] hover:bg-[#f5f5f5]">
              <TableHead className="text-right font-semibold text-[#1a1a1a]">رقم الطلب</TableHead>
              <TableHead className="text-right font-semibold text-[#1a1a1a]">العميل</TableHead>
              <TableHead className="text-right font-semibold text-[#1a1a1a]">الخدمة</TableHead>
              <TableHead className="text-right font-semibold text-[#1a1a1a]">التاريخ</TableHead>
              <TableHead className="text-right font-semibold text-[#1a1a1a]">الحالة</TableHead>
              <TableHead className="text-right font-semibold text-[#1a1a1a]">العامل</TableHead>
              <TableHead className="text-right font-semibold text-[#1a1a1a]">المبلغ</TableHead>
              <TableHead className="text-right font-semibold text-[#1a1a1a]">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-[#6b7280]">
                  لا توجد طلبات مطابقة للبحث
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-[#faf8f5]">
                  <TableCell className="font-medium text-[#1a1a1a]">
                    {order.id}
                  </TableCell>
                  <TableCell className="text-[#1a1a1a]">{order.customer}</TableCell>
                  <TableCell className="text-[#6b7280]">{order.service}</TableCell>
                  <TableCell className="text-[#6b7280]">{order.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColors[order.status]}
                    >
                      {statusMap[order.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#6b7280]">{order.worker}</TableCell>
                  <TableCell className="font-medium text-[#d4a574]">
                    {order.amount} ج.م
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="w-4 h-4" />
                          عرض التفاصيل
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="w-4 h-4" />
                          تعديل
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600">
                          <Trash2 className="w-4 h-4" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6b7280]">
          عرض {filteredOrders.length} من {orders.length} طلب
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[#e5e5e5]"
            disabled
          >
            السابق
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[#e5e5e5]"
            disabled
          >
            التالي
          </Button>
        </div>
      </div>
    </div>
  );
}
