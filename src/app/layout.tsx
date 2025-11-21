import "../index.css";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { getBandData } from "@/lib/client";

export const runtime = "edge";

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
  ),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bandData = await getBandData();

  return (
    <html lang="ja">
      <body>
        <div className="flex min-h-screen flex-col bg-black text-white">
          <Header title={bandData.title} />
          <main className="flex-grow bg-gradient-to-b from-[#0d0d0d] via-[#1a0f1f] to-[#000000] pt-[64px]">
            {children}
          </main>
          <Footer title={bandData.title} sns={bandData.sns} />
        </div>
      </body>
    </html>
  );
}
