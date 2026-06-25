import { createClient } from "@supabase/supabase-js";

export interface GalleryItem {
  id: string;
  image_url: string;
  caption?: string | null;
  category?: string | null;
  display_order: number;
  published: boolean;
  created_at?: string;
}

function getStaticClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || url.includes("your-project")) return null;
  return createClient(url, key);
}

/**
 * 공개 갤러리(/gallery) 페이지 노출용 사진 목록 조회
 */
export async function getPublishedGallery(): Promise<GalleryItem[]> {
  const client = getStaticClient();
  if (!client) return [];

  try {
    const { data } = await client
      .from("gallery_items")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    return (data as GalleryItem[]) || [];
  } catch {
    return [];
  }
}

/**
 * 관리자 페이지용 전체 갤러리 사진 조회
 */
export async function getAllGalleryAdmin(supabase: any): Promise<GalleryItem[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("gallery_items")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (data as GalleryItem[]) || [];
}
