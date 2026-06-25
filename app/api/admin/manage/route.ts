import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { notificationProvider } from "@/lib/notifications";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key || url === "your_supabase_project_url") {
    return null;
  }

  return createClient(url, key);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;
    const cookieStore = await cookies();

    /* ═════════════════════════════════════════════
        1. 관리자 로그인 (Supabase Auth 또는 모의 체험)
    ═════════════════════════════════════════════ */
    if (action === "login") {
      const { email, password } = body;

      // 데모/초보자 체험 계정 규칙 (admin@maljarumter.com / 1234 혹은 임의 이메일)
      if (email && password) {
        cookieStore.set("maljarumter_admin_mock", "authenticated", {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24, // 24시간
        });
        return NextResponse.json({ success: true, message: "관리자 세션이 시작되었습니다." });
      }
      return NextResponse.json({ success: false, error: "이메일과 비밀번호를 입력하세요." }, { status: 400 });
    }

    /* ═════════════════════════════════════════════
        2. 관리자 로그아웃
    ═════════════════════════════════════════════ */
    if (action === "logout") {
      cookieStore.delete("maljarumter_admin_mock");
      return NextResponse.json({ success: true, message: "로그아웃 되었습니다." });
    }

    const supabase = getAdminClient();

    /* ═════════════════════════════════════════════
        3. 예약 상태 변경 (확정/취소/완료 + 슬롯 복구 옵션)
    ═════════════════════════════════════════════ */
    if (action === "update_reservation_status") {
      const { id, status, slot_id, restore_slot, applicant_name, phone } = body;

      if (supabase) {
        await supabase.from("reservations").update({ status }).eq("id", id);

        // 요구사항: "예약 취소 시 해당 슬롯을 다시 open으로 되돌리는 옵션 제공"
        if (status === "canceled" && restore_slot && slot_id) {
          await supabase.from("availability_slots").update({ status: "open" }).eq("id", slot_id);
          console.info(`[CMS] 예약 취소로 슬롯(${slot_id})이 open 상태로 복구되었습니다.`);
        }
      }

      // 예약 확정 시 신청자에게 알림 시뮬레이션 발송
      if (status === "confirmed") {
        await notificationProvider.send({
          type: "reservation",
          title: `[말자람터 예약확정] 방문 상담 안내`,
          message: `${applicant_name || "예약자"}님, 신청하신 진단 평가 및 상담 일정이 최종 확정되었습니다.\n센터 위치 및 주차 안내는 홈페이지를 참고해주세요.`,
          recipient: phone || "신청자 연락처",
          metadata: { reservationId: id, adminAction: "confirmed" },
        });
      }

      return NextResponse.json({ success: true, message: `예약 상태가 '${status}'(으)로 변경되었습니다.` });
    }

    /* ═════════════════════════════════════════════
        4. 예약 관리자 메모 작성
    ═════════════════════════════════════════════ */
    if (action === "update_reservation_memo") {
      const { id, memo } = body;
      if (supabase) {
        await supabase.from("reservations").update({ admin_memo: memo }).eq("id", id);
      }
      return NextResponse.json({ success: true, message: "메모가 저장되었습니다." });
    }

    /* ═════════════════════════════════════════════
        5. 가용 시간 슬롯 생성
    ═════════════════════════════════════════════ */
    if (action === "create_slot") {
      const { counselor_id, start_iso, end_iso } = body;
      if (supabase) {
        const { error } = await supabase.from("availability_slots").insert({
          counselor_id,
          slot_start: start_iso,
          slot_end: end_iso,
          status: "open",
        });
        if (error) throw error;
      }
      return NextResponse.json({ success: true, message: "새로운 예약 슬롯이 오픈되었습니다!" });
    }

    /* ═════════════════════════════════════════════
        6. 시간 슬롯 마감/삭제
    ═════════════════════════════════════════════ */
    if (action === "close_slot") {
      const { id } = body;
      if (supabase) {
        await supabase.from("availability_slots").update({ status: "closed" }).eq("id", id);
      }
      return NextResponse.json({ success: true, message: "해당 슬롯이 마감 처리되었습니다." });
    }

    /* ═════════════════════════════════════════════
        7. 온라인 문의 처리 상태 변경
    ═════════════════════════════════════════════ */
    if (action === "update_inquiry_status") {
      const { id, status } = body;
      if (supabase) {
        await supabase.from("inquiries").update({ status }).eq("id", id);
      }
      return NextResponse.json({ success: true, message: `문의 상태가 '${status}'(으)로 갱신되었습니다.` });
    }

    return NextResponse.json({ success: false, error: "알 수 없는 작업 요청입니다." }, { status: 400 });
  } catch (err: any) {
    console.error("CMS API 처리 예외:", err);
    return NextResponse.json({ success: false, error: err?.message || "서버 에러" }, { status: 500 });
  }
}
