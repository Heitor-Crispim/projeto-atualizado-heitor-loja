import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Logo } from "@/components/site/Logo";
import { ADMIN_EMAIL } from "@/lib/admin-config";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Acesso administrativo — Marcio Alegre" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AuthPage,
});


const GENERIC_ERROR = "Não foi possível realizar o login. Verifique os dados e tente novamente.";
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;
const RL_KEY = "auth.rl";

type RL = { attempts: number; lockedUntil: number };
function readRL(): RL {
  if (typeof window === "undefined") return { attempts: 0, lockedUntil: 0 };
  try { return JSON.parse(localStorage.getItem(RL_KEY) ?? "") as RL; } catch { return { attempts: 0, lockedUntil: 0 }; }
}
function writeRL(rl: RL) {
  if (typeof window !== "undefined") localStorage.setItem(RL_KEY, JSON.stringify(rl));
}

function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    const rl = readRL();
    const now = Date.now();
    if (rl.lockedUntil > now) {
      const mins = Math.ceil((rl.lockedUntil - now) / 60000);
      return toast.error("Muitas tentativas", { description: `Aguarde ${mins} min e tente novamente.` });
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || email.trim().toLowerCase() !== ADMIN_EMAIL) {
      if (!error && email.trim().toLowerCase() !== ADMIN_EMAIL) {
        await supabase.auth.signOut();
      }
      const attempts = rl.attempts + 1;
      const lockedUntil = attempts >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0;
      writeRL({ attempts: lockedUntil ? 0 : attempts, lockedUntil });
      setLoading(false);
      return toast.error(GENERIC_ERROR);
    }

    writeRL({ attempts: 0, lockedUntil: 0 });
    setLoading(false);
    toast.success("Bem-vindo!");
    navigate({ to: "/admin" });
  }

  async function onForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Always run the request — but only the admin email yields an effect.
    if (email.trim().toLowerCase() === ADMIN_EMAIL) {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
    }
    setLoading(false);
    toast.success("Se o e-mail estiver cadastrado, você receberá um link de recuperação.");
  }


  return (
    <div className="min-h-screen grid place-items-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6"><Logo /></div>
        <Card>
          <CardHeader>
            <CardTitle>Painel Administrativo</CardTitle>
            <CardDescription>Acesso restrito ao administrador do site.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="signin">Entrar</TabsTrigger>
                <TabsTrigger value="forgot">Esqueci minha senha</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={onSignIn} className="space-y-3 pt-3">
                  <div><Label>E-mail</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                  <div><Label>Senha</Label><Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                  <Button type="submit" disabled={loading} className="w-full">{loading ? "Entrando..." : "Entrar"}</Button>
                </form>
              </TabsContent>
              <TabsContent value="forgot">
                <form onSubmit={onForgot} className="space-y-3 pt-3">
                  <div><Label>E-mail</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                  <Button type="submit" disabled={loading} className="w-full">{loading ? "Enviando..." : "Enviar link de recuperação"}</Button>
                </form>
              </TabsContent>
            </Tabs>
            <div className="mt-6 text-center text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground">← Voltar ao site</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
