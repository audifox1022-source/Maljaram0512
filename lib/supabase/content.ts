import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key || url === "your_supabase_project_url") {
    return null;
  }

  return createClient(url, key, {
    global: { fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }) },
  });
}

/* ══════════════════════════════════════════════
    Mock Fallback 데이터
══════════════════════════════════════════════ */
export const FALLBACK_SECTIONS: Record<string, { title: string; body: string; image_urls: string[] }> = {
  hero: {
    title: "아이의 맑은 목소리, 말자람터가 함께 피워냅니다",
    body: "따뜻한 눈빛과 따스한 언어로 아이의 내면을 밝히는 곳. 검증된 전문 언어재활사와 임상심리전문가가 한 명 한 명의 맞춤 성장 여정을 동행합니다.",
    image_urls: ["https://picsum.photos/seed/maljarum1/800/600"],
  },
  greeting: {
    title: "원장 인사말: 소통의 기쁨을 선물합니다",
    body: "안녕하세요. 말자람터 언어심리연구소 대표원장 김지수입니다. 아이들이 세상과 처음 맺는 관계의 시작은 바로 따스한 소통입니다. 조급함 대신 기다림으로, 정형화된 훈련 대신 놀이 속 자발성으로 아이가 스스로 말문을 열 수 있도록 가장 안전한 발달 둥지가 되겠습니다.",
    image_urls: ["https://picsum.photos/seed/about1/600/400"],
  },
  vision: {
    title: "센터 핵심 비전 3가지",
    body: "1. 아동 중심 자발성 촉진 치료\n2. 가정 연계 부모 코칭 시스템\n3. 다학제 협력 통합 진단 평가",
    image_urls: [],
  },
};

export const FALLBACK_STAFF = [
  { id: "st-1", name: "김지수 원장", role: "대표 언어재활사", photo_url: "https://picsum.photos/seed/staff1/400/400", bio: "• 연세대학교 언어병리학 석사\n• 전 대학병원 소아청소년과 언어치료실장\n• 보건복지부 전문 언어재활사", display_order: 1, published: true },
  { id: "st-2", name: "박서연 치료사", role: "수석 놀이심리전문가", photo_url: "https://picsum.photos/seed/staff2/400/400", bio: "• 이화여자대학교 아동심리학 석사\n• 한국심리학회 임상심리전문가\n• RT 부모상호작용 전문가", display_order: 2, published: true },
  { id: "st-3", name: "이진우 연구원", role: "인지언어 담당 치료사", photo_url: "https://picsum.photos/seed/staff3/400/400", bio: "• 한림대학교 언어청각학 학사\n• AAC 보완대체의사소통 교육 이수", display_order: 3, published: true },
];

export const FALLBACK_FAQS = [
  { id: "fq-1", question: "초기 상담 및 평가 시간은 얼마나 걸리나요?", answer: "부모님 초기 상담(15분) + 아동 1:1 맞춤 진단평가(40분) + 종합 결과 상담(15분)으로 총 70~80분 정도 소요됩니다.", display_order: 1, published: true },
  { id: "fq-2", question: "치료 세션 진행 시 부모가 참관할 수 있나요?", answer: "아동의 분리 불안 정도나 치료 목표에 따라 첫 1~2회기는 매직미러를 통한 참관이나 동반 입장을 유연하게 지원합니다.", display_order: 2, published: true },
  { id: "fq-3", question: "보건복지부 발달재활 바우처 사용이 가능한가요?", answer: "네, 저희 말자람터는 보건복지부 지정 발달재활서비스 공식 제공기관입니다.", display_order: 3, published: true },
  { id: "fq-4", question: "주차 지원 및 찾아오는 길 안내 부탁드립니다.", answer: "건물 지하주차장에 시간 제한 없이 무료 주차 등록을 해 드립니다.", display_order: 4, published: true },
];

/**
 * 1. 홈페이지 텍스트 섹션 맵 조회
 */
export async function getSiteSections() {
  const supabase = getClient();
  if (!supabase) return FALLBACK_SECTIONS;

  try {
    const { data } = await supabase.from("site_sections").select("*");
    if (!data || data.length === 0) return FALLBACK_SECTIONS;

    const map: Record<string, any> = { ...FALLBACK_SECTIONS };
    data.forEach((item: any) => {
      map[item.key] = {
        title: item.title,
        body: item.body,
        image_urls: item.image_urls || [],
      };
    });
    return map;
  } catch {
    return FALLBACK_SECTIONS;
  }
}

/**
 * 2. 전문가 목록 조회
 */
export async function getStaffList(onlyPublished: boolean = true) {
  const supabase = getClient();
  if (!supabase) {
    return onlyPublished ? FALLBACK_STAFF.filter(s => s.published) : FALLBACK_STAFF;
  }

  try {
    let query = supabase.from("staff").select("*").order("display_order", { ascending: true });
    if (onlyPublished) query = query.eq("published", true);

    const { data } = await query;
    return (data && data.length) ? data : (onlyPublished ? FALLBACK_STAFF.filter(s => s.published) : FALLBACK_STAFF);
  } catch {
    return onlyPublished ? FALLBACK_STAFF.filter(s => s.published) : FALLBACK_STAFF;
  }
}

/**
 * 3. FAQ 목록 조회
 */
export async function getFaqList(onlyPublished: boolean = true) {
  const supabase = getClient();
  if (!supabase) {
    return onlyPublished ? FALLBACK_FAQS.filter(f => f.published) : FALLBACK_FAQS;
  }

  try {
    let query = supabase.from("faqs").select("*").order("display_order", { ascending: true });
    if (onlyPublished) query = query.eq("published", true);

    const { data } = await query;
    return (data && data.length) ? data : (onlyPublished ? FALLBACK_FAQS.filter(f => f.published) : FALLBACK_FAQS);
  } catch {
    return onlyPublished ? FALLBACK_FAQS.filter(f => f.published) : FALLBACK_FAQS;
  }
}
