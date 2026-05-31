import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, ShieldCheck, ChevronRight } from "lucide-react";
import { PhoneFrame } from "@/components/ustack/PhoneFrame";
import { Logo } from "@/components/ustack/Logo";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account - UStack" },
      { name: "description", content: "Start saving Bitcoin with UStack." },
    ],
  }),
  component: Signup,
});

function Signup() {
  const nav = useNavigate();
  const [step, setStep] = useState<"details" | "otp" | "pin" | "done">("details");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [pin, setPin] = useState("");

  const goBack = () => {
    if (step === "otp") setStep("details");
    else if (step === "pin") setStep("otp");
    else nav({ to: "/onboarding" });
  };

  if (step === "done") {
    setTimeout(() => nav({ to: "/app" }), 1600);
    return (
      <PhoneFrame>
        <div className="h-full min-h-screen md:min-h-[860px] flex flex-col items-center justify-center gap-6 bg-background">
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 14 }}
          >
            <div className="w-28 h-28 rounded-full bg-card border border-white/8 flex items-center justify-center" style={{ color: "oklch(0.86 0.13 160)" }}>
              <ShieldCheck className="w-14 h-14" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
            <div className="text-2xl font-semibold">You're in, {username || "stacker"}!</div>
            <div className="text-sm text-muted-foreground mt-1">Building your first vault…</div>
          </motion.div>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="h-full min-h-screen md:min-h-[860px] flex flex-col bg-background">
        <div className="flex flex-col flex-1 px-7 pt-14 pb-10">
          <button onClick={goBack} className="w-10 h-10 rounded-full glass flex items-center justify-center self-start">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mt-8">
            <Logo size={36} />
            <span className="text-base font-semibold tracking-wide">UStack</span>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 mt-6">
            {(["details", "otp", "pin"] as const).map((s, i) => {
              const steps = ["details", "otp", "pin"];
              const idx = steps.indexOf(step);
              return (
                <motion.div
                  key={s}
                  animate={{ width: s === step ? 24 : 8, opacity: i <= idx ? 1 : 0.3 }}
                  className="h-1.5 rounded-full"
                  style={{ background: i <= idx ? "oklch(0.74 0.18 25)" : "oklch(0.4 0.01 260)" }}
                />
              );
            })}
          </div>

          <AnimatePresence mode="wait">

            {/* Step 1 — Details */}
            {step === "details" && (
              <motion.div key="details" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.28 }} className="flex flex-col flex-1">
                <div className="mt-6">
                  <h1 className="text-[2rem] font-semibold tracking-tight leading-tight">Create your<br />account</h1>
                  <p className="mt-2 text-muted-foreground text-sm">Minimal data. Maximum privacy.</p>
                </div>

                <div className="mt-8 flex flex-col gap-4">
                  <Field label="Username" placeholder="@yourname" value={username} onChange={setUsername} />
                  <Field label="Phone number" placeholder="+260 …" value={phone} onChange={setPhone} />
                </div>

                <div className="mt-5 glass rounded-2xl p-4 text-xs text-muted-foreground leading-relaxed">
                  We never sell your data. No aggressive KYC, just what's needed to keep your stack safe.
                </div>

                <div className="flex-1" />

                <button
                  onClick={() => setStep("otp")}
                  disabled={!username || !phone}
                  className="bg-primary text-primary-foreground font-semibold py-4 rounded-2xl active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button onClick={() => nav({ to: "/auth" })} className="text-[oklch(0.82_0.13_190)] font-medium">Log in</button>
                </p>
              </motion.div>
            )}

            {/* Step 2 — OTP */}
            {step === "otp" && (
              <motion.div key="otp" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.28 }} className="flex flex-col flex-1">
                <div className="mt-6">
                  <h1 className="text-[2rem] font-semibold tracking-tight leading-tight">Verify your<br />number</h1>
                  <p className="mt-2 text-muted-foreground text-sm">Enter the 4-digit code sent to {phone || "your phone"}.</p>
                </div>

                <div className="mt-12 flex gap-3 justify-center">
                  {otp.map((v, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      inputMode="numeric"
                      maxLength={1}
                      value={v}
                      onChange={(e) => {
                        const nv = [...otp];
                        nv[idx] = e.target.value.slice(-1);
                        setOtp(nv);
                        const next = document.getElementById(`otp-${idx + 1}`);
                        if (e.target.value && next) (next as HTMLInputElement).focus();
                      }}
                      className="w-16 h-20 text-center text-2xl font-semibold rounded-2xl bg-card border border-border focus:border-primary focus:outline-none transition"
                    />
                  ))}
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">Resend code in 0:42</div>

                <div className="flex-1" />

                <button
                  onClick={() => setStep("pin")}
                  disabled={otp.some((v) => !v)}
                  className="bg-primary text-primary-foreground font-semibold py-4 rounded-2xl active:scale-[0.98] transition disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  Verify <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Step 3 — Set PIN */}
            {step === "pin" && (
              <motion.div key="pin" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.28 }} className="flex flex-col flex-1">
                <div className="mt-6">
                  <h1 className="text-[2rem] font-semibold tracking-tight leading-tight">Set your PIN</h1>
                  <p className="mt-2 text-muted-foreground text-sm">You'll use this every time you open UStack.</p>
                </div>

                <div className="mt-10 flex justify-center gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: pin.length === i + 1 ? [1, 1.35, 1] : 1, background: i < pin.length ? "oklch(0.74 0.18 25)" : "oklch(0.3 0.01 260)" }}
                      transition={{ duration: 0.18 }}
                      className="w-4 h-4 rounded-full"
                    />
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-3 gap-3 px-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((k, i) => (
                    <button
                      key={i}
                      disabled={k === ""}
                      onClick={() => {
                        if (k === "⌫") { setPin((p) => p.slice(0, -1)); return; }
                        if (k === "") return;
                        if (pin.length < 6) setPin((p) => p + k);
                      }}
                      className={`h-16 rounded-2xl text-xl font-semibold flex items-center justify-center transition active:scale-95 ${k === "" ? "invisible" : "glass hover:bg-white/10"}`}
                    >
                      {k}
                    </button>
                  ))}
                </div>

                <div className="flex-1" />

                <button
                  onClick={() => setStep("done")}
                  disabled={pin.length < 4}
                  className="bg-primary text-primary-foreground font-semibold py-4 rounded-2xl active:scale-[0.98] transition disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  Create account <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Field({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-card border border-border rounded-2xl px-4 py-4 text-base focus:border-primary focus:outline-none transition"
      />
    </label>
  );
}
