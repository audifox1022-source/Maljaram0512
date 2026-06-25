import { createClient } from "@supabase/supabase-js";

export interface Banner {
  id: string;
  title: string;
  image_url: string;
  link_url: string;
  type: "hero" | "popup";
  active: boolean;
  start_at?: string | null;
  end_at?: string | null;
  display_order: number;
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
 * 활성 상태 및 기간 조건이 충족된 공개 배너 목록 조회 (SSG/ISR 호환)
 */
export async function getActiveBanners(): Promise<{ hero: Banner[]; popup: Banner[] }> {
  const client = getStaticClient();
  if (!client) return { hero: [], popup: [] };

  try {
    const { data } = await client
      .from("banners")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (!data || data.length === 0) return { hero: [], popup: [] };

    const list = data as Banner[];
    return {
      hero: list.filter((b) => b.type === "hero"),
      popup: list.filter((b) => b.type === "popup"),
    };
  } catch {
    return { hero: [], popup: [] };
  }
}

/**
 * 관리자용 전체 배너 목록 조회 (비활성 및 지난 배너 포함)
 */
export async function getAllBannersAdmin(supabase: any): Promise<Banner[]> {
  if (!supabase) return [];
  const { data } = await supabase.from("banners").select("*").order("type", { ascending: true }).order("display_order", { ascending: true });
  return (data as Banner[]) || [];
}
