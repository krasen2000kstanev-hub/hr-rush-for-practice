import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/Container";
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS, type ApplicationStatus } from "@/types/application";
import { CURRENT_SEASON } from "@/data/config";
import { Users, Inbox, CheckCircle2, PhoneCall, MessageSquareText, XCircle, Trophy, ClipboardCheck } from "lucide-react";

export const metadata = { title: "Табло" };

const STATUS_ICON: Record<ApplicationStatus, typeof Users> = {
  new: Inbox,
  reviewed: ClipboardCheck,
  contact: PhoneCall,
  interview: MessageSquareText,
  approved: CheckCircle2,
  hired: Trophy,
  rejected: XCircle,
};

async function getCounts() {
  const supabase = createClient();

  const [{ count: total }, ...statusCounts] = await Promise.all([
    supabase.from("student_applications").select("*", { count: "exact", head: true }),
    ...APPLICATION_STATUSES.map((status) =>
      supabase
        .from("student_applications")
        .select("*", { count: "exact", head: true })
        .eq("application_status", status)
    ),
  ]);

  const byStatus = APPLICATION_STATUSES.reduce<Record<ApplicationStatus, number>>((acc, status, index) => {
    acc[status] = statusCounts[index].count ?? 0;
    return acc;
  }, {} as Record<ApplicationStatus, number>);

  return { total: total ?? 0, byStatus };
}

export default async function AdminDashboardPage() {
  const { total, byStatus } = await getCounts();

  const cards = [
    { key: "total", label: "Общо кандидатури", value: total, icon: Users, color: "text-navy-900 bg-navy-100" },
    ...APPLICATION_STATUSES.map((status) => ({
      key: status,
      label: APPLICATION_STATUS_LABELS[status],
      value: byStatus[status],
      icon: STATUS_ICON[status],
      color: "text-cyan-700 bg-cyan-50",
    })),
  ];

  return (
    <Container className="max-w-none px-0">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-navy-950">Табло</h1>
        <p className="text-sm text-navy-500">
          Активен сезон: <span className="font-semibold text-navy-700">{CURRENT_SEASON}</span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.key} className="rounded-2xl border border-navy-100 bg-white p-6">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-3xl font-extrabold text-navy-950">{card.value}</p>
            <p className="mt-1 text-sm text-navy-500">{card.label}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
