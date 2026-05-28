import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Plus, Vault, ArrowDownToLine, Send, ArrowUpFromLine } from "lucide-react";

export function Fab({ onCreateVault, onAddFunds, onSend, onWithdraw }: {
  onCreateVault: () => void;
  onAddFunds: () => void;
  onSend: () => void;
  onWithdraw: () => void;
}) {
  const [open, setOpen] = useState(false);

  // upside-down banana arc: 4 points
  const actions = [
    { icon: Vault, label: "Create Vault", angle: -135, onClick: onCreateVault, grad: "grad-coral" },
    { icon: ArrowDownToLine, label: "Add Funds", angle: -110, onClick: onAddFunds, grad: "grad-teal" },
    { icon: Send, label: "Send", angle: -70, onClick: onSend, grad: "grad-mint" },
    { icon: ArrowUpFromLine, label: "Withdraw", angle: -45, onClick: onWithdraw, grad: "grad-btc" },
  ];
  const R = 120;

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm pointer-events-auto"
            aria-label="Close actions"
          />
        )}
      </AnimatePresence>

      {/* Arc actions */}
      <div className="relative">
        {actions.map((a, i) => {
          const rad = (a.angle * Math.PI) / 180;
          const x = Math.cos(rad) * R;
          const y = Math.sin(rad) * R;
          const Icon = a.icon;
          return (
            <AnimatePresence key={a.label}>
              {open && (
                <motion.button
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                  animate={{ x, y, opacity: 1, scale: 1 }}
                  exit={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22, delay: i * 0.04 }}
                  onClick={() => { a.onClick(); setOpen(false); }}
                  className="absolute pointer-events-auto"
                  style={{ left: 0, bottom: 0 }}
                >
                  <div className="flex flex-col items-center gap-1.5 -translate-x-1/2 -translate-y-1/2">
                    <div className={`w-14 h-14 rounded-2xl ${a.grad} shadow-float flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-background" />
                    </div>
                    <span className="text-[10px] font-medium glass rounded-full px-2 py-0.5 whitespace-nowrap">{a.label}</span>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          );
        })}

        {/* Main FAB */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setOpen(!open)}
          className="relative pointer-events-auto w-16 h-16 rounded-full grad-coral shadow-glow-coral flex items-center justify-center"
          aria-label="Quick actions"
        >
          <motion.div animate={{ rotate: open ? 135 : 0 }} transition={{ type: "spring", stiffness: 280, damping: 20 }}>
            <Plus className="w-7 h-7 text-primary-foreground" strokeWidth={2.5} />
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
