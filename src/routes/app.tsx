import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/ustack/AppShell";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "UStack — Your Vaults" },
      { name: "description", content: "Track your Bitcoin savings vaults, deposits, and progress." },
    ],
  }),
  component: AppShell,
});
