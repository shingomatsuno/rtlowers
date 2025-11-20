import { NewsSection } from "@/components/NewsSection";
import { ScrollReveal } from "@/components/ScrollReveal";
import { client } from "@/lib/client";
import { Announce } from "@/types/type";

export const metadata = {
  title: "NEWS | Rt.Lowers",
  description: "Rt.Lowersのニュース一覧",
};

export const revalidate = 600;

export default async function NewsPage() {
  const { contents } = await client.getList<
    Pick<Announce, "id" | "title" | "publishedAt">
  >({
    endpoint: "announcements",
    queries: {
      fields: "id,title,publishedAt",
      orders: "-publishedAt",
    },
  });

  return (
    <section id="news-list" className="min-h-full">
      <div className="mx-auto max-w-6xl px-6 py-24">
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
    </section>
  );
}
