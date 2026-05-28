import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Smartphone, AlertTriangle } from "lucide-react";
import { Sheet } from "./Sheet";

export function WithdrawSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [method, setMethod] = useState<"lightning" | "momo">("lightning");
  const [amount, setAmount] = useState("100000");
  const [warned, setWarned] = useState(false);

  const close = () => { setWarned(false); onClose(); };

  return (
    <Sheet open={open} onClose={close} title="Withdraw">
      {!warned ? (
        <>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <MethodCard active={method==="lightning"} onClick={()=>setMethod("lightning")} icon={Zap} label="Lightning" sub="Instant" />
            <MethodCard active={method==="momo"} onClick={()=>setMethod("momo")} icon={Smartphone} label="Mobile Money" sub="2–5 min" />
          </div>

          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Amount</div>
          <div className="rounded-2xl glass p-5 flex items-center justify-center gap-2">
            <input
              inputMode="numeric" value={amount} onChange={(e)=>setAmount(e.target.value.replace(/\D/g,""))}
              className="bg-transparent text-3xl font-semibold text-center tabular-nums focus:outline-none w-44"
            />
            <span className="text-sm text-muted-foreground">sats</span>
          </div>
          <div className="mt-2 text-center text-xs text-muted-foreground">
            Available: <span className="text-foreground font-semibold">1,212,000 sats</span>
          </div>

          <button
            onClick={() => setWarned(true)}
            className="mt-8 w-full grad-coral text-primary-foreground font-semibold py-4 rounded-2xl shadow-glow-coral active:scale-[0.98] transition"
          >
            Continue
          </button>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-2xl border border-[oklch(0.74_0.18_25)]/30 bg-[oklch(0.74_0.18_25)]/10 p-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[oklch(0.74_0.18_25)]" />
              <div className="text-sm font-semibold">Early withdrawal</div>
            </div>
            <div className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Withdrawing early may slow your progress. A small penalty of <span className="text-foreground font-semibold">2,500 sats</span> applies.
            </div>
            <div className="text-sm text-muted-foreground mt-2 leading-relaxed">
              You're 62% of the way to your goal. Future you might thank you for holding.
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={() => setWarned(false)} className="flex-1 glass py-4 rounded-2xl font-semibold">
              Keep stacking
            </button>
            <button onClick={close} className="flex-1 bg-[oklch(0.74_0.18_25)]/20 text-[oklch(0.85_0.15_25)] border border-[oklch(0.74_0.18_25)]/30 py-4 rounded-2xl font-semibold">
              Withdraw anyway
            </button>
          </div>
        </motion.div>
      )}
    </Sheet>
  );
}

function MethodCard({ active, onClick, icon: Icon, label, sub }: { active: boolean; onClick: ()=>void; icon: typeof Zap; label: string; sub: string }) {
  return (
    <button onClick={onClick} className={`rounded-2xl p-4 flex flex-col items-start gap-2 text-left transition border ${active ? "bg-card border-primary/50 shadow-glow-coral" : "bg-card/50 border-transparent"}`}>
      <div className={`w-10 h-10 rounded-xl ${active ? "grad-coral" : "bg-white/5"} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${active ? "text-background" : ""}`} />
      </div>
      <div className="text-sm font-semibold">{label}</div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </button>
  );
}
