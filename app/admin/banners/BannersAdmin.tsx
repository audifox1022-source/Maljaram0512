"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, Calendar, Link as LinkIcon, Loader2, Image as ImageIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { Banner } from "@/lib/supabase/banners";

export function BannersAdmin({ initialBanners }: { initialBanners: Banner[] }) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [activeTab, setActiveTab] = useState<"hero" | "popup">("hero");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // 폼 필드
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("/file.svg");
  const [linkUrl, setLinkUrl] = useState("/programs");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [order, setOrder] = useState("1");

  const filtered = banners.filter((b) => b.type === activeTab).sort((a, b) => a.display_order - b.display_order);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setLoadingId("create");
    try {
      const payload: Banner = {
        id: `bn-temp-${Date.now()}`,
        title,
        image_url: imageUrl || "/file.svg",
        link_url: linkUrl || "",
        type: activeTab,
        active: true,
        start_at: startAt ? new Date(startAt).toISOString() : null,
        end_at: endAt ? new Date(endAt).toISOString() : null,
        display_order: Number(order) || 1,
      };

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "banner", action: "save", data: payload }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("신규 배너가 등록되었습니다.");
        setBanners((prev) => [payload, ...prev]);
        setTitle("");
        setStartAt("");
        setEndAt("");
      } else {
        toast.error("배너 등록 실패");
      }
    } catch {
      toast.error("서버 통신 에러");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    setLoadingId(banner.id);
    const updated = { ...banner, active: !banner.active };
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "banner", action: "save", data: updated }),
      });
      if (res.ok) {
        setBanners((prev) => prev.map((b) => (b.id === banner.id ? updated : b)));
        toast.success(`'${banner.title}' 상태 변경 완료`);
      }
    } catch {
      toast.error("변경 에러");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (banner: Banner) => {
    if (!confirm(`'${banner.title}' 항목을 완전히 삭제하시겠습니까?`)) return;

    setLoadingId(banner.id);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "banner", action: "delete", data: { id: banner.id } }),
      });
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== banner.id));
        toast.success("삭제되었습니다.");
      }
    } catch {
      toast.error("삭제 실패");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 탭 버튼 */}
      <div className="flex bg-muted p-1.5 rounded-2xl max-w-sm gap-2">
        <Button
          type="button"
          onClick={() => setActiveTab("hero")}
          variant={activeTab === "hero" ? "default" : "ghost"}
          className="flex-1 rounded-xl font-bold"
          style={activeTab === "hero" ? { background: "var(--color-brand-teal)", color: "white" } : {}}
        >
          🎞️ 롤링 히어로 배너 ({banners.filter((b) => b.type === "hero").length})
        </Button>
        <Button
          type="button"
          onClick={() => setActiveTab("popup")}
          variant={activeTab === "popup" ? "default" : "ghost"}
          className="flex-1 rounded-xl font-bold"
          style={activeTab === "popup" ? { background: "var(--color-brand-teal)", color: "white" } : {}}
        >
          🚨 진입 공지 팝업 ({banners.filter((b) => b.type === "popup").length})
        </Button>
      </div>

      {/* 등록 폼 */}
      <form onSubmit={handleCreate} className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs space-y-5">
        <h2 className="text-sm font-bold flex items-center gap-1.5 text-[var(--color-brand-teal)]">
          <Plus className="h-4 w-4" />
          <span>{activeTab === "hero" ? "히어로 배너" : "진입 팝업 모달"} 신규 등록</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 space-y-1.5">
            <Label className="text-xs font-bold">배너 제목 문구</Label>
            <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 언어발달 골든타임 진단 평가 안내" className="h-11 rounded-xl font-bold text-sm" />
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <Label className="text-xs font-bold">사진 주소 URL</Label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="/file.svg 혹은 https://..." className="h-11 rounded-xl font-mono text-xs" />
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <Label className="text-xs font-bold">클릭 시 연결할 URL</Label>
            <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="/programs" className="h-11 rounded-xl font-mono text-xs" />
          </div>

          <div className="md:col-span-4 space-y-1.5">
            <Label className="text-xs font-bold">노출 시작 일시 (비워두면 즉시 노출)</Label>
            <Input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} className="h-11 rounded-xl text-xs font-mono" />
          </div>

          <div className="md:col-span-4 space-y-1.5">
            <Label className="text-xs font-bold">노출 종료 일시 (비워두면 무기한 노출)</Label>
            <Input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} className="h-11 rounded-xl text-xs font-mono" />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs font-bold">출력 순서</Label>
            <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="h-11 rounded-xl text-center font-bold" />
          </div>

          <div className="md:col-span-2 flex items-end">
            <Button type="submit" disabled={loadingId === "create"} className="w-full h-11 rounded-xl font-bold text-white shadow-md" style={{ background: "var(--color-brand-green)" }}>
              {loadingId === "create" ? <Loader2 className="h-4 w-4 animate-spin" /> : "등록하기"}
            </Button>
          </div>
        </div>
      </form>

      {/* 리스트 목록 */}
      <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[var(--color-brand-teal)] flex items-center justify-between">
          <span>{activeTab === "hero" ? "🎞️ 히어로 배너 목록" : "🚨 공지 팝업 목록"}</span>
          <span className="text-xs font-normal text-muted-foreground">서버 RLS에 의해 '시작일시~종료일시' 기간을 벗어나면 자동으로 안 보입니다.</span>
        </h2>

        <div className="space-y-3 pt-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">등록된 배너가 없습니다. 위 폼에서 새 항목을 등록하세요.</div>
          ) : (
            filtered.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-background hover:bg-muted/40 transition-all gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* 미리보기 썸네일 */}
                  <div className="h-12 w-16 rounded-xl bg-muted overflow-hidden shrink-0 flex items-center justify-center border">
                    {item.image_url ? <img src={item.image_url} alt="썸네일" className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5 text-muted-foreground" />}
                  </div>

                  {/* 텍스트 정보 */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm truncate">{item.title}</span>
                      {!item.active && <Badge variant="secondary" className="text-[10px] bg-slate-200">비활성</Badge>}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1 font-mono">
                      <span className="flex items-center gap-1">
                        <LinkIcon className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-[150px]">{item.link_url || "(링크 없음)"}</span>
                      </span>

                      {(item.start_at || item.end_at) && (
                        <span className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
                          <Calendar className="h-3 w-3 shrink-0" />
                          <span>{item.start_at ? item.start_at.slice(0, 10) : "즉시"} ~ {item.end_at ? item.end_at.slice(0, 10) : "무기한"}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    onClick={() => handleToggleActive(item)}
                    disabled={loadingId === item.id}
                    variant={item.active ? "outline" : "secondary"}
                    size="sm"
                    className="rounded-xl gap-1 text-xs px-3"
                  >
                    {item.active ? <><Eye className="h-3.5 w-3.5 text-emerald-600" />활성중</> : <><EyeOff className="h-3.5 w-3.5 text-slate-400" />중지됨</>}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={loadingId === item.id}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-red-500 hover:bg-red-50 rounded-xl"
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
