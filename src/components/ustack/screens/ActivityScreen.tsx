import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownToLine, Trophy, Flame, ShieldCheck, ArrowUpFromLine, Vault } from "lucide-react";
import { activity, fmtZMW } from "@/lib/ustack-data";

const iconMap = {
  deposit: ArrowDownToLine, milestone: Trophy, streak: Flame,
  protection: ShieldCheck, withdraw: ArrowUpFromLine, vault: Vault,
} as const;
const gradMap = {
  deposit: "grad-coral", milestone: "grad-mint", streak: "grad-btc",
  protection: "grad-teal", withdraw: "grad-teal", vault: "grad-coral",
} as const;

type FilterKind = "all" | "deposit" | "withdraw" | "vault" | "events";

const FILTERS: { id: FilterKind; label: string }[] = [
  { id: "all",      label: "All" },
  { id: "deposit",  label: "Deposits" },
  { id: "withdraw", label: "Withdrawals" },
  { id: "vault",    label: "Vaults" },
  { id: "events",   label: "Events" },
];

const SAT_AMOUNTS: Partial<Record<string, number>> = {
  a1: 20_000,
  a4: 50_000,
};

export function ActivityScreen() {
  const [filter, setFilter] = useState<FilterKind>("all");

  const filtered = activity.filter((a) => {
    if (filter === "all") return true;
    if (filter === "events") return ["milestone", "streak", "protection"].includes(a.kind);
    return a.kind === filter;
  });

  return (
    <div className="px-5 pt-2 flex flex-col gap-5">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Activity</div>
        <div className="text-sm text-muted-foreground">Every step you took toward your goals.</div>
      </div>

      {/* Filter chips */}
      <div className="-mx-5 px-5 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === f.id
                ? "grad-coral text-background shadow-glow-coral"
                : "glass text-muted-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="flex flex-col gap-2"
        >
          {filtered.length === 0 ? (
            <div className="rounded-2xl glass p-8 text-center text-sm text-muted-foreground">
              No activity yet.
            </div>
          ) : (
            filtered.map((a, i) => {
              const Icon = iconMap[a.kind];
              const sats = SAT_AMOUNTS[a.id];
              const showAmount = (a.kind === "deposit" || a.kind === "withdraw") && sats;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-2xl bg-card/60 p-3.5 flex items-center gap-3"
                >
                  <div className={`w-11 h-11 rounded-xl ${gradMap[a.kind]} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5 text-background" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.meta}</div>
                  </div>
                  <div className="text-right shrink-0">
                    {showAmount && (
                      <div className="text-xs font-semibold text-foreground">{fmtZMW(sats)}</div>
                    )}
                    <div className="text-xs text-muted-foreground">{a.when}</div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
