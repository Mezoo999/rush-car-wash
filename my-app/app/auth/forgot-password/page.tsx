"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Mail, Loader2, CheckCircle, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("تم إرسال رابط إعادة تعيين كلمة المرور!");
    } catch (error: any) {
      toast.error("خطأ: " + error.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#1976D2]/10 to-[#E3F2FD] flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1976D2]/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
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
                {isSuccess ? (
                  <CheckCircle className="w-10 h-10 text-green-500" />
                ) : (
                  <Lock className="w-10 h-10 text-[#FFA726]" />
                )}
              </div>
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold text-[#1E3A5F]">
                {isSuccess ? "تم الإرسال!" : "نسيت كلمة المرور؟"}
              </CardTitle>
              <CardDescription className="text-[#1976D2]/70 mt-2">
                {isSuccess 
                  ? "تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور"
                  : "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين"
                }
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#1E3A5F]">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1976D2]" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pr-10 text-right h-12 border-[#64B5F6] focus:border-[#1976D2] focus:ring-[#1976D2]/20"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#1976D2] hover:bg-[#1E3A5F] text-white h-12 text-base font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "إرسال رابط إعادة التعيين"
                    )}
                  </Button>

                  {/* Back to Login */}
                  <div className="text-center">
                    <Link 
                      href="/auth/login"
                      className="inline-flex items-center text-sm text-[#1976D2] hover:text-[#1E3A5F] transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 ml-1" />
                      العودة لتسجيل الدخول
                    </Link>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 text-center"
                >
                  <div className="bg-[#FFA726]/10 p-4 rounded-lg">
                    <p className="text-[#1E3A5F] text-sm">
                      تم إرسال رابط إعادة تعيين كلمة المرور إلى:
                    </p>
                    <p className="text-[#1976D2] font-semibold mt-1" dir="ltr">
                      {email}
                    </p>
                  </div>

                  <div className="text-sm text-[#1976D2] space-y-2">
                    <p>لم تستلم البريد؟</p>
                    <ul className="text-xs text-[#1976D2]/70 space-y-1">
                      <li>• تحقق من مجلد البريد المزعج (Spam)</li>
                      <li>• تأكد من صحة عنوان البريد الإلكتروني</li>
                      <li>• انتظر بضع دقائق ثم حاول مرة أخرى</li>
                    </ul>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full h-12 border-[#1976D2] text-[#1976D2]"
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail("");
                    }}
                  >
                    إرسال مرة أخرى
                  </Button>

                  <Link 
                    href="/auth/login"
                    className="block text-[#FFA726] hover:text-[#FF9800] font-semibold transition-colors"
                  >
                    العودة لتسجيل الدخول
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Back to Home */}
            <div className="mt-6 text-center">
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
