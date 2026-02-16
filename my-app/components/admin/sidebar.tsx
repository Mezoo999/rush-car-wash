"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Briefcase,
  Package,
  UserCircle,
  Percent,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    label: "نظرة عامة",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "الطلبات",
    href: "/admin/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    label: "العملاء",
    href: "/admin/dashboard/customers",
    icon: Users,
  },
  {
    label: "الخدمات",
    href: "/admin/dashboard/services",
    icon: Briefcase,
  },
  {
    label: "الباقات",
    href: "/admin/dashboard/packages",
    icon: Package,
  },
  {
    label: "العمال",
    href: "/admin/dashboard/workers",
    icon: UserCircle,
  },
  {
    label: "العروض",
    href: "/admin/dashboard/offers",
    icon: Percent,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className="fixed right-0 top-0 h-full w-64 bg-[#1a1a1a] text-white z-50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#d4a574]" />
          <span className="text-xl font-bold">لمعة</span>
        </Link>
        <p className="text-[#9ca3af] text-xs mt-1">لوحة التحكم</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-[#d4a574] text-[#1a1a1a] font-medium"
                      : "text-[#9ca3af] hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="mr-auto w-1.5 h-1.5 bg-[#1a1a1a] rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/admin/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9ca3af] hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </Link>
      </div>
    </aside>
  );
}
