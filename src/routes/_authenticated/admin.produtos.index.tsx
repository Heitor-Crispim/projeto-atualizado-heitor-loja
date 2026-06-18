import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import {
  adminListProducts,
  adminListCategories,
  deleteProduct,
  toggleProductActive,
  upsertProduct,
} from "@/lib/data/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/produtos/")({
  component: ProductsList,
});

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function ProductsList() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListProducts);
  const catsFn = useServerFn(adminListCategories);
  const upsertFn = useServerFn(upsertProduct);
  const delFn = useServerFn(deleteProduct);
  const toggleFn = useServerFn(toggleProductActive);

  const { data: products = [], error: productsError, isError: isProductsError } = useQuery({ queryKey: ["admin-products"], queryFn: () => listFn() });
  const { data: cats = [] } = useQuery({ queryKey: ["admin-categories"], queryFn: () => catsFn() });

  const [q, setQ] = useState("");

  if (isProductsError) {
    return (
      <div className="space-y-6 max-w-7xl">
        <div>
          <h1 className="text-2xl font-bold text-destructive">Erro de Conexão / Autenticação</h1>
          <p className="text-sm text-muted-foreground">O servidor não conseguiu consultar a tabela de produtos.</p>
        </div>
        <Card className="p-6 border-destructive/20 bg-destructive/5 space-y-4">
          <div className="text-sm text-destructive font-medium">
            Erro retornado: {(productsError as any)?.message || "Erro desconhecido"}
          </div>
          <div className="text-xs space-y-2 text-muted-foreground border-t border-border pt-4">
            <p className="font-semibold text-foreground text-sm">💡 Causa raiz & Passos para resolução:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                <strong>Verifique a Service Role Key:</strong> Seu arquivo <code className="bg-muted px-1.5 py-0.5 rounded font-mono">.env</code> local possui a chave <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY="DUMMY_SERVICE_ROLE_KEY_FOR_DEV"</code>. Ela precisa ser substituída pela chave <strong>service_role</strong> real do seu projeto obtida no painel da Supabase (Configurações do Projeto &rarr; API).
              </li>
              <li>
                <strong>Associe a role Admin ao seu usuário no banco:</strong> A tabela <code className="bg-muted px-1.5 py-0.5 rounded font-mono">user_roles</code> no banco de dados está vazia. Você deve inserir o seu ID de usuário do Supabase Auth associado ao e-mail <code className="font-mono">heitor160289@icloud.com</code> com a role <code className="font-mono">admin</code>.
              </li>
            </ol>
          </div>
        </Card>
      </div>
    );
  }
  const filtered = useMemo(() => {
    if (!q.trim()) return products;
    const t = q.toLowerCase();
    return products.filter((p: any) =>
      p.name.toLowerCase().includes(t) ||
      p.code?.toLowerCase().includes(t) ||
      p.slug.toLowerCase().includes(t),
    );
  }, [q, products]);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  async function create() {
    if (!name.trim() || !slug.trim()) return toast.error("Preencha nome e slug");
    try {
      const r = await upsertFn({ data: {
        slug, name, code: "", category_id: categoryId || null,
        short_description: "", description: "", image: "",
        applications: [], purposes: [], sizes: [],
        thickness_options: [], width_options: [], sale_unit_options: [],
        active: true, sort_order: products.length,
      } as any });
      toast.success("Produto criado");
      setOpen(false); setName(""); setSlug(""); setCategoryId("");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      window.location.href = `/admin/produtos/${r.id}`;
    } catch (e: any) { toast.error("Falha", { description: e.message }); }
  }

  async function onDelete(id: string) {
    if (!confirm("Excluir este produto?")) return;
    try {
      await delFn({ data: { id } });
      toast.success("Excluído");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["public-data"] });
    } catch (e: any) { toast.error("Falha", { description: e.message }); }
  }

  async function onToggle(id: string, active: boolean) {
    await toggleFn({ data: { id, active } });
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["public-data"] });
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-sm text-muted-foreground">{products.length} produtos no catálogo.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Novo produto</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo produto</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Nome</Label>
                <Input value={name} onChange={(e) => { setName(e.target.value); if (!slug) setSlug(slugify(e.target.value)); }} />
              </div>
              <div><Label>Slug (URL)</Label><Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} /></div>
              <div>
                <Label>Categoria</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                  <SelectContent>
                    {cats.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter><Button onClick={create}>Criar e editar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou código..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase">
              <tr>
                <th className="text-left p-3 w-12"></th>
                <th className="text-left p-3">Produto</th>
                <th className="text-left p-3">Código</th>
                <th className="text-left p-3">Categoria</th>
                <th className="text-left p-3">Ativo</th>
                <th className="text-right p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p: any) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-2"><img src={p.image || "/placeholder.svg"} alt="" className="h-10 w-10 rounded object-cover bg-muted" /></td>
                  <td className="p-3"><Link to="/admin/produtos/$id" params={{ id: p.id }} className="font-medium hover:text-brand">{p.name}</Link><p className="text-xs text-muted-foreground">{p.slug}</p></td>
                  <td className="p-3 font-mono text-xs">{p.code}</td>
                  <td className="p-3 text-muted-foreground">{p.category_name ?? "—"}</td>
                  <td className="p-3"><Switch checked={p.active} onCheckedChange={(v) => onToggle(p.id, v)} /></td>
                  <td className="p-3 text-right space-x-1">
                    <Link to="/admin/produtos/$id" params={{ id: p.id }}>
                      <Button variant="ghost" size="sm"><Edit className="h-3.5 w-3.5" /></Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(p.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Nenhum produto.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
