import { NewsSection } from "@/components/NewsSection";
import { ScrollReveal } from "@/components/ScrollReveal";
import { client, getBandData } from "@/lib/client";
import { Announce } from "@/types/type";
export const revalidate = 60;

export async function generateMetadata() {
  const bandData = await getBandData();
  const name = bandData.title;
  const description = `${name}の最新ニュース・お知らせ一覧`;
  const siteUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com") + "/news";
  const title = `NEWS | ${bandData.metaTitle || name}`;
  const sns = bandData.sns;

  const images = bandData.heroImages.map((image, i) => ({
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
      "ニュース",
      "お知らせ",
      ...(bandData.keywords?.split(",") || []),
    ],
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: `${name}`,
      images: [...images],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [...images],
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

export default async function NewsPage() {
  const [bandData, { contents }] = await Promise.all([
    getBandData(),
    client.getList<Pick<Announce, "id" | "title" | "publishedAt">>({
      endpoint: "announcements",
      queries: {
        fields: "id,title,publishedAt",
        orders: "-publishedAt",
      },
    }),
  ]);

  return (
    <section id="news" className="min-h-full">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <ScrollReveal>
          <h1 className="mb-12 text-5xl font-black tracking-tighter text-white md:text-7xl">
            NEWS
            <span className="block text-lg font-normal tracking-widest text-cyan-500">
              ALL UPDATES
            </span>
          </h1>
        </ScrollReveal>

        {contents.length > 0 ? (
          <NewsSection list={contents} />
        ) : (
          <p className="text-gray-500">ニュースはありません</p>
        )}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `NEWS | ${bandData.metaTitle || bandData.title}`,
            description: `${bandData.title}の最新ニュース・お知らせ一覧`,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/news`,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: contents.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/news/${item.id}`,
                name: item.title,
              })),
            },
          }),
        }}
      />
    </section>
  );
}
