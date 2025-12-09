"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Live } from "@/types/type";
import Link from "next/link";
import { dateFormat } from "@/lib/date";
import { MapPin, Calendar, ArrowRight, X } from "lucide-react";
import { useState } from "react";

export const FeaturedLive = ({
  live,
}: {
  live: Pick<Live, "id" | "title" | "eyecatch" | "eventDetail">;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-900/90 to-black/90 p-1 shadow-[0_0_50px_rgba(0,255,255,0.1)] backdrop-blur-xl"
      >
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative flex flex-col gap-8 rounded-xl bg-black/40 p-8 md:flex-row md:items-center md:p-12">
          {/* Glow Effect */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-[100px]" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-500/20 blur-[100px]" />

          <div className="relative z-10 flex-grow space-y-6">
            <div className="inline-block rounded-full border border-cyan-500/50 bg-cyan-500/10 px-4 py-1 text-sm font-bold tracking-wider text-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.2)]">
              NEXT LIVE
            </div>

            <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">
              {live.title}
            </h2>

            <div className="flex flex-col gap-4 text-lg text-gray-300 md:flex-row md:gap-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-cyan-400" />
                <span>
                  {dateFormat(live.eventDetail.eventDate, "yyyy/MM/dd (EEE)")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-400" />
                <span>{live.eventDetail.venue}</span>
              </div>
            </div>

            <Link
              href={`/live/${live.id}`}
              className="group mt-4 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-lg font-bold text-black transition-all hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]"
            >
              VIEW DETAILS
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Image (if available) */}
          {live.eyecatch && (
            <div className="relative z-10 w-full shrink-0 md:w-1/3">
              <motion.div
                className="aspect-video w-full cursor-zoom-in overflow-hidden rounded-lg border border-white/10 shadow-2xl md:aspect-square"
                whileHover={{ scale: 1.05 }}
                onClick={() => setIsOpen(true)}
              >
                <img
                  src={live.eyecatch.url}
                  alt={live.title}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && live.eyecatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <div className="absolute inset-0 bg-black/80" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -right-4 -top-4 rounded-full bg-white p-2 text-black transition-colors hover:bg-cyan-400"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={live.eyecatch.url}
                alt={live.title}
                className="max-h-[85vh] w-auto rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
