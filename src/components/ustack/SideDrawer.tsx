import { AnimatePresence, motion } from "framer-motion";
import { Home, Wallet, Activity, User, Settings, ShieldCheck, HelpCircle, LogOut } from "lucide-react";
import { Logo } from "./Logo";
import type { Tab } from "./BottomNav";

const items = [
  { id: "home",       icon: Home,        label: "Home",            group: "nav" },
  { id: "vaults",     icon: Wallet,      label: "Vaults",          group: "nav" },
  { id: "activity",   icon: Activity,    label: "Activity",        group: "nav" },
  { id: "profile",    icon: User,        label: "Profile",         group: "nav" },
  { id: "protection", icon: ShieldCheck, label: "Price Protection", group: "action" },
  { id: "settings",   icon: Settings,    label: "Settings",        group: "action" },
  { id: "help",       icon: HelpCircle,  label: "Help & Support",  group: "action" },
  { id: "logout",     icon: LogOut,      label: "Log out",         group: "danger" },
] as const;

type ItemId = typeof items[number]["id"];

export function SideDrawer({ open, onClose, onSelect, onSettings, onHelp, onPriceProtection, onLogout }: {
  open: boolean;
  onClose: () => void;
  onSelect: (t: Tab) => void;
  onSettings: () => void;
  onHelp: () => void;
  onPriceProtection: () => void;
  onLogout: () => void;
}) {
  const handle = (id: ItemId) => {
    if (id === "home" || id === "vaults" || id === "activity" || id === "profile") {
      onSelect(id as Tab);
    } else if (id === "settings") onSettings();
    else if (id === "help") onHelp();
    else if (id === "protection") onPriceProtection();
    else if (id === "logout") onLogout();
    else onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 grad-hero z-0 flex flex-col"
        >
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 30 }}
            className="flex-1 px-7 pt-16 pb-10"
          >
            <div className="flex items-center gap-3">
              <Logo size={42} />
              <div>
                <div className="text-base font-semibold">Norman K.</div>
                <div className="text-xs text-muted-foreground">@norman · UStack</div>
              </div>
            </div>

            <div className="mt-10 flex flex-col">
              {items.map((item, i) => {
                const Icon = item.icon;
                const isDanger = item.group === "danger";
                const isFirst = i > 0 && item.group !== items[i - 1].group;
                return (
                  <div key={item.id}>
                    {isFirst && <div className="my-2 border-t border-white/8" />}
                    <motion.button
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.18 + i * 0.04 }}
                      onClick={() => handle(item.id)}
                      className="w-full flex items-center gap-4 py-3 px-2 text-left active:scale-[0.98] transition rounded-xl"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDanger ? "bg-destructive/15" : "glass"}`}>
                        <Icon className={`w-5 h-5 ${isDanger ? "text-destructive" : ""}`} />
                      </div>
                      <span className={`text-[1.05rem] font-medium ${isDanger ? "text-destructive" : ""}`}>{item.label}</span>
                    </motion.button>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-4 border-t border-white/8">
              <div className="text-xs text-muted-foreground">© 2026 UStack v1.0.0</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
