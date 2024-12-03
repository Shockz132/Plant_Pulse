import type { Metadata } from "next";
import "@/styles/App.css";

export const metadata: Metadata = {
  title: "PlantPulse",
  description: "CSPD Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}