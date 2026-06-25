/**
 * MockNotificationProvider
 *
 * 개발/테스트 단계에서 사용하는 알림 제공자입니다.
 * 실제 메시지를 보내는 대신 콘솔에 출력합니다.
 *
 * 향후 실제 서비스로 교체할 때는 이 파일만 교체하면 됩니다.
 */
import type {
  NotificationProvider,
  NotificationPayload,
  NotificationResult,
} from "./types";

export class MockNotificationProvider implements NotificationProvider {
  readonly name = "MockNotificationProvider";

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const messageId = `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    console.group(`[${this.name}] 알림 전송 시뮬레이션`);
    console.log("📌 타입:", payload.type);
    console.log("📝 제목:", payload.title);
    console.log("💬 내용:", payload.message);
    if (payload.recipient) {
      console.log("📮 수신자:", payload.recipient);
    }
    if (payload.metadata) {
      console.log("📦 메타데이터:", payload.metadata);
    }
    console.log("🆔 메시지 ID:", messageId);
    console.groupEnd();

    return {
      success: true,
      messageId,
    };
  }
}

/**
 * 앱 전체에서 사용할 기본 알림 제공자 인스턴스
 * 나중에 실제 제공자로 교체:
 *   export const notificationProvider = new EmailNotificationProvider(...)
 */
export const notificationProvider: NotificationProvider =
  new MockNotificationProvider();
