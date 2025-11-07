import { AnnouncementList } from "@/components/AnnouncementList";
import { EventList } from "@/components/EventList";
import { ContactForm } from "@/components/form/ContactForm";
import { client, getBandData } from "@/lib/client";
import { getNextSchedule } from "@/lib/date";
import { Announce } from "@/types/type";

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
    client.getList<Announce>({
      endpoint: "announcements",
      queries: {
        filters: "category[not_equals]live-event",
        orders: "-publishedAt",
        limit: 5,
      },
    }),
    client.getList<Announce>({
      endpoint: "announcements",
      queries: {
        fields: "id,title,eyecatch,eventDetail.eventDate",
        filters: "category[equals]live-event",
        orders: "-eventDetail.eventDate",
        limit: 5,
      },
    }),
    client.getList<Announce>({
      endpoint: "announcements",
      queries: {
        fields: "id,title,eyecatch,eventDetail.eventDate",
        filters: "category[equals]live-event",
        orders: "-eventDetail.eventDate",
        limit: 5,
      },
    }),
  ]);

  // TODO chedulesの中から、未来で、一番近い日付のものを取得
  // const nextEvent = getNextSchedule(schedules.contents);
  // TODO 開催前のライブに絞り込む

  return (
    <div>
      <section
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-[#0f0f0f] to-[#1a1a1a]"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black z-10" />
        <img
          src={bandData.heroImages[0].url}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-60 animate-[scale_20s_ease-in-out_infinite_alternate]"
        />
        <div className="relative z-20 text-center px-6">
          <h1 className="text-7xl md:text-9xl font-bold mb-6 tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
            {bandData.title}
          </h1>
        </div>

        {/* TODO */}
        {/* {nextEvent && <div>{nextEvent.title}</div>} */}
      </section>
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
        id="schedule"
        className="min-h-screen bg-gradient-to-b from-[#0d0d0d] via-[#1a0f1f] to-[#000000]"
      >
        <div className="max-w-5xl mx-auto py-24 px-6">
          <h2 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-gray-200 to-white">
            SCHEDULE
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/2 w-full">
              {/* お問い合わせ */}
              <ContactForm schedules={schedules.contents} />
            </div>
            <div>TODO</div>
          </div>
        </div>
      </section>
    </div>
  );
}
