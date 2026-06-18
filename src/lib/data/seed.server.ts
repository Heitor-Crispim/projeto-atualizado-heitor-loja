// Server-only: seeds DB from the legacy static catalog when empty.
// Loaded inside server fn handlers via dynamic import.
import { products as staticProducts, categories as staticCategories } from "@/lib/catalog";

export async function seedCatalogIfEmpty() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count } = await supabaseAdmin
    .from("products")
    .select("id", { count: "exact", head: true });
  if ((count ?? 0) > 0) return false;

  // Categories
  const catRows = staticCategories.map((c, i) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    active: true,
    sort_order: i,
  }));
  const { data: insertedCats, error: catErr } = await supabaseAdmin
    .from("categories")
    .insert(catRows)
    .select("id, slug");
  if (catErr) throw catErr;
  const catMap = new Map(insertedCats!.map((c) => [c.slug, c.id]));

  // Brands (carousel defaults)
  const brandNames = [
    "Romplas", "CristalMax", "DecorFlex", "VinilArt",
    "RevestPrime", "CasaPlast", "TêxtilPro", "Nobreplast",
  ];
  await supabaseAdmin.from("brands").insert(
    brandNames.map((name, i) => ({ name, logo_url: null, sort_order: i })),
  );

  // Products
  for (let i = 0; i < staticProducts.length; i++) {
    const p = staticProducts[i];
    const { data: prodIns, error: prodErr } = await supabaseAdmin
      .from("products")
      .insert({
        slug: p.slug,
        name: p.name,
        code: p.code ?? "",
        category_id: catMap.get(p.category) ?? null,
        short_description: p.shortDescription ?? "",
        description: p.description ?? "",
        image: p.image ?? "",
        applications: p.applications ?? [],
        purposes: p.purposes ?? [],
        sizes: p.sizes ?? [],
        thickness: p.thickness ?? null,
        material: p.material ?? null,
        width: p.width ?? null,
        length: p.length ?? null,
        finish: p.finish ?? null,
        type_of_use: p.typeOfUse ?? null,
        resistance: p.resistance ?? null,
        thickness_options: p.thicknessOptions ?? [],
        width_options: p.widthOptions ?? [],
        sale_unit_options: p.saleUnitOptions ?? [],
        active: true,
        sort_order: i,
      })
      .select("id")
      .single();
    if (prodErr) throw prodErr;
    const pid = prodIns!.id;

    if (p.variants && p.variants.length) {
      await supabaseAdmin.from("product_variants").insert(
        p.variants.map((v, vi) => ({
          product_id: pid,
          code: v.code,
          color: v.color,
          hex: v.hex,
          image: v.image ?? null,
          sort_order: vi,
        })),
      );
    }
    if (p.applicationImages && p.applicationImages.length) {
      await supabaseAdmin.from("product_images").insert(
        p.applicationImages.map((img, ii) => ({
          product_id: pid,
          url: img.url,
          kind: "application",
          caption: img.caption,
          sort_order: ii,
        })),
      );
    }
  }
  return true;
}
