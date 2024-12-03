"use client"

import { ReactElement } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface FeatureProps {
  title: string;
  description: string;
  icon: ReactElement;
}

import { AlertICon, DashboardIcon, UIIcon } from "../Icons";

const features: FeatureProps[] = [
  {
    title: "User Friendly UI",
    description:
      "Our intuitive interface ensures a seamless and enjoyable experience, making it easy for you to navigate and manage your gardens effectively.",
    icon: <UIIcon />,
  },
  {
    title: "Community Dashboard",
    description:
      "The community dashboard provides a comprehensive view of each plant's health and pest detection status, allowing users to monitor and collaborate on maintaining a healthy garden.",
    icon: <DashboardIcon />,
  },
  {
    title: "Alerts",
    description:
      "Stay informed with real-time alerts, including pest detection and plant health notifications, ensuring timely interventions to maintain a thriving garden.",
    icon: <AlertICon />,
  },
];

const featureList: string[] = [
  "User Friendly UI",
  "Data Visualisation",
  "Community Dashboard",
  "Pest Detection",
  "Alerts",
  "Auto Irrigation",
];

export const Features = () => {
  return (
    <section
      id="features"
      className="container py-24 sm:py-32 space-y-8"
    >
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Many{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Great Features
        </span>
      </h2>

      <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge
              variant="secondary"
              className="text-sm"
            >
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, icon }: FeatureProps) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}</CardContent>

            <CardFooter className="items-center lg:max-w-[75%] sm:max-w-[50%] max-w-[50%]">
              {icon}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
