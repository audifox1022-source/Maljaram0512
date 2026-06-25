import type { Metadata } from "next";
import { FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "이용약관 | 말자람터 언어심리연구소",
  description: "말자람터 언어심리연구소 서비스 이용약관 안내",
};

export default function TermsPage() {
  return (
    <div className="py-16 md:py-24 section-padding animate-fade-in bg-background">
      <div className="container-narrow max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4 border-b border-border pb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-[var(--color-brand-orange-light)] text-[var(--color-brand-orange)] mx-auto shadow-xs">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-teal)]">
            서비스 이용약관
          </h1>
          <p className="text-sm text-muted-foreground">
            말자람터 언어심리연구소의 평가 및 치료 프로그램 이용에 관한 규정입니다.
          </p>
        </div>

        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">제1조 (목적)</h2>
            <p>
              본 약관은 말자람터 언어심리연구소(이하 "센터")가 제공하는 언어발달 평가, 언어치료, 심리상담 및 부모 코칭 프로그램 서비스의 이용 조건 및 절차, 센터와 내담자(보호자 포함)의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">제2조 (예약 접수 및 변경/취소 규정)</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>사전 상담 및 진단 평가는 사전 예약제로 운영되며, 홈페이지 예약 혹은 전화 접수가 확정된 시점부터 효력이 발생합니다.</li>
              <li>당일 취소 및 노쇼(No-Show) 방지를 위해 세션 시작 24시간 전까지 연락을 주셔야 일정 변경이 가능합니다.</li>
              <li>아동의 건강 상 사유(감기, 전염성 질환 등)로 인한 당일 취소 시에는 증빙 서류 확인 후 회기 이월을 지원합니다.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">제3조 (치료 세션 운영 및 보호자 협조)</h2>
            <p>
              보다 효과적인 아동 발달 성장을 위해 보호자는 센터 치료진의 가정 연계 가이드(부모 상호작용 피드백)에 적극적으로 협조하며, 세션 시작 시간 5~10분 전 센터에 도착하여 대기해 주실 것을 권장합니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">제4조 (비밀 보장 의무)</h2>
            <p>
              센터의 모든 치료진 및 직원은 내담자의 상담 내용 및 검사 결과에 대해 철저한 비밀을 보장하며, 보호자의 서면 동의 없이 외부(학교, 타 병원 등)에 절대 열람 및 제공하지 않습니다. (단, 법령에 의한 고지 의무 발생 시 제외)
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
