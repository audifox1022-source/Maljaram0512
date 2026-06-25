import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";

export interface PageSeoItem {
  id: string;
  path: string;
  title: string;
  description: string;
  keywords: string;
  og_image_url?: string | null;
  updated_at?: string;
}

function getStaticClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || url.includes("your-project")) return null;
  return createClient(url, key, {
    global: { fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }) },
  });
}

/**
 * 특정 경로(path)의 SEO 메타데이터 동적 조회 함수 (ISR/SSG 호환)
 */
export async function getPageSeo(path: string, fallback: Metadata): Promise<Metadata> {
  const client = getStaticClient();
  if (!client || !path) return fallback;

  try {
    const { data } = await client.from("page_seo").select("*").eq("path", path).single();
    if (!data) return fallback;

    const seo = data as PageSeoItem;
    const kwArr = seo.keywords ? seo.keywords.split(",").map((k) => k.trim()).filter(Boolean) : undefined;

    return {
      title: seo.title || fallback.title,
      description: seo.description || fallback.description,
      keywords: kwArr || (fallback as any).keywords,
      openGraph: {
        title: seo.title || (fallback.openGraph as any)?.title || "",
        description: seo.description || (fallback.openGraph as any)?.description || "",
        images: seo.og_image_url ? [seo.og_image_url] : (fallback.openGraph as any)?.images || [],
      },
    };
  } catch {
    return fallback;
  }
}

/**
 * 관리자 편집용 전체 정적 페이지 SEO 설정 조회
 */
export async function getAllPageSeoAdmin(supabase: any): Promise<PageSeoItem[]> {
  if (!supabase) return [];
  const { data } = await supabase.from("page_seo").select("*").order("path", { ascending: true });
  return (data as PageSeoItem[]) || [];
}
