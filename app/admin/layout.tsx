import type { Metadata } from "next";
import { AdminNav } from "./AdminNav";

export const metadata: Metadata = {
  title: "운영진 백오피스 시스템 (CMS)",
  description: "말자람터 언어심리연구소 통합 백오피스 관리자 대시보드",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row antialiased">
      {/* 반응형 그룹화 좌측 사이드바 & 모바일 헤더 */}
      <AdminNav />

      {/* 우측 메인 콘텐츠 영역 */}
      <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 container-wide max-w-7xl mx-auto w-full animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
