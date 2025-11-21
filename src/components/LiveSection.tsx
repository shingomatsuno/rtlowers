"use client";

import { motion } from "framer-motion";
import { Live } from "@/types/type";
import Link from "next/link";
import { dateFormat } from "@/lib/date";
import { MapPin } from "lucide-react";

export const LiveSection = ({
  list,
}: {
  list: Pick<Live, "id" | "eyecatch" | "eventDetail" | "title">[];
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="flex flex-col gap-4"
    >
      {list.map((live) => (
        <motion.div key={live.id} variants={item}>
          <Link href={`/live/${live.id}`} className="group block">
            <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:border-purple-500/50 hover:bg-white/10 md:flex-row md:items-center">
              {/* Date Box */}
              <div className="flex shrink-0 flex-col items-center justify-center rounded-lg bg-black/40 p-4 text-center md:w-24">
                <span className="text-xs font-bold text-purple-400">
                  {dateFormat(live.eventDetail.eventDate, "yyyy")}
                </span>
                <span className="text-xl font-bold text-white">
                  {dateFormat(live.eventDetail.eventDate, "MM/dd")}
                </span>
                <span className="text-xs text-gray-400">
                  {dateFormat(live.eventDetail.eventDate, "EEE")}
                </span>
              </div>

              {/* Content */}
              <div className="flex-grow space-y-2">
                <h3 className="text-xl font-bold text-white transition-colors group-hover:text-purple-300">
                  {live.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{live.eventDetail.venue || "TBA"}</span>
                  </div>
                </div>
              </div>

              {/* Image (optional) */}
              {live.eyecatch && (
                <div className="hidden w-32 shrink-0 overflow-hidden rounded-lg md:block">
                  <img
                    src={live.eyecatch.url}
                    alt={live.title}
                    className="h-20 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              )}

              <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-purple-500 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};
