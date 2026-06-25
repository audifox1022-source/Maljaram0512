/**
 * 알림 시스템 추상화 인터페이스
 *
 * 1단계: MockNotificationProvider (콘솔 출력)
 * 향후 교체 가능: EmailProvider, KakaoProvider, SlackProvider 등
 */

export type NotificationType = "reservation" | "inquiry" | "system";

export interface NotificationPayload {
  type: NotificationType;
  /** 알림 제목 */
  title: string;
  /** 알림 본문 */
  message: string;
  /** 수신자 (이메일 또는 전화번호) */
  recipient?: string;
  /** 추가 메타데이터 */
  metadata?: Record<string, unknown>;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * 모든 알림 제공자가 구현해야 하는 인터페이스
 */
export interface NotificationProvider {
  /**
   * 알림을 전송합니다.
   * @param payload 전송할 알림 내용
   */
  send(payload: NotificationPayload): Promise<NotificationResult>;

  /**
   * 제공자 이름 (로깅 및 디버깅용)
   */
  readonly name: string;
}
