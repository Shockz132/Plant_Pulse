"use client"

import React from 'react';
import { About } from "@/components/LandingPage/About";
import { DemoDashboard } from "@/components/LandingPage/Demo";
import { FAQ } from "@/components/LandingPage/FAQ";
import { Features } from "@/components/LandingPage/Features";
import { Footer } from "@/components/LandingPage/Footer";
import { Hero } from "@/components/LandingPage/Hero";
import { HowItWorks } from "@/components/LandingPage/HowItWorks";
import { Navbar } from "@/components/LandingPage/Navbar";
import { Newsletter } from "@/components/LandingPage/Newsletter";
import { ScrollToTop } from "@/components/LandingPage/ScrollToTop";
import { Sponsors } from "@/components/LandingPage/Sponsors";
import { Team } from "@/components/LandingPage/Team";

export default function LandingPage() {
  return (
    <React.Fragment>
      <Navbar />
      <Hero />
      <Sponsors />
      <About />
      <HowItWorks />
      <Features />
      <DemoDashboard />
      <Team />
      <Newsletter />
      <FAQ />
      <Footer />
      <ScrollToTop />
    </React.Fragment>
  )
}