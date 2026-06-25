import { getNotificationProvider } from "./factory";

/**
 * 앱 전체에서 호출할 통합 알림 인스턴스
 * .env의 NOTIFICATION_PROVIDER 설정값에 따라 Mock, Solapi, Resend 중 자동 배정됩니다.
 */
export const notificationProvider = getNotificationProvider();
export * from "./types";
