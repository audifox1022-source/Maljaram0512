import { createClient } from "@supabase/supabase-js";

export interface SiteSettings {
  id: number;
  site_name: string;
  logo_url: string;
  phone: string;
  address: string;
  business_hours: string;
  email: string;
  kakao_url: string;
  instagram_url: string;
  blog_url: string;
  youtube_url: string;
  map_embed: string;
  updated_at?: string;
}

export const defaultSettings: SiteSettings = {
  id: 1,
  site_name: "말자람터 언어심리연구소",
  logo_url: "/file.svg",
  phone: "02-1234-5678",
  address: "서울특별시 중구 세종대로 110 말자람터 빌딩 2층",
  business_hours: "평일 10:00 - 19:00 | 토요일 09:00 - 15:00 (일요일/공휴일 휴무)",
  email: "info@maljarumter.com",
  kakao_url: "https://pf.kakao.com/",
  instagram_url: "https://instagram.com/",
  blog_url: "https://blog.naver.com/",
  youtube_url: "https://youtube.com/",
  map_embed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.275038330761!2d126.9768822!3d37.566535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca2eb421c44ad%3A0xe955a50c118085f8!2z7I2c7Jq47Yq567OE7IucIOyEseuPmeuMgOmmvCAxMTA!5e0!3m2!1sko!2skr!4v1700000000000!5m2!1sko!2skr" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
};

function getStaticClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || url.includes("your-project")) return null;
  return createClient(url, key);
}

/**
 * 전역 사이트 기본설정 조회 함수 (SSG/ISR 호환)
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const client = getStaticClient();
  if (!client) return defaultSettings;

  try {
    const { data } = await client.from("site_settings").select("*").eq("id", 1).single();
    return (data as SiteSettings) || defaultSettings;
  } catch {
    return defaultSettings;
  }
}
