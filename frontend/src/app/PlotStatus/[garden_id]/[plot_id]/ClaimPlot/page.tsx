"use client"

import React from 'react';
import { Navbar } from "@/components/LandingPage/Navbar";
import { ClaimPlotForm } from "@/components/PlotStatus/ClaimPlot";
import { Footer } from "@/components/LandingPage/Footer";
import { ScrollToTop } from "@/components/LandingPage/ScrollToTop";

export default function Dashboard() {
  return (
    <React.Fragment>
      <Navbar />
      <ClaimPlotForm />
      <Footer />
      <ScrollToTop />
    </React.Fragment>
  )
}