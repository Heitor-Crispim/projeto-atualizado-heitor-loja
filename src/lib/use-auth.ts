import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AuthUser = { id: string; email: string };

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function refresh(u: AuthUser | null) {
      if (!u) {
        if (!cancelled) { setIsAdmin(false); setLoading(false); }
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", u.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!cancelled) {
        setIsAdmin(!!data);
        setLoading(false);
      }
    }
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user ? { id: data.user.id, email: data.user.email ?? "" } : null;
      if (!cancelled) setUser(u);
      void refresh(u);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ? { id: session.user.id, email: session.user.email ?? "" } : null;
      setUser(u);
      setLoading(true);
      void refresh(u);
    });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return { user, isAdmin, loading, signOut };
}
