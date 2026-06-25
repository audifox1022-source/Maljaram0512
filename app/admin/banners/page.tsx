import { getAllBannersAdmin } from "@/lib/supabase/banners";
import { createClient } from "@supabase/supabase-js";
import { BannersAdmin } from "./BannersAdmin";

export const dynamic = "force-dynamic";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || url.includes("your-project")) return null;
  return createClient(url, key);
}

export default async function AdminBannersPage() {
  const supabase = getAdminClient();
  const banners = await getAllBannersAdmin(supabase);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--color-brand-teal)" }}>
          메인 히어로 배너 및 진입 팝업 모달 관리
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          홈페이지 상단 롤링 슬라이드 배너와 첫 방문 시 노출되는 '오늘 하루 그만보기' 공지 팝업을 생성·삭제하고 노출 기간을 제어합니다.
        </p>
      </div>

      <BannersAdmin initialBanners={banners} />
    </div>
  );
}
