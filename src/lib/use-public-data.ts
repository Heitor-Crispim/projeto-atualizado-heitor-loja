import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getPublicData } from "@/lib/data/public.functions";
import type { Brand, Category, ContactSettings, Product } from "@/lib/data/types";

const DEFAULT_CONTACT: ContactSettings = {
  name: "Marcio Alegre",
  tagline: "Plásticos, Revestimentos & Decoração",
  whatsapp: "5511947610083",
  whatsappDisplay: "(11) 94761-0083",
  email: "contato@marcioalegre.com.br",
  address: "Av. Rangel Pestana, 1563 — São Paulo / SP",
  hours: "Segunda a Sábado, 08:00 às 17:00",
  mapsQuery: "Av. Rangel Pestana, 1563, São Paulo",
  instagram: "",
  facebook: "",
};

export function buildWhatsAppUrl(message: string, whatsapp = DEFAULT_CONTACT.whatsapp) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}

export function usePublicData() {
  const fn = useServerFn(getPublicData);
  return useQuery({
    queryKey: ["public-data"],
    queryFn: () => fn(),
    staleTime: 30_000,
    placeholderData: {
      categories: [] as Category[],
      brands: [] as Brand[],
      products: [] as Product[],
      contact: DEFAULT_CONTACT,
    },
  });
}

export function useSiteContact(): ContactSettings {
  const { data } = usePublicData();
  return data?.contact ?? DEFAULT_CONTACT;
}
