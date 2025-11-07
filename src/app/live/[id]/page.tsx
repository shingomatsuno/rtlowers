import { ContactForm } from "@/components/ContactForm";
import { SafeHTML } from "@/components/SafeHtml";
import { client, getLiveDetail } from "@/lib/client";
import { getBandData } from "@/lib/client";
import { Live } from "@/types/type";

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
  const detail = await getLiveDetail(id);
  const { contents } = await client.getList<
    Pick<Live, "id" | "title" | "eyecatch" | "eventDetail">
  >({
    endpoint: "lives",
    queries: {
      fields: "id,title,eyecatch,eventDetail.eventDate",
      orders: "-eventDetail.eventDate",
      limit: 5,
    },
  });
  return (
    <section id="live" className="min-h-full">
      <div className="max-w-5xl mx-auto py-24 px-6">
        <h1 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-gray-200 to-white">
          {detail.title}
        </h1>
        <div>
          <SafeHTML html={detail.content} />
        </div>
        {/* TODO フォーム */}
        <div id="form">
          <ContactForm defaultScheduleId={id} schedules={contents} />
        </div>
        {/* TODO カレンダーを表示して、過去のライブもおえるようにする(別コンポーネント) */}
      </div>
    </section>
  );
}
