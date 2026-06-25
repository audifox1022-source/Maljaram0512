import { getAllPostsAdmin } from "@/lib/supabase/posts";
import { createClient } from "@supabase/supabase-js";
import { NoticesAdmin } from "./NoticesAdmin";

export const dynamic = "force-dynamic";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || url.includes("your-project")) return null;
  return createClient(url, key);
}

export default async function AdminNoticesPage() {
  const supabase = getAdminClient();
  const posts = await getAllPostsAdmin(supabase);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--color-brand-teal)" }}>
          센터 공지사항 및 치료 일정·칼럼 소식 게시판
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          연구소 공식 공지사항과 발달 치료 칼럼을 작성하고 공개 예약 일정을 설정합니다. 작성된 소식은 고객 공개 뉴스 페이지(/news)에 자동 연동됩니다.
        </p>
      </div>

      <NoticesAdmin initialPosts={posts} />
    </div>
  );
}
