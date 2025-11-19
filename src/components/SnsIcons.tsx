import { SnsData } from "@/types/type";
import { FaXTwitter, FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa6";

export default function SnsIcons({ sns }: { sns: SnsData }) {
  return (
    <div className="flex items-center gap-4 md:gap-6">
      {sns.xAccount && (
        <a
          href={`https://x.com/${sns.xAccount}`}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-white"
        >
          <FaXTwitter size={24} />
        </a>
      )}
      {sns.youtubeChannel && (
        <a
          href={`https://www.youtube.com/${sns.youtubeChannel}`}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-white"
        >
          <FaYoutube size={24} />
        </a>
      )}
      {sns.instagramAccount && (
        <a
          href={`https://www.instagram.com/${sns.instagramAccount}`}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-white"
        >
          <FaInstagram size={24} />
        </a>
      )}
      {sns.tiktokAccount && (
        <a
          href={`https://www.tiktok.com/${sns.tiktokAccount}`}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-white"
        >
          <FaTiktok size={24} />
        </a>
      )}
    </div>
  );
}
