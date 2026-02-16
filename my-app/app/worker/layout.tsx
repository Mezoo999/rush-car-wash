"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Calendar, MapPin, LogOut, User } from "lucide-react";

interface WorkerLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/worker", label: "مهام اليوم", icon: Calendar },
];

export default function WorkerLayout({ children }: WorkerLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <header className="sticky top-0 z-50 bg-white border-b border-[#e5e5e5] shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/worker" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#d4a574] rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#1a1a1a]">لمعة</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-sm text-[#6b7280]">
              <User className="w-4 h-4" />
              <span>أحمد</span>
            </div>
          </div>
        </div>
      </header>

      <main className="pb-20">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e5e5] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-6 py-2 transition-colors ${
                  isActive
                    ? "text-[#d4a574]"
                    : "text-[#6b7280] hover:text-[#1a1a1a]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
          <Link
            href="/worker/login"
            className="flex flex-col items-center gap-1 px-6 py-2 text-[#6b7280] hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs font-medium">خروج</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
