import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { Target, Heart, Award, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre Nós — 32 anos de Marcio Alegre" },
      { name: "description", content: "Há 32 anos a Marcio Alegre é referência em plásticos, revestimentos e decoração, com tradição, qualidade e atendimento consultivo para todo o Brasil." },
      { property: "og:title", content: "Sobre Nós — Marcio Alegre" },
      { property: "og:description", content: "Tradição, qualidade e atendimento consultivo há 32 anos." },
      { property: "og:url", content: "/sobre" },
    ],
    links: [{ rel: "canonical", href: "/sobre" }],
  }),
  component: SobrePage,
});


const values = [
  { icon: Target, title: "Missão", text: "Distribuir plásticos, revestimentos e produtos para decoração com excelência técnica, variedade e atendimento consultivo que impulsione os negócios dos nossos clientes." },
  { icon: Heart, title: "Valores", text: "Compromisso, transparência, respeito e relacionamentos duradouros — construídos ao longo de mais de três décadas de atuação." },
  { icon: Award, title: "Diferenciais", text: "32 anos de mercado, portfólio amplo, parcerias com fornecedores de referência e logística preparada para atender atacado e varejo." },
  { icon: Sparkles, title: "Visão", text: "Ser reconhecida como a distribuidora mais confiável do segmento, sinônimo de qualidade, tradição e inovação no atendimento." },
];

const stats = [
  { value: "32", label: "Anos de mercado" },
  { value: "10k+", label: "Clientes atendidos" },
  { value: "500+", label: "Produtos disponíveis" },
  { value: "5k+", label: "Projetos entregues" },
];

function SobrePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="bg-gradient-dark text-white">
        <div className="container-pro py-20">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">Sobre nós · Desde 1993</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold tracking-tight max-w-3xl">
            32 anos de experiência no mercado de plásticos e revestimentos
          </h1>
          <p className="mt-5 text-white/70 max-w-2xl leading-relaxed">
            Há mais de três décadas, a {siteConfig.name} constrói uma trajetória sólida no fornecimento
            de plásticos, revestimentos e produtos para decoração. Conquistamos a confiança de
            milhares de clientes — do consumidor final a grandes distribuidores — entregando
            qualidade, variedade e um atendimento que faz a diferença.
          </p>
        </div>
      </section>

      <section className="container-pro py-20 grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-5 text-foreground/80 leading-relaxed">
          <p>
            Fundada em 1993 e sediada na {siteConfig.address}, a {siteConfig.name} nasceu
            com o propósito de ser mais do que uma loja: uma parceira estratégica para
            comerciantes, decoradores, indústrias e consumidores que exigem produtos de
            qualidade e relacionamento de confiança.
          </p>
          <p>
            Ao longo de 32 anos, ampliamos nosso portfólio, estruturamos uma logística
            eficiente e firmamos parcerias com os principais fornecedores do segmento.
            Hoje, oferecemos um dos catálogos mais completos do setor, com soluções em
            toalhas, passadeiras, plástico cristal, TNT, napa, corino, bagum, revestimentos
            e linha de decoração.
          </p>
          <p>
            Nossa essência continua a mesma: tratar cada cliente como único, entender suas
            necessidades e entregar soluções sob medida — com a tradição de quem está no
            mercado há mais de três décadas e a agilidade de quem se reinventa todos os dias.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-card border border-border p-6 hover-lift">
              <p className="font-display text-4xl font-bold text-brand">{s.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 border-y border-border py-20">
        <div className="container-pro">
          <h2 className="font-display text-3xl font-bold tracking-tight mb-10 text-center">Nossos pilares</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-card p-6 hover-lift">
                <div className="grid h-11 w-11 place-items-center rounded-md bg-brand/10 text-brand">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-pro py-20 text-center">
        <h2 className="font-display text-3xl font-bold">Visite nossa loja</h2>
        <p className="mt-3 text-muted-foreground">{siteConfig.address} · {siteConfig.hours}</p>
        <div className="mt-6">
          <Link to="/contato" className="inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-foreground/90">
            Entre em contato
          </Link>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
