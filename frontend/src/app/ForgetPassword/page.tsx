"use client";

import { ForgetPassword } from '@/components/Authentication/ForgetPassword';
import { Navbar } from '@/components/LandingPage/Navbar';
import { Footer } from '@/components/LandingPage/Footer';

export default function AccountForgetPassword() {
  return (
    <>
      <Navbar />
      <ForgetPassword />
      <Footer />
    </>
  )
}