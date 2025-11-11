import { SnsData } from "@/types/type";
import { FaXTwitter, FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa6";

export default function SnsIcons({ sns }: { sns: SnsData }) {
  return (
    <div className="flex gap-4 md:gap-6 items-center">
      {sns.xAccount && (
        <a
          href="https://x.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          <FaXTwitter size={24} />
        </a>
      )}
      {sns.youtubeChannel && (
        <a
          href="https://www.youtube.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          <FaYoutube size={24} />
        </a>
      )}
      {sns.instagramAccount && (
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          <FaInstagram size={24} />
        </a>
      )}
      {sns.tiktokAccount && (
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
  );
}
