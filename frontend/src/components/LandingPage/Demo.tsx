/* eslint-disable react/no-unescaped-entities */
"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";

export const DemoDashboard = () => {
  return (
    <section
      id="cta"
      className="bg-muted/50 py-16 my-24 sm:my-32"
    >
      <div className="container">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold ">
            Your
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              {" "}
              Plant's Health{" "}
            </span>
            In One Interface
          </h2>
          <p className="text-muted-foreground text-xl mt-4 mb-8 lg:mb-0">
            Our dashboard offers a comprehensive view of your plant's health, always keeping you in the know of how your plant is doing.
          </p>
        </div>

        <div className="space-y-4 md:w-[20%] h-full flex flex-col mt-8">
          <Button className="md:mr-4 md:w-auto">
            <Link
            href="PlotStatus/Demo/Demo/Dashboard"
            >
              View Demo
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
