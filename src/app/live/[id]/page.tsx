import { ContactForm } from "@/components/ContactForm";
import { LiveArchive } from "@/components/LiveArchive";
import { SafeHTML } from "@/components/SafeHtml";
import { client, getFutureLives, getLiveDetail } from "@/lib/client";
import { getBandData } from "@/lib/client";
import { dateFormat, isValidUtcDate } from "@/lib/date";

export const revalidate = 600;

export async function generateStaticParams() {
  const contents = await client.getAllContentIds({
    endpoint: "lives",
  });
  return contents.map((id) => ({
    id,
  }));
}

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

export default async function ScheduleDetail({ params }: Props) {
  const { id } = await params;
  const [bandData, detail, { contents }] = await Promise.all([
    getBandData(),
    getLiveDetail(id),
    getFutureLives(),
  ]);

  const validDate = isValidUtcDate(detail.eventDetail.eventDate);

  return (
    <section id="live" className="min-h-full">
      <div className="max-w-5xl mx-auto py-24 px-6">
        <div className="md:flex md:gap-4">
          <div className="md:flex-[1.5]">
            <h1 className="md:text-3xl text-2xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-gray-200 to-white">
              {detail.title}
            </h1>
            {detail.eyecatch && (
              <img
                src={detail.eyecatch.url}
                className="w-full h-auto rounded-md mb-5"
                alt={detail.title}
              />
            )}
            <div className="mb-6 flex items-center">
              <div>開催日：</div>
              <div className="text-lg font-bold ">
                {dateFormat(detail.eventDetail.eventDate, "yyyy/MM/dd (EEE)")}
              </div>
            </div>
            <SafeHTML html={detail.content} />
            <div className="mt-10 p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-6 text-cyan-400 tracking-wider border-b border-white/10 pb-2">
                EVENT DETAILS
              </h3>
              <dl className="space-y-4 text-sm md:text-base">
                <div className="grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr] gap-4 items-baseline">
                  <dt className="text-gray-400 font-semibold">DATE</dt>
                  <dd className="text-white font-medium text-lg">
                    {dateFormat(detail.eventDetail.eventDate, "yyyy/MM/dd (EEE)")}
                  </dd>
                </div>

                <div className="grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr] gap-4 items-baseline">
                  <dt className="text-gray-400 font-semibold">TIME</dt>
                  <dd className="text-white">
                    OPEN {dateFormat(detail.eventDetail.eventOpenTime, 'hh:mm')} / START{" "}
                    {dateFormat(detail.eventDetail.eventStartTime, 'hh:mm')}
                  </dd>
                </div>

                <div className="grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr] gap-4 items-baseline">
                  <dt className="text-gray-400 font-semibold">VENUE</dt>
                  <dd className="text-white">{detail.eventDetail.venue}</dd>
                </div>

                <div className="grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr] gap-4 items-baseline">
                  <dt className="text-gray-400 font-semibold">TICKET</dt>
                  <dd className="text-white">
                    前売 ¥{detail.eventDetail.ticket} / 当日 ¥
                    {detail.eventDetail.todayTicket}
                  </dd>
                </div>

                {detail.eventDetail.drink && (<div className="grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr] gap-4 items-baseline">
                  <dt className="text-gray-400 font-semibold">DRINK</dt>
                  <dd className="text-white">
                    ¥{detail.eventDetail.drink}
                  </dd>
                </div>)
                }

                {detail.eventDetail.actors && detail.eventDetail.actors.length > 0 && (
                  <div className="grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr] gap-4 items-baseline">
                    <dt className="text-gray-400 font-semibold">ACT</dt>
                    <dd className="text-white">
                      <ul className="flex flex-wrap gap-x-4 gap-y-1">
                        {detail.eventDetail.actors.map((actor, index) => (
                          <li key={index} className="relative">
                            {index > 0 && (
                              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-gray-500 rounded-full" />
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
          <div className="hidden md:flex flex-1 justify-center">
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
        <div className="md:hidden block mt-8">
          <LiveArchive
            defaultYearMonth={dateFormat(
              detail.eventDetail.eventDate,
              "yyyy-MM"
            )}
          />
        </div>
      </div>
    </section>
  );
}
