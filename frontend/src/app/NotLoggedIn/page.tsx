"use client"

import React from 'react';
import { Navbar } from "@/components/LandingPage/Navbar";
import NotLoggedIn from "@/components/NotLoggedIn/NotLoggedIn";
import { Footer } from "@/components/LandingPage/Footer";

export default function Dashboard() {
  return (
    <React.Fragment>
      <Navbar />
      <NotLoggedIn />
      <Footer />
    </React.Fragment>
  )
}