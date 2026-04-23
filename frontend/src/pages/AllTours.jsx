import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, Star, ArrowRight, Compass, Shield, Zap, Filter, Search, X } from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AllTours = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const { data } = await api.get("/tourism/tours");
        setTours(data);
      } catch (err) {
        console.error("Error fetching tours:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const filteredTours = tours.filter((tour) => {
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tour.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === "All" || tour.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center">
        <Navbar />
        <div className="relative">
          <div className="w-24 h-24 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin-slow" />
          </div>
        </div>
        <p className="mt-8 text-neutral-500 font-black uppercase tracking-[0.4em] animate-pulse">{t("tours.all.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-amber-500/30 overflow-x-hidden font-sans">
      <Navbar />
      
      {/* Hero Header */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-amber-500/5 blur-[160px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >

            <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85] uppercase">
              {t("tours.all.title1")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 italic">{t("tours.all.title2")}</span>
            </h1>
            <p className="text-neutral-500 text-lg md:text-xl max-w-2xl mx-auto font-medium lowercase tracking-tight leading-relaxed">
              {t("tours.all.subtitle")}
            </p>
          </motion.div>

          {/* Combined Control Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto mb-20"
          >
            <div className="p-2 bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-500 transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder={t("tours.all.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 bg-transparent pl-16 pr-6 rounded-2xl text-white font-bold placeholder:text-white/10 focus:outline-none"
                />
              </div>
              
              <div className="flex gap-2 p-1 overflow-x-auto hide-scroll">
                {["All", "Moderate", "Easy", "Challenging"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-8 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all whitespace-nowrap ${
                      selectedDifficulty === diff 
                      ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                      : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {diff === "All" ? t("cat.all") : diff === "Moderate" ? t("diff.moderate") : diff === "Easy" ? t("diff.easy") : t("diff.challenging")}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredTours.map((tour, idx) => (
                <motion.div
                  key={tour.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: idx * 0.05 
                  }}
                  onClick={() => navigate(`/tours/${tour.id}`)}
                  className="group relative h-[600px] bg-neutral-950 border border-white/5 rounded-[3.5rem] overflow-hidden cursor-pointer shadow-2xl"
                  whileHover={{ 
                    y: -10,
                    rotateX: -2,
                    rotateY: 2,
                    transition: { duration: 0.3 }
                  }}
                  style={{ perspective: 1000 }}
                >
                  {/* Image with Cinematic Overlay */}
                  <img 
                    src={tour.image || "/assets/images/ethiopia/image8.jpg"} 
                    alt={tour.title}
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
                  
                   {/* Status Badge */}
                  <div className="absolute top-10 left-10 flex flex-col gap-3">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border backdrop-blur-xl ${
                      tour.difficulty === "Challenging" ? "bg-red-500/20 text-red-400 border-red-500/30" : 
                      tour.difficulty === "Easy" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                      "bg-amber-500/20 text-amber-500 border-amber-500/30"
                    }`}>
                      {tour.difficulty === "Challenging" ? t("diff.challenging") : 
                       tour.difficulty === "Easy" ? t("diff.easy") : t("diff.moderate")}
                    </span>

                    {tour.video_url && (
                      <span className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 backdrop-blur-xl flex items-center justify-center text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="m7 4 12 8-12 8V4z"/></svg>
                      </span>
                    )}
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-12 left-10 right-10">
                    <div className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                      <MapPin size={12} /> {tour.location}
                    </div>
                    <h3 className="text-4xl font-black text-white leading-[0.9] uppercase tracking-tighter mb-8 group-hover:text-amber-500 transition-colors">
                      {tour.title}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                        <span className="block text-[9px] font-black text-white/30 uppercase tracking-widest mb-1.5">{t("tours.all.timeline")}</span>
                        <div className="flex items-center gap-2 text-sm font-bold text-white/80">
                          <Calendar size={14} className="text-amber-500" /> {tour.duration}
                        </div>
                      </div>
                      <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                        <span className="block text-[9px] font-black text-white/30 uppercase tracking-widest mb-1.5">{t("tours.all.capacity")}</span>
                        <div className="flex items-center gap-2 text-sm font-bold text-white/80">
                          <Users size={14} className="text-amber-500" /> {tour.groupSize} {t("tours.all.members")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-white/10">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white/30 uppercase mb-1 tracking-widest">{t("tours.all.baseRate")}</span>
                        <span className="text-3xl font-black text-white tracking-tighter">${tour.basePrice}</span>
                      </div>
                      <motion.div 
                        whileHover={{ scale: 1.1, x: 5 }}
                        className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white group-hover:bg-amber-500 group-hover:text-black transition-all shadow-2xl"
                      >
                        <ArrowRight size={24} />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredTours.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-40 border-2 border-dashed border-white/5 rounded-[4rem]"
            >
              <Compass size={64} className="mx-auto text-amber-500/20 mb-8 animate-pulse" />
              <h3 className="text-2xl font-black text-white/40 mb-4 uppercase tracking-[0.2em]">{t("tours.all.noResults")}</h3>
              <button 
                onClick={() => {setSearchQuery(""); setSelectedDifficulty("All")}}
                className="text-amber-500 font-bold border-b border-amber-500/30 hover:border-amber-500 transition-all pb-1 uppercase text-xs"
              >
                {t("tours.all.reset")}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllTours;
