import { getAdminInquiries } from "@/lib/supabase/admin";
import { InquiriesAdmin } from "./InquiriesAdmin";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const initialInquiries = await getAdminInquiries();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--color-brand-teal)" }}>
          온라인 간편 문의 회신 관리
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          학부모가 남긴 발달 고민에 대해 전화나 이메일로 답변을 드린 후 처리 상태를 [완료]로 변경하세요.
        </p>
      </div>

      <InquiriesAdmin initialList={initialInquiries} />
    </div>
  );
}
