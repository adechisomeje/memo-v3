"use client";

import { Icons } from "@/components/icons/Icon";
import React, { useState, useRef, useEffect } from "react";
import banner from "@/../../public/assets/images/toke-gift.png";
import Image from "next/image";
interface ButtonRefs {
  [key: string]: HTMLButtonElement | null;
}

const PartnerSection = () => {
  const [activeTab, setActiveTab] = useState("sell");
  const [sliderStyle, setSliderStyle] = useState({ left: "0px", width: "0px" });
  const buttonRefs = useRef<ButtonRefs>({});

  const updateSliderPosition = (id: string) => {
    const activeButton = buttonRefs.current[id];
    if (activeButton) {
      setSliderStyle({
        left: `${activeButton.offsetLeft}px`,
        width: `${activeButton.clientWidth}px`,
      });
    }
  };

  useEffect(() => {
    updateSliderPosition(activeTab);
    const handleResize = () => updateSliderPosition(activeTab);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  const tabs = [
    {
      id: "sell",
      label: "Sell",
      cardColor: "bg-[#FDF0D5]",
      iconBg: "bg-SEC-80",
      icon: <Icons.Expand />,
      title: "Expand Your Reach",
      description:
        "Showcase your products to a larger audience, your products will appear in searches based on location, category, and preferences, making it easier for buyers to find you",
    },
    {
      id: "operate",
      label: "Operate",
      cardColor: "bg-accent-99",
      iconBg: "bg-accent-95",
      icon: <Icons.Streamline />,
      title: "Streamline Operations",
      description:
        "Manage orders, deliveries, and inventory in one place. Easily upload, edit, and organize your product listings.",
    },
    {
      id: "thrive",
      label: "Thrive",
      cardColor: "bg-accent-99",
      iconBg: "bg-accent-95",
      icon: <Icons.Earnings />,
      title: "Boost Your Earnings",
      description:
        "Increase sales with access to more buyers Create a reputation for reliability and quality that drives repeat business.",
    },
  ];

  return (
    <>
      <div className="w-screen relative">
        <section className="w-[90%] mx-auto max-w-[1159px] pb-[120px] pt-[120px]  flex flex-col gap-12">
          <div className="flex flex-col gap-8 w-full justify-center items-center">
            <h6 className="text-[40px] leading-[54.56px] font-bold text-accent-primary">
              Why partner with MEMO{" "}
            </h6>
            <div className="h-[65px] bg-accent-95 w-[80%] rounded-[8px] px-6 flex items-center justify-between relative">
              <div
                className="absolute h-[44px] bg-accent-30 rounded-[22px] transition-all duration-300 ease-in-out"
                style={sliderStyle}
              />

              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  ref={(el: HTMLButtonElement | null) => {
                    buttonRefs.current[tab.id] = el;
                  }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative w-[111px] h-[44px] rounded-[22px] px-2 text-lg !leading-[24.55px] font-normal transition-colors duration-300 ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-[rgba(0,0,0,0.5)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-6 *:w-1/3">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`card flex flex-col h-[419px] items-center rounded-[8.55px] gap-[37px] px-[26px] pt-[39px] transition-colors duration-300 ${
                  activeTab === tab.id ? "bg-[#FDF0D5]" : "bg-accent-99"
                }`}
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              >
                <span
                  className={`w-[100px] h-[100px] rounded-[25px] flex items-center justify-center transition-colors duration-300 ${
                    activeTab === tab.id ? "bg-SEC-80" : "bg-accent-95"
                  }`}
                >
                  {tab.icon}
                </span>
                <div className="flex flex-col gap-4">
                  <p className="text-[20px] leading-[27.28px] font-bold text-accent-10">
                    {tab.title}
                  </p>
                  <p className="text-base font-medium text-SEC-10">
                    {tab.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div
          className="absolute left-[-2%] bottom-[-7%]"
          style={{ transform: "rotate(275deg)" }}
        >
          <Icons.SecEllipseLeft />
        </div>
      </div>
      <div className="w-screen py-8 px-[10%] flex items-center justify-between gap-[87px] bg-accent-95">
        <Image src={banner} className="w-[45%] flex-shrink-0" alt="/" />
        <div className="flex flex-col gap-[82px] leading-[42px] text-black font-medium justify-between">
          <p className="text-[28px]">
            &quot;Memo has truly made a difference! Since partnering with them,
            we&apos;ve experienced higher sales and greater visibility for Toke
            Gifts. The journey has been remarkable so far.&quot;
          </p>
          <p className="text-[24px]">— Toke Gifts, Lagos&quot; </p>
        </div>
      </div>
    </>
  );
};

export default PartnerSection;
