import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from "react-i18next";

const CinematicShowcase = () => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale  = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const textY  = useTransform(scrollYProgress, [0, 1], [100, -100]);

  // Text enters fully visible, then gently fades to ~12% so the video shines through.
  // It never hits zero — just subtle enough that the video is the star.
  const textOpacity = useTransform(
    scrollYProgress,
    [0,   0.15, 0.35, 0.60, 0.85, 1],
    [0,   1,    1,    0.12, 0.12, 0]
  );

  return (
    <section
      ref={containerRef}
      className="relative h-[85vh] md:h-screen w-full overflow-hidden bg-black"
    >
      {/* Background Video */}
      <motion.div
        style={{ y: videoY, scale, opacity }}
        className="absolute inset-0 w-full h-full"
      >
        <video
          src="https://res.cloudinary.com/dywydpgjg/video/upload/v1776570542/video3_ibkmsm.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Content — fades to ghost so the video is clearly seen */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        <motion.div 
          initial={{ y: 80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="max-w-4xl"
        >
          <motion.div
            style={{ y: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : textY }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] md:leading-none mb-8 uppercase italic">
              {t("video.showcase.title1")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-600">
                {t("video.showcase.title2")}
              </span>
            </h2>
            <div className="flex items-center justify-center gap-4 md:gap-6">
              <div className="h-px w-6 md:w-12 bg-amber-500/50" />
              <p className="text-amber-500 text-xs md:text-base font-black tracking-[0.3em] md:tracking-[0.5em] uppercase whitespace-nowrap">
                ኢትዮጵያ · {t("video.showcase.awaits")}
              </p>
              <div className="h-px w-6 md:w-12 bg-amber-500/50" />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-neutral-900 to-transparent z-20" />
    </section>
  );
};

export default CinematicShowcase;
