import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getDashboardStats } from "@/lib/data/admin.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Tags, Award, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: DashboardPage,
});

function DashboardPage() {
  const fn = useServerFn(getDashboardStats);
  const { data, isLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: () => fn() });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do conteúdo do site.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Produtos", value: data?.products ?? 0, icon: Package },
          { label: "Categorias", value: data?.categories ?? 0, icon: Tags },
          { label: "Marcas", value: data?.brands ?? 0, icon: Award },
          { label: "Imagens", value: data?.images ?? 0, icon: ImageIcon },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase">{s.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-3xl font-bold">{isLoading ? "—" : s.value}</div></CardContent>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Últimos produtos cadastrados</CardTitle></CardHeader>
        <CardContent>
          {(data?.recent ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum produto cadastrado.</p>
          ) : (
            <ul className="divide-y divide-border">
              {data!.recent.map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-3">
                  <img src={p.image || "/placeholder.svg"} alt="" className="h-12 w-12 rounded-md object-cover bg-muted" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString("pt-BR")}</p>
                  </div>
                  <Link to="/admin/produtos/$id" params={{ id: p.id }} className="text-xs text-brand font-semibold">Editar</Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
