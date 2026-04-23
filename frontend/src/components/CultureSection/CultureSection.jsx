import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from "react-i18next";
import api from '../../api/axios';
import { X, Clock, MapPin, Tag, Info, Calendar } from 'lucide-react';

const CultureSection = () => {
  const { t } = useTranslation();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [cultureItems, setCultureItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCulture, setSelectedCulture] = useState(null);

  const fetchCultures = async () => {
    try {
      const { data } = await api.get('/tourism/cultures');
      setCultureItems(data);
    } catch (err) {
      console.error('Failed to fetch culture items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCultures();
  }, []);

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
  }, [cultureItems]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('.culture-card')?.offsetWidth || 400;
    el.scrollBy({ left: direction * (cardWidth + 24), behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="py-32 bg-neutral-900 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section id="culture" className="relative bg-neutral-900 py-24 md:py-32 overflow-hidden">
      {/* Background texture with fade */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.04]"
        style={{ backgroundImage: `url(/assets/images/ethiopia/image6.jpg)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-900/95 to-neutral-900" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10">
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

            <div className="flex gap-3">
              <button
                onClick={() => scroll(-1)}
                disabled={!canScrollLeft}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  canScrollLeft
                    ? 'border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-black hover:border-amber-500'
                    : 'border-white/10 text-white/20 cursor-not-allowed'
                }`}
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
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-neutral-900 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />
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
              <CultureCard 
                key={item.id} 
                item={item} 
                index={i} 
                onClick={() => setSelectedCulture(item)}
              />
            ))}
            {cultureItems.length === 0 && (
              <div className="w-full text-center py-20 text-neutral-500 uppercase tracking-widest font-black text-xs">
                Syncing Cultural Archives...
              </div>
            )}
          </div>
        </div>

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

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCulture && (
          <CultureDetailModal 
            item={selectedCulture} 
            onClose={() => setSelectedCulture(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
};

const CultureCard = ({ item, index, onClick }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={onClick}
      className="culture-card relative overflow-hidden rounded-3xl bg-neutral-800 border border-white/8 flex-shrink-0 group cursor-pointer"
      style={{
        width: 'clamp(300px, calc((100% - 48px) / 3), 440px)',
        height: 'clamp(420px, 55vh, 600px)',
        scrollSnapAlign: 'start',
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center scale-110 group-hover:scale-100 transition-transform duration-700"
        style={{ backgroundImage: `url(${item.image})` }}
      />
      <div className={`absolute inset-0 bg-gradient-to-r ${item.accent} to-neutral-950/95`} />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/30 to-neutral-950/20" />

      <div className="absolute top-6 right-8 text-[7rem] font-black text-white/[0.04] leading-none select-none">
        {item.number}
      </div>

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

const CultureDetailModal = ({ item, onClose }) => {
  const { t } = useTranslation();
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-5xl h-full max-h-[85vh] bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-white/10 flex flex-col"
      >
        {/* Header Image Area */}
        <div className="relative h-2/5 md:h-[45%] flex-shrink-0">
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-black/50 hover:bg-black text-white rounded-full transition-colors border border-white/10 z-20 group"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
            <div className="flex flex-col gap-2">
              <span className="text-amber-500 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase">
                {item.amharic || "Identity"}
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none">
                {t(item.title)}
              </h2>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Description Column */}
            <div className="lg:col-span-8 space-y-6">
               <div className="flex items-center gap-4 mb-2">
                  <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{item.label}</span>
                  </div>
                  <span className="text-neutral-500 text-xs font-bold font-mono">CODE-ID: {item.number}</span>
               </div>
               
               <p className="text-neutral-300 text-lg leading-relaxed font-medium">
                 {t(item.description)}
               </p>
               
               <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-6">
                 <div>
                   <h4 className="text-xs font-black text-white/40 uppercase tracking-widest mb-2">Significance</h4>
                   <p className="text-sm text-neutral-400">Deeply rooted in the social fabric of the Ethiopian highlands.</p>
                 </div>
                 <div>
                   <h4 className="text-xs font-black text-white/40 uppercase tracking-widest mb-2">UNESCO Status</h4>
                   <p className="text-sm text-neutral-400">Intangible Cultural Heritage of Humanity.</p>
                 </div>
               </div>
            </div>

            {/* Quick Facts Column */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-neutral-950/50 border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Info size={16} className="text-amber-500" /> Quick Facts
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Duration</p>
                      <p className="text-sm font-black text-white">{item.detail || "Variable"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                      <Tag size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Category</p>
                      <p className="text-sm font-black text-white">{item.label}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-amber-500 flex-shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Best Season</p>
                      <p className="text-sm font-black text-white">Year-round Discovery</p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-amber-500 transition-colors shadow-lg shadow-white/5">
                  Experience Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CultureSection;
