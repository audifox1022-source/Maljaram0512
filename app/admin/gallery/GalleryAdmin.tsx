"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { GalleryItem } from "@/lib/supabase/gallery";

export function GalleryAdmin({ initialItems }: { initialItems: GalleryItem[] }) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // 폼 입력 필드
  const [multiUrls, setMultiUrls] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("치료실시설");
  const [order, setOrder] = useState("1");

  const sorted = [...items].sort((a, b) => a.display_order - b.display_order);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!multiUrls.trim()) return;

    setLoadingId("create");
    try {
      // 엔터 줄바꿈으로 분리하여 다중 업로드 처리
      const urls = multiUrls.split("\n").map((u) => u.trim()).filter((u) => u.length > 5);

      if (urls.length === 0) {
        toast.error("올바른 이미지 URL을 입력해주세요.");
        return;
      }

      const createdItems: GalleryItem[] = [];

      for (let i = 0; i < urls.length; i++) {
        const payload: GalleryItem = {
          id: `gi-temp-${Date.now()}-${i}`,
          image_url: urls[i],
          caption: caption || "연구소 내부 시설 전경",
          category: category || "치료실시설",
          display_order: Number(order) + i,
          published: true,
        };

        const res = await fetch("/api/admin/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "gallery", action: "save", data: payload }),
        });
        if (res.ok) {
          createdItems.push(payload);
        }
      }

      toast.success(`사진 총 ${createdItems.length}장이 등록되었습니다.`);
      setItems((prev) => [...createdItems, ...prev]);
      setMultiUrls("");
      setCaption("");
    } catch {
      toast.error("서버 에러");
    } finally {
      setLoadingId(null);
    }
  };

  const handleTogglePublish = async (item: GalleryItem) => {
    setLoadingId(item.id);
    const updated = { ...item, published: !item.published };
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "gallery", action: "save", data: updated }),
      });
      if (res.ok) {
        setItems((prev) => prev.map((g) => (g.id === item.id ? updated : g)));
        toast.success("상태가 변경되었습니다.");
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    if (!confirm("해당 사진을 갤러리에서 삭제하시겠습니까?")) return;

    setLoadingId(item.id);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "gallery", action: "delete", data: { id: item.id } }),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((g) => g.id !== item.id));
        toast.success("삭제되었습니다.");
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 등록 폼 */}
      <form onSubmit={handleCreate} className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs space-y-5">
        <h2 className="text-sm font-bold flex items-center gap-1.5 text-[var(--color-brand-teal)]">
          <Plus className="h-4 w-4" />
          <span>신규 사진 등록 (한 줄에 주소 1개씩 붙여넣으면 여러 장 다중 등록 가능!)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-12 space-y-1.5">
            <Label className="text-xs font-bold">이미지 주소 URL (다중 업로드 지원: 한 줄에 하나씩 적어주세요)</Label>
            <Textarea
              required
              value={multiUrls}
              onChange={(e) => setMultiUrls(e.target.value)}
              placeholder="https://picsum.photos/800/600&#13;&#10;https://picsum.photos/800/601"
              className="font-mono text-xs min-h-24 rounded-2xl p-4 leading-relaxed"
            />
          </div>

          <div className="md:col-span-5 space-y-1.5">
            <Label className="text-xs font-bold">사진 설명(캡션)</Label>
            <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="예: 따스하고 청결한 언어치료실 내부" className="h-11 rounded-xl text-sm font-bold" />
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <Label className="text-xs font-bold">카테고리 분류</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="치료실시설, 치료교구 등" className="h-11 rounded-xl text-sm font-semibold" />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs font-bold">시작 순서</Label>
            <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="h-11 rounded-xl text-center font-bold" />
          </div>

          <div className="md:col-span-2 flex items-end">
            <Button type="submit" disabled={loadingId === "create"} className="w-full h-11 rounded-xl font-bold text-white shadow-md" style={{ background: "var(--color-brand-green)" }}>
              {loadingId === "create" ? <Loader2 className="h-4 w-4 animate-spin" /> : "등록하기"}
            </Button>
          </div>
        </div>
      </form>

      {/* 목록 */}
      <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[var(--color-brand-teal)] flex items-center justify-between">
          <span>🖼️ 등록된 갤러리 사진 목록 ({items.length}장)</span>
          <span className="text-xs font-normal text-muted-foreground">숨김 처리하면 고객 페이지(/gallery)에 안 보입니다.</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {sorted.length === 0 ? (
            <div className="col-span-4 text-center py-12 text-muted-foreground text-sm">등록된 사진이 없습니다.</div>
          ) : (
            sorted.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border bg-background overflow-hidden flex flex-col justify-between relative group shadow-xs">
                <div className="h-40 w-full bg-muted relative overflow-hidden">
                  <img src={item.image_url} alt="갤러리" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <Badge className="bg-black/70 text-white text-[10px] backdrop-blur-xs font-bold">{item.category}</Badge>
                    {!item.published && <Badge variant="destructive" className="text-[10px]">숨김</Badge>}
                  </div>
                  <span className="absolute bottom-1 right-2 text-[10px] font-mono bg-black/60 text-white px-1.5 py-0.5 rounded">
                    순서: {item.display_order}
                  </span>
                </div>

                <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-foreground font-medium line-clamp-2">{item.caption || "(설명 없음)"}</p>

                  <div className="flex items-center justify-between gap-1 pt-2 border-t">
                    <Button
                      type="button"
                      onClick={() => handleTogglePublish(item)}
                      disabled={loadingId === item.id}
                      variant={item.published ? "outline" : "secondary"}
                      size="sm"
                      className="h-8 text-[11px] flex-1 rounded-lg"
                    >
                      {item.published ? <><Eye className="h-3 w-3 mr-1 text-emerald-600" />공개중</> : <><EyeOff className="h-3 w-3 mr-1 text-slate-400" />숨김</>}
                    </Button>

                    <Button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={loadingId === item.id}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
