"use client";

import { motion } from "framer-motion";
import { BandData } from "@/types/type";

export const Hero = ({
  bandData,
}: {
  bandData: Pick<
    BandData,
    "title" | "description" | "heroImages" | "heroImagesSp"
  >;
}) => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Parallax/Zoom effect */}
      <div className="absolute inset-0 z-0">
        {!bandData.heroImagesSp[0] && bandData.heroImages[0] && (
          // スマホ画像なし
          <motion.img
            src={bandData.heroImages[0].url}
            alt="Hero Background"
            className="h-full w-full object-cover opacity-50"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        )}
        {bandData.heroImagesSp[0] && bandData.heroImages[0] && (
          <>
            <motion.img
              src={bandData.heroImagesSp[0].url}
              alt="Hero Background"
              className="block h-full w-full object-cover opacity-50 md:hidden"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
            <motion.img
              src={bandData.heroImages[0].url}
              alt="Hero Background"
              className="hidden h-full w-full object-cover opacity-50 md:block"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-[#0d0d0d]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-[math] text-6xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] md:text-9xl"
        >
          {bandData.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-4 text-lg font-light tracking-widest text-gray-300 md:text-2xl"
        >
          {bandData.description}
        </motion.p>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs uppercase tracking-widest text-gray-400">
              Scroll
            </span>
            <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-white to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
