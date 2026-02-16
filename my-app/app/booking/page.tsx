"use client";

import { useEffect, useState } from "react";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function BookingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/auth/login?redirect=/booking');
    } else {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E3F2FD]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1976D2]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <BookingWizard />;
}
