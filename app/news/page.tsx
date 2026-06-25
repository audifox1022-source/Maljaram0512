import Link from "next/link";
import { getPublishedPosts } from "@/lib/supabase/posts";
import { Newspaper, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "센터 소식 및 공지사항 | 말자람터 언어심리연구소",
  description: "말자람터 언어심리연구소의 공식 공지사항, 치료 프로그램 일정, 전문가 발달 칼럼 소식을 확인하세요.",
};

export default async function NewsIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen py-16 md:py-24 bg-gradient-to-b from-background via-[var(--color-brand-cream)]/20 to-background animate-fade-in">
      <div className="container-wide max-w-5xl space-y-12">
        {/* 헤더 */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--color-brand-green-light)] text-[var(--color-brand-green)] font-bold text-xs uppercase tracking-wider">
            <Newspaper className="h-3.5 w-3.5" />
            <span>Center News & Columns</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-teal)]">
            말자람터 소식·공지
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            연구소의 새로운 소식과 아이 양육에 힘이 되는 따스한 치료 전문가의 글을 전합니다.
          </p>
        </div>

        {/* 글 목록 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          {posts.length === 0 ? (
            <div className="col-span-2 text-center py-20 bg-card rounded-3xl border border-border">
              <p className="text-muted-foreground text-sm font-medium">등록된 소식이 없습니다.</p>
            </div>
          ) : (
            posts.map((item) => (
              <Link
                key={item.id}
                href={`/news/${encodeURIComponent(item.slug)}`}
                className="group bg-card rounded-3xl border border-border/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* 썸네일 */}
                <div className="h-52 w-full bg-muted overflow-hidden relative border-b">
                  {item.thumbnail_url ? (
                    <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--color-brand-cream)] to-[var(--color-brand-green-light)] flex items-center justify-center text-[var(--color-brand-teal)] opacity-40">
                      <Newspaper className="h-16 w-16" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-[var(--color-brand-teal)] text-white font-extrabold text-xs px-3 py-1 shadow-md">
                      {item.category}
                    </Badge>
                  </div>
                </div>

                {/* 텍스트 */}
                <div className="p-7 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-foreground group-hover:text-[var(--color-brand-teal)] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed whitespace-pre-wrap font-normal">
                      {item.body}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{item.published_at.slice(0, 10)}</span>
                    </span>
                    <span className="text-[var(--color-brand-teal)] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      자세히 읽기 <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
