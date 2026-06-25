import type { Metadata } from "next";
import { FaqClient } from "./FaqClient";
import { getFaqList } from "@/lib/supabase/content";

export const metadata: Metadata = {
  title: "자주 묻는 질문 (FAQ)",
  description: "말자람터 언어심리연구소 상담 예약, 치료 진행, 바우처 이용 등에 대해 궁금한 점을 확인하세요.",
};

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const faqList = await getFaqList(true);

  return <FaqClient initialFaqs={faqList} />;
}
