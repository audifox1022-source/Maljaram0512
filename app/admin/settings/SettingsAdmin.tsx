"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save, Settings, MapPin, Phone, Mail, Clock, Share2, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { SiteSettings } from "@/lib/supabase/settings";

export function SettingsAdmin({ initialSettings }: { initialSettings: SiteSettings }) {
  const [form, setForm] = useState(initialSettings);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "settings", action: "save", data: form }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.error || "저장에 실패했습니다.");
      }
    } catch {
      toast.error("서버와 통신 중 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-fade-in pb-12">
      {/* 1. 기본 브랜드 정보 */}
      <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs space-y-5">
        <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--color-brand-teal)" }}>
          <Settings className="h-5 w-5" />
          <span>기본 센터 아이덴티티</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold">연구소 공식 명칭</Label>
            <Input required value={form.site_name} onChange={(e) => handleChange("site_name", e.target.value)} className="h-11 rounded-xl font-bold text-sm" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold flex items-center gap-1">
              <ImageIcon className="h-3.5 w-3.5" />
              <span>로고 이미지 URL (.svg 혹은 .png)</span>
            </Label>
            <Input value={form.logo_url} onChange={(e) => handleChange("logo_url", e.target.value)} placeholder="/file.svg 혹은 https://..." className="h-11 rounded-xl font-mono text-xs" />
          </div>
        </div>
      </div>

      {/* 2. 연락처 및 영업시간 */}
      <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs space-y-5">
        <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--color-brand-teal)" }}>
          <Phone className="h-5 w-5" />
          <span>고객 고객센터 및 방문 안내 정보</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold">대표 전화번호</Label>
            <Input required value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className="h-11 rounded-xl font-bold" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold">공식 이메일 주소</Label>
            <Input required type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} className="h-11 rounded-xl font-mono text-xs" />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label className="text-xs font-bold">오시는 길 주소</Label>
            <Input required value={form.address} onChange={(e) => handleChange("address", e.target.value)} className="h-11 rounded-xl text-sm" />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label className="text-xs font-bold">영업 및 상담 시간 안내</Label>
            <Input required value={form.business_hours} onChange={(e) => handleChange("business_hours", e.target.value)} className="h-11 rounded-xl text-xs text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* 3. 소셜 미디어 링크 */}
      <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs space-y-5">
        <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--color-brand-teal)" }}>
          <Share2 className="h-5 w-5" />
          <span>공식 SNS 채널 바로가기 주소</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold">💬 카카오톡 채널 URL</Label>
            <Input value={form.kakao_url} onChange={(e) => handleChange("kakao_url", e.target.value)} className="h-11 rounded-xl text-xs font-mono" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold">📸 인스타그램 공식 URL</Label>
            <Input value={form.instagram_url} onChange={(e) => handleChange("instagram_url", e.target.value)} className="h-11 rounded-xl text-xs font-mono" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold">📝 네이버 블로그 URL</Label>
            <Input value={form.blog_url} onChange={(e) => handleChange("blog_url", e.target.value)} className="h-11 rounded-xl text-xs font-mono" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold">▶️ 유튜브 채널 URL</Label>
            <Input value={form.youtube_url} onChange={(e) => handleChange("youtube_url", e.target.value)} className="h-11 rounded-xl text-xs font-mono" />
          </div>
        </div>
      </div>

      {/* 4. 구글 지도 HTML 임베드 코드 */}
      <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs space-y-5">
        <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--color-brand-teal)" }}>
          <MapPin className="h-5 w-5" />
          <span>구글/카카오 지도 HTML 임베드 iframe 코드</span>
        </h2>
        <p className="text-xs text-muted-foreground">구글 지도에서 [공유 ➔ 지도 퍼가기] 하신 뒤 복사된 iframe 태그 전체를 붙여넣으세요.</p>

        <Textarea rows={4} value={form.map_embed} onChange={(e) => handleChange("map_embed", e.target.value)} className="rounded-xl font-mono text-xs text-slate-600 bg-slate-50" />
      </div>

      <div className="flex justify-end sticky bottom-8 z-30">
        <Button type="submit" disabled={loading} size="lg" className="rounded-full px-10 py-7 text-base font-bold shadow-2xl gap-2" style={{ background: "var(--color-brand-teal)", color: "white" }}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-5 w-5" />사이트 설정 전체 저장하기</>}
        </Button>
      </div>
    </form>
  );
}
