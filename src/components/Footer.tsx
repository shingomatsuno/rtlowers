import { SnsData } from "@/types/type";
import { FaXTwitter, FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa6";

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
        {/* 右側（SNSアイコン） */}
        <div className="flex gap-4 md:gap-6 items-center">
          {sns?.xAccount && (
            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <FaXTwitter size={24} />
            </a>
          )}
          {sns?.youtubeChannel && (
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <FaYoutube size={24} />
            </a>
          )}
          {sns?.instagramAccount && (
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <FaInstagram size={24} />
            </a>
          )}
          {sns?.ticktockAccount && (
            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <FaTiktok size={24} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
