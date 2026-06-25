"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, Star, ShieldCheck, ShieldAlert, Loader2, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { type Review, formatAuthorName } from "@/lib/supabase/reviews";

export function ReviewsAdmin({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "pending">("all");

  // 등록 폼 필드
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("5");
  const [isAnon, setIsAnon] = useState(true);
  const [order, setOrder] = useState("1");

  const pendingCount = reviews.filter((r) => !r.published).length;
  const filtered = reviews
    .filter((r) => (filterMode === "pending" ? !r.published : true))
    .sort((a, b) => {
      if (a.published !== b.published) return a.published ? 1 : -1; // 미공개 먼저 노출
      return a.display_order - b.display_order;
    });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !content) return;

    setLoadingId("create");
    try {
      const payload: Review = {
        id: `rv-temp-${Date.now()}`,
        author_name: authorName,
        content,
        rating: Number(rating) || 5,
        is_anonymous: isAnon,
        published: true, // 직접 등록은 즉시 공개
        display_order: Number(order) || 1,
      };

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "review", action: "save", data: payload }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("신규 후기가 등록되었습니다.");
        setReviews((prev) => [payload, ...prev]);
        setAuthorName("");
        setContent("");
      } else {
        toast.error("등록 실패");
      }
    } catch {
      toast.error("서버 에러");
    } finally {
      setLoadingId(null);
    }
  };

  const handleTogglePublish = async (review: Review) => {
    setLoadingId(review.id);
    const updated = { ...review, published: !review.published };
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "review", action: "save", data: updated }),
      });
      if (res.ok) {
        setReviews((prev) => prev.map((r) => (r.id === review.id ? updated : r)));
        toast.success(`'${review.author_name}' 후기 ${updated.published ? "정식 게시 승인!" : "비공개 처리 완료"}`);
      }
    } catch {
      toast.error("상태 변경 오류");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleAnon = async (review: Review) => {
    setLoadingId(review.id);
    const updated = { ...review, is_anonymous: !review.is_anonymous };
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "review", action: "save", data: updated }),
      });
      if (res.ok) {
        setReviews((prev) => prev.map((r) => (r.id === review.id ? updated : r)));
        toast.success("익명 마스킹 설정 반영됨");
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (review: Review) => {
    if (!confirm(`'${review.author_name}' 님의 후기 기록을 삭제하시겠습니까?`)) return;

    setLoadingId(review.id);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "review", action: "delete", data: { id: review.id } }),
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== review.id));
        toast.success("삭제되었습니다.");
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 대기중 배너 및 필터 */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-amber-50 border border-amber-200 p-5 rounded-3xl gap-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-amber-600 animate-pulse shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-950">
              방문자가 접수한 미승인 대기 후기가 총 <span className="text-red-600 font-extrabold">{pendingCount}개</span> 있습니다.
            </p>
            <p className="text-xs text-amber-800 mt-0.5">스팸이나 욕설 여부를 확인하신 뒤 '정식 게시 승인' 버튼을 누르시면 홈페이지에 노출됩니다.</p>
          </div>
        </div>

        <div className="flex bg-amber-200/50 p-1 rounded-2xl shrink-0">
          <Button
            type="button"
            size="sm"
            onClick={() => setFilterMode("all")}
            variant={filterMode === "all" ? "default" : "ghost"}
            className="rounded-xl text-xs font-bold"
          >
            전체 보기 ({reviews.length})
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => setFilterMode("pending")}
            variant={filterMode === "pending" ? "default" : "ghost"}
            className="rounded-xl text-xs font-bold text-amber-950"
            style={filterMode === "pending" ? { background: "#D97706", color: "white" } : {}}
          >
            대기중만 보기 ({pendingCount})
          </Button>
        </div>
      </div>

      {/* 후기 직접 등록 폼 */}
      <form onSubmit={handleCreate} className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs space-y-4">
        <h2 className="text-sm font-bold flex items-center gap-1.5 text-[var(--color-brand-teal)]">
          <Plus className="h-4 w-4" />
          <span>신규 후기 직접 작성 및 등록 (직접 등록 시 즉시 메인 게시)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          <div className="md:col-span-3 space-y-1.5">
            <Label className="text-xs font-bold">작성자 명칭 (예: 이*진 어머니)</Label>
            <Input required value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="김서연 학부모님" className="h-11 rounded-xl text-sm font-bold" />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs font-bold">만족도 별점 (1~5)</Label>
            <Input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} className="h-11 rounded-xl text-center font-bold text-amber-500" />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs font-bold">출력 순서</Label>
            <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="h-11 rounded-xl text-center font-bold" />
          </div>

          <div className="md:col-span-3 pt-8 pl-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="anonForm" checked={isAnon} onCheckedChange={(val) => setIsAnon(Boolean(val))} />
              <label htmlFor="anonForm" className="text-xs font-bold text-muted-foreground cursor-pointer select-none">
                이름 익명 처리 (김☆☆ 형태로 자동 변환)
              </label>
            </div>
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={loadingId === "create"} className="w-full h-11 rounded-xl font-bold text-white shadow-md mt-6" style={{ background: "var(--color-brand-green)" }}>
              {loadingId === "create" ? <Loader2 className="h-4 w-4 animate-spin" /> : "등록하기"}
            </Button>
          </div>

          <div className="md:col-span-12 space-y-1.5 pt-2">
            <Label className="text-xs font-bold">후기 본문 내용</Label>
            <Textarea required value={content} onChange={(e) => setContent(e.target.value)} placeholder="치료 후기 내용을 따뜻하고 자세하게 입력해 주세요." className="min-h-24 rounded-2xl text-sm p-4 leading-relaxed" />
          </div>
        </div>
      </form>

      {/* 후기 목록 테이블 카드 */}
      <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[var(--color-brand-teal)] flex items-center justify-between">
          <span>💬 등록 및 접수된 후기 리스트</span>
          <span className="text-xs font-normal text-muted-foreground">이름 익명 처리를 켜시면 방문자 화면에는 김☆☆ 형태로 보호되어 보입니다.</span>
        </h2>

        <div className="space-y-4 pt-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">해당되는 후기가 없습니다.</div>
          ) : (
            filtered.map((item) => {
              const displayTitle = formatAuthorName(item.author_name, item.is_anonymous);
              return (
                <div
                  key={item.id}
                  className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-3xl border transition-all gap-5 ${
                    !item.published ? "bg-amber-50/60 border-amber-300 shadow-sm" : "bg-background border-border hover:bg-muted/30"
                  }`}
                >
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {!item.published ? (
                        <Badge className="bg-amber-500 text-white font-extrabold text-[10px] animate-pulse">미승인 대기중</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-emerald-700 bg-emerald-50 border-emerald-200">정식 게시중</Badge>
                      )}

                      <span className="font-extrabold text-base text-foreground">{displayTitle}</span>
                      <span className="text-xs text-muted-foreground font-mono">({item.author_name})</span>

                      <div className="flex items-center text-amber-500 text-xs ml-1">
                        {"★".repeat(item.rating || 5)}
                        <span className="text-slate-300">{"★".repeat(5 - (item.rating || 5))}</span>
                      </div>
                    </div>

                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap bg-muted/40 p-3.5 rounded-2xl border border-border/60">
                      {item.content}
                    </p>
                  </div>

                  {/* 액션 제어 */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 justify-end">
                    <Button
                      type="button"
                      onClick={() => handleTogglePublish(item)}
                      disabled={loadingId === item.id}
                      size="sm"
                      className={`rounded-xl text-xs font-bold px-3.5 h-10 ${
                        !item.published ? "bg-amber-600 hover:bg-amber-700 text-white shadow-md animate-bounce" : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {item.published ? <><Eye className="h-3.5 w-3.5 mr-1" />게시 중지</> : <><ShieldCheck className="h-4 w-4 mr-1 text-amber-200" />정식 게시 승인!</>}
                    </Button>

                    <Button
                      type="button"
                      onClick={() => handleToggleAnon(item)}
                      disabled={loadingId === item.id}
                      variant={item.is_anonymous ? "default" : "outline"}
                      size="sm"
                      className="rounded-xl text-xs h-10 px-3"
                      style={item.is_anonymous ? { background: "var(--color-brand-teal)", color: "white" } : {}}
                    >
                      {item.is_anonymous ? "🔒 익명 보호중" : "🔓 실명 노출중"}
                    </Button>

                    <Button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={loadingId === item.id}
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      {loadingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
