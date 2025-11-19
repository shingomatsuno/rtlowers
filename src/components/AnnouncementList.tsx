import { dateFormat, isNew } from "@/lib/date";
import { Announce } from "@/types/type";
import Link from "next/link";
import { NewLabel } from "./NewLabel";

export function AnnouncementList({
  list,
}: {
  list: Pick<Announce, "id" | "publishedAt" | "title">[];
}) {
  return (
    <ul className="divide-y divide-gray-200">
      {list.map(({ id, publishedAt, title }) => (
        <Link key={id} href={`/news/${id}`} className="">
          <li className="group flex cursor-pointer items-center justify-between border-b border-gray-100 py-4 transition hover:opacity-80">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                {publishedAt && (
                  <span className="text-sm text-gray-100">
                    {dateFormat(publishedAt)}
                  </span>
                )}
                {publishedAt && isNew(publishedAt) && <NewLabel />}
              </div>
              <span className="font-medium text-gray-100">{title}</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 transform text-gray-100 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </li>
        </Link>
      ))}
    </ul>
  );
}
