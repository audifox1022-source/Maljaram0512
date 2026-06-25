"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, Save, Compass, ArrowUp, ArrowDown, ExternalLink, Link as LinkIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { NavMenu } from "@/lib/supabase/menus";

export function MenusAdmin({ initialMenus }: { initialMenus: NavMenu[] }) {
  const [menus, setMenus] = useState<NavMenu[]>(initialMenus);
  const [activeTab, setActiveTab] = useState<"header" | "footer">("header");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // 신규 항목 입력 폼
  const [newLabel, setNewLabel] = useState("");
  const [newHref, setNewHref] = useState("");
  const [newOrder, setNewOrder] = useState("10");

  const filtered = menus.filter((m) => m.location === activeTab).sort((a, b) => a.display_order - b.display_order);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newHref) return;

    setLoadingId("create");
    try {
      const payload = {
        id: `nm-temp-${Date.now()}`,
        label: newLabel,
        href: newHref,
        location: activeTab,
        display_order: Number(newOrder) || 10,
        visible: true,
      };

      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "menu", action: "save", data: payload }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("신규 메뉴가 추가되었습니다.");
        setMenus((prev) => [...prev, payload]);
        setNewLabel("");
        setNewHref("");
      } else {
        toast.error("메뉴 추가 실패");
      }
    } catch {
      toast.error("서버 통신 에러");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleVisible = async (menu: NavMenu) => {
    setLoadingId(menu.id);
    const updated = { ...menu, visible: !menu.visible };
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "menu", action: "save", data: updated }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMenus((prev) => prev.map((m) => (m.id === menu.id ? updated : m)));
        toast.success(`'${menu.label}' 상태 변경 완료`);
      } else {
        toast.error(data?.error || "상태 변경에 실패했습니다.");
      }
    } catch {
      toast.error("변경 에러");
    } finally {
      setLoadingId(null);
    }
  };

  const handleUpdateOrder = async (menu: NavMenu, newOrderNum: number) => {
    const updated = { ...menu, display_order: newOrderNum };
    setMenus((prev) => prev.map((m) => (m.id === menu.id ? updated : m)));
    fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "menu", action: "save", data: updated }),
    });
  };

  const handleDelete = async (menu: NavMenu) => {
    if (!confirm(`'${menu.label}' 메뉴를 삭제하시겠습니까?`)) return;

    setLoadingId(menu.id);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "menu", action: "delete", data: { id: menu.id } }),
      });
      if (res.ok) {
        setMenus((prev) => prev.filter((m) => m.id !== menu.id));
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
      {/* 탭 전환 버튼 */}
      <div className="flex bg-muted p-1.5 rounded-2xl max-w-sm gap-2">
        <Button
          type="button"
          onClick={() => setActiveTab("header")}
          variant={activeTab === "header" ? "default" : "ghost"}
          className="flex-1 rounded-xl font-bold"
          style={activeTab === "header" ? { background: "var(--color-brand-teal)", color: "white" } : {}}
        >
          🔝 상단 헤더 메뉴 ({menus.filter((m) => m.location === "header").length})
        </Button>
        <Button
          type="button"
          onClick={() => setActiveTab("footer")}
          variant={activeTab === "footer" ? "default" : "ghost"}
          className="flex-1 rounded-xl font-bold"
          style={activeTab === "footer" ? { background: "var(--color-brand-teal)", color: "white" } : {}}
        >
          ⬇️ 하단 푸터 메뉴 ({menus.filter((m) => m.location === "footer").length})
        </Button>
      </div>

      {/* 신규 메뉴 생성 폼 */}
      <form onSubmit={handleCreate} className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs space-y-4">
        <h2 className="text-sm font-bold flex items-center gap-1.5 text-[var(--color-brand-teal)]">
          <Plus className="h-4 w-4" />
          <span>{activeTab === "header" ? "상단 헤더" : "하단 푸터"} 새 메뉴 링크 추가</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4 space-y-1.5">
            <Label className="text-xs font-bold">버튼 메뉴명</Label>
            <Input required value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="예: 센터 안내" className="h-11 rounded-xl text-sm font-bold" />
          </div>

          <div className="md:col-span-5 space-y-1.5">
            <Label className="text-xs font-bold">연결 경로 URL (내부 /about 혹은 외부 https://...)</Label>
            <Input required value={newHref} onChange={(e) => setNewHref(e.target.value)} placeholder="/about 혹은 https://..." className="h-11 rounded-xl font-mono text-xs" />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <Label className="text-xs font-bold">출력 순서</Label>
            <Input type="number" value={newOrder} onChange={(e) => setNewOrder(e.target.value)} className="h-11 rounded-xl text-center font-bold" />
          </div>

          <div className="md:col-span-1">
            <Button type="submit" disabled={loadingId === "create"} className="w-full h-11 rounded-xl font-bold text-white shadow-md" style={{ background: "var(--color-brand-green)" }}>
              {loadingId === "create" ? <Loader2 className="h-4 w-4 animate-spin" /> : "추가"}
            </Button>
          </div>
        </div>
      </form>

      {/* 메뉴 리스트 테이블 */}
      <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs space-y-4">
        <h2 className="text-base font-bold text-[var(--color-brand-teal)] flex items-center justify-between">
          <span>{activeTab === "header" ? "🔝 헤더 메뉴 목록" : "⬇️ 푸터 메뉴 목록"}</span>
          <span className="text-xs font-normal text-muted-foreground">순서 숫자가 작을수록 먼저(왼쪽/위)에 노출됩니다.</span>
        </h2>

        <div className="space-y-3 pt-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">등록된 메뉴가 없습니다. 위 폼에서 새 항목을 추가하세요.</div>
          ) : (
            filtered.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-background hover:bg-muted/50 transition-all gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* 순서 조정 입력 */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] text-muted-foreground font-mono">순서</span>
                    <Input
                      type="number"
                      defaultValue={item.display_order}
                      onBlur={(e) => handleUpdateOrder(item, Number(e.target.value) || 0)}
                      className="w-14 h-9 text-center font-bold text-xs rounded-lg bg-card"
                    />
                  </div>

                  {/* 라벨과 주소 */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm truncate">{item.label}</span>
                      {!item.visible && <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-800">숨김됨</Badge>}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono truncate mt-0.5">
                      <LinkIcon className="h-3 w-3 shrink-0" />
                      <span className="truncate">{item.href}</span>
                      {item.href.startsWith("http") && <ExternalLink className="h-3 w-3 shrink-0 text-blue-500 ml-1" />}
                    </div>
                  </div>
                </div>

                {/* 제어 액션 버튼들 */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    onClick={() => handleToggleVisible(item)}
                    disabled={loadingId === item.id}
                    variant={item.visible ? "outline" : "secondary"}
                    size="sm"
                    className="rounded-xl gap-1 text-xs px-3"
                  >
                    {item.visible ? <><Eye className="h-3.5 w-3.5 text-emerald-600" />공개중</> : <><EyeOff className="h-3.5 w-3.5 text-slate-400" />숨김중</>}
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
