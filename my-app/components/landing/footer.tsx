"use client";

import { motion } from "framer-motion";
import { RushLogo } from "./rush-logo";
import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0D2137] text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <RushLogo size="lg" />
            </div>
            <p className="text-[#64B5F6] mb-6 leading-relaxed">
              أقوى خدمة غسيل متنقل في مصر. نيجي لحد عندك ونخلص الشغل وأنت مرتاح 🚗✨
            </p>
            <div className="flex gap-3">
              {[
                { icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z", label: "Facebook" },
                { icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z", label: "Instagram" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-[#1976D2]/20 rounded-full flex items-center justify-center hover:bg-[#FFA726] transition-colors"
                  aria-label={social.label}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-[#FFA726]">روابط سريعة</h4>
            <ul className="space-y-3">
              {[
                { label: "اختار رشة", href: "#services" },
                { label: "باقات الدلع", href: "#packages" },
                { label: "ازاي تطلب", href: "#how-it-works" },
                { label: "اطلب رشة", href: "/booking" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[#64B5F6] hover:text-[#FFA726] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-[#FFA726]">أنواع الرشة</h4>
            <ul className="space-y-3">
              {[
                "⚡ رشة سريعة",
                "✨ رشة فلة",
                "💧 رشة عميقة",
                "👑 رشة VIP",
              ].map((service) => (
                <li key={service} className="text-[#64B5F6]">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-[#FFA726]">تواصل معانا</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#FFA726]" />
                <a href="tel:+201031564146" className="text-[#64B5F6] hover:text-white" dir="ltr">
                  01031564146
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#FFA726]" />
                <span className="text-[#64B5F6]">9 ص - 9 م</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#FFA726] flex-shrink-0 mt-0.5" />
                <span className="text-[#64B5F6] text-sm">
                  الشيخ زايد و6 أكتوبر، الجيزة
                </span>
              </li>
              <li>
                <motion.a
                  href="https://wa.me/201031564146"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-4 py-2 rounded-full font-bold text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  راسلنا على واتساب
                </motion.a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#64B5F6] text-sm">
              © {currentYear} رشة Rush. جميع الحقوق محفوظة. Made with 💧 in Egypt
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-[#64B5F6] hover:text-[#FFA726] transition-colors">
                سياسة الخصوصية
              </a>
              <a href="#" className="text-[#64B5F6] hover:text-[#FFA726] transition-colors">
                الشروط
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
