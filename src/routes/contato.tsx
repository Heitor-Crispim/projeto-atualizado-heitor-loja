import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { buildWhatsAppUrl, siteConfig } from "@/lib/site-config";
import { useQuote } from "@/lib/quote-store";
import { MapPin, Clock, Mail, MessageCircle, Phone, Send, ShoppingBag } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Marcio Alegre" },
      { name: "description", content: "Entre em contato com a Marcio Alegre. WhatsApp, endereço, horário de atendimento e formulário." },
      { property: "og:title", content: "Contato — Marcio Alegre" },
      { property: "og:description", content: "Fale conosco pelo WhatsApp ou envie uma mensagem." },
      { property: "og:url", content: "/contato" },
    ],
    links: [{ rel: "canonical", href: "/contato" }],
  }),
  component: ContatoPage,
});


const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  message: z.string().trim().min(2, "Informe sua mensagem").max(1000),
});

function ContatoPage() {
  const [form, setForm] = useState({ name: "", message: "" });
  const { items, buildMessage } = useQuote();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Verifique os campos.");
      return;
    }

    let msg: string;

    if (items.length > 0) {
      const itemsList = items.map((i, idx) => `${idx + 1}. ${i.name} (Cód.: ${i.code}) — Qtd: ${i.quantity}`).join("\n");
      const quotePart = `Gostaria de solicitar um orçamento para os seguintes produtos:\n\n${itemsList}`;
      msg = `Olá!

Meu nome é ${form.name}.

${quotePart}${form.message ? `\n\nObservações: ${form.message}` : ""}

Aguardo retorno.`;
    } else {
      msg = `Olá!

Meu nome é ${form.name}.

${form.message}

Aguardo retorno.`;
    }

    window.open(buildWhatsAppUrl(msg), "_blank");
    toast.success("Abrindo WhatsApp...");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="bg-gradient-dark text-white">
        <div className="container-pro py-16">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">Contato</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold tracking-tight">Fale com a gente</h1>
          <p className="mt-3 text-white/70 max-w-2xl">Estamos prontos para atender você. Solicite orçamentos, tire dúvidas ou agende uma visita.</p>
        </div>
      </section>

      <section className="container-pro py-16 grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <div className="space-y-4">
          <ContactBlock icon={MapPin} title="Endereço" text={siteConfig.address} />
          <ContactBlock icon={Clock} title="Horário" text={siteConfig.hours} />
          <ContactBlock icon={Phone} title="WhatsApp" text={siteConfig.whatsappDisplay} href={buildWhatsAppUrl("Olá!")} />
          <ContactBlock icon={Mail} title="E-mail" text={siteConfig.email} href={`mailto:${siteConfig.email}`} />

          <div className="aspect-video overflow-hidden rounded-xl border border-border mt-6">
            <iframe
              title="Mapa"
              src={`https://www.google.com/maps?q=${encodeURIComponent(siteConfig.mapsQuery)}&output=embed`}
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card">
          <h2 className="font-display text-2xl font-bold">Solicitar Orçamento</h2>
          <p className="text-sm text-muted-foreground mt-1">Preencha abaixo e abriremos o WhatsApp com sua mensagem pronta.</p>

          {/* Quote items summary */}
          {items.length > 0 && (
            <div className="mt-5 rounded-lg border border-brand/20 bg-brand/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag className="h-4 w-4 text-brand" />
                <p className="text-sm font-bold text-brand">{items.length} produto(s) na lista de orçamento</p>
              </div>
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.id} className="text-xs text-muted-foreground flex justify-between gap-2">
                    <span className="truncate">{item.name}</span>
                    <span className="shrink-0 font-semibold">Qtd: {item.quantity}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-2 opacity-70">Esses produtos serão incluídos automaticamente na mensagem.</p>
            </div>
          )}

          <div className="mt-6">
            <Field label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          </div>
          <div className="mt-4">
            <Field
              label={items.length > 0 ? "Observações (entrega, prazo, cor, etc.)" : "Mensagem"}
              textarea
              value={form.message}
              onChange={(v) => setForm({ ...form, message: v })}
              placeholder="Olá, tenho interesse no produto [NOME DO PRODUTO] e gostaria de solicitar um orçamento."
            />
          </div>
          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-foreground shadow-brand hover:scale-[1.02] transition-transform"
          >
            <Send className="h-4 w-4" /> Enviar via WhatsApp
          </button>
        </form>
      </section>

      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}

function ContactBlock({ icon: Icon, title, text, href }: { icon: any; title: string; text: string; href?: string }) {
  const Inner = (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 hover-lift">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-brand/10 text-brand">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
        <p className="mt-0.5 font-semibold">{text}</p>
      </div>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noopener noreferrer">{Inner}</a> : Inner;
}

function Field({
  label, value, onChange, required, type = "text", textarea, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; type?: string; textarea?: boolean; placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}{required && " *"}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} required={required} rows={4} maxLength={1000} placeholder={placeholder} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-brand transition resize-none placeholder:text-muted-foreground/50" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} maxLength={120} placeholder={placeholder} className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-brand transition" />
      )}
    </label>
  );
}