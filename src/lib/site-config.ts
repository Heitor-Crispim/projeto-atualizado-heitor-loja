// Static defaults — overridden at runtime by the admin via Lovable Cloud.
// Used as fallback when DB hasn't loaded yet. Live values come from
// `useSiteContact()` in `@/lib/use-public-data`.
export const siteConfig = {
  name: "Marcio Alegre",
  tagline: "Plásticos, Revestimentos & Decoração",
  whatsapp: "5511947610083",
  whatsappDisplay: "(11) 94761-0083",
  email: "contato@marcioalegre.com.br",
  address: "Av. Rangel Pestana, 1563 — São Paulo / SP",
  hours: "Segunda a Sábado, 08:00 às 17:00",
  mapsQuery: "Av. Rangel Pestana, 1563, São Paulo",
};

// Mutable runtime override (set by __root once public-data loads).
let _runtimeWhatsapp = siteConfig.whatsapp;
export function setRuntimeWhatsapp(num: string) { if (num) _runtimeWhatsapp = num; }

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${_runtimeWhatsapp}?text=${encodeURIComponent(message)}`;
}
