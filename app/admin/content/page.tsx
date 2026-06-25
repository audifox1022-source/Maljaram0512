import { getSiteSections } from "@/lib/supabase/content";
import { ContentAdmin } from "./ContentAdmin";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const sections = await getSiteSections();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--color-brand-teal)" }}>
          홈페이지 주요 섹션 텍스트·이미지 편집
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          개발자 도움 없이 메인 화면 히어로 문구, 원장님 인사말, 핵심 비전 본문을 실시간으로 수정하실 수 있습니다.
        </p>
      </div>

      <ContentAdmin initialSections={sections} />
    </div>
  );
}
