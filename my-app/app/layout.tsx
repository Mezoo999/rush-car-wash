import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ErrorBoundary } from "@/components/error-boundary";
import { GrainOverlay } from "@/components/ui-enhancements/grain-overlay";
import { PageTransition } from "@/components/ui-enhancements/page-transitions";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "رشة | خدمة غسيل سيارات متنقلة - 6 أكتوبر والشيخ زايد",
  description: "خدمة غسيل سيارات متنقلة في مدينة 6 أكتوبر والشيخ زايد. رشة ليك عند باب بيتك ونخلص الشغل في دقائق. احجز دلوقتي واستمتع بنظافة سريعة!",
  keywords: "غسيل سيارات, غسيل متنقل, 6 أكتوبر, الشيخ زايد, تنظيف سيارات, رشة, عناية بالسيارات",
  openGraph: {
    title: "رشة | خدمة غسيل سيارات متنقلة",
    description: "خدمة غسيل سيارات متنقلة في 6 أكتوبر والشيخ زايد. رشة ليك عند باب بيتك!",
    type: "website",
    locale: "ar_EG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} ${tajawal.variable} antialiased`}
        style={{ fontFamily: "var(--font-cairo), sans-serif" }}
      >
        <ErrorBoundary>
          <GrainOverlay />
          <PageTransition>
            {children}
          </PageTransition>
        </ErrorBoundary>
        <Toaster position="top-center" richColors />
        <WhatsAppButton />
      </body>
    </html>
  );
}
