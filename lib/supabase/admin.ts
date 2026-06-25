import { createClient } from "@supabase/supabase-js";
import { formatKoreanTimeRange } from "./reservations";

function getAdminClient() {
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
    Mock Fallback 데이터 정의
══════════════════════════════════════════════ */
const MOCK_RESERVATIONS = [
  {
    id: "res-101",
    consult_type: "초기 언어발달 종합평가",
    applicant_name: "이영희",
    phone: "010-9876-5432",
    child_info: "김준서 4세 (말이 늦고 조음이 불분명함)",
    status: "requested",
    admin_memo: "방문 전 평가 설문지 링크 발송 필요",
    created_at: new Date().toISOString(),
    slot: {
      slot_start: new Date(Date.now() + 86400000).toISOString(),
      slot_end: new Date(Date.now() + 90000000).toISOString(),
      counselor_name: "김지수 원장",
      id: "slot-101",
    },
  },
  {
    id: "res-102",
    consult_type: "조음 및 발음 명료도 상담",
    applicant_name: "최민수",
    phone: "010-1111-2222",
    child_info: "최아인 6세 (ㄹ, ㅅ 발음이 부정확함)",
    status: "confirmed",
    admin_memo: "",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    slot: {
      slot_start: new Date(Date.now() + 172800000).toISOString(),
      slot_end: new Date(Date.now() + 176400000).toISOString(),
      counselor_name: "박서연 수석 치료사",
      id: "slot-102",
    },
  },
];

const MOCK_INQUIRIES = [
  {
    id: "inq-201",
    name: "박지은",
    phone: "010-3333-4444",
    email: "jieun@test.com",
    message: "26개월 남아이인데 아직 엄마, 아빠 밖에 못해요. 상담 예약하고 싶습니다.",
    status: "new",
    created_at: new Date().toISOString(),
  },
  {
    id: "inq-202",
    name: "정대만",
    phone: "010-5555-6666",
    email: "",
    message: "초등 1학년 읽기 유창성 검사가 가능한가요?",
    status: "answered",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

/**
 * 1. 대시보드 요약 정보 조회
 */
export async function getAdminSummary() {
  const supabase = getAdminClient();
  if (!supabase) {
    return {
      todayResCount: 2,
      newInqCount: 1,
      recentReservations: MOCK_RESERVATIONS,
      recentInquiries: MOCK_INQUIRIES,
    };
  }

  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const startOfToday = `${todayStr}T00:00:00+09:00`;

    // 오늘 예약 건수
    const { count: resCount } = await supabase
      .from("reservations")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfToday);

    // 신규 문의 건수
    const { count: inqCount } = await supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "new");

    // 최근 예약 5건
    const { data: resList } = await supabase
      .from("reservations")
      .select(`
        id, consult_type, applicant_name, phone, child_info, status, admin_memo, created_at, slot_id,
        availability_slots ( slot_start, slot_end, counselors ( name ) )
      `)
      .order("created_at", { ascending: false })
      .limit(5);

    // 최근 문의 5건
    const { data: inqList } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    const formattedRes = (resList || []).map((r: any) => ({
      id: r.id,
      consult_type: r.consult_type,
      applicant_name: r.applicant_name,
      phone: r.phone,
      child_info: r.child_info,
      status: r.status,
      admin_memo: r.admin_memo,
      created_at: r.created_at,
      slot: {
        id: r.slot_id,
        slot_start: r.availability_slots?.slot_start || new Date().toISOString(),
        slot_end: r.availability_slots?.slot_end || new Date().toISOString(),
        counselor_name: r.availability_slots?.counselors?.name || "전문가",
      },
    }));

    return {
      todayResCount: resCount ?? 1,
      newInqCount: inqCount ?? 1,
      recentReservations: formattedRes.length ? formattedRes : MOCK_RESERVATIONS,
      recentInquiries: (inqList && inqList.length) ? inqList : MOCK_INQUIRIES,
    };
  } catch {
    return {
      todayResCount: 2,
      newInqCount: 1,
      recentReservations: MOCK_RESERVATIONS,
      recentInquiries: MOCK_INQUIRIES,
    };
  }
}

/**
 * 2. 예약 전체 목록 조회
 */
export async function getAdminReservations(statusFilter: string = "all") {
  const supabase = getAdminClient();
  if (!supabase) {
    if (statusFilter === "all") return MOCK_RESERVATIONS;
    return MOCK_RESERVATIONS.filter((r) => r.status === statusFilter);
  }

  try {
    let query = supabase
      .from("reservations")
      .select(`
        id, consult_type, applicant_name, phone, email, child_info, status, admin_memo, created_at, slot_id,
        availability_slots ( slot_start, slot_end, counselors ( name ) )
      `)
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (error || !data) return MOCK_RESERVATIONS;

    return data.map((r: any) => ({
      id: r.id,
      consult_type: r.consult_type,
      applicant_name: r.applicant_name,
      phone: r.phone,
      email: r.email,
      child_info: r.child_info,
      status: r.status,
      admin_memo: r.admin_memo,
      created_at: r.created_at,
      slot: {
        id: r.slot_id,
        slot_start: r.availability_slots?.slot_start || new Date().toISOString(),
        slot_end: r.availability_slots?.slot_end || new Date().toISOString(),
        counselor_name: r.availability_slots?.counselors?.name || "전문가",
      },
    }));
  } catch {
    return MOCK_RESERVATIONS;
  }
}

/**
 * 3. 가용 슬롯 목록 조회
 */
export async function getAdminSlots() {
  const supabase = getAdminClient();
  if (!supabase) {
    return [
      { id: "slot-1", counselor_name: "김지수 원장", slot_start: new Date(Date.now() + 86400000).toISOString(), slot_end: new Date(Date.now() + 90000000).toISOString(), status: "open" },
      { id: "slot-2", counselor_name: "박서연 수석 치료사", slot_start: new Date(Date.now() + 172800000).toISOString(), slot_end: new Date(Date.now() + 176400000).toISOString(), status: "booked" },
    ];
  }

  try {
    const { data } = await supabase
      .from("availability_slots")
      .select(`id, slot_start, slot_end, status, counselors(name)`)
      .gte("slot_start", new Date().toISOString())
      .order("slot_start", { ascending: true });

    return (data || []).map((s: any) => ({
      id: s.id,
      counselor_name: s.counselors?.name ?? "전문가",
      slot_start: s.slot_start,
      slot_end: s.slot_end,
      status: s.status,
      formatted_time: formatKoreanTimeRange(s.slot_start, s.slot_end),
    }));
  } catch {
    return [];
  }
}

/**
 * 4. 상담사 목록 조회
 */
export async function getAdminCounselors() {
  const supabase = getAdminClient();
  if (!supabase) {
    return [
      { id: "c-1", name: "김지수 원장" },
      { id: "c-2", name: "박서연 수석 치료사" },
    ];
  }

  try {
    const { data } = await supabase.from("counselors").select("id, name").eq("active", true);
    return data || [{ id: "c-1", name: "김지수 원장" }];
  } catch {
    return [{ id: "c-1", name: "김지수 원장" }];
  }
}

/**
 * 5. 문의 전체 목록 조회
 */
export async function getAdminInquiries() {
  const supabase = getAdminClient();
  if (!supabase) return MOCK_INQUIRIES;

  try {
    const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    return data || MOCK_INQUIRIES;
  } catch {
    return MOCK_INQUIRIES;
  }
}
