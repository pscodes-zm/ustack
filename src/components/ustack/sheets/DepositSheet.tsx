import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Zap, Copy, Check } from "lucide-react";
import { Sheet } from "./Sheet";

export function DepositSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<"momo" | "lightning">("momo");
  const [provider, setProvider] = useState("MTN MoMo");
  const [amount, setAmount] = useState("1000");
  const [phase, setPhase] = useState<"input" | "processing" | "done">("input");
  const [copied, setCopied] = useState(false);

  const close = () => { setPhase("input"); setAmount("1000"); onClose(); };
  const confirm = () => {
    setPhase("processing");
    setTimeout(() => setPhase("done"), 1500);
  };

  return (
    <Sheet open={open} onClose={close} title="Add Funds">
      {phase === "done" ? (
        <SuccessState onDone={close} />
      ) : phase === "processing" ? (
        <ProcessingState />
      ) : (
        <>
          <div className="flex p-1 rounded-2xl bg-white/5 mb-5">
            {[
              ["momo", "Mobile Money", Smartphone],
              ["lightning", "Lightning", Zap],
            ].map(([k, label, Icon]) => {
              const I = Icon as typeof Smartphone;
              const active = tab === k;
              return (
                <button key={k as string} onClick={() => setTab(k as "momo" | "lightning")} className="relative flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium">
                  {active && <motion.div layoutId="dep-tab" className="absolute inset-0 grad-coral rounded-xl" />}
                  <I className={`relative w-4 h-4 ${active ? "text-background" : "text-muted-foreground"}`} />
                  <span className={`relative ${active ? "text-background" : "text-muted-foreground"}`}>{label as string}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {tab === "momo" ? (
              <motion.div key="momo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Provider</div>
                <div className="grid grid-cols-3 gap-2">
                  {["Airtel", "MTN MoMo", "Zamtel"].map((p) => (
                    <button key={p} onClick={() => setProvider(p)} className={`py-3 rounded-xl text-xs font-medium transition ${provider === p ? "grad-coral text-background" : "glass text-muted-foreground"}`}>{p}</button>
                  ))}
                </div>

                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-6 mb-2">Amount</div>
                <div className="rounded-2xl glass p-5 flex items-center justify-center gap-2">
                  <input
                    inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)}
                    className="bg-transparent text-3xl font-semibold text-center tabular-nums focus:outline-none w-32"
                  />
                  <span className="text-sm text-muted-foreground">ZMW</span>
                </div>
                <div className="mt-2 flex gap-2">
                  {["500", "1000", "2500", "5000"].map((v) => (
                    <button key={v} onClick={() => setAmount(v)} className="flex-1 py-2 rounded-xl glass text-xs">{v}</button>
                  ))}
                </div>

                <button onClick={confirm} className="mt-8 w-full grad-btc text-background font-semibold py-4 rounded-2xl shadow-soft active:scale-[0.98] transition">
                  Confirm deposit
                </button>
              </motion.div>
            ) : (
              <motion.div key="ln" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                <div className="w-52 h-52 rounded-2xl bg-white p-4">
                  <FakeQR />
                </div>
                <div className="mt-4 text-xs text-muted-foreground">Expires in <span className="text-foreground font-semibold">9:42</span></div>
                <div className="mt-4 w-full rounded-2xl bg-white/5 p-3 flex items-center gap-2">
                  <code className="flex-1 truncate text-xs text-muted-foreground">lnbc500u1p3xyz...0w8h</code>
                  <button onClick={() => { setCopied(true); setTimeout(()=>setCopied(false), 1200); }} className="w-9 h-9 rounded-xl glass flex items-center justify-center">
                    {copied ? <Check className="w-4 h-4 text-[oklch(0.86_0.13_160)]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </Sheet>
  );
}

function FakeQR() {
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      {Array.from({ length: 32 * 32 }).map((_, i) => {
        const x = i % 32; const y = Math.floor(i / 32);
        const corner = (x < 7 && y < 7) || (x > 24 && y < 7) || (x < 7 && y > 24);
        const on = corner ? ((x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4)) || (x > 24 && (x === 25 || x === 31 || y === 0 || y === 6 || (x >= 27 && x <= 29 && y >= 2 && y <= 4))) || (y > 24 && (x === 0 || x === 6 || y === 25 || y === 31 || (x >= 2 && x <= 4 && y >= 27 && y <= 29)))) : ((x * 7 + y * 13 + ((x * y) % 5)) % 3 === 0);
        return on ? <rect key={i} x={x} y={y} width={1} height={1} fill="black" /> : null;
      })}
    </svg>
  );
}

function ProcessingState() {
  return (
    <div className="py-16 flex flex-col items-center gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }} className="w-12 h-12 rounded-full border-4 border-white/10 border-t-primary" />
      <div className="text-sm text-muted-foreground">Processing your deposit…</div>
    </div>
  );
}
function SuccessState({ onDone }: { onDone: () => void }) {
  return (
    <div className="py-12 flex flex-col items-center gap-4 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="w-20 h-20 rounded-full grad-mint flex items-center justify-center shadow-glow-teal">
        <Check className="w-10 h-10 text-background" strokeWidth={3} />
      </motion.div>
      <div className="text-xl font-semibold">Deposit confirmed</div>
      <div className="text-sm text-muted-foreground max-w-xs">Your stack just grew. Vault progress updated.</div>
      <button onClick={onDone} className="mt-4 w-full grad-coral text-primary-foreground font-semibold py-4 rounded-2xl shadow-glow-coral">Done</button>
    </div>
  );
}
