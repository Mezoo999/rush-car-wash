"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Car, Play, CheckCircle } from "lucide-react";

interface StatusUpdaterProps {
  currentStatus: "pending" | "on_the_way" | "started" | "completed";
  onStatusChange: (newStatus: "pending" | "on_the_way" | "started" | "completed") => void;
}

const statusFlow: Array<{
  value: "on_the_way" | "started" | "completed";
  label: string;
  icon: typeof Car;
  color: string;
  activeColor: string;
}> = [
  {
    value: "on_the_way",
    label: "في الطريق",
    icon: Car,
    color: "bg-blue-100 text-blue-600 border-blue-200",
    activeColor: "bg-blue-600 text-white border-blue-600",
  },
  {
    value: "started",
    label: "بدأت",
    icon: Play,
    color: "bg-amber-100 text-amber-600 border-amber-200",
    activeColor: "bg-amber-600 text-white border-amber-600",
  },
  {
    value: "completed",
    label: "اكتملت",
    icon: CheckCircle,
    color: "bg-green-100 text-green-600 border-green-200",
    activeColor: "bg-green-600 text-white border-green-600",
  },
];

export function StatusUpdater({
  currentStatus,
  onStatusChange,
}: StatusUpdaterProps) {
  const getCurrentIndex = () => {
    const index = statusFlow.findIndex((s) => s.value === currentStatus);
    return index === -1 ? -1 : index;
  };

  const currentIndex = getCurrentIndex();

  const handleStatusClick = (
    newStatus: "on_the_way" | "started" | "completed"
  ) => {
    onStatusChange(newStatus);
  };

  return (
    <div className="border-t border-[#e5e5e5] pt-3">
      <div className="flex items-center gap-2">
        {statusFlow.map((status, index) => {
          const Icon = status.icon;
          const isActive = index <= currentIndex;
          const isClickable = index === 0 || index === currentIndex + 1;
          const isNextAvailable = index === currentIndex + 1;

          return (
            <motion.div
              key={status.value}
              className="flex-1"
              whileTap={isClickable ? { scale: 0.98 } : {}}
            >
              <Button
                variant="outline"
                size="sm"
                disabled={!isClickable}
                onClick={() => handleStatusClick(status.value)}
                className={`w-full h-10 text-xs font-semibold border transition-all ${
                  isActive
                    ? status.activeColor
                    : isNextAvailable
                    ? `${status.color} hover:opacity-80`
                    : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                }`}
              >
                <Icon className="w-3.5 h-3.5 ml-1" />
                {status.label}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-1 mt-3 px-1">
        {statusFlow.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors ${
              index <= currentIndex ? "bg-[#d4a574]" : "bg-[#e5e5e5]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
