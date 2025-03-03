"use client";

import { Button } from "@/components/ui/button";
import { Dancing_Script } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import banner from "@/../../public/assets/images/vendor-landing-hero.png";
import PayoutSection from "./components/landing-page/PayoutSection";
import PartnerSection from "./components/landing-page/PartnerSection";
import Tiers from "./components/landing-page/Tiers";
import Faqs from "./components/landing-page/Faqs";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const VendorsLandingScreen = () => {
  return (
    <main>
      <section
        style={{
          background:
            "linear-gradient(163.13deg, #F4EFE4 60.97%, rgba(255, 255, 255, 0) 90.14%)",
        }}
        className="px-[60px] pb-[50px] pt-[31px] flex items-center justify-between"
      >
        <div className="flex flex-col w-1/2">
          <h3 className=" text-accent-10 text-[64px] leading-[80px] font-extrabold">
            Grow your Business with{" "}
            <span className={` text-accent-primary ${dancingScript.className}`}>
              MEMO
            </span>
          </h3>
          <p className="mt-[13px] text-neutral-30">
            Reach more customers. Simplify your sales. Maximize your profits.
          </p>
          <Button
            className="hover:bg-[#DE3633] w-[292px] mt-[23px] h-[60px]"
            size="lg"
          >
            Get Started
          </Button>
          <div className="flex items-center gap-[21px] mt-[42px]">
            <span className=" w-[109px] flex flex-col text-2xl !leading-[32.74px] font-semibold text-accent-0 pr-[7px] border-r border-r-neutral-30">
              1.2K
              <p className="text-sm !leading-[19.1px] text-[#6B6B6F]">
                Active vendors
              </p>
            </span>
            <span className=" w-[109px] flex flex-col text-2xl !leading-[32.74px] font-semibold text-accent-0 pr-[7px] border-r border-r-neutral-30">
              700
              <p className="text-sm !leading-[19.1px] text-[#6B6B6F]">
                Deliveries
              </p>
            </span>
            <span className=" w-[109px] flex flex-col text-2xl !leading-[32.74px] font-semibold text-accent-0 ">
              900
              <p className="text-sm !leading-[19.1px] text-[#6B6B6F]">orders</p>
            </span>
          </div>
        </div>
        <div className="w-1/2">
          <Image
            src={banner}
            alt="landing page banner"
            className="w-full h-auto"
          />
        </div>
      </section>
      <PayoutSection />
      <PartnerSection />
      <Tiers />
      <Faqs />
    </main>
  );
};

export default VendorsLandingScreen;
