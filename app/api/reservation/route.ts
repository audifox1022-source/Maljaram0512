import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getOpenSlotsByDate } from "@/lib/supabase/reservations";
import { notificationProvider } from "@/lib/notifications";

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
 * 1. GET: 특정 날짜의 오픈 슬롯 조회 API
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ success: false, error: "날짜 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const slots = await getOpenSlotsByDate(date);
  return NextResponse.json({ success: true, slots });
}

/**
 * 2. POST: 상담 예약 신청 제출 API (서버측 트랜잭션 동시성 제어)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slot_id, consult_type, applicant_name, phone, email, child_info } = body;

    if (!slot_id || !consult_type || !applicant_name || !phone || !child_info) {
      return NextResponse.json(
        { success: false, error: "필수 입력 항목이 누락되었습니다." },
        { status: 400 }
      );
    }

    const cleanName = applicant_name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email ? email.trim() : null;
    const cleanChild = child_info.trim();

    const supabase = getSupabaseClient();
    let reservationId: string = `mock-res-${Date.now()}`;

    if (supabase) {
      /* ═════════════════════════════════════════════
          ★ 중복 예약 방지 핵심: Supabase RPC 호출
          데이터베이스의 'book_consultation_slot' 트랜잭션을 실행하여
          선착순 1명만 예약 승인하고 동시 요청자는 마감 에러를 반환합니다.
      ═════════════════════════════════════════════ */
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        "book_consultation_slot",
        {
          p_slot_id: slot_id,
          p_consult_type: consult_type,
          p_applicant_name: cleanName,
          p_phone: cleanPhone,
          p_email: cleanEmail,
          p_child_info: cleanChild,
        }
      );

      if (rpcError) {
        console.error("Supabase RPC 예약 트랜잭션 에러:", rpcError.message);
        // 만약 사용자가 아직 DB에 마이그레이션 SQL을 실행하지 않아 함수가 없는 경우 시뮬레이션 처리
        if (rpcError.message.includes("function") || rpcError.message.includes("schema cache")) {
          console.info("RPC 함수 미생성 상태. 로컬 예약 시뮬레이션 승인.");
        } else {
          return NextResponse.json(
            { success: false, error: "예약 처리 중 DB 오류가 발생했습니다: " + rpcError.message },
            { status: 500 }
          );
        }
      } else if (rpcData) {
        if (!rpcData.success) {
          // 이미 다른 사람이 0.1초 차이로 먼저 예약하여 booked 된 경우
          return NextResponse.json(
            { success: false, error: rpcData.error || "방금 전 마감된 시간대입니다. 다른 시간을 선택해주세요." },
            { status: 409 } // 409 Conflict 응답
          );
        }
        reservationId = rpcData.reservation_id;
      }
    }

    /* ═════════════════════════════════════════════
        예약 완료 알림 발송 (신청자 + 운영진) 및 로그 기록
    ═════════════════════════════════════════════ */
    const notifyTitle = `[상담예약 확정] ${cleanName}님 예약신청 완료`;
    const notifyMsg = `• 예약자: ${cleanName}\n• 연락처: ${cleanPhone}\n• 상담분야: ${consult_type}\n• 아동정보: ${cleanChild}\n말자람터에서 일정 확인 후 최종 안내 문자 드립니다.`;

    // 1) 신청자 및 운영진 알림 동시 시뮬레이션 발송
    const notifyResult = await notificationProvider.send({
      type: "reservation",
      title: notifyTitle,
      message: notifyMsg,
      recipient: `${cleanPhone} (신청자) / 운영진`,
      metadata: { reservationId, slot_id },
    });

    // 2) notification_logs 기록
    if (supabase) {
      await supabase.from("notification_logs").insert({
        type: "RESERVATION_MOCK",
        title: notifyTitle,
        message: notifyMsg,
        recipient: cleanPhone,
        status: notifyResult.success ? "MOCK_LOGGED" : "FAILED",
        metadata: { reservationId, slot_id },
      });
    }

    return NextResponse.json({
      success: true,
      message: "초기 상담 예약이 확정되었습니다! 입력하신 연락처로 확인 문자가 발송됩니다.",
      reservationId,
    });
  } catch (err) {
    console.error("예약 POST Handler 예외:", err);
    return NextResponse.json(
      { success: false, error: "서버 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
