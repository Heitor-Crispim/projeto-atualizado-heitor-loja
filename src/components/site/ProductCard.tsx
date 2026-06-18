import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/catalog";
import { getCategory } from "@/lib/catalog";
import { Plus } from "lucide-react";
import { addToQuote } from "@/lib/quote-store";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const category = getCategory(product.category);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card hover-lift">
      <Link
        to="/produtos/$slug"
        params={{ slug: product.slug }}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <span className="absolute top-3 left-3 rounded bg-foreground/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-background">
          {category?.name}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-brand">
          {product.code}
        </p>
        <Link
          to="/produtos/$slug"
          params={{ slug: product.slug }}
          className="mt-1 text-base font-bold leading-snug text-foreground line-clamp-2 hover:text-brand transition-colors"
        >
          {product.name}
        </Link>

        <ul className="mt-2 space-y-0.5 text-[11px] text-muted-foreground">
          {product.thickness && (
            <li><span className="font-semibold text-foreground/80">Espessura:</span> {product.thickness.split("|")[0].trim()}</li>
          )}
          {product.sizes[0] && (
            <li className="line-clamp-1"><span className="font-semibold text-foreground/80">Medida:</span> {product.sizes[0]}</li>
          )}
        </ul>

        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{product.shortDescription}</p>

        <div className="mt-4 flex items-center gap-2">
          <Link
            to="/produtos/$slug"
            params={{ slug: product.slug }}
            className="flex-1 rounded-md border border-border px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider hover:border-foreground transition"
          >
            Ver Detalhes
          </Link>
          <button
            onClick={() => {
              addToQuote({ id: product.id, name: product.name, code: product.code, image: product.image });
              toast.success("Adicionado ao orçamento", { description: product.name });
            }}
            className="grid h-9 w-9 place-items-center rounded-md bg-brand text-brand-foreground hover:bg-brand-dark transition"
            aria-label="Adicionar ao orçamento"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}