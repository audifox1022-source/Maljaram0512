import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeartHandshake, Sparkles, ShieldCheck, Users } from "lucide-react";
import { getSiteSections } from "@/lib/supabase/content";

export const dynamic = "force-dynamic"; // CMS 수정 시 즉시 반영

export default async function HomePage() {
  const sections = await getSiteSections();
  const hero = sections.hero || {
    title: "아이의 맑은 목소리, 말자람터가 함께 피워냅니다",
    body: "따뜻한 눈빛과 따스한 언어로 아이의 내면을 밝히는 곳. 맞춤 성장 여정을 동행합니다.",
    image_urls: ["https://picsum.photos/seed/maljarum1/800/600"],
  };
  const heroImg = Array.isArray(hero.image_urls) ? hero.image_urls[0] : (hero.image_urls || "https://picsum.photos/800/600");

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. 히어로 섹션 (따뜻한 색감, 핵심 메시지 + CTA) */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-[var(--color-brand-cream)] to-background">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-brand-green-light)] text-[var(--color-brand-green)] font-semibold text-sm animate-fade-in">
                <Sparkles className="h-4 w-4" />
                <span>언어심리치료 공식 전문센터</span>
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]"
                style={{ color: "var(--color-brand-teal)" }}
              >
                {hero.title}
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground font-normal max-w-2xl leading-relaxed mx-auto lg:mx-0 whitespace-pre-line">
                {hero.body}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href="/reservation" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto text-lg font-bold px-8 py-7 rounded-full shadow-lg hover:shadow-xl transition-all"
                    style={{ background: "var(--color-brand-teal)", color: "white" }}
                  >
                    온라인 상담 예약하기
                  </Button>
                </Link>
                <Link href="/programs" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-lg font-semibold px-8 py-7 rounded-full border-2 border-[var(--color-brand-green)] text-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-light)]"
                  >
                    대표 프로그램 보기
                  </Button>
                </Link>
              </div>
            </div>

            {/* 히어로 이미지 자리 */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-muted">
                  <img
                    src={heroImg}
                    alt="말자람터 연구소 전경"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-xl border border-border hidden sm:flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[var(--color-brand-orange-light)] text-[var(--color-brand-orange)]">
                    <HeartHandshake className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">부모 상담 만족도</p>
                    <p className="text-xl font-bold text-foreground">98.4% 달성</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 센터 강점 3~4개 */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: "var(--color-brand-teal)" }}>
              말자람터가 특별한 이유
            </h2>
            <p className="text-muted-foreground">
              단순한 언어 훈련이 아닌, 아이의 세계를 이해하고 마음을 연결하는 올바른 치료를 지향합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-background border border-border hover:border-[var(--color-brand-green)] transition-all space-y-4 shadow-xs hover:shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-brand-green-light)] flex items-center justify-center text-[var(--color-brand-green)]">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground">공인 1급 전문가 자격</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                보건복지부 국가공인 1급 언어재활사 및 임상심리전문가 등 풍부한 임상 경력을 갖춘 탄탄한 치료진이 직접 평가하고 치료합니다.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-background border border-border hover:border-[var(--color-brand-green)] transition-all space-y-4 shadow-xs hover:shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-brand-orange-light)] flex items-center justify-center text-[var(--color-brand-orange)]">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground">가정 연계 부모 코칭</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                센터 내 세션으로 끝나지 않고, 일상 생활 속에서 부모님이 직접 상호작용할 수 있는 구체적인 가이드와 코칭 피드백을 매회 제공합니다.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-background border border-border hover:border-[var(--color-brand-green)] transition-all space-y-4 shadow-xs hover:shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-brand-cream)] flex items-center justify-center text-[var(--color-brand-teal)]">
                <HeartHandshake className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground">아동 중심의 자발성 치료</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                억지로 시키는 반복 학습을 배제합니다. 아이가 흥미를 느끼는 놀이 매개체를 통해 스스로 말하고 싶어지도록 동기를 극대화합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 하단 예약/문의 CTA */}
      <section className="py-24 bg-[var(--color-brand-green)] text-white relative overflow-hidden">
        <div className="container-wide relative z-10 text-center space-y-8 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            우리 아이의 첫 발달 상담, 지금 부담 없이 시작해보세요
          </h2>
          <p className="text-emerald-100 text-base sm:text-lg">
            초기 상담만으로도 아이의 현재 상태와 앞으로의 양육 방향성을 명확하게 잡으실 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/reservation" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg font-bold px-10 py-7 rounded-full shadow-2xl bg-white text-[var(--color-brand-green)] hover:bg-emerald-50"
              >
                실시간 일정 예약하기
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-lg font-semibold px-10 py-7 rounded-full border-2 border-white text-white hover:bg-white/10"
              >
                간편 간접 문의 남기기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
