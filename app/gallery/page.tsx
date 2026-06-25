import { getPublishedGallery } from "@/lib/supabase/gallery";
import { Image as ImageIcon } from "lucide-react";
import { GalleryGrid } from "./GalleryGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "시설 및 교구 사진 갤러리 | 말자람터 언어심리연구소",
  description: "아이들이 편안하게 발달할 수 있도록 따스하고 청결하게 설계된 말자람터 언어심리연구소 내부 치료실 전경과 특별 교구재 사진을 확인하세요.",
};

export default async function GalleryIndexPage() {
  const items = await getPublishedGallery();

  return (
    <div className="min-h-screen py-16 md:py-24 bg-gradient-to-b from-background via-[var(--color-brand-cream)]/30 to-background animate-fade-in">
      <div className="container-wide max-w-6xl space-y-12">
        {/* 타이틀 헤더 */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--color-brand-orange-light)] text-[var(--color-brand-orange-dark)] font-bold text-xs uppercase tracking-wider">
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Center Facilities Gallery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-teal)]">
            따뜻한 공간 갤러리
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            아이들의 시선이 닿는 곳마다 온기와 정성을 담았습니다. 사진을 누르시면 화면 전체 크기로 생생하게 감상하실 수 있습니다.
          </p>
        </div>

        {/* 탭 필터 및 사진 그리드 클라이언트 컴포넌트 */}
        <GalleryGrid initialItems={items} />
      </div>
    </div>
  );
}
