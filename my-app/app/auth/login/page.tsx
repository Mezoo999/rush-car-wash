"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Lock, Mail, Eye, EyeOff, Loader2, Phone } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleResendConfirmation = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
      });
      
      if (error) {
        toast.error("خطأ في إعادة إرسال التأكيد: " + error.message);
      } else {
        toast.success("تم إرسال رابط التأكيد إلى بريدك الإلكتروني!");
      }
    } catch (err) {
      toast.error("حدث خطأ أثناء إعادة الإرسال");
    }
    setIsResending(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isLoading) return;
    
    setIsLoading(true);

    try {
      // Add delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.status === 429) {
          throw new Error("عدد كبير من المحاولات. يرجى الانتظار دقيقة والمحاولة مرة أخرى.");
        }
        throw error;
      }

      if (data.user) {
        // Get user's name for personalized welcome
        const { data: userData } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', data.user.id)
          .single();
        
        // @ts-expect-error - Supabase SSR types issue
        const userName = userData?.full_name || 'عزيزي';
        
        // Show welcome message in Egyptian Arabic
        toast.success(`أهلاً بيك يا ${userName}! 👋`, {
          description: "نورت رشة، جاهزين نخدمك في أي وقت! 🚗✨",
          duration: 4000,
        });
        
        // Redirect to landing page with a small delay to ensure session is saved
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
    } catch (error: any) {
      // Better error messages
      let errorMessage = error.message;
      if (error.status === 429) {
        errorMessage = "عدد كبير من المحاولات. يرجى الانتظار دقيقة والمحاولة مرة أخرى.";
      } else if (error.message?.includes("Invalid login")) {
        errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "لم يتم تأكيد البريد الإلكتروني بعد.";
        setShowResendButton(true);
      }
      
      toast.error("خطأ في تسجيل الدخول: " + errorMessage);
    }

    setIsLoading(false);
  };

  const handlePhoneLogin = () => {
    // For now, show feature coming soon
    toast.info("تسجيل الدخول برقم الهاتف قريباً!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#1976D2]/10 to-[#E3F2FD] flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#1976D2]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-[#FFA726]/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-4 text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-[#1E3A5F] to-[#1976D2] rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-10 h-10 text-[#FFA726]" />
              </div>
            </motion.div>
            <div>
              <CardTitle className="text-3xl font-bold text-[#1E3A5F]">
                تسجيل الدخول
              </CardTitle>
              <p className="text-[#1976D2]/70 mt-2">
                سجل دخولك علشان تطلب رشة
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1E3A5F]">
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1976D2]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pr-10 text-right h-12 border-[#64B5F6] focus:border-[#1976D2] focus:ring-[#1976D2]/20"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#1E3A5F]">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1976D2]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pr-10 pl-10 text-right h-12 border-[#64B5F6] focus:border-[#1976D2] focus:ring-[#1976D2]/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1976D2] hover:text-[#1E3A5F] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, rememberMe: checked as boolean })
                    }
                  />
                  <Label htmlFor="remember" className="text-sm text-[#1976D2] cursor-pointer">
                    تذكرني
                  </Label>
                </div>
                <Link 
                  href="/auth/forgot-password"
                  className="text-sm text-[#FFA726] hover:text-[#FF9800] transition-colors"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#1976D2] hover:bg-[#1E3A5F] text-white h-12 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>

              {/* Resend Confirmation Button */}
              {showResendButton && (
                <div className="bg-[#FFA726]/10 border border-[#FFA726]/20 rounded-lg p-4 text-center">
                  <p className="text-[#1E3A5F] text-sm mb-2">
                    لم تستلم رابط التأكيد؟
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResendConfirmation}
                    disabled={isResending}
                    className="border-[#FFA726] text-[#1E3A5F] hover:bg-[#FFA726]/20"
                  >
                    {isResending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "إعادة إرسال رابط التأكيد"
                    )}
                  </Button>
                </div>
              )}

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#64B5F6]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#1976D2]">أو</span>
                </div>
              </div>

              {/* Phone Login */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-[#1976D2] text-[#1976D2] hover:bg-[#1976D2] hover:text-white"
                onClick={handlePhoneLogin}
              >
                <Phone className="w-5 h-5 ml-2" />
                تسجيل الدخول برقم الهاتف
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-[#1976D2]">
                مش عندك حساب؟{" "}
                <Link 
                  href="/auth/signup"
                  className="text-[#FFA726] hover:text-[#FF9800] font-semibold transition-colors"
                >
                  سجل دلوقتي
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-4 text-center">
              <Link 
                href="/"
                className="text-sm text-[#1976D2] hover:text-[#1E3A5F] transition-colors"
              >
                العودة للرئيسية
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
