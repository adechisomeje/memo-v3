"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hamburger } from "../../../../public/assets/icons/hamburger";
import { useMediaQuery } from "usehooks-ts";
import { Dancing_Script } from "next/font/google";
import { NavbarHoverCard } from "@/app/customers/components/nav-hover-card";
import { MobileNav } from "@/app/customers/components/mobile-nav";
import VendorSignUp from "./vendor-sign-up-sheet";
import { TNavItem } from "@/types/nav-types";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

type Props = {
  mobileNavItems: TNavItem[];
  navItems: TNavItem[];
  ctaLink: string;
  classNames?: Record<string, string>;
};

const Navbar = ({ navItems, ctaLink, mobileNavItems, classNames }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 1023px)");

  if (pathname === "/vendors/select-country") {
    return null;
  } else
    return (
      <nav className=" py-6 px-8 border-b border-gray-200">
        <div className=" flex  items-center justify-between">
          <div className="text-3xl">
            <Link className={dancingScript.className} href="/">
              MEMO
            </Link>
          </div>
          <div className="hidden gap-[85px] lg:flex">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => {
                if (item.subItems) {
                  return (
                    <NavbarHoverCard
                      items={item.subItems}
                      key={item.href}
                      title={item.label}
                      className={cn(
                        pathname === item.href
                          ? ""
                          : "text-[#370E06] hover:text-primary",
                        classNames?.navItem
                      )}
                    />
                  );
                }
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "text-[#370E06] font-medium hover:text-primary",
                        pathname === item.href ? "font-bold" : "",
                        classNames?.navItem
                        // isScrolled ? 'text-gray-400' : ''
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-row gap-4">
              <VendorSignUp />

              <Link href={ctaLink}>
                <Button className="hover:bg-[#DE3633]" size="lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          <button className="lg:hidden" onClick={() => setIsOpen(true)}>
            <Hamburger />
          </button>
          {isMobile && (
            <MobileNav
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              mobileNavItems={mobileNavItems}
            />
          )}
        </div>
      </nav>
    );
};

export default Navbar;
