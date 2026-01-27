"use client";

import { useUI } from "@/contexts/UIContext";
import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUI();

  return (
    <div className="w-full min-h-screen px-4 lg:px-6">
      <div
        className={`grid gap-0 items-start transition-all duration-200 ${
          sidebarOpen ? "lg:grid-cols-[280px_1fr]" : "lg:grid-cols-1"
        }`}
      >
        <Sidebar />
        <main className="min-w-0">
          <div className="mx-auto w-full max-w-7xl pt-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
