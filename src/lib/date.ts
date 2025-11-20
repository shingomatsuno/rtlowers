import { Live } from "@/types/type";
import {
  parseISO,
  isAfter,
  compareAsc,
  differenceInDays,
  isSameDay,
} from "date-fns";
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
  if (!date) {
    return "";
  }
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

/**
 * 指定UTC日付が今日かどうか判定
 * 過ぎていたら false、同じ日なら true
 * @param utcDateStr UTC日付文字列
 */
export function isValidUtcDate(utcDateStr: string): boolean {
  // 日本時間に変換
  const jstDate = new Date(dateFormat(utcDateStr));
  const jstToday = new Date(dateFormat(new Date()));

  // 今日と同じ日付なら true
  if (isSameDay(jstDate, jstToday)) return true;

  // 今日より未来なら true
  return jstDate.getTime() > jstToday.getTime();
}

// 30日以内ならNEW
export function isNew(date: string) {
  const _date = parseISO(date);
  const daysDiff = differenceInDays(new Date(), _date);
  return daysDiff <= 30;
}
