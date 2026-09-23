"use client";

import type { LoginMotionPreset } from "@/lib/server/login-motion";
import { useThemeConfig } from "@/lib/theme-hooks";
import { ReactNode } from "react";

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
    <div className={`${className} login-shell login-shell--${motion}`} style={backgroundStyle}>
      <div className="login-shell__content relative z-10">{children}</div>
    </div>
  );
}
