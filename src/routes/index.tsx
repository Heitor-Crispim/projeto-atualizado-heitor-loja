import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { ProductCard } from "@/components/site/ProductCard";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { usePublicData } from "@/lib/use-public-data";
import { toLegacyProduct, legacyBrandNames } from "@/lib/data/legacy-shim";
import { buildWhatsAppUrl } from "@/lib/site-config";
import { ArrowRight, MessageCircle, Award, MapPin } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Marcio Alegre — 32 anos em Plásticos, Revestimentos e Decoração" },
      { name: "description", content: "Há 32 anos fornecendo qualidade e variedade em plásticos, revestimentos e decoração para atacado e varejo em todo o Brasil." },
      { name: "keywords", content: "plásticos, revestimentos, decoração, napa, corino, bagum, TNT, toalhas térmicas, passadeiras, atacado, varejo, Marcio Alegre" },
      { property: "og:title", content: "Marcio Alegre — 32 anos em Plásticos, Revestimentos e Decoração" },
      { property: "og:description", content: "Qualidade, variedade e atendimento especializado para atacado e varejo." },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Marcio Alegre",
        description: "Distribuidora de plásticos, revestimentos e decoração para atacado e varejo.",
        url: "/",
      }),
    }],
  }),
  component: Index,
});


const stats = [
  { value: "32", label: "Anos de mercado" },
  { value: "10k+", label: "Clientes atendidos" },
  { value: "500+", label: "Produtos disponíveis" },
  { value: "100%", label: "Atendimento dedicado" },
];

function Index() {
  const { data } = usePublicData();
  const contact = data?.contact;
  const products = (data?.products ?? []).map(toLegacyProduct);
  const featured = products.slice(0, 8);
  const brands = legacyBrandNames(data?.brands ?? []);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <HeroCarousel />

      <section className="bg-muted/30 border-b border-border py-6 overflow-hidden">
        <div className="container-pro">
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-4">
            Marcas Parceiras
          </p>
          <div className="relative flex items-center overflow-x-hidden">
            <div className="flex gap-16 min-w-full shrink-0 animate-marquee items-center justify-around">
              {brands.map((b, i) => (
                <span key={i} className="text-sm font-bold tracking-wider text-muted-foreground/60 uppercase">{b}</span>
              ))}
            </div>
            <div className="flex gap-16 min-w-full shrink-0 animate-marquee items-center justify-around" aria-hidden="true">
              {brands.map((b, i) => (
                <span key={`${i}-dup`} className="text-sm font-bold tracking-wider text-muted-foreground/60 uppercase">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-20 border-y border-border">
        <div className="container-pro">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand">Catálogo</p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold tracking-tight">Produtos em destaque</h2>
            </div>
            <Link to="/produtos" className="text-sm font-semibold inline-flex items-center gap-1 hover:text-brand">
              Ver catálogo completo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <section className="container-pro py-24 grid lg:grid-cols-2 gap-12 items-center border-t border-border">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand">Sobre nós</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold tracking-tight">
            Há 32 anos fornecendo qualidade e confiança
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            A {contact?.name ?? "Marcio Alegre"} é referência nacional em distribuição de plásticos, revestimentos
            e produtos para decoração. Construímos uma trajetória sólida, baseada em relacionamentos
            duradouros, produtos selecionados e atendimento consultivo para atacado e varejo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/sobre" className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-3 text-sm font-bold text-background hover:bg-foreground/90">Conheça nossa história</Link>
            <Link to="/contato" className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-bold hover:border-foreground">
              <MapPin className="h-4 w-4" /> Como chegar
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-6 hover-lift">
              <p className="font-display text-4xl font-bold text-brand">{s.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-foreground text-white py-20">
        <div className="absolute inset-0 bg-gradient-dark" />
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
        <div className="relative container-pro text-center max-w-2xl">
          <Award className="h-10 w-10 text-brand mx-auto" />
          <h2 className="mt-4 font-display text-3xl md:text-4xl font-bold tracking-tight text-balance">
            Pronto para solicitar seu orçamento?
          </h2>
          <p className="mt-4 text-white/70">
            Monte sua lista no nosso catálogo ou fale diretamente conosco pelo WhatsApp. Atendimento rápido e personalizado.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={buildWhatsAppUrl("Olá! Gostaria de solicitar um orçamento.")} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-foreground shadow-brand hover:scale-[1.02] transition-transform">
              <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
            </a>
            <Link to="/produtos" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-foreground transition">
              Ver Catálogo
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
