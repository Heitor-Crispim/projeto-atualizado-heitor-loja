import { useEffect, useState, useCallback } from "react";

export type QuoteItem = {
  id: string;
  name: string;
  code: string;
  image: string;
  quantity: number;
  note?: string;
};

const STORAGE_KEY = "ma_quote_v1";
const EVENT = "ma:quote-changed";

function read(): QuoteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QuoteItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: QuoteItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function addToQuote(item: Omit<QuoteItem, "quantity"> & { quantity?: number }) {
  const items = read();
  const existing = items.find((i) => i.id === item.id);
  if (existing) {
    existing.quantity += item.quantity ?? 1;
  } else {
    items.push({ ...item, quantity: item.quantity ?? 1 });
  }
  write(items);
}

export function removeFromQuote(id: string) {
  write(read().filter((i) => i.id !== id));
}

export function updateQuantity(id: string, quantity: number) {
  const items = read().map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i));
  write(items);
}

export function clearQuote() {
  write([]);
}

export function useQuote() {
  const [items, setItems] = useState<QuoteItem[]>([]);

  useEffect(() => {
    setItems(read());
    const handler = () => setItems(read());
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const total = items.reduce((sum, i) => sum + i.quantity, 0);

  const buildMessage = useCallback((extraNote?: string) => {
    if (items.length === 0) return "Olá! Gostaria de solicitar um orçamento.";
    const lines = [
      "Olá! Gostaria de solicitar um orçamento para os seguintes produtos:",
      "",
      ...items.map(
        (i, idx) =>
          `${idx + 1}. ${i.name} (Cód.: ${i.code}) — Qtd: ${i.quantity}${i.note ? ` — Obs: ${i.note}` : ""}`,
      ),
    ];
    if (extraNote) {
      lines.push("", `Observações gerais: ${extraNote}`);
    }
    return lines.join("\n");
  }, [items]);

  return { items, total, buildMessage };
}