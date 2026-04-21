import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, DollarSign, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar/Navbar';
import api from '../api/axios';

const DestinationDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const { data } = await api.get(`/tourism/destinations/${id}`);
        setDestination(data);
      } catch (error) {
        console.error("Failed to load destination:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDestination();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center">
        <Navbar />
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-center">
        <Navbar />
        <h1 className="text-4xl font-black text-white mb-4">{t("dest.detail.notfound")}</h1>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-amber-500 rounded-full text-black font-bold">{t("dest.detail.returnHome")}</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-amber-500/30">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
        {destination.video_url ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <video
              src={destination.video_url}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${destination.image})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-24 left-6 md:left-12 z-20 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-black/60 transition-colors"
        >
          <ArrowLeft size={16} /> {t("common.back")}
        </button>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10 max-w-7xl mx-auto">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-lg">
                {destination.tag}
              </span>
              <span className="text-white/60 text-sm">{destination.region}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-2 leading-none">{destination.title}</h1>
            <p className="text-amber-500 text-xl md:text-3xl font-bold tracking-widest">{destination.amharic}</p>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12 relative -mt-20 z-20">
        
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-12 bg-neutral-900 border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-xl">
          <section>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-6 flex items-center gap-3">
              <span className="w-8 h-1 bg-amber-500 rounded-full"></span> {t("dest.detail.experience")}
            </h2>
            <p className="text-neutral-300 text-lg leading-relaxed whitespace-pre-wrap">
              {destination.description}
            </p>
          </section>

          <section className="pt-8 border-t border-white/10">
            <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-6">{t("dest.detail.gallery")}</h3>
            <div className="grid grid-cols-2 gap-4">
               {/* As a placeholder for multiple images, standard UI technique: Repeat image with filters */}
               <div className="rounded-2xl overflow-hidden h-48 border border-white/5"><img src={destination.image} className="w-full h-full object-cover custom-filter sepia" alt="Gallery 1" /></div>
               <div className="rounded-2xl overflow-hidden h-48 border border-white/5"><img src={destination.image} className="w-full h-full object-cover custom-filter grayscale" alt="Gallery 2" /></div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-white/5 rounded-3xl p-8 shadow-xl">
            <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest mb-6">{t("dest.detail.expedition")}</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500"><MapPin size={20} /></div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">{t("common.location")}</p>
                  <p className="font-bold text-white mt-1">{destination.region}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500"><Calendar size={20} /></div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">{t("dest.detail.season")}</p>
                  <p className="font-bold text-white mt-1">{destination.bestTime}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500"><Clock size={20} /></div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">{t("common.duration")}</p>
                  <p className="font-bold text-white mt-1">{destination.duration}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500"><DollarSign size={20} /></div>
                <div>
                  <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">{t("tours.all.baseRate")}</p>
                  <p className="font-bold text-white mt-1">${destination.basePrice} USD</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <button 
                onClick={() => navigate('/checkout', { state: { destinationCode: destination.code } })}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_10px_40px_-15px_rgba(245,158,11,0.5)] transition-all active:scale-95 text-xs"
              >
                {t("dest.detail.book")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
