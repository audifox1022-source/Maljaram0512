import type { Metadata } from "next";
import { AdminNav } from "./AdminNav";

export const metadata: Metadata = {
  title: "운영진 관리자 시스템 (CMS)",
  description: "말자람터 언어심리연구소 공식 홈페이지 백오피스 관리자 대시보드",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* 관리자 전용 네비게이션 헤더 */}
      <AdminNav />
      <div className="container-wide pt-8">{children}</div>
    </div>
  );
}
