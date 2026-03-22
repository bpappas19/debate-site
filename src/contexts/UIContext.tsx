"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface UIContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  /** Mobile starts closed; md+ opens sidebar column after mount (avoids full-screen overlay on phones). */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setSidebarOpen(true);
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <UIContext.Provider value={{ sidebarOpen, toggleSidebar, setSidebarOpen }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
