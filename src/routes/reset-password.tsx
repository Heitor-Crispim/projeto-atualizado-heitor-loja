import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({ meta: [{ title: "Definir nova senha — Marcio Alegre" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const url = new URL(window.location.href);
        const search = url.searchParams;
        const hash = new URLSearchParams(url.hash.replace(/^#/, ""));

        const errDescription = search.get("error_description") || hash.get("error_description");
        if (errDescription) throw new Error(decodeURIComponent(errDescription));

        // 1) PKCE flow: ?code=...
        const code = search.get("code");
        if (code) {
          const { error: exErr } = await supabase.auth.exchangeCodeForSession(code);
          if (exErr) throw exErr;
          // Clean URL
          window.history.replaceState({}, "", url.pathname);
        }

        // 2) Implicit recovery flow: #access_token=...&type=recovery
        const accessToken = hash.get("access_token");
        const refreshToken = hash.get("refresh_token");
        if (accessToken && refreshToken) {
          const { error: sErr } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (sErr) throw sErr;
          window.history.replaceState({}, "", url.pathname);
        }

        // 3) Confirm we have a session
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        setHasSession(!!data.session);
        if (!data.session) setError("Link inválido ou expirado. Solicite uma nova recuperação.");
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message ?? "Não foi possível validar o link de recuperação.");
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    void bootstrap();
    return () => { cancelled = true; };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) return toast.error("As senhas não coincidem");
    if (password.length < 6) return toast.error("Senha muito curta");
    setLoading(true);
    const { error: upErr } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (upErr) return toast.error("Não foi possível redefinir", { description: upErr.message });
    toast.success("Senha alterada!");
    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen grid place-items-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Definir nova senha</CardTitle>
          <CardDescription>Informe sua nova senha para concluir a recuperação.</CardDescription>
        </CardHeader>
        <CardContent>
          {!ready ? (
            <p className="text-sm text-muted-foreground">Validando link...</p>
          ) : !hasSession ? (
            <div className="space-y-3">
              <p className="text-sm text-destructive">{error ?? "Link inválido."}</p>
              <Button variant="outline" className="w-full" onClick={() => navigate({ to: "/auth" })}>
                Voltar ao login
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-3">
              <div><Label>Nova senha</Label><Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
              <div><Label>Confirmar senha</Label><Input type="password" required minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} /></div>
              <Button type="submit" disabled={loading} className="w-full">{loading ? "Salvando..." : "Salvar nova senha"}</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
