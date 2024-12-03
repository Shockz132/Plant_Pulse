"use client";

import { TaskForm } from '@/components/Taskboard/TaskCreatePage';
import { Navbar } from '@/components/LandingPage/Navbar';
import { Footer } from '@/components/LandingPage/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function TaskCreate() {
  return (
    <>
      <Navbar />
      <TaskForm />
      <Footer />
    </>
  )
}