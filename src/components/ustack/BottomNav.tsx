import { Home, Wallet, Activity, User } from "lucide-react";
import { motion } from "framer-motion";

export type Tab = "home" | "vaults" | "activity" | "profile";

const items: { id: Tab; icon: typeof Home; label: string }[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "vaults", icon: Wallet, label: "Vaults" },
  { id: "activity", icon: Activity, label: "Activity" },
  { id: "profile", icon: User, label: "Profile" },
];

export function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30">
      <div className="glass-strong rounded-full px-2 py-2 flex items-center gap-1 shadow-float">
        {items.map((it) => {
          const active = it.id === tab;
          const Icon = it.icon;
          return (
            <button
              key={it.id}
              onClick={() => onChange(it.id)}
              className="relative px-4 py-2.5 rounded-full flex items-center gap-2"
            >
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 grad-coral rounded-full shadow-glow-coral"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className={`relative w-5 h-5 ${active ? "text-primary-foreground" : "text-muted-foreground"}`} />
              {active && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  className="relative text-xs font-semibold text-primary-foreground"
                >
                  {it.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
