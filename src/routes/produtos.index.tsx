import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { ProductCard } from "@/components/site/ProductCard";
import { usePublicData } from "@/lib/use-public-data";
import { toLegacyProduct, toLegacyCategory } from "@/lib/data/legacy-shim";
import { Search, SlidersHorizontal, X } from "lucide-react";

const searchSchema = z.object({
  category: z.string().optional(),
  purpose: z.string().optional(),
  q: z.string().optional(),
});
type SearchT = z.infer<typeof searchSchema>;

const purposes = [
  "Para Sofás","Para Estofados","Para Decoração","Para Mesas",
  "Para Proteção","Para Eventos","Para Comércio","Para Uso Residencial",
];

export const Route = createFileRoute("/produtos/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Catálogo de Produtos — Marcio Alegre" },
      { name: "description", content: "Catálogo completo de plásticos, toalhas, passadeiras, TNT, napa, corino e mais. Solicite orçamento via WhatsApp." },
      { name: "keywords", content: "catálogo, plásticos, napa, corino, bagum, TNT, toalhas, passadeiras, revestimentos" },
      { property: "og:title", content: "Catálogo de Produtos — Marcio Alegre" },
      { property: "og:description", content: "Catálogo completo de plásticos, revestimentos e decoração." },
      { property: "og:url", content: "/produtos" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/produtos" }],
  }),
  component: ProdutosPage,
});


function ProdutosPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data } = usePublicData();
  const categories = (data?.categories ?? []).map(toLegacyCategory);
  const products = (data?.products ?? []).map(toLegacyProduct);

  const setCategory = (category: string | undefined) => navigate({ search: { ...search, category } as SearchT });
  const setPurpose = (purpose: string | undefined) => navigate({ search: { ...search, purpose } as SearchT });
  const [query, setQuery] = useState(search.q ?? "");
  const [sort, setSort] = useState<"name" | "code">("name");

  const activeCategory = search.category;
  const activePurpose = search.purpose;

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory) list = list.filter((p) => p.category === activeCategory);
    if (activePurpose) list = list.filter((p) => p.purposes?.includes(activePurpose));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => {
        const inBasic =
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.colors.some((c) => c.toLowerCase().includes(q)) ||
          (p.variants?.some((v) => v.code.toLowerCase().includes(q) || v.color.toLowerCase().includes(q)) ?? false);
        const cat = categories.find((c) => c.slug === p.category);
        return inBasic || (cat?.name.toLowerCase().includes(q) ?? false);
      });
    }
    list.sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : a.code.localeCompare(b.code)));
    return list;
  }, [activeCategory, activePurpose, query, sort, products, categories]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="bg-gradient-dark text-white">
        <div className="container-pro py-16">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">Catálogo</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold tracking-tight">Nossos Produtos</h1>
          <p className="mt-3 text-white/70 max-w-2xl">Navegue pelo catálogo, monte sua lista e envie pelo WhatsApp para receber preços e condições personalizadas.</p>
        </div>
      </section>

      <section className="container-pro py-10 flex-1">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Categorias
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                <button onClick={() => setCategory(undefined)} className={`text-left text-sm px-3 py-2 rounded-md transition ${!activeCategory ? "bg-foreground text-background" : "hover:bg-muted"}`}>Todos os produtos</button>
                {categories.map((c) => (
                  <button key={c.slug} onClick={() => setCategory(c.slug)} className={`text-left text-sm px-3 py-2 rounded-md transition ${activeCategory === c.slug ? "bg-foreground text-background" : "hover:bg-muted"}`}>{c.name}</button>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Finalidade
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                <button onClick={() => setPurpose(undefined)} className={`text-left text-sm px-3 py-2 rounded-md transition ${!activePurpose ? "bg-foreground text-background" : "hover:bg-muted"}`}>Todas as finalidades</button>
                {purposes.map((p) => (
                  <button key={p} onClick={() => setPurpose(p)} className={`text-left text-sm px-3 py-2 rounded-md transition ${activePurpose === p ? "bg-foreground text-background" : "hover:bg-muted"}`}>{p}</button>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="search" placeholder="Buscar por nome ou código..." value={query} onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-md border border-border bg-background pl-9 pr-3 py-2.5 text-sm outline-none focus:border-brand transition" />
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value as "name" | "code")}
                className="rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-brand">
                <option value="name">Ordenar por nome</option>
                <option value="code">Ordenar por código</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {activeCategory && (
                <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 text-brand px-3 py-1.5 text-xs font-semibold">
                  {categories.find((c) => c.slug === activeCategory)?.name}
                  <button onClick={() => setCategory(undefined)}><X className="h-3 w-3" /></button>
                </div>
              )}
              {activePurpose && (
                <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 text-brand px-3 py-1.5 text-xs font-semibold">
                  {activePurpose}
                  <button onClick={() => setPurpose(undefined)}><X className="h-3 w-3" /></button>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground mb-4">{filtered.length} produto(s) encontrado(s)</p>

            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">Nenhum produto encontrado.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
