import { Menu, Bell } from "lucide-react";
import { motion } from "framer-motion";

export function TopBar({ onMenu, onBell }: { onMenu: () => void; onBell: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 pt-12 pb-3">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onMenu}
        className="w-11 h-11 rounded-2xl glass flex items-center justify-center"
        aria-label="Menu"
      >
        <Menu className="w-5 h-5" />
      </motion.button>

      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBell}
          className="relative w-11 h-11 rounded-2xl glass flex items-center justify-center"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[oklch(0.73_0.19_55)]" />
        </motion.button>
        <div className="w-11 h-11 rounded-2xl bg-card border border-white/8 flex items-center justify-center font-semibold text-sm" style={{ color: "oklch(0.86 0.13 160)" }}>
          NK
        </div>
      </div>
    </div>
  );
}
