import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Instagram, Facebook, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl, siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="bg-gradient-dark text-white relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-brand" />
      <div className="container-pro py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo variant="light" />
          <p className="text-sm text-white/70 max-w-xs">
            Plásticos, revestimentos e decoração com qualidade, variedade e atendimento especializado para todo o Brasil.
          </p>
          <div className="flex gap-2 pt-2">
            <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-md border border-white/15 hover:bg-brand hover:border-brand transition">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-md border border-white/15 hover:bg-brand hover:border-brand transition">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={`mailto:${siteConfig.email}`} aria-label="Email" className="grid h-9 w-9 place-items-center rounded-md border border-white/15 hover:bg-brand hover:border-brand transition">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-brand mb-4">Navegação</h4>
          <ul className="space-y-2.5 text-sm text-white/80">
            <li><Link to="/" className="hover:text-white">Início</Link></li>
            <li><Link to="/produtos" className="hover:text-white">Produtos</Link></li>
            <li><Link to="/sobre" className="hover:text-white">Sobre Nós</Link></li>
            <li><Link to="/contato" className="hover:text-white">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-brand mb-4">Contato</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-brand" /><span>{siteConfig.address}</span></li>
            <li className="flex gap-2"><Clock className="h-4 w-4 mt-0.5 shrink-0 text-brand" /><span>{siteConfig.hours}</span></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0 text-brand" /><a href={`mailto:${siteConfig.email}`} className="hover:text-white">{siteConfig.email}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-brand mb-4">Solicite Orçamento</h4>
          <p className="text-sm text-white/70 mb-4">Atendimento rápido pelo WhatsApp.</p>
          <a
            href={buildWhatsAppUrl("Olá! Gostaria de solicitar um orçamento.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-bold text-brand-foreground shadow-brand hover:scale-[1.02] transition-transform"
          >
            <MessageCircle className="h-4 w-4" /> {siteConfig.whatsappDisplay}
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-pro py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Todos os direitos reservados.</p>
          <p>{siteConfig.tagline}</p>
        </div>
      </div>
    </footer>
  );
}