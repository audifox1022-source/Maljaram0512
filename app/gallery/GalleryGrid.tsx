"use client";

import { useState } from "react";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GalleryItem } from "@/lib/supabase/gallery";

export function GalleryGrid({ initialItems }: { initialItems: GalleryItem[] }) {
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (!initialItems || initialItems.length === 0) {
    return (
      <div className="text-center py-20 bg-card rounded-3xl border border-border">
        <p className="text-muted-foreground text-sm font-medium">등록된 시설 사진이 없습니다.</p>
      </div>
    );
  }

  // 카테고리 고유 목록 생성
  const cats = Array.from(new Set(initialItems.map((item) => item.category || "기타분류")));
  const categories = ["all", ...cats];

  const filtered = selectedCat === "all" ? initialItems : initialItems.filter((item) => (item.category || "기타분류") === selectedCat);

  return (
    <div className="space-y-8">
      {/* 카테고리 필터 버튼 탭 */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            type="button"
            onClick={() => setSelectedCat(cat)}
            variant={selectedCat === cat ? "default" : "outline"}
            className="rounded-full px-5 py-2 text-xs font-bold transition-all shadow-xs"
            style={selectedCat === cat ? { background: "var(--color-brand-teal)", color: "white" } : {}}
          >
            {cat === "all" ? "🌻 전체 보기" : `# ${cat}`}
          </Button>
        ))}
      </div>

      {/* 사진 반응형 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filtered.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setLightboxIdx(idx)}
            className="group relative bg-card rounded-3xl overflow-hidden border border-border/80 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer aspect-4/3 flex flex-col justify-end"
          >
            <img src={item.image_url} alt={item.caption || "갤러리 사진"} className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" />

            {/* 오버레이 그라데이션 및 정보 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            <div className="relative z-10 p-6 text-white space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Badge className="bg-[var(--color-brand-orange-light)] text-[var(--color-brand-orange-dark)] font-extrabold text-[10px] mb-1">
                {item.category}
              </Badge>
              <p className="font-bold text-sm md:text-base leading-snug line-clamp-2">{item.caption || "말자람터 연구소 시설"}</p>
            </div>

            <div className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>

      {/* 전체화면 라이트박스(Lightbox) 모달 뷰어 */}
      {lightboxIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center animate-fade-in p-4 md:p-12">
          {/* 닫기 버튼 */}
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
            aria-label="닫기"
          >
            <X className="h-6 w-6" />
          </button>

          {/* 이전 버튼 */}
          {filtered.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((prev) => (prev! - 1 + filtered.length) % filtered.length);
              }}
              className="absolute left-4 md:left-8 z-50 p-4 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
              aria-label="이전 사진"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {/* 메인 사진 영역 */}
          <div className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img src={filtered[lightboxIdx].image_url} alt="크게 보기" className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10" />

            {/* 캡션 설명 바 */}
            <div className="mt-6 text-center text-white space-y-1 bg-black/50 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md max-w-2xl">
              <Badge className="bg-[var(--color-brand-teal)] text-white font-extrabold text-[10px]">
                {filtered[lightboxIdx].category}
              </Badge>
              <p className="font-bold text-sm md:text-base">{filtered[lightboxIdx].caption || "연구소 공간"}</p>
              <p className="text-[11px] text-slate-400 font-mono">
                {lightboxIdx + 1} / {filtered.length}
              </p>
            </div>
          </div>

          {/* 다음 버튼 */}
          {filtered.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((prev) => (prev! + 1) % filtered.length);
              }}
              className="absolute right-4 md:right-8 z-50 p-4 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
              aria-label="다음 사진"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
