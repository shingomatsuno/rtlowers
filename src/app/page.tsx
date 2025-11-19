import { AnnouncementList } from "@/components/AnnouncementList";
import { EventList } from "@/components/EventList";
import { ContactForm } from "@/components/ContactForm";
import { client, getBandData, getFutureLives } from "@/lib/client";
import { dateFormat, getNextSchedule } from "@/lib/date";
import { Announce, BandData, Live } from "@/types/type";
import YoutubeEmbed from "@/components/YoutubeEmbed";
import Link from "next/link";
import { SafeHTML } from "@/components/SafeHtml";

export const revalidate = 600;

export async function generateMetadata() {
  const bandData = await getBandData();

  const name = bandData.title;
  const description = bandData.description;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const title = `${name}`;
  const sns = bandData.sns;

  return {
    title,
    description,
    keywords: [name, ...(bandData.keywords?.split(",") || [])],
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: `${name}`,
      images: [
        ...bandData.heroImages.map((image, i) => ({
          url: image.url,
          width: image.width,
          height: image.height,
          alt: `${name} ${i + 1}`,
        })),
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [bandData.heroImages.map((image) => image.url)],
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

export default async function HomePage() {
  const [bandData, aboutMovieData, announceList, schedules, futureLives] =
    await Promise.all([
      getBandData(),
      client.get<Pick<BandData, "about" | "movies">>({
        endpoint: "overview",
        queries: {
          fields: "about,movies",
        },
      }),
      client.getList<Pick<Announce, "id" | "title" | "publishedAt">>({
        endpoint: "announcements",
        queries: {
          fields: "id,title,publishedAt",
          orders: "-publishedAt",
          limit: 5,
        },
      }),
      client.getList<Pick<Live, "id" | "title" | "eyecatch" | "eventDetail">>({
        endpoint: "lives",
        queries: {
          fields: "id,title,eyecatch,eventDetail.eventDate",
          orders: "-eventDetail.eventDate",
          limit: 5,
        },
      }),
      getFutureLives(),
    ]);

  // chedulesの中から、未来で、一番近い日付のものを取得
  const nextEvent = getNextSchedule(schedules.contents);

  return (
    <div>
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-b from-black via-[#0f0f0f] to-[#0d0d0d]"
      >
        {/* SPがある場合はSPとPCで切り替え */}
        {bandData.heroImagesSp && bandData.heroImagesSp.length > 0 && (
          <>
            <img
              src={bandData.heroImagesSp[0].url}
              alt="Hero sp"
              className="block h-auto w-full animate-[scale_20s_ease-in-out_infinite_alternate] object-cover opacity-60 md:hidden"
            />
            <img
              src={bandData.heroImages[0].url}
              alt="Hero"
              className="hidden h-auto w-full animate-[scale_20s_ease-in-out_infinite_alternate] object-cover opacity-60 md:block"
            />
          </>
        )}
        {/* SPがない場合はPC画像で統一 */}
        {!bandData.heroImagesSp ||
          (bandData.heroImagesSp.length == 0 && (
            <img
              src={bandData.heroImages[0].url}
              alt="Hero"
              className="h-auto w-full animate-[scale_20s_ease-in-out_infinite_alternate] object-cover opacity-60"
            />
          ))}
        <div className="absolute bottom-3 w-full text-center">
          <h1 className="mx-auto font-[math] text-4xl font-bold italic tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] md:text-8xl">
            {bandData.title}
          </h1>
          <p className="text-lg font-bold">{bandData.description}</p>
        </div>
      </section>
      {nextEvent && (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0d0d0d] via-[#0f0f0f] to-[#0d0d0d] text-center">
          <div className="mx-auto max-w-5xl px-6 py-24 text-center">
            <div className="animate-interval-rotate mb-4 inline-block bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-4xl font-extrabold text-transparent drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]">
              Next LIVE!!
            </div>
            <h2 className="mb-8 bg-gradient-to-r from-gray-400 via-gray-200 to-white bg-clip-text text-5xl font-bold text-transparent">
              {nextEvent.title}
            </h2>
            <div className="text-lg text-gray-300">
              {dateFormat(nextEvent.eventDetail.eventDate, "yyyy/MM/dd (EEE)")}
            </div>
            <div className="text-lg text-gray-300">
              {nextEvent.eventDetail.venue}
            </div>
            <Link
              href={`/live/${nextEvent.id}`}
              className="mt-6 inline-block rounded-full border border-cyan-500 px-8 py-3 text-lg font-semibold text-cyan-300 transition-all duration-300 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(0,255,255,0.7)]"
            >
              詳細を見る →
            </Link>
          </div>
        </section>
      )}
      <section
        id="news"
        className="min-h-screen bg-gradient-to-b from-[#0d0d0d] via-[#1a0f1f] to-[#0d0d0d]"
      >
        <div className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="animate-fadeInUp mb-8 bg-gradient-to-r from-gray-200 via-gray-100 to-white bg-clip-text text-5xl font-bold text-transparent drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
            NEWS
          </h2>
          {announceList.contents.length > 0 && (
            <AnnouncementList list={announceList.contents} />
          )}
          {announceList.contents.length == 0 && <p>ニュースはありません</p>}
        </div>
      </section>
      <section
        id="live"
        className="min-h-screen bg-gradient-to-b from-[#0d0d0d] via-[#1a0f1f] to-[#000000]"
      >
        <div className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="animate-fadeInUp mb-8 bg-gradient-to-r from-gray-200 via-gray-100 to-white bg-clip-text text-5xl font-bold text-transparent drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
            LIVE
          </h2>
          {schedules.contents.length > 0 && (
            <EventList list={schedules.contents} />
          )}
          {schedules.contents.length == 0 && <p>ライブはありません</p>}
        </div>
      </section>
      <section
        id="about"
        className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0f0f1a] to-[#1a0f0f]"
      >
        <div className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="animate-fadeInUp mb-8 bg-gradient-to-r from-gray-200 via-gray-100 to-white bg-clip-text text-5xl font-bold text-transparent drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
            ABOUT
          </h2>
          <div className="flex flex-col items-start gap-10">
            <div className="relative flex w-full justify-center">
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={aboutMovieData.about.image.url}
                  alt="bio image"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
            <div className="w-full space-y-6">
              <SafeHTML html={aboutMovieData.about.bio} />
              <ul className="text-sm text-gray-300">
                {aboutMovieData.about.members.map((m, i) => (
                  <li key={i}>
                    {m.part} {m.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section
        id="music"
        className="min-h-screen bg-gradient-to-b from-[#1a0f0f] via-[#1a0026] to-[#000000]"
      >
        <div className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="animate-fadeInUp mb-8 bg-gradient-to-r from-gray-200 via-gray-100 to-white bg-clip-text text-5xl font-bold text-transparent drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
            MUSIC
          </h2>
          <div className="flex flex-col gap-4 md:px-8">
            {aboutMovieData.movies.map((m, i) => (
              <YoutubeEmbed key={i} videoId={m.videoId} />
            ))}
          </div>
        </div>
      </section>
      <section
        id="contact"
        className="min-h-screen bg-gradient-to-b from-[#000000] via-[#111111] to-[#0d0d0d]"
      >
        <div className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="animate-fadeInUp mb-8 bg-gradient-to-r from-gray-200 via-gray-100 to-white bg-clip-text text-5xl font-bold text-transparent drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
            CONTACT
          </h2>
          <ContactForm schedules={futureLives.contents} sns={bandData.sns} />
        </div>
      </section>
    </div>
  );
}
