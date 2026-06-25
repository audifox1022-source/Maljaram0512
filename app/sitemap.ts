import type { MetadataRoute } from "next";
import { getAllPrograms } from "@/lib/supabase/programs";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maljarumter.com";

  // 정적 주요 페이지들
  const staticRoutes = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/programs`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/reservation`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  // 동적 프로그램 상세 페이지들
  const programs = await getAllPrograms();
  const programRoutes = programs
    .filter((p) => p.published)
    .map((prog) => ({
      url: `${baseUrl}/programs/${prog.slug}`,
      lastModified: new Date(prog.updated_at || Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    }));

  return [...staticRoutes, ...programRoutes];
}
