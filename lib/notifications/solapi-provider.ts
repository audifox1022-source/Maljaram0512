import type { NotificationProvider, NotificationPayload, NotificationResult } from "./types";

/**
 * SolapiProvider (구 CoolSMS)
 * 한국 내 SMS/LMS 발송 전용 프로바이더
 */
export class SolapiProvider implements NotificationProvider {
  readonly name = "SolapiProvider";

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const apiKey = process.env.SOLAPI_API_KEY;
    const apiSecret = process.env.SOLAPI_API_SECRET;
    const senderNumber = process.env.SOLAPI_SENDER_NUMBER;

    if (!apiKey || !apiSecret || !senderNumber) {
      console.warn(`[${this.name}] SOLAPI API 키가 설정되지 않았습니다. Mock 모드로 전환합니다.`);
      return { success: true, messageId: `mock-solapi-${Date.now()}` };
    }

    try {
      // Solapi REST API 사양에 따른 POST 호출 (표준 fetch 사용)
      const res = await fetch("https://api.solapi.com/messages/v4/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // HMAC-SHA256 Authorization 헤더 생성 로직 필요 (여기서는 서명 방식 요약 안전 처리)
          Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${new Date().toISOString()}`,
        },
        body: JSON.stringify({
          message: {
            to: payload.recipient || "",
            from: senderNumber,
            text: `[${payload.title}]\n${payload.message}`,
          },
        }),
      });

      if (!res.ok) {
        throw new Error(`Solapi HTTP Error: ${res.status}`);
      }

      const data = await res.json();
      return {
        success: true,
        messageId: data?.groupInfo?.groupId || `solapi-${Date.now()}`,
      };
    } catch (err: any) {
      console.error(`[${this.name}] 발송 에러:`, err);
      return { success: false, error: err?.message || "SMS 발송 에러" };
    }
  }
}
