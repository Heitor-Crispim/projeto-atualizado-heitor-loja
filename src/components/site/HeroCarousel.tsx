import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Sparkles } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/site-config";
import heroImg from "@/assets/hero.jpg";
import imgNapa from "@/assets/products/napa.jpg";
import imgPlasticoCristal from "@/assets/products/plastico-cristal.jpg";

type Slide = {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  image: string;
  primary: { label: string; to: string };
  secondary: { label: string; message: string };
};

const slides: Slide[] = [
  {
    eyebrow: "32 anos de tradição · Atacado e Varejo",
    title: (
      <>
        Grande variedade de plásticos e revestimentos para o seu{" "}
        <span className="text-brand">projeto</span>
      </>
    ),
    description:
      "Há 32 anos fornecendo qualidade, variedade e confiança para construção, decoração e revestimentos em todo o Brasil.",
    image: heroImg,
    primary: { label: "Ver Catálogo", to: "/produtos" },
    secondary: { label: "Solicitar Orçamento", message: "Olá! Gostaria de solicitar um orçamento." },
  },
  {
    eyebrow: "Distribuição Nacional",
    title: (
      <>
        Qualidade e excelentes condições para{" "}
        <span className="text-brand">atacado e varejo</span>
      </>
    ),
    description:
      "Mais de 500 itens em estoque: toalhas, passadeiras, TNT, napa, corino, bagum, plástico cristal e muito mais.",
    image: imgNapa,
    primary: { label: "Explorar Produtos", to: "/produtos" },
    secondary: { label: "Falar com Consultor", message: "Olá! Quero falar com um consultor sobre preços de atacado." },
  },
  {
    eyebrow: "Materiais Selecionados",
    title: (
      <>
        Produtos de confiança com{" "}
        <span className="text-brand">ótimo custo-benefício</span>
      </>
    ),
    description:
      "Trabalhamos com as principais marcas do mercado para oferecer o melhor em durabilidade, acabamento e variedade de cores.",
    image: imgPlasticoCristal,
    primary: { label: "Ver Catálogo", to: "/produtos" },
    secondary: { label: "Pedir Cotação", message: "Olá! Gostaria de uma cotação personalizada." },
  },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    const id = setInterval(() => emblaApi.scrollNext(), 6500);
    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(id);
    };
  }, [emblaApi]);

  return (
    <section className="relative isolate overflow-hidden bg-foreground text-white">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((s, i) => (
            <div key={i} className="relative min-w-0 flex-[0_0_100%]">
              <img
                src={s.image}
                alt=""
                width={1920}
                height={1080}
                className="absolute inset-0 h-full w-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
              <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand/30 blur-3xl" />
              <div className="relative container-pro py-24 md:py-32 lg:py-40 max-w-3xl px-14 sm:px-20 text-center flex flex-col items-center justify-center mx-auto">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-3 py-1.5 text-xs font-medium">
                  <Sparkles className="h-3.5 w-3.5 text-brand" />
                  {s.eyebrow}
                </div>
                <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-balance">
                  {s.title}
                </h1>
                <p className="mt-6 text-lg text-white/80 max-w-xl mx-auto">{s.description}</p>
                <div className="mt-9 flex flex-wrap gap-3 justify-center">
                  <Link
                    to={s.primary.to}
                    className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-foreground shadow-brand hover:scale-[1.02] transition-transform"
                  >
                    {s.primary.label} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={buildWhatsAppUrl(s.secondary.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/5 backdrop-blur px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-white hover:text-foreground transition"
                  >
                    <MessageCircle className="h-4 w-4" /> {s.secondary.label}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={scrollPrev}
        aria-label="Banner anterior"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/40 backdrop-blur text-white hover:bg-brand hover:border-brand transition z-10"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Próximo banner"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/40 backdrop-blur text-white hover:bg-brand hover:border-brand transition z-10"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Ir para banner ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              selected === i ? "w-8 bg-brand" : "w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
