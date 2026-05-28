import { motion } from "framer-motion";
import { Lock, TrendingUp } from "lucide-react";
import type { Vault } from "@/lib/ustack-data";
import { ProgressRing } from "./ProgressRing";

const gradMap = {
  coral: "grad-coral",
  teal: "grad-teal",
  mint: "grad-mint",
  aqua: "grad-teal",
  btc: "grad-btc",
} as const;

export function VaultCard({ vault, onClick, large = false }: { vault: Vault; onClick?: () => void; large?: boolean }) {
  const pct = vault.currentSats / vault.goalSats;
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full text-left rounded-3xl p-4 glass-strong overflow-hidden shadow-soft ${large ? "h-44" : "h-48"}`}
    >
      <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-30 blur-2xl ${gradMap[vault.accent]}`} />

      <div className="relative flex justify-between items-start">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            {vault.type === "hodl" ? <Lock className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
            {vault.type === "hodl" ? "Hodl Vault" : "Stack Vault"}
          </div>
          <div className="text-base font-semibold mt-1 leading-tight">{vault.emoji} {vault.name}</div>
        </div>
        <ProgressRing value={pct} size={52} accent={vault.accent}>
          <span className="text-[10px] font-semibold tabular-nums">{Math.round(pct * 100)}%</span>
        </ProgressRing>
      </div>

      <div className="relative mt-auto pt-6 flex items-end justify-between">
        <div>
          <div className="text-[10px] text-muted-foreground">
            {vault.type === "hodl" ? "Locked for" : "Target"}
          </div>
          <div className="text-sm font-semibold tabular-nums">
            {vault.type === "hodl"
              ? `${vault.daysRemaining} days`
              : `${(vault.goalSats / 1000).toFixed(0)}k sats`}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground">
            {vault.type === "hodl" ? "Time-locked" : "Flexible"}
          </div>
          <div className="text-xs font-medium">🔥 {vault.streakDays}d</div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} transition={{ duration: 1 }} className={`h-full ${gradMap[vault.accent]}`} />
      </div>
    </motion.button>
  );
}
