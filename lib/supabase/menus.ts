import { createClient } from "@supabase/supabase-js";

export interface NavMenu {
  id: string;
  label: string;
  href: string;
  location: "header" | "footer";
  display_order: number;
  visible: boolean;
  parent_id?: string | null;
}

export const defaultHeaderMenus: NavMenu[] = [
  { id: "nm-home", label: "홈", href: "/", location: "header", display_order: 1, visible: true },
  { id: "nm-about", label: "소개", href: "/about", location: "header", display_order: 2, visible: true },
  { id: "nm-programs", label: "프로그램", href: "/programs", location: "header", display_order: 3, visible: true },
  { id: "nm-reservation", label: "예약", href: "/reservation", location: "header", display_order: 4, visible: true },
  { id: "nm-contact", label: "문의", href: "/contact", location: "header", display_order: 5, visible: true },
  { id: "nm-faq", label: "FAQ", href: "/faq", location: "header", display_order: 6, visible: true },
];

export const defaultFooterMenus: NavMenu[] = [
  { id: "fm-about", label: "소개", href: "/about", location: "footer", display_order: 1, visible: true },
  { id: "fm-programs", label: "프로그램", href: "/programs", location: "footer", display_order: 2, visible: true },
  { id: "fm-reservation", label: "상담 예약", href: "/reservation", location: "footer", display_order: 3, visible: true },
  { id: "fm-contact", label: "문의하기", href: "/contact", location: "footer", display_order: 4, visible: true },
  { id: "fm-faq", label: "자주 묻는 질문", href: "/faq", location: "footer", display_order: 5, visible: true },
];

function getStaticClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || url.includes("your-project")) return null;
  return createClient(url, key);
}

/**
 * 네비게이션 메뉴 목록 조회 (SSG/ISR 지원)
 */
export async function getNavMenus(): Promise<{ header: NavMenu[]; footer: NavMenu[] }> {
  const client = getStaticClient();
  if (!client) return { header: defaultHeaderMenus, footer: defaultFooterMenus };

  try {
    const { data } = await client.from("nav_menus").select("*").eq("visible", true).order("display_order", { ascending: true });
    if (!data || data.length === 0) return { header: defaultHeaderMenus, footer: defaultFooterMenus };

    const menus = data as NavMenu[];
    return {
      header: menus.filter((m) => m.location === "header"),
      footer: menus.filter((m) => m.location === "footer"),
    };
  } catch {
    return { header: defaultHeaderMenus, footer: defaultFooterMenus };
  }
}

/**
 * 관리자용 전체 메뉴 목록 조회 (숨김 메뉴 포함)
 */
export async function getAllNavMenusAdmin(supabase: any): Promise<NavMenu[]> {
  if (!supabase) return [...defaultHeaderMenus, ...defaultFooterMenus];
  const { data } = await supabase.from("nav_menus").select("*").order("location", { ascending: false }).order("display_order", { ascending: true });
  return (data as NavMenu[]) || [...defaultHeaderMenus, ...defaultFooterMenus];
}
