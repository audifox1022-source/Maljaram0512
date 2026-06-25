"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BookOpen, Plus, Trash2, Edit, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ProgramsAdmin({ initialList }: { initialList: any[] }) {
  const [list, setList] = useState(initialList);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: "",
    title: "",
    slug: "",
    target: "발달 상담이 필요한 모든 아동 및 청소년",
    summary: "아이의 눈높이에 맞춘 표준화 진단 검사 및 치료 안내",
    description: "전문 치료사가 1:1로 진행하는 심층 프로그램입니다.",
    effect: "소통 자신감 회복 및 언어 유창성 향상",
    process: "초기평가 -> 목표수립 -> 중재치료 -> 부모상담",
    image_url: "https://picsum.photos/seed/newprog/600/400",
    display_order: 5,
    published: true,
  });

  const handleEditInit = (item: any) => {
    setEditingId(item.id);
    setForm({
      id: item.id,
      title: item.title,
      slug: item.slug || "",
      target: item.target,
      summary: item.summary,
      description: item.description,
      effect: item.effect || "",
      process: item.process || "",
      image_url: item.image_url || "",
      display_order: item.display_order || 1,
      published: item.published ?? true,
    });
  };

  const handleNewInit = () => {
    setEditingId("NEW");
    setForm({
      id: "",
      title: "",
      slug: `custom-prog-${Date.now()}`,
      target: "상담 희망 아동",
      summary: "신규 프로그램 요약 소개 문구",
      description: "본문 상세 설명 내용 입력란",
      effect: "기대 효과 설명",
      process: "평가 -> 치료 -> 상담",
      image_url: `https://picsum.photos/seed/pr-${Date.now()}/600/400`,
      display_order: list.length + 1,
      published: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.summary) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "program", action: "save", data: form }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
        const newItem = { ...form, id: form.id || `mock-pr-${Date.now()}` };
        if (editingId === "NEW") {
          setList([...list, newItem].sort((a, b) => a.display_order - b.display_order));
        } else {
          setList(list.map((item) => (item.id === editingId ? newItem : item)).sort((a, b) => a.display_order - b.display_order));
        }
        setEditingId(null);
      } else {
        toast.error("저장 실패");
      }
    } catch {
      toast.error("통신 에러");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 프로그램 안내를 삭제하시겠습니까?")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "program", action: "delete", data: { id } }),
      });
      if (res.ok) {
        toast.success("삭제되었습니다.");
        setList(list.filter((item) => item.id !== id));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* 좌측: 리스트 */}
      <div className="lg:col-span-7 bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-lg font-bold" style={{ color: "var(--color-brand-teal)" }}>
            등록된 프로그램 ({list.length}개)
          </h2>
          <Button size="sm" onClick={handleNewInit} className="rounded-full font-bold bg-[var(--color-brand-green)] text-white gap-1">
            <Plus className="h-4 w-4" />
            프로그램 신규 개설
          </Button>
        </div>

        <div className="space-y-3.5 max-h-[650px] overflow-y-auto pr-1">
          {list.map((item) => {
            const isEditing = editingId === item.id;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                  isEditing
                    ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-cream)]/50 ring-2 ring-[var(--color-brand-teal)]"
                    : !item.published
                    ? "bg-muted/40 opacity-60 border-dashed"
                    : "bg-background border-border hover:bg-muted/20"
                }`}
              >
                <div className="space-y-1 mr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-foreground">{item.title}</span>
                    {!item.published && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">비공개</span>}
                  </div>
                  <p className="text-xs text-[var(--color-brand-green)] font-semibold">{item.target}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{item.summary}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => handleEditInit(item)} className="h-8 rounded-xl text-xs font-bold gap-1">
                    <Edit className="h-3 w-3" />
                    편집
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)} className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 border-red-200">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 우측: 편집 폼 */}
      <div className="lg:col-span-5 bg-card rounded-3xl p-6 md:p-8 border border-border shadow-md lg:sticky lg:top-24">
        {!editingId ? (
          <div className="py-24 text-center text-muted-foreground space-y-2">
            <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
            <p className="font-bold text-foreground text-base">선택된 프로그램이 없습니다</p>
            <p className="text-xs">신규 개설이나 왼쪽의 [편집] 버튼을 눌러주세요.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-3.5 animate-fade-in text-xs">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <h2 className="text-base font-bold" style={{ color: "var(--color-brand-teal)" }}>
                {editingId === "NEW" ? "✨ 새 프로그램 등록" : "📝 프로그램 수정"}
              </h2>
              <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="h-7 text-xs">취소</Button>
            </div>

            <div className="space-y-1">
              <Label className="font-bold">프로그램 공식 명칭</Label>
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-10 rounded-xl font-bold text-sm" />
            </div>

            <div className="space-y-1">
              <Label className="font-bold">주요 권장 대상 (예: 조음 명료도가 낮은 5~7세)</Label>
              <Input required value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} className="h-10 rounded-xl" />
            </div>

            <div className="space-y-1">
              <Label className="font-bold">한 줄 요약 소개</Label>
              <Input required value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="h-10 rounded-xl" />
            </div>

            <div className="space-y-1">
              <Label className="font-bold">본문 상세 안내 설명 (줄바꿈 반영)</Label>
              <Textarea rows={4} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="font-bold">기대 효과</Label>
                <Input value={form.effect} onChange={(e) => setForm({ ...form, effect: e.target.value })} className="h-9 rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="font-bold">진행 방식 요약</Label>
                <Input value={form.process} onChange={(e) => setForm({ ...form, process: e.target.value })} className="h-9 rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <Label className="font-bold">정렬 순서</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className="h-9 rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="font-bold">공개 여부</Label>
                <select value={String(form.published)} onChange={(e) => setForm({ ...form, published: e.target.value === "true" })} className="w-full h-9 rounded-xl border border-input bg-background px-2">
                  <option value="true">공개 노출</option>
                  <option value="false">비공개 숨김</option>
                </select>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 rounded-full font-bold mt-2 shadow-md" style={{ background: "var(--color-brand-teal)", color: "white" }}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "프로그램 내용 저장하기"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
