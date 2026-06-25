import { createClient } from "@supabase/supabase-js";

export interface Review {
  id: string;
  author_name: string;
  content: string;
  rating: number;
  image_url?: string | null;
  is_anonymous: boolean;
  published: boolean;
  display_order: number;
  created_at?: string;
}

/**
 * 개인정보 보호용 작성자 성명 마스킹 함수 (예: 김서연 -> 김☆☆)
 */
export function formatAuthorName(name: string, isAnon: boolean): string {
  if (!isAnon || !name) return name;

  // 호칭 분리 (어머니, 아버님, 학부모님 등)
  const suffixes = ["어머니", "아버님", "학부모님", "님", "엄마", "아빠"];
  let baseName = name;
  let suffix = "";

  for (const s of suffixes) {
    if (name.endsWith(s)) {
      baseName = name.slice(0, name.length - s.length).trim();
      suffix = ` ${s}`;
      break;
    }
  }

  if (baseName.length <= 1) return `${baseName}*${suffix}`;
  if (baseName.length === 2) return `${baseName[0]}*${suffix}`;

  const first = baseName[0];
  const masked = "☆".repeat(baseName.length - 1);
  return `${first}${masked}${suffix}`;
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
 * 홈페이지 메인 노출용 승인된 후기 목록 조회
 */
export async function getPublishedReviews(): Promise<Review[]> {
  const client = getStaticClient();
  if (!client) return [];

  try {
    const { data } = await client
      .from("reviews")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    return (data as Review[]) || [];
  } catch {
    return [];
  }
}

/**
 * 관리자 페이지용 전체 후기 조회 (미승인 대기열 포함)
 */
export async function getAllReviewsAdmin(supabase: any): Promise<Review[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .order("published", { ascending: true }) // 미공개(대기중) 먼저 표시
    .order("created_at", { ascending: false });

  return (data as Review[]) || [];
}
