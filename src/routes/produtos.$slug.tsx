import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { ProductCard } from "@/components/site/ProductCard";
import type { Product } from "@/lib/catalog";
import { getProductBySlug } from "@/lib/data/public.functions";
import { getPublicData } from "@/lib/data/public.functions";
import { toLegacyProduct, toLegacyCategory } from "@/lib/data/legacy-shim";
import { addToQuote } from "@/lib/quote-store";
import { buildWhatsAppUrl } from "@/lib/site-config";
import { MessageCircle, Plus, Minus, Check, ChevronRight, Palette, Ruler, Store, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/produtos/$slug")({
  loader: async ({ params }) => {
    const dbProduct = await getProductBySlug({ data: { slug: params.slug } });
    if (!dbProduct) throw notFound();
    return { product: toLegacyProduct(dbProduct as any) };
  },
  head: ({ params, loaderData }: { params: { slug: string }; loaderData?: { product: Product } }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} | Marcio Alegre` : "Produto — Marcio Alegre";
    const desc = p
      ? `${p.shortDescription || `Conheça ${p.name} da Marcio Alegre.`} Solicite orçamento via WhatsApp.`
      : "";
    const url = `/produtos/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
        { property: "og:image", content: p?.image ?? "" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: p?.image ?? "" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: p ? [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          description: p.shortDescription || p.description,
          sku: p.code,
          image: p.image,
          brand: { "@type": "Brand", name: "Marcio Alegre" },
        }),
      }] : [],
    };
  },
  component: ProductPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center p-6 text-center">
      <p className="text-sm text-muted-foreground">Não foi possível carregar este produto: {error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold">Produto não encontrado</h1>
        <Link to="/produtos" className="mt-4 inline-block text-brand underline">Voltar ao catálogo</Link>
      </div>
    </div>
  ),
});


function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const allFn = useServerFn(getPublicData);
  const { data: all } = useQuery({ queryKey: ["public-data"], queryFn: () => allFn() });
  const category = (all?.categories ?? []).map(toLegacyCategory).find((c) => c.slug === product.category);
  const related = (all?.products ?? [])
    .map(toLegacyProduct)
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const [qty, setQty] = useState(1);
  const [variantIdx, setVariantIdx] = useState(0);
  const [size, setSize] = useState(product.sizes[0]);
  const [thickness, setThickness] = useState(product.thicknessOptions?.[0]);
  const [widthOpt, setWidthOpt] = useState(product.widthOptions?.[0]);
  const [saleUnit, setSaleUnit] = useState(product.saleUnitOptions?.[0]);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const hasAdvancedOptions = Boolean(
    product.thicknessOptions?.length ||
      product.widthOptions?.length ||
      product.saleUnitOptions?.length,
  );

  // Reset state when product changes
  useEffect(() => {
    setVariantIdx(0);
    setSize(product.sizes[0]);
    setThickness(product.thicknessOptions?.[0]);
    setWidthOpt(product.widthOptions?.[0]);
    setSaleUnit(product.saleUnitOptions?.[0]);
    setQty(1);
  }, [product.id]);

  // Derived state — always in sync with selected variant
  const activeVariant = product.variants?.[variantIdx];
  const currentColor = activeVariant?.color ?? product.colors[0];
  const baseCode = activeVariant?.code ?? product.code;
  const currentImage = activeVariant?.image ?? product.image;

  // Abreviação dinâmica do código conforme as variações selecionadas
  const abbr = (s: string) => s.replace(/\s+/g, "").toUpperCase();
  const saleUnitAbbr: Record<string, string> = {
    "Metro Linear": "ML",
    "Rolo Fechado": "RF",
    "Bobina 10m": "B10",
    "Bobina 25m": "B25",
    "Sob medida": "SM",
  };
  const codeSuffix = [
    thickness ? abbr(thickness) : null,
    widthOpt ? `L${abbr(widthOpt)}` : null,
    saleUnit ? saleUnitAbbr[saleUnit] ?? abbr(saleUnit) : null,
  ]
    .filter(Boolean)
    .join("-");
  const currentCode = codeSuffix ? `${baseCode}-${codeSuffix}` : baseCode;

  const totalColors =
    product.variants && product.variants.length > 0
      ? product.variants.length
      : product.colors.length;

  const isRollOrLinear = product.sizes.some((s) =>
    s.toLowerCase().includes("rolo") ||
    s.toLowerCase().includes("metro") ||
    s.toLowerCase().includes("bobina") ||
    s.toLowerCase().includes("corte")
  );

  const selectionParts = [
    thickness && `Espessura ${thickness}`,
    widthOpt && `Largura ${widthOpt}`,
    saleUnit && `Venda ${saleUnit}`,
    !hasAdvancedOptions && size,
  ].filter(Boolean) as string[];
  const selectionLabel = selectionParts.join(" · ");

  const handleAdd = () => {
    addToQuote({
      id: product.id,
      name: product.name,
      code: currentCode,
      image: currentImage,
      quantity: qty,
      note: `${selectionLabel}${selectionLabel ? " · " : ""}${currentColor}`,
    });
    toast.success("Adicionado ao orçamento", {
      description: `${product.name} — ${currentColor}`,
    });
  };

  const whatsappUrl = buildWhatsAppUrl(
    `Olá! Tenho interesse no produto ${product.name}${activeVariant ? ` — Cor ${currentColor}` : ""} (Cód. ${currentCode}). Quantidade: ${qty}.${selectionLabel ? ` ${selectionLabel}.` : ""} Gostaria de solicitar um orçamento.`
  );

  // Light-color variants need dark checkmark
  const lightHexes = ["#F4F4F2", "#E6D4B0", "#C9A227", "#EFE3CB", "#F4F4F2", "#E4D2A6", "#BFC3C7", "#C8A2C8", "#F8C8DC", "#B7E4C7", "#9ACD32", "#9EC8E8", "#F5C518"];
  const checkColor = (hex: string) =>
    lightHexes.includes(hex) ? "text-foreground" : "text-white";

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* ── MAIN CONTENT — single aligned container ── */}
      <div className="container-pro max-w-4xl w-full py-6 space-y-12">

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-foreground transition-colors">Início</Link>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <Link to="/produtos" className="hover:text-foreground transition-colors">Produtos</Link>
          <ChevronRight className="h-3 w-3 flex-shrink-0" />
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        {/* ══════════════════════════════════════════
            1. FOTO PRINCIPAL + OPÇÕES DE COMPRA
        ══════════════════════════════════════════ */}
        <section className="grid lg:grid-cols-2 gap-10 items-start">

          {/* ── Imagem principal ── */}
          <div className="space-y-3">
            <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-muted relative shadow-card">
              <img
                src={currentImage}
                alt={`${product.name} — ${currentColor}`}
                className="h-full w-full object-cover transition-all duration-500"
                key={currentImage}
              />
              {activeVariant && (
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-background/95 backdrop-blur px-3 py-1.5 text-xs font-semibold border border-border shadow-sm">
                  <span
                    className="h-4 w-4 rounded-full border border-border flex-shrink-0"
                    style={{ backgroundColor: activeVariant.hex }}
                  />
                  {activeVariant.color} · {activeVariant.code}
                </div>
              )}
            </div>
          </div>

          {/* ── Informações + ações ── */}
          <div className="flex flex-col gap-5">

            {/* Categoria + Nome + Código */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand">{category?.name}</p>
              <h1 className="mt-1.5 font-display text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Código: <span className="font-semibold text-foreground">{currentCode}</span>
                {activeVariant && (
                  <> · Cor: <span className="font-semibold text-foreground">{currentColor}</span></>
                )}
              </p>
            </div>

            {/* Descrição */}
            <p className="text-foreground/80 leading-relaxed text-sm">{product.description}</p>

            {/* ── Informações comerciais rápidas (badges) ── */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1.5 text-xs font-semibold text-foreground border border-border">
                <Palette className="h-3.5 w-3.5 text-brand flex-shrink-0" />
                Disponível em {totalColors} {totalColors === 1 ? "cor" : "cores"}
              </span>
              {isRollOrLinear && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1.5 text-xs font-semibold text-foreground border border-border">
                  <Ruler className="h-3.5 w-3.5 text-brand flex-shrink-0" />
                  Venda por metro linear ou rolo fechado
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1.5 text-xs font-semibold text-foreground border border-border">
                <Store className="h-3.5 w-3.5 text-brand flex-shrink-0" />
                Atendimento para atacado e varejo
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1.5 text-xs font-semibold text-foreground border border-border">
                <HelpCircle className="h-3.5 w-3.5 text-brand flex-shrink-0" />
                Disponibilidade sob consulta
              </span>
            </div>

            {/* ── Aplicações recomendadas ── */}
            {product.applications.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2 text-muted-foreground">
                  Aplicações Recomendadas
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.applications.map((app) => (
                    <span
                      key={app}
                      className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground border border-border"
                    >
                      <Check className="h-3 w-3 text-brand flex-shrink-0" />
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── Seletores ── */}
            <div className="space-y-5 pt-1">

              {/* Espessura */}
              {product.thicknessOptions && product.thicknessOptions.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2">Espessura</p>
                  <div className="flex flex-wrap gap-2">
                    {product.thicknessOptions.map((t) => (
                      <button
                        key={t}
                        onClick={() => setThickness(t)}
                        className={`rounded-md border px-3 py-2 text-sm font-medium transition-all ${
                          thickness === t
                            ? "border-brand bg-brand text-brand-foreground shadow-brand"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Largura */}
              {product.widthOptions && product.widthOptions.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2">Largura</p>
                  <div className="flex flex-wrap gap-2">
                    {product.widthOptions.map((w) => (
                      <button
                        key={w}
                        onClick={() => setWidthOpt(w)}
                        className={`rounded-md border px-3 py-2 text-sm font-medium transition-all ${
                          widthOpt === w
                            ? "border-brand bg-brand text-brand-foreground shadow-brand"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Forma de Venda */}
              {product.saleUnitOptions && product.saleUnitOptions.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2">Forma de Venda</p>
                  <div className="flex flex-wrap gap-2">
                    {product.saleUnitOptions.map((u) => (
                      <button
                        key={u}
                        onClick={() => setSaleUnit(u)}
                        className={`rounded-md border px-3 py-2 text-sm font-medium transition-all ${
                          saleUnit === u
                            ? "border-brand bg-brand text-brand-foreground shadow-brand"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Medida (fallback para produtos sem variações avançadas) */}
              {!hasAdvancedOptions && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2">Medida</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`rounded-md border px-3 py-2 text-sm font-medium transition-all ${
                          size === s
                            ? "border-brand bg-brand text-brand-foreground shadow-brand"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cores / Variações */}
              {product.variants && product.variants.length > 0 ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2">
                    Cores disponíveis{" "}
                    <span className="text-muted-foreground font-medium normal-case">
                      ({product.variants.length} opções)
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, i) => (
                      <button
                        key={v.code}
                        onClick={() => setVariantIdx(i)}
                        title={`${v.color} — ${v.code}`}
                        aria-label={`${v.color} — ${v.code}`}
                        aria-pressed={variantIdx === i}
                        className={`group relative h-11 w-11 rounded-full border-2 transition-all duration-200 ${
                          variantIdx === i
                            ? "border-brand ring-2 ring-brand/30 scale-110"
                            : "border-border hover:border-foreground hover:scale-105"
                        }`}
                        style={{ backgroundColor: v.hex }}
                      >
                        {variantIdx === i && (
                          <Check
                            className={`absolute inset-0 m-auto h-4 w-4 ${checkColor(v.hex)}`}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2.5 text-xs text-muted-foreground">
                    Selecionado:{" "}
                    <span className="font-semibold text-foreground">{currentColor}</span>
                    {" "}· Código{" "}
                    <span className="font-semibold text-foreground">{currentCode}</span>
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2">Cor</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <span
                        key={c}
                        className="rounded-md border border-border px-3 py-2 text-sm font-medium bg-muted"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantidade */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2">Quantidade</p>
                <div className="inline-flex items-center rounded-md border border-border">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="grid h-10 w-10 place-items-center hover:bg-muted transition-colors rounded-l-md"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                    className="h-10 w-16 bg-transparent text-center outline-none text-sm font-medium"
                    aria-label="Quantidade"
                  />
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="grid h-10 w-10 place-items-center hover:bg-muted transition-colors rounded-r-md"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── CTA Principal ── */}
            <div className="pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleAdd}
                className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-foreground shadow-brand hover:scale-[1.02] transition-transform w-full sm:w-auto justify-center"
              >
                <MessageCircle className="h-4 w-4" />
                Solicitar orçamento via WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            2. ESPECIFICAÇÕES TÉCNICAS
        ══════════════════════════════════════════ */}
        <section className="w-full">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Especificações</p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground">
              Especificações Técnicas
            </h2>
          </div>
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="divide-y divide-border">
              {product.material && <SpecRow label="Material" value={product.material} />}
              {product.thickness && <SpecRow label="Espessura" value={product.thickness} />}
              {product.width && <SpecRow label="Largura" value={product.width} />}
              {product.length && <SpecRow label="Comprimento" value={product.length} />}
              {product.finish && <SpecRow label="Acabamento" value={product.finish} />}
              {product.typeOfUse && <SpecRow label="Tipo de uso" value={product.typeOfUse} />}
              {product.resistance && <SpecRow label="Resistência" value={product.resistance} />}
              <SpecRow label="Medidas" value={product.sizes.join(" · ")} />
              <SpecRow label="Cores" value={product.colors.join(" · ")} />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            3. APLICAÇÕES REAIS
        ══════════════════════════════════════════ */}
        {product.applicationImages && product.applicationImages.length > 0 && (
          <section className="w-full">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-brand">Aplicações</p>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground">
                Aplicações Reais
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">
                Exemplos reais de utilização deste material em diferentes ambientes.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {product.applicationImages.map((img, i) => (
                <figure
                  key={i}
                  className="group relative overflow-hidden rounded-xl border border-border bg-muted aspect-[4/3] cursor-pointer"
                  onClick={() => setLightboxImg(img.url)}
                  aria-label={`Ver ampliado: ${img.caption}`}
                >
                  <img
                    src={img.url}
                    alt={`${product.name} — ${img.caption}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <figcaption className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-brand">Aplicação</p>
                    <p className="text-white font-bold text-xs leading-snug">{img.caption}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════
            4. CTA FINAL
        ══════════════════════════════════════════ */}
        <section className="w-full">
          <div className="relative overflow-hidden rounded-2xl bg-foreground text-white p-8 md:p-12 text-center shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-brand/10 to-brand/20 opacity-30 pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                Gostou deste material?
              </h2>
              <p className="text-white/80 max-w-md mx-auto text-sm leading-relaxed">
                Solicite um orçamento personalizado e receba atendimento especializado para seu projeto.
              </p>
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleAdd}
                  className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-foreground shadow-brand hover:scale-[1.02] transition-transform"
                >
                  <MessageCircle className="h-4 w-4" />
                  Solicitar orçamento via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* LIGHTBOX OVERLAY */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-pointer"
          onClick={() => setLightboxImg(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Imagem ampliada"
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-brand transition-colors p-2 text-xl font-bold bg-black/50 rounded-full h-10 w-10 flex items-center justify-center"
            onClick={() => setLightboxImg(null)}
            aria-label="Fechar"
          >
            ✕
          </button>
          <img
            src={lightboxImg}
            alt="Ampliação da aplicação"
            className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* PRODUTOS RELACIONADOS */}
      {related.length > 0 && (
        <section className="bg-muted/40 border-t border-border py-16">
          <div className="container-pro">
            <div className="max-w-4xl mx-auto w-full">
              <h2 className="font-display text-2xl font-bold tracking-tight mb-6">
                Produtos relacionados
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {related.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 px-5 py-3.5 text-sm even:bg-muted/30">
      <span className="font-semibold text-muted-foreground">{label}</span>
      <span className="text-foreground flex items-center gap-1.5">
        <Check className="h-3.5 w-3.5 text-brand flex-shrink-0" />
        {value}
      </span>
    </div>
  );
}