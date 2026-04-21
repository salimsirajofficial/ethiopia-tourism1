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

  // Parallax elements
  const videoY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[80vh] md:h-screen w-full overflow-hidden bg-black"
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
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
           style={{ y: textY }}
           className="max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none mb-8 uppercase italic">
              {t("video.showcase.title1")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-600">
                {t("video.showcase.title2")}
              </span>
            </h2>
            <div className="flex items-center justify-center gap-6">
              <div className="h-px w-12 bg-amber-500/50" />
              <p className="text-amber-500 text-sm md:text-base font-black tracking-[0.5em] uppercase">
                ኢትዮጵያ · {t("video.showcase.awaits")}
              </p>
              <div className="h-px w-12 bg-amber-500/50" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Ambient particles or glow */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-neutral-900 to-transparent z-20" />
    </section>
  );
};

export default CinematicShowcase;
