"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SustainabilityIcon, CollaborationIcon, ScalabilityIcon } from "@/components/Icons";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <SustainabilityIcon />,
    title: "Sustainable Practices",
    description:
      "Our community gardens are committed to sustainable practices, ensuring that the garden's resources are used responsibly and that the environment is protected.",
  },
  {
    icon: <CollaborationIcon />,
    title: "Collaborative Environment",
    description:
      "Our community gardens are a platform for collaboration, allowing members to work together on projects, share resources, and support one another.",
  },
  {
    icon: <ScalabilityIcon />,
    title: "Scalability & Flexibility",
    description:
      "Our community gardens are designed to be flexible and adaptable, allowing for the growth and expansion of the garden and the community.",
  },
];

export const HowItWorks = () => {
  return (
    <section
      id="howItWorks"
      className="container text-center py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold ">
        How Our Community Garden{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Thrives{" "}
        </span>
        Through Collaboration
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Our community garden is a vibrant, inclusive space where members can learn, grow, and share their passions. Discover how our unique approach fosters collaboration, sustainability, and a sense of community.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="bg-muted/50"
          >
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};