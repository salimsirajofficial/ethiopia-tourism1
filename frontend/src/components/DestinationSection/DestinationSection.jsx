import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { useTranslation } from "react-i18next";

const staticDestinations = [
  {
    id: 1,
    title: "destinations.items.lalibela.title",
    amharic: "ላሊበላ",
    region: "destinations.items.lalibela.region",
    description: "destinations.items.lalibela.desc",
    image: "/assets/images/ethiopia/image1.jpg",
    tag: "destinations.items.lalibela.tag",
    color: "from-amber-900/80",
    bestTime: "destinations.items.lalibela.season",
    duration: "destinations.items.lalibela.duration",
  }
];

// Individual card with its own scroll-linked parallax
const ParallaxCard = ({ dest, index, isFeature, onClick, isFavorite, onToggleFav }) => {
  const { t } = useTranslation();
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "15%"]);
  const smoothY = useSpring(imgY, { stiffness: 80, damping: 20 });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.08 }}
      onClick={() => onClick(dest)}
      className="group relative overflow-hidden rounded-3xl cursor-pointer border border-white/5 hover:border-amber-500/40 transition-colors duration-500 bg-neutral-900 h-full w-full"
    >
      {/* Parallax image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center w-full h-full"
        style={{ backgroundImage: `url(${dest.image})`, y: smoothY, scale: 1.15 }}
      />

      {/* Gradient overlays */}
      <div className={`absolute inset-0 bg-gradient-to-t ${dest.color} via-transparent to-transparent`} />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-90" />

      {/* Top badges — fade out on hover to avoid collision with bottom content */}
      <div className="absolute top-5 left-5 right-5 z-20 flex justify-between items-start transition-opacity duration-300 group-hover:opacity-0">
        <div className="backdrop-blur-md bg-black/30 border border-white/10 px-3 py-1.5 rounded-xl">
          <span className="text-white/70 text-[10px] font-bold tracking-[0.25em] uppercase">{dest.amharic}</span>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="bg-amber-500 text-black text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-xl">
            {t(dest.tag)}
          </span>
          <button 
            onClick={(e) => onToggleFav(e, dest.id)}
            className="p-2 backdrop-blur-md bg-black/30 border border-white/10 rounded-full hover:bg-black/50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isFavorite ? "#f59e0b" : "none"} stroke={isFavorite ? "#f59e0b" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-colors"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </button>
        </div>
      </div>

      {/* Bottom content — slides up on hover */}
      <div className="absolute bottom-0 left-0 w-full z-20 p-6">
        <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <div className="text-[9px] text-amber-400/80 uppercase tracking-[0.25em] font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {t(dest.region)}
          </div>
          <h3 className={`font-black text-white mb-1 leading-tight ${isFeature ? "text-4xl md:text-5xl" : "text-2xl"}`}>
            {t(dest.title)}
          </h3>
          <p className="text-neutral-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-400 delay-100 line-clamp-3 max-w-sm mb-4">
            {t(dest.description)}
          </p>
          {/* Stats row */}
          <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 mb-4">
            <span className="flex items-center gap-1.5 text-white/60 text-[11px]">
              <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t(dest.bestTime)}
            </span>
            <span className="flex items-center gap-1.5 text-white/60 text-[11px]">
              <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t(dest.duration)}
            </span>
          </div>
          <button className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-black bg-amber-500 hover:bg-amber-400 px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200">
            {t("destinations.explore")}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tibeb accent bar on hover */}
      <div className="absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 transition-all duration-700 z-30" />
    </motion.div>
  );
};

// Detail Modal
const DestinationModal = ({ destination, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  if (!destination) return null;
  const handlePlanVisit = () => {
    navigate('/checkout', { state: { destinationCode: destination.code } });
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-72 md:h-96 overflow-hidden rounded-t-3xl">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${destination.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="absolute bottom-6 left-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-amber-500 text-xs font-black tracking-widest uppercase">{t(destination.tag)}</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="text-white/50 text-xs">{t(destination.region)}</span>
            </div>
            <h2 className="text-5xl font-black text-white leading-tight">{t(destination.title)}</h2>
            <p className="text-amber-400/80 font-bold text-lg mt-1">{destination.amharic}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 md:p-10 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <p className="text-neutral-300 text-base leading-relaxed mb-6">{t(destination.description)}</p>
            <div className="flex gap-4 flex-wrap">
              <button 
                onClick={handlePlanVisit}
                className="px-6 py-3 bg-amber-500 text-black font-black rounded-full hover:bg-amber-400 transition-colors"
              >
                {t("common.planVisit")}
              </button>
              <Link to={`/destinations/${destination.id}`} className="px-6 py-3 border border-white/20 text-white font-bold rounded-full hover:border-amber-500 hover:text-amber-400 transition-colors inline-block">
                {t("common.viewFull")}
              </Link>
            </div>
          </div>
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
            <h3 className="text-white font-black text-sm uppercase tracking-widest mb-4">{t("common.quickFacts")}</h3>
            {[
              [t("common.bestTime"), t(destination.bestTime)],
              [t("common.duration"), t(destination.duration)],
              [t("common.region"), t(destination.region)],
              [t("common.category"), t(destination.tag)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <span className="text-neutral-500">{k}</span>
                <span className="text-white font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DestinationSection = () => {
  const { t } = useTranslation();
  const [destinations, setDestinations] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [selected, setSelected] = useState(null);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headerY = useTransform(scrollYProgress, [0, 0.2], [40, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await api.get('/tourism/destinations');
        setDestinations(data);
        
        // Attempt to fetch favorites if logged in (token exists)
        if (localStorage.getItem('token')) {
          const favObj = await api.get('/tourism/favorites');
          const favSet = new Set(favObj.data.map(f => f.destinationId));
          setFavorites(favSet);
        }
      } catch (err) {
        console.error('Failed to load destinations:', err);
      }
    };
    loadData();
  }, []);

  const toggleFavorite = async (e, destId) => {
    e.stopPropagation();
    try {
      const { data } = await api.post(`/tourism/favorites/toggle/${destId}`);
      setFavorites(prev => {
        const next = new Set(prev);
        if (data.isFavorite) next.add(destId);
        else next.delete(destId);
        return next;
      });
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Please log in to add favorites.");
      }
    }
  };

  const sourceList = destinations.length > 0 ? destinations : staticDestinations;
  const displayList = sourceList.slice(0, 6);

  return (
    <section id="destinations" ref={sectionRef} className="py-32 bg-neutral-950 relative overflow-hidden">
      {/* Atmospheric background glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Ge'ez watermarks */}
      <div className="absolute top-0 -left-20 text-[22rem] font-black text-white/[0.018] pointer-events-none select-none leading-none rotate-12 overflow-hidden">
        ኢትዮጵያ
      </div>
      <div className="absolute bottom-0 -right-10 text-[16rem] font-black text-white/[0.018] pointer-events-none select-none leading-none -rotate-6">
        ቅርስ
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        {/* Section Header with scroll-linked entrance */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-amber-500" />
              <span className="text-amber-500 text-[11px] font-black tracking-[0.35em] uppercase">{t("destinations.eyebrow")}</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.05]">
              {t("destinations.title1")}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                {t("destinations.title2")}
              </span>
            </h2>
          </div>
          <p className="text-neutral-400 text-lg max-w-md lg:text-right leading-relaxed">
            {t("destinations.desc")}
          </p>
        </motion.div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px]">
          {/* Feature card — Lalibela spans 2 rows */}
          <div className="lg:row-span-2 lg:col-span-1">
            {displayList[0] && <ParallaxCard dest={displayList[0]} index={0} isFeature={true} onClick={setSelected} isFavorite={favorites.has(displayList[0].id)} onToggleFav={toggleFavorite} />}
          </div>

          {/* Top row right */}
          <div className="lg:col-span-1">
            {displayList[1] && <ParallaxCard dest={displayList[1]} index={1} isFeature={false} onClick={setSelected} isFavorite={favorites.has(displayList[1].id)} onToggleFav={toggleFavorite} />}
          </div>
          <div className="lg:col-span-1">
            {displayList[2] && <ParallaxCard dest={displayList[2]} index={2} isFeature={false} onClick={setSelected} isFavorite={favorites.has(displayList[2].id)} onToggleFav={toggleFavorite} />}
          </div>

          {/* Middle row wide — Gondar */}
          <div className="lg:col-span-2">
            {displayList[3] && <ParallaxCard dest={displayList[3]} index={3} isFeature={false} onClick={setSelected} isFavorite={favorites.has(displayList[3].id)} onToggleFav={toggleFavorite} />}
          </div>

          {/* Row 3 */}
          <div className="lg:col-span-1">
            {displayList[4] && <ParallaxCard dest={displayList[4]} index={4} isFeature={false} onClick={setSelected} isFavorite={favorites.has(displayList[4].id)} onToggleFav={toggleFavorite} />}
          </div>
          <div className="lg:col-span-1">
            {displayList[5] && <ParallaxCard dest={displayList[5]} index={5} isFeature={false} onClick={setSelected} isFavorite={favorites.has(displayList[5].id)} onToggleFav={toggleFavorite} />}
          </div>

          {/* Bottom row — Stat/CTA block */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="h-full min-h-[200px] rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 p-8 flex flex-col justify-between overflow-hidden relative"
            >
              <div className="absolute inset-0 opacity-10">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute border border-black/20 rounded-full"
                    style={{
                      width: `${60 + i * 40}px`,
                      height: `${60 + i * 40}px`,
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                ))}
              </div>
              <div className="relative z-10">
                <p className="text-black/60 text-xs font-black tracking-[0.3em] uppercase mb-1">EthioDiscover</p>
                <h3 className="text-black text-3xl md:text-4xl font-black leading-tight">
                  {t("destinations.unescoBanner.title")}
                </h3>
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <p className="text-black/70 text-sm max-w-xs">
                  {t("destinations.unescoBanner.desc")}
                </p>
                <button className="flex items-center gap-2 bg-black text-white text-xs font-black uppercase tracking-widest px-5 py-3 rounded-full hover:bg-neutral-800 transition-colors whitespace-nowrap">
                  {t("destinations.unescoBanner.btn")}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center"
        >
          <Link to="/destinations" className="group relative px-10 py-4 bg-transparent border border-white/15 rounded-full overflow-hidden transition-all hover:border-amber-500 inline-block">
            <span className="relative z-10 text-white font-black tracking-[0.25em] uppercase text-xs group-hover:text-black transition-colors duration-300">
              {t("destinations.viewAll")}
            </span>
            <div className="absolute inset-0 bg-amber-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && <DestinationModal destination={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default DestinationSection;
