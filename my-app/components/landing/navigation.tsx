"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, User, LayoutDashboard, LogOut } from "lucide-react";
import { scrollToElement } from "@/lib/utils/index";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { RushLogo } from "./rush-logo";

const navLinks = [
  { label: "خدماتنا", href: "services" },
  { label: "الباقات", href: "packages" },
  { label: "ازاي نشتغل", href: "how-it-works" },
  { label: "آراء العملاء", href: "testimonials" },
  { label: "الأسئلة", href: "faq" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Check initial auth state with retry
    checkUserWithRetry();
    
    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // User just signed in - fetch their data
        fetchUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        // User signed out
        setUser(null);
        setLoading(false);
      }
    });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const checkUserWithRetry = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        await fetchUserData(authUser.id);
        return;
      }
      
      // Wait a bit before retrying
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // No user found after retries
    setUser(null);
    setLoading(false);
  };

  const fetchUserData = async (userId: string) => {
    try {
      const { data: userData, error } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", userId)
        .maybeSingle();
      
      if (error) {
        setUser(null);
      } else if (userData) {
        setUser(userData);
      } else {
        // User exists in auth but not in public.users table
        setUser({ full_name: null });
      }
    } catch (err) {
      setUser(null);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("تم تسجيل الخروج");
    window.location.href = "/";
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <RushLogo size="md" />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToElement(link.href)}
                  className={`text-sm font-medium transition-colors hover:text-[#1976D2] ${
                    isScrolled ? "text-[#1E3A5F]" : "text-[#1E3A5F]"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA Buttons / User Menu */}
            <div className="hidden md:flex items-center gap-3">
              {!loading && (
                <>
                  {user ? (
                    // User is logged in - show avatar and menu
                    <div className="flex items-center gap-3">
                      <Link href="/dashboard">
                        <Button
                          variant="outline"
                          className="border-[#1976D2] text-[#1976D2] hover:bg-[#1976D2] hover:text-white rounded-full px-4"
                        >
                          <LayoutDashboard className="w-4 h-4 ml-2" />
                          طلباتي
                        </Button>
                      </Link>
                      <Link href="/profile">
                        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                          <Avatar className="w-10 h-10 border-2 border-[#1976D2]">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback className="bg-[#1976D2] text-white">
                              {user.full_name?.charAt(0) || "م"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium hidden lg:block">
                            {user.full_name || "حسابي"}
                          </span>
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="text-gray-500 hover:text-red-500"
                        title="تسجيل الخروج"
                      >
                        <LogOut className="w-5 h-5" />
                      </Button>
                    </div>
                  ) : (
                    // User is not logged in - show login button
                    <>
                      <Link href="/auth/login">
                        <Button
                          variant="outline"
                          className="border-[#1976D2] text-[#1976D2] hover:bg-[#1976D2] hover:text-white rounded-full px-4"
                        >
                          <User className="w-4 h-4 ml-2" />
                          تسجيل الدخول
                        </Button>
                      </Link>
                      <Button
                        className="bg-[#1976D2] hover:bg-[#1565C0] text-white rounded-full px-6"
                        onClick={() => window.location.href = "/booking"}
                      >
                        احجز الآن
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#1a1a1a]" />
              ) : (
                <Menu className="w-6 h-6 text-[#1a1a1a]" />
              )}
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white pt-20 md:hidden"
          >
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => {
                      scrollToElement(link.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-lg font-medium text-[#1a1a1a] py-3 border-b border-[#e5e5e5] text-right"
                  >
                    {link.label}
                  </button>
                ))}
                {user ? (
                  // Mobile menu for logged in user
                  <>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-2">
                      <Avatar className="w-12 h-12 border-2 border-[#d4a574]">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback className="bg-[#d4a574] text-white">
                          {user.full_name?.charAt(0) || "م"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold">{user.full_name || "حسابي"}</p>
                        <p className="text-sm text-gray-500">متصل</p>
                      </div>
                    </div>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full mt-2 border-[#1a1a1a] text-[#1a1a1a] py-6"
                      >
                        <LayoutDashboard className="w-5 h-5 ml-2" />
                        طلباتي
                      </Button>
                    </Link>
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full mt-2 border-[#1a1a1a] text-[#1a1a1a] py-6"
                      >
                        <User className="w-5 h-5 ml-2" />
                        الملف الشخصي
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full mt-2 border-red-300 text-red-600 py-6"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-5 h-5 ml-2" />
                      تسجيل الخروج
                    </Button>
                  </>
                ) : (
                  // Mobile menu for guest
                  <>
                    <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full mt-4 border-[#1a1a1a] text-[#1a1a1a] py-6"
                      >
                        <User className="w-5 h-5 ml-2" />
                        تسجيل الدخول
                      </Button>
                    </Link>
                  </>
                )}
                <Button
                  className="mt-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-full py-6"
                  onClick={() => {
                    window.location.href = "/booking";
                    setIsMobileMenuOpen(false);
                  }}
                >
                  احجز الآن
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
