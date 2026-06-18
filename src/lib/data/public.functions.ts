import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Brand, Category, ContactSettings, Product } from "./types";

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

async function ensureSeeded() {
  // Seed requires SUPABASE_SERVICE_ROLE_KEY; skip when unavailable.
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  const { seedCatalogIfEmpty } = await import("./seed.server");
  try { await seedCatalogIfEmpty(); } catch (e) { console.error("seed error", e); }
}

export const getPublicData = createServerFn({ method: "GET" }).handler(
  async (): Promise<{
    categories: Category[];
    brands: Brand[];
    products: Product[];
    contact: ContactSettings;
  }> => {
    await ensureSeeded();
    const { getSupabasePublicServer } = await import("@/integrations/supabase/public-server");
    const supabaseAdmin = getSupabasePublicServer();

    const [{ data: cats }, { data: brands }, { data: prods }, { data: variants }, { data: settings }] =
      await Promise.all([
        supabaseAdmin.from("categories").select("*").eq("active", true).order("sort_order"),
        supabaseAdmin.from("brands").select("*").order("sort_order"),
        supabaseAdmin
          .from("products")
          .select("*, category:categories(slug, name)")
          .eq("active", true)
          .order("sort_order"),
        supabaseAdmin.from("product_variants").select("*").order("sort_order"),
        supabaseAdmin.from("site_settings").select("*").eq("key", "contact").maybeSingle(),
      ]);

    const variantsByProduct = new Map<string, typeof variants>();
    (variants ?? []).forEach((v) => {
      const arr = variantsByProduct.get(v.product_id) ?? [];
      arr.push(v);
      variantsByProduct.set(v.product_id, arr);
    });

    const products: Product[] = (prods ?? []).map((p: any) => ({
      ...p,
      category_slug: p.category?.slug,
      category_name: p.category?.name,
      variants: variantsByProduct.get(p.id) ?? [],
    }));

    const contact: ContactSettings = {
      ...DEFAULT_CONTACT,
      ...(settings?.value as Partial<ContactSettings> | undefined),
    };

    return {
      categories: (cats ?? []) as Category[],
      brands: (brands ?? []) as Brand[],
      products,
      contact,
    };
  },
);

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    await ensureSeeded();
    const { getSupabasePublicServer } = await import("@/integrations/supabase/public-server");
    const supabaseAdmin = getSupabasePublicServer();
    const { data: prod } = await supabaseAdmin
      .from("products")
      .select("*, category:categories(slug, name)")
      .eq("slug", data.slug)
      .eq("active", true)
      .maybeSingle();
    if (!prod) return null;
    const [{ data: variants }, { data: images }, { data: specs }] = await Promise.all([
      supabaseAdmin.from("product_variants").select("*").eq("product_id", prod.id).order("sort_order"),
      supabaseAdmin.from("product_images").select("*").eq("product_id", prod.id).order("sort_order"),
      supabaseAdmin.from("product_specs").select("*").eq("product_id", prod.id).order("sort_order"),
    ]);
    return {
      ...(prod as any),
      category_slug: (prod as any).category?.slug,
      category_name: (prod as any).category?.name,
      variants: variants ?? [],
      images: images ?? [],
      specs: specs ?? [],
    } as Product;
  });
