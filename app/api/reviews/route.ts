import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || url.includes("your-project")) return null;
  return createClient(url, key);
}

export async function POST(req: Request) {
  try {
    const { author_name, content, rating, is_anonymous } = await req.json();

    if (!author_name || !content) {
      return NextResponse.json({ success: false, error: "작성자 이름과 내용을 모두 입력해주세요." }, { status: 400 });
    }

    const client = getClient();
    if (client) {
      const newId = `rv_guest_${Date.now()}`;
      const { error } = await client.from("reviews").insert({
        id: newId,
        author_name: author_name.trim(),
        content: content.trim(),
        rating: Number(rating) || 5,
        is_anonymous: Boolean(is_anonymous),
        published: false, // 기본 미승인 상태로 대기열 보관
        display_order: 100,
      });

      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      message: "소중한 이용 후기가 접수되었습니다. 관리자 확인 및 검토 후 메인 페이지에 정식 게시됩니다.",
    });
  } catch (err: any) {
    console.error("방문자 후기 제출 API 에러:", err);
    return NextResponse.json({ success: false, error: err?.message || "서버 통신 오류" }, { status: 500 });
  }
}
