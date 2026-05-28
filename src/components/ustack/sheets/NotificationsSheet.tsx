import { Sheet } from "./Sheet";
import { notifications } from "@/lib/ustack-data";
import { Trophy, ArrowDownToLine, ShieldCheck, Sparkles, AlertTriangle } from "lucide-react";

const iconMap = {
  milestone: Trophy, deposit: ArrowDownToLine, protection: ShieldCheck,
  summary: Sparkles, warning: AlertTriangle,
} as const;
const gradMap = {
  milestone: "grad-mint", deposit: "grad-coral", protection: "grad-teal",
  summary: "grad-btc", warning: "grad-coral",
} as const;

export function NotificationsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} title="Notifications">
      <div className="flex flex-col gap-2">
        {notifications.map((n) => {
          const Icon = iconMap[n.kind];
          return (
            <div key={n.id} className="rounded-2xl bg-card/60 p-4 flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl ${gradMap[n.kind]} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5 text-background" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold">{n.title}</div>
                  {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.body}</div>
                <div className="text-[10px] text-muted-foreground/70 mt-1">{n.when}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}
