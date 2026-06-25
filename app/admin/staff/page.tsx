import { getStaffList } from "@/lib/supabase/content";
import { StaffAdmin } from "./StaffAdmin";

export const dynamic = "force-dynamic";

export default async function AdminStaffPage() {
  const staffList = await getStaffList(false); // onlyPublished=false 전체 조회

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--color-brand-teal)" }}>
          센터 연구·치료진 전문가 프로필 관리
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          새로운 치료사 선생님의 프로필을 추가하거나 약력을 업데이트하고 홈페이지 노출 순서를 정할 수 있습니다.
        </p>
      </div>

      <StaffAdmin initialList={staffList} />
    </div>
  );
}
