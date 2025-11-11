import { Announce, BandData, Live } from "@/types/type";
import { createClient } from "microcms-js-sdk";
import { toZonedTime } from "date-fns-tz";

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

/**
 * ライブ当日か、未来のみ取得
 */
export async function getFutureLives() {
  const timeZone = "Asia/Tokyo";

  // JSTの今日0時を作成
  const jstMidnight = new Date();
  jstMidnight.setHours(0, 0, 0, 0); // JSTで0:00:00にリセット

  // UTCに変換
  const utcDate = toZonedTime(jstMidnight, timeZone);

  // ISO文字列に
  const isoString = utcDate.toISOString();

  return await client.getList({
    endpoint: "lives",
    queries: {
      fields: "id,title,eyecatch,eventDetail.eventDate",
      orders: "-eventDetail.eventDate",
      filters: `eventDetail.eventDate[greater_than]${isoString}[or]eventDetail.eventDate[begins_with]${isoString.substring(
        0,
        10
      )}`,
    },
  });
}
