import { client } from "@/lib/client";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

  const [newsList, schedules] = await Promise.all([
    client.getAllContentIds({
      endpoint: "announcements",
    }),
    client.getAllContentIds({
      endpoint: "lives",
    }),
  ]);

  // 固定ページ
  const staticPages = ["", "/news", "/live"].map((path) => ({
    url: `${siteUrl}${path}`,
  }));

  // 動的ページ（ニュース詳細など）
  const dynamicNewsPages = newsList.map((id) => ({
    url: `${siteUrl}/news/${id}`,
  }));

  const dynamicSchedulePages = schedules.map((id) => ({
    url: `${siteUrl}/live/${id}`,
  }));

  return [...staticPages, ...dynamicNewsPages, ...dynamicSchedulePages];
}
