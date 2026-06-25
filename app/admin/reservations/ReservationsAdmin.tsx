"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Check,
  X,
  FileText,
  Save,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function ReservationsAdmin({ initialList }: { initialList: any[] }) {
  const [list, setList] = useState(initialList);
  const [filter, setFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [memo, setMemo] = useState("");
  const [restoreSlot, setRestoreSlot] = useState(true); // 취소 시 슬롯 오픈 원복 옵션
  const [loading, setLoading] = useState(false);

  // 필터링된 리스트
  const filtered = filter === "all" ? list : list.filter((item) => item.status === filter);

  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
    setMemo(item.admin_memo || "");
  };

  // 예약 상태 변경 처리
  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedItem) return;

    if (newStatus === "canceled" && !confirm("정말 예약을 취소하시겠습니까?")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_reservation_status",
          id: selectedItem.id,
          status: newStatus,
          slot_id: selectedItem.slot?.id,
          restore_slot: restoreSlot,
          applicant_name: selectedItem.applicant_name,
          phone: selectedItem.phone,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
        // 상태 실시간 갱신
        const updated = list.map((item) =>
          item.id === selectedItem.id ? { ...item, status: newStatus } : item
        );
        setList(updated);
        setSelectedItem({ ...selectedItem, status: newStatus });
      } else {
        toast.error(data.error || "상태 변경 실패");
      }
    } catch {
      toast.error("네트워크 통신 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  // 메모 저장
  const handleSaveMemo = async () => {
    if (!selectedItem) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_reservation_memo",
          id: selectedItem.id,
          memo,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("관리자 메모가 업데이트 되었습니다.");
        const updated = list.map((item) =>
          item.id === selectedItem.id ? { ...item, admin_memo: memo } : item
        );
        setList(updated);
        setSelectedItem({ ...selectedItem, admin_memo: memo });
      } else {
        toast.error("메모 저장 실패");
      }
    } catch {
      toast.error("통신 에러");
    } finally {
      setLoading(false);
    }
  };

  const filterTabs = [
    { id: "all", label: "전체" },
    { id: "requested", label: "신규 신청" },
    { id: "confirmed", label: "예약 확정" },
    { id: "canceled", label: "취소됨" },
    { id: "done", label: "상담 완료" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* 좌측: 예약 목록 & 필터 탭 */}
      <div className="lg:col-span-7 bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs space-y-6">
        {/* 필터 바 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-colors ${
                filter === tab.id
                  ? "bg-[var(--color-brand-teal)] text-white shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 예약 카드 리스트 */}
        <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              조건에 맞는 예약 내역이 없습니다.
            </div>
          ) : (
            filtered.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-[var(--color-brand-green)] bg-[var(--color-brand-green-light)]/40 ring-2 ring-[var(--color-brand-green)] shadow-sm"
                      : "border-border bg-background hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="font-bold text-base text-foreground mr-2">{item.applicant_name}</span>
                      <span className="text-xs font-mono text-muted-foreground">{item.phone}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                        item.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "canceled"
                          ? "bg-red-100 text-red-800"
                          : item.status === "done"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800 font-bold"
                      }`}
                    >
                      {item.status === "confirmed"
                        ? "확정됨"
                        : item.status === "canceled"
                        ? "취소됨"
                        : item.status === "done"
                        ? "완료됨"
                        : "신규 신청"}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-[var(--color-brand-teal)] mb-1">
                    {item.consult_type} • {item.slot?.counselor_name}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    아동: {item.child_info}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 우측: 상세 패널 & 상태 조작 액션 */}
      <div className="lg:col-span-5 bg-card rounded-3xl p-6 md:p-8 border border-border shadow-md lg:sticky lg:top-24">
        {!selectedItem ? (
          <div className="py-24 text-center text-muted-foreground space-y-2">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="font-bold text-base text-foreground">선택된 예약이 없습니다</p>
            <p className="text-xs">왼쪽 목록에서 관리할 예약을 클릭해주세요.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-border pb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold" style={{ color: "var(--color-brand-teal)" }}>
                예약 상세 및 상태 변경
              </h2>
              <span className="text-xs font-mono text-muted-foreground">#{selectedItem.id}</span>
            </div>

            {/* 신청자 정보 내역 */}
            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">보호자 성함</span>
                <span className="font-bold">{selectedItem.applicant_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">휴대폰 번호</span>
                <span className="font-mono font-bold">{selectedItem.phone}</span>
              </div>
              {selectedItem.email && (
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">이메일</span>
                  <span className="font-mono">{selectedItem.email}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">담당 전문가</span>
                <span className="font-bold text-[var(--color-brand-green)]">{selectedItem.slot?.counselor_name}</span>
              </div>
              <div className="py-1">
                <span className="text-muted-foreground block mb-1">아동 발달 정보 및 특이사항</span>
                <p className="p-3 rounded-xl bg-muted/40 text-foreground leading-relaxed">
                  {selectedItem.child_info}
                </p>
              </div>
            </div>

            {/* 상태 변경 버튼 그룹 */}
            <div className="space-y-3 pt-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                실시간 예약 상태 변경
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  disabled={loading || selectedItem.status === "confirmed"}
                  onClick={() => handleUpdateStatus("confirmed")}
                  className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Check className="h-4 w-4 mr-1" />
                  예약 확정
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={loading || selectedItem.status === "done"}
                  onClick={() => handleUpdateStatus("done")}
                  className="rounded-xl font-bold text-blue-600 hover:bg-blue-50 border-blue-200"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  상담 완료
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={loading || selectedItem.status === "canceled"}
                  onClick={() => handleUpdateStatus("canceled")}
                  className="rounded-xl font-bold text-red-600 hover:bg-red-50 border-red-200"
                >
                  <X className="h-4 w-4 mr-1" />
                  예약 취소
                </Button>
              </div>

              {/* 핵심 요구사항: 슬롯 복구 옵션 체크박스 */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5 mt-2">
                <Checkbox
                  id="restoreOption"
                  checked={restoreSlot}
                  onCheckedChange={(c) => setRestoreSlot(Boolean(c))}
                  className="mt-0.5 border-amber-500 data-[state=checked]:bg-amber-600"
                />
                <Label htmlFor="restoreOption" className="text-xs text-amber-900 leading-normal cursor-pointer">
                  <span className="font-bold flex items-center gap-1 mb-0.5">
                    <RotateCcw className="h-3 w-3" />
                    취소 시 예약 슬롯 다시 오픈
                  </span>
                  예약 취소 처리 시 이 슬롯이 홈페이지 캘린더에 다시 [예약 가능] 상태로 노출됩니다.
                </Label>
              </div>
            </div>

            {/* 관리자 메모란 */}
            <div className="space-y-2 pt-3 border-t border-border">
              <Label htmlFor="memo" className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                운영진 내부 메모 (학부모 비공개)
              </Label>
              <Textarea
                id="memo"
                rows={3}
                placeholder="치료 평가 설문지 발송 여부, 희망 대기 요일 등을 자유롭게 기록하세요."
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="rounded-xl text-xs leading-relaxed"
                disabled={loading}
              />
              <Button
                size="sm"
                variant="secondary"
                disabled={loading || memo === (selectedItem.admin_memo || "")}
                onClick={handleSaveMemo}
                className="w-full rounded-xl text-xs font-bold gap-1 mt-1"
              >
                <Save className="h-3.5 w-3.5" />
                내부 메모 저장하기
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
