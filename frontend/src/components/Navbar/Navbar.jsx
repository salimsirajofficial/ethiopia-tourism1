import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

const EthiopiaMap = (props) => (
  <svg viewBox="0 0 1024 1024" fill="currentColor" {...props}>
    <g transform="translate(0,1024) scale(0.1,-0.1)">
      <path d="M3141 9168 c-10 -24 -55 -134 -101 -244 -71 -172 -86 -200 -98 -188 -7 8 -21 14 -31 14 -11 0 -25 15 -36 41 -23 49 -64 73 -111 65 -38 -8 -84 -57 -84 -91 0 -33 -32 -41 -77 -20 -20 10 -64 20 -98 23 -90 7 -128 -16 -205 -123 l-61 -85 17 -28 c16 -29 15 -34 -86 -352 -110 -347 -108 -338 -84 -477 8 -43 -15 -52 -57 -22 -30 21 -35 21 -98 10 -157 -29 -161 -31 -167 -61 -3 -15 -48 -80 -100 -145 -96 -120 -102 -133 -135 -270 -11 -44 -24 -61 -102 -137 -82 -79 -89 -89 -82 -115 4 -15 9 -67 12 -114 l5 -86 -41 -32 c-51 -40 -53 -73 -12 -150 l28 -54 -34 -58 c-28 -48 -32 -65 -27 -96 9 -61 -16 -107 -66 -122 -23 -7 -43 -11 -44 -9 -74 104 -99 128 -131 128 -33 0 -36 -4 -116 -136 -72 -121 -80 -139 -70 -160 6 -13 8 -37 5 -52 -4 -19 1 -43 15 -70 27 -53 19 -93 -25 -127 -34 -26 -34 -27 -34 -105 0 -77 -1 -81 -48 -157 l-49 -78 12 -350 c7 -192 10 -353 8 -357 -2 -5 -14 -8 -27 -8 -18 0 -25 -10 -40 -55 -20 -58 -34 -68 -120 -85 -31 -6 -45 -4 -65 10 -14 10 -47 20 -72 24 -37 4 -52 1 -79 -18 -28 -19 -39 -21 -69 -13 -24 6 -50 6 -78 -2 l-41 -11 -7 -75 c-7 -74 -8 -76 -53 -116 -69 -60 -85 -92 -80 -161 6 -77 25 -98 92 -98 36 0 70 -9 114 -30 48 -23 68 -27 82 -20 28 15 36 13 73 -20 31 -27 36 -28 48 -14 17 21 65 11 99 -20 14 -13 37 -30 52 -37 41 -22 129 -144 148 -208 15 -50 21 -59 68 -86 28 -16 54 -39 58 -50 21 -74 50 -100 129 -119 44 -11 75 -44 75 -81 0 -44 25 -76 58 -73 31 2 71 -17 90 -44 7 -10 27 -25 44 -34 22 -11 29 -21 25 -35 -3 -11 5 -51 18 -88 12 -37 26 -88 30 -112 4 -25 22 -64 41 -90 27 -36 34 -56 34 -90 0 -30 14 -79 47 -156 46 -107 50 -113 95 -138 59 -32 61 -36 49 -81 -8 -28 -6 -43 6 -69 l16 -33 62 30 61 31 41 -26 c36 -23 45 -25 75 -15 31 9 40 7 75 -16 35 -23 41 -33 47 -73 5 -41 3 -50 -18 -72 -23 -25 -24 -29 -19 -146 5 -114 7 -122 35 -157 20 -26 27 -44 23 -58 -7 -23 28 -80 50 -80 8 0 21 -13 30 -29 17 -33 17 -33 385 -50 l185 -9 115 -55 c63 -31 144 -77 180 -104 36 -27 108 -78 160 -113 52 -34 170 -118 261 -186 l165 -124 109 -16 c82 -12 118 -13 149 -5 36 9 48 7 83 -10 29 -14 46 -17 64 -10 18 6 35 3 69 -14 38 -19 68 -23 200 -29 144 -7 157 -9 180 -31 18 -17 40 -24 80 -27 30 -3 63 -8 72 -12 14 -6 23 2 45 38 15 25 35 46 43 46 9 0 41 46 76 108 l61 107 238 123 c219 114 246 125 338 143 l99 19 22 -28 c52 -66 91 -103 149 -138 l62 -38 241 -4 241 -4 24 67 c27 78 57 105 117 105 21 0 144 9 273 20 210 18 237 22 269 44 24 16 39 36 48 65 21 72 103 141 308 263 159 94 199 113 289 139 l105 29 353 0 352 1 84 92 c107 117 1893 2208 1889 2211 -2 1 -138 -1 -303 -6 l-300 -8 -1065 326 -1066 327 -109 122 c-89 98 -123 128 -175 156 -58 30 -78 50 -183 179 -64 80 -138 174 -164 210 -25 36 -71 96 -101 134 -30 38 -69 101 -85 140 -16 39 -52 103 -78 143 -27 40 -49 77 -49 83 0 6 38 67 85 135 47 68 85 125 85 128 0 3 -25 9 -55 12 -42 6 -58 13 -70 31 -11 17 -25 24 -48 24 -17 0 -38 4 -46 9 -19 12 -70 -6 -102 -36 -24 -22 -36 -24 -138 -28 -75 -2 -120 -8 -134 -18 -37 -24 -87 -26 -151 -4 l-59 20 7 149 c4 93 3 163 -4 187 -8 30 -7 48 5 81 8 23 15 58 15 76 0 19 4 34 9 34 25 0 117 110 197 235 49 77 104 153 122 169 20 18 32 37 32 53 0 14 10 41 21 60 l22 35 -44 45 c-24 24 -61 54 -83 65 -21 11 -123 105 -226 208 -125 126 -215 207 -271 245 -111 75 -135 99 -169 165 -20 40 -38 60 -63 72 -23 11 -87 80 -194 210 l-159 193 -185 72 c-101 40 -194 71 -207 69 -19 -3 -28 6 -52 54 -27 53 -32 58 -54 52 -14 -4 -35 -23 -48 -42 -32 -47 -81 -53 -126 -15 -39 33 -142 75 -182 75 -28 0 -30 -2 -30 -40 0 -49 -20 -61 -62 -37 -22 13 -28 13 -28 3 0 -8 -11 -17 -25 -20 -14 -4 -31 -18 -37 -32 -6 -13 -16 -23 -22 -21 -12 4 -12 17 -2 57 4 17 0 36 -13 57 -28 45 -59 62 -103 56 -31 -4 -39 -10 -45 -34 -12 -42 -115 -119 -162 -119 -22 0 -58 -13 -95 -34 -52 -30 -62 -32 -92 -23 -20 6 -45 26 -61 46 -14 20 -39 50 -54 66 -15 17 -29 41 -31 55 -2 20 -9 26 -33 27 -56 5 -135 24 -135 33 0 13 -59 79 -82 91 -16 9 -21 4 -37 -33z"/>
    </g>
  </svg>
);

const navLinks = [
  { label: "Destinations", href: "/#destinations" },
  { label: "Culture", href: "/#culture" },
  { label: "Tours", href: "/#tours" },
  { label: "About", href: "/#about" },
];

const languages = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
  { code: "am", label: "አማ" },
];

/* ─── Floating Language Switcher ──────────────────────────── */
const FloatingLangSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage || "en";

  const handleLangChange = (code) => {
    i18n.changeLanguage(code);
    // Set RTL for Arabic
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = code;
  };

  return (
    <div className="hidden md:flex">
      <div
        style={{
          position: "fixed",
          right: "16px",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          zIndex: 9999,
        }}
      >
        {/* Globe icon at top */}
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(245,158,11,0.15)",
            border: "1px solid rgba(245,158,11,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "4px",
          }}
        >
          <Globe size={16} style={{ color: "#f59e0b" }} />
        </div>

        {/* Language buttons */}
        {languages.map((lng) => {
          const isActive = currentLang === lng.code;
          return (
            <motion.button
              key={lng.code}
              onClick={() => handleLangChange(lng.code)}
              whileHover={{ scale: 1.1, x: -3 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                border: isActive
                  ? "1px solid rgba(245,158,11,0.8)"
                  : "1px solid rgba(255,255,255,0.1)",
                background: isActive
                  ? "linear-gradient(135deg, #f59e0b, #d97706)"
                  : "rgba(10,10,10,0.75)",
                backdropFilter: "blur(12px)",
                color: isActive ? "#000" : "rgba(255,255,255,0.7)",
                fontSize: lng.code === "am" ? "10px" : "11px",
                fontWeight: "800",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                letterSpacing: "0.05em",
                boxShadow: isActive
                  ? "0 0 16px rgba(245,158,11,0.35), 0 4px 12px rgba(0,0,0,0.4)"
                  : "0 2px 8px rgba(0,0,0,0.3)",
                transition: "background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s",
                position: "relative",
                overflow: "hidden",
              }}
              title={
                lng.code === "en" ? "English" :
                lng.code === "fr" ? "Français" :
                lng.code === "ar" ? "العربية" :
                "አማርኛ"
              }
            >
              {isActive && (
                <motion.span
                  layoutId="lang-active-bg"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    borderRadius: "9px",
                    zIndex: 0,
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span style={{ position: "relative", zIndex: 1 }}>{lng.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Navbar ──────────────────────────────────────────────── */
const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [userName, setUserName] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const lastScrollY = useRef(0);

  const BACKEND_URL = "http://localhost:5000";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setUserName(null);
    window.location.href = "/";
  };

  // Initialize document direction based on stored language
  useEffect(() => {
    const storedLang = localStorage.getItem("i18nextLng") || "en";
    document.documentElement.dir = storedLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = storedLang;
  }, []);

  // Sync direction when language changes
  useEffect(() => {
    const lang = i18n.resolvedLanguage || "en";
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [i18n.resolvedLanguage]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUserName(localStorage.getItem("userName") || t("nav.explorer"));
      const savedAvatar = localStorage.getItem("userAvatar");
      if (savedAvatar) {
        setAvatarUrl(
          savedAvatar.startsWith("http")
            ? savedAvatar
            : `${BACKEND_URL}${savedAvatar}`
        );
      }
    }

    const handleScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollY.current && y > 200) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setScrolled(y > 50);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Floating Language Switcher */}
      <FloatingLangSwitcher />

      <motion.nav
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-neutral-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <EthiopiaMap className="w-10 h-10 text-amber-500 group-hover:scale-110 transition-transform duration-500" />
            <span className="text-2xl font-black text-white tracking-tight">
              Ethio<span className="text-amber-500">Discover</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-4 py-2 text-sm font-semibold text-white/70 hover:text-white transition-colors duration-200 group"
              >
                {t(link.label)}
                <span className="absolute bottom-0 left-4 right-4 h-px bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </a>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {userName ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 overflow-hidden border border-white/10">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        onError={() => setAvatarUrl(null)}
                      />
                    ) : (
                      <User size={14} />
                    )}
                  </div>
                  <span className="text-sm font-bold text-white pr-2 group-hover:text-amber-500 transition-colors">
                    {userName}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border border-white/5 hover:border-red-500/30 transition-all group"
                  title={t("Log Out")}
                >
                  <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-white/70 hover:text-white transition-colors px-3 py-2"
                >
                  {t("Log In")}
                </Link>
                <Link
                  to="/tours"
                  className="group relative px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-full shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105 uppercase tracking-wider overflow-hidden"
                >
                  {t("Book Now")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white hover:border-amber-500/50 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-neutral-950/95 backdrop-blur-xl border-t border-white/5"
            >
              <div className="flex flex-col px-6 py-8 gap-1">
                {/* Mobile Language Selector Redesigned */}
                <div className="mb-8 pt-2">
                  <div className="flex items-center gap-3 mb-5 px-1">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <Globe size={14} className="text-amber-500" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white/40">
                      {t("nav.select_language")} / ቋንቋ
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {languages.map((lng) => {
                      const isActive = i18n.resolvedLanguage === lng.code;
                      return (
                        <button
                          key={lng.code}
                          onClick={() => {
                            i18n.changeLanguage(lng.code);
                            document.documentElement.dir = lng.code === "ar" ? "rtl" : "ltr";
                            document.documentElement.lang = lng.code;
                          }}
                          className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${
                            isActive
                              ? "bg-amber-500 border-amber-400 text-black shadow-xl shadow-amber-500/20"
                              : "bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:border-white/10"
                          }`}
                        >
                          <span className={`text-xs font-black tracking-widest ${isActive ? "opacity-100" : "opacity-40"}`}>
                            {lng.label}
                          </span>
                          <span className="text-[11px] font-bold">
                            {lng.code === "en" ? "English" :
                             lng.code === "fr" ? "French" :
                             lng.code === "ar" ? "Arabic" :
                             "Amharic"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => setIsOpen(false)}
                    className="text-white text-xl font-black py-3 border-b border-white/5 hover:text-amber-400 transition-colors"
                  >
                    {t(link.label)}
                  </motion.a>
                ))}

                <div className="flex flex-col gap-3 mt-6">
                  {userName ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center gap-3 w-full text-center py-3.5 bg-white/5 border border-white/15 text-white font-bold rounded-full hover:border-amber-500/50 transition-colors"
                      >
                        <User size={16} className="text-amber-500" />
                        <span>{userName}</span> – {t("Dashboard")}
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="flex items-center justify-center gap-3 w-full text-center py-3.5 bg-red-500/5 text-red-400 border border-red-500/10 font-bold rounded-full hover:bg-red-500/20 transition-colors"
                      >
                        <LogOut size={16} />
                        {t("Log Out")}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="w-full text-center py-3.5 border border-white/15 text-white font-bold rounded-full hover:border-amber-500/50 transition-colors"
                      >
                        {t("Log In")}
                      </Link>
                      <Link
                        to="/tours"
                        onClick={() => setIsOpen(false)}
                        className="w-full text-center py-3.5 bg-amber-500 text-black font-black rounded-full hover:bg-amber-400 transition-colors uppercase tracking-wider"
                      >
                        {t("Book Now")}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
