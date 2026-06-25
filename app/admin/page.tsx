import Link from "next/link";
import { getAdminSummary } from "@/lib/supabase/admin";
import { CalendarCheck, MessageSquare, ArrowRight, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const summary = await getAdminSummary();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 타이틀 배너 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 md:p-8 rounded-3xl border border-border shadow-xs">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground" style={{ color: "var(--color-brand-teal)" }}>
            오늘의 센터 운영 요약
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            실시간 수집된 초기 상담 예약과 온라인 간편 문의 현황을 한눈에 확인하세요.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/reservations">
            <Button className="rounded-full text-xs font-bold" style={{ background: "var(--color-brand-teal)", color: "white" }}>
              예약 전체보기
            </Button>
          </Link>
          <Link href="/admin/slots">
            <Button variant="outline" className="rounded-full text-xs font-bold">
              일정 슬롯 추가
            </Button>
          </Link>
        </div>
      </div>

      {/* 요약 KPI 카드 지표 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-xs flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">오늘 접수된 상담 예약</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black text-[var(--color-brand-green)]">
                {summary.todayResCount}
              </span>
              <span className="text-sm font-bold text-foreground">건</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--color-brand-green-light)] text-[var(--color-brand-green)]">
            <CalendarCheck className="h-8 w-8" />
          </div>
        </div>

        <div className="p-6 md:p-8 rounded-3xl bg-card border border-border shadow-xs flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">확인 대기중인 신규 문의</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-black text-[var(--color-brand-orange)]">
                {summary.newInqCount}
              </span>
              <span className="text-sm font-bold text-foreground">건</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--color-brand-orange-light)] text-[var(--color-brand-orange)]">
            <MessageSquare className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* 최근 접수 리스트 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 최근 예약 5건 */}
        <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[var(--color-brand-green)]" />
              <h2 className="text-lg font-bold" style={{ color: "var(--color-brand-teal)" }}>
                최근 상담 예약 신청
              </h2>
            </div>
            <Link href="/admin/reservations" className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1">
              <span>관리</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {summary.recentReservations.map((res: any) => (
              <div key={res.id} className="p-4 rounded-2xl bg-muted/30 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-foreground">{res.applicant_name}</span>
                    <span className="text-xs text-muted-foreground">({res.phone})</span>
                  </div>
                  <p className="text-xs font-medium text-[var(--color-brand-green)]">
                    {res.consult_type} • {res.slot?.counselor_name}
                  </p>
                </div>
                <span
                  className={`text-[11px] font-bold px-3 py-1 rounded-full text-center shrink-0 ${
                    res.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-700"
                      : res.status === "canceled"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {res.status === "confirmed" ? "예약확정" : res.status === "canceled" ? "예약취소" : "신청접수"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 문의 5건 */}
        <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[var(--color-brand-orange)]" />
              <h2 className="text-lg font-bold" style={{ color: "var(--color-brand-teal)" }}>
                최근 온라인 상담 문의
              </h2>
            </div>
            <Link href="/admin/inquiries" className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1">
              <span>전체 답변</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {summary.recentInquiries.map((inq: any) => (
              <div key={inq.id} className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">{inq.name} <span className="text-xs font-normal text-muted-foreground">({inq.phone})</span></span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${inq.status === 'new' ? 'bg-red-100 text-red-600 font-bold animate-pulse' : 'bg-muted text-muted-foreground'}`}>
                    {inq.status === 'new' ? 'NEW' : '확인완료'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {inq.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
