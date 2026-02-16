"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Lock, Mail, Eye, EyeOff, Loader2, User, Phone, Car } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    agreeTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isLoading) return;
    
    setIsLoading(true);

    try {
      // Add delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
          }
        }
      });

      if (authError) {
        if (authError.status === 429) {
          throw new Error("عدد كبير من المحاولات. يرجى الانتظار دقيقة والمحاولة مرة أخرى.");
        }
        throw authError;
      }

      if (authData.user) {
        // 2. Create user profile using raw SQL via supabase rpc or direct insert with type assertion
        const { error: profileError } = await (supabase as any)
          .from('users')
          .insert({
            id: authData.user.id,
            full_name: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            role: 'customer',
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          toast.warning("تم إنشاء الحساب لكن حدث خطأ في إنشاء الملف الشخصي. يرجى تسجيل الدخول.");
        }

        // Check if we got a session (email confirmation disabled) or not
        if (authData.session) {
          // Email confirmation is disabled - user is already logged in!
          toast.success(`أهلاً بيك يا ${formData.fullName}! 🎉`, {
            description: "تم إنشاء حسابك بنجاح، نورت رشة! 🚗✨",
            duration: 4000,
          });
          setTimeout(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect') || '/';
            window.location.href = redirect;
          }, 1500);
        } else {
          // Email confirmation is enabled - need to handle this case
          toast.success("تم إنشاء الحساب بنجاح!");
          
          // Try to auto-login anyway (in case email confirmation was just disabled)
          try {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: formData.email,
              password: formData.password,
            });

            if (signInError) {
              // Email confirmation required - show helpful message
              toast.info("تم إرسال رابط التفعيل إلى بريدك الإلكتروني. يرجى تفعيل حسابك أولاً.", {
                duration: 5000,
              });
              setTimeout(() => {
                window.location.href = "/auth/login";
              }, 3000);
            } else if (signInData.session) {
              // Successfully logged in!
              toast.success(`أهلاً بيك يا ${formData.fullName}! 🎉`, {
                description: "تم إنشاء حسابك وتسجيل الدخول بنجاح، نورت رشة! 🚗✨",
                duration: 4000,
              });
              setTimeout(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect') || '/';
                window.location.href = redirect;
              }, 1500);
            }
          } catch (loginErr) {
            toast.info("تم إنشاء الحساب. يرجى تسجيل الدخول بعد تفعيل البريد الإلكتروني.");
            setTimeout(() => {
              window.location.href = "/auth/login";
            }, 2000);
          }
        }
      }
    } catch (error: any) {
      // Better error messages
      let errorMessage = error.message;
      if (error.status === 429) {
        errorMessage = "عدد كبير من المحاولات. يرجى الانتظار دقيقة والمحاولة مرة أخرى.";
      } else if (error.message?.includes("User already registered")) {
        errorMessage = "هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول.";
      } else if (error.message?.includes("rate limit")) {
        errorMessage = "تم تجاوز الحد المسموح. يرجى الانتظار قليلاً.";
      }
      
      toast.error("خطأ: " + errorMessage);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#1976D2]/10 to-[#E3F2FD] flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#FFA726]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-[#1976D2]/10 rounded-full blur-3xl" />
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
              <div className="w-20 h-20 bg-gradient-to-br from-[#1976D2] to-[#FFA726] rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <div>
              <CardTitle className="text-3xl font-bold text-[#1E3A5F]">
                إنشاء حساب جديد
              </CardTitle>
              <p className="text-[#1976D2]/70 mt-2">
                سجل دلوقتي واطلب رشة في ثواني
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 1 ? "bg-[#FFA726] text-white" : "bg-[#E3F2FD] text-[#1976D2]"
              }`}>
                1
              </div>
              <div className="w-16 h-1 bg-[#E3F2FD] rounded-full">
                <div className={`h-full bg-[#FFA726] rounded-full transition-all ${
                  step >= 2 ? "w-full" : "w-0"
                }`} />
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 2 ? "bg-[#FFA726] text-white" : "bg-[#E3F2FD] text-[#1976D2]"
              }`}>
                2
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 1 ? (
                // Step 1: Personal Info
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-[#1E3A5F]">الاسم الكامل</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1976D2]" />
                      <Input
                        id="fullName"
                        placeholder="محمد أحمد"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="pr-10 text-right h-12 border-[#64B5F6] focus:border-[#1976D2] focus:ring-[#1976D2]/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#1E3A5F]">رقم الهاتف</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1976D2]" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="01xxxxxxxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pr-10 text-right h-12 border-[#64B5F6] focus:border-[#1976D2] focus:ring-[#1976D2]/20"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="w-full bg-[#1976D2] hover:bg-[#1E3A5F] text-white h-12"
                    onClick={() => setStep(2)}
                    disabled={!formData.fullName || !formData.phone}
                  >
                    التالي
                  </Button>
                </motion.div>
              ) : (
                // Step 2: Account Info
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#1E3A5F]">البريد الإلكتروني</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#1E3A5F]">كلمة المرور</Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1976D2]" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pr-10 pl-10 text-right h-12 border-[#64B5F6] focus:border-[#1976D2] focus:ring-[#1976D2]/20"
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1976D2] hover:text-[#1E3A5F]"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-[#1976D2]">
                      يجب أن تكون 6 أحرف على الأقل
                    </p>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, agreeTerms: checked as boolean })
                      }
                      className="mt-1 border-[#1976D2] text-[#1976D2]"
                    />
                    <Label htmlFor="terms" className="text-sm text-[#1976D2] leading-5 cursor-pointer">
                      أوافق على{" "}
                      <Link href="#" className="text-[#FFA726] hover:underline">
                        شروط الاستخدام
                      </Link>{" "}
                      و{" "}
                      <Link href="#" className="text-[#FFA726] hover:underline">
                        سياسة الخصوصية
                      </Link>
                    </Label>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-12 border-[#1976D2] text-[#1976D2]"
                      onClick={() => setStep(1)}
                    >
                      رجوع
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-[#FFA726] hover:bg-[#FF9800] text-[#1E3A5F] h-12 font-semibold"
                      disabled={isLoading || !formData.agreeTerms}
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "إنشاء الحساب"
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-[#1976D2]">
                عندك حساب بالفعل؟{" "}
                <Link 
                  href="/auth/login"
                  className="text-[#FFA726] hover:text-[#FF9800] font-semibold transition-colors"
                >
                  سجل دخولك
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
