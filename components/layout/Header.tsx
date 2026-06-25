"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Phone } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/supabase/settings";
import { defaultHeaderMenus, type NavMenu } from "@/lib/supabase/menus";

export function Header({ settings, menus }: { settings?: SiteSettings; menus?: NavMenu[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const siteName = settings?.site_name || "말자람터 언어심리연구소";
  const phoneNum = settings?.phone || "02-1234-5678";
  const logoUrl = settings?.logo_url;

  const activeMenus = menus && menus.length > 0 ? menus : defaultHeaderMenus;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container-wide section-padding">
        <div className="flex h-16 items-center justify-between">
          {/* ── 로고 ── */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label={`${siteName} 홈으로`}>
            {logoUrl && logoUrl !== "/file.svg" ? (
              <img src={logoUrl} alt="로고" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
            ) : (
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white text-sm font-bold shadow-sm transition-transform group-hover:scale-105 shrink-0"
                style={{ background: "var(--color-brand-green)" }}
                aria-hidden="true"
              >
                말
              </div>
            )}
            <div className="leading-tight">
              <p className="text-sm font-bold" style={{ color: "var(--color-brand-teal)" }}>
                {siteName.replace(" 언어심리연구소", "")}
              </p>
              <p className="text-[10px] text-muted-foreground tracking-wide">
                {siteName.includes("언어심리연구소") ? "언어심리연구소" : "공식 센터"}
              </p>
            </div>
          </Link>

          {/* ── 데스크톱 내비게이션 ── */}
          <nav className="hidden md:flex items-center gap-1" aria-label="주 메뉴">
            {activeMenus.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  "hover:bg-primary/10 hover:text-primary",
                  isActive(item.href)
                    ? "text-primary bg-primary/10 font-bold"
                    : "text-muted-foreground"
                )}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
                {isActive(item.href) && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* ── 데스크톱 우측 버튼 ── */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${phoneNum}`}
              className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              aria-label="전화 문의"
            >
              <Phone className="h-4 w-4 text-[var(--color-brand-green)]" aria-hidden="true" />
              <span>{phoneNum}</span>
            </a>
            <Link
              href="/reservation"
              className={cn(buttonVariants({ size: "sm" }), "rounded-full px-6 font-bold shadow-sm")}
              style={{ background: "var(--color-brand-teal)", color: "white" }}
            >
              예약하기
            </Link>
          </div>

          {/* ── 모바일 햄버거 메뉴 ── */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="모바일 메뉴 열기" />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-xs font-bold"
                      style={{ background: "var(--color-brand-green)" }}
                    >
                      말
                    </div>
                    <div>
                      <p className="text-sm font-bold line-clamp-1" style={{ color: "var(--color-brand-teal)" }}>
                        {siteName}
                      </p>
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-8 flex flex-col gap-1" aria-label="모바일 메뉴">
                {activeMenus.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      "hover:bg-primary/10 hover:text-primary",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-muted-foreground"
                    )}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-border space-y-2">
                <Link
                  href="/reservation"
                  onClick={() => setMobileOpen(false)}
                  className={cn(buttonVariants(), "w-full rounded-full font-bold")}
                  style={{ background: "var(--color-brand-teal)", color: "white" }}
                >
                  상담 예약하기
                </Link>
                <a
                  href={`tel:${phoneNum}`}
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors py-2.5 bg-muted rounded-full"
                >
                  <Phone className="h-4 w-4 text-[var(--color-brand-green)]" aria-hidden="true" />
                  <span>전화 ({phoneNum})</span>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
