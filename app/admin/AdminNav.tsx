"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  MessageSquare,
  LogOut,
  Shield,
  FileEdit,
  Users,
  BookOpen,
  HelpCircle,
  Settings,
  Compass,
  PanelTop,
  Star,
  Newspaper,
  Image as ImageIcon,
  Globe,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  FolderTree,
  CalendarRange,
  Sliders,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavGroup {
  id: string;
  label: string;
  icon: any;
  items: { name: string; href: string; icon: any }[];
}

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // 그룹 접기/펼치기 상태 (기본적으로 모두 펼침)
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({
    reservation: true,
    content: true,
    setting: true,
  });

  // 페이지 이동 시 모바일 사이드바 자동 닫기
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // 요청하신 그룹 정의 규격
  const groups: NavGroup[] = [
    {
      id: "reservation",
      label: "예약 및 문의 관리",
      icon: CalendarRange,
      items: [
        { name: "상담 예약 관리", href: "/admin/reservations", icon: CalendarCheck },
        { name: "가용 슬롯 설정", href: "/admin/slots", icon: Clock },
        { name: "온라인 문의 접수", href: "/admin/inquiries", icon: MessageSquare },
      ],
    },
    {
      id: "content",
      label: "홈페이지 콘텐츠",
      icon: FolderTree,
      items: [
        { name: "홈 섹션 텍스트", href: "/admin/content", icon: FileEdit },
        { name: "전문가 프로필", href: "/admin/staff", icon: Users },
        { name: "프로그램 안내", href: "/admin/programs", icon: BookOpen },
        { name: "FAQ 문답 설정", href: "/admin/faqs", icon: HelpCircle },
        { name: "이용 후기 관리", href: "/admin/reviews", icon: Star },
        { name: "공지·소식 게시판", href: "/admin/notices", icon: Newspaper },
        { name: "사진 갤러리", href: "/admin/gallery", icon: ImageIcon },
        { name: "배너 및 팝업", href: "/admin/banners", icon: PanelTop },
        { name: "내비 메뉴 설정", href: "/admin/menus", icon: Compass },
      ],
    },
    {
      id: "setting",
      label: "환경 및 SEO 설정",
      icon: Sliders,
      items: [
        { name: "사이트 기본설정", href: "/admin/settings", icon: Settings },
        { name: "페이지별 SEO 메타", href: "/admin/seo", icon: Globe },
      ],
    },
  ];

  return (
    <>
      {/* ── 1. 모바일용 상단 간편 헤더바 (md:hidden) ── */}
      <header className="md:hidden sticky top-0 z-40 bg-card border-b border-border h-14 px-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} className="h-9 w-9 -ml-1 rounded-xl">
            <Menu className="h-5 w-5 text-foreground" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[var(--color-brand-teal)] text-white flex items-center justify-center font-bold">
              <Shield className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm text-[var(--color-brand-teal)]">말자람터 CMS</span>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={handleLogout} className="text-xs h-8 rounded-full px-3 text-red-600 border-red-200">
          <LogOut className="h-3 w-3 mr-1" />
          <span>로그아웃</span>
        </Button>
      </header>

      {/* ── 2. 모바일 오버레이 배경 ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-50 animate-fade-in" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── 3. 좌측 고정 사이드바 본문 (데스크톱 sticky w-64 / 모바일 슬라이드 픽스드 w-72) ── */}
      <aside
        className={`bg-card border-r border-border flex flex-col justify-between transition-all duration-300 z-50 w-72 md:w-64 fixed md:sticky top-0 h-screen shadow-2xl md:shadow-none ${
          mobileOpen ? "left-0 translate-x-0" : "-left-72 -translate-x-full md:left-0 md:translate-x-0"
        }`}
      >
        {/* 상단 사이드바 헤더 */}
        <div className="p-5 border-b border-border flex items-center justify-between shrink-0 bg-muted/20">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[var(--color-brand-teal)] text-white flex items-center justify-center shadow-md">
              <Shield className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight leading-none text-[var(--color-brand-teal)]">말자람터 CMS</span>
              <span className="text-[10px] text-muted-foreground font-mono mt-1">v2.0 Backoffice</span>
            </div>
          </Link>

          {/* 모바일 닫기 X 버튼 */}
          <button onClick={() => setMobileOpen(false)} className="md:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 중단 사이드바 메뉴 리스트 (스크롤 가능 영역) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
          {/* 단독 메뉴: 요약 대시보드 */}
          <div>
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                pathname === "/admin"
                  ? "bg-[var(--color-brand-teal)] text-white shadow-md"
                  : "text-foreground/80 hover:bg-muted hover:text-foreground font-semibold"
              }`}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span>요약 대시보드</span>
            </Link>
          </div>

          {/* 그룹화 아코디언 메뉴들 */}
          {groups.map((group) => {
            const GroupIcon = group.icon;
            const isOpen = openGroups[group.id] !== false;

            return (
              <div key={group.id} className="space-y-1.5">
                {/* 그룹 헤더 토글 버튼 */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full px-3.5 py-1.5 flex items-center justify-between text-xs font-extrabold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <GroupIcon className="h-3.5 w-3.5 text-[var(--color-brand-teal)]" />
                    <span>{group.label}</span>
                  </div>
                  {isOpen ? <ChevronDown className="h-3.5 w-3.5 opacity-60" /> : <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
                </button>

                {/* 그룹 서브아이템 목록 */}
                {isOpen && (
                  <div className="pl-2 space-y-0.5 border-l-2 border-[var(--color-brand-teal)]/20 ml-4 animate-fade-in">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      const isActive = pathname.startsWith(item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? "bg-[var(--color-brand-green-light)] text-[var(--color-brand-green)] font-extrabold shadow-xs"
                              : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                          }`}
                        >
                          <ItemIcon className={`h-4 w-4 shrink-0 ${isActive ? "text-[var(--color-brand-green)]" : "opacity-70"}`} />
                          <span className="truncate">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 하단 사이드바 푸터 (공식 웹사이트 바로가기 + 로그아웃) */}
        <div className="p-4 border-t border-border bg-muted/20 space-y-2 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between p-3 rounded-2xl bg-background border border-border hover:border-[var(--color-brand-teal)] text-xs font-bold text-foreground transition-all group"
          >
            <span>🌐 공개 사이트 홈 보기</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-[var(--color-brand-teal)] transition-colors" />
          </Link>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full h-10 rounded-2xl justify-start px-3 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>운영진 로그아웃</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
