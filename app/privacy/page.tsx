import type { Metadata } from "next";
import { Shield, Lock, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 말자람터 언어심리연구소",
  description: "말자람터 언어심리연구소 개인정보처리방침 안내",
};

export default function PrivacyPage() {
  return (
    <div className="py-16 md:py-24 section-padding animate-fade-in bg-background">
      <div className="container-narrow max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4 border-b border-border pb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-[var(--color-brand-green-light)] text-[var(--color-brand-green)] mx-auto shadow-xs">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-teal)]">
            개인정보처리방침
          </h1>
          <p className="text-sm text-muted-foreground">
            말자람터 언어심리연구소는 내담자 및 보호자의 개인정보를 소중히 다루며 법령을 준수합니다.
          </p>
        </div>

        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">제1조 (개인정보의 수집 및 이용 목적)</h2>
            <p>
              센터는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법에 따라 별도의 동의를 받는 등 필요한 조치를 이행합니다.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>상담 예약 접수 및 일정 안내, 사전 발달 설문 확인</li>
              <li>언어발달 평가, 심리치료 세션 진행 및 종합 결과지 작성</li>
              <li>상담료 결제 및 환급, 현금영수증 발행</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">제2조 (수집하는 개인정보 항목)</h2>
            <p>센터는 상담 예약 및 서비스 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>필수항목:</strong> 아동 이름, 생년월일, 성별, 보호자 연락처, 주소</li>
              <li><strong>선택항목:</strong> 주 호소 내용(상담 희망 사유), 이전 기관 평가 이력</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">제3조 (개인정보의 보유 및 이용 기간)</h2>
            <p>
              내담자의 개인정보는 서비스 이용 기간 동안 보유하며, 관련 법령(의료법 및 개인정보보호법 준용)에 명시된 보존 기간(예: 상담 진료 기록 5년)이 경과하거나 수집 목적이 달성된 후에는 지체 없이 안전하게 파기합니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-foreground">제4조 (개인정보 보호책임자)</h2>
            <p>
              개인정보 처리에 관한 업무를 총괄해서 책임지고, 관련 고충처리 및 피해구제를 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="p-4 rounded-xl bg-card border border-border text-sm text-foreground space-y-1">
              <p><strong>책임자:</strong> 김지수 대표원장</p>
              <p><strong>이메일:</strong> info@maljarumter.com</p>
              <p><strong>전화번호:</strong> 02-1234-5678</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
