import { Announce, BandData, Live } from "@/types/type";
import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || "",
  apiKey: process.env.MICROCMS_API_KEY || "",
});

export async function getBandData() {
  return await client.get<
    Pick<
      BandData,
      | "title"
      | "description"
      | "sns"
      | "heroImages"
      | "keywords"
      | "icon"
      | "heroImagesSp"
    >
  >({
    endpoint: "overview",
    queries: {
      fields: "title,description,sns,heroImages,heroImagesSp,keywords,icon",
    },
  });
}

export async function getLiveDetail(id: string) {
  return await client.getListDetail<
    Pick<Live, "id" | "title" | "content" | "eyecatch" | "eventDetail">
  >({
    endpoint: "lives",
    contentId: id,
    queries: {
      fields: "id,title,content,eyecatch,eventDetail",
    },
  });
}

export async function getAnnounceDetail(id: string) {
  return await client.getListDetail<
    Pick<Announce, "id" | "title" | "content" | "eyecatch" | "publishedAt">
  >({
    endpoint: "announcements",
    contentId: id,
    queries: {
      fields: "id,title,content,eyecatch,publishedAt",
    },
  });
}
