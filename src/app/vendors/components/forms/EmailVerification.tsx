"use client";

import * as Popover from "@radix-ui/react-popover";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "./forms.css";

interface EmailVerificationProps {
  onClose: () => void;
  popoverOpen: boolean;
  setPopoverOpen: (open: boolean) => void;
  width?: string; // Custom width control
  background?: string; // Custom background control
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  onClose,
  popoverOpen,
  setPopoverOpen,
  width = "w-1/2", // Default width
  background = "bg-white", // Default background
}) => {
  return (
    <Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
      {popoverOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-40 animate-fade-in" />
      )}

      <Popover.Trigger asChild>
        <Button variant="outline" className="hidden">
          Verify Email
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className={` ${width} py-[49px] flex flex-col justify-center items-center px-[78px] z-50 rounded-lg shadow-lg ${background}`}
        >
          <div className="flex flex-col gap-[2px] text-center">
            <h6 className="text-[28px] leading-[42px] font-bold text-[#232324]">
              Email Verification
            </h6>
            <p className="text-lg font-normal text-neutral-30">
              Please enter the 4- digit code sent to your mail
            </p>
          </div>
          <div className="*:h-[73px] *:!min-w-[73px] *:!w-[73px] mt-[31px] flex items-center justify-between w-full">
            <Input type="text" placeholder="" className="h-full" />
            <Input type="text" placeholder="" className="h-full" />
            <Input type="text" placeholder="" className="h-full" />
            <Input type="text" placeholder="" className="h-full" />
          </div>
          <div className="mt-[48px] mb-[48px] flex flex-col gap-[6px] text-center">
            <p className="text-[#232324] text-base font-normal">
              Didn’t receive the code yet?
            </p>
            <button className="bg-transparent text-base !leading-[20px] font-bold text-[#1B2221]">
              Resend Code
            </button>
          </div>
          <Button
            onClick={() => {
              setPopoverOpen(false);
              onClose();
            }}
            className="hover:bg-[#DE3633] mt-[10px] mx-auto"
            size="lg"
          >
            Continue
          </Button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default EmailVerification;
