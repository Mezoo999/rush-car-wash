"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          toast.error("يرجى تسجيل الدخول أولاً");
          router.push("/admin/login");
          return;
        }

        // Check if user has admin role
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        // @ts-expect-error - Supabase SSR types issue
        if (userError || !userData || userData.role !== "admin") {
          toast.error("ليس لديك صلاحيات الإدارة");
          await supabase.auth.signOut();
          router.push("/admin/login");
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        toast.error("حدث خطأ في التحقق من الصلاحيات");
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#d4a574]" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
