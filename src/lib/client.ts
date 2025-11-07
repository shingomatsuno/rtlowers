import { BandData } from "@/types/type";
import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || "",
  apiKey: process.env.MICROCMS_API_KEY || "",
});

export async function getBandData() {
  return await client.get<
    Pick<
      BandData,
      "title" | "description" | "sns" | "heroImages" | "keywords" | "icon"
    >
  >({
    endpoint: "overview",
    queries: {
      fields: "title,description,sns,heroImages,keywords,icon",
    },
  });
}
