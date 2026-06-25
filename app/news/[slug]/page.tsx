import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug } from "@/lib/supabase/posts";
import { ArrowLeft, Calendar, Tag, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

// SEO 동적 메타데이터 생성 함수
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const post = await getPostBySlug(resolved?.slug);
  if (!post) {
    return { title: "게시글을 찾을 수 없습니다 | 말자람터 언어심리연구소" };
  }

  return {
    title: `${post.title} | 말자람터 언어심리연구소`,
    description: post.body.slice(0, 160).replace(/\n/g, " "),
    openGraph: {
      title: post.title,
      description: post.body.slice(0, 160).replace(/\n/g, " "),
      images: post.thumbnail_url ? [post.thumbnail_url] : [],
    },
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const post = await getPostBySlug(resolved?.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen py-16 md:py-24 bg-gradient-to-b from-background via-[var(--color-brand-cream)]/10 to-background animate-fade-in">
      <article className="container-wide max-w-4xl space-y-10">
        {/* 뒤로가기 버튼 */}
        <div>
          <Link href="/news">
            <Button variant="ghost" className="rounded-xl gap-2 text-muted-foreground hover:text-foreground font-bold pl-2">
              <ArrowLeft className="h-4 w-4" />
              <span>소식 목록으로 돌아가기</span>
            </Button>
          </Link>
        </div>

        {/* 글 헤더 영역 */}
        <div className="space-y-6 border-b border-border pb-10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-[var(--color-brand-teal)] text-white font-extrabold text-xs px-3 py-1">
              {post.category}
            </Badge>
            <span className="text-sm text-muted-foreground font-mono flex items-center gap-1.5">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>{post.published_at.slice(0, 16).replace("T", " ")}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-foreground">
            {post.title}
          </h1>
        </div>

        {/* 대표 썸네일 사진 */}
        {post.thumbnail_url && (
          <div className="rounded-3xl overflow-hidden shadow-lg border border-border bg-muted max-h-[500px]">
            <img src={post.thumbnail_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* 본문 텍스트 렌더링 */}
        <div className="prose prose-lg dark:prose-invert max-w-none py-6 text-foreground/90 leading-relaxed font-normal whitespace-pre-wrap text-base sm:text-lg">
          {post.body}
        </div>

        {/* 하단 공유 CTA 등 */}
        <div className="pt-12 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6 bg-card p-8 rounded-3xl shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-base text-[var(--color-brand-teal)]">도움이 되셨나요?</h3>
            <p className="text-xs text-muted-foreground">우리 아이 발달 진단 및 상담 예약은 상단 메뉴에서 실시간 접수 가능합니다.</p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Link href="/reservation" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto rounded-full font-bold px-6 text-white shadow" style={{ background: "var(--color-brand-green)" }}>
                상담 예약하기
              </Button>
            </Link>
            <Link href="/news" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto rounded-full font-bold px-6">
                목록 보기
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
