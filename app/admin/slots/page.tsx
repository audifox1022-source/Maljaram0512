import { getAdminSlots, getAdminCounselors } from "@/lib/supabase/admin";
import { SlotsAdmin } from "./SlotsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminSlotsPage() {
  const [slots, counselors] = await Promise.all([
    getAdminSlots(),
    getAdminCounselors(),
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--color-brand-teal)" }}>
          가용 예약 슬롯 설정
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          전문가별로 학부모 상담이 가능한 날짜와 시간대를 오픈하거나, 갑작스러운 센터 일정으로 마감 처리할 수 있습니다.
        </p>
      </div>

      <SlotsAdmin initialSlots={slots} counselors={counselors} />
    </div>
  );
}
