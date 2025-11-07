import "../index.css";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { getBandData } from "@/lib/client";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bandData = await getBandData();

  return (
    <html lang="ja">
      <body>
        <div className="bg-black text-white flex flex-col min-h-screen">
          <Header title={bandData.title} />
          <main className="pt-[64px] flex-grow bg-gradient-to-b from-[#0d0d0d] via-[#1a0f1f] to-[#000000]">
            {children}
          </main>
          <Footer title={bandData.title} sns={bandData.sns} />
        </div>
      </body>
    </html>
  );
}
