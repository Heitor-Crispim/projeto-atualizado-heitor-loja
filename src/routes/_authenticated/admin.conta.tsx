import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/conta")({
  component: AccountPage,
});

function AccountPage() {
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function changePassword() {
    if (password.length < 6) return toast.error("Senha muito curta");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error("Falha", { description: error.message });
    toast.success("Senha alterada");
    setPassword("");
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Minha conta</h1>
      <Card><CardHeader><CardTitle className="text-base">Dados</CardTitle></CardHeader><CardContent>
        <div><Label>E-mail</Label><Input value={user?.email ?? ""} disabled /></div>
      </CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Alterar senha</CardTitle></CardHeader><CardContent className="space-y-3">
        <div><Label>Nova senha</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button onClick={changePassword} disabled={loading}>{loading ? "Salvando..." : "Salvar nova senha"}</Button>
      </CardContent></Card>
    </div>
  );
}
