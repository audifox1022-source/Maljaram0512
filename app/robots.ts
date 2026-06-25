import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maljarumter.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"], // 관리자 백오피스 및 API 내부 접근 차단
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
