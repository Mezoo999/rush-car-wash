"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { UserRole } from "@/types";

export default function AdminLoginPage() {
  const router = useRouter();
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
      // Step 1: Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        throw new Error("بيانات الدخول غير صحيحة");
      }

      if (!authData.user) {
        throw new Error("فشل في تسجيل الدخول");
      }

      // Step 2: Check if user has admin role
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (userError || !userData) {
        // Sign out if not found in users table
        await supabase.auth.signOut();
        throw new Error("المستخدم غير موجود");
      }

      // @ts-expect-error - Supabase SSR types issue
      if (userData.role !== "admin") {
        // Sign out if not admin
        await supabase.auth.signOut();
        throw new Error("ليس لديك صلاحيات الإدارة");
      }

      // Success - redirect to admin dashboard
      toast.success("تم تسجيل الدخول بنجاح");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ في تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-[#e5e5e5] shadow-lg">
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-[#d4a574]" />
              <span className="text-3xl font-bold text-[#1a1a1a]">لمعة</span>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-[#1a1a1a]">
                تسجيل الدخول للإدارة
              </CardTitle>
              <CardDescription className="text-[#6b7280]">
                أدخل بيانات الاعتماد الخاصة بك للوصول إلى لوحة التحكم
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1a1a1a]">
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@lam3a.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pr-10 text-right border-[#e5e5e5] focus:border-[#d4a574] focus:ring-[#d4a574]/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#1a1a1a]">
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
                    className="pr-10 pl-10 text-right border-[#e5e5e5] focus:border-[#d4a574] focus:ring-[#d4a574]/20"
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
                className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/"
                  className="text-sm text-[#6b7280] hover:text-[#d4a574] transition-colors"
                >
                  العودة إلى الموقع
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
