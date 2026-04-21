import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Clock, Users, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import api from '../../api/axios';

// Data will be fetched from API
const stats = [
  { value: 9, suffix: "", label: "hero.stat1" },
  { value: 80, suffix: "+", label: "hero.stat2" },
  { value: 3000, suffix: "+", label: "hero.stat3" },
  { value: 98, suffix: "%", label: "tours.stats.satisfaction" },
];

// Animated counter
const Counter = ({ value, suffix, label }) => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    const interval = duration / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-black text-amber-400 tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-neutral-500 text-xs font-medium mt-2 uppercase tracking-widest max-w-[120px] mx-auto leading-tight">
        {t(label)}
      </div>
    </motion.div>
  );
};

const TourCard = ({ tour, index }) => {
  const { t } = useTranslation();
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const difficultyColor = {
    Easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    Moderate: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Challenging: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className="group bg-neutral-900 rounded-3xl overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all duration-500 flex flex-col"
    >
      {/* Image with parallax */}
      <div className="relative h-60 overflow-hidden flex-shrink-0">
        <motion.div
          style={{ y: imgY, backgroundImage: `url(${tour.image})` }}
          className="absolute inset-0 bg-cover bg-center scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-black/10 to-transparent" />

        {/* Tags */}
        <div className="absolute top-5 left-5 flex gap-2 z-10">
          {tour.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-xs font-semibold text-white">
              {tag}
            </span>
          ))}
        </div>

        {/* Difficulty badge */}
        <div className="absolute top-5 right-5 z-10">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${difficultyColor[tour.difficulty]}`}>
            {tour.difficulty}
          </span>
        </div>

        {/* Subtitle overlay */}
        <div className="absolute bottom-5 left-5 z-10">
          <p className="text-amber-400/80 text-[10px] font-black tracking-[0.25em] uppercase">{tour.subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-7 flex flex-col flex-1">
        <h3 className="text-2xl font-black text-white mb-1 group-hover:text-amber-400 transition-colors duration-300">
          {tour.title}
        </h3>
        <p className="text-amber-500/70 text-xs font-bold uppercase tracking-widest mb-5">{tour.highlight}</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-neutral-400">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <span className="text-sm">{tour.duration}</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-400">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Users className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <span className="text-sm">{tour.groupSize}</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-400">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <span className="text-sm">{tour.location}</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between pt-5 border-t border-white/5">
          <div>
            <span className="text-neutral-500 text-[10px] uppercase tracking-wider block mb-0.5">{t("common.from")}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white">{tour.price}</span>
              <span className="text-neutral-500 text-xs">{t("common.person")}</span>
            </div>
          </div>
          <Link to="/checkout">
            <button className="group/btn relative px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 uppercase tracking-widest overflow-hidden">
              {t("Book Now")}
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const TourSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const { data } = await api.get('/tourism/tours');
        setTours(data);
      } catch (err) {
        console.error('Failed to fetch tours:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTours();
  }, []);

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  // Limit to first 3 for homepage
  const displayTours = tours.slice(0, 3);

  return (
    <section id="tours" ref={sectionRef} className="relative py-32 bg-neutral-950 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle pattern */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none opacity-30"
      >
        <div className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(245,158,11,0.08) 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 py-12 border-y border-white/5"
        >
          <Counter value={9} suffix="" label={t("hero.stat1")} />
          <Counter value={80} suffix="+" label={t("hero.stat2")} />
          <Counter value={3000} suffix="+" label={t("hero.stat3")} />
          <Counter value={98} suffix="%" label={t("tours.stats.satisfaction")} />
        </motion.div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-amber-500" />
              <span className="text-amber-500 text-xs font-black tracking-[0.35em] uppercase">
                {t("tours.eyebrow")}
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none mb-8">
              {t("hero.title1")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-800">
                {t("tours.all.title2")}
              </span>
            </h2>
          </div>
          <div className="flex flex-col items-end gap-4">
            <p className="text-neutral-400 max-w-sm text-right text-sm leading-relaxed">
              {t("tours.desc")}
            </p>
            <Link to="/tours">
              <button className="group relative px-7 py-3 border border-white/15 rounded-full overflow-hidden hover:border-amber-500 transition-colors">
                <span className="relative z-10 text-white font-black tracking-widest uppercase text-xs group-hover:text-black transition-colors duration-300">
                  {t("tours.viewAll")}
                </span>
                <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full py-20 flex justify-center">
              <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            </div>
          ) : (
            displayTours.map((tour, index) => (
              <TourCard
                key={tour.id}
                tour={{
                  ...tour,
                  price: `$${tour.basePrice}`,
                  priceNote: "/ person",
                  tags: Array.isArray(tour.tags) ? tour.tags : []
                }}
                index={index}
              />
            ))
          )}
        </div>

        {/* Bottom banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 relative rounded-3xl overflow-hidden bg-neutral-900 border border-white/5 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{ backgroundImage: "url(/assets/images/ethiopia/image1.jpg)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-neutral-900/40" />

          <div className="relative z-10 max-w-lg">
            <p className="text-neutral-400 font-bold mb-8 max-w-sm mx-auto md:mx-0">
              {t("tours.banner.title")}
            </p>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {t("tours.banner.desc")}
            </p>
          </div>

          <div className="relative z-10 flex gap-4 flex-shrink-0">
            <Link to="/checkout">
              <button className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-full transition-all hover:scale-105">
                {t("tours.banner.btn")}
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TourSection;
