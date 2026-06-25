"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Banner } from "@/lib/supabase/banners";

export function HeroBannerCarousel({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  const item = banners[current];

  return (
    <div className="relative w-full bg-gradient-to-r from-[var(--color-brand-teal)] to-[var(--color-brand-green)] text-white overflow-hidden py-3 px-4 shadow-md transition-all duration-500">
      <div className="container-wide flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-1 truncate">
          <Sparkles className="h-4 w-4 text-amber-300 shrink-0 animate-pulse" />
          <p className="text-xs md:text-sm font-bold tracking-wide truncate">
            {item.title}
          </p>
        </div>

        {item.link_url && (
          <Link
            href={item.link_url}
            className="text-xs bg-white text-[var(--color-brand-teal)] px-3.5 py-1 rounded-full font-bold hover:bg-amber-100 transition-colors shrink-0 shadow-xs"
          >
            자세히 보기 &rarr;
          </Link>
        )}

        {/* 좌우 네비게이션 화살표 */}
        {banners.length > 1 && (
          <div className="flex items-center gap-1 shrink-0 ml-2 border-l border-white/20 pl-2">
            <button
              onClick={() => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="이전 배너"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="text-[10px] font-mono opacity-80">
              {current + 1}/{banners.length}
            </span>
            <button
              onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="다음 배너"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
