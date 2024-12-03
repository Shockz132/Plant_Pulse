"use client";

import { Login } from '@/components/Authentication/Login'
import { Navbar } from '@/components/LandingPage/Navbar'
import { Footer } from '@/components/LandingPage/Footer'

export default function AccountLogin() {
  return (
    <>
      <Navbar />
      <Login />
      <Footer />
    </>
  )
}