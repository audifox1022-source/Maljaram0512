"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Clock, Plus, Lock, Calendar, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SlotsAdmin({
  initialSlots,
  counselors,
}: {
  initialSlots: any[];
  counselors: any[];
}) {
  const [slots, setSlots] = useState(initialSlots);
  const [counselorId, setCounselorId] = useState(counselors[0]?.id || "");
  const [dateStr, setDateStr] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  );
  const [timeStr, setTimeStr] = useState("10:00");
  const [loading, setLoading] = useState(false);

  // 새 슬롯 생성
  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!counselorId || !dateStr || !timeStr) return;

    setLoading(true);
    try {
      // Asia/Seoul (+09:00) 기준 1시간 간격 슬롯 생성
      const startIso = `${dateStr}T${timeStr}:00+09:00`;
      const endHour = String(Number(timeStr.slice(0, 2)) + 1).padStart(2, "0");
      const endIso = `${dateStr}T${endHour}:${timeStr.slice(3, 5)}:00+09:00`;

      const res = await fetch("/api/admin/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_slot",
          counselor_id: counselorId,
          start_iso: startIso,
          end_iso: endIso,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("예약 슬롯이 오픈되었습니다.");
        const selectedCounselor = counselors.find((c) => c.id === counselorId);
        const newSlot = {
          id: `new-slot-${Date.now()}`,
          counselor_name: selectedCounselor?.name || "전문가",
          slot_start: startIso,
          slot_end: endIso,
          status: "open",
          formatted_time: `${timeStr} – ${endHour}:00`,
        };
        setSlots([...slots, newSlot].sort((a, b) => a.slot_start.localeCompare(b.slot_start)));
      } else {
        toast.error(data.error || "슬롯 생성 실패");
      }
    } catch {
      toast.error("서버 통신 에러");
    } finally {
      setLoading(false);
    }
  };

  // 슬롯 마감 처리
  const handleCloseSlot = async (id: string) => {
    if (!confirm("이 슬롯을 마감 처리하시겠습니까?")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "close_slot", id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("슬롯이 마감되었습니다.");
        setSlots(slots.map((s) => (s.id === id ? { ...s, status: "closed" } : s)));
      } else {
        toast.error("마감 실패");
      }
    } catch {
      toast.error("에러 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* 좌측: 새 일정 슬롯 추가 폼 */}
      <div className="lg:col-span-5 bg-card rounded-3xl p-6 md:p-8 border border-border shadow-md lg:sticky lg:top-24">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-bold" style={{ color: "var(--color-brand-teal)" }}>
            새로운 가능 시간대 오픈하기
          </h2>
        </div>

        <form onSubmit={handleCreateSlot} className="space-y-5">
          {/* 상담 전문가 선택 */}
          <div className="space-y-2">
            <Label htmlFor="counselor" className="text-sm font-bold">
              담당 치료 전문가 <span className="text-red-500">*</span>
            </Label>
            <select
              id="counselor"
              value={counselorId}
              onChange={(e) => setCounselorId(e.target.value)}
              className="w-full h-12 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)]"
            >
              {counselors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 상담 날짜 */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-bold">
                날짜 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                required
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="h-12 rounded-xl text-xs"
              />
            </div>

            {/* 시작 시간 */}
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-bold">
                시작 시간 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="time"
                type="time"
                required
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                className="h-12 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 border text-xs text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-[var(--color-brand-green)] shrink-0" />
            <span>선택하신 시작 시간부터 정확히 1간격으로 슬롯이 자동 배정됩니다.</span>
          </div>

          <Button
            type="submit"
            disabled={loading || !counselorId}
            className="w-full h-14 rounded-full text-base font-bold shadow-md hover:shadow-lg transition-all"
            style={{ background: "var(--color-brand-teal)", color: "white" }}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" />
                예약 일정 슬롯 오픈
              </>
            )}
          </Button>
        </form>
      </div>

      {/* 우측: 오픈된 전체 슬롯 목록 */}
      <div className="lg:col-span-7 bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-lg font-bold" style={{ color: "var(--color-brand-teal)" }}>
            등록된 미래 가용 슬롯 현황
          </h2>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-muted text-muted-foreground">
            총 {slots.filter((s) => s.status !== "closed").length}개 활성
          </span>
        </div>

        <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
          {slots.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              오픈된 일정 슬롯이 없습니다. 왼쪽에서 추가해주세요.
            </div>
          ) : (
            slots.map((slot) => {
              const isClosed = slot.status === "closed";
              const isBooked = slot.status === "booked";

              return (
                <div
                  key={slot.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    isClosed
                      ? "bg-muted/40 border-dashed border-border text-muted-foreground opacity-60"
                      : isBooked
                      ? "bg-amber-50/40 border-amber-200"
                      : "bg-background border-border"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">
                        {new Date(slot.slot_start).toLocaleDateString("ko-KR", {
                          month: "short",
                          day: "numeric",
                          weekday: "short",
                        })}
                      </span>
                      <span className="text-xs font-mono font-bold text-[var(--color-brand-green)]">
                        {slot.formatted_time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{slot.counselor_name}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isClosed
                          ? "bg-muted text-muted-foreground"
                          : isBooked
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {isClosed ? "마감됨" : isBooked ? "예약완료" : "오픈중"}
                    </span>

                    {!isClosed && !isBooked && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={loading}
                        onClick={() => handleCloseSlot(slot.id)}
                        className="rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border-red-200 gap-1 h-8"
                      >
                        <Lock className="h-3 w-3" />
                        마감
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
