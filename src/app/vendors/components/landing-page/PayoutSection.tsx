import React from "react";
import banner from "@/../../public/assets/images/vendor-payout-section-banner.png";
import Image from "next/image";
import { Icons } from "@/components/icons/Icon";

const PayoutSection = () => {
  return (
    <div className="w-screen relative">
      <section className="w-[90%] mx-auto max-w-[1159px] pt-[109px] flex flex-col gap-[59px]">
        <div className="flex flex-col gap-2">
          <h6 className="text-[40px] leading-[54.56px] font-bold text-accent-primary">
            Simple, easy payouts
          </h6>
          <p className="text-neutral-30 font-semibold text-xl !leading-[30px]">
            Simple, easy payouts
          </p>
        </div>
        <div className="flex justify-between gap-[47px]">
          <div className="w-[45%] flex-shrink-0 h-[562px] bg-accent-99 rounded-2xl">
            <Image
              src={banner}
              alt="/"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col gap-6 mt-[46px] w-[55%]">
            <div className="flex flex-col gap-2">
              <h6 className="text-[40px] leading-[54.56px] font-bold text-accent-primary">
                Fast, reliable payouts to keep your business running
              </h6>
              <p className="text-neutral-30 font-semibold text-xl !leading-[30px]">
                Reach more customers. Simplify your sales. Maximize your
                profits.
              </p>
            </div>
            <div className="flex flex-col gap-[29px]">
              <div className="flex items-center gap-[9.91px]">
                <span className="w-[19.81px] h-[19.81px] rounded-full bg-accent-90 flex items-center justify-center">
                  <Icons.AccentTick />
                </span>
                <p className="text-[14.87px] leading-[20.29px] text-[#848199] font-medium">
                  Timely Payments
                </p>
              </div>
              <div className="flex items-center gap-[9.91px]">
                <span className="w-[19.81px] h-[19.81px] rounded-full bg-accent-90 flex items-center justify-center">
                  <Icons.AccentTick />
                </span>
                <p className="text-[14.87px] leading-[20.29px] text-[#848199] font-medium">
                  Detailed Payment Insight
                </p>
              </div>
              <div className="flex items-center gap-[9.91px]">
                <span className="w-[19.81px] h-[19.81px] rounded-full bg-accent-90 flex items-center justify-center">
                  <Icons.AccentTick />
                </span>
                <p className="text-[14.87px] leading-[20.29px] text-[#848199] font-medium">
                  Zero Hidden Fees
                </p>
              </div>
              <div className="flex items-center gap-[9.91px]">
                <span className="w-[19.81px] h-[19.81px] rounded-full bg-accent-90 flex items-center justify-center">
                  <Icons.AccentTick />
                </span>
                <p className="text-[14.87px] leading-[20.29px] text-[#848199] font-medium">
                  Flexible Payout Options
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="absolute right-0 bottom-[-10%] z-[10000px]">
        <Icons.SecEllipseRight />
      </div>
    </div>
  );
};

export default PayoutSection;
