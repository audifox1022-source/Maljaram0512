import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key || url === "your_supabase_project_url") {
    return null;
  }

  return createClient(url, key);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, action, data } = body;
    const supabase = getAdminClient();

    /* ═════════════════════════════════════════════
        1. 섹션 텍스트/이미지 수정 (site_sections)
    ═════════════════════════════════════════════ */
    if (type === "section" && action === "save") {
      const { key, title, body: secBody, image_urls } = data;
      if (supabase) {
        const { error } = await supabase
          .from("site_sections")
          .upsert({ key, title, body: secBody, image_urls: image_urls || [] }, { onConflict: "key" });
        if (error) throw error;
      }
      return NextResponse.json({ success: true, message: `섹션 '${key}' 콘텐츠가 성공적으로 반영되었습니다.` });
    }

    /* ═════════════════════════════════════════════
        2. 전문가 프로필 CRUD (staff)
    ═════════════════════════════════════════════ */
    if (type === "staff") {
      if (action === "save") {
        const { id, name, role, photo_url, bio, display_order, published } = data;
        if (supabase) {
          const payload = { name, role, photo_url, bio, display_order: Number(display_order) || 0, published };
          if (id && !id.startsWith("st-")) {
            await supabase.from("staff").update(payload).eq("id", id);
          } else {
            await supabase.from("staff").insert(payload);
          }
        }
        return NextResponse.json({ success: true, message: "전문가 프로필이 저장되었습니다." });
      }

      if (action === "delete" && data?.id) {
        if (supabase && !data.id.startsWith("st-")) {
          await supabase.from("staff").delete().eq("id", data.id);
        }
        return NextResponse.json({ success: true, message: "전문가 프로필이 삭제되었습니다." });
      }

      if (action === "toggle_publish" && data?.id) {
        if (supabase && !data.id.startsWith("st-")) {
          await supabase.from("staff").update({ published: data.published }).eq("id", data.id);
        }
        return NextResponse.json({ success: true, message: "공개 상태가 변경되었습니다." });
      }
    }

    /* ═════════════════════════════════════════════
        3. 프로그램 CRUD (programs)
    ═════════════════════════════════════════════ */
    if (type === "program") {
      if (action === "save") {
        const { id, title, slug, target, summary, description, effect, process, image_url, display_order, published } = data;
        if (supabase) {
          const payload = {
            title,
            slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
            target,
            summary,
            description,
            effect,
            process,
            image_url,
            display_order: Number(display_order) || 0,
            published,
          };
          if (id && !id.startsWith("prog-")) {
            await supabase.from("programs").update(payload).eq("id", id);
          } else {
            await supabase.from("programs").insert(payload);
          }
        }
        return NextResponse.json({ success: true, message: "프로그램 정보가 갱신되었습니다." });
      }

      if (action === "delete" && data?.id) {
        if (supabase && !data.id.startsWith("prog-")) {
          await supabase.from("programs").delete().eq("id", data.id);
        }
        return NextResponse.json({ success: true, message: "프로그램이 삭제되었습니다." });
      }
    }

    /* ═════════════════════════════════════════════
        4. FAQ CRUD (faqs)
    ═════════════════════════════════════════════ */
    if (type === "faq") {
      if (action === "save") {
        const { id, question, answer, display_order, published } = data;
        if (supabase) {
          const payload = { question, answer, display_order: Number(display_order) || 0, published };
          if (id && !id.startsWith("fq-")) {
            await supabase.from("faqs").update(payload).eq("id", id);
          } else {
            await supabase.from("faqs").insert(payload);
          }
        }
        return NextResponse.json({ success: true, message: "FAQ 항목이 반영되었습니다." });
      }

      if (action === "delete" && data?.id) {
        if (supabase && !data.id.startsWith("fq-")) {
          await supabase.from("faqs").delete().eq("id", data.id);
        }
        return NextResponse.json({ success: true, message: "FAQ가 삭제되었습니다." });
      }
    }

    return NextResponse.json({ success: false, error: "알 수 없는 요청입니다." }, { status: 400 });
  } catch (err: any) {
    console.error("콘텐츠 CMS API 예외:", err);
    return NextResponse.json({ success: false, error: err?.message || "서버 오류" }, { status: 500 });
  }
}
