"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusUpdater } from "./status-updater";
import {
  Phone,
  Car,
  MapPin,
  Clock,
  User,
  Navigation,
} from "lucide-react";

interface Job {
  id: string;
  customerName: string;
  customerPhone: string;
  carBrand: string;
  carModel: string;
  carColor: string;
  plateNumber: string;
  serviceName: string;
  address: string;
  googleMapsLink: string;
  scheduledTime: string;
  status: "pending" | "on_the_way" | "started" | "completed";
}

interface JobCardProps {
  job: Job;
  onStatusChange: (jobId: string, newStatus: Job["status"]) => void;
}

const statusConfig = {
  pending: {
    label: "قيد الانتظار",
    bgColor: "bg-gray-100",
    textColor: "text-gray-600",
  },
  on_the_way: {
    label: "في الطريق",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
  },
  started: {
    label: "بدأت",
    bgColor: "bg-amber-100",
    textColor: "text-amber-600",
  },
  completed: {
    label: "اكتملت",
    bgColor: "bg-green-100",
    textColor: "text-green-600",
  },
};

export function JobCard({ job, onStatusChange }: JobCardProps) {
  const status = statusConfig[job.status];
  const isCompleted = job.status === "completed";

  const handleCall = () => {
    window.location.href = `tel:${job.customerPhone}`;
  };

  const handleOpenMaps = () => {
    window.open(job.googleMapsLink, "_blank");
  };

  return (
    <Card
      className={`border-[#e5e5e5] shadow-sm overflow-hidden ${
        isCompleted ? "opacity-75" : ""
      }`}
    >
      <CardContent className="p-4">
        {/* Header: Customer Name & Status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#d4a574]/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-[#d4a574]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1a1a1a]">
                {job.customerName}
              </h3>
              <button
                onClick={handleCall}
                className="flex items-center gap-1 text-sm text-[#d4a574] hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                {job.customerPhone}
              </button>
            </div>
          </div>
          <Badge
            className={`${status.bgColor} ${status.textColor} border-0 font-medium`}
          >
            {status.label}
          </Badge>
        </div>

        {/* Service Info */}
        <div className="bg-[#f5f5f5] rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <Car className="w-4 h-4 text-[#6b7280]" />
            <span className="text-[#1a1a1a]">
              {job.carBrand} {job.carModel}
            </span>
            <span className="text-[#9ca3af]">•</span>
            <span className="text-[#6b7280]">{job.carColor}</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1.5">
            <span className="text-[#6b7280] text-xs bg-white px-2 py-0.5 rounded">
              {job.plateNumber}
            </span>
          </div>
        </div>

        {/* Service Type & Time */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#d4a574]" />
            <span className="text-sm font-medium text-[#1a1a1a]">
              {job.scheduledTime}
            </span>
          </div>
          <span className="text-sm text-[#1a1a1a] font-medium">
            {job.serviceName}
          </span>
        </div>

        {/* Address with Map Link */}
        <div className="flex items-start gap-2 mb-4">
          <MapPin className="w-4 h-4 text-[#6b7280] mt-0.5 flex-shrink-0" />
          <p className="text-sm text-[#6b7280] flex-1 leading-relaxed">
            {job.address}
          </p>
          <button
            onClick={handleOpenMaps}
            className="flex items-center gap-1 text-xs bg-[#1a1a1a] text-white px-2.5 py-1.5 rounded-md hover:bg-[#2a2a2a] transition-colors flex-shrink-0"
          >
            <Navigation className="w-3 h-3" />
            الموقع
          </button>
        </div>

        {/* Status Updater */}
        {!isCompleted && (
          <StatusUpdater
            currentStatus={job.status}
            onStatusChange={(newStatus) => onStatusChange(job.id, newStatus)}
          />
        )}
      </CardContent>
    </Card>
  );
}
