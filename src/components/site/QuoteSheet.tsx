import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag, Trash2, Minus, Plus, MessageCircle } from "lucide-react";
import { useQuote, removeFromQuote, updateQuantity, clearQuote } from "@/lib/quote-store";
import { buildWhatsAppUrl } from "@/lib/site-config";
import { useState, type ReactNode } from "react";

export function QuoteSheet({ trigger }: { trigger?: ReactNode }) {
  const { items, total, buildMessage } = useQuote();
  const [note, setNote] = useState("");

  const sendUrl = buildWhatsAppUrl(buildMessage(note));

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="relative border-foreground/15">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Orçamento</span>
            {total > 0 && (
              <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-foreground">
                {total}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col gap-0 p-0">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="text-lg font-bold tracking-tight">Solicitação de Orçamento</SheetTitle>
          <p className="text-sm text-muted-foreground">
            Monte sua lista e envie pelo WhatsApp para receber preços e condições.
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-muted">
                <ShoppingBag className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Sua lista está vazia.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 rounded-lg border border-border p-3">
                <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Cód. {item.code}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center rounded-md border border-border">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="grid h-7 w-7 place-items-center text-muted-foreground hover:text-foreground"
                        aria-label="Diminuir"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Number(e.target.value) || 1)}
                        className="h-7 w-12 bg-transparent text-center text-sm outline-none"
                      />
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="grid h-7 w-7 place-items-center text-muted-foreground hover:text-foreground"
                        aria-label="Aumentar"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromQuote(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-border bg-muted/30 px-6 py-5 space-y-3">
          {items.length > 0 && (
            <Textarea
              placeholder="Observações gerais (entrega, prazo, etc.)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              rows={2}
              className="resize-none bg-background"
            />
          )}
          <a
            href={sendUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-sm font-bold uppercase tracking-wide text-brand-foreground shadow-brand transition-transform hover:scale-[1.02] active:scale-100"
          >
            <MessageCircle className="h-4 w-4" />
            Enviar Orçamento via WhatsApp
          </a>
          {items.length > 0 && (
            <button
              onClick={() => { clearQuote(); setNote(""); }}
              className="w-full text-xs text-muted-foreground hover:text-foreground"
            >
              Limpar lista
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}