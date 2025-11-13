import { client } from "@/lib/client";
import { Announce } from "@/types/type";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const _page = searchParams.get("page") || "1";
  const page = /^\d+$/.test(_page) ? Number(_page) : 1;

  const limit = 5;
  const offset = (page - 1) * limit;
  const res = await client.getList<
    Pick<Announce, "id" | "title" | "publishedAt">
  >({
    endpoint: "announcements",
    queries: {
      fields: "id,title,publishedAt",
      orders: "-publishedAt",
      limit,
      offset,
    },
  });

  return NextResponse.json(res);
}
