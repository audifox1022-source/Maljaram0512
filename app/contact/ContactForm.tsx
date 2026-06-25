"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  // 폼 입력 상태
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    agree: false,
    website: "", // 허니팟(스팸 방지용 안 보이는 필드)
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agree: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 프론트엔드 유효성 검증
    if (!formData.agree) {
      toast.error("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    if (formData.name.trim().length < 2) {
      toast.error("이름을 정확하게 입력해주세요.");
      return;
    }

    const phoneRegex = /^[0-9\-]{9,13}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      toast.error("올바른 연락처 숫자 형식을 입력해주세요.");
      return;
    }

    if (formData.message.trim().length < 5) {
      toast.error("문의 내용을 좀 더 구체적으로(5자 이상) 적어주세요.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || "문의가 성공적으로 접수되었습니다!");
        // 입력 폼 초기화
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: "",
          agree: false,
          website: "",
        });
      } else {
        toast.error(data.error || "문의 접수에 실패했습니다. 다시 시도해주세요.");
      }
    } catch {
      toast.error("네트워크 오류가 발생했습니다. 전화를 통해 문의해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── 스팸 방지용 허니팟 (화면에서 완벽히 숨김 처리) ── */}
      <div className="hidden aria-hidden" aria-hidden="true">
        <label htmlFor="website">웹사이트 주소 (입력 금지)</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* 보호자 성함 */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-bold">
            보호자 성함 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="예: 홍길동"
            required
            value={formData.name}
            onChange={handleChange}
            className="h-12 rounded-xl"
            disabled={loading}
          />
        </div>

        {/* 연락처 */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-bold">
            연락처 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="예: 010-1234-5678"
            required
            value={formData.phone}
            onChange={handleChange}
            className="h-12 rounded-xl"
            disabled={loading}
          />
        </div>
      </div>

      {/* 회신받을 이메일 */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-bold">
          이메일 주소 <span className="text-xs font-normal text-muted-foreground">(선택)</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="example@email.com (답변 메일을 원하시면 적어주세요)"
          value={formData.email}
          onChange={handleChange}
          className="h-12 rounded-xl"
          disabled={loading}
        />
      </div>

      {/* 문의 내용 */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-bold">
          문의 내용 <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={6}
          placeholder="아이의 나이(개월 수), 주로 걱정되는 언어적 행동, 희망하시는 요일이나 시간대 등을 적어주시면 훨씬 정확한 답변이 가능합니다."
          required
          value={formData.message}
          onChange={handleChange}
          className="rounded-xl p-4 resize-none leading-relaxed"
          disabled={loading}
        />
      </div>

      {/* 개인정보 수집 동의 */}
      <div className="rounded-2xl p-4 bg-muted/40 border border-border/80 space-y-3">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="agree"
            checked={formData.agree}
            onCheckedChange={handleCheckboxChange}
            disabled={loading}
            className="mt-1"
          />
          <div className="grid gap-1 leading-none">
            <Label
              htmlFor="agree"
              className="text-sm font-bold leading-snug cursor-pointer"
            >
              개인정보 수집 및 이용에 동의합니다 <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-muted-foreground leading-normal mt-1">
              수집항목: 이름, 연락처, 이메일 | 수집목적: 상담 예약 및 문의에 대한 회신 | 보유기간: 상담 종료 후 1년 파기
            </p>
          </div>
        </div>
      </div>

      {/* 제출 버튼 */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-14 rounded-full text-base font-bold shadow-md transition-all hover:shadow-lg"
        style={{
          background: "var(--color-brand-teal)",
          color: "white",
        }}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            상담 접수 처리 중...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            무료 상담 문의 보내기
          </>
        )}
      </Button>
    </form>
  );
}
