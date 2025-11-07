import { SafeHTML } from "@/components/SafeHtml";
import { client } from "@/lib/client";
import { getBandData } from "@/lib/client";
import { Announce } from "@/types/type";

export const revalidate = 600; // ISR: 10分ごとに再生成

export async function generateStaticParams() {
  const contents = await client.getAllContentIds({
    endpoint: "announcements",
    filters: "category[not_equals]live-event",
  });
  return contents.map((id) => ({
    id,
  }));
}

export async function generateMetadata() {
  const bandData = await getBandData();

  const name = bandData.title;
  const description = bandData.description;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const title = `${name}`;
  const sns = bandData.sns[0];

  return {
    title,
    description,
    keywords: [name, "バンド", "インディーズバンド", "邦ロック", "ロック"],
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

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NewsDetail({ params }: Props) {
  const { id } = await params;
  const detail = await client.getListDetail<Announce>({
    endpoint: "announcements",
    contentId: id,
    queries: {
      filters: "category[not_equals]live-event",
    },
  });

  return (
    <section id="news" className="min-h-full">
      <div className="max-w-5xl mx-auto py-24 px-6">
        <h1 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 via-gray-200 to-white">
          {detail.title}
        </h1>
        <div>
          <SafeHTML html={detail.content} />
        </div>
      </div>
    </section>
  );
}
