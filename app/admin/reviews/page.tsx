import { getAllReviewsAdmin } from "@/lib/supabase/reviews";
import { createClient } from "@supabase/supabase-js";
import { ReviewsAdmin } from "./ReviewsAdmin";

export const dynamic = "force-dynamic";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || url.includes("your-project")) return null;
  return createClient(url, key);
}

export default async function AdminReviewsPage() {
  const supabase = getAdminClient();
  const reviews = await getAllReviewsAdmin(supabase);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--color-brand-teal)" }}>
          학부모 및 내담자 이용 후기 관리
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          온라인으로 접수된 미승인 대기 후기를 검토하여 메인에 승인·공개하거나 신규 후기를 직접 등록하고 순서와 익명 옵션을 제어합니다.
        </p>
      </div>

      <ReviewsAdmin initialReviews={reviews} />
    </div>
  );
}
