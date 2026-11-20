import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";
import { CommandPalette } from "./CommandPalette";

export function AppShell() {
  const location = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    function onKey(e) {
      const isK = e.key === "k" || e.key === "K";
      if (isK && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // close on route change
  useEffect(() => {
    setPaletteOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex bg-[var(--bg)] min-w-0 overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 px-3.5 sm:px-6 md:px-8 py-4 sm:py-6 max-w-[1600px] mx-auto w-full min-w-0 overflow-x-hidden pb-20 md:pb-6">
        <Topbar onOpenPalette={openPalette} />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <MobileNav />
      <CommandPalette open={paletteOpen} onClose={closePalette} />
    </div>
  );
}
