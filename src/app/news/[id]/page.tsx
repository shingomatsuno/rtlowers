import { LatestNews } from "@/components/LatestNews";
import { SafeHTML } from "@/components/SafeHtml";
import { client, getAnnounceDetail } from "@/lib/client";
import { getBandData } from "@/lib/client";

export const revalidate = 600; // ISR: 10分ごとに再生成
export const dynamic = "force-static";
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
    keywords: [name, title, ...(bandData.keywords?.split(",") || [])],
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
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="md:flex md:gap-6">
          <div className="mb-10 md:mb-0 md:flex-[1.5]">
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
            <SafeHTML html={detail.content} />
          </div>
          <div className="md:flex-1">
            <LatestNews />
          </div>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: detail.title,
            image: [detail.eyecatch?.url].filter(Boolean),
            datePublished: detail.publishedAt,
            dateModified: detail.updatedAt,
            author: {
              "@type": "Organization",
              name: "Rt.Lowers",
            },
          }),
        }}
      />
    </section>
  );
}
