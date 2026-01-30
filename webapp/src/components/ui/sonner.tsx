"use client";

import type { CSSProperties, ComponentProps } from "react";
import { Toaster as Sonner } from "sonner";

type SonnerProps = ComponentProps<typeof Sonner>;

const Toaster = ({ className, style, toastOptions, ...props }: SonnerProps) => {
  const mergedStyle: CSSProperties = {
    "--normal-bg": "var(--popover)",
    "--normal-text": "var(--popover-foreground)",
    "--normal-border": "var(--border)",
    zIndex: 9999,
    ...style
  };

  return (
    <Sonner
      theme="light"
      className={["toaster group z-[9999]", className].filter(Boolean).join(" ")}
      style={mergedStyle}
      toastOptions={{
        className: "z-[9999]",
        ...toastOptions
      }}
      {...props}
    />
  );
};

export { Toaster };

