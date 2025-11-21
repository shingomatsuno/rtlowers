"use client";

import { Calendar } from "@/components/ui/calendar";
import { dateFormat } from "@/lib/date";
import { Live } from "@/types/type";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

const monthMap: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const fetcher = (url: string) =>
  fetch(url).then((res) => res.json() as Promise<Live[]>);

function parseYearMonth(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1);
}

export function LiveArchive({
  defaultYearMonth,
}: {
  defaultYearMonth: string;
}) {
  const [yearMonth, setYearMonth] = useState(defaultYearMonth);
  const { data: list } = useSWR(`/api/lives?yearMonth=${yearMonth}`, fetcher);

  const [isInit, setIsInit] = useState(false);
  const handleDayClick = (date: Date | undefined) => {
    if (!date) return;
    alert("クリックした日付: " + date.toISOString().split("T")[0]);
  };

  const onMonthChange = (date: Date) => {
    const _yearMonth = dateFormat(date, "yyyy-MM");
    setYearMonth(_yearMonth);
  };

  useEffect(() => {
    setIsInit(true);
  }, []);

  if (!isInit) {
    return <div></div>;
  }

  return (
    <div className="mx-auto w-fit">
      <Calendar
        className="rounded-md bg-gray-900 text-slate-100"
        mode="single"
        month={parseYearMonth(yearMonth)}
        onMonthChange={onMonthChange}
        components={{
          CaptionLabel: (props) => (
            <span>
              {String(props.children).split(" ")[1]}{" "}
              {monthMap[String(props.children).split(" ")[0]]}{" "}
            </span>
          ),
          Day: ({ day }) => (
            <td className="flex w-10 justify-center">
              {(() => {
                const date = dateFormat(day.date);
                const live = list?.find(
                  ({ eventDetail }) =>
                    dateFormat(eventDetail.eventDate) === date
                );
                if (live) {
                  return (
                    <Link
                      title={live.title}
                      href={`/live/${live.id}`}
                      className="block h-full w-full rounded-lg bg-blue-600 text-center font-medium text-white shadow-md transition-colors hover:bg-blue-700 active:bg-blue-800"
                    >
                      {day.date.getDate()}
                    </Link>
                  );
                }

                return day.date.getDate();
              })()}
            </td>
          ),
        }}
        onSelect={handleDayClick}
      />
      {list && list.length > 0 && (
        <div>
          <ul>
            {list?.map((live) => (
              <li key={live.id}>
                <Link href={`/live/${live.id}`} className="hover:underline">
                  <span className="text-sm">
                    {dateFormat(live.eventDetail.eventDate)}
                  </span>
                  <span className="ml-1">{live.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
