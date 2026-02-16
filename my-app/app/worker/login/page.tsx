"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function WorkerLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if user is a worker
        const { data: workerData } = await supabase
          .from("workers")
          .select("*")
          .eq("user_id", data.user.id)
          .single();

        if (workerData) {
          toast.success("تم تسجيل الدخول بنجاح!");
          window.location.href = "/worker";
        } else {
          toast.error("هذا الحساب ليس لديه صلاحيات عامل");
          await supabase.auth.signOut();
        }
      }
    } catch (error: any) {
      toast.error("خطأ في تسجيل الدخول: " + error.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <Card className="border-[#e5e5e5] shadow-lg">
          <CardHeader className="space-y-4 text-center pb-6">
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-12 bg-[#d4a574] rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-[#1a1a1a]">
                لمعة
              </CardTitle>
              <p className="text-sm text-[#6b7280]">بوابة العاملين</p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1a1a1a] text-sm">
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pr-10 text-right border-[#e5e5e5] focus:border-[#d4a574] focus:ring-[#d4a574]/20 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#1a1a1a] text-sm">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pr-10 pl-10 text-right border-[#e5e5e5] focus:border-[#d4a574] focus:ring-[#d4a574]/20 h-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1a1a1a] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white h-12 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>

              <div className="text-center pt-2 space-y-2">
                <Link
                  href="/"
                  className="text-sm text-[#6b7280] hover:text-[#d4a574] transition-colors block"
                >
                  العودة إلى الموقع
                </Link>
                <p className="text-xs text-gray-400">
                  للتجربة: أنشئ عامل من لوحة التحكم أولاً
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
