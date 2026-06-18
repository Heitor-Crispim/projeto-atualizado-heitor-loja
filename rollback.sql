-- ==========================================
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
