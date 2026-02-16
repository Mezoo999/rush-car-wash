"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, DollarSign, Users, Clock } from "lucide-react";

const stats = [
  {
    title: "طلبات اليوم",
    value: "24",
    change: "+12%",
    changeType: "positive" as const,
    icon: ShoppingCart,
    color: "#d4a574",
  },
  {
    title: "الإيرادات",
    value: "12,450 ج.م",
    change: "+8%",
    changeType: "positive" as const,
    icon: DollarSign,
    color: "#22c55e",
  },
  {
    title: "العمال النشطون",
    value: "18",
    change: "+2",
    changeType: "positive" as const,
    icon: Users,
    color: "#3b82f6",
  },
  {
    title: "طلبات قيد الانتظار",
    value: "7",
    change: "-3",
    changeType: "negative" as const,
    icon: Clock,
    color: "#f59e0b",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function StatsCards() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="border-[#e5e5e5] hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[#6b7280] text-sm font-medium">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold text-[#1a1a1a] mt-2">
                      {stat.value}
                    </h3>
                    <div className="flex items-center gap-1 mt-2">
                      <span
                        className={`text-xs font-medium ${
                          stat.changeType === "positive"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-[#9ca3af] text-xs">عن الأسبوع الماضي</span>
                    </div>
                  </div>
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
