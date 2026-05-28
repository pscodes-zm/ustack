import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, TrendingUp, ChevronRight, ChevronLeft, ShieldCheck, Sparkles } from "lucide-react";
import { Sheet } from "./Sheet";

export function CreateVaultSheet({ open, onClose, onDeposit }: { open: boolean; onClose: () => void; onDeposit: () => void }) {
  const [step, setStep] = useState(0);
  const [type, setType] = useState<"hodl" | "stack">("stack");
  const [name, setName] = useState("");
  const [goal, setGoal] = useState(500_000);
  const total = 5;

  const close = () => { setStep(0); setName(""); setGoal(500_000); onClose(); };
  const next = () => setStep(Math.min(step + 1, total - 1));
  const prev = () => setStep(Math.max(step - 1, 0));

  return (
    <Sheet open={open} onClose={close} title="Create Vault">
      {/* progress */}
      <div className="flex gap-1.5 mb-6">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div animate={{ width: i <= step ? "100%" : "0%" }} className="h-full grad-coral" />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && (
            <div>
              <div className="text-xl font-semibold">Choose vault type</div>
              <div className="text-sm text-muted-foreground mt-1">Pick how you want to save.</div>
              <div className="mt-5 flex flex-col gap-3">
                <TypeCard active={type==="hodl"} onClick={()=>setType("hodl")} icon={Lock} title="Hodl Vault" sub="Locked long-term. Higher discipline." grad="grad-coral" />
                <TypeCard active={type==="stack"} onClick={()=>setType("stack")} icon={TrendingUp} title="Stack Vault" sub="Flexible recurring savings." grad="grad-teal" />
              </div>
            </div>
          )}
          {step === 1 && (
            <div>
              <div className="text-xl font-semibold">Name your vault</div>
              <div className="text-sm text-muted-foreground mt-1">Make it personal. Specific names stick.</div>
              <input
                autoFocus
                value={name} onChange={(e)=>setName(e.target.value)}
                placeholder="e.g. School Fees"
                className="mt-5 w-full bg-card border border-border rounded-2xl px-4 py-4 text-base focus:border-primary focus:outline-none focus:shadow-glow-coral transition"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {["School Fees", "Future Business", "Emergency", "New Laptop"].map((s) => (
                  <button key={s} onClick={()=>setName(s)} className="px-3 py-1.5 rounded-full glass text-xs">{s}</button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="text-xl font-semibold">Set your goal</div>
              <div className="text-sm text-muted-foreground mt-1">How much do you want to stack?</div>
              <div className="mt-5 rounded-2xl glass p-5 text-center">
                <div className="text-xs text-muted-foreground">Target</div>
                <div className="text-3xl font-semibold mt-1 tabular-nums">{goal.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">sats</div>
              </div>
              <input
                type="range" min={50_000} max={5_000_000} step={50_000} value={goal}
                onChange={(e)=>setGoal(parseInt(e.target.value))}
                className="mt-5 w-full accent-[oklch(0.74_0.18_25)]"
              />
              <div className="mt-3 flex gap-2">
                {[100_000, 500_000, 1_000_000, 2_500_000].map((v) => (
                  <button key={v} onClick={()=>setGoal(v)} className="flex-1 py-2 rounded-xl glass text-xs">{(v/1000)}k</button>
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <div className="text-xl font-semibold">Lock rules</div>
              <div className="text-sm text-muted-foreground mt-1">Knowing the rules makes them easier to keep.</div>
              <div className="mt-5 rounded-2xl glass p-5 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-[oklch(0.78_0.14_190)] shrink-0 mt-0.5" />
                <div className="text-sm leading-relaxed">
                  Withdrawals before completion may include penalties. This protects your future self from impulse decisions.
                </div>
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              <div className="text-xl font-semibold">Confirm vault</div>
              <div className="text-sm text-muted-foreground mt-1">Review and create.</div>
              <div className="mt-5 rounded-2xl glass p-5 flex flex-col gap-3">
                <Summary k="Type" v={type === "hodl" ? "Hodl Vault" : "Stack Vault"} />
                <Summary k="Name" v={name || "Untitled"} />
                <Summary k="Goal" v={`${goal.toLocaleString()} sats`} />
                <Summary k="Penalties" v={type === "hodl" ? "Yes, on early withdraw" : "Soft, flexible"} />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex gap-3">
        {step > 0 && (
          <button onClick={prev} className="w-14 h-14 rounded-2xl glass flex items-center justify-center">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {step < total - 1 ? (
          <button onClick={next} className="flex-1 grad-coral text-primary-foreground font-semibold py-4 rounded-2xl shadow-glow-coral active:scale-[0.98] transition flex items-center justify-center gap-2">
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => { close(); setTimeout(onDeposit, 400); }} className="flex-1 grad-coral text-primary-foreground font-semibold py-4 rounded-2xl shadow-glow-coral active:scale-[0.98] transition flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> Create Vault
          </button>
        )}
      </div>
    </Sheet>
  );
}

function TypeCard({ active, onClick, icon: Icon, title, sub, grad }: { active: boolean; onClick: ()=>void; icon: typeof Lock; title: string; sub: string; grad: string }) {
  return (
    <button onClick={onClick} className={`rounded-2xl p-4 flex items-center gap-4 text-left transition border ${active ? "bg-card border-primary/50 shadow-glow-coral" : "bg-card/50 border-transparent"}`}>
      <div className={`w-12 h-12 rounded-xl ${grad} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-background" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 ${active ? "border-primary bg-primary" : "border-muted"}`} />
    </button>
  );
}
function Summary({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}
