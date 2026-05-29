import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, Bitcoin, ArrowLeft, Fingerprint } from "lucide-react";
import { PhoneFrame } from "@/components/ustack/PhoneFrame";
import { Logo } from "@/components/ustack/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Log in — UStack" },
      { name: "description", content: "Log back in to your UStack account." },
    ],
  }),
  component: Auth,
});

function Auth() {
  const nav = useNavigate();
  const [step, setStep] = useState<"login" | "pin" | "done">("login");
  const [phone, setPhone] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!phone) return;
    setStep("pin");
  };

  const handleLogin = () => {
    if (pin.length < 4) return;
    setLoading(true);
    setTimeout(() => setStep("done"), 1000);
    setTimeout(() => nav({ to: "/app" }), 2400);
  };

  if (step === "done") {
    return (
      <PhoneFrame>
        <div className="h-full min-h-screen md:min-h-[860px] flex flex-col items-center justify-center gap-6 grad-hero">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
          >
            <div className="w-24 h-24 rounded-full grad-teal flex items-center justify-center shadow-glow-teal">
              <ShieldCheck className="w-12 h-12 text-background" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="text-2xl font-semibold">Welcome back</div>
            <div className="text-sm text-muted-foreground mt-1">Loading your stack…</div>
          </motion.div>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="h-full min-h-screen md:min-h-[860px] flex flex-col grad-hero">
        {/* Glow blob */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ background: "var(--grad-coral)" }}
        />

        <div className="relative flex flex-col flex-1 px-7 pt-14 pb-10">

          {/* Back button */}
          <button
            onClick={() => step === "pin" ? setStep("login") : nav({ to: "/welcome" })}
            className="w-10 h-10 rounded-full glass flex items-center justify-center self-start"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3 mt-8">
            <Logo size={36} />
            <span className="text-base font-semibold tracking-wide">UStack</span>
          </div>

          <AnimatePresence mode="wait">

            {/* Step 1 — Phone / Email */}
            {step === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col flex-1"
              >
                <div className="mt-8">
                  <h1 className="text-[2rem] font-semibold tracking-tight leading-tight">
                    Welcome back
                  </h1>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Log in to your Bitcoin savings vault.
                  </p>
                </div>

                <div className="mt-10 flex flex-col gap-4">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Phone number or email
                    </span>
                    <input
                      autoFocus
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+260 … or you@email.com"
                      className="bg-card border border-border rounded-2xl px-4 py-4 text-base focus:border-primary focus:outline-none focus:shadow-glow-coral transition"
                    />
                  </label>
                </div>

                {/* Trust badges */}
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {[
                    { icon: ShieldCheck, label: "Non-custodial" },
                    { icon: Bitcoin,     label: "Bitcoin only" },
                    { icon: Fingerprint, label: "Biometric" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="glass rounded-2xl p-3 flex flex-col items-center gap-1.5">
                      <Icon className="w-4 h-4 text-[oklch(0.78_0.14_190)]" />
                      <span className="text-[10px] text-muted-foreground text-center leading-tight">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex-1" />

                <button
                  onClick={handleContinue}
                  disabled={!phone}
                  className="grad-coral text-primary-foreground font-semibold py-4 rounded-2xl shadow-glow-coral active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                </button>

                <p className="mt-5 text-center text-sm text-muted-foreground">
                  No account?{" "}
                  <Link to="/onboarding" className="text-[oklch(0.82_0.13_190)] font-medium">
                    Get started free
                  </Link>
                </p>
              </motion.div>
            )}

            {/* Step 2 — PIN */}
            {step === "pin" && (
              <motion.div
                key="pin"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col flex-1"
              >
                <div className="mt-8">
                  <h1 className="text-[2rem] font-semibold tracking-tight leading-tight">
                    Enter your PIN
                  </h1>
                  <p className="mt-2 text-muted-foreground text-sm">
                    {phone}
                  </p>
                </div>

                {/* PIN dots */}
                <div className="mt-12 flex justify-center gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: pin.length === i + 1 ? [1, 1.3, 1] : 1,
                        background: i < pin.length
                          ? "oklch(0.74 0.18 25)"
                          : "oklch(0.3 0.01 260)",
                      }}
                      transition={{ duration: 0.2 }}
                      className="w-4 h-4 rounded-full"
                    />
                  ))}
                </div>

                {/* Number pad */}
                <div className="mt-10 grid grid-cols-3 gap-3 px-4">
                  {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((k, i) => (
                    <button
                      key={i}
                      disabled={k === ""}
                      onClick={() => {
                        if (k === "⌫") { setPin(p => p.slice(0, -1)); return; }
                        if (k === "") return;
                        if (pin.length < 6) setPin(p => p + k);
                      }}
                      className={`h-16 rounded-2xl text-xl font-semibold flex items-center justify-center transition active:scale-95 ${k === "" ? "invisible" : "glass hover:bg-white/10"}`}
                    >
                      {k}
                    </button>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <button className="text-sm text-[oklch(0.82_0.13_190)] font-medium">
                    Forgot PIN?
                  </button>
                </div>

                <div className="flex-1" />

                <button
                  onClick={handleLogin}
                  disabled={pin.length < 4 || loading}
                  className="grad-coral text-primary-foreground font-semibold py-4 rounded-2xl shadow-glow-coral active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white"
                    />
                  ) : (
                    "Log In"
                  )}
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </PhoneFrame>
  );
}
