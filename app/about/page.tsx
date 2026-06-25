import type { Metadata } from "next";
import { Sparkles, Heart, Award, Smile, CheckCircle2 } from "lucide-react";
import { getSiteSections, getStaffList } from "@/lib/supabase/content";

export const metadata: Metadata = {
  title: "센터 소개",
  description: "말자람터 언어심리연구소 인사말, 비전, 전문 치료 인력 및 시설 안내",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [sections, staffList] = await Promise.all([
    getSiteSections(),
    getStaffList(true),
  ]);

  const greeting = sections.greeting || {
    title: "원장 인사말: 소통의 기쁨을 선물합니다",
    body: "안녕하세요. 말자람터 대표원장입니다. 조급함 대신 기다림으로 아이가 스스로 말문을 열 수 있도록 돕겠습니다.",
    image_urls: ["https://picsum.photos/seed/about1/600/400"],
  };
  const greetingImg = Array.isArray(greeting.image_urls) ? greeting.image_urls[0] : (greeting.image_urls || "https://picsum.photos/600/400");

  const vision = sections.vision || {
    title: "센터 핵심 비전 3가지",
    body: "1. 아동 중심 자발성 촉진 치료\n2. 가정 연계 부모 코칭 시스템\n3. 다학제 협력 통합 진단 평가",
  };
  const visionLines = vision.body.split("\n").filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* 1. 페이지 타이틀 헤더 */}
      <section className="bg-[var(--color-brand-cream)] py-16 lg:py-24 border-b border-border text-center">
        <div className="container-wide space-y-4">
          <h1 className="text-4xl lg:text-5xl font-black" style={{ color: "var(--color-brand-teal)" }}>
            센터 소개
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            아이의 발달 속도를 존중하며 부모님의 마음까지 따뜻하게 어루만지는 말자람터 언어심리연구소입니다.
          </p>
        </div>
      </section>

      {/* 2. 인사말 (CMS 동적 연동) */}
      <section className="py-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-brand-green-light)] text-[var(--color-brand-green)] text-xs font-bold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>원장 인사말</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold leading-tight" style={{ color: "var(--color-brand-teal)" }}>
                {greeting.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-base">
                {greeting.body}
              </p>
              <div className="pt-4 border-t border-border flex items-center gap-3 font-semibold">
                <span className="text-foreground">말자람터 언어심리연구소 대표원장</span>
                <span className="text-[var(--color-brand-green)] font-bold">김지수 드림</span>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-xl border border-border bg-muted">
                <img src={greetingImg} alt="대표원장 사진" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 비전 (CMS 동적 연동) */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container-wide space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold" style={{ color: "var(--color-brand-teal)" }}>
              {vision.title}
            </h2>
            <p className="text-muted-foreground text-sm">
              우리가 아이들을 만나고 치료를 설계할 때 반드시 지키는 철학입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visionLines.map((line: string, idx: number) => {
              const icons = [Heart, Award, Smile];
              const Icon = icons[idx % 3];
              const cleanText = line.replace(/^[0-9•.-]+\s*/, "");

              return (
                <div key={idx} className="p-8 rounded-3xl bg-background border border-border text-center space-y-4 shadow-xs">
                  <div className="w-16 h-16 rounded-2xl mx-auto bg-[var(--color-brand-green-light)] text-[var(--color-brand-green)] flex items-center justify-center">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{cleanText}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    아이가 가진 본연의 잠재력을 가장 자연스러운 방법으로 이끌어냅니다.
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. 전문 인력 카드 (staff DB 동적 연동) */}
      <section className="py-20">
        <div className="container-wide space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold" style={{ color: "var(--color-brand-teal)" }}>
              함께하는 전문가 소개
            </h2>
            <p className="text-muted-foreground text-sm">
              분야별 석사 이상 학위와 보건복지부 국가공인 자격을 보유한 탄탄한 연구진입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {staffList.map((member: any) => (
              <article key={member.id} className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm flex flex-col">
                <div className="aspect-square bg-muted relative overflow-hidden">
                  <img
                    src={member.photo_url || "https://picsum.photos/400"}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[var(--color-brand-green)] shadow-xs">
                    {member.role}
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">{member.name}</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {member.bio.split("\n").map((b: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[var(--color-brand-green)] shrink-0 mt-0.5" />
                          <span>{b.replace(/^[•.-]\s*/, "")}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
