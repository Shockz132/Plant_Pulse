"use client"

import React from 'react';
import { Navbar } from "@/components/LandingPage/Navbar";
import { PlotStatus } from "@/components/PlotStatus/PlotStatus";
import { Footer } from "@/components/LandingPage/Footer";
import { ScrollToTop } from "@/components/LandingPage/ScrollToTop";

export default function Dashboard() {
  return (
    <React.Fragment>
      <Navbar />
      <PlotStatus />
      <Footer />
      <ScrollToTop />
    </React.Fragment>
  )
}