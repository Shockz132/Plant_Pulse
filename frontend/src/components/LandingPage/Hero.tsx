"use client";

import React, { Suspense } from 'react'
import { Button } from "@/components/ui/button";
import Link from 'next/link';

import Spline from '@splinetool/react-spline/next';


export const Hero = () => {
  return (
    <section className="container flex h-[65vh] place-items-center p-8 lg:py-16">
      <div className="text-center flex-1 flex flex-col justify-center h-full lg:text-start space-y-6">
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#0f853e]  to-[#58f9a3] text-transparent bg-clip-text">
              Transforming
            </span>{" "}
            Your Garden With
          </h1>{" "}
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#07c35c] via-[#27ce06] to-[#069e15] text-transparent bg-clip-text">
              IoT
            </span>
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Automate your gardening experience with our innovative IoT solutions. Monitor and control your garden anywhere.
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button className="w-full md:w-1/3">
            <Link
              rel="noreferrer noopener"
              href={"/PlotStatus"}
            >
              Get Started
            </Link>
          </Button>
        </div>
      </div>

      {/* Spline 3D interactive model */}
      <div className="z-10 flex-1 h-full">
        <Suspense fallback={<div>Loading...</div>}>
          <Spline scene="https://prod.spline.design/HEjsV5eXzaMHEEVr/scene.splinecode" suppressHydrationWarning/>
        </Suspense>
      </div>
    </section>
  );
};
