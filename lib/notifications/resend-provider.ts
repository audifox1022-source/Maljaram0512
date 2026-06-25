import type { NotificationProvider, NotificationPayload, NotificationResult } from "./types";

/**
 * ResendProvider
 * 이메일 발송 전용 프로바이더 (Next.js 친화적 서비스)
 */
export class ResendProvider implements NotificationProvider {
  readonly name = "ResendProvider";

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const apiKey = process.env.RESEND_API_KEY;
    const senderEmail = process.env.RESEND_SENDER_EMAIL || "info@maljarumter.com";

    if (!apiKey) {
      console.warn(`[${this.name}] RESEND_API_KEY가 존재하지 않아 Mock 처리합니다.`);
      return { success: true, messageId: `mock-resend-${Date.now()}` };
    }

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: `말자람터 연구소 <${senderEmail}>`,
          to: payload.recipient || "client@example.com",
          subject: payload.title,
          text: payload.message,
        }),
      });

      if (!res.ok) {
        throw new Error(`Resend API Error: ${res.status}`);
      }

      const data = await res.json();
      return {
        success: true,
        messageId: data?.id || `resend-${Date.now()}`,
      };
    } catch (err: any) {
      console.error(`[${this.name}] 이메일 에러:`, err);
      return { success: false, error: err?.message || "Email 전송 실패" };
    }
  }
}
