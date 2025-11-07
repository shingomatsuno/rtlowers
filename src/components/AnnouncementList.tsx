import { dateFormat } from "@/lib/date";
import { Announce } from "@/types/type";
import Link from "next/link";

export function AnnouncementList({ list }: { list: Announce[] }) {
  return (
    <ul className="divide-y divide-gray-200">
      {/* ニュース内容 */}
      {list.map(({ id, publishedAt, title }) => (
        <Link key={id} href={`/news/${id}`} className="">
          <li className="flex border-b border-gray-100 justify-between items-center py-4 transition cursor-pointer group hover:opacity-80">
            <div className="flex flex-col">
              <span className="text-sm text-gray-100">
                {dateFormat(publishedAt)}
              </span>
              <span className="font-medium text-gray-100">{title}</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-100 transform transition-transform duration-200 group-hover:translate-x-1"
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
