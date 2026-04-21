import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, DollarSign, ArrowLeft, Users, Shield, Plus, Minus, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar/Navbar';
import api from '../api/axios';

const TourDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const { data } = await api.get(`/tourism/tours/${id}`);
        setTour(data);
      } catch (error) {
        console.error("Failed to load tour:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center">
        <Navbar />
        <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
        <Navbar />
        <h1 className="text-4xl font-black text-white mb-4 uppercase">{t("tours.detail.lost")}</h1>
        <p className="text-neutral-500 mb-8 max-w-sm">{t("tours.detail.lostDesc")}</p>
        <button onClick={() => navigate('/tours')} className="px-8 py-3 bg-amber-500 rounded-2xl text-black font-black uppercase text-xs tracking-widest">{t("tours.detail.return")}</button>
      </div>
    );
  }

  const totalPrice = tour.basePrice * guests;

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-amber-500/30 overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] md:h-[90vh] overflow-hidden">
        {tour.video_url ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <video
              src={tour.video_url}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-cover bg-center grayscale-[0.3]"
            style={{ backgroundImage: `url(${tour.image || '/assets/images/ethiopia/image8.jpg'})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-neutral-950/10" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-28 left-6 md:left-12 z-20 flex items-center gap-2 px-5 py-2.5 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-amber-500 hover:text-black transition-all group active:scale-95"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-[10px] font-black uppercase tracking-widest">{t("tours.detail.withdraw")}</span>
        </button>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-10 max-w-7xl mx-auto">
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border ${
                tour.difficulty === "Challenging" ? "bg-red-500 text-white border-red-400" : 
                tour.difficulty === "Easy" ? "bg-emerald-500 text-black border-emerald-400" :
                "bg-amber-500 text-black border-amber-400"
              }`}>
                {tour.difficulty}
              </span>
              <span className="text-white/60 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} className="text-amber-500" /> {tour.location}
              </span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-4 leading-[0.85] text-white mix-blend-difference">
              {tour.title}
            </h1>
            <p className="text-amber-500 text-xl md:text-3xl font-black uppercase tracking-[0.3em]">{tour.subtitle}</p>
          </motion.div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-32 grid grid-cols-1 lg:grid-cols-3 gap-16 relative -mt-32 z-20">
        
        {/* Main Content (Description + Itinerary) */}
        <div className="lg:col-span-2 space-y-20">
          
          {/* Narrative */}
          <section className="bg-neutral-900 border border-white/5 rounded-[3rem] p-10 md:p-14 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4">
               {t("tours.detail.narrative")}
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium whitespace-pre-wrap">
               {tour.description}
            </p>
          </section>

          {/* Itinerary Timeline */}
          <section>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-12 px-6">
               {t("tours.detail.chronology")}
            </h2>
            
            <div className="relative space-y-1">
               {/* Vertical Line */}
               <div className="absolute left-[39px] top-4 bottom-4 w-px bg-gradient-to-b from-amber-500 via-amber-500/30 to-transparent z-0" />
               
               <div className="space-y-8">
                 {tour.itinerary?.map((item, idx) => (
                   <motion.div 
                     key={idx}
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     className="relative flex gap-10 group"
                   >
                     <div className="flex-shrink-0 w-20 h-20 rounded-full bg-neutral-900 border border-white/10 flex flex-col items-center justify-center z-10 group-hover:border-amber-500 transition-colors shadow-xl">
                        <span className="text-[10px] font-black text-amber-500 uppercase">{t("tours.detail.day")}</span>
                        <span className="text-2xl font-black">{item.day}</span>
                     </div>
                     
                     <div className="pt-2">
                        <h4 className="text-xl font-black text-white mb-2 group-hover:text-amber-500 transition-colors">{item.title}</h4>
                        <p className="text-neutral-500 text-sm leading-relaxed max-w-xl font-medium italic">
                           {item.description}
                        </p>
                     </div>
                   </motion.div>
                 ))}
               </div>
            </div>
          </section>
        </div>

        {/* Dynamic Pricing Sidebar */}
        <div className="space-y-6">
          <div className="sticky top-28 bg-neutral-900 border border-white/5 rounded-[3rem] p-10 shadow-3xl text-center">
            <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-8">{t("tours.detail.terminal")}</h3>
            
            {/* Stats List */}
            <div className="space-y-6 mb-10 text-left px-2">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <span className="text-[10px] font-black text-neutral-600 uppercase">{t("tours.detail.duration")}</span>
                <span className="text-xs font-black">{tour.duration}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <span className="text-[10px] font-black text-neutral-600 uppercase">{t("tours.detail.accessibility")}</span>
                <span className="text-xs font-black">{t(`diff.${tour.difficulty?.toLowerCase()}`)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-neutral-600 uppercase">{t("tours.detail.groupCap")}</span>
                <span className="text-xs font-black">{tour.groupSize}</span>
              </div>
            </div>

            {/* Dynamic Counter */}
            <div className="bg-neutral-950 rounded-3xl p-6 border border-white/5 mb-8">
               <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-4 text-center">{t("dash.stats.travelers")}</p>
               <div className="flex items-center justify-center gap-8">
                  <button 
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-3xl font-black tabular-nums">{guests}</span>
                  <button 
                    onClick={() => setGuests(guests + 1)}
                    className="w-10 h-10 rounded-full bg-amber-500 text-black flex items-center justify-center hover:bg-amber-400 transition-all active:scale-90"
                  >
                    <Plus size={16} />
                  </button>
               </div>
            </div>

            {/* Final Price */}
            <div className="mb-10">
               <span className="text-[9px] uppercase font-black tracking-widest text-neutral-500 block mb-2">{t("tours.detail.total")}</span>
               <div className="flex items-center justify-center gap-2">
                  <span className="text-5xl font-black text-white">${totalPrice.toLocaleString()}</span>
                  <span className="text-xs font-black text-neutral-600 uppercase">{t("checkout.credits.standard").split(' ')[0]}</span>
               </div>
            </div>

            <button 
              onClick={() => navigate('/checkout', { state: { tourId: tour.id, guests } })}
              className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all hover:bg-amber-500 active:scale-95 text-xs flex items-center justify-center gap-3 overflow-hidden group"
            >
              {t("tours.detail.initiate")} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
