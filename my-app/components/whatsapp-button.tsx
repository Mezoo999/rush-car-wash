"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Phone } from "lucide-react";
import { createWhatsAppLink } from "@/lib/utils/validation";

const BUSINESS_WHATSAPP = "01031564146";

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappLink = createWhatsAppLink(
    BUSINESS_WHATSAPP, 
    "مرحباً لمعة، أريد الاستفسار عن خدمات الغسيل"
  );

  return (
    <>
      {/* Main Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors safe-area-bottom"
        style={{ boxShadow: "0 4px 20px rgba(37, 211, 102, 0.4)" }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-7 h-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Pulse Animation Ring */}
      {!isOpen && (
        <div className="fixed bottom-6 left-6 z-40 safe-area-bottom">
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-14 h-14 bg-green-500 rounded-full"
          />
        </div>
      )}

      {/* Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-6 z-50 bg-white rounded-2xl shadow-xl p-4 w-72"
          >
            <div className="text-center mb-4">
              <h4 className="font-bold text-[#1a1a1a]">تواصل معنا</h4>
              <p className="text-sm text-[#6b7280]">نرد على استفساراتك فوراً</p>
            </div>

            <div className="space-y-3">
              {/* WhatsApp Option */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-800">واتساب</p>
                    <p className="text-xs text-green-600">رد سريع</p>
                  </div>
                </motion.div>
              </a>

              {/* Phone Option */}
              <a href={`tel:+20${BUSINESS_WHATSAPP.slice(1)}`} onClick={() => setIsOpen(false)}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-3 bg-[#faf8f5] hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 bg-[#d4a574] rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#1a1a1a]">اتصال مباشر</p>
                    <p className="text-xs text-[#6b7280]" dir="ltr">{BUSINESS_WHATSAPP}</p>
                  </div>
                </motion.div>
              </a>
            </div>

            <p className="text-xs text-center text-[#6b7280] mt-4">
              مواعيد العمل: 9 ص - 9 م
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
