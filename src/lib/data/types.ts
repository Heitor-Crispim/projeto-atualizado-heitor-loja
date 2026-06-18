// Shared DTO types for catalog (DB-backed). Mirror legacy catalog.ts shape.
export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  active: boolean;
  sort_order: number;
};

export type Brand = {
  id: string;
  name: string;
  logo_url: string | null;
  sort_order: number;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  code: string;
  color: string;
  hex: string;
  image: string | null;
  thickness: string | null;
  width: string | null;
  sale_unit: string | null;
  sort_order: number;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  kind: "main" | "gallery" | "application" | string;
  caption: string | null;
  sort_order: number;
};

export type ProductSpec = {
  id: string;
  product_id: string;
  label: string;
  value: string;
  sort_order: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  code: string;
  category_id: string | null;
  short_description: string;
  description: string;
  image: string;
  applications: string[];
  purposes: string[];
  sizes: string[];
  thickness: string | null;
  material: string | null;
  width: string | null;
  length: string | null;
  finish: string | null;
  type_of_use: string | null;
  resistance: string | null;
  thickness_options: string[];
  width_options: string[];
  sale_unit_options: string[];
  active: boolean;
  sort_order: number;
  // joined
  category_slug?: string;
  category_name?: string;
  variants?: ProductVariant[];
  images?: ProductImage[];
  specs?: ProductSpec[];
};

export type ContactSettings = {
  name: string;
  tagline: string;
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  address: string;
  hours: string;
  mapsQuery: string;
  instagram: string;
  facebook: string;
};
