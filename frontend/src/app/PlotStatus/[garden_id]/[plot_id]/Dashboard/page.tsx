"use client"

import React from 'react';
import { Navbar } from "@/components/LandingPage/Navbar";
import { GridLayout } from "@/components/Dashboard/GridLayout";
import { Footer } from "@/components/LandingPage/Footer";
import { ScrollToTop } from "@/components/LandingPage/ScrollToTop";

export default function Dashboard() {
  return (
    <React.Fragment>
      <Navbar />
      <GridLayout />
      <Footer />
      <ScrollToTop />
    </React.Fragment>
  )
}