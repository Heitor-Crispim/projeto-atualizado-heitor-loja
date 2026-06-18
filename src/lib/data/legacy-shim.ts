import type { Product as DBProduct } from "@/lib/data/types";
import type { Product as LegacyProduct, Category as LegacyCategory } from "@/lib/catalog";
import type { Brand as DBBrand, Category as DBCategory } from "@/lib/data/types";

export function toLegacyProduct(p: DBProduct): LegacyProduct {
  return {
    id: p.id,
    slug: p.slug,
    code: p.code || (p.variants?.[0]?.code ?? ""),
    name: p.name,
    category: p.category_slug ?? "",
    shortDescription: p.short_description,
    description: p.description,
    image: p.image,
    sizes: p.sizes ?? [],
    colors: p.variants?.map((v) => v.color) ?? [],
    thickness: p.thickness ?? undefined,
    material: p.material ?? undefined,
    applications: p.applications ?? [],
    width: p.width ?? undefined,
    length: p.length ?? undefined,
    finish: p.finish ?? undefined,
    typeOfUse: p.type_of_use ?? undefined,
    resistance: p.resistance ?? undefined,
    purposes: p.purposes ?? [],
    applicationImages: (p.images ?? [])
      .filter((i) => i.kind === "application")
      .map((i) => ({ url: i.url, caption: i.caption ?? "" })),
    variants: (p.variants ?? []).map((v) => ({
      code: v.code,
      color: v.color,
      hex: v.hex,
      image: v.image ?? undefined,
    })),
    thicknessOptions: p.thickness_options ?? [],
    widthOptions: p.width_options ?? [],
    saleUnitOptions: p.sale_unit_options ?? [],
  };
}

export function toLegacyCategory(c: DBCategory): LegacyCategory {
  return { slug: c.slug, name: c.name, description: c.description };
}

export function legacyBrandNames(brands: DBBrand[]): string[] {
  return brands.map((b) => b.name);
}
