import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Search, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { QuoteSheet } from "./QuoteSheet";
import { buildWhatsAppUrl, siteConfig } from "@/lib/site-config";

const nav = [
  { to: "/", label: "Início" },
  { to: "/produtos", label: "Produtos" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="bg-foreground text-background text-xs">
        <div className="container-pro flex h-9 items-center justify-between">
          <span className="hidden sm:block opacity-80">
            Atendimento especializado • Atacado e Varejo • {siteConfig.hours}
          </span>
          <a
            href={buildWhatsAppUrl("Olá! Gostaria de mais informações.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium hover:text-brand transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {siteConfig.whatsappDisplay}
          </a>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 w-full backdrop-blur transition-all ${
          scrolled ? "bg-background/95 border-b border-border shadow-sm" : "bg-background/80"
        }`}
      >
        <div className="container-pro flex h-16 items-center justify-between gap-4">
          <Logo />

          <nav className="hidden lg:flex items-center gap-8">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-sm font-medium text-ink-soft hover:text-brand transition-colors relative after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:w-0 after:bg-brand after:transition-all hover:after:w-full"
                activeProps={{ className: "text-brand after:!w-full" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/produtos"
              aria-label="Buscar produtos"
              className="hidden md:grid h-9 w-9 place-items-center rounded-md text-ink-soft hover:bg-muted hover:text-foreground transition"
            >
              <Search className="h-4 w-4" />
            </Link>
            <QuoteSheet />
            <button
              onClick={() => setOpen(true)}
              aria-label="Menu"
              className="lg:hidden grid h-9 w-9 place-items-center rounded-md hover:bg-muted"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-background shadow-elegant animate-fade-up p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Fechar" className="grid h-9 w-9 place-items-center rounded-md hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-base font-medium hover:bg-muted"
                  activeProps={{ className: "bg-muted text-brand" }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <a
              href={buildWhatsAppUrl("Olá! Gostaria de mais informações.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-sm font-bold uppercase tracking-wide text-brand-foreground"
            >
              <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}