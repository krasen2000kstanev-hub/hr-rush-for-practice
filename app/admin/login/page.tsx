"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { TextField } from "@/components/forms/fields";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin";
  const notAdmin = searchParams.get("error") === "not_admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("Грешен имейл или парола.");
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-navy-900 p-8">
        <div className="mb-8 flex justify-center">
          <Logo className="text-xl" />
        </div>
        <h1 className="text-center text-lg font-bold text-white">Вход за администратори</h1>
        <p className="mt-1 text-center text-sm text-navy-400">
          Достъпът е ограничен само до оторизирани администратори.
        </p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
          <TextField
            label="Имейл"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Парола"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {(error || notAdmin) && (
            <div className="flex items-start gap-2 rounded-lg border border-coral-400/30 bg-coral-400/10 p-3 text-sm text-coral-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {notAdmin
                  ? "Този акаунт няма администраторски достъп."
                  : error}
              </span>
            </div>
          )}

          <Button type="submit" size="md" loading={loading} disabled={loading} className="mt-2">
            <LogIn className="h-4 w-4" /> Вход
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
