import { getAllGalleryAdmin } from "@/lib/supabase/gallery";
import { createClient } from "@supabase/supabase-js";
import { GalleryAdmin } from "./GalleryAdmin";

export const dynamic = "force-dynamic";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || url.includes("your-project")) return null;
  return createClient(url, key);
}

export default async function AdminGalleryPage() {
  const supabase = getAdminClient();
  const items = await getAllGalleryAdmin(supabase);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--color-brand-teal)" }}>
          연구소 시설 안내 및 치료 교구 사진 갤러리 관리
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          센터 전경과 치료실 교구 사진을 등록하고 카테고리(치료실시설, 대기실, 치료교구 등)와 노출 순서를 변경합니다. 등록된 사진은 공개 갤러리(/gallery)에 반응형 그리드로 렌더링됩니다.
        </p>
      </div>

      <GalleryAdmin initialItems={items} />
    </div>
  );
}
