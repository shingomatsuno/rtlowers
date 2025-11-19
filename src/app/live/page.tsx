import { EventList } from "@/components/EventList";
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
      fields: "id,title,eyecatch,eventDetail.eventDate",
      orders: "-eventDetail.eventDate",
    },
  });

  return (
    <section id="live-list" className="min-h-full">
      <div className="mx-auto max-w-5xl px-6 py-24">
        <h1 className="animate-fadeInUp mb-8 bg-gradient-to-r from-gray-200 via-gray-100 to-white bg-clip-text text-5xl font-bold text-transparent drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
          LIVE
        </h1>
        <div className="flex justify-center">
          <div className="w-full">
            {contents.length > 0 && <EventList list={contents} />}
            {contents.length == 0 && <p>ライブはありません</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
