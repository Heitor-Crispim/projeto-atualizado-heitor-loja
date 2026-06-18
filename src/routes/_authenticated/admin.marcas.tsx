import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { adminListBrands, upsertBrand, deleteBrand, createUploadUrl, getSignedImageUrl } from "@/lib/data/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, Edit, ChevronUp, ChevronDown, Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/marcas")({
  component: BrandsPage,
});

function BrandsPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListBrands);
  const upsertFn = useServerFn(upsertBrand);
  const delFn = useServerFn(deleteBrand);
  const upFn = useServerFn(createUploadUrl);
  const signFn = useServerFn(getSignedImageUrl);
  const { data: items = [] } = useQuery({ queryKey: ["admin-brands"], queryFn: () => listFn() });

  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  async function save() {
    if (!editing.name) return toast.error("Nome obrigatório");
    await upsertFn({ data: editing });
    toast.success("Salvo");
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["admin-brands"] });
    qc.invalidateQueries({ queryKey: ["public-data"] });
  }
  async function del(id: string) {
    if (!confirm("Excluir esta marca?")) return;
    await delFn({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin-brands"] });
    qc.invalidateQueries({ queryKey: ["public-data"] });
  }
  async function reorder(b: any, dir: -1 | 1) {
    const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);
    const i = sorted.findIndex((x) => x.id === b.id);
    const ni = i + dir; if (ni < 0 || ni >= sorted.length) return;
    const other = sorted[ni];
    await upsertFn({ data: { ...b, sort_order: other.sort_order } });
    await upsertFn({ data: { ...other, sort_order: b.sort_order } });
    qc.invalidateQueries({ queryKey: ["admin-brands"] });
    qc.invalidateQueries({ queryKey: ["public-data"] });
  }
  async function uploadLogo(file: File) {
    try {
      const { uploadUrl, path } = await upFn({ data: { filename: file.name, contentType: file.type } });
      const put = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!put.ok) throw new Error("upload");
      const { url } = await signFn({ data: { path } });
      setEditing({ ...editing, logo_url: url ?? "" });
    } catch (e: any) { toast.error("Upload falhou", { description: e.message }); }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Marcas parceiras</h1><p className="text-sm text-muted-foreground">{items.length} marcas no carrossel.</p></div>
        <Button onClick={() => { setEditing({ name: "", logo_url: "", sort_order: items.length }); setOpen(true); }}><Plus className="h-4 w-4 mr-1" /> Nova marca</Button>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase"><tr>
            <th className="text-left p-3 w-16">Logo</th><th className="text-left p-3">Nome</th><th className="text-right p-3"></th>
          </tr></thead>
          <tbody>
            {items.map((b: any) => (
              <tr key={b.id} className="border-t border-border">
                <td className="p-2">{b.logo_url ? <img src={b.logo_url} alt="" className="h-10 w-16 object-contain bg-muted/30 rounded" /> : <div className="h-10 w-16 bg-muted rounded" />}</td>
                <td className="p-3 font-medium">{b.name}</td>
                <td className="p-3 text-right space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => reorder(b, -1)}><ChevronUp className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => reorder(b, 1)}><ChevronDown className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => { setEditing({ ...b }); setOpen(true); }}><Edit className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => del(b.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Editar marca" : "Nova marca"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div><Label>Nome</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Logo (URL ou upload)</Label>
                {editing.logo_url && <img src={editing.logo_url} alt="" className="h-16 mb-2 object-contain" />}
                <Input value={editing.logo_url ?? ""} onChange={(e) => setEditing({ ...editing, logo_url: e.target.value })} placeholder="https://..." />
                <label className="cursor-pointer inline-block mt-2">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }} />
                  <Button type="button" variant="outline" size="sm" asChild><span><Upload className="h-4 w-4 mr-1" /> Enviar logo</span></Button>
                </label>
              </div>
            </div>
          )}
          <DialogFooter><Button onClick={save}>Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
