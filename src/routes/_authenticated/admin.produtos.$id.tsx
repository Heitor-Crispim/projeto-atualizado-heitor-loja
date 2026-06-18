import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import {
  adminGetProduct, adminListCategories, upsertProduct, replaceVariants,
  replaceImages, replaceSpecs, createUploadUrl, getSignedImageUrl,
} from "@/lib/data/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, ChevronLeft, ChevronUp, ChevronDown, Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/produtos/$id")({
  component: ProductEditor,
});

type Img = { id?: string; url: string; kind: string; caption: string | null; sort_order: number };
type Variant = { id?: string; code: string; color: string; hex: string; sort_order: number };
type Spec = { id?: string; label: string; value: string; sort_order: number };

function arrField(v?: string[]): string { return (v ?? []).join("\n"); }
function parseArr(s: string): string[] { return s.split("\n").map((x) => x.trim()).filter(Boolean); }

async function uploadFile(file: File, uploadFn: typeof createUploadUrl, signFn: typeof getSignedImageUrl): Promise<string> {
  const { uploadUrl, path } = await uploadFn({ data: { filename: file.name, contentType: file.type } });
  const put = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!put.ok) throw new Error(`Upload falhou (${put.status})`);
  const { url } = await signFn({ data: { path } });
  if (!url) throw new Error("Não foi possível gerar o link da imagem");
  return url;
}

function ProductEditor() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const getFn = useServerFn(adminGetProduct);
  const catsFn = useServerFn(adminListCategories);
  const upsertFn = useServerFn(upsertProduct);
  const variantsFn = useServerFn(replaceVariants);
  const imagesFn = useServerFn(replaceImages);
  const specsFn = useServerFn(replaceSpecs);
  const upFn = useServerFn(createUploadUrl);
  const signFn = useServerFn(getSignedImageUrl);

  const { data, isLoading } = useQuery({ queryKey: ["admin-product", id], queryFn: () => getFn({ data: { id } }) });
  const { data: cats = [] } = useQuery({ queryKey: ["admin-categories"], queryFn: () => catsFn() });

  const [form, setForm] = useState<any>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [images, setImages] = useState<Img[]>([]);
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data) return;
    setForm({
      ...data.product,
      applicationsText: arrField(data.product.applications),
      purposesText: arrField(data.product.purposes),
      sizesText: arrField(data.product.sizes),
      thicknessOptText: arrField(data.product.thickness_options),
      widthOptText: arrField(data.product.width_options),
      saleUnitOptText: arrField(data.product.sale_unit_options),
    });
    setVariants(data.variants.map((v: any) => ({ ...v })));
    setImages(data.images.map((i: any) => ({ ...i })));
    setSpecs(data.specs.map((s: any) => ({ ...s })));
  }, [data]);

  if (isLoading || !form) return <p className="text-sm text-muted-foreground">Carregando...</p>;

  async function saveAll() {
    setSaving(true);
    try {
      await upsertFn({ data: {
        id: form.id, slug: form.slug, name: form.name, code: form.code ?? "",
        category_id: form.category_id, short_description: form.short_description ?? "",
        description: form.description ?? "", image: form.image ?? "",
        applications: parseArr(form.applicationsText),
        purposes: parseArr(form.purposesText),
        sizes: parseArr(form.sizesText),
        thickness: form.thickness || null, material: form.material || null,
        width: form.width || null, length: form.length || null,
        finish: form.finish || null, type_of_use: form.type_of_use || null,
        resistance: form.resistance || null,
        thickness_options: parseArr(form.thicknessOptText),
        width_options: parseArr(form.widthOptText),
        sale_unit_options: parseArr(form.saleUnitOptText),
        active: form.active, sort_order: form.sort_order ?? 0,
      } as any });
      await variantsFn({ data: { product_id: form.id, variants: variants.map((v, i) => ({ ...v, sort_order: i, id: undefined })) } });
      await imagesFn({ data: { product_id: form.id, images: images.map((v, i) => ({ ...v, sort_order: i, id: undefined })) } });
      await specsFn({ data: { product_id: form.id, specs: specs.map((v, i) => ({ ...v, sort_order: i, id: undefined })) } });
      toast.success("Salvo!");
      qc.invalidateQueries({ queryKey: ["admin-product", id] });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["public-data"] });
    } catch (e: any) { toast.error("Falha", { description: e.message }); }
    finally { setSaving(false); }
  }

  async function uploadMain(file: File) {
    try {
      const url = await uploadFile(file, upFn as any, signFn as any);
      setForm({ ...form, image: url });
      toast.success("Imagem principal atualizada");
    } catch (e: any) { toast.error("Upload falhou", { description: e.message }); }
  }

  async function addImage(kind: string, file: File) {
    try {
      const url = await uploadFile(file, upFn as any, signFn as any);
      setImages([...images, { url, kind, caption: "", sort_order: images.length }]);
    } catch (e: any) { toast.error("Upload falhou", { description: e.message }); }
  }

  function move<T>(arr: T[], idx: number, dir: -1 | 1): T[] {
    const ni = idx + dir;
    if (ni < 0 || ni >= arr.length) return arr;
    const out = [...arr]; [out[idx], out[ni]] = [out[ni], out[idx]]; return out;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/admin/produtos" })}>
          <ChevronLeft className="h-4 w-4" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold flex-1">{form.name}</h1>
        <div className="flex items-center gap-2">
          <Label className="text-sm">Ativo</Label>
          <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
        </div>
        <Button onClick={saveAll} disabled={saving}>{saving ? "Salvando..." : "Salvar tudo"}</Button>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="variants">Variações ({variants.length})</TabsTrigger>
          <TabsTrigger value="images">Imagens ({images.length})</TabsTrigger>
          <TabsTrigger value="specs">Especificações ({specs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card><CardHeader><CardTitle className="text-base">Identificação</CardTitle></CardHeader><CardContent className="grid md:grid-cols-2 gap-3">
            <div><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            <div><Label>Código base</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
            <div>
              <Label>Categoria</Label>
              <Select value={form.category_id ?? ""} onValueChange={(v) => setForm({ ...form, category_id: v || null })}>
                <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>
                  {cats.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2"><Label>Descrição curta</Label><Textarea rows={2} value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} /></div>
            <div className="md:col-span-2"><Label>Descrição completa</Label><Textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          </CardContent></Card>

          <Card><CardHeader><CardTitle className="text-base">Imagem principal</CardTitle></CardHeader><CardContent className="space-y-3">
            {form.image && <img src={form.image} alt="" className="h-48 w-48 object-cover rounded border border-border" />}
            <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="URL da imagem" />
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadMain(f); }} />
              <Button type="button" variant="outline" asChild><span><Upload className="h-4 w-4 mr-1" /> Enviar imagem</span></Button>
            </label>
          </CardContent></Card>

          <Card><CardHeader><CardTitle className="text-base">Informações rápidas e aplicações</CardTitle></CardHeader><CardContent className="grid md:grid-cols-2 gap-3">
            <div><Label>Aplicações recomendadas (uma por linha)</Label><Textarea rows={4} value={form.applicationsText} onChange={(e) => setForm({ ...form, applicationsText: e.target.value })} /></div>
            <div><Label>Finalidades (uma por linha)</Label><Textarea rows={4} value={form.purposesText} onChange={(e) => setForm({ ...form, purposesText: e.target.value })} /></div>
            <div><Label>Medidas (uma por linha)</Label><Textarea rows={3} value={form.sizesText} onChange={(e) => setForm({ ...form, sizesText: e.target.value })} /></div>
            <div><Label>Opções de espessura</Label><Textarea rows={3} value={form.thicknessOptText} onChange={(e) => setForm({ ...form, thicknessOptText: e.target.value })} /></div>
            <div><Label>Opções de largura</Label><Textarea rows={3} value={form.widthOptText} onChange={(e) => setForm({ ...form, widthOptText: e.target.value })} /></div>
            <div><Label>Opções de venda</Label><Textarea rows={3} value={form.saleUnitOptText} onChange={(e) => setForm({ ...form, saleUnitOptText: e.target.value })} /></div>
          </CardContent></Card>

          <Card><CardHeader><CardTitle className="text-base">Atributos técnicos rápidos</CardTitle></CardHeader><CardContent className="grid md:grid-cols-2 gap-3">
            {[
              ["thickness","Espessura"],["material","Material"],["width","Largura"],["length","Comprimento"],
              ["finish","Acabamento"],["type_of_use","Tipo de uso"],["resistance","Resistência"],
            ].map(([k, label]) => (
              <div key={k}><Label>{label}</Label><Input value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
            ))}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="variants" className="space-y-3">
          <Button size="sm" onClick={() => setVariants([...variants, { code: "", color: "", hex: "#999999", sort_order: variants.length }])}>
            <Plus className="h-4 w-4 mr-1" /> Adicionar variação
          </Button>
          <Card><CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase"><tr>
                <th className="p-2 text-left">Código</th><th className="p-2 text-left">Cor</th><th className="p-2 text-left">Hex</th><th className="p-2 w-32"></th>
              </tr></thead>
              <tbody>
                {variants.map((v, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-2"><Input value={v.code} onChange={(e) => { const a = [...variants]; a[i] = { ...a[i], code: e.target.value }; setVariants(a); }} /></td>
                    <td className="p-2"><Input value={v.color} onChange={(e) => { const a = [...variants]; a[i] = { ...a[i], color: e.target.value }; setVariants(a); }} /></td>
                    <td className="p-2 flex items-center gap-2"><Input type="color" value={v.hex} onChange={(e) => { const a = [...variants]; a[i] = { ...a[i], hex: e.target.value }; setVariants(a); }} className="w-16 h-9 p-1" /><Input value={v.hex} onChange={(e) => { const a = [...variants]; a[i] = { ...a[i], hex: e.target.value }; setVariants(a); }} /></td>
                    <td className="p-2 text-right">
                      <Button size="sm" variant="ghost" onClick={() => setVariants(move(variants, i, -1))}><ChevronUp className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setVariants(move(variants, i, 1))}><ChevronDown className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setVariants(variants.filter((_, x) => x !== i))}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    </td>
                  </tr>
                ))}
                {variants.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Sem variações.</td></tr>}
              </tbody>
            </table>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-3">
          <div className="flex gap-2">
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) addImage("gallery", f); e.target.value = ""; }} />
              <Button type="button" variant="outline" asChild><span><Upload className="h-4 w-4 mr-1" /> Adicionar à galeria</span></Button>
            </label>
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) addImage("application", f); e.target.value = ""; }} />
              <Button type="button" variant="outline" asChild><span><Upload className="h-4 w-4 mr-1" /> Aplicação real</span></Button>
            </label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((img, i) => (
              <Card key={i} className="overflow-hidden">
                <img src={img.url} alt="" className="aspect-square object-cover w-full bg-muted" />
                <CardContent className="p-3 space-y-2">
                  <Select value={img.kind} onValueChange={(v) => { const a = [...images]; a[i] = { ...a[i], kind: v }; setImages(a); }}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gallery">Galeria</SelectItem>
                      <SelectItem value="application">Aplicação real</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input className="h-8 text-xs" placeholder="Legenda" value={img.caption ?? ""} onChange={(e) => { const a = [...images]; a[i] = { ...a[i], caption: e.target.value }; setImages(a); }} />
                  <div className="flex justify-between">
                    <div>
                      <Button size="sm" variant="ghost" onClick={() => setImages(move(images, i, -1))}><ChevronUp className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setImages(move(images, i, 1))}><ChevronDown className="h-3 w-3" /></Button>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => setImages(images.filter((_, x) => x !== i))}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {images.length === 0 && <p className="col-span-full text-center text-sm text-muted-foreground py-8">Sem imagens.</p>}
          </div>
        </TabsContent>

        <TabsContent value="specs" className="space-y-3">
          <Button size="sm" onClick={() => setSpecs([...specs, { label: "", value: "", sort_order: specs.length }])}>
            <Plus className="h-4 w-4 mr-1" /> Adicionar especificação
          </Button>
          <Card><CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase"><tr>
                <th className="p-2 text-left">Atributo</th><th className="p-2 text-left">Valor</th><th className="p-2 w-32"></th>
              </tr></thead>
              <tbody>
                {specs.map((s, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-2"><Input value={s.label} onChange={(e) => { const a = [...specs]; a[i] = { ...a[i], label: e.target.value }; setSpecs(a); }} placeholder="Ex.: Material" /></td>
                    <td className="p-2"><Input value={s.value} onChange={(e) => { const a = [...specs]; a[i] = { ...a[i], value: e.target.value }; setSpecs(a); }} placeholder="Ex.: 100% PVC" /></td>
                    <td className="p-2 text-right">
                      <Button size="sm" variant="ghost" onClick={() => setSpecs(move(specs, i, -1))}><ChevronUp className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setSpecs(move(specs, i, 1))}><ChevronDown className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => setSpecs(specs.filter((_, x) => x !== i))}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    </td>
                  </tr>
                ))}
                {specs.length === 0 && <tr><td colSpan={3} className="p-6 text-center text-muted-foreground">Sem especificações.</td></tr>}
              </tbody>
            </table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Link to="/admin/produtos"><Button variant="outline">Cancelar</Button></Link>
        <Button onClick={saveAll} disabled={saving}>{saving ? "Salvando..." : "Salvar tudo"}</Button>
      </div>
    </div>
  );
}
