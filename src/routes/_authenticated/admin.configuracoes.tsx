import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getPublicData } from "@/lib/data/public.functions";
import { updateContactSettings } from "@/lib/data/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/configuracoes")({
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const getFn = useServerFn(getPublicData);
  const saveFn = useServerFn(updateContactSettings);
  const { data } = useQuery({ queryKey: ["public-data"], queryFn: () => getFn() });
  const [form, setForm] = useState<any>(null);

  useEffect(() => { if (data?.contact) setForm({ ...data.contact }); }, [data]);

  async function save() {
    try {
      await saveFn({ data: form });
      toast.success("Configurações salvas");
      qc.invalidateQueries({ queryKey: ["public-data"] });
    } catch (e: any) { toast.error("Falha", { description: e.message }); }
  }
  if (!form) return <p className="text-sm text-muted-foreground">Carregando...</p>;

  const fields: [string, string, string?][] = [
    ["name", "Nome da empresa"],
    ["tagline", "Tagline"],
    ["whatsapp", "WhatsApp (apenas dígitos, ex.: 5511947610083)"],
    ["whatsappDisplay", "WhatsApp para exibição"],
    ["email", "E-mail de contato"],
    ["address", "Endereço"],
    ["hours", "Horário de atendimento"],
    ["mapsQuery", "Consulta do Google Maps"],
    ["instagram", "Instagram (URL)"],
    ["facebook", "Facebook (URL)"],
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div><h1 className="text-2xl font-bold">Configurações do site</h1><p className="text-sm text-muted-foreground">Estas informações aparecem em todo o site (header, rodapé, contato).</p></div>
      <Card><CardHeader><CardTitle className="text-base">Contato e identidade</CardTitle></CardHeader><CardContent className="grid md:grid-cols-2 gap-3">
        {fields.map(([k, label]) => (
          <div key={k}><Label>{label}</Label><Input value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
        ))}
      </CardContent></Card>
      <div className="flex justify-end"><Button onClick={save}>Salvar</Button></div>
    </div>
  );
}
