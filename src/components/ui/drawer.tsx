"use client";

import * as Dialog from "@radix-ui/react-dialog";
import React from "react";

const VisuallyHidden = ({ children }: { children: React.ReactNode }) => {
  return (
    <span
      className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
      style={{
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
      }}
    >
      {children}
    </span>
  );
};

const Drawer = ({
  children,
  onClose,
  title = "Drawer",
  width = "sm:w-96",
}: {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
  width?: string;
}) => {
  const isDirectCSSValue =
    width.includes("px") ||
    width.includes("%") ||
    width.includes("rem") ||
    width.includes("em");

  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm bg-black/50 z-40 animate-fade-in" />
        <Dialog.Content
          className={`fixed top-0 right-0 bottom-0 w-full ${
            !isDirectCSSValue ? width : ""
          } bg-white shadow-lg z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out animate-slide-in`}
          style={{
            animationName: "slideIn",
            animationDuration: "300ms",
            animationTimingFunction: "ease-out",
            animationFillMode: "forwards",
            ...(isDirectCSSValue ? { width } : {}),
          }}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <div className="px-8 py-16">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Drawer;
