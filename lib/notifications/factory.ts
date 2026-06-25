import type { NotificationProvider } from "./types";
import { MockNotificationProvider } from "./mock-provider";
import { SolapiProvider } from "./solapi-provider";
import { ResendProvider } from "./resend-provider";

export function getNotificationProvider(): NotificationProvider {
  const providerType = process.env.NOTIFICATION_PROVIDER || "mock";

  switch (providerType.toLowerCase()) {
    case "solapi":
      return new SolapiProvider();
    case "resend":
      return new ResendProvider();
    case "mock":
    default:
      return new MockNotificationProvider();
  }
}
