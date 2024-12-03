"use client";

import React from 'react';
import TaskBoard from '@/components/Taskboard/taskboard';
import { Navbar } from '@/components/LandingPage/Navbar';
import { Footer } from '@/components/LandingPage/Footer';

export default function Taskboard() {
  return (
    <>
      <Navbar />
      <TaskBoard />
      <Footer />
    </>
  );
}
