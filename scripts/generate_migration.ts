import * as fs from 'fs';
import * as path from 'path';

const scratchDir = 'C:\\Users\\heito\\.gemini\\antigravity-ide\\brain\\4bcf6957-44ad-4ce7-8e76-6ebcc62e0df5\\scratch';
const dumpPath = path.join(scratchDir, 'source_dump.json');
const migrationPath = path.join(scratchDir, 'migration.sql');
const rollbackPath = path.join(scratchDir, 'rollback.sql');

function pgEscapeString(val: string): string {
  return "'" + val.replace(/'/g, "''") + "'";
}

function formatValue(val: any, type?: string): string {
  if (val === null || val === undefined) {
    return 'NULL';
  }
  if (typeof val === 'boolean') {
    return val ? 'true' : 'false';
  }
  if (typeof val === 'number') {
    return val.toString();
  }
  if (Array.isArray(val)) {
    if (val.length === 0) {
      return 'ARRAY[]::text[]';
    }
    const escapedItems = val.map(item => pgEscapeString(item.toString()));
    return `ARRAY[${escapedItems.join(', ')}]::text[]`;
  }
  if (typeof val === 'object') {
    return pgEscapeString(JSON.stringify(val)) + '::jsonb';
  }
  return pgEscapeString(val.toString());
}

async function main() {
  if (!fs.existsSync(dumpPath)) {
    console.error('Source dump file not found at', dumpPath);
    process.exit(1);
  }

  const dump = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));

  let sql = `-- ==========================================
-- COMPLETE MIGRATION SCRIPT FOR NEW SUPABASE
-- TARGET: rllgmuynrrgznccyjqin
-- PRESERVES ALL ORIGINAL UUIDS
-- ==========================================

-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

-- 1. Create Enums and Types
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typnamespace = 'public'::regnamespace AND typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin');
  END IF;
END $$;

-- 2. Create Tables
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  email text NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_roles_one_role_per_user UNIQUE (user_id, role),
  CONSTRAINT user_roles_admin_email_only CHECK (lower(email) = 'heitor160289@icloud.com')
);

CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  code text NOT NULL DEFAULT '',
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  short_description text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  applications text[] NOT NULL DEFAULT '{}',
  purposes text[] NOT NULL DEFAULT '{}',
  sizes text[] NOT NULL DEFAULT '{}',
  thickness text,
  material text,
  width text,
  length text,
  finish text,
  type_of_use text,
  resistance text,
  thickness_options text[] NOT NULL DEFAULT '{}',
  width_options text[] NOT NULL DEFAULT '{}',
  sale_unit_options text[] NOT NULL DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  code text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT '',
  hex text NOT NULL DEFAULT '#999999',
  image text,
  thickness text,
  width text,
  sale_unit text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url text NOT NULL,
  kind text NOT NULL DEFAULT 'gallery',
  caption text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_specs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  label text NOT NULL,
  value text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Create Functions & Triggers
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND lower(email) = 'heitor160289@icloud.com'
  )
$$;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS tr_categories_updated ON public.categories;
CREATE TRIGGER tr_categories_updated BEFORE UPDATE ON public.categories 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tr_brands_updated ON public.brands;
CREATE TRIGGER tr_brands_updated BEFORE UPDATE ON public.brands 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tr_products_updated ON public.products;
CREATE TRIGGER tr_products_updated BEFORE UPDATE ON public.products 
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 5. Create Security Policies
-- user_roles policies
DROP POLICY IF EXISTS "auth can read own roles" ON public.user_roles;
CREATE POLICY "auth can read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id AND lower(email) = 'heitor160289@icloud.com');

-- categories policies
DROP POLICY IF EXISTS "public read categories" ON public.categories;
CREATE POLICY "public read categories" ON public.categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "admin write categories" ON public.categories;
CREATE POLICY "admin write categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- brands policies
DROP POLICY IF EXISTS "public read brands" ON public.brands;
CREATE POLICY "public read brands" ON public.brands FOR SELECT USING (true);
DROP POLICY IF EXISTS "admin write brands" ON public.brands;
CREATE POLICY "admin write brands" ON public.brands FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- products policies
DROP POLICY IF EXISTS "public read active products" ON public.products;
CREATE POLICY "public read active products" ON public.products FOR SELECT USING (active = true);
DROP POLICY IF EXISTS "admin read all products" ON public.products;
CREATE POLICY "admin read all products" ON public.products FOR SELECT TO authenticated 
  USING (public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "admin write products" ON public.products;
CREATE POLICY "admin write products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- product_variants policies
DROP POLICY IF EXISTS "public read variants" ON public.product_variants;
CREATE POLICY "public read variants" ON public.product_variants FOR SELECT USING (true);
DROP POLICY IF EXISTS "admin write variants" ON public.product_variants;
CREATE POLICY "admin write variants" ON public.product_variants FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- product_images policies
DROP POLICY IF EXISTS "public read images" ON public.product_images;
CREATE POLICY "public read images" ON public.product_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "admin write images" ON public.product_images;
CREATE POLICY "admin write images" ON public.product_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- product_specs policies
DROP POLICY IF EXISTS "public read specs" ON public.product_specs;
CREATE POLICY "public read specs" ON public.product_specs FOR SELECT USING (true);
DROP POLICY IF EXISTS "admin write specs" ON public.product_specs;
CREATE POLICY "admin write specs" ON public.product_specs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- site_settings policies
DROP POLICY IF EXISTS "public read settings" ON public.site_settings;
CREATE POLICY "public read settings" ON public.site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "admin write settings" ON public.site_settings;
CREATE POLICY "admin write settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 6. Setup storage bucket 'product-images' and its policies
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product-images', 'product-images', true, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public read product images" ON storage.objects;
CREATE POLICY "public read product images" ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "admin read product-images" ON storage.objects;
CREATE POLICY "admin read product-images" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "admin upload product-images" ON storage.objects;
CREATE POLICY "admin upload product-images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "admin update product-images" ON storage.objects;
CREATE POLICY "admin update product-images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "admin delete product-images" ON storage.objects;
CREATE POLICY "admin delete product-images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- Revoke execute from public
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- Grants to roles
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
GRANT SELECT ON public.brands TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.brands TO authenticated;
GRANT ALL ON public.brands TO service_role;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
GRANT SELECT ON public.product_variants TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_variants TO authenticated;
GRANT ALL ON public.product_variants TO service_role;
GRANT SELECT ON public.product_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_images TO authenticated;
GRANT ALL ON public.product_images TO service_role;
GRANT SELECT ON public.product_specs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_specs TO authenticated;
GRANT ALL ON public.product_specs TO service_role;
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

-- Indexing
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_images_product ON public.product_images(product_id);

-- ==========================================
-- DATA INSERTS (PRESERVING UUIDs)
-- ==========================================
`;

  // Insert categories
  if (dump.categories && dump.categories.length > 0) {
    sql += `\n-- Categories (${dump.categories.length} rows)\n`;
    dump.categories.forEach((c: any) => {
      sql += `INSERT INTO public.categories (id, slug, name, description, active, sort_order, created_at, updated_at) VALUES (${formatValue(c.id)}, ${formatValue(c.slug)}, ${formatValue(c.name)}, ${formatValue(c.description)}, ${formatValue(c.active)}, ${formatValue(c.sort_order)}, ${formatValue(c.created_at)}, ${formatValue(c.updated_at)}) ON CONFLICT (id) DO NOTHING;\n`;
    });
  }

  // Insert brands
  if (dump.brands && dump.brands.length > 0) {
    sql += `\n-- Brands (${dump.brands.length} rows)\n`;
    dump.brands.forEach((b: any) => {
      sql += `INSERT INTO public.brands (id, name, logo_url, sort_order, created_at, updated_at) VALUES (${formatValue(b.id)}, ${formatValue(b.name)}, ${formatValue(b.logo_url)}, ${formatValue(b.sort_order)}, ${formatValue(b.created_at)}, ${formatValue(b.updated_at)}) ON CONFLICT (id) DO NOTHING;\n`;
    });
  }

  // Insert products
  if (dump.products && dump.products.length > 0) {
    sql += `\n-- Products (${dump.products.length} rows)\n`;
    dump.products.forEach((p: any) => {
      sql += `INSERT INTO public.products (id, slug, name, code, category_id, short_description, description, image, applications, purposes, sizes, thickness, material, width, length, finish, type_of_use, resistance, thickness_options, width_options, sale_unit_options, active, sort_order, created_at, updated_at) VALUES (${formatValue(p.id)}, ${formatValue(p.slug)}, ${formatValue(p.name)}, ${formatValue(p.code)}, ${formatValue(p.category_id)}, ${formatValue(p.short_description)}, ${formatValue(p.description)}, ${formatValue(p.image)}, ${formatValue(p.applications)}, ${formatValue(p.purposes)}, ${formatValue(p.sizes)}, ${formatValue(p.thickness)}, ${formatValue(p.material)}, ${formatValue(p.width)}, ${formatValue(p.length)}, ${formatValue(p.finish)}, ${formatValue(p.type_of_use)}, ${formatValue(p.resistance)}, ${formatValue(p.thickness_options)}, ${formatValue(p.width_options)}, ${formatValue(p.sale_unit_options)}, ${formatValue(p.active)}, ${formatValue(p.sort_order)}, ${formatValue(p.created_at)}, ${formatValue(p.updated_at)}) ON CONFLICT (id) DO NOTHING;\n`;
    });
  }

  // Insert product_variants
  if (dump.product_variants && dump.product_variants.length > 0) {
    sql += `\n-- Product Variants (${dump.product_variants.length} rows)\n`;
    dump.product_variants.forEach((v: any) => {
      sql += `INSERT INTO public.product_variants (id, product_id, code, color, hex, image, thickness, width, sale_unit, sort_order, created_at) VALUES (${formatValue(v.id)}, ${formatValue(v.product_id)}, ${formatValue(v.code)}, ${formatValue(v.color)}, ${formatValue(v.hex)}, ${formatValue(v.image)}, ${formatValue(v.thickness)}, ${formatValue(v.width)}, ${formatValue(v.sale_unit)}, ${formatValue(v.sort_order)}, ${formatValue(v.created_at)}) ON CONFLICT (id) DO NOTHING;\n`;
    });
  }

  // Insert product_images
  if (dump.product_images && dump.product_images.length > 0) {
    sql += `\n-- Product Images (${dump.product_images.length} rows)\n`;
    dump.product_images.forEach((img: any) => {
      sql += `INSERT INTO public.product_images (id, product_id, url, kind, caption, sort_order, created_at) VALUES (${formatValue(img.id)}, ${formatValue(img.product_id)}, ${formatValue(img.url)}, ${formatValue(img.kind)}, ${formatValue(img.caption)}, ${formatValue(img.sort_order)}, ${formatValue(img.created_at)}) ON CONFLICT (id) DO NOTHING;\n`;
    });
  }

  // Insert product_specs
  if (dump.product_specs && dump.product_specs.length > 0) {
    sql += `\n-- Product Specs (${dump.product_specs.length} rows)\n`;
    dump.product_specs.forEach((spec: any) => {
      sql += `INSERT INTO public.product_specs (id, product_id, label, value, sort_order) VALUES (${formatValue(spec.id)}, ${formatValue(spec.product_id)}, ${formatValue(spec.label)}, ${formatValue(spec.value)}, ${formatValue(spec.sort_order)}) ON CONFLICT (id) DO NOTHING;\n`;
    });
  }

  // Insert site_settings
  if (dump.site_settings && dump.site_settings.length > 0) {
    sql += `\n-- Site Settings (${dump.site_settings.length} rows)\n`;
    dump.site_settings.forEach((s: any) => {
      sql += `INSERT INTO public.site_settings (key, value, updated_at) VALUES (${formatValue(s.key)}, ${formatValue(s.value)}, ${formatValue(s.updated_at)}) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at;\n`;
    });
  }

  fs.writeFileSync(migrationPath, sql);
  console.log('Migration SQL generated at', migrationPath);

  // Generate rollback SQL script
  const rollbackSql = `-- ==========================================
-- ROLLBACK PLAN FOR NEW SUPABASE
-- TARGET: rllgmuynrrgznccyjqin
-- ==========================================

DROP TRIGGER IF EXISTS tr_categories_updated ON public.categories;
DROP TRIGGER IF EXISTS tr_brands_updated ON public.brands;
DROP TRIGGER IF EXISTS tr_products_updated ON public.products;

DROP FUNCTION IF EXISTS public.set_updated_at();
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

DROP TABLE IF EXISTS public.product_specs CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.product_variants CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.brands CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;

-- Delete storage policy references
DELETE FROM storage.policies WHERE bucket_id = 'product-images';
DELETE FROM storage.buckets WHERE id = 'product-images';

DROP TYPE IF EXISTS public.app_role CASCADE;
`;

  fs.writeFileSync(rollbackPath, rollbackSql);
  console.log('Rollback SQL generated at', rollbackPath);
}

main().catch(console.error);
