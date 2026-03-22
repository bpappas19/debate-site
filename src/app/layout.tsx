import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import AppLayout from "@/components/AppLayout";
import { UIProvider } from "@/contexts/UIContext";
import { DebatesProvider } from "@/contexts/DebatesContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Debate Stocks | Test Conviction. See Both Sides.",
  description:
    "The best place to test conviction on market ideas. Debate stocks, see bull and bear cases, and vote. Starting with stocks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} font-display antialiased bg-[#f6f6f8] dark:bg-[#101622] text-[#0d121b] dark:text-gray-100 min-h-screen w-full max-w-full overflow-x-hidden`}
      >
        <UIProvider>
          <DebatesProvider>
            <NavBar />
            <AppLayout>{children}</AppLayout>
          </DebatesProvider>
        </UIProvider>
      </body>
    </html>
  );
}
