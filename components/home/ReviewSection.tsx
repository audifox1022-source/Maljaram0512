"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Star, Quote, PenTool, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { type Review, formatAuthorName } from "@/lib/supabase/reviews";

export function ReviewSection({ reviews }: { reviews: Review[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 방문자 제출 폼 상태
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [isAnon, setIsAnon] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content) return;

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author_name: name, content, rating, is_anonymous: isAnon }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message);
        setOpen(false);
        setName("");
        setContent("");
      } else {
        toast.error(data.error || "제출 실패");
      }
    } catch {
      toast.error("통신 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-24 section-padding bg-gradient-to-b from-background via-[var(--color-brand-cream)]/40 to-background border-t border-border/50 relative overflow-hidden">
      <div className="container-wide space-y-16">
        {/* 타이틀 헤더 */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-brand-orange-light)] text-[var(--color-brand-orange-dark)] font-bold text-xs uppercase tracking-wider">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span>Real Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--color-brand-teal)]">
            따뜻한 성장의 동행 후기
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            말자람터 언어심리연구소와 함께 아이의 눈빛과 언어가 달라진 학부모님들의 진심 어린 생생한 이야기입니다.
          </p>
        </div>

        {/* 후기 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((item) => {
            const displayName = formatAuthorName(item.author_name, item.is_anonymous);
            return (
              <div
                key={item.id}
                className="bg-card rounded-3xl p-8 border border-border/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group"
              >
                <Quote className="absolute top-6 right-6 h-10 w-10 text-[var(--color-brand-green-light)] opacity-50 -z-0 group-hover:scale-110 transition-transform" />

                <div className="space-y-4 relative z-10">
                  {/* 별점 */}
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-normal pt-2 whitespace-pre-line">
                    "{item.content}"
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-border/60 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[var(--color-brand-teal)] text-white font-black flex items-center justify-center text-sm shadow-inner">
                      {displayName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">{displayName}</p>
                      <p className="text-[11px] text-muted-foreground tracking-wide">말자람터 내담 학부모님</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">인증됨 ✓</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 CTA: 후기 직접 등록 모달 트리거 */}
        <div className="text-center pt-8">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              render={
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 py-6 font-bold border-2 border-[var(--color-brand-teal)] text-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal)] hover:text-white transition-all shadow-sm group text-base"
                />
              }
            >
              <PenTool className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              <span>간편 치료 후기 남기기</span>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg p-6 md:p-8 rounded-3xl border-border">
              <DialogHeader className="space-y-2 text-left">
                <DialogTitle className="text-2xl font-bold text-[var(--color-brand-teal)]">
                  🌻 따뜻한 치료 동행 후기 접수
                </DialogTitle>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  남겨주신 소중한 후기는 센터장 확인 후 개인정보 보호(김☆☆ 마스킹)를 거쳐 메인 페이지에 정식 소개됩니다.
                </p>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">보호자님 명칭 (예: 김서연 어머니)</Label>
                  <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="이준호 아버님" className="h-11 rounded-xl font-bold text-sm" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">만족도 별점</Label>
                  <div className="flex gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className={`h-10 w-10 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                          rating >= num ? "bg-amber-500 text-white shadow" : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">후기 내용</Label>
                  <Textarea required value={content} onChange={(e) => setContent(e.target.value)} placeholder="선생님과의 치료 과정에서 느끼신 점이나 변화된 아이의 모습을 자유롭게 적어주세요." className="min-h-28 rounded-2xl p-4 text-sm leading-relaxed" />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox id="anonSubmit" checked={isAnon} onCheckedChange={(val) => setIsAnon(Boolean(val))} />
                  <label htmlFor="anonSubmit" className="text-xs font-bold text-muted-foreground cursor-pointer select-none">
                    이름 익명 처리 동의 (김☆☆ 형태로 안전하게 보호됩니다)
                  </label>
                </div>

                <Button type="submit" disabled={loading} className="w-full h-12 rounded-full font-bold text-white shadow-lg text-base mt-4" style={{ background: "var(--color-brand-teal)" }}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-4 w-4 mr-2" />후기 접수하기</>}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
