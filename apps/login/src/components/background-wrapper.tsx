"use client";

import type { LoginMotionPreset } from "@/lib/server/login-motion";
import { useThemeConfig } from "@/lib/theme-hooks";
import { ReactNode } from "react";
import { LoginMotion } from "./login-motion";

/**
 * BackgroundWrapper component handles applying background images from theme configuration.
 * This needs to be a client component to access environment variables via the theme hook.
 */
export function BackgroundWrapper({
  children,
  className = "",
  motion = "none",
}: {
  children: ReactNode;
  className?: string;
  motion?: LoginMotionPreset;
}) {
  const themeConfig = useThemeConfig();

  const backgroundStyle = themeConfig.backgroundImage
    ? {
        backgroundImage: `url(${themeConfig.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : {};

  return (
    <div className={className} style={backgroundStyle}>
      <LoginMotion preset={motion} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
