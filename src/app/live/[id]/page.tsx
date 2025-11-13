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
    keywords: [
      name,
      "バンド",
      "インディーズバンド",
      "邦ロック",
      "ロック",
      detail.title,
    ],
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
            <SafeHTML html={detail.content} />
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
