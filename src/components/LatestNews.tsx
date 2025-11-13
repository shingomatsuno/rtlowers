"use client";

import { dateFormat } from "@/lib/date";
import { Announce } from "@/types/type";
import { MicroCMSListResponse } from "microcms-js-sdk";
import Link from "next/link";
import useSWR from "swr";
const fetcher = (url: string) =>
  fetch(url).then(
    (res) =>
      res.json() as Promise<
        MicroCMSListResponse<Pick<Announce, "id" | "title" | "publishedAt">>
      >
  );

export function LatestNews() {
  const { data } = useSWR(`/api/news`, fetcher);

  return (
    <div>
      <ul>
        {data?.contents.map((news) => (
          <li key={news.id} className="border-b border-gray-200 py-4">
            <Link href={`/news/${news.id}`} className="hover:underline">
              <div className="flex flex-col">
                {news.publishedAt && (
                  <span className="text-sm">
                    {dateFormat(news.publishedAt)}
                  </span>
                )}
                <span className="ml-1">{news.title}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
