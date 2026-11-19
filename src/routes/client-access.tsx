import { createFileRoute } from "@tanstack/react-router";
import { NempoShell } from "@/components/nempo-shell";

export const Route = createFileRoute("/client-access")({
  head: () => ({
    meta: [
      { title: "Client Access — Web Klien Nempo" },
      { name: "description", content: "Akses ke web-web klien yang dibuat tim Nempo." },
      { property: "og:title", content: "Client Access — Web Klien Nempo" },
      { property: "og:description", content: "Web klien buatan Nempo, dikumpulkan di satu halaman." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NempoShell,
});
