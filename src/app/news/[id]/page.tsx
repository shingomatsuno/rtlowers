import { LatestNews } from "@/components/LatestNews";
import { SafeHTML } from "@/components/SafeHtml";
import { client, getAnnounceDetail } from "@/lib/client";
import { getBandData } from "@/lib/client";

export const revalidate = 600; // ISR: 10分ごとに再生成

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const contents = await client.getAllContentIds({
    endpoint: "announcements",
  });
  return contents.map((id) => ({
    id,
  }));
}

export async function generateMetadata({ params }: Props) {
  const bandData = await getBandData();
  const { id } = await params;
  const detail = await getAnnounceDetail(id);
  const name = bandData.title;
  const description = bandData.description;
  const siteUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com") + `/news/${id}`;
  const title = `${detail.title} | ${name}`;
  const sns = bandData.sns;

  const image = detail.eyecatch?.url
    ? [detail.eyecatch.url]
    : bandData.heroImages.map((image, i) => ({
        url: image.url,
        width: image.width,
        height: image.height,
        alt: `${name} ${i + 1}`,
      }));

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
      images: [...image],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [...image],
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

export default async function NewsDetail({ params }: Props) {
  const { id } = await params;
  const detail = await getAnnounceDetail(id);

  return (
    <section id="news" className="min-h-full">
      <div className="max-w-5xl mx-auto py-24 px-6">
        <div className="md:flex md:gap-6 ">
          <div className="md:flex-[1.5] mb-10 md:mb-0">
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
          <div className="md:flex-1">
            <LatestNews />
          </div>
        </div>
      </div>
    </section>
  );
}
