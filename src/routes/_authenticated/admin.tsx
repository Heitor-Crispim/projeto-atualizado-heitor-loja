import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/use-auth";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { ADMIN_EMAIL } from "@/lib/admin-config";
import {
  LayoutDashboard, Package, Tags, Award, Settings, User, LogOut, ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ name: "robots", content: "noindex,nofollow" }] }),
  component: AdminLayout,
});


const nav: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/produtos", label: "Produtos", icon: Package },
  { to: "/admin/categorias", label: "Categorias", icon: Tags },
  { to: "/admin/marcas", label: "Marcas", icon: Award },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
  { to: "/admin/conta", label: "Minha conta", icon: User },
];

function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const emailOk = user?.email?.toLowerCase() === ADMIN_EMAIL;
  const allowed = isAdmin && emailOk;

  useEffect(() => {
    if (!loading && (!user || !allowed)) {
      if (user && !allowed) void signOut();
      navigate({ to: "/auth" });
    }
  }, [loading, user, allowed, navigate, signOut]);

  if (loading || !user) {
    return <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">Carregando...</div>;
  }
  if (!allowed) {
    return (
      <div className="min-h-screen grid place-items-center p-6 text-center">
        <div>
          <h1 className="text-xl font-bold">Acesso restrito</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sua conta não possui permissão de administrador.</p>
          <Button className="mt-4" onClick={async () => { await signOut(); navigate({ to: "/auth" }); }}>Sair</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-muted/20">
      <aside className="hidden md:flex w-60 flex-col border-r border-border bg-background">
        <div className="h-16 px-5 flex items-center border-b border-border"><Logo /></div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => {
            const active = n.exact ? location.pathname === n.to : location.pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to as any}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                  active ? "bg-foreground text-background" : "hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border space-y-2">
          <Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
            <ExternalLink className="h-3 w-3" /> Ver site
          </Link>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          <Button variant="outline" size="sm" className="w-full" onClick={async () => { await signOut(); navigate({ to: "/auth" }); }}>
            <LogOut className="h-3.5 w-3.5 mr-1" /> Sair
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-14 px-4 flex items-center justify-between border-b border-border bg-background">
          <Logo />
          <Button size="sm" variant="outline" onClick={async () => { await signOut(); navigate({ to: "/auth" }); }}>
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
