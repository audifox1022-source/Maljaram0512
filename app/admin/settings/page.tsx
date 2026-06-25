import { getSiteSettings } from "@/lib/supabase/settings";
import { SettingsAdmin } from "./SettingsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--color-brand-teal)" }}>
          사이트 전역 기본 정보 설정
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          로고 사진, 대표 전화번호, 오시는 길 주소, 영업시간, 그리고 하단에 들어갈 카카오톡·인스타그램 등 SNS 주소를 관리합니다.
        </p>
      </div>

      <SettingsAdmin initialSettings={settings} />
    </div>
  );
}
