import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/site-config";

export function WhatsAppFab() {
  return (
    <a
      href={buildWhatsAppUrl("Olá! Gostaria de mais informações.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[oklch(0.65_0.17_152)] text-white shadow-elegant hover:scale-110 transition-transform"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="absolute inset-0 rounded-full bg-[oklch(0.65_0.17_152)]/40 animate-ping" />
    </a>
  );
}