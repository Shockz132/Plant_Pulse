"use client"

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import JethroPFP from "@/assets/team-images/jethro-pfp.png";
import HongXuPFP from "@/assets/team-images/hong_xu_team_pfp.jpg";
import FuLiangPFP from "@/assets/team-images/fu_liang_team_pfp.jpg";
import PuiWanPFP from "@/assets/team-images/pui_wan_team_pfp.jpg";
import NicholasPFP from "@/assets/team-images/nicholas_pfp.png";
import { StaticImageData } from "next/image";
import Image from "next/image";

interface TeamProps {
  imageUrl: StaticImageData | string;
  name: string;
  position: string;
  socialNetworks: SociaNetworkslProps[];
  description: string;
}

interface SociaNetworkslProps {
  name: string;
  url: string;
}

const teamList: TeamProps[] = [
  {
    imageUrl: JethroPFP,
    name: "Jethro",
    position: "Team Leader | Full Stack Developer",
    socialNetworks: [
      { name: "Linkedin", url: "http://linkedin.com" },
      {
        name: "Facebook",
        url: "https://www.facebook.com/",
      },
      {
        name: "Instagram",
        url: "https://www.instagram.com/",
      },
    ],
    description: "",
  },
  {
    imageUrl: HongXuPFP,
    name: "Hong Xu",
    position: "Frontend Developer",
    socialNetworks: [
      { name: "Linkedin", url: "http://linkedin.com" },
      {
        name: "Facebook",
        url: "https://www.facebook.com/",
      },
      {
        name: "Instagram",
        url: "https://www.instagram.com/",
      },
    ],
    description: "",
  },
  {
    imageUrl: FuLiangPFP,
    name: "Fu Liang",
    position: "Frontend Developer",
    socialNetworks: [
      { name: "Linkedin", url: "http://linkedin.com" },

      {
        name: "Instagram",
        url: "https://www.instagram.com/",
      },
    ],
    description: "",
  },
  {
    imageUrl: PuiWanPFP,
    name: "Pui Wan",
    position: "Database Designer",
    socialNetworks: [
      { name: "Linkedin", url: "http://linkedin.com" },
      {
        name: "Facebook",
        url: "https://www.facebook.com/",
      },
    ],
    description: "",
  },
  {
    imageUrl: NicholasPFP,
    name: "Nicholas",
    position: "Report Writer",
    socialNetworks: [
      { name: "Linkedin", url: "http://linkedin.com" },
      {
        name: "Facebook",
        url: "https://www.facebook.com/",
      },
    ],
    description: "",
  },
];

export const Team = () => {
  const socialIcon = (iconName: string) => {
    switch (iconName) {
      case "Linkedin":
        return <Linkedin size="20" />;

      case "Facebook":
        return <Facebook size="20" />;

      case "Instagram":
        return <Instagram size="20" />;
    }
  };

  return (
    <section
      id="team"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold">
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Our Dedicated{" "}
        </span>
        Team
      </h2>

      <p className="mt-4 mb-10 text-xl text-muted-foreground">
        Our passionate team is dedicated to delivering innovative, high-quality solutions that positively impact our clients and the world.
      </p>

      <div className="grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-10">
        {teamList.map(
          ({ imageUrl, name, position, socialNetworks, description }: TeamProps) => (
            <Card
              key={name}
              className="bg-muted/50 relative mt-8 flex flex-col justify-center items-center"
            >
              <CardHeader className="mt-8 flex justify-center items-center pb-2">
                <Image
                  src={imageUrl}
                  alt={`${name} ${position}`}
                  className="absolute -top-12 rounded-full w-24 h-24 aspect-square object-cover"
                />
                <CardTitle className="text-center">{name}</CardTitle>
                <CardDescription className="text-primary">
                  {position}
                </CardDescription>
              </CardHeader>

              <CardContent className="text-center pb-2">
                <p>{description}</p>
              </CardContent>

              <CardFooter>
                {socialNetworks.map(({ name, url }: SociaNetworkslProps) => (
                  <div key={name}>
                    <a
                      rel="noreferrer noopener"
                      href={url}
                      target="_blank"
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                      })}
                    >
                      <span className="sr-only">{name} icon</span>
                      {socialIcon(name)}
                    </a>
                  </div>
                ))}
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
