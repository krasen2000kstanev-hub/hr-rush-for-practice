"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function SignOutButton({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-60",
        variant === "dark"
          ? "text-navy-300 hover:bg-white/5 hover:text-white"
          : "text-navy-500 hover:bg-navy-50 hover:text-coral-600"
      )}
    >
      <LogOut className="h-4 w-4" /> Изход
    </button>
  );
}
