import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { UIProvider } from "@/contexts/UIContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SideQuest | Home Debate Feed",
  description: "Engage in meaningful debates and share your perspective",
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
        className={`${inter.variable} font-display antialiased bg-[#f6f6f8] dark:bg-[#101622] text-[#0d121b] dark:text-gray-100 min-h-screen`}
      >
        <UIProvider>
          <NavBar />
          <div className="w-full">{children}</div>
        </UIProvider>
      </body>
    </html>
  );
}
