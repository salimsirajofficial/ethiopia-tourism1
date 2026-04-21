import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ShieldCheck, HeartPulse, Compass, Star, Award, Globe } from 'lucide-react';
import { useTranslation } from "react-i18next";

const features = [
  {
    icon: Compass,
    title: "about.features.guides.title",
    text: "about.features.guides.text"
  },
  {
    icon: ShieldCheck,
    title: "about.features.safe.title",
    text: "about.features.safe.text"
  },
  {
    icon: HeartPulse,
    title: "about.features.sustainable.title",
    text: "about.features.sustainable.text"
  },
  {
    icon: Globe,
    title: "about.features.exp.title",
    text: "about.features.exp.text"
  },
];

const AboutSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  const { scrollYProgress: sectionScroll } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: imgScroll } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  // Parallax on the main image
  const imgY = useTransform(imgScroll, [0, 1], ["-12%", "12%"]);
  const smoothImgY = useSpring(imgY, { stiffness: 60, damping: 20 });

  // Parallax on floating accent card
  const cardY = useTransform(sectionScroll, [0, 1], [30, -30]);
  const smoothCardY = useSpring(cardY, { stiffness: 60, damping: 20 });

  // Background glow parallax
  const glowY = useTransform(sectionScroll, [0, 1], ["0%", "30%"]);

  // Award badge hover parallax
  const awardY = useSpring(useTransform(sectionScroll, [0, 1], [-20, 20]), { stiffness: 60, damping: 20 });

  return (
    <section id="about" ref={sectionRef} className="relative py-36 bg-neutral-950 overflow-hidden">
      {/* Animated ambient glow */}
      <motion.div
        style={{ y: glowY }}
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/6 rounded-full blur-[120px] pointer-events-none -translate-x-1/3"
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/4 rounded-full blur-3xl pointer-events-none translate-x-1/3" />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(245,158,11,0.07) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 xl:gap-32 items-center">

          {/* ── Left: Image stack with parallax ── */}
          <div ref={imageRef} className="w-full lg:w-1/2 relative flex-shrink-0">
            {/* Main portrait image with parallax */}
            <div className="relative mx-auto max-w-md lg:max-w-full overflow-hidden rounded-3xl shadow-2xl"
              style={{ height: "560px" }}
            >
              <motion.div
                style={{
                  y: smoothImgY,
                  backgroundImage: `url(https://res.cloudinary.com/dywydpgjg/image/upload/v1776567610/image6_hqs9f9.jpg)`,
                }}
                className="absolute inset-0 bg-cover bg-center scale-115"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />

              {/* Trust badge overlay */}
              <motion.div
                style={{ y: smoothCardY }}
                className="absolute bottom-8 left-8 right-8 backdrop-blur-xl bg-neutral-950/70 border border-white/10 p-6 rounded-2xl shadow-2xl"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-white/40 text-xs ml-2">{t("about.review.rating")}</span>
                </div>
                <p className="text-white font-bold text-sm leading-snug">
                  "{t("about.review.text")}"
                </p>
                <p className="text-neutral-500 text-xs mt-2">— {t("about.review.author")}</p>
              </motion.div>
            </div>

            {/* Floating accent — award badge */}
            <motion.div
              style={{ y: awardY }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -top-6 -right-4 md:right-4 bg-amber-500 text-black rounded-2xl p-4 shadow-2xl shadow-amber-500/30 flex flex-col items-center justify-center w-28 h-28"
            >
              <Award className="w-8 h-8 mb-1" />
              <div className="text-[10px] font-black text-center uppercase tracking-wider leading-tight">
                {t("about.award")}
              </div>
            </motion.div>
          </div>

          {/* ── Right: Content ── */}
          <div className="w-full lg:w-1/2">
            {/* Eye­brow */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-px w-8 bg-amber-500" />
              <span className="text-amber-500 text-[11px] font-black tracking-[0.35em] uppercase">
                {t("about.eyebrow")}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-[1.05]"
            >
              {t("about.title1")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                {t("about.title2")}
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-neutral-400 text-lg mb-12 leading-relaxed"
            >
              {t("about.desc")}
            </motion.p>

            {/* Feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {features.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.08 }}
                  className="group p-5 rounded-2xl bg-neutral-900 border border-white/5 hover:border-amber-500/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors duration-300">
                    <feat.icon className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-white font-black text-base mb-2">{t(feat.title)}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">{t(feat.text)}</p>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex gap-4 flex-wrap"
            >
              <button className="group relative px-8 py-4 bg-white hover:bg-amber-50 text-black font-black rounded-full shadow-lg transition-all hover:scale-105 text-sm uppercase tracking-widest">
                {t("about.btnTeam")}
              </button>
              <button className="group px-8 py-4 border border-white/15 hover:border-amber-500 text-white hover:text-amber-400 font-bold rounded-full transition-all text-sm uppercase tracking-widest">
                {t("about.btnStory")}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
