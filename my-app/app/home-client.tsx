"use client";

import { useState } from "react";
import { SplashScreen } from "@/components/auth/splash-screen";
import { Navigation } from "@/components/landing/navigation";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Services } from "@/components/landing/services";
import { TransformationSection } from "@/components/landing/transformation-section";
import { ServiceAreasSection } from "@/components/landing/service-areas";
import { Packages } from "@/components/landing/packages";
import { WhyLam3a } from "@/components/landing/why-lam3a";
import { Offers } from "@/components/landing/offers";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function HomeWithSplash() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <SplashScreen onComplete={() => setShowSplash(false)} />
      {!showSplash && (
        <main className="min-h-screen">
          <Navigation />
          <Hero />
          <HowItWorks />
          <Services />
          <TransformationSection />
          <ServiceAreasSection />
          <Packages />
          <WhyLam3a />
          <Offers />
          <Testimonials />
          <FAQ />
          <Footer />
        </main>
      )}
    </>
  );
}
