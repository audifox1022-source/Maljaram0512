"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, Calendar, Newspaper, Loader2, Image as ImageIcon, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/lib/supabase/posts";

export function NoticesAdmin({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // 폼 입력 필드
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("공지사항");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [pubAt, setPubAt] = useState("");
  const [body, setBody] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;

    setLoadingId("create");
    try {
      const safeSlug = slug ? slug.trim() : `notice-${Date.now()}`;
      const payload: Post = {
        id: `pt-temp-${Date.now()}`,
        slug: safeSlug,
        title,
        body,
        thumbnail_url: thumbnailUrl || null,
        category,
        published: true,
        published_at: pubAt ? new Date(pubAt).toISOString() : new Date().toISOString(),
      };

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "post", action: "save", data: payload }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("신규 소식 게시글이 등록되었습니다.");
        setPosts((prev) => [payload, ...prev]);
        setTitle("");
        setSlug("");
        setBody("");
        setThumbnailUrl("");
      } else {
        toast.error("등록 실패");
      }
    } catch {
      toast.error("서버 에러");
    } finally {
      setLoadingId(null);
    }
  };

  const handleTogglePublish = async (post: Post) => {
    setLoadingId(post.id);
    const updated = { ...post, published: !post.published };
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "post", action: "save", data: updated }),
      });
      if (res.ok) {
        setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
        toast.success(`'${post.title}' 상태 변경 완료`);
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (post: Post) => {
    if (!confirm(`'${post.title}' 게시글을 완전히 삭제하시겠습니까?`)) return;

    setLoadingId(post.id);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "post", action: "delete", data: { id: post.id } }),
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
        toast.success("삭제되었습니다.");
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 글 등록 폼 */}
      <form onSubmit={handleCreate} className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs space-y-5">
        <h2 className="text-sm font-bold flex items-center gap-1.5 text-[var(--color-brand-teal)]">
          <Plus className="h-4 w-4" />
          <span>신규 공지·칼럼 글 작성하기</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 space-y-1.5">
            <Label className="text-xs font-bold">글 제목</Label>
            <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 2026년 하반기 바우처 신청 접수 일정 안내" className="h-11 rounded-xl font-bold text-sm" />
          </div>

          <div className="md:col-span-4 space-y-1.5">
            <Label className="text-xs font-bold">카테고리 분류</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="공지사항, 센터소식, 치료칼럼 등" className="h-11 rounded-xl text-sm font-semibold" />
          </div>

          <div className="md:col-span-6 space-y-1.5">
            <Label className="text-xs font-bold">주소 슬러그(slug) [선택: 비워두면 자동 생성]</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="예: voucher-guide-2026" className="h-11 rounded-xl font-mono text-xs" />
          </div>

          <div className="md:col-span-6 space-y-1.5">
            <Label className="text-xs font-bold">썸네일 사진 URL [선택]</Label>
            <Input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://..." className="h-11 rounded-xl font-mono text-xs" />
          </div>

          <div className="md:col-span-8 space-y-1.5">
            <Label className="text-xs font-bold">게시 일시 설정 (미래 시간 지정 시 '예약 게시')</Label>
            <Input type="datetime-local" value={pubAt} onChange={(e) => setPubAt(e.target.value)} className="h-11 rounded-xl text-xs font-mono" />
          </div>

          <div className="md:col-span-4 flex items-end">
            <Button type="submit" disabled={loadingId === "create"} className="w-full h-11 rounded-xl font-bold text-white shadow-md" style={{ background: "var(--color-brand-green)" }}>
              {loadingId === "create" ? <Loader2 className="h-4 w-4 animate-spin" /> : "글 발행하기"}
            </Button>
          </div>

          <div className="md:col-span-12 space-y-1.5 pt-2">
            <Label className="text-xs font-bold">본문 내용 (엔터 줄바꿈 및 글자 마음대로 입력 가능)</Label>
            <Textarea required value={body} onChange={(e) => setBody(e.target.value)} placeholder="공지 및 소식 본문 내용을 자유롭게 입력하세요." className="min-h-48 rounded-2xl p-4 text-sm leading-relaxed" />
          </div>
        </div>
      </form>

      {/* 리스트 */}
      <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[var(--color-brand-teal)] flex items-center justify-between">
          <span>📢 등록된 소식 게시글 목록</span>
          <span className="text-xs font-normal text-muted-foreground">서버 RLS 정책에 의해 '게시일시'가 미래이거나 숨김 처리되면 일반 방문자 화면에는 보이지 않습니다.</span>
        </h2>

        <div className="space-y-3 pt-2">
          {posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">등록된 글이 없습니다.</div>
          ) : (
            posts.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-3xl border border-border bg-background hover:bg-muted/40 transition-all gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="h-14 w-16 rounded-2xl bg-muted overflow-hidden shrink-0 flex items-center justify-center border mt-1">
                    {item.thumbnail_url ? <img src={item.thumbnail_url} alt="썸네일" className="h-full w-full object-cover" /> : <Newspaper className="h-6 w-6 text-muted-foreground" />}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-slate-800 text-white font-bold text-[10px]">{item.category}</Badge>
                      {!item.published && <Badge variant="destructive" className="text-[10px]">숨김 처리됨</Badge>}
                      {new Date(item.published_at) > new Date() && <Badge className="bg-amber-500 text-white text-[10px]">⏰ 예약 대기중</Badge>}
                    </div>

                    <p className="font-extrabold text-base truncate text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground font-mono flex items-center gap-2">
                      <span>슬러그: /news/{item.slug}</span>
                      <span>&bull;</span>
                      <span>게시일: {item.published_at.slice(0, 16).replace("T", " ")}</span>
                    </p>
                  </div>
                </div>

                {/* 액션 */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto justify-end">
                  <Button
                    type="button"
                    onClick={() => handleTogglePublish(item)}
                    disabled={loadingId === item.id}
                    variant={item.published ? "outline" : "secondary"}
                    size="sm"
                    className="rounded-xl text-xs px-3.5 h-10"
                  >
                    {item.published ? <><Eye className="h-3.5 w-3.5 mr-1 text-emerald-600" />공개중</> : <><EyeOff className="h-3.5 w-3.5 mr-1 text-slate-400" />숨김중</>}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
