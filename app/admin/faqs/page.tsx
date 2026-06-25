import { getFaqList } from "@/lib/supabase/content";
import { FaqsAdmin } from "./FaqsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const list = await getFaqList(false); // onlyPublished=false 전체

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--color-brand-teal)" }}>
          자주 묻는 질문 (FAQ) 아코디언 관리
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          학부모님들이 전화나 문의로 가장 많이 질문하시는 내용들을 정리하여 언제든 홈페이지 문답란에 업데이트 하실 수 있습니다.
        </p>
      </div>

      <FaqsAdmin initialList={list} />
    </div>
  );
}
