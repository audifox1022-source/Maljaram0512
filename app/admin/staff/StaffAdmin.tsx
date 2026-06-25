"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Users, Plus, Trash2, Edit, Save, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function StaffAdmin({ initialList }: { initialList: any[] }) {
  const [list, setList] = useState(initialList);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: "",
    name: "",
    role: "임상심리전문가",
    photo_url: "https://picsum.photos/seed/newstaff/400/400",
    bio: "• 관련 학과 석사\n• 주요 치료 경력 5년 이상",
    display_order: 4,
    published: true,
  });

  const handleEditInit = (item: any) => {
    setEditingId(item.id);
    setForm({
      id: item.id,
      name: item.name,
      role: item.role,
      photo_url: item.photo_url || "",
      bio: item.bio,
      display_order: item.display_order || 1,
      published: item.published ?? true,
    });
  };

  const handleNewInit = () => {
    setEditingId("NEW");
    setForm({
      id: "",
      name: "",
      role: "언어재활사 1급",
      photo_url: `https://picsum.photos/seed/st-${Date.now()}/400/400`,
      bio: "• 대학교 졸업 및 자격 취득\n• 맞춤 치료 프로그램 운영",
      display_order: list.length + 1,
      published: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.role) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "staff",
          action: "save",
          data: form,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
        const newItem = { ...form, id: form.id || `mock-st-${Date.now()}` };
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
      toast.error("에러 발생");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 전문가 프로필을 삭제하시겠습니까?")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "staff", action: "delete", data: { id } }),
      });
      if (res.ok) {
        toast.success("삭제되었습니다.");
        setList(list.filter((item) => item.id !== id));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: string, currentPub: boolean) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "staff", action: "toggle_publish", data: { id, published: !currentPub } }),
      });
      if (res.ok) {
        toast.success("공개 상태가 변경되었습니다.");
        setList(list.map((item) => (item.id === id ? { ...item, published: !currentPub } : item)));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* 왼쪽: 전문가 목록 카드 */}
      <div className="lg:col-span-7 bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-lg font-bold" style={{ color: "var(--color-brand-teal)" }}>
            등록된 치료사 명단 ({list.length}명)
          </h2>
          <Button size="sm" onClick={handleNewInit} className="rounded-full font-bold bg-[var(--color-brand-green)] text-white gap-1">
            <Plus className="h-4 w-4" />
            선생님 신규 추가
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
                <div className="flex items-center gap-3.5">
                  <img src={item.photo_url || "https://picsum.photos/100"} alt={item.name} className="h-12 w-12 rounded-xl object-cover border border-border" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-foreground">{item.name}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[var(--color-brand-green-light)] text-[var(--color-brand-green)]">{item.role}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.bio.replace(/\n/g, " ")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleTogglePublish(item.id, item.published)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    title={item.published ? "공개중 (클릭 시 비공개)" : "비공개 (클릭 시 공개)"}
                  >
                    {item.published ? <Eye className="h-4 w-4 text-emerald-600 font-bold" /> : <EyeOff className="h-4 w-4 text-slate-400" />}
                  </Button>

                  <Button size="sm" variant="outline" onClick={() => handleEditInit(item)} className="h-8 rounded-xl text-xs font-bold gap-1">
                    <Edit className="h-3 w-3" />
                    수정
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

      {/* 오른쪽: 편집/생성 폼 */}
      <div className="lg:col-span-5 bg-card rounded-3xl p-6 md:p-8 border border-border shadow-md lg:sticky lg:top-24">
        {!editingId ? (
          <div className="py-24 text-center text-muted-foreground space-y-2">
            <Users className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
            <p className="font-bold text-foreground text-base">선택된 전문가가 없습니다</p>
            <p className="text-xs">위의 신규 추가나 왼쪽 목록의 [수정]을 눌러주세요.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 animate-fade-in">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: "var(--color-brand-teal)" }}>
                {editingId === "NEW" ? "✨ 전문가 신규 등록" : "📝 전문가 프로필 수정"}
              </h2>
              <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="h-7 text-xs">취소</Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">성함 (예: 김지수 원장)</Label>
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-10 rounded-xl text-sm font-bold" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">직함/역할 (예: 대표 재활사)</Label>
                <Input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="h-10 rounded-xl text-sm" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">프로필 증명사진 URL</Label>
              <Input value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} className="h-10 rounded-xl text-xs font-mono" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">주요 약력 및 학력 소개 (엔터 줄바꿈 반영)</Label>
              <Textarea rows={5} required value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="rounded-xl text-xs leading-relaxed" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">노출 순서 (숫자가 작을수록 먼저)</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} className="h-10 rounded-xl text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">공개 여부</Label>
                <select value={String(form.published)} onChange={(e) => setForm({ ...form, published: e.target.value === "true" })} className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs">
                  <option value="true">공개 노출</option>
                  <option value="false">비공개 숨김</option>
                </select>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 rounded-full font-bold mt-3 shadow-md" style={{ background: "var(--color-brand-teal)", color: "white" }}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "선생님 프로필 저장하기"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
