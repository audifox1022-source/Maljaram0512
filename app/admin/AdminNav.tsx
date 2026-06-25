"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { LayoutDashboard, CalendarCheck, Clock, MessageSquare, LogOut, Shield, FileEdit, Users, BookOpen, HelpCircle, Settings, Compass, PanelTop } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      toast.success("로그아웃 되었습니다.");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("로그아웃 중 오류 발생");
    }
  };

  const navItems = [
    { name: "요약 대시보드", href: "/admin", icon: LayoutDashboard },
    { name: "상담 예약 관리", href: "/admin/reservations", icon: CalendarCheck },
    { name: "가용 슬롯 설정", href: "/admin/slots", icon: Clock },
    { name: "온라인 문의 접수", href: "/admin/inquiries", icon: MessageSquare },
    { name: "홈 섹션 텍스트", href: "/admin/content", icon: FileEdit },
    { name: "전문가 프로필", href: "/admin/staff", icon: Users },
    { name: "프로그램 안내", href: "/admin/programs", icon: BookOpen },
    { name: "FAQ 문답 설정", href: "/admin/faqs", icon: HelpCircle },
    { name: "사이트 설정", href: "/admin/settings", icon: Settings },
    { name: "메뉴 설정", href: "/admin/menus", icon: Compass },
    { name: "배너·팝업", href: "/admin/banners", icon: PanelTop },
  ];

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border shadow-xs">
      <div className="container-wide">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* 브랜드 로고 뱃지 */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-brand-teal)] text-white shadow-xs">
              <Shield className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg hidden sm:inline" style={{ color: "var(--color-brand-teal)" }}>
              말자람터 CMS
            </span>
          </div>

          {/* GNB 네비게이션 링크 */}
          <nav className="flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-colors shrink-0 ${
                    isActive
                      ? "bg-[var(--color-brand-green-light)] text-[var(--color-brand-green)]"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* 로그아웃 버튼 */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="rounded-full text-xs font-bold gap-1.5 shrink-0 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden md:inline">로그아웃</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
