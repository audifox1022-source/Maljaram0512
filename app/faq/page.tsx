import type { Metadata } from "next";
import { FaqClient } from "./FaqClient";
import { getFaqList } from "@/lib/supabase/content";

import { getPageSeo } from "@/lib/supabase/seo";

export async function generateMetadata() {
  return getPageSeo("/faq", {
    title: "자주 묻는 질문 (FAQ) | 말자람터 언어심리연구소",
    description: "처음 언어치료를 시작하실 때 학부모님들께서 가장 자주 궁금해하시는 질문과 답변 모음",
  });
}

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const faqList = await getFaqList(true);

  return <FaqClient initialFaqs={faqList} />;
}
