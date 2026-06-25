import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { notificationProvider } from "@/lib/notifications";

/**
 * 정적 환경 및 서버 API 전용 Supabase 클라이언트
 */
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key || url === "your_supabase_project_url") {
    return null;
  }

  return createClient(url, key);
}

/**
 * 한국 전화번호 정규식 검증
 * 예: 010-1234-5678, 01012345678, 02-123-4567 등 하이픈 유무 무관
 */
function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/-/g, "").trim();
  return /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})[0-9]{3,4}[0-9]{4}$/.test(cleaned);
}

/**
 * 이메일 정규식 검증 (선택 입력)
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, message, agree, website } = body;

    /* ═════════════════════════════════════════════
        1. 스팸 방지: 허니팟(Honeypot) 체크
        실제 사용자 화면에는 안 보이는 'website' 필드에 
        봇이 값을 입력하면 스팸으로 간주하고 DB 저장 없이 종료합니다.
    ═════════════════════════════════════════════ */
    if (website && typeof website === "string" && website.trim().length > 0) {
      console.warn("[Spam Protection] 허니팟 감지됨. 조용한 접수 처리.");
      return NextResponse.json({ success: true, message: "문의가 접수되었습니다." });
    }

    /* ═════════════════════════════════════════════
        2. 서버측 입력값 검증
    ═════════════════════════════════════════════ */
    if (!agree) {
      return NextResponse.json(
        { success: false, error: "개인정보 수집 및 이용에 동의해야 합니다." },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "이름을 2자 이상 입력해주세요." },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || !isValidPhone(phone)) {
      return NextResponse.json(
        { success: false, error: "올바른 연락처 형식(예: 010-1234-5678)을 입력해주세요." },
        { status: 400 }
      );
    }

    if (email && typeof email === "string" && email.trim().length > 0 && !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "올바른 이메일 주소를 입력해주세요." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "문의 내용을 구체적으로(5자 이상) 입력해주세요." },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email ? email.trim() : null;
    const cleanMessage = message.trim();

    /* ═════════════════════════════════════════════
        3. Supabase DB (inquiries 테이블) 저장
    ═════════════════════════════════════════════ */
    const supabase = getSupabaseClient();
    let inquiryId: string | null = null;

    if (supabase) {
      const { data: insertData, error: insertError } = await supabase
        .from("inquiries")
        .insert({
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          message: cleanMessage,
          status: "new",
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("Supabase inquiries 저장 에러:", insertError.message);
        // DB 연결 전이거나 에러 발생 시에도 사용자가 당황하지 않게 로컬 시뮬레이션으로 진행
      } else if (insertData) {
        inquiryId = insertData.id;
      }
    } else {
      console.info("[API Contact] Supabase 환경변수 미설정 상태. 로컬 접수 시뮬레이션.");
    }

    /* ═════════════════════════════════════════════
        4. 운영진 알림 발송 (MockProvider) 및 로그 저장
    ═════════════════════════════════════════════ */
    const adminPhone = process.env.ADMIN_PHONE ?? "운영진 대표번호";
    const notifyTitle = `[말자람터 신규문의] ${cleanName}님 접수`;
    const notifyMsg = `• 연락처: ${cleanPhone}\n• 내용: ${cleanMessage.slice(0, 50)}...`;

    // MockProvider로 알림 발송
    const notifyResult = await notificationProvider.send({
      type: "inquiry",
      title: notifyTitle,
      message: notifyMsg,
      recipient: adminPhone,
      metadata: { inquiryId, email: cleanEmail },
    });

    // notification_logs 테이블에 발송 이력 기록
    if (supabase) {
      await supabase.from("notification_logs").insert({
        type: "SMS_MOCK",
        title: notifyTitle,
        message: notifyMsg,
        recipient: adminPhone,
        status: notifyResult.success ? "MOCK_LOGGED" : "FAILED",
        metadata: { messageId: notifyResult.messageId, inquiryId },
      });
    }

    return NextResponse.json({
      success: true,
      message: "문의가 성공적으로 접수되었습니다. 담당자가 확인 후 빠른 시일 내 연락드리겠습니다.",
    });
  } catch (err) {
    console.error("문의 접수 Route Handler 예외:", err);
    return NextResponse.json(
      { success: false, error: "서버 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
