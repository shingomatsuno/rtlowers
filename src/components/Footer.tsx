import { SnsData } from "@/types/type";
import SnsIcons from "./SnsIcons";

export default function Footer({
  title,
  sns,
}: {
  title: string;
  sns?: SnsData;
}) {
  return (
    <footer className="border-t border-white/10 md:py-8 py-4">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row justify-between items-center text-white/60 gap-4">
        {/* 左側（コピーライト） */}
        <p className="text-center md:text-left">
          &copy; 2025 {title}. All rights reserved.
        </p>
        {sns && <SnsIcons sns={sns} />}
      </div>
    </footer>
  );
}
