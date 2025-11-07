import { AnnouncementList } from "@/components/AnnouncementList";
import { EventList } from "@/components/EventList";
import { ContactForm } from "@/components/ContactForm";
import { client, getBandData } from "@/lib/client";
import { dateFormat, getNextSchedule } from "@/lib/date";
import { Announce, Live } from "@/types/type";

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
  const [bandData, announceList, schedules] = await Promise.all([
    getBandData(),
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
  ]);

  // TODO chedulesの中から、未来で、一番近い日付のものを取得
  const nextEvent = getNextSchedule(schedules.contents);
  // TODO 開催前のライブに絞り込む

  return (
    <div>
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-b from-black via-[#0f0f0f] to-[#1a1a1a]"
      >
        {/* SPがある場合はSPとPCで切り替え */}
        {bandData.heroImagesSp && bandData.heroImagesSp.length > 0 && (
          <>
            <img
              src={bandData.heroImagesSp[0].url}
              alt="Hero sp"
              className="w-full block md:hidden h-auto object-cover opacity-60 animate-[scale_20s_ease-in-out_infinite_alternate]"
            />
            <img
              src={bandData.heroImages[0].url}
              alt="Hero"
              className="w-full hidden md:block h-auto object-cover opacity-60 animate-[scale_20s_ease-in-out_infinite_alternate]"
            />
          </>
        )}
        {/* SPがない場合はPC画像で統一 */}
        {!bandData.heroImagesSp ||
          (bandData.heroImagesSp.length == 0 && (
            <img
              src={bandData.heroImages[0].url}
              alt="Hero"
              className="w-full h-auto object-cover opacity-60 animate-[scale_20s_ease-in-out_infinite_alternate]"
            />
          ))}
        <div className="absolute bottom-3 text-center w-full">
          <h1 className=" italic font-[math] mx-auto text-4xl md:text-8xl font-bold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
            {bandData.title}
          </h1>
          <p className="font-bold text-lg">{bandData.description}</p>
        </div>
      </section>
      {nextEvent && (
        <section>
          <div className="max-w-5xl mx-auto py-24 px-6">
            <div>Next LIVE!!</div>
            <h2 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-gray-200 to-white">
              {nextEvent.title}
            </h2>
            <div>
              {dateFormat(nextEvent.eventDetail.eventDate, "yyyy/MM/dd (EEE)")}
            </div>
          </div>
        </section>
      )}
      <section
        id="news"
        className="min-h-screen bg-gradient-to-b from-[#0d0d0d] via-[#1a0f1f] to-[#000000]"
      >
        <div className="max-w-5xl mx-auto py-24 px-6">
          <h2 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-gray-200 to-white">
            NEWS
          </h2>
          <AnnouncementList list={announceList.contents} />
        </div>
      </section>
      <section
        id="live"
        className="min-h-screen bg-gradient-to-b from-[#0d0d0d] via-[#1a0f1f] to-[#000000]"
      >
        <div className="max-w-5xl mx-auto py-24 px-6">
          <h2 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-gray-200 to-white">
            LIVE
          </h2>
          <EventList list={schedules.contents} />
        </div>
      </section>
      <section
        id="about"
        className="min-h-screen bg-gradient-to-b  from-[#000000] via-[#0f0f1a] to-[#1a0f0f]"
      >
        <div className="max-w-5xl mx-auto py-24 px-6">
          <h2 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-gray-200 to-white">
            ABOUT
          </h2>
          {/* バイオグラフィ */}
        </div>
      </section>
      <section
        id="videos"
        className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a0026] to-[#000000]"
      >
        <div className="max-w-5xl mx-auto py-24 px-6">
          <h2 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-gray-200 to-white">
            VIDEOS
          </h2>
          {/* 曲 */}
        </div>
      </section>
      <section
        id="contact"
        className="min-h-screen bg-gradient-to-b from-[#000000] via-[#111111] to-[#0d0d0d]"
      >
        <div className="max-w-5xl mx-auto py-24 px-6">
          <h2 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-gray-200 to-white">
            CONTACT
          </h2>
          <ContactForm schedules={schedules.contents} />
        </div>
      </section>
    </div>
  );
}
