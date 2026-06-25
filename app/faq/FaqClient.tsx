"use client";

import Link from "next/link";
import { HelpCircle, MessageSquare, Phone } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export function FaqClient({ initialFaqs }: { initialFaqs: any[] }) {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* 1. 상단 타이틀 배너 */}
      <section className="bg-[var(--color-brand-cream)] py-16 lg:py-24 border-b border-border text-center">
        <div className="container-wide space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-brand-green-light)] text-[var(--color-brand-green)] text-xs font-bold">
            <HelpCircle className="h-4 w-4" />
            <span>궁금증 해결하기</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black" style={{ color: "var(--color-brand-teal)" }}>
            자주 묻는 질문 (FAQ)
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            학부모님들이 가장 자주 여쭤보시는 질문들을 모았습니다. 원하는 항목을 클릭하여 확인하세요.
          </p>
        </div>
      </section>

      {/* 2. 질문 답변 아코디언 목록 */}
      <section className="py-16">
        <div className="container-narrow max-w-3xl mx-auto">
          {initialFaqs.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              등록된 질문 내역이 없습니다.
            </div>
          ) : (
            <Accordion className="space-y-4">
              {initialFaqs.map((faq, index) => (
                <AccordionItem
                  key={faq.id || index}
                  value={`item-${index}`}
                  className="bg-card px-6 py-2 rounded-2xl border border-border shadow-xs data-[state=open]:border-[var(--color-brand-green)] transition-colors"
                >
                  <AccordionTrigger className="text-left font-bold text-base sm:text-lg hover:no-underline py-4 text-foreground">
                    <span className="flex items-center gap-3">
                      <span className="text-[var(--color-brand-green)] font-black text-xl">Q.</span>
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed pt-2 pb-6 pl-8 border-t border-border/50 whitespace-pre-line">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {/* 하단 추가 문의 안내 배너 */}
          <div className="mt-16 p-8 rounded-3xl bg-muted/40 border border-border text-center space-y-6">
            <h2 className="text-xl font-bold text-foreground">
              원하시는 답변을 찾지 못하셨나요?
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              언제든 연구소로 직접 연락 주시면 전문 상담원이 친절하게 답변해 드립니다.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto rounded-full font-bold gap-2 px-6" style={{ background: "var(--color-brand-teal)", color: "white" }}>
                  <MessageSquare className="h-4 w-4" />
                  온라인 1:1 간편 문의
                </Button>
              </Link>
              <a href="tel:02-1234-5678" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto rounded-full font-bold gap-2 px-6">
                  <Phone className="h-4 w-4 text-[var(--color-brand-green)]" />
                  전화 상담 (02-1234-5678)
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
