import { AnnouncementList } from "@/components/AnnouncementList";
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
      <div className="mx-auto max-w-5xl px-6 py-24">
        <h1 className="animate-fadeInUp mb-8 bg-gradient-to-r from-gray-200 via-gray-100 to-white bg-clip-text text-5xl font-bold text-transparent drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
          NEWS
        </h1>
        <div className="flex justify-center">
          <div className="w-full">
            {contents.length > 0 && <AnnouncementList list={contents} />}
            {contents.length == 0 && <p>ニュースはありません</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
