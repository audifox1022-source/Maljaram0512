import { getAllNavMenusAdmin } from "@/lib/supabase/menus";
import { createClient } from "@supabase/supabase-js";
import { MenusAdmin } from "./MenusAdmin";

export const dynamic = "force-dynamic";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || url.includes("your-project")) return null;
  return createClient(url, key);
}

export default async function AdminMenusPage() {
  const supabase = getAdminClient();
  const menus = await getAllNavMenusAdmin(supabase);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--color-brand-teal)" }}>
          상단 네비게이션 및 하단 푸터 메뉴 편집
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          홈페이지 상단 메뉴바와 하단 푸터 바로가기 링크의 명칭, 연결 주소(내부/외부 URL), 순서, 표시 여부를 실시간으로 편집합니다.
        </p>
      </div>

      <MenusAdmin initialMenus={menus} />
    </div>
  );
}
