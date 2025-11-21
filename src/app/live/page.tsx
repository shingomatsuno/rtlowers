import { LiveSection } from "@/components/LiveSection";
import { ScrollReveal } from "@/components/ScrollReveal";
import { client } from "@/lib/client";
import { Live } from "@/types/type";

export const metadata = {
  title: "LIVE | Rt.Lowers",
  description: "Rt.Lowersのライブ一覧",
};

export const revalidate = 600;

export default async function LivePage() {
  const { contents } = await client.getList<
    Pick<Live, "id" | "title" | "eyecatch" | "eventDetail">
  >({
    endpoint: "lives",
    queries: {
      fields: "id,title,eyecatch,eventDetail.eventDate,eventDetail.venue",
      orders: "-eventDetail.eventDate",
    },
  });

  return (
    <section id="live" className="min-h-full">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <ScrollReveal>
          <h1 className="mb-12 text-5xl font-black tracking-tighter text-white md:text-7xl">
            LIVE
            <span className="block text-lg font-normal tracking-widest text-purple-500">
              LIVE SCHEDULE
            </span>
          </h1>
        </ScrollReveal>

        {contents.length > 0 ? (
          <LiveSection list={contents} />
        ) : (
          <p className="text-gray-500">ライブはありません</p>
        )}
      </div>
    </section>
  );
}
