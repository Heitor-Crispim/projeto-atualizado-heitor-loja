import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { adminListCategories, upsertCategory, deleteCategory } from "@/lib/data/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, Edit, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/categorias")({
  component: CategoriesPage,
});

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function CategoriesPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListCategories);
  const upsertFn = useServerFn(upsertCategory);
  const delFn = useServerFn(deleteCategory);
  const { data: items = [] } = useQuery({ queryKey: ["admin-categories"], queryFn: () => listFn() });

  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  function startNew() {
    setEditing({ slug: "", name: "", description: "", active: true, sort_order: items.length });
    setOpen(true);
  }
  function startEdit(c: any) { setEditing({ ...c }); setOpen(true); }

  async function save() {
    if (!editing.name || !editing.slug) return toast.error("Nome e slug obrigatórios");
    try {
      await upsertFn({ data: editing });
      toast.success("Salvo");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["public-data"] });
    } catch (e: any) { toast.error("Falha", { description: e.message }); }
  }
  async function del(id: string) {
    if (!confirm("Excluir esta categoria?")) return;
    await delFn({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin-categories"] });
    qc.invalidateQueries({ queryKey: ["public-data"] });
  }
  async function reorder(c: any, dir: -1 | 1) {
    const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);
    const i = sorted.findIndex((x) => x.id === c.id);
    const ni = i + dir;
    if (ni < 0 || ni >= sorted.length) return;
    const other = sorted[ni];
    await upsertFn({ data: { ...c, sort_order: other.sort_order } });
    await upsertFn({ data: { ...other, sort_order: c.sort_order } });
    qc.invalidateQueries({ queryKey: ["admin-categories"] });
    qc.invalidateQueries({ queryKey: ["public-data"] });
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Categorias</h1><p className="text-sm text-muted-foreground">{items.length} categorias.</p></div>
        <Button onClick={startNew}><Plus className="h-4 w-4 mr-1" /> Nova categoria</Button>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase"><tr>
            <th className="text-left p-3">Nome</th><th className="text-left p-3">Slug</th>
            <th className="text-left p-3">Ativo</th><th className="text-right p-3"></th>
          </tr></thead>
          <tbody>
            {items.map((c: any) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-xs text-muted-foreground">{c.slug}</td>
                <td className="p-3"><Switch checked={c.active} onCheckedChange={async (v) => { await upsertFn({ data: { ...c, active: v } }); qc.invalidateQueries({ queryKey: ["admin-categories"] }); qc.invalidateQueries({ queryKey: ["public-data"] }); }} /></td>
                <td className="p-3 text-right space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => reorder(c, -1)}><ChevronUp className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => reorder(c, 1)}><ChevronDown className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => startEdit(c)}><Edit className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => del(c.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Editar categoria" : "Nova categoria"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div><Label>Nome</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.slug || slugify(e.target.value) })} /></div>
              <div><Label>Slug</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} /></div>
              <div><Label>Descrição</Label><Input value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="flex items-center gap-2"><Label>Ativa</Label><Switch checked={editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} /></div>
            </div>
          )}
          <DialogFooter><Button onClick={save}>Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
