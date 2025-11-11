import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  videoId: string;
};

export default function YoutubeEmbed({ className, videoId }: Props) {
  return (
    <div
      className={cn(
        "relative w-full pb-[56.25%] h-0 overflow-hidden rounded-2xl shadow-lg",
        className
      )}
    >
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
