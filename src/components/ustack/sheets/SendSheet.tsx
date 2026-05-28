import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Smartphone, CheckCircle2 } from "lucide-react";
import { Sheet } from "./Sheet";
import { availableSats, fmtSats } from "@/lib/ustack-data";

type Step = "form" | "done";

export function SendSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<Step>("form");
  const [method, setMethod] = useState<"lightning" | "momo">("lightning");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  const reset = () => { setStep("form"); setAddress(""); setAmount(""); onClose(); };
  const canContinue = address.trim().length > 0 && Number(amount) > 0 && Number(amount) <= availableSats;

  return (
    <Sheet open={open} onClose={reset} title="Send Sats">
      <AnimatePresence mode="wait">

        {step === "form" && (
          <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Send via</div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <MethodCard
                active={method === "lightning"} onClick={() => setMethod("lightning")}
                icon={Zap} label="Lightning" sub="Instant · Any wallet"
              />
              <MethodCard
                active={method === "momo"} onClick={() => setMethod("momo")}
                icon={Smartphone} label="Mobile Money" sub="2–5 min"
              />
            </div>

            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              {method === "lightning" ? "Lightning address or invoice" : "Phone number"}
            </div>
            <input
              type={method === "momo" ? "tel" : "text"}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={method === "lightning" ? "you@wallet.btc or lnbc…" : "+260 97X XXX XXX"}
              className="w-full rounded-2xl glass px-4 py-3.5 text-sm focus:outline-none placeholder:text-muted-foreground/50 mb-5"
            />

            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Amount</div>
            <div className="rounded-2xl glass p-5 flex items-center justify-center gap-2">
              <input
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                className="bg-transparent text-3xl font-semibold text-center tabular-nums focus:outline-none w-44"
                placeholder="0"
              />
              <span className="text-sm text-muted-foreground">sats</span>
            </div>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              Available: <span className="text-foreground font-semibold">{fmtSats(availableSats)}</span>
            </div>

            <button
              disabled={!canContinue}
              onClick={() => setStep("done")}
              className="mt-6 w-full grad-coral text-primary-foreground font-semibold py-4 rounded-2xl shadow-glow-coral active:scale-[0.98] transition disabled:opacity-40"
            >
              Send
            </button>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center gap-4 py-4">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
              className="w-20 h-20 rounded-full grad-mint flex items-center justify-center"
            >
              <CheckCircle2 className="w-10 h-10 text-background" />
            </motion.div>
            <div className="text-lg font-semibold">Sent!</div>
            <div className="text-sm text-muted-foreground leading-relaxed">
              <span className="text-foreground font-semibold">{fmtSats(Number(amount))}</span> sent via {method === "lightning" ? "⚡ Lightning" : "📱 Mobile Money"}.
            </div>
            <div className="w-full rounded-2xl glass p-4 text-left flex flex-col gap-2 text-xs text-muted-foreground">
              <div className="flex justify-between"><span>To</span><span className="text-foreground font-medium truncate max-w-[180px]">{address}</span></div>
              <div className="flex justify-between"><span>Method</span><span className="text-foreground font-medium">{method === "lightning" ? "⚡ Lightning" : "📱 Mobile Money"}</span></div>
              <div className="flex justify-between"><span>Amount</span><span className="text-foreground font-medium">{fmtSats(Number(amount))}</span></div>
            </div>
            <button onClick={reset} className="mt-2 w-full grad-mint text-primary-foreground font-semibold py-4 rounded-2xl">
              Done
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </Sheet>
  );
}

function MethodCard({ active, onClick, icon: Icon, label, sub }: { active: boolean; onClick: () => void; icon: typeof Zap; label: string; sub: string }) {
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
