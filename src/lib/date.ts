import { Live } from "@/types/type";
import { parseISO, isAfter, compareAsc, differenceInDays } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { ja } from "date-fns/locale";

/**
 * yyyy/MM/dd
 * yyyy/MM/dd (EEE)で曜日
 */
export function dateFormat(
  date: Date | string | number,
  format = "yyyy/MM/dd"
): string {
  try {
    return formatInTimeZone(date, "Asia/Tokyo", format, { locale: ja });
  } catch (e) {
    console.error(e);
    return "";
  }
}

export function getNextSchedule(
  schedules: Pick<Live, "id" | "title" | "eyecatch" | "eventDetail">[]
): Pick<Live, "id" | "title" | "eyecatch" | "eventDetail"> | null {
  const now = new Date();
  const tz = "Asia/Tokyo";

  const upcoming = schedules
    .filter((s) => s.eventDetail.eventDate)
    .map((s) => ({
      ...s,
      formatted: formatInTimeZone(
        s.eventDetail.eventDate,
        tz,
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      dateObj: parseISO(
        formatInTimeZone(
          s.eventDetail.eventDate,
          tz,
          "yyyy-MM-dd'T'HH:mm:ssXXX"
        )
      ),
    }))
    .filter((s) => isAfter(s.dateObj, now))
    .sort((a, b) => compareAsc(a.dateObj, b.dateObj));

  return upcoming[0] || null;
}

// 30日以内ならNEW
export function isNew(date: string) {
  const _date = parseISO(date);
  const daysDiff = differenceInDays(new Date(), _date);
  return daysDiff <= 30;
}
