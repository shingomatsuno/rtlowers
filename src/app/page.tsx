import { client, getBandData, getFutureLives } from "@/lib/client";
import { getNextSchedule } from "@/lib/date";
import { Announce, BandData, Live } from "@/types/type";
import Link from "next/link";
import { SafeHTML } from "@/components/SafeHtml";
import { Hero } from "@/components/Hero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { NewsSection } from "@/components/NewsSection";
import { LiveSection } from "@/components/LiveSection";
import { FeaturedLive } from "@/components/FeaturedLive";
import YoutubeEmbed from "@/components/YoutubeEmbed";
import { ContactForm } from "@/components/ContactForm";

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
          limit: 6,
        },
      }),
      client.getList<Pick<Live, "id" | "title" | "eyecatch" | "eventDetail">>({
        endpoint: "lives",
        queries: {
          fields: "id,title,eyecatch,eventDetail.eventDate",
          orders: "-eventDetail.eventDate",
        },
      }),
      getFutureLives(),
    ]);

  const nextEvent = getNextSchedule(schedules.contents);

  return (
    <div className="bg-black text-white selection:bg-cyan-500 selection:text-black">
      <section id="home">
        <Hero bandData={bandData} />
      </section>
      {nextEvent && (
        <section className="relative z-10 mt-20 px-6 pb-24">
          <FeaturedLive live={nextEvent} />
        </section>
      )}

      <section
        id="news"
        className="relative overflow-hidden bg-[#050505] py-24"
      >
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="mb-12 flex items-end justify-between">
              <h2 className="text-5xl font-black tracking-tighter text-white md:text-7xl">
                NEWS
                <span className="block text-lg font-normal tracking-widest text-cyan-500">
                  LATEST UPDATES
                </span>
              </h2>
              <Link
                href="/news"
                className="hidden text-sm font-bold tracking-widest text-gray-400 hover:text-white md:block"
              >
                VIEW ALL →
              </Link>
            </div>
          </ScrollReveal>

          {announceList.contents.length > 0 ? (
            <NewsSection list={announceList.contents} />
          ) : (
            <p className="text-gray-500">No news available.</p>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/news"
              className="text-sm font-bold tracking-widest text-gray-400 hover:text-white"
            >
              VIEW ALL →
            </Link>
          </div>
        </div>
      </section>

      <section
        id="live"
        className="relative overflow-hidden bg-[#0a0a0a] py-24"
      >
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="mb-12 flex items-end justify-between">
              <h2 className="text-5xl font-black tracking-tighter text-white md:text-7xl">
                LIVE
                <span className="block text-lg font-normal tracking-widest text-purple-500">
                  LIVE SCHEDULE
                </span>
              </h2>
              <Link
                href="/live"
                className="hidden text-sm font-bold tracking-widest text-gray-400 hover:text-white md:block"
              >
                VIEW ALL →
              </Link>
            </div>
          </ScrollReveal>

          {schedules.contents.length > 0 ? (
            <LiveSection list={schedules.contents} />
          ) : (
            <p className="text-gray-500">No lives scheduled.</p>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/live"
              className="text-sm font-bold tracking-widest text-gray-400 hover:text-white"
            >
              VIEW ALL →
            </Link>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="relative overflow-hidden bg-[#050505] py-24"
      >
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <h2 className="mb-16 text-center text-5xl font-black tracking-tighter text-white md:text-7xl">
              ABOUT
            </h2>
          </ScrollReveal>

          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <ScrollReveal className="relative">
              <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 mix-blend-overlay" />
                <img
                  src={aboutMovieData.about.image.url}
                  alt="Band"
                  className="w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-2xl border border-white/5 bg-white/5" />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="space-y-8">
                <div className="prose prose-invert prose-lg">
                  <SafeHTML html={aboutMovieData.about.bio} />
                </div>

                <div className="space-y-4 border-t border-white/10 pt-8">
                  <h3 className="text-sm font-bold tracking-widest text-gray-500">
                    MEMBERS
                  </h3>
                  <ul className="grid grid-cols-2 gap-4">
                    {aboutMovieData.about.members.map((m, i) => (
                      <li key={i} className="flex flex-col">
                        <span className="text-sm text-cyan-500">{m.part}</span>
                        <span className="text-lg font-bold text-white">
                          {m.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section
        id="music"
        className="relative overflow-hidden bg-[#0a0a0a] py-24"
      >
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <h2 className="mb-16 text-center text-5xl font-black tracking-tighter text-white md:text-7xl">
              MUSIC
            </h2>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-2">
            {aboutMovieData.movies.map((m, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl">
                  <YoutubeEmbed videoId={m.videoId} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="relative overflow-hidden bg-gradient-to-b from-[#050505] to-black py-24"
      >
        <div className="mx-auto max-w-4xl px-6">
          <ScrollReveal>
            <h2 className="mb-12 text-center text-5xl font-black tracking-tighter text-white md:text-7xl">
              CONTACT
            </h2>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-12">
              <ContactForm
                schedules={futureLives.contents}
                sns={bandData.sns}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            name: bandData.title,
            description: bandData.description,
            url: process.env.NEXT_PUBLIC_SITE_URL,
            image: bandData.heroImages.map((img) => img.url),
            sameAs: [
              bandData.sns?.xAccount &&
                `https://twitter.com/${bandData.sns.xAccount.replace("@", "")}`,
              bandData.sns?.instagramAccount &&
                `https://instagram.com/${bandData.sns.instagramAccount}`,
            ].filter(Boolean),
          }),
        }}
      />
    </div>
  );
}
