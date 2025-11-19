import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  videoId: string;
};

export default function YoutubeEmbed({ className, videoId }: Props) {
  return (
    <div
      className={cn(
        "relative h-0 w-full overflow-hidden rounded-2xl pb-[56.25%] shadow-lg",
        className
      )}
    >
      <iframe
        className="absolute left-0 top-0 h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
