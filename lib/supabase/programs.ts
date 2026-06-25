import { createClient } from "@supabase/supabase-js";

/**
 * 프로그램 데이터 타입 정의
 */
export interface Program {
  id: string;
  slug: string;
  title: string;
  target: string;
  summary: string;
  description: string;
  effect: string;
  process: string;
  image_url: string | null;
  display_order: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * 정적 생성(SSG/ISR) 전용 Supabase 클라이언트
 * 쿠키(cookies())를 사용하지 않아 정적 빌드 단계에서도 안전하게 사용 가능합니다.
 */
function getStaticSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key || url === "your_supabase_project_url") {
    return null;
  }

  return createClient(url, key, {
    global: { fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }) },
  });
}

/**
 * DB 연결이 안 되어 있을 때 표시할 Fallback 더미 프로그램 데이터
 */
const fallbackPrograms: Program[] = [
  {
    id: "dummy-1",
    slug: "language-evaluation",
    title: "종합 언어발달 평가",
    target: "말이 또래보다 늦거나 발음에 어려움이 있는 영유아 및 아동",
    summary: "공인된 표준화 검사와 행동 관찰을 통해 아이의 현재 언어 수준을 파악합니다.",
    description: "아이의 언어 연령과 현재 발달 단계를 다각도로 분석하는 필수 초기 과정입니다. 부모님과의 심층 면담을 통해 가정 내 의사소통 환경을 점검하고, 검사 후에는 맞춤형 치료 로드맵을 제시합니다.",
    effect: "• 또래 대비 정확한 언어 발달 지표 확인\n• 아이의 언어적 강점과 보완점 발견\n• 맞춤형 언어치료 목표 수립의 근거 마련",
    process: "1단계: 초기 부모 면담\n2단계: 표준화 검사 실시\n3단계: 결과 분석\n4단계: 부모 피드백 상담",
    image_url: "https://picsum.photos/seed/prog-eval/800/600",
    display_order: 1,
    published: true,
  },
  {
    id: "dummy-2",
    slug: "articulation-therapy",
    title: "조음 및 발음 치료",
    target: "특정 발음이 부정확하거나 전달력이 떨어지는 아동",
    summary: "말소리를 만드는 기관의 움직임을 훈련하여 정확하고 명료하게 발음할 수 있도록 돕습니다.",
    description: "아이가 특정 말소리를 내기 어려워하거나 발음이 뭉개지는 경우에 적합합니다. 체계적인 조음 훈련과 재미있는 놀이를 연계하여 스트레스 없이 정확한 발음을 획득하도록 합니다.",
    effect: "• 전달력 있는 명료한 발음 획득\n• 자신의 말에 대한 자신감 향상\n• 쓰기 및 읽기 장애 예방 효과",
    process: "1단계: 조음기관 평가\n2단계: 청각적 분별 훈련\n3단계: 단어 및 문장 단위 발음 연습\n4단계: 일상 대화 일반화",
    image_url: "https://picsum.photos/seed/prog-articulation/800/600",
    display_order: 2,
    published: true,
  },
  {
    id: "dummy-3",
    slug: "cognitive-learning",
    title: "인지·학습 언어치료",
    target: "주의 집중력이 낮거나 문장의 의미 이해, 상황 맥락 파악이 어려운 아동",
    summary: "언어적 사고력과 문제 해결 능력을 키워 학습의 기초가 되는 인지적 바탕을 만듭니다.",
    description: "단순한 암기가 아닌 상황을 논리적으로 이해하고 표현하는 능력을 기릅니다. 어휘력 확장과 스토리텔링 훈련을 통해 학교 수업에 대한 적응력을 높입니다.",
    effect: "• 논리적 표현력 및 문장 이해력 향상\n• 과제 수행 시 주의 집중 시간 연장\n• 상황 판단력 증진",
    process: "1단계: 기초 인지 능력 파악\n2단계: 핵심 개념 형성 훈련\n3단계: 추론 및 문제 해결 놀이\n4단계: 교과 과정 연계 활동",
    image_url: "https://picsum.photos/seed/prog-cognitive/800/600",
    display_order: 3,
    published: true,
  },
  {
    id: "dummy-4",
    slug: "parent-counseling",
    title: "부모 상담 및 코칭",
    target: "아이의 언어 발달 촉진을 위해 올바른 상호작용 방법을 배우고 싶은 보호자",
    summary: "부모님이 아이의 가장 훌륭한 대화 파트너가 되실 수 있도록 일상 속 대화 전략을 코칭합니다.",
    description: "치료실에서의 시간만으로는 아이를 완전히 변화시키기 어렵습니다. 부모님이 가정에서 아이와 어떻게 눈을 맞추고 반응해야 하는지 구체적인 솔루션을 제공합니다.",
    effect: "• 가정 내 자연스러운 언어 자극 환경 구축\n• 부모-자녀 간 긍정적 애착 관계 강화\n• 양육 스트레스 감소",
    process: "1단계: 상호작용 관찰 분석\n2단계: 피드백 및 솔루션 제시\n3단계: 가정 내 실천 과제 롤플레잉\n4단계: 정기 코칭 점검",
    image_url: "https://picsum.photos/seed/prog-parent/800/600",
    display_order: 4,
    published: true,
  },
];

/**
 * 1. 공개된(published=true) 프로그램 목록 조회
 * 노출 순서(display_order) 오름차순 정렬
 */
export async function getPublishedPrograms(): Promise<{ programs: Program[]; isFallback: boolean }> {
  const client = getStaticSupabaseClient();

  if (!client) {
    return { programs: fallbackPrograms, isFallback: true };
  }

  try {
    const { data, error } = await client
      .from("programs")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("DB 쿼리 에러 혹은 데이터 없음. Fallback 데이터 반환:", error?.message);
      return { programs: fallbackPrograms, isFallback: true };
    }

    return { programs: data as Program[], isFallback: false };
  } catch (err) {
    console.error("Supabase 통신 예외 발생:", err);
    return { programs: fallbackPrograms, isFallback: true };
  }
}

/**
 * 2. 특정 slug를 가진 프로그램 단일 조회
 */
export async function getProgramBySlug(slug: string): Promise<Program | null> {
  const client = getStaticSupabaseClient();

  if (!client) {
    return fallbackPrograms.find((p) => p.slug === slug) ?? null;
  }

  try {
    const { data, error } = await client
      .from("programs")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error || !data) {
      return fallbackPrograms.find((p) => p.slug === slug) ?? null;
    }

    return data as Program;
  } catch {
    return fallbackPrograms.find((p) => p.slug === slug) ?? null;
  }
}

/**
 * 3. 관리자 전용 전체 프로그램 목록 조회 (비공개 포함)
 */
export async function getAllPrograms(): Promise<Program[]> {
  const client = getStaticSupabaseClient();
  if (!client) return fallbackPrograms;

  try {
    const { data } = await client
      .from("programs")
      .select("*")
      .order("display_order", { ascending: true });
    return (data as Program[]) || fallbackPrograms;
  } catch {
    return fallbackPrograms;
  }
}
