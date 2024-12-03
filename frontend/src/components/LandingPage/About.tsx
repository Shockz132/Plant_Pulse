import Image from "next/image";
import { Statistics } from "@/components/LandingPage/Statistics";
import CompanyLogo from "@/assets/plantpulse_logo_stacked.png"

export const About = () => {
  return (
    <section
      id="about"
      className="container py-24 sm:py-32"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse justify-center lg:flex-row gap-8 lg:gap-12 items-center">
          <Image
            src={CompanyLogo}
            alt="plant pulse stacked logo"
            className=" min-w-[300px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                PlantPulse
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
              At PlantPulse, we specialize in IoT-powered community gardens, bridging technology with sustainable urban agriculture. 
              Our innovative solutions integrate sensor technology and smart irrigation systems, enabling users to monitor and manage their gardens remotely.
              Committed to environmental stewardship, we aim to empower individuals and communities to cultivate green spaces that thrive in urban settings. 
              Join us in revolutionizing urban gardening with smarter, greener solutions at PlantPulse.
              </p>
            </div>
            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
