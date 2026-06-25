"use client";

import { useState } from "react";
import { toast } from "sonner";
import { HelpCircle, Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function FaqsAdmin({ initialList }: { initialList: any[] }) {
  const [list, setList] = useState(initialList);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: "",
    question: "",
    answer: "",
    display_order: 5,
    published: true,
  });

  const handleEditInit = (item: any) => {
    setEditingId(item.id);
    setForm({
      id: item.id,
      question: item.question,
      answer: item.answer,
      display_order: item.display_order || 1,
      published: item.published ?? true,
    });
  };

  const handleNewInit = () => {
    setEditingId("NEW");
    setForm({
      id: "",
      question: "자주 묻는 신규 질문 제목",
      answer: "학부모님을 위한 친절하고 상세한 답변 텍스트 입력란",
      display_order: list.length + 1,
      published: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question || !form.answer) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "faq", action: "save", data: form }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
        const newItem = { ...form, id: form.id || `mock-fq-${Date.now()}` };
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
    if (!confirm("이 FAQ 문답을 삭제하시겠습니까?")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "faq", action: "delete", data: { id } }),
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
      {/* 좌측 목록 */}
      <div className="lg:col-span-7 bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-lg font-bold" style={{ color: "var(--color-brand-teal)" }}>
            등록된 문답 ({list.length}개)
          </h2>
          <Button size="sm" onClick={handleNewInit} className="rounded-full font-bold bg-[var(--color-brand-green)] text-white gap-1">
            <Plus className="h-4 w-4" />
            FAQ 신규 작성
          </Button>
        </div>

        <div className="space-y-3.5 max-h-[650px] overflow-y-auto pr-1">
          {list.map((item) => {
            const isEditing = editingId === item.id;
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isEditing
                    ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-cream)]/50 ring-2 ring-[var(--color-brand-teal)]"
                    : !item.published
                    ? "bg-muted/40 opacity-60 border-dashed"
                    : "bg-background border-border hover:bg-muted/20"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">Q. {item.question}</span>
                      {!item.published && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">비공개</span>}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">A. {item.answer}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => handleEditInit(item)} className="h-8 rounded-xl text-xs font-bold gap-1">
                      <Edit className="h-3 w-3" />
                      편집
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)} className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 border-red-200">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 우측 폼 */}
      <div className="lg:col-span-5 bg-card rounded-3xl p-6 md:p-8 border border-border shadow-md lg:sticky lg:top-24">
        {!editingId ? (
          <div className="py-24 text-center text-muted-foreground space-y-2">
            <HelpCircle className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
            <p className="font-bold text-foreground text-base">선택된 질문이 없습니다</p>
            <p className="text-xs">신규 작성이나 왼쪽의 [편집]을 눌러주세요.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 animate-fade-in text-xs">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <h2 className="text-base font-bold" style={{ color: "var(--color-brand-teal)" }}>
                {editingId === "NEW" ? "✨ 새 질문 작성" : "📝 질문 수정"}
              </h2>
              <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="h-7 text-xs">취소</Button>
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-sm">질문 제목 (Question)</Label>
              <Input required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="h-11 rounded-xl font-bold text-sm" />
            </div>

            <div className="space-y-1.5">
              <Label className="font-bold text-sm">답변 본문 (Answer - 엔터 줄바꿈 반영)</Label>
              <Textarea rows={6} required value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="rounded-xl leading-relaxed text-xs" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <Label className="font-bold">노출 순서</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className="h-10 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold">공개 상태</Label>
                <select value={String(form.published)} onChange={(e) => setForm({ ...form, published: e.target.value === "true" })} className="w-full h-10 rounded-xl border border-input bg-background px-2">
                  <option value="true">공개 노출</option>
                  <option value="false">비공개 숨김</option>
                </select>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 rounded-full font-bold mt-3 shadow-md" style={{ background: "var(--color-brand-teal)", color: "white" }}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "FAQ 문답 반영하기"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
