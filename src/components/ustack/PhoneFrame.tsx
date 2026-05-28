import { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center md:p-8 relative overflow-hidden">
      {/* ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] rounded-full opacity-20 blur-3xl" style={{ background: "var(--grad-coral)" }} />
        <div className="absolute -bottom-40 -right-40 w-[40rem] h-[40rem] rounded-full opacity-15 blur-3xl" style={{ background: "var(--grad-teal)" }} />
      </div>

      {/* phone */}
      <div className="relative w-full md:w-[420px] md:h-[860px] h-screen md:rounded-[3rem] overflow-hidden md:border md:border-white/10 md:shadow-float bg-background">
        <div className="absolute inset-0 overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  );
}
