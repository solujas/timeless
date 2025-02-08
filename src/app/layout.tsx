import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "@fontsource/playfair-display";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Timeless",
  description: "A minimalist social platform where posts fade away",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={playfair.variable}>
      <body className="bg-gruvbox-bg0 text-gruvbox-fg0">{children}</body>
    </html>
  );
}
