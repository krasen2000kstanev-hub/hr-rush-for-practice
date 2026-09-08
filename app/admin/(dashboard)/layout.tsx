import { requireAdmin } from "@/lib/supabase/adminAuth";
import { AdminSidebar, AdminMobileNav } from "@/components/admin/AdminSidebar";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { admin } = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-navy-50">
      <AdminSidebar adminName={admin.full_name} />
      <div className="flex-1 overflow-x-hidden">
        <AdminMobileNav />
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
