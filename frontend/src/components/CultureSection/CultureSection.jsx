import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from "react-i18next";

const cultureItems = [
  {
    id: 1,
    title: "culture.items.coffee.title",
    amharic: "ቡና ቤት",
    label: "ምግብ · Origins",
    description: "culture.items.coffee.desc",
    detail: "45–90 min",
    image: "/assets/images/ethiopia/image6.jpg",
    accent: "from-amber-900/80",
    number: "01",
  },
  {
    id: 2,
    title: "culture.items.eskista.title",
    amharic: "እስኪስታ",
    label: "ጥበብ · Arts",
    description: "culture.items.eskista.desc",
    detail: "80+ Ethnic Groups",
    image: "/assets/images/ethiopia/image7.jpg",
    accent: "from-rose-900/80",
    number: "02",
  },
];

const CultureSection = () => {
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('.culture-card')?.offsetWidth || 400;
    el.scrollBy({ left: direction * (cardWidth + 24), behavior: 'smooth' });
  };

  return (
    <section id="culture" className="relative bg-neutral-900 py-24 md:py-32 overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.04]"
        style={{ backgroundImage: `url(/assets/images/ethiopia/image6.jpg)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-900/95 to-neutral-900" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-amber-500" />
              <span className="text-amber-500 text-[10px] font-black tracking-[0.35em] uppercase">{t("culture.eyebrow")}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.05]">
              {t("culture.title1")}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                {t("culture.title2")}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <p className="hidden lg:block text-neutral-400 max-w-sm text-right text-sm leading-relaxed">
              {t("culture.desc")}
            </p>

            {/* Navigation Arrows */}
            <div className="flex gap-3">
              <button
                onClick={() => scroll(-1)}
                disabled={!canScrollLeft}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  canScrollLeft
                    ? 'border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-black hover:border-amber-500'
                    : 'border-white/10 text-white/20 cursor-not-allowed'
                }`}
                aria-label="Previous"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll(1)}
                disabled={!canScrollRight}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  canScrollRight
                    ? 'border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-black hover:border-amber-500'
                    : 'border-white/10 text-white/20 cursor-not-allowed'
                }`}
                aria-label="Next"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrollable Track */}
        <div className="relative">
          {/* Left fade */}
          <div className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-neutral-900 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
          {/* Right fade */}
          <div className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-neutral-900 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {cultureItems.map((item, i) => (
              <CultureCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom: Explore All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <button className="group relative px-10 py-4 bg-transparent border border-white/15 rounded-full overflow-hidden transition-all hover:border-amber-500">
            <span className="relative z-10 text-white font-black tracking-[0.25em] uppercase text-xs group-hover:text-black transition-colors duration-300">
              {t("culture.allTraditions")}
            </span>
            <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

const CultureCard = ({ item, index }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="culture-card relative overflow-hidden rounded-3xl bg-neutral-800 border border-white/8 flex-shrink-0 group cursor-pointer"
      style={{
        width: 'clamp(300px, calc((100% - 48px) / 3), 440px)',
        height: 'clamp(420px, 55vh, 600px)',
        scrollSnapAlign: 'start',
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 group-hover:scale-100 transition-transform duration-700"
        style={{ backgroundImage: `url(${item.image})` }}
      />
      <div className={`absolute inset-0 bg-gradient-to-r ${item.accent} to-neutral-950/95`} />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/30 to-neutral-950/20" />

      {/* Big number */}
      <div className="absolute top-6 right-8 text-[7rem] font-black text-white/[0.04] leading-none select-none">
        {item.number}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-6 bg-amber-500" />
            <span className="text-amber-400 text-[9px] font-black tracking-[0.3em] uppercase">{item.label}</span>
          </div>

          <div className="backdrop-blur-md bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg inline-block mb-3">
            <span className="text-white/60 text-xs font-bold">{item.amharic}</span>
          </div>

          <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
            {t(item.title)}
          </h3>

          {/* Description — visible on hover */}
          <p className="text-neutral-300 text-sm leading-relaxed mb-4 max-w-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 line-clamp-3">
            {t(item.description)}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/40 text-[11px]">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {item.detail}
            </div>
            <button className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-amber-400 hover:text-amber-300 transition-colors opacity-0 group-hover:opacity-100 duration-300">
              {t("culture.learnMore")}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CultureSection;
