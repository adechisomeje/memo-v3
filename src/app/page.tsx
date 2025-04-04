"use client";

import Image from "next/image";
import Navbar from "./customers/components/navbar";
import { Footer } from "../components/Footer/footer";
import WhyAndWhatSection from "./customers/components/why-and-what-section";
import ProcessSimplified from "./customers/components/process";
import TrustedCompanies from "./customers/components/trusted-companies";
import { useRouter } from "next/navigation";
import StatsSection from "./customers/components/memo-stats";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { BlurSearchForm } from "./customers/components/blur-search-form";
const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About us",
    href: "/about",
  },
  {
    label: "Contact us",
    href: "/contact",
  },
  {
    label: "Blogs",
    href: "/blogs",
  },
];

const mobileNavItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About us",
    href: "/resources",
    subItems: [
      { label: "Create Shipment", href: "/ship" },
      { label: "Get a quote", href: "/get-a-quote" },
      { label: "Track", href: "/track" },
    ],
  },
  {
    label: "Contact us",
    href: "/job-riders",
    subItems: [
      { label: "Riders", href: "/riders" },
      { label: "Rider scout", href: "/job-riders" },
    ],
  },
  {
    label: "Blog",
    href: "/sign-in",
    subItems: [
      { label: "Blog", href: "/blog" },
      { label: "User Case", href: "/user-case" },
    ],
  },
];

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleGetStarted = async () => {
    router.push("/customers/results");
  };

  console.log("Session in profile:", {
    status,
    accessToken: session?.accessToken,
    user: session?.user,
  });

  useEffect(() => {
    router.prefetch("/customers/results");
  }, []);

  return (
    <div className="overflow-x-hidden">
      <Navbar
        navItems={navItems}
        mobileNavItems={mobileNavItems}
        ctaLink="/get-started"
      />
      <main>
        <div className="relative lg:min-h-[800px] lg:h-[800px] min-h-[450px] flex items-center justify-center max-[1026px]:mt-[84.57px] max-[769px]:mt-0 max-[1026px]:py-16">
          <Image
            src="/assets/images/landing-bg.png"
            alt="Background celebration image"
            fill
            className="object-cover"
            priority
          />
          <div className="flex w-[92.5%] mx-auto min-[1026px]:items-center gap-[133px] min-h-full max-[1026px]:flex-col max-[1026px]:*:w-full max-[1026px]:gap-8">
            <div className="relative z-10 container min-[1026px]:mx-auto  text-white w-full">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold max-w-[700px] mx-auto lg:leading-[60px]">
                Celebrate <span className="text-[#f5e6d3]">Moments</span> with
                Cakes, Flowers, & More.
              </h1>
              <p className="md:text-xl mt-2 max-w-2xl mx-auto">
                We make every celebration, from birthdays to anniversaries, easy
                and memorable. Send joy to your loved ones, no matter where they
                are
              </p>

              {/* <SearchForm
              onSubmit={handleGetStarted}
              className="mt-10 hidden md:block"
              variant="default"
              isFetching={false}
            />

          */}
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.75)]"></div>
            <BlurSearchForm onSubmit={handleGetStarted} isFetching={false} />
          </div>
        </div>

        <WhyAndWhatSection />
        <ProcessSimplified />
        <TrustedCompanies />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
}
