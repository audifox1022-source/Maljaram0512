"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, Image as ImageIcon, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContentAdmin({ initialSections }: { initialSections: Record<string, any> }) {
  const [sections, setSections] = useState(initialSections);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const handleChange = (key: string, field: string, val: any) => {
    setSections((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: val,
      },
    }));
  };

  const handleSaveSection = async (key: string) => {
    setLoadingKey(key);
    try {
      const sec = sections[key];
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "section",
          action: "save",
          data: {
            key,
            title: sec.title,
            body: sec.body,
            image_urls: typeof sec.image_urls === "string" ? [sec.image_urls] : (sec.image_urls || []),
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "섹션 콘텐츠가 반영되었습니다!");
      } else {
        toast.error("저장 실패");
      }
    } catch {
      toast.error("서버 에러 발생");
    } finally {
      setLoadingKey(null);
    }
  };

  const secConfigs = [
    { key: "hero", label: "🏠 메인 히어로 배너 (첫 접속 화면)" },
    { key: "greeting", label: "🌿 원장님 인사말 (소개 페이지 상단)" },
    { key: "vision", label: "🎯 연구소 핵심 비전 3가지" },
  ];

  return (
    <div className="space-y-8">
      {secConfigs.map((cfg) => {
        const sec = sections[cfg.key] || { title: "", body: "", image_urls: [] };
        const isLoading = loadingKey === cfg.key;
        const imgUrl = Array.isArray(sec.image_urls) ? sec.image_urls[0] : sec.image_urls;

        return (
          <div key={cfg.key} className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-lg font-bold" style={{ color: "var(--color-brand-teal)" }}>
                {cfg.label}
              </h2>
              <span className="text-xs font-mono text-muted-foreground">key: {cfg.key}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">섹션 대제목 (Headline)</Label>
                  <Input
                    value={sec.title || ""}
                    onChange={(e) => handleChange(cfg.key, "title", e.target.value)}
                    className="h-12 rounded-xl font-bold text-base text-foreground"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">본문 설명 (Body Text - 엔터 줄바꿈 및 리치 텍스트 지원)</Label>
                  <Textarea
                    rows={6}
                    value={sec.body || ""}
                    onChange={(e) => handleChange(cfg.key, "body", e.target.value)}
                    className="rounded-xl leading-relaxed text-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="md:col-span-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span>배경/대표 이미지 URL</span>
                  </Label>
                  <Input
                    value={imgUrl || ""}
                    onChange={(e) => handleChange(cfg.key, "image_urls", [e.target.value])}
                    placeholder="https://picsum.photos/..."
                    className="h-10 rounded-xl text-xs font-mono"
                    disabled={isLoading}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    💡 Supabase Storage 업로드 후 생성된 주소를 붙여넣으세요.
                  </p>
                </div>

                {imgUrl && (
                  <div className="rounded-2xl overflow-hidden border border-border bg-muted aspect-video relative shadow-inner">
                    <img src={imgUrl} alt="미리보기" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                disabled={isLoading}
                onClick={() => handleSaveSection(cfg.key)}
                className="rounded-full px-8 font-bold gap-1.5 shadow-sm"
                style={{ background: "var(--color-brand-teal)", color: "white" }}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    실시간 홈페이지 반영하기
                  </>
                )}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
