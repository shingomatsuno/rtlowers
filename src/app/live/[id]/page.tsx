import { ContactForm } from "@/components/ContactForm";
import { LiveArchive } from "@/components/LiveArchive";
import { SafeHTML } from "@/components/SafeHtml";
import { getFutureLives, getLiveDetail } from "@/lib/client";
import { getBandData } from "@/lib/client";
import { dateFormat, isValidUtcDate } from "@/lib/date";

export async function generateMetadata({ params }: Props) {
  const bandData = await getBandData();
  const { id } = await params;
  const detail = await getLiveDetail(id);

  const name = bandData.title;
  const description = bandData.description;
  const eventImage = detail.eyecatch?.url
    ? [detail.eyecatch.url]
    : bandData.heroImages.map((image, i) => ({
        url: image.url,
        width: image.width,
        height: image.height,
        alt: `${name} ${i + 1}`,
      }));

  const siteUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com") + `/live/${id}`;
  const title = `${detail.title} | ${name}`;
  const sns = bandData.sns;

  return {
    title,
    description,
    keywords: [name, title, ...(bandData.keywords?.split(",") || [])],
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: `${name}`,
      images: [...eventImage],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [...eventImage],
      creator: sns?.xAccount,
    },
    alternates: {
      canonical: siteUrl,
    },
    other: {
      "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

interface Props {
  params: Promise<{ id: string }>;
}

import { notFound } from "next/navigation";

export default async function ScheduleDetail({ params }: Props) {
  const { id } = await params;
  let bandData, detail, contents;
  try {
    [bandData, detail, { contents }] = await Promise.all([
      getBandData(),
      getLiveDetail(id),
      getFutureLives(),
    ]);
  } catch {
    notFound();
  }

  if (!detail) {
    notFound();
  }

  const validDate = isValidUtcDate(detail.eventDetail.eventDate);

  return (
    <section id="live" className="min-h-full">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="md:flex md:gap-4">
          <div className="md:flex-[1.5]">
            <h1 className="mb-8 text-2xl font-bold text-white md:text-3xl">
              {detail.title}
            </h1>
            {detail.eyecatch && (
              <img
                src={detail.eyecatch.url}
                className="mb-5 h-auto w-full rounded-md"
                alt={detail.title}
              />
            )}
            <div className="mb-6 flex items-center">
              <div>開催日：</div>
              <div className="text-lg font-bold">
                {dateFormat(detail.eventDetail.eventDate, "yyyy/MM/dd (EEE)")}
              </div>
            </div>
            <SafeHTML html={detail.content} />
            <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="mb-6 border-b border-white/10 pb-2 text-xl font-bold tracking-wider text-cyan-400">
                EVENT DETAILS
              </h3>
              <dl className="space-y-4 text-sm md:text-base">
                <div className="grid grid-cols-[80px_1fr] items-baseline gap-4 md:grid-cols-[100px_1fr]">
                  <dt className="font-semibold text-gray-400">DATE</dt>
                  <dd className="text-lg font-medium text-white">
                    {dateFormat(
                      detail.eventDetail.eventDate,
                      "yyyy/MM/dd (EEE)"
                    )}
                  </dd>
                </div>

                <div className="grid grid-cols-[80px_1fr] items-baseline gap-4 md:grid-cols-[100px_1fr]">
                  <dt className="font-semibold text-gray-400">TIME</dt>
                  <dd className="text-white">
                    OPEN {dateFormat(detail.eventDetail.eventOpenTime, "hh:mm")}{" "}
                    / START{" "}
                    {dateFormat(detail.eventDetail.eventStartTime, "hh:mm")}
                  </dd>
                </div>

                <div className="grid grid-cols-[80px_1fr] items-baseline gap-4 md:grid-cols-[100px_1fr]">
                  <dt className="font-semibold text-gray-400">VENUE</dt>
                  <dd className="text-white">{detail.eventDetail.venue}</dd>
                </div>

                <div className="grid grid-cols-[80px_1fr] items-baseline gap-4 md:grid-cols-[100px_1fr]">
                  <dt className="font-semibold text-gray-400">TICKET</dt>
                  {!detail.eventDetail.ticket &&
                  !detail.eventDetail.todayTicket ? (
                    <dd>無料</dd>
                  ) : (
                    <dd className="text-white">
                      前売 ¥{detail.eventDetail.ticket} / 当日 ¥
                      {detail.eventDetail.todayTicket}
                    </dd>
                  )}
                </div>

                {detail.eventDetail.drink && (
                  <div className="grid grid-cols-[80px_1fr] items-baseline gap-4 md:grid-cols-[100px_1fr]">
                    <dt className="font-semibold text-gray-400">DRINK</dt>
                    <dd className="text-white">¥{detail.eventDetail.drink}</dd>
                  </div>
                )}

                {detail.eventDetail.actors &&
                  detail.eventDetail.actors.length > 0 && (
                    <div className="grid grid-cols-[80px_1fr] items-baseline gap-4 md:grid-cols-[100px_1fr]">
                      <dt className="font-semibold text-gray-400">ACT</dt>
                      <dd className="text-white">
                        <ul className="flex flex-wrap gap-x-4 gap-y-1">
                          {detail.eventDetail.actors.map((actor, index) => (
                            <li key={index} className="relative">
                              {index > 0 && (
                                <span className="absolute -left-3 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-gray-500" />
                              )}
                              {actor.actor}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  )}
              </dl>
            </div>
          </div>
          <div className="hidden flex-1 justify-center md:flex">
            <LiveArchive
              defaultYearMonth={dateFormat(
                detail.eventDetail.eventDate,
                "yyyy-MM"
              )}
            />
          </div>
        </div>
        {/* 終わってるときは非表示 */}
        {validDate && (
          <div id="form" className="mt-8">
            <ContactForm
              isTicket
              defaultScheduleId={id}
              schedules={contents}
              sns={bandData.sns}
            />
          </div>
        )}
        <div className="mt-8 block md:hidden">
          <LiveArchive
            defaultYearMonth={dateFormat(
              detail.eventDetail.eventDate,
              "yyyy-MM"
            )}
          />
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MusicEvent",
            name: detail.title,
            startDate: detail.eventDetail.eventDate,
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode:
              "https://schema.org/OfflineEventAttendanceMode",
            location: {
              "@type": "Place",
              name: detail.eventDetail.venue,
              address: {
                "@type": "PostalAddress",
                addressCountry: "JP",
              },
            },
            image: [
              detail.eyecatch?.url,
              ...bandData.heroImages.map((i) => i.url),
            ].filter(Boolean),
            description: detail.content,
            performer: {
              "@type": "MusicGroup",
              name: bandData.title,
            },
            offers: {
              "@type": "Offer",
              price: detail.eventDetail.ticket,
              priceCurrency: "JPY",
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/live/${id}`,
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />
    </section>
  );
}
