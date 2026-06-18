import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { ADMIN_EMAIL } from "@/lib/admin-config";

async function requireAdmin(_supabase: any, userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: authUser, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
  const email = authUser.user?.email?.toLowerCase() ?? "";
  if (userError || email !== ADMIN_EMAIL) throw new Error("Forbidden: admin email required");
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("email", ADMIN_EMAIL)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden: admin role required");
}

// ================= DASHBOARD =================
export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [p, c, b, i, recent] = await Promise.all([
      supabaseAdmin.from("products").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("categories").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("brands").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("product_images").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("products")
        .select("id, name, slug, image, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);
    return {
      products: p.count ?? 0,
      categories: c.count ?? 0,
      brands: b.count ?? 0,
      images: i.count ?? 0,
      recent: recent.data ?? [],
    };
  });

// ================= ADMIN LIST READS (incl. inactive) =================
export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("products")
      .select("*, category:categories(slug, name)")
      .order("sort_order");
    return (data ?? []).map((p: any) => ({
      ...p,
      category_name: p.category?.name,
      category_slug: p.category?.slug,
    }));
  });

export const adminGetProduct = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: p } = await supabaseAdmin.from("products").select("*").eq("id", data.id).maybeSingle();
    if (!p) throw new Error("Produto não encontrado");
    const [{ data: variants }, { data: images }, { data: specs }] = await Promise.all([
      supabaseAdmin.from("product_variants").select("*").eq("product_id", data.id).order("sort_order"),
      supabaseAdmin.from("product_images").select("*").eq("product_id", data.id).order("sort_order"),
      supabaseAdmin.from("product_specs").select("*").eq("product_id", data.id).order("sort_order"),
    ]);
    return { product: p, variants: variants ?? [], images: images ?? [], specs: specs ?? [] };
  });

// ================= PRODUCT CRUD =================
const productSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(200),
  name: z.string().min(1).max(300),
  code: z.string().max(80).default(""),
  category_id: z.string().uuid().nullable(),
  short_description: z.string().max(500).default(""),
  description: z.string().max(5000).default(""),
  image: z.string().max(2000).default(""),
  applications: z.array(z.string()).default([]),
  purposes: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  thickness: z.string().max(200).nullable().optional(),
  material: z.string().max(300).nullable().optional(),
  width: z.string().max(100).nullable().optional(),
  length: z.string().max(200).nullable().optional(),
  finish: z.string().max(200).nullable().optional(),
  type_of_use: z.string().max(200).nullable().optional(),
  resistance: z.string().max(300).nullable().optional(),
  thickness_options: z.array(z.string()).default([]),
  width_options: z.array(z.string()).default([]),
  sale_unit_options: z.array(z.string()).default([]),
  active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export const upsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => productSchema.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.id) {
      const { id, ...rest } = data;
      const { error } = await supabaseAdmin.from("products").update(rest).eq("id", id);
      if (error) throw error;
      return { id };
    }
    const { data: row, error } = await supabaseAdmin.from("products").insert(data).select("id").single();
    if (error) throw error;
    return { id: row!.id };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const toggleProductActive = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; active: boolean }) =>
    z.object({ id: z.string().uuid(), active: z.boolean() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("products").update({ active: data.active }).eq("id", data.id);
    return { ok: true };
  });

// ================= VARIANTS / IMAGES / SPECS bulk replace =================
const variantSchema = z.object({
  code: z.string().max(80).default(""),
  color: z.string().max(120).default(""),
  hex: z.string().max(20).default("#999999"),
  image: z.string().max(2000).nullable().optional(),
  thickness: z.string().max(100).nullable().optional(),
  width: z.string().max(100).nullable().optional(),
  sale_unit: z.string().max(100).nullable().optional(),
  sort_order: z.number().int().default(0),
});

export const replaceVariants = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { product_id: string; variants: unknown[] }) =>
    z.object({
      product_id: z.string().uuid(),
      variants: z.array(variantSchema),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("product_variants").delete().eq("product_id", data.product_id);
    if (data.variants.length) {
      const rows = data.variants.map((v, i) => ({ ...v, product_id: data.product_id, sort_order: i }));
      const { error } = await supabaseAdmin.from("product_variants").insert(rows);
      if (error) throw error;
    }
    return { ok: true };
  });

const imageSchema = z.object({
  url: z.string().min(1).max(2000),
  kind: z.string().max(40).default("gallery"),
  caption: z.string().max(300).nullable().optional(),
  sort_order: z.number().int().default(0),
});

export const replaceImages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { product_id: string; images: unknown[] }) =>
    z.object({
      product_id: z.string().uuid(),
      images: z.array(imageSchema),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("product_images").delete().eq("product_id", data.product_id);
    if (data.images.length) {
      const rows = data.images.map((v, i) => ({ ...v, product_id: data.product_id, sort_order: i }));
      const { error } = await supabaseAdmin.from("product_images").insert(rows);
      if (error) throw error;
    }
    return { ok: true };
  });

const specSchema = z.object({
  label: z.string().min(1).max(120),
  value: z.string().max(500).default(""),
});

export const replaceSpecs = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { product_id: string; specs: unknown[] }) =>
    z.object({
      product_id: z.string().uuid(),
      specs: z.array(specSchema),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("product_specs").delete().eq("product_id", data.product_id);
    if (data.specs.length) {
      const rows = data.specs.map((v, i) => ({ ...v, product_id: data.product_id, sort_order: i }));
      const { error } = await supabaseAdmin.from("product_specs").insert(rows);
      if (error) throw error;
    }
    return { ok: true };
  });

// ================= CATEGORIES =================
const categorySchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(120),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).default(""),
  active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export const adminListCategories = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.from("categories").select("*").order("sort_order");
    return data ?? [];
  });

export const upsertCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => categorySchema.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.id) {
      const { id, ...rest } = data;
      const { error } = await supabaseAdmin.from("categories").update(rest).eq("id", id);
      if (error) throw error;
      return { id };
    }
    const { data: row, error } = await supabaseAdmin.from("categories").insert(data).select("id").single();
    if (error) throw error;
    return { id: row!.id };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("categories").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ================= BRANDS =================
const brandSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(120),
  logo_url: z.string().max(2000).nullable().optional(),
  sort_order: z.number().int().default(0),
});

export const adminListBrands = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.from("brands").select("*").order("sort_order");
    return data ?? [];
  });

export const upsertBrand = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => brandSchema.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.id) {
      const { id, ...rest } = data;
      const { error } = await supabaseAdmin.from("brands").update(rest).eq("id", id);
      if (error) throw error;
      return { id };
    }
    const { data: row, error } = await supabaseAdmin.from("brands").insert(data).select("id").single();
    if (error) throw error;
    return { id: row!.id };
  });

export const deleteBrand = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("brands").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

// ================= SITE SETTINGS =================
const contactSchema = z.object({
  name: z.string().max(200),
  tagline: z.string().max(300),
  whatsapp: z.string().max(30),
  whatsappDisplay: z.string().max(40),
  email: z.string().email().max(200),
  address: z.string().max(500),
  hours: z.string().max(200),
  mapsQuery: z.string().max(500),
  instagram: z.string().max(300),
  facebook: z.string().max(300),
});

export const updateContactSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => contactSchema.parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("site_settings")
      .upsert({ key: "contact", value: data, updated_at: new Date().toISOString() });
    if (error) throw error;
    return { ok: true };
  });

// ================= IMAGE UPLOAD via signed URL =================
export const createUploadUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { filename: string; contentType?: string }) =>
    z.object({
      filename: z.string().min(1).max(300),
      contentType: z.string().max(200).optional(),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const safe = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${context.userId}/${Date.now()}-${safe}`;
    const { data: signed, error } = await supabaseAdmin.storage
      .from("product-images")
      .createSignedUploadUrl(path);
    if (error || !signed) throw error ?? new Error("Falha ao gerar upload");
    return { uploadUrl: signed.signedUrl, token: signed.token, path };
  });

// Resolve a stored path/url to a signed URL for private bucket access.
export const getSignedImageUrl = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { path: string }) => z.object({ path: z.string() }).parse(d))
  .handler(async ({ context, data }) => {
    await requireAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed } = await supabaseAdmin.storage
      .from("product-images")
      .createSignedUrl(data.path, 60 * 60 * 24 * 365 * 10);
    return { url: signed?.signedUrl ?? null };
  });
