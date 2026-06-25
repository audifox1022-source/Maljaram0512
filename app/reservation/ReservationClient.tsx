"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import type { AvailabilitySlot } from "@/lib/supabase/reservations";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ReservationClient() {
  // 내일 날짜 계산 (기본 선택값)
  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  };

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(getTomorrow());
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);

  // 예약 입력 폼 상태
  const [formData, setFormData] = useState({
    consult_type: "초기 언어발달 종합평가",
    applicant_name: "",
    phone: "",
    email: "",
    child_info: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [completedResId, setCompletedResId] = useState<string | null>(null);

  // 날짜 선택 시 슬롯 페칭
  const fetchSlots = async (date: Date) => {
    // YYYY-MM-DD 포맷
    const yyyyMmDd = date.toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
    setLoadingSlots(true);
    setSelectedSlot(null); // 날짜 바꾸면 선택 슬롯 초기화

    try {
      const res = await fetch(`/api/reservation?date=${yyyyMmDd}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setSlots(data.slots || []);
      } else {
        setSlots([]);
      }
    } catch {
      toast.error("시간대 정보를 불러오는 중 오류가 발생했습니다.");
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 예약 제출 (동시성 제어 핵심 처리)
  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSlot) {
      toast.error("예약하실 시간대를 먼저 선택해주세요.");
      return;
    }

    if (formData.applicant_name.trim().length < 2) {
      toast.error("보호자 성함을 정확히 입력해주세요.");
      return;
    }

    if (!/^[0-9\-]{9,13}$/.test(formData.phone.trim())) {
      toast.error("연락처를 숫자 형식으로 올바르게 적어주세요.");
      return;
    }

    if (formData.child_info.trim().length < 2) {
      toast.error("아동의 나이와 주요 걱정사항을 적어주세요.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot_id: selectedSlot.id,
          ...formData,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("예약이 성공적으로 확정되었습니다!");
        setCompletedResId(data.reservationId || "res-confirmed");
      } else if (res.status === 409) {
        /* ══════════════════════════════════════════════
            ★ 동시성 제어 예외 감지 (409 Conflict)
            내가 폼을 작성하는 동안 다른 분이 0.1초 먼저 예약 완료한 경우!
        ══════════════════════════════════════════════ */
        toast.error(
          data.error || "방금 전 다른 분의 예약이 완료되어 마감된 시간대입니다."
        );
        // 슬롯 목록 실시간 새로고침
        if (selectedDate) fetchSlots(selectedDate);
      } else {
        toast.error(data.error || "예약 처리에 실패했습니다. 다시 시도해주세요.");
      }
    } catch {
      toast.error("네트워크 오류가 발생했습니다. 전화를 통해 예약해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── 예약 완료 확정 화면 ── */
  if (completedResId) {
    return (
      <div className="max-w-xl mx-auto rounded-3xl bg-card border border-border p-8 md:p-12 text-center shadow-lg animate-fade-in">
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: "var(--color-brand-green-light)" }}
        >
          <CheckCircle2 className="h-10 w-10" style={{ color: "var(--color-brand-green)" }} />
        </div>
        <h2 className="text-3xl font-bold mb-3" style={{ color: "var(--color-brand-teal)" }}>
          상담 예약이 확정되었습니다
        </h2>
        <p className="text-muted-foreground mb-8">
          입력하신 연락처(<span className="font-bold text-foreground">{formData.phone}</span>)로 카카오톡 알림 및 안내 문자가 발송됩니다.
        </p>

        <div className="rounded-2xl p-6 bg-muted/30 border border-border text-left space-y-3 mb-8 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">예약 번호</span>
            <span className="font-mono font-bold text-xs">{completedResId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">담당 전문가</span>
            <span className="font-bold">{selectedSlot?.counselor_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">방문 일시</span>
            <span className="font-bold text-[var(--color-brand-green)]">
              {selectedDate?.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" })}{" "}
              ({selectedSlot?.formatted_time})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">상담 분야</span>
            <span className="font-medium">{formData.consult_type}</span>
          </div>
        </div>

        <Button
          onClick={() => {
            setCompletedResId(null);
            setSelectedSlot(null);
            if (selectedDate) fetchSlots(selectedDate);
          }}
          className="rounded-full px-8 font-bold"
          style={{ background: "var(--color-brand-teal)", color: "white" }}
        >
          다른 일정 추가 예약하기
        </Button>
      </div>
    );
  }

  /* ── 일반 예약 신청 플로우 ── */
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      {/* 좌측 1: 캘린더 날짜 선택 패널 */}
      <div className="lg:col-span-5 bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-brand-green)] text-white text-xs font-bold">1</span>
          <h2 className="text-lg font-bold" style={{ color: "var(--color-brand-teal)" }}>
            방문하실 날짜를 선택하세요
          </h2>
        </div>

        <div className="flex justify-center border-y border-border/60 py-4 my-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => {
              // 오늘 및 오늘 이전 날짜는 선택 불가
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today;
            }}
            className="rounded-xl"
          />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">
          💡 일요일 및 공휴일은 휴무이며 예약이 불가능합니다.
        </p>
      </div>

      {/* 우측 2 & 3: 시간대 슬롯 선택 및 정보 입력 폼 */}
      <div className="lg:col-span-7 space-y-8">
        {/* 시간대 선택 카드 */}
        <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-brand-orange)] text-white text-xs font-bold">2</span>
              <h2 className="text-lg font-bold" style={{ color: "var(--color-brand-teal)" }}>
                상담 시간 선택
              </h2>
            </div>
            {selectedDate && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-muted text-muted-foreground">
                {selectedDate.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" })}
              </span>
            )}
          </div>

          {loadingSlots ? (
            <div className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-[var(--color-brand-green)]" />
              <span className="text-sm">예약 가능한 시간대를 조회하고 있습니다...</span>
            </div>
          ) : slots.length === 0 ? (
            <div className="py-10 rounded-2xl bg-muted/30 border border-dashed border-border text-center p-6">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
              <p className="text-sm font-semibold text-foreground mb-1">예약 가능한 오픈 시간대가 없습니다</p>
              <p className="text-xs text-muted-foreground">다른 날짜를 선택하시거나 전화 문의 부탁드립니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {slots.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? "border-[var(--color-brand-green)] bg-[var(--color-brand-green-light)] ring-2 ring-[var(--color-brand-green)] shadow-sm"
                        : "border-border bg-background hover:border-foreground/30 hover:bg-muted/40"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
                        <Clock className="h-4 w-4 text-[var(--color-brand-green)] shrink-0" />
                        <span>{slot.formatted_time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground pl-5.5">
                        {slot.counselor_name}
                      </p>
                    </div>
                    {isSelected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand-green)] text-white text-[10px]">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 정보 입력 및 제출 카드 (슬롯 선택 시 활성화) */}
        <div
          className={`bg-card rounded-3xl p-6 md:p-8 border border-border shadow-md transition-all duration-300 ${
            selectedSlot ? "opacity-100 translate-y-0" : "opacity-50 pointer-events-none filter blur-[1px]"
          }`}
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-brand-teal)] text-white text-xs font-bold">3</span>
            <h2 className="text-lg font-bold" style={{ color: "var(--color-brand-teal)" }}>
              예약자 정보 입력
            </h2>
            {!selectedSlot && (
              <span className="text-xs text-red-500 ml-auto font-medium">← 위에서 시간을 먼저 골라주세요</span>
            )}
          </div>

          <form onSubmit={handleSubmitReservation} className="space-y-5">
            {/* 희망 상담 분야 */}
            <div className="space-y-2">
              <Label htmlFor="consult_type" className="text-sm font-bold">
                희망 상담 분야 <span className="text-red-500">*</span>
              </Label>
              <select
                id="consult_type"
                name="consult_type"
                value={formData.consult_type}
                onChange={handleFormChange}
                className="w-full h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)]"
              >
                <option value="초기 언어발달 종합평가">초기 언어발달 종합평가</option>
                <option value="조음 및 발음 명료도 상담">조음 및 발음 명료도 상담</option>
                <option value="인지·학습 언어능력 진단">인지·학습 언어능력 진단</option>
                <option value="영유아 부모 상호작용 코칭">영유아 부모 상호작용 코칭</option>
                <option value="기타 맞춤 상담">기타 맞춤 상담</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 보호자 성함 */}
              <div className="space-y-2">
                <Label htmlFor="applicant_name" className="text-sm font-bold">
                  보호자 성함 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="applicant_name"
                  name="applicant_name"
                  placeholder="예: 홍길동"
                  required
                  value={formData.applicant_name}
                  onChange={handleFormChange}
                  className="h-12 rounded-xl"
                />
              </div>

              {/* 연락처 */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-bold">
                  휴대폰 번호 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="예: 010-1234-5678"
                  required
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="h-12 rounded-xl"
                />
              </div>
            </div>

            {/* 이메일 */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold">
                이메일 <span className="text-xs font-normal text-muted-foreground">(선택 - 예약 안내문 수신용)</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleFormChange}
                className="h-12 rounded-xl"
              />
            </div>

            {/* 아동 정보 */}
            <div className="space-y-2">
              <Label htmlFor="child_info" className="text-sm font-bold">
                아동 정보 및 걱정 사항 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="child_info"
                name="child_info"
                rows={4}
                placeholder="아동의 이름과 생년월일(예: 김지우 23년 5월생), 또래보다 말이 늦거나 발음이 새는 등 현재 가장 고민되시는 부분을 간략히 적어주세요."
                required
                value={formData.child_info}
                onChange={handleFormChange}
                className="rounded-xl p-3.5 resize-none text-sm leading-relaxed"
              />
            </div>

            {/* 예약 안내 요약 박스 */}
            {selectedSlot && (
              <div className="p-4 rounded-2xl bg-[var(--color-brand-cream)] border border-border flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-[var(--color-brand-teal)]" />
                  <span className="font-bold">선택하신 일정:</span>
                </div>
                <span className="font-bold text-[var(--color-brand-green)]">
                  {selectedSlot.formatted_time} ({selectedSlot.counselor_name})
                </span>
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting || !selectedSlot}
              className="w-full h-14 rounded-full text-base font-bold shadow-md hover:shadow-lg transition-all"
              style={{ background: "var(--color-brand-teal)", color: "white" }}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  실시간 중복 검사 및 예약 확정 중...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5 text-amber-300" />
                  선택한 일정으로 예약 확정하기
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
