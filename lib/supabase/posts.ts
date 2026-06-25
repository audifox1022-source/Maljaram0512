import { createClient } from "@supabase/supabase-js";

export interface Post {
  id: string;
  slug: string;
  title: string;
  body: string;
  thumbnail_url?: string | null;
  category: string;
  published: boolean;
  published_at: string;
  created_at?: string;
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
 * 홈페이지 및 목록(/news) 노출용 게시글 목록 조회 (최신순)
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const client = getStaticClient();
  if (!client) return [];

  try {
    const { data } = await client
      .from("posts")
      .select("*")
      .eq("published", true)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });

    return (data as Post[]) || [];
  } catch {
    return [];
  }
}

/**
 * 슬러그(slug) 기반 단일 게시글 상세 조회
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const client = getStaticClient();
  if (!client || !slug) return null;

  try {
    const { data } = await client
      .from("posts")
      .select("*")
      .eq("slug", decodeURIComponent(slug))
      .eq("published", true)
      .lte("published_at", new Date().toISOString())
      .single();

    return (data as Post) || null;
  } catch {
    return null;
  }
}

/**
 * 관리자용 전체 게시글 조회 (예약 게시 및 비공개 글 포함)
 */
export async function getAllPostsAdmin(supabase: any): Promise<Post[]> {
  if (!supabase) return [];
  const { data } = await supabase.from("posts").select("*").order("published_at", { ascending: false });
  return (data as Post[]) || [];
}
