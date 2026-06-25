"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MessageSquare, Phone, Mail, CheckCircle2, Clock } from "lucide-react";

export function InquiriesAdmin({ initialList }: { initialList: any[] }) {
  const [list, setList] = useState(initialList);
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_inquiry_status", id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
        setList(list.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
      } else {
        toast.error("상태 업데이트 실패");
      }
    } catch {
      toast.error("통신 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="text-lg font-bold" style={{ color: "var(--color-brand-teal)" }}>
          전체 접수 목록 ({list.length}건)
        </h2>
        <span className="text-xs text-muted-foreground">
          💡 상태를 클릭하시면 즉시 업데이트 됩니다.
        </span>
      </div>

      <div className="space-y-4">
        {list.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            접수된 온라인 문의가 없습니다.
          </div>
        ) : (
          list.map((inq) => {
            const isNew = inq.status === "new";
            const isAnswered = inq.status === "answered";

            return (
              <div
                key={inq.id}
                className={`p-6 rounded-2xl border transition-all ${
                  isNew
                    ? "bg-red-50/30 border-red-200 shadow-xs"
                    : "bg-background border-border hover:bg-muted/20"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-foreground">{inq.name}</span>
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-muted text-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {inq.phone}
                    </span>
                    {inq.email && (
                      <span className="text-xs font-mono text-muted-foreground hidden md:flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {inq.email}
                      </span>
                    )}
                  </div>

                  {/* 상태 선택 버튼 그룹 */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleUpdateStatus(inq.id, "new")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        inq.status === "new"
                          ? "bg-red-600 text-white shadow-xs"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      미확인 (NEW)
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleUpdateStatus(inq.id, "answered")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        inq.status === "answered"
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      답변 완료
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleUpdateStatus(inq.id, "closed")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        inq.status === "closed"
                          ? "bg-slate-700 text-white shadow-xs"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      상담 종료
                    </button>
                  </div>
                </div>

                <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 p-4 rounded-xl border border-border/50">
                  {inq.message}
                </div>
                <div className="flex justify-end mt-2">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    접수일시: {new Date(inq.created_at || Date.now()).toLocaleString("ko-KR")}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
