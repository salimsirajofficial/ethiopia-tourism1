import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useTranslation } from "react-i18next";
import { RotateCcw } from 'lucide-react';

const shortVideos = [
  {
    src: "https://res.cloudinary.com/dywydpgjg/video/upload/v1776563937/video1_eyig4b.mp4",
    label: "Lalibela Rock Churches",
    location: "Amhara Region",
  },
  {
    src: "https://res.cloudinary.com/dywydpgjg/video/upload/v1776563974/video2_bq3cmy.mp4",
    label: "Simien Mountains",
    location: "Gondar",
  },
  {
    src: "https://res.cloudinary.com/dywydpgjg/video/upload/v1776563697/Video3_qlpsq0.mp4",
    label: "Omo Valley Tribes",
    location: "South Ethiopia",
  },
  {
    src: "https://res.cloudinary.com/dywydpgjg/video/upload/v1776563714/video4_jsshq5.mp4",
    label: "Danakil Depression",
    location: "Afar Region",
  },
  {
    src: "https://res.cloudinary.com/dywydpgjg/video/upload/v1776563698/video2_yydrhx.mp4",
    label: "Axum Obelisks",
    location: "Tigray Region",
  },
  {
    src: "https://res.cloudinary.com/dywydpgjg/video/upload/v1776563696/video1_gdhwzk.mp4",
    label: "Blue Nile Falls",
    location: "Bahir Dar",
  },
  {
    src: "https://res.cloudinary.com/dywydpgjg/video/upload/v1776563695/video3_mf2imu.mp4",
    label: "Harar Jugol",
    location: "East Ethiopia",
  },
];

/* ─── Phone Mockup ─────────────────────────────────────────── */
const PHONE_W = 260;
const PHONE_H = 543;

const PhoneMockup = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLandscape, setIsLandscape] = useState(false);
  const videoRef = useRef(null);

  const goTo = (newIndex) => {
    setDirection(newIndex > currentIndex ? 1 : -1);
    setCurrentIndex(newIndex);
  };

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % shortVideos.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + shortVideos.length) % shortVideos.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  // When landscape, the rotated phone's visual footprint swaps W and H.
  // We size the outer container to that footprint so it doesn't overlap siblings.
  const containerW = isLandscape ? PHONE_H : PHONE_W;
  const containerH = isLandscape ? PHONE_W + 52 : PHONE_H + 36;

  return (
    <div
      className="relative flex items-center justify-center origin-center"
      style={{
        width: `${containerW}px`,
        height: `${containerH}px`,
        transition: 'width 0.55s cubic-bezier(0.4,0,0.2,1), height 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.3s ease',
        transform: typeof window !== 'undefined' && window.innerWidth < 400 ? `scale(${window.innerWidth / 420})` : 'scale(1)',
      }}
    >
      {/* ── The ENTIRE phone rotates as one unit — frame + video together ── */}
      <motion.div
        animate={{ rotate: isLandscape ? -90 : 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 22 }}
        style={{ width: `${PHONE_W}px`, height: `${PHONE_H}px`, flexShrink: 0 }}
        className="relative rounded-[2.5rem] border-[6px] border-neutral-700 bg-black shadow-2xl shadow-black/60 overflow-hidden"
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 w-28 h-6 bg-black rounded-b-2xl" />

        {/* Video Carousel */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'tween', duration: 0.4, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <video
                ref={videoRef}
                src={shortVideos[currentIndex].src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Video Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-5 pb-8">
          <motion.div
            key={`info-${currentIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-amber-400 text-[9px] font-black tracking-[0.3em] uppercase mb-1">
              {shortVideos[currentIndex].location}
            </p>
            <h4 className="text-white text-lg font-black leading-tight">
              {shortVideos[currentIndex].label}
            </h4>
          </motion.div>
        </div>

        {/* Tap Zones */}
        <button onClick={prev} className="absolute left-0 top-0 bottom-0 w-1/3 z-20 cursor-pointer focus:outline-none" aria-label="Previous video" />
        <button onClick={next} className="absolute right-0 top-0 bottom-0 w-1/3 z-20 cursor-pointer focus:outline-none" aria-label="Next video" />

        {/* Progress Bars */}
        <div className="absolute top-8 left-3 right-3 z-30 flex gap-1">
          {shortVideos.map((_, i) => (
            <div key={i} className="flex-1 h-[2px] rounded-full bg-white/20 overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: i === currentIndex ? 1 : i < currentIndex ? 1 : 0 }}
                transition={{ duration: i === currentIndex ? 6 : 0.3, ease: i === currentIndex ? 'linear' : 'easeOut' }}
                style={{ transformOrigin: 'left' }}
              />
            </div>
          ))}
        </div>

        {/* Nav Arrows */}
        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/60 transition-all opacity-0 hover:opacity-100" aria-label="Previous">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/60 transition-all opacity-0 hover:opacity-100" aria-label="Next">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Home Bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/30 rounded-full z-30" />
      </motion.div>

      {/* ── Orientation Toggle — sits outside the phone, top-right corner ── */}
      <button
        onClick={() => setIsLandscape(!isLandscape)}
        title={isLandscape ? 'Switch to Portrait' : 'Switch to Landscape'}
        className="absolute -top-5 -right-5 z-50 w-10 h-10 rounded-full bg-neutral-800 border border-white/10 hover:border-amber-500/60 hover:bg-neutral-700 flex items-center justify-center text-white/60 hover:text-amber-400 shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <motion.div
          animate={{ rotate: isLandscape ? -90 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <RotateCcw className="w-4 h-4" />
        </motion.div>
      </button>

      {/* ── Pagination dots — anchored below container ── */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2">
        {shortVideos.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'bg-amber-500 scale-125' : 'bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to video ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

/* ─── Section ──────────────────────────────────────────────── */
const CinematicShorts = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const phoneY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const smoothPhoneY = useSpring(phoneY, { stiffness: 60, damping: 20 });
  const smoothTextY = useSpring(textY, { stiffness: 60, damping: 20 });

  return (
    <section
      id="shorts"
      ref={sectionRef}
      className="relative bg-neutral-950 overflow-hidden py-16 md:py-0"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center gap-16 md:gap-20 min-h-[80vh] md:min-h-screen">

        {/* Phone Mockup — side-by-side on desktop, first on mobile for engagement */}
        <motion.div
          style={{ y: smoothPhoneY }}
          className="flex w-full md:w-5/12 justify-center order-first md:order-first mt-0 md:mt-0"
        >
          <PhoneMockup />
        </motion.div>

        {/* Text Side */}
        <motion.div
          style={{ y: smoothTextY }}
          className="w-full md:w-7/12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-amber-500" />
            <span className="text-amber-500 text-[10px] font-black tracking-[0.35em] uppercase">
              {t("video.shorts.eyebrow")}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-8 tracking-tight">
            {t("video.shorts.title1")} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              {t("video.shorts.title2")}
            </span>
          </h2>

          <p className="text-neutral-400 text-lg md:text-xl leading-relaxed max-w-lg mb-10">
            {t("video.shorts.desc")}
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/60 text-xs font-semibold">7 Destinations</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-amber-400 text-xs font-bold">←  →</span>
              <span className="text-white/60 text-xs font-semibold">{t("video.shorts.tap")}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CinematicShorts;
