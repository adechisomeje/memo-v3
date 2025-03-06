"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Navbar from "./customers/components/navbar";
import { Footer } from "../components/Footer/footer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import WhyAndWhatSection from "./customers/components/why-and-what-section";
import ProcessSimplified from "./customers/components/process";
import TrustedCompanies from "./customers/components/trusted-companies";
import { useRouter } from "next/navigation";
import StatsSection from "./customers/components/memo-stats";
import { SearchForm } from "./customers/components/location-filter";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

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
        <div className="relative lg:min-h-[800px] min-h-[450px] flex items-center justify-center max-[1023px]:mt-[84.57px] max-[769px]:mt-0">
          <Image
            src="/assets/images/landing-bg.png"
            alt="Background celebration image"
            fill
            className="object-cover brightness-50"
            priority
          />

          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold max-w-[700px] mx-auto lg:leading-[60px]">
              Celebrate <span className="text-[#f5e6d3]">Moments</span> with
              Cakes, Flowers, & More.
            </h1>
            <p className="md:text-xl mt-2 max-w-2xl mx-auto">
              We make every celebration, from birthdays to anniversaries, easy
              and memorable. Send joy to your loved ones, no matter where they
              are
            </p>

            <SearchForm
              onSubmit={handleGetStarted}
              className="mt-10 hidden md:block"
              variant="default"
              isFetching={false}
            />

            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="lg" className="mt-10" loading={false}>
                    Get Started
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="sm:max-w-md">
                  <SearchForm
                    variant="sheet"
                    onSubmit={handleGetStarted}
                    className="h-full flex flex-col"
                    isFetching={false}
                  />
                </SheetContent>
              </Sheet>
            </div>
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
