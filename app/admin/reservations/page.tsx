import { getAdminReservations } from "@/lib/supabase/admin";
import { ReservationsAdmin } from "./ReservationsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminReservationsPage() {
  const initialReservations = await getAdminReservations("all");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--color-brand-teal)" }}>
          상담 예약 종합 관리
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          예약자의 아동 정보를 확인하고 예약을 최종 확정하거나 취소 처리할 수 있습니다. 확정 시 자동 안내 문자가 발송됩니다.
        </p>
      </div>

      <ReservationsAdmin initialList={initialReservations} />
    </div>
  );
}
