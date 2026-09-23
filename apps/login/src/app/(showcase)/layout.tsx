import "@/styles/globals.scss";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZITADEL login design preview",
  robots: { index: false, follow: false },
};

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
