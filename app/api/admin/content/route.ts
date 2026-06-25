import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key || url === "your_supabase_project_url") {
    return null;
  }

  return createClient(url, key);
}

async function executeContentAdmin(req: Request) {
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
        if (error) console.warn("Supabase RLS 권한 경고(서비스 롤 키 필요):", error.message);
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

    /* ═════════════════════════════════════════════
        5. 사이트 기본설정 싱글톤 저장 (site_settings)
    ═════════════════════════════════════════════ */
    if (type === "settings" && action === "save") {
      if (supabase) {
        const payload = { ...data, id: 1, updated_at: new Date().toISOString() };
        const { error } = await supabase.from("site_settings").upsert(payload, { onConflict: "id" });
        if (error) console.warn("Supabase RLS 권한 경고(서비스 롤 키 필요):", error.message);
      }
      return NextResponse.json({ success: true, message: "사이트 기본 설정이 성공적으로 반영되었습니다." });
    }

    /* ═════════════════════════════════════════════
        6. 네비게이션 메뉴 CRUD (nav_menus)
    ═════════════════════════════════════════════ */
    if (type === "menu") {
      if (action === "save") {
        const { id, label, href, location, display_order, visible } = data;
        if (supabase) {
          const payload = { label, href, location: location || "header", display_order: Number(display_order) || 0, visible: Boolean(visible) };
          if (id && !id.startsWith("nm-temp")) {
            await supabase.from("nav_menus").update(payload).eq("id", id);
          } else {
            const newId = `menu_${Date.now()}`;
            await supabase.from("nav_menus").insert({ ...payload, id: newId });
          }
        }
        return NextResponse.json({ success: true, message: "메뉴 설정이 저장되었습니다." });
      }

      if (action === "delete" && data?.id) {
        if (supabase && !data.id.startsWith("nm-temp")) {
          await supabase.from("nav_menus").delete().eq("id", data.id);
        }
        return NextResponse.json({ success: true, message: "메뉴 항목이 삭제되었습니다." });
      }
    }

    /* ═════════════════════════════════════════════
        7. 메인 배너 및 팝업 CRUD (banners)
    ═════════════════════════════════════════════ */
    if (type === "banner") {
      if (action === "save") {
        const { id, title, image_url, link_url, type: bType, active, start_at, end_at, display_order } = data;
        if (supabase) {
          const payload = {
            title,
            image_url: image_url || "/file.svg",
            link_url: link_url || "",
            type: bType || "hero",
            active: Boolean(active),
            start_at: start_at || null,
            end_at: end_at || null,
            display_order: Number(display_order) || 0,
          };

          if (id && !id.startsWith("bn-temp")) {
            await supabase.from("banners").update(payload).eq("id", id);
          } else {
            const newId = `banner_${Date.now()}`;
            await supabase.from("banners").insert({ ...payload, id: newId });
          }
        }
        return NextResponse.json({ success: true, message: "배너 설정이 반영되었습니다." });
      }

      if (action === "delete" && data?.id) {
        if (supabase && !data.id.startsWith("bn-temp")) {
          await supabase.from("banners").delete().eq("id", data.id);
        }
        return NextResponse.json({ success: true, message: "배너가 삭제되었습니다." });
      }
    }

    /* ═════════════════════════════════════════════
        8. 이용 후기 CRUD (reviews)
    ═════════════════════════════════════════════ */
    if (type === "review") {
      if (action === "save") {
        const { id, author_name, content, rating, image_url, is_anonymous, published, display_order } = data;
        if (supabase) {
          const payload = {
            author_name,
            content,
            rating: Number(rating) || 5,
            image_url: image_url || null,
            is_anonymous: Boolean(is_anonymous),
            published: Boolean(published),
            display_order: Number(display_order) || 0,
          };

          if (id && !id.startsWith("rv-temp")) {
            await supabase.from("reviews").update(payload).eq("id", id);
          } else {
            const newId = `review_${Date.now()}`;
            await supabase.from("reviews").insert({ ...payload, id: newId });
          }
        }
        return NextResponse.json({ success: true, message: "이용 후기 설정이 저장되었습니다." });
      }

      if (action === "delete" && data?.id) {
        if (supabase && !data.id.startsWith("rv-temp")) {
          await supabase.from("reviews").delete().eq("id", data.id);
        }
        return NextResponse.json({ success: true, message: "후기가 삭제되었습니다." });
      }
    }

    /* ═════════════════════════════════════════════
        9. 공지사항 및 소식 CRUD (posts)
    ═════════════════════════════════════════════ */
    if (type === "post") {
      if (action === "save") {
        const { id, slug, title, body, thumbnail_url, category, published, published_at } = data;
        if (supabase) {
          // 한글 제목 영어 자동 치환 혹은 유니코드 슬러그 처리
          const safeSlug = slug
            ? encodeURIComponent(slug.trim().toLowerCase().replace(/\s+/g, "-"))
            : `post-${Date.now()}`;

          const payload = {
            slug: safeSlug,
            title,
            body,
            thumbnail_url: thumbnail_url || null,
            category: category || "공지사항",
            published: Boolean(published),
            published_at: published_at || new Date().toISOString(),
          };

          if (id && !id.startsWith("pt-temp")) {
            await supabase.from("posts").update(payload).eq("id", id);
          } else {
            const newId = `post_${Date.now()}`;
            await supabase.from("posts").insert({ ...payload, id: newId });
          }
        }
        return NextResponse.json({ success: true, message: "게시글이 저장되었습니다." });
      }

      if (action === "delete" && data?.id) {
        if (supabase && !data.id.startsWith("pt-temp")) {
          await supabase.from("posts").delete().eq("id", data.id);
        }
        return NextResponse.json({ success: true, message: "게시글이 삭제되었습니다." });
      }
    }

    /* ═════════════════════════════════════════════
        10. 사진 갤러리 CRUD (gallery_items)
    ═════════════════════════════════════════════ */
    if (type === "gallery") {
      if (action === "save") {
        const { id, image_url, caption, category, display_order, published } = data;
        if (supabase) {
          const payload = {
            image_url,
            caption: caption || "",
            category: category || "치료실시설",
            display_order: Number(display_order) || 0,
            published: Boolean(published),
          };

          if (id && !id.startsWith("gi-temp")) {
            await supabase.from("gallery_items").update(payload).eq("id", id);
          } else {
            const newId = `gal_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            await supabase.from("gallery_items").insert({ ...payload, id: newId });
          }
        }
        return NextResponse.json({ success: true, message: "사진 항목이 반영되었습니다." });
      }

      if (action === "delete" && data?.id) {
        if (supabase && !data.id.startsWith("gi-temp")) {
          await supabase.from("gallery_items").delete().eq("id", data.id);
        }
        return NextResponse.json({ success: true, message: "사진이 삭제되었습니다." });
      }
    }

    /* ═════════════════════════════════════════════
        11. 페이지별 SEO 메타 저장 (page_seo)
    ═════════════════════════════════════════════ */
    if (type === "seo") {
      if (action === "save") {
        const { id, path, title, description, keywords, og_image_url } = data;
        if (supabase && path) {
          const payload = {
            title,
            description,
            keywords: keywords || "",
            og_image_url: og_image_url || null,
            updated_at: new Date().toISOString(),
          };

          if (id) {
            await supabase.from("page_seo").update(payload).eq("id", id);
          } else {
            const newId = `seo_${Date.now()}`;
            await supabase.from("page_seo").insert({ ...payload, id: newId, path });
          }
        }
        return NextResponse.json({ success: true, message: "SEO 설정이 갱신되었습니다." });
      }
    }

    return NextResponse.json({ success: false, error: "알 수 없는 요청입니다." }, { status: 400 });
  } catch (err: any) {
    console.error("콘텐츠 CMS API 예외:", err);
    return NextResponse.json({ success: false, error: err?.message || "서버 오류" }, { status: 500 });
  }
}

/**
 * 전역 캐시 파기(Purge)를 보장하는 래퍼 POST 핸들러
 * 관리자에서 설정/텍스트/배너/후기/게시글/갤러리 수정 성공 시 즉시 캐시 초기화
 */
export async function POST(req: Request) {
  const clonedReq = req.clone();
  const res = await executeContentAdmin(clonedReq);

  try {
    const clonedRes = res.clone();
    const data = await clonedRes.json();

    if (data?.success) {
      // 방식 B: 성능(ISR)을 유지하되 관리자 수정 성공 시 전역 풀 라우트 캐시 재검증!
      revalidatePath("/", "layout");
      revalidatePath("/about", "page");
      revalidatePath("/programs", "page");
      revalidatePath("/reservation", "page");
      revalidatePath("/contact", "page");
      revalidatePath("/faq", "page");
      revalidatePath("/news", "page");
      revalidatePath("/gallery", "page");
    }
  } catch (err) {
    console.warn("캐시 재검증 중 예외 발생:", err);
  }

  return res;
}
