"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Globe, Save, Search, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { PageSeoItem } from "@/lib/supabase/seo";

export function SeoAdmin({ initialItems }: { initialItems: PageSeoItem[] }) {
  const [items, setItems] = useState<PageSeoItem[]>(initialItems);
  const [selectedPath, setSelectedPath] = useState<string>(items[0]?.path || "/");
  const [loading, setLoading] = useState(false);

  const current = items.find((i) => i.path === selectedPath) || {
    id: `seo_temp_${selectedPath}`,
    path: selectedPath,
    title: "말자람터 언어심리연구소",
    description: "아이들의 발달 성장 동행 여정",
    keywords: "언어치료,아동심리",
  };

  // 현재 편집 중인 값 (상태 기반 갱신)
  const [title, setTitle] = useState(current.title);
  const [desc, setDesc] = useState(current.description);
  const [kw, setKw] = useState(current.keywords);
  const [ogImg, setOgImg] = useState(current.og_image_url || "");

  const handleSelectPath = (path: string) => {
    setSelectedPath(path);
    const target = items.find((i) => i.path === path);
    if (target) {
      setTitle(target.title);
      setDesc(target.description);
      setKw(target.keywords);
      setOgImg(target.og_image_url || "");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: PageSeoItem = {
      id: current.id,
      path: selectedPath,
      title,
      description: desc,
      keywords: kw,
      og_image_url: ogImg || null,
    };

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "seo", action: "save", data: payload }),
      });
      if (res.ok) {
        toast.success(`'${selectedPath}' 페이지 SEO 메타가 저장되었습니다.`);
        setItems((prev) => {
          const exists = prev.some((p) => p.path === selectedPath);
          return exists ? prev.map((p) => (p.path === selectedPath ? payload : p)) : [...prev, payload];
        });
      } else {
        toast.error("저장 실패");
      }
    } catch {
      toast.error("서버 에러");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16">
      {/* 1. 좌측 페이지 탭 목록 */}
      <div className="lg:col-span-4 bg-card p-6 rounded-3xl border border-border shadow-xs space-y-4">
        <h2 className="text-sm font-bold flex items-center gap-2 text-[var(--color-brand-teal)]">
          <Globe className="h-4 w-4" />
          <span>설정 대상 페이지 선택</span>
        </h2>

        <div className="flex flex-col gap-1.5">
          {items.map((item) => (
            <button
              key={item.path}
              onClick={() => handleSelectPath(item.path)}
              className={`flex items-center justify-between p-3.5 rounded-2xl text-xs font-mono transition-all text-left ${selectedPath === item.path ? "bg-[var(--color-brand-teal)] text-white font-bold shadow-md" : "hover:bg-muted font-semibold text-foreground/80"}`}
            >
              <span>{item.path === "/" ? "🏠 홈 (/)" : item.path}</span>
              <span className="text-[10px] opacity-75 truncate max-w-[140px] font-sans">{item.title.split("|")[0]}</span>
            </button>
          ))}
        </div>

        <div className="p-3.5 bg-muted/60 rounded-2xl text-[11px] text-muted-foreground leading-relaxed">
          &bull; 프로그램 동적 상세 및 뉴스 상세 글은 본문 제목 기반 메타가 자동 적용되므로 이곳에서는 정적 대메뉴 페이지만 지정합니다.
        </div>
      </div>

      {/* 2. 우측 편집기 및 구글 검색결과 스니펫 라이브 미리보기 */}
      <div className="lg:col-span-8 space-y-6">
        {/* 구글 검색창 실시간 미리보기 박스 */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border-2 border-dashed border-[var(--color-brand-teal)]/30 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
            <span>구글(Google) 검색결과 실시간 미리보기 시뮬레이터</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#fafafa] dark:bg-[#1f1f1f] border border-slate-200 dark:border-slate-800 space-y-1 font-sans">
            <div className="flex items-center gap-2 text-xs text-[#202124] dark:text-[#e8eaed]">
              <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-[10px]">M</div>
              <div className="flex flex-col leading-tight">
                <span className="font-medium text-[11px]">말자람터 언어심리연구소</span>
                <span className="text-[10px] text-[#202124]/70 dark:text-[#bdc1c6] font-mono">https://maljarumter.com{selectedPath === "/" ? "" : selectedPath}</span>
              </div>
            </div>

            <p className="text-lg sm:text-xl text-[#1a0dab] dark:text-[#8ab4f8] hover:underline font-normal tracking-normal pt-1 cursor-pointer truncate">
              {title || "페이지 제목을 입력하세요"}
            </p>

            <p className="text-xs sm:text-sm text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2 leading-relaxed pt-0.5">
              {desc || "페이지에 대한 요약 설명을 입력하시면 검색자들이 이 문구를 읽고 클릭하게 됩니다."}
            </p>
          </div>
        </div>

        {/* 메타데이터 입력 폼 */}
        <form onSubmit={handleSave} className="bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-bold text-base text-foreground">
              <span className="font-mono text-[var(--color-brand-teal)]">{selectedPath}</span> 페이지 메타 속성 수정
            </h3>
            <Badge variant="outline" className="font-mono text-xs">Path: {selectedPath}</Badge>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold flex justify-between">
                <span>SEO 페이지 타이틀 (Title Tag)</span>
                <span className="text-[10px] font-mono text-muted-foreground">{title.length} / 60자 권장</span>
              </Label>
              <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 말자람터 언어심리연구소 | 아이가 자라는 곳" className="h-11 rounded-xl font-bold text-sm" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold flex justify-between">
                <span>메타 설명 (Meta Description)</span>
                <span className="text-[10px] font-mono text-muted-foreground">{desc.length} / 160자 권장</span>
              </Label>
              <Textarea required value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="검색 결과 아래에 나오는 1~2줄 요약글을 작성하세요." className="min-h-24 rounded-2xl p-4 text-sm leading-relaxed" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">검색 키워드 태그 (쉼표로 구분)</Label>
              <Input value={kw} onChange={(e) => setKw(e.target.value)} placeholder="언어치료,심리상담,조음치료,발음검사" className="h-11 rounded-xl font-semibold text-xs" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Open Graph 카카오톡 공유 미리보기 사진 URL [선택]</Label>
              <Input value={ogImg} onChange={(e) => setOgImg(e.target.value)} placeholder="https://..." className="h-11 rounded-xl font-mono text-xs" />
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <Button type="submit" disabled={loading} className="h-12 px-8 rounded-xl font-bold text-white shadow-md text-sm" style={{ background: "var(--color-brand-green)" }}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Save className="h-4 w-4 mr-1.5" />}
              <span>{selectedPath} 메타 갱신하기</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
