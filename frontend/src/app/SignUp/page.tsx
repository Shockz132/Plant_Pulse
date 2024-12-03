"use client";

import { SignUp } from '@/components/Authentication/SignUp';
import { Navbar } from '@/components/LandingPage/Navbar';
import { Footer } from '@/components/LandingPage/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AccountSignUp() {
  return (
    <>
      <Navbar />
      <SignUp />
      <Footer />
    </>
  )
}