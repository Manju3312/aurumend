import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#070709] text-[#FAF9F6] antialiased selection:bg-[#D4AF37]/20 selection:text-[#F3E5AB]">
        {children}
      </body>
    </html>
  );
}
