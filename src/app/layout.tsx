import type { Metadata } from "next";
import { Cinzel, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AURUMEND — The Sovereign Protocol for Self-Healing APIs",
  description:
    "Autonomous contract-verified migration infrastructure that bridges API Producers to Consumer Codebases, healing breaking changes with 24K gold precision before production breaks.",
  keywords: [
    "self-healing API",
    "API migrations",
    "automated pull requests",
    "contract verification",
    "AST diffing",
    "E2B sandbox",
    "OpenAPI",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="bg-[#070709] text-[#FAF9F6] antialiased selection:bg-[#D4AF37]/20 selection:text-[#F3E5AB]">
        {children}
      </body>
    </html>
  );
}

