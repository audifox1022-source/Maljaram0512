import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Layers,
  Sparkles,
  Target,
} from "lucide-react";
import { getProgramBySlug, getPublishedPrograms } from "@/lib/supabase/programs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ISR 재검증 주기 설정 (1시간)
export const revalidate = 3600;

/**
 * 정적 페이지 빌드(SSG)를 위해 등록된 모든 프로그램의 slug 목록을 미리 생성합니다.
 */
export async function generateStaticParams() {
  const { programs } = await getPublishedPrograms();
  return programs.map((p) => ({
    slug: p.slug,
  }));
}

/**
 * SEO 처리: 각 프로그램별 맞춤 메타데이터 동적 생성
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const program = await getProgramBySlug(resolvedParams.slug);

  if (!program) {
    return {
      title: "프로그램을 찾을 수 없습니다",
    };
  }

  return {
    title: program.title,
    description: program.summary,
    openGraph: {
      title: `${program.title} | 말자람터 언어심리연구소`,
      description: program.summary,
      type: "article",
      images: program.image_url ? [program.image_url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: program.title,
      description: program.summary,
      images: program.image_url ? [program.image_url] : [],
    },
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const program = await getProgramBySlug(resolvedParams.slug);

  if (!program) {
    notFound();
  }

  // 줄바꿈 텍스트를 배열로 파싱 (효과 및 진행방식 표기용)
  const effectList = program.effect.split("\n").filter(Boolean);
  const processList = program.process.split("\n").filter(Boolean);

  return (
    <>
      {/* ── 상단 뒤로가기 링크 ── */}
      <div className="bg-muted/30 border-b border-border py-4 section-padding">
        <div className="container-narrow">
          <Link
            href="/programs"
            className="inline-flex items-center text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            전체 프로그램 목록으로 돌아가기
          </Link>
        </div>
      </div>

      {/* ── 프로그램 헤더 히어로 ── */}
      <section className="py-12 md:py-20 section-padding" style={{ background: "var(--color-brand-cream)" }}>
        <div className="container-narrow">
          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold mb-4 text-white"
            style={{ background: "var(--color-brand-green)" }}>
            <Sparkles className="h-3 w-3" />
            <span>전문 프로그램 상세</span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-bold mb-6 tracking-tight"
            style={{ color: "var(--color-brand-teal)" }}
          >
            {program.title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
            {program.summary}
          </p>

          {/* 대상 요약 하이라이트 */}
          <div
            className="rounded-2xl p-6 border-l-4 shadow-sm bg-card"
            style={{ borderColor: "var(--color-brand-orange)" }}
          >
            <div className="flex items-center gap-2 mb-1 text-sm font-bold" style={{ color: "var(--color-brand-orange-dark)" }}>
              <Target className="h-4 w-4" />
              <span>핵심 대상</span>
            </div>
            <p className="text-base font-semibold text-foreground">
              {program.target}
            </p>
          </div>
        </div>
      </section>

      {/* ── 메인 상세 이미지 및 설명 ── */}
      <section className="py-16 section-padding">
        <div className="container-narrow space-y-12">
          {program.image_url && (
            <div className="rounded-3xl overflow-hidden shadow-lg aspect-[16/9] relative border border-border">
              <Image
                src={program.image_url}
                alt={`${program.title} 프로그램 실제 모습`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          )}

          {/* 프로그램 개요 소개 */}
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--color-brand-teal)" }}>
              프로그램 소개
            </h2>
            <div className="text-base text-muted-foreground leading-relaxed space-y-4">
              <p>{program.description}</p>
            </div>
          </div>

          {/* 기대 효과 목록 */}
          <div className="rounded-3xl p-8 border border-border" style={{ background: "var(--color-brand-beige)" }}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: "var(--color-brand-teal)" }}>
              <CheckCircle className="h-6 w-6" style={{ color: "var(--color-brand-green)" }} />
              <span>기대 효과</span>
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {effectList.map((eff, i) => (
                <li key={i} className="flex items-start gap-3 bg-card p-4 rounded-2xl shadow-xs">
                  <span className="h-2 w-2 rounded-full mt-2 shrink-0" style={{ background: "var(--color-brand-green)" }} />
                  <span className="text-sm font-medium text-foreground leading-snug">{eff.replace(/^[•\-\*]\s*/, "")}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 진행 단계 로드맵 */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: "var(--color-brand-teal)" }}>
              <Layers className="h-6 w-6" style={{ color: "var(--color-brand-orange)" }} />
              <span>진행 방식 및 프로세스</span>
            </h2>
            <div className="space-y-4">
              {processList.map((proc, stepIdx) => (
                <div key={stepIdx} className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-white text-sm"
                    style={{ background: "var(--color-brand-teal)" }}
                  >
                    {stepIdx + 1}
                  </div>
                  <div className="pt-1">
                    <p className="text-sm md:text-base font-semibold text-foreground">
                      {proc.replace(/^\d+단계:\s*/, "")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 하단 CTA 예약 섹션 ── */}
      <section
        className="py-20 section-padding text-center text-white"
        style={{ background: "var(--color-brand-teal)" }}
      >
        <div className="container-narrow">
          <h2 className="text-3xl font-bold mb-4">
            우리 아이에게 이 프로그램이 적합할까요?
          </h2>
          <p className="text-base md:text-lg mb-8 opacity-90 max-w-lg mx-auto">
            전문가와의 1:1 무료 초기 상담을 통해 아이의 언어 상태를 꼼꼼히 점검해 드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/reservation"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-10 bg-white hover:bg-white/90 text-[var(--color-brand-teal)] font-bold shadow-lg"
              )}
            >
              상담 예약 신청하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-10 border-2 border-white bg-transparent hover:bg-white/10 text-white font-semibold"
              )}
            >
              질문 남기기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
