import { client } from "@/lib/client";
import { Live } from "@/types/type";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const yearMonth = searchParams.get("yearMonth");

  const res = await client.getList<Pick<Live, "id" | "title" | "eventDetail">>({
    endpoint: "lives",
    queries: {
      fields: "id,title,eventDetail.eventDate",
      orders: "-eventDetail.eventDate",
      filters: `eventDetail.eventDate[begins_with]${yearMonth}`,
    },
  });

  return NextResponse.json(res.contents);
}
