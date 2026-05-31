import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { PhoneFrame } from "@/components/ustack/PhoneFrame";
import { Logo } from "@/components/ustack/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UStack: Stack Bitcoin. Stay Disciplined." },
      { name: "description", content: "Save Bitcoin the smart way with UStack. Vault-based savings built for discipline, not trading." },
      { property: "og:title", content: "UStack: Stack Bitcoin. Stay Disciplined." },
      { property: "og:description", content: "Save Bitcoin the smart way with UStack. Vault-based savings built for discipline, not trading." },
    ],
  }),
  component: Splash,
});

function Splash() {
  const nav = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => nav({ to: "/welcome" }), 2200);
    return () => clearTimeout(t);
  }, [nav]);

  return (
    <PhoneFrame>
      <div className="h-full min-h-screen md:min-h-[860px] flex flex-col items-center justify-center gap-8 bg-background">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.9, 1.04, 1], opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Logo size={96} />
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center px-6"
        >
          <div className="text-3xl font-semibold tracking-tight">UStack</div>
          <div className="mt-2 text-sm text-muted-foreground">Stack Bitcoin. Stay Disciplined.</div>
        </motion.div>
      </div>
    </PhoneFrame>
  );
}
