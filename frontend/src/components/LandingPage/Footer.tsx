"use client"

import { Leaf } from "lucide-react";
import Link from "next/link";
import { Features } from "@/components/LandingPage/Features";

export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />

      <section className="container py-20 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
        <div className="col-span-full xl:col-span-2">
          <Link
            rel="noreferrer noopener"
            href="/"
            className="font-bold text-xl flex"
          >
            <Leaf />
            PlantPulse
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Follow US</h3>
          <div>
            <Link
              rel="noreferrer noopener"
              href={"http://www.facebook.com"}
              className="opacity-60 hover:opacity-100">
              Facebook
            </Link>
          </div>

          <div>
            <Link
              rel="noreferrer noopener"
              href={"http://www.twitter.com"}
              className="opacity-60 hover:opacity-100"
            >
              Twitter
            </Link>
          </div>

          <div>
            <Link
              rel="noreferrer noopener"
              href={"http://www.instagram.com"}
              className="opacity-60 hover:opacity-100"
            >
              Instagram
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Contact</h3>
          <div>
            <Link
              rel="noreferrer noopener"
              href={"http://www.gmail.com"}
              className="opacity-60 hover:opacity-100"
            >
              Gmail
            </Link>
          </div>

          <div>
            <Link
              rel="noreferrer noopener"
              href={"http://www.whatsapp.com"}
              className="opacity-60 hover:opacity-100"
            >
              WhatsApp
            </Link>
          </div>

          <div>
            <Link
              rel="noreferrer noopener"
              href={"http://www.wechat.com"}
              className="opacity-60 hover:opacity-100"
            >
              WeChat
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">About</h3>
          <div>
            <Link
              rel="noreferrer noopener"
              href="#features"
              className="opacity-60 hover:opacity-100"
            >
              Features
            </Link>
          </div>

          <div>
            <Link
              rel="noreferrer noopener"
              href="#team"
              className="opacity-60 hover:opacity-100"
            >
              Team
            </Link>
          </div>

          <div>
            <Link
              rel="noreferrer noopener"
              href="#faq"
              className="opacity-60 hover:opacity-100"
            >
              FAQ
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Community</h3>
          <div>
            <Link
              rel="noreferrer noopener"
              href={"http://www.youtube.com"}
              className="opacity-60 hover:opacity-100"
            >
              Youtube
            </Link>
          </div>

          <div>
            <Link
              rel="noreferrer noopener"
              href={"http://www.yahoo.com"}
              className="opacity-60 hover:opacity-100"
            >
              Yahoo
            </Link>
          </div>

          <div>
            <Link
              rel="noreferrer noopener"
              href={"http://www.google.com"}
              className="opacity-60 hover:opacity-100"
            >
              Google
            </Link>
          </div>
        </div>
      </section>

      <section className="container pb-14 text-center">
        <h3>
          &copy; PlantPulse{" "}
        </h3>
      </section>
    </footer>
  );
}