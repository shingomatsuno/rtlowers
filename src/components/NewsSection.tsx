"use client";

import { motion } from "framer-motion";
import { Announce } from "@/types/type";
import Link from "next/link";
import { dateFormat, isNew } from "@/lib/date";
import { ArrowRight } from "lucide-react";

export const NewsSection = ({
  list,
}: {
  list: Pick<Announce, "id" | "publishedAt" | "title">[];
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      {list.map((news) => (
        <motion.div key={news.id} variants={item}>
          <Link href={`/news/${news.id}`} className="group block h-full">
            <div className="relative h-full overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(0,255,255,0.1)]">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  {news.publishedAt ? dateFormat(news.publishedAt) : ""}
                </span>
                {news.publishedAt && isNew(news.publishedAt) && (
                  <span className="rounded-full border border-cyan-500/50 bg-cyan-500/20 px-2 py-0.5 text-xs font-bold text-cyan-400">
                    NEW
                  </span>
                )}
              </div>
              <h3 className="mb-4 line-clamp-2 text-lg font-bold text-white transition-colors group-hover:text-cyan-300">
                {news.title}
              </h3>
              <div className="absolute bottom-4 right-4 translate-x-2 transform opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                <ArrowRight className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};
