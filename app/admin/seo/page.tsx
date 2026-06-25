import { getAllPageSeoAdmin } from "@/lib/supabase/seo";
import { createClient } from "@supabase/supabase-js";
import { SeoAdmin } from "./SeoAdmin";

export const dynamic = "force-dynamic";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || url.includes("your-project")) return null;
  return createClient(url, key);
}

export default async function AdminSeoPage() {
  const supabase = getAdminClient();
  const items = await getAllPageSeoAdmin(supabase);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--color-brand-teal)" }}>
          정적 페이지별 검색 최적화(SEO) 및 미리보기 관리
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          네이버나 구글 검색창에 각 페이지가 검색되었을 때 표시되는 파란색 제목, 초록색 주소 경로, 회색 미리보기 텍스트 및 Open Graph 사진을 실시간으로 확인하며 편집합니다.
        </p>
      </div>

      <SeoAdmin initialItems={items} />
    </div>
  );
}
