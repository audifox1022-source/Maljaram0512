import { createClient } from "@supabase/supabase-js";

export interface AvailabilitySlot {
  id: string;
  counselor_id: string;
  counselor_name: string;
  slot_start: string; // ISO String
  slot_end: string;
  formatted_time: string; // 예: "오전 10:00 – 오전 11:00"
  status: "open" | "booked" | "closed";
}

/**
 * 정적 생성 및 서버 전용 Supabase 클라이언트
 */
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key || url === "your_supabase_project_url") {
    return null;
  }

  return createClient(url, key);
}

/**
 * 한국 시간(Asia/Seoul) 문자열 포맷팅
 * 예: "2026-06-26T10:00:00+09:00" -> "오전 10:00 – 오전 11:00"
 */
export function formatKoreanTimeRange(startIso: string, endIso: string): string {
  try {
    const start = new Date(startIso);
    const end = new Date(endIso);

    const formatter = new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${formatter.format(start)} – ${formatter.format(end)}`;
  } catch {
    return "시간 정보";
  }
}

/**
 * Fallback 더미 슬롯 생성기 (오늘 +1~+14일 평일)
 */
function getFallbackSlots(): AvailabilitySlot[] {
  const slots: AvailabilitySlot[] = [];
  const today = new Date();

  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const dayOfWeek = d.getDay();
    if (dayOfWeek > 0 && dayOfWeek < 6) {
      // 월~금
      const yyyyMmDd = d.toISOString().slice(0, 10);

      const s1Start = `${yyyyMmDd}T10:00:00+09:00`;
      const s1End = `${yyyyMmDd}T11:00:00+09:00`;
      slots.push({
        id: `fb-slot-1-${yyyyMmDd}`,
        counselor_id: "fb-counselor-1",
        counselor_name: "김지수 원장",
        slot_start: s1Start,
        slot_end: s1End,
        formatted_time: formatKoreanTimeRange(s1Start, s1End),
        status: "open",
      });

      const s2Start = `${yyyyMmDd}T14:00:00+09:00`;
      const s2End = `${yyyyMmDd}T15:00:00+09:00`;
      slots.push({
        id: `fb-slot-2-${yyyyMmDd}`,
        counselor_id: "fb-counselor-2",
        counselor_name: "박서연 수석 치료사",
        slot_start: s2Start,
        slot_end: s2End,
        formatted_time: formatKoreanTimeRange(s2Start, s2End),
        status: "open",
      });

      const s3Start = `${yyyyMmDd}T16:00:00+09:00`;
      const s3End = `${yyyyMmDd}T17:00:00+09:00`;
      slots.push({
        id: `fb-slot-3-${yyyyMmDd}`,
        counselor_id: "fb-counselor-1",
        counselor_name: "김지수 원장",
        slot_start: s3Start,
        slot_end: s3End,
        formatted_time: formatKoreanTimeRange(s3Start, s3End),
        status: "open",
      });
    }
  }

  return slots;
}

/**
 * 특정 날짜(YYYY-MM-DD)의 오픈된 상담 슬롯 목록 조회
 */
export async function getOpenSlotsByDate(dateStr: string): Promise<AvailabilitySlot[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    const allFallback = getFallbackSlots();
    return allFallback.filter((s) => s.slot_start.startsWith(dateStr));
  }

  try {
    // 해당 날짜 자정 ~ 다음날 자정 범위 조회 (Asia/Seoul +09:00 기준)
    const startOfDay = `${dateStr}T00:00:00+09:00`;
    const endOfDay = `${dateStr}T23:59:59+09:00`;

    const { data, error } = await supabase
      .from("availability_slots")
      .select(`
        id,
        counselor_id,
        slot_start,
        slot_end,
        status,
        counselors ( name )
      `)
      .eq("status", "open")
      .gte("slot_start", startOfDay)
      .lte("slot_start", endOfDay)
      .order("slot_start", { ascending: true });

    if (error || !data) {
      console.warn("예약 슬롯 조회 에러. Fallback 사용:", error?.message);
      const allFallback = getFallbackSlots();
      return allFallback.filter((s) => s.slot_start.startsWith(dateStr));
    }

    return data.map((item: any) => ({
      id: item.id,
      counselor_id: item.counselor_id,
      counselor_name: item.counselors?.name ?? "담당 치료사",
      slot_start: item.slot_start,
      slot_end: item.slot_end,
      formatted_time: formatKoreanTimeRange(item.slot_start, item.slot_end),
      status: item.status,
    }));
  } catch {
    const allFallback = getFallbackSlots();
    return allFallback.filter((s) => s.slot_start.startsWith(dateStr));
  }
}
