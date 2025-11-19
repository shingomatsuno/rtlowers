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
    <footer className="border-t border-white/10 py-4 md:py-8">
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-4 px-6 text-white/60 md:flex-row">
        {/* 左側（コピーライト） */}
        <p className="text-center md:text-left">
          &copy; 2025 {title}. All rights reserved.
        </p>
        {sns && <SnsIcons sns={sns} />}
      </div>
    </footer>
  );
}
