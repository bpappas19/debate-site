"use client";

import { useUI } from "@/contexts/UIContext";
import Sidebar from "@/components/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUI();

  return (
    <div className="w-full min-h-screen max-w-full overflow-x-hidden px-4 md:px-6">
      <div
        className={`grid gap-0 items-start transition-all duration-200 ${
          sidebarOpen ? "md:grid-cols-[280px_1fr]" : "md:grid-cols-1"
        }`}
      >
        <Sidebar />
        <main className="min-w-0 max-w-full">
          <div className="mx-auto w-full min-w-0 max-w-7xl pt-6 md:pt-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
