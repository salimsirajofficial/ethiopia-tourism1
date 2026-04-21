import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Compass, Search, Heart, ArrowRight, Layers, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AllDestinations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState([]);

  const categories = [
    { id: "All", name: t("cat.all"), icon: <Sparkles size={14} /> },
    { id: "Heritage", name: t("cat.heritage"), icon: <Layers size={14} /> },
    { id: "Adventure", name: t("cat.adventure"), icon: <Compass size={14} /> },
    { id: "Culture", name: t("cat.culture"), icon: <Sparkles size={14} /> },
    { id: "Nature", name: t("cat.nature"), icon: <MapPin size={14} /> },
  ];

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data } = await api.get("/tourism/destinations");
        setDestinations(data);
        
        // Fetch favorites if logged in
        const token = localStorage.getItem("token");
        if (token) {
          const favs = await api.get("/tourism/favorites");
          setFavorites(favs.data.map(f => f.id));
        }
      } catch (err) {
        console.error("Error fetching destinations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const toggleFavorite = async (e, id) => {
    e.stopPropagation();
    try {
      await api.post(`/tourism/favorites/toggle/${id}`);
      setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch = 
      dest.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      dest.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === "All") return matchesSearch;
    
    // Categorization logic
    const tag = dest.tag?.toLowerCase() || "";
    if (activeCategory === "Heritage") {
      return matchesSearch && (tag.includes("heritage") || tag.includes("ancient") || tag.includes("unesco"));
    }
    if (activeCategory === "Adventure") {
      return matchesSearch && (tag.includes("nature") || tag.includes("trekking") || dest.title.includes("Simien") || dest.title.includes("Danakil"));
    }
    if (activeCategory === "Culture") {
      return matchesSearch && (tag.includes("culture") || tag.includes("tapestry") || tag.includes("religious"));
    }
    if (activeCategory === "Nature") {
      return matchesSearch && (tag.includes("park") || tag.includes("nature") || tag.includes("wildlife"));
    }
    
    return matchesSearch;
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
        <p className="mt-8 text-neutral-500 font-black uppercase tracking-[0.4em] animate-pulse">{t("destinations.all.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-amber-500/30 overflow-x-hidden font-sans">
      <Navbar />
      
      {/* Hero Header */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        {/* Animated Background Elements matching the unified system */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-blue-600/5 blur-[160px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-8"
            >
              <Layers size={14} className="animate-pulse" /> {t("destinations.all.archive")}
            </motion.span>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85] uppercase">
              {t("destinations.all.title1")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-200 italic pr-4">{t("destinations.all.title2")}</span><br />
              {t("destinations.all.title3")}
            </h1>
            <p className="text-neutral-500 text-lg md:text-xl max-w-2xl mx-auto font-medium lowercase tracking-tight leading-relaxed">
              {t("destinations.all.subtitle")}
            </p>
          </motion.div>

          {/* Unified Combined Control Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto mb-20"
          >
            <div className="p-2 bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-amber-500 transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder={t("destinations.all.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 bg-transparent pl-16 pr-6 rounded-2xl text-white font-bold placeholder:text-white/10 focus:outline-none"
                />
              </div>
              
              <div className="flex gap-2 p-1 overflow-x-auto hide-scroll">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-8 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all whitespace-nowrap ${
                      activeCategory === cat.id 
                      ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
                      : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {cat.icon}
                    {cat.name}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredDestinations.map((dest, idx) => (
                <motion.div
                  key={dest.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: idx * 0.05 
                  }}
                  onClick={() => navigate(`/destinations/${dest.id}`)}
                  className="group relative h-[550px] rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl bg-neutral-950 border border-white/5"
                  whileHover={{ 
                    y: -10,
                    rotateX: -2,
                    rotateY: 2,
                    transition: { duration: 0.3 }
                  }}
                  style={{ perspective: 1000 }}
                >
                  <img 
                    src={dest.image} 
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
                    alt={dest.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  
                  {/* Actions */}
                  <div className="absolute top-8 left-8 right-8 flex justify-between items-center transform translate-y-[-20px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="px-4 py-2 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
                      {dest.code}
                    </span>
                    <button 
                      onClick={(e) => toggleFavorite(e, dest.id)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl border transition-all ${
                        favorites.includes(dest.id) 
                        ? "bg-red-500 border-red-400 text-white" 
                        : "bg-black/60 border-white/10 text-white hover:bg-amber-500 hover:text-black hover:border-amber-400"
                      }`}
                    >
                      <Heart size={18} fill={favorites.includes(dest.id) ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <div className="absolute bottom-12 left-10 right-10">
                    <div className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                      <div className="w-8 h-[1px] bg-amber-500/30" />
                      {dest.tag || dest.badge}
                    </div>
                    <h3 className="text-4xl font-black text-white leading-[0.9] uppercase tracking-tighter mb-6 group-hover:text-amber-500 transition-colors">
                      {dest.title}
                    </h3>
                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                       <div className="flex flex-col">
                         <span className="text-white/30 text-[9px] font-black uppercase tracking-widest mb-1">{t("destinations.all.starting")}</span>
                         <span className="text-white text-xl font-black tracking-tight">${dest.basePrice}</span>
                       </div>
                       <motion.div 
                        whileHover={{ scale: 1.1, x: 5 }}
                        className="w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center text-white group-hover:bg-amber-500 group-hover:text-black transition-all shadow-xl"
                       >
                          <ArrowRight size={24} />
                       </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredDestinations.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-40 border-2 border-dashed border-white/5 rounded-[4rem]"
            >
              <Sparkles size={64} className="mx-auto text-amber-500/20 mb-8 animate-pulse" />
              <p className="text-neutral-500 text-xl font-black uppercase tracking-[0.3em] italic">{t("destinations.all.noResults")}</p>
              <button 
                onClick={() => {setSearchQuery(""); setActiveCategory("All")}}
                className="mt-8 text-amber-500 font-bold border-b border-amber-500/30 hover:border-amber-500 transition-all pb-1 uppercase text-xs"
              >
                {t("destinations.all.reset")}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllDestinations;
