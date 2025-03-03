"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { NavbarHoverCard } from "./nav-hover-card";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hamburger } from "../../../../public/assets/icons/hamburger";
import { useMediaQuery } from "usehooks-ts";
import { Dancing_Script } from "next/font/google";
import { signOut, useSession } from "next-auth/react";
import { User } from "../../../../public/assets/icons/User";
import { motion, AnimatePresence } from "framer-motion";
import useFormErrorStore from "@/store/customer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ListOrderedIcon,
  LogOut,
  MessageSquareCodeIcon,
  User2,
} from "lucide-react";
import { TNavItem } from "@/types/nav-types";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileMenu from "./menu-sheet";

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

const authenticatedNavItems = [
  {
    label: "My Profile",
    href: "/customers/dashboard/profile",
    subItems: [
      { label: "Create Shipment", href: "/ship" },
      { label: "Get a quote", href: "/get-a-quote" },
      { label: "Track", href: "/track" },
    ],
  },
  {
    label: "My Orders",
    href: "/customers/dashboard/orders",
  },
  {
    label: "Messages",
    href: "/customers/dashboard/messages",
  },
];

const Navbar = ({ navItems, classNames }: Props) => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 1023px)");

  const { isEmptyForm, errorMessage, resetFormError } = useFormErrorStore();
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isEmptyForm) {
      timer = setTimeout(() => {
        resetFormError();
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isEmptyForm, resetFormError]);

  useEffect(() => {
    if (session?.user) {
      setFirstName(session.user.firstName || "");
    }
  }, [session]);

  return (
    <>
      <AnimatePresence>
        {isEmptyForm && (
          <motion.div
            className="fixed top-0 left-0 w-full bg-[#C1121F] text-white h-[60px] z-10 flex items-center justify-center shadow-md"
            initial={{ y: -60 }}
            animate={{ y: 90 }}
            exit={{ y: -60 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <p className="text-center font-medium px-4">⚠⚠⚠ {errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <nav
        className={cn(
          "relative py-6 px-8 top-0 left-0 right-0 w-full z-50 transition-all duration-300 ease-in-out bg-white shadow-md",
          "border-b border-gray-200"
        )}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-3xl">
            <Link className={dancingScript.className} href="/">
              MEMO
            </Link>
          </div>
          <div className="hidden gap-[85px] lg:flex">
            <ul className="flex items-center gap-8">
              {(status === "authenticated"
                ? authenticatedNavItems
                : navItems
              ).map((item) => {
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
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-row gap-6">
              <div className="flex">
                <div className="m-2">
                  <User />
                </div>

                <div className="flex flex-col ">
                  <p>Hello,</p>
                  {status === "authenticated" ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <div className="font-bold flex justify-center items-center gap-1">
                          <p className="font-bold hover:text-primary">
                            {firstName || "User"}
                          </p>
                          <ChevronDown size={20} />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuSeparator />
                        <Link href="/customers/dashboard/profile">
                          <DropdownMenuItem>
                            <User2 />
                            My Profile
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <Link href="/customers/dashboard/orders">
                          <DropdownMenuItem>
                            <ListOrderedIcon />
                            My Orders
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <Link href="/customers/dashboard/messages">
                          <DropdownMenuItem>
                            <MessageSquareCodeIcon />
                            Messages
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <Button
                          onClick={async () => {
                            setLoading(true);
                            const data = await signOut({
                              redirect: false,
                              callbackUrl: "/",
                            });
                            setLoading(false);
                            console.log(loading);

                            if (data.url) {
                              router.push(data.url);
                            }
                          }}
                        >
                          <DropdownMenuItem className="">
                            <LogOut />
                            Log Out
                          </DropdownMenuItem>
                        </Button>
                        <DropdownMenuSeparator />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link href="/sign-in">SIGN IN</Link>
                  )}
                </div>
              </div>
              {status !== "authenticated" && (
                <Link href="/vendors">
                  <Button size="lg">Become A Vendor</Button>
                </Link>
              )}
            </div>
          </div>

          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Hamburger />
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs p-0">
                <MobileMenu navItems={navItems} />
              </SheetContent>
            </Sheet>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
