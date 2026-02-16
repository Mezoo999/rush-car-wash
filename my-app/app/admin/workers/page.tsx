"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, User, Phone, Mail, Trash2, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function WorkersManagementPage() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    employee_id: "",
    password: "",
  });

  // Fetch workers
  const fetchWorkers = async () => {
    const { data, error } = await supabase
      .from("workers")
      .select("*, user:users(*)")
      .order("created_at", { ascending: false });

    if (data) {
      setWorkers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  // Add new worker
  const handleAddWorker = async () => {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email || `${formData.employee_id}@lam3a.worker`,
        password: formData.password || "worker123456",
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Add to users table
        // @ts-expect-error - Supabase SSR types issue
        const { error: userError } = await supabase.from("users").insert({
          id: authData.user.id,
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email || `${formData.employee_id}@lam3a.worker`,
          role: "worker",
        });

        if (userError) throw userError;

        // 3. Add to workers table
        // @ts-expect-error - Supabase SSR types issue
        const { error: workerError } = await supabase.from("workers").insert({
          user_id: authData.user.id,
          employee_id: formData.employee_id,
          is_active: true,
          rating: 5.0,
          total_jobs: 0,
        });

        if (workerError) throw workerError;

        toast.success("تم إضافة العامل بنجاح!");
        setFormData({
          full_name: "",
          phone: "",
          email: "",
          employee_id: "",
          password: "",
        });
        setIsDialogOpen(false);
        fetchWorkers();
      }
    } catch (error: any) {
      toast.error("خطأ: " + error.message);
    }
  };

  // Toggle worker status
  const toggleWorkerStatus = async (workerId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("workers")
      // @ts-expect-error - Supabase SSR types issue
      .update({ is_active: !currentStatus })
      .eq("id", workerId);

    if (!error) {
      toast.success("تم تحديث حالة العامل");
      fetchWorkers();
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <header className="bg-[#1a1a1a] text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#d4a574] rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-[#1a1a1a]" />
            </div>
            <div>
              <h1 className="text-xl font-bold">إدارة العمال</h1>
              <p className="text-sm text-gray-400">إضافة وإدارة فريق العمل</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => window.location.href = "/admin/dashboard"}
            className="text-white border-white/30 hover:bg-white/10"
          >
            العودة للوحة التحكم
          </Button>
        </div>
      </header>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">إجمالي العمال</p>
                  <h3 className="text-2xl font-bold">{workers.length}</h3>
                </div>
                <div className="bg-blue-500 p-3 rounded-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">العمال النشطين</p>
                  <h3 className="text-2xl font-bold">
                    {workers.filter((w) => w.is_active).length}
                  </h3>
                </div>
                <div className="bg-green-500 p-3 rounded-lg">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">متوسط التقييم</p>
                  <h3 className="text-2xl font-bold">
                    {workers.length > 0
                      ? (workers.reduce((acc, w) => acc + w.rating, 0) / workers.length).toFixed(1)
                      : "0.0"}
                  </h3>
                </div>
                <div className="bg-yellow-500 p-3 rounded-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Worker Button */}
        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1a1a1a] hover:bg-[#2a2a2a]">
                <Plus className="w-4 h-4 mr-2" />
                إضافة عامل جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>إضافة عامل جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>الاسم الكامل</Label>
                  <Input
                    placeholder="مثال: محمد أحمد"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>رقم الهاتف</Label>
                  <Input
                    placeholder="01xxxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>البريد الإلكتروني (اختياري)</Label>
                  <Input
                    type="email"
                    placeholder="worker@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>رقم الموظف</Label>
                  <Input
                    placeholder="مثال: WR001"
                    value={formData.employee_id}
                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                  />
                </div>
                <div>
                  <Label>كلمة المرور</Label>
                  <Input
                    type="password"
                    placeholder="******"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    اتركه فارغاً لاستخدام "worker123456"
                  </p>
                </div>
                <Button
                  className="w-full bg-[#d4a574] hover:bg-[#c49464] text-[#1a1a1a]"
                  onClick={handleAddWorker}
                  disabled={!formData.full_name || !formData.phone || !formData.employee_id}
                >
                  إضافة العامل
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Workers List */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة العمال</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#d4a574]" />
              </div>
            ) : workers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا يوجد عمال حالياً. أضف عامل جديد!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-3 px-4">الاسم</th>
                      <th className="text-right py-3 px-4">رقم الموظف</th>
                      <th className="text-right py-3 px-4">الهاتف</th>
                      <th className="text-right py-3 px-4">التقييم</th>
                      <th className="text-right py-3 px-4">الحالة</th>
                      <th className="text-right py-3 px-4">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.map((worker) => (
                      <motion.tr
                        key={worker.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#d4a574]/20 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-[#d4a574]" />
                            </div>
                            <span className="font-medium">
                              {worker.user?.full_name || "غير معروف"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono">{worker.employee_id}</td>
                        <td className="py-3 px-4">{worker.user?.phone}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span>{worker.rating}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              worker.is_active
                                ? "bg-green-500 text-white"
                                : "bg-gray-400 text-white"
                            }
                          >
                            {worker.is_active ? "نشط" : "غير نشط"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleWorkerStatus(worker.id, worker.is_active)}
                          >
                            {worker.is_active ? "تعطيل" : "تفعيل"}
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
