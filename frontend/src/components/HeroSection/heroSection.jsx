import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Parallax transforms
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const watermarkOpacity = useTransform(scrollYProgress, [0, 0.5], [0.06, 0]);

  return (
    <section ref={ref} className="relative w-full h-screen overflow-hidden bg-neutral-950">
      {/* Parallax Video Background */}
      <motion.div
        style={{ y: videoY }}
        className="absolute inset-0 scale-110 origin-center"
      >
        <video
          src="https://res.cloudinary.com/dywydpgjg/video/upload/v1776570792/video2_urtttg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-black/30 to-neutral-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/50 via-transparent to-neutral-950/30" />
      </motion.div>

      Ethiopian Cross Watermark
      

      {/* Floating ambient particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-amber-400/40 pointer-events-none"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.7,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        />
      ))}

      {/* Main Content with parallax */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6"
      >
        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="h-px w-10 bg-amber-500" />
          <span className="text-amber-500 text-xs font-black tracking-[0.35em] uppercase">
            ኢትዮጵያ · Ethiopia
          </span>
          <div className="h-px w-10 bg-amber-500" />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tight leading-[0.9] mb-6 drop-shadow-2xl"
        >
          {t("hero.title1")}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-amber-700">
            {t("hero.title2")}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-2 text-base md:text-xl text-white/70 max-w-2xl leading-relaxed font-light tracking-wide"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 items-center"
        >
          <a
            href="/#destinations"
            className="group relative px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-full shadow-2xl shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:shadow-amber-500/50 text-sm tracking-widest uppercase"
          >
            {t("hero.exploreBtn")}
          </a>
          <Link
            to="/checkout"
            className="group px-8 py-4 border border-white/30 hover:border-amber-500 text-white hover:text-amber-400 font-bold rounded-full backdrop-blur-sm transition-all duration-300 text-sm tracking-widest uppercase"
          >
            {t("hero.bookBtn")}
          </Link>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="absolute bottom-16 flex gap-12 text-center"
        >
          {[
            { value: "9", label: t("hero.stat1") },
            { value: "80+", label: t("hero.stat2") },
            { value: "3000+", label: t("hero.stat3") },
          ].map((stat) => (
            <div key={stat.label} className="text-white">
              <div className="text-2xl md:text-3xl font-black text-amber-400">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-[9px] tracking-[0.3em] uppercase">{t("hero.scroll")}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-10 bg-gradient-to-b from-amber-500 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;