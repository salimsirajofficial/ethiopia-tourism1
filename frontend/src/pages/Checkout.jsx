import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  User, Mail, Phone, Lock, CalendarDays, MapPin,
  Users, Plane, CheckCircle2, ChevronRight, ArrowLeft,
  Wallet, ShieldCheck, Info, CreditCard
} from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import api from "../api/axios";
import { validateName, validateEmail, validatePassword } from "../utils/validators";
import { useTranslation } from "react-i18next";

// ─── Class Multipliers ───
const classMultipliers = {
  economy: 1,
  business: 2.5,
  first: 4.5
};

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1); // 1: Form, 2: Review, 3: Success
  const [formTab, setFormTab] = useState("traveler"); // "traveler" | "trip"
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [destinationsList, setDestinationsList] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    // Account
    name: "",
    email: "",
    phone: "",
    password: "",
    passportId: "",
    // Booking
    destinationCode: location.state?.destinationCode || "LAL",
    travelDate: "",
    returnDate: "",
    guests: 1,
    travelClass: "economy",
    specialRequests: "",
  });

  // File states
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [passportFile, setPassportFile] = useState(null);
  const [passportPreview, setPassportPreview] = useState(null);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'avatar') {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
      } else {
        setPassportFile(file);
        setPassportPreview(URL.createObjectURL(file));
      }
    }
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const { data } = await api.get('/tourism/destinations');
        setDestinationsList(data);
        if (!location.state?.destinationCode && data.length > 0) {
          setFormData(prev => ({ ...prev, destinationCode: data[0].code }));
        }
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
      }
    };
    fetchDestinations();

    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const savedName = localStorage.getItem("userName");
      if (savedName) setFormData(prev => ({ ...prev, name: savedName }));
    }
  }, [location.state]);

  const calculateTotal = () => {
    const dest = destinationsList.find(d => d.code === formData.destinationCode);
    if (!dest) return 0;
    return (dest.basePrice * formData.guests) * classMultipliers[formData.travelClass];
  };

  const selectedDestination = destinationsList.find(d => d.code === formData.destinationCode);

  const validateTraveler = () => {
    const newErrors = {};
    if (!isLoggedIn) {
      if (!formData.name) newErrors.name = t("dash.modal.error.name");
      if (!formData.email) newErrors.email = t("dash.modal.error.email");
      if (!formData.password) newErrors.password = t("dash.modal.error.password");
      if (!formData.phone) newErrors.phone = t("dash.modal.error.phone");
      if (!formData.passportId) newErrors.passportId = t("dash.modal.error.passport");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTrip = () => {
    const newErrors = {};
    if (!formData.travelDate) newErrors.travelDate = t("dash.modal.error.travelDate");
    if (formData.returnDate && new Date(formData.returnDate) < new Date(formData.travelDate)) {
      newErrors.returnDate = t("dash.modal.error.returnDate");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextTab = () => {
    if (validateTraveler()) setFormTab("trip");
  };

  const handleNext = () => {
    if (validateTrip()) setStep(2);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const dataToSend = new FormData();

      // Append files
      if (avatarFile) dataToSend.append("avatar", avatarFile);
      if (passportFile) dataToSend.append("passport", passportFile);

      // Append other form fields
      Object.keys(formData).forEach(key => {
        dataToSend.append(key, formData[key]);
      });

      const { data } = await api.post("/checkout", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (data.token) localStorage.setItem("token", data.token);
      if (data.user?.name) localStorage.setItem("userName", data.user.name);
      if (data.user?.avatar_url) localStorage.setItem("userAvatar", data.user.avatar_url);
      if (data.user?.passport_image_url) localStorage.setItem("userPassport", data.user.passport_image_url);

      setStep(3); // Go to success step
    } catch (error) {
      console.error("Checkout submission failed:", error);
      alert(error.response?.data?.message || t("dash.modal.error.failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col relative overflow-x-hidden">
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-6 py-12 pt-28">
        <div className="w-full max-w-6xl">

          <Card className="overflow-hidden border-none shadow-2xl rounded-[2rem] bg-[#1A1A1A] max-w-5xl mx-auto border border-white/5 relative">
            <CardContent className="grid p-0 md:grid-cols-[1.2fr_0.8fr]">
              <div className="p-8 md:p-14 relative">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-8 md:p-12 relative"
                    >
                      {/* Close button top right */}
                      <button onClick={() => navigate(-1)} className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors">
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                          <span className="text-xs">✕</span>
                        </div>
                      </button>

                      <div className="mb-10">
                        <h1 className="text-4xl font-black text-white tracking-tight mb-2">{t("dash.modal.title")}</h1>
                        <p className="text-neutral-400 text-sm">{t("dash.modal.subtitle")}</p>
                      </div>

                      {/* Custom Tabs */}
                      <div className="flex items-center gap-4 mb-12">
                        <button
                          onClick={() => setFormTab("traveler")}
                          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${formTab === "traveler" ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"}`}
                        >
                          <User size={16} className={formTab === "traveler" ? "text-black" : "text-neutral-500"} />
                          {t("dash.modal.step1")}
                        </button>
                        <div className="w-8 h-[1px] bg-white/10"></div>
                        <button
                          onClick={() => { if (validateTraveler()) setFormTab("trip"); }}
                          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${formTab === "trip" ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"}`}
                        >
                          <Plane size={16} className={formTab === "trip" ? "text-black" : "text-neutral-500"} />
                          {t("dash.modal.step2")}
                        </button>
                      </div>

                      {/* Form Areas */}
                      <div className="h-[400px]">
                        <AnimatePresence mode="wait">
                          {formTab === "traveler" && (
                            <motion.div
                              key="tab-traveler"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="space-y-6"
                            >
                              {!isLoggedIn ? (
                                <>
                                  <div>
                                    <label className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">
                                      <User size={12} /> {t("dash.modal.name")} <span className="text-amber-500">*</span>
                                    </label>
                                    <Input
                                      placeholder={t("auth.signup.name")}
                                      value={formData.name}
                                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                                      className="h-14 bg-white/[0.02] border-white/5 rounded-xl text-white font-medium focus:bg-white/[0.05] focus:border-white/10 transition-all px-4"
                                    />
                                    {errors.name && <p className="text-[10px] text-red-400 mt-1">{errors.name}</p>}
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <label className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">
                                        <Phone size={12} /> {t("dash.modal.phone")} <span className="text-amber-500">*</span>
                                      </label>
                                      <Input
                                        placeholder="+251 9XX XXX XXX"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="h-14 bg-white/[0.02] border-white/5 rounded-xl text-white font-medium focus:bg-white/[0.05] transition-all px-4"
                                      />
                                      {errors.phone && <p className="text-[10px] text-red-400 mt-1">{errors.phone}</p>}
                                    </div>
                                    <div>
                                      <label className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">
                                        <Mail size={12} /> {t("auth.login.email")} <span className="text-amber-500">*</span>
                                      </label>
                                      <Input
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="h-14 bg-white/[0.02] border-white/5 rounded-xl text-white font-medium focus:bg-white/[0.05] transition-all px-4"
                                      />
                                      {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email}</p>}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <label className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">
                                        <Lock size={12} /> {t("auth.login.password")} <span className="text-amber-500">*</span>
                                      </label>
                                      <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="h-14 bg-white/[0.02] border-white/5 rounded-xl text-white font-medium focus:bg-white/[0.05] transition-all px-4"
                                      />
                                      {errors.password && <p className="text-[10px] text-red-400 mt-1">{errors.password}</p>}
                                    </div>
                                    <div>
                                      <label className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">
                                        <CreditCard size={12} /> {t("dash.modal.passport")} <span className="text-amber-500">*</span>
                                      </label>
                                      <Input
                                        placeholder="EP1234567"
                                        value={formData.passportId}
                                        onChange={e => setFormData({ ...formData, passportId: e.target.value })}
                                        className="h-14 bg-white/[0.02] border-white/5 rounded-xl text-white font-medium focus:bg-white/[0.05] transition-all px-4"
                                      />
                                      {errors.passportId && <p className="text-[10px] text-red-400 mt-1">{errors.passportId}</p>}
                                    </div>
                                  </div>

                                  {/* Identity Uploads */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Avatar Upload */}
                                    <div className="relative group/upload">
                                      <p className="text-[10px] uppercase font-black tracking-widest text-white/50 mb-3">{t("checkout.identity")}</p>
                                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.02] hover:bg-white/[0.04] hover:border-amber-500/30 transition-all cursor-pointer overflow-hidden group">
                                        {avatarPreview ? (
                                          <img src={avatarPreview} className="w-full h-full object-cover" alt="Profile Preview" />
                                        ) : (
                                          <div className="flex flex-col items-center gap-2 p-6 text-center">
                                            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-1">
                                              <User size={24} />
                                            </div>
                                            <span className="text-[9px] font-black uppercase text-white/20 group-hover:text-amber-500 transition-colors">{t("checkout.selectScan")}</span>
                                          </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
                                      </label>
                                    </div>

                                    {/* Passport Upload */}
                                    <div className="relative group/upload">
                                      <p className="text-[10px] uppercase font-black tracking-widest text-white/50 mb-3">{t("checkout.passportDoc")}</p>
                                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.02] hover:bg-white/[0.04] hover:border-amber-500/30 transition-all cursor-pointer overflow-hidden group">
                                        {passportPreview ? (
                                          <img src={passportPreview} className="w-full h-full object-cover" alt="Passport Preview" />
                                        ) : (
                                          <div className="flex flex-col items-center gap-2 p-6 text-center">
                                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-1">
                                              <ShieldCheck size={24} />
                                            </div>
                                            <span className="text-[9px] font-black uppercase text-white/20 group-hover:text-amber-500 transition-colors">{t("checkout.selectDoc")}</span>
                                          </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'passport')} />
                                      </label>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-4 h-[250px]">
                                  <div className="p-4 bg-amber-500/10 rounded-full">
                                    <CheckCircle2 size={32} className="text-amber-500" />
                                  </div>
                                  <div className="text-center">
                                    <p className="text-lg font-bold text-white">{formData.name || t("checkout.logged")}</p>
                                    <p className="text-[11px] text-emerald-400 font-black uppercase tracking-widest mt-1">{t("checkout.verified")}</p>
                                  </div>
                                </div>
                              )}

                              <div className="pt-4">
                                <Button
                                  onClick={handleNextTab}
                                  className="w-full h-14 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                  {t("dash.modal.next")} <ChevronRight size={16} />
                                </Button>
                              </div>
                            </motion.div>
                          )}

                          {formTab === "trip" && (
                            <motion.div
                              key="tab-trip"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="space-y-6"
                            >
                              <div>
                                <label className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">
                                  <MapPin size={12} /> {t("dash.modal.destination")} <span className="text-amber-500">*</span>
                                </label>
                                <select
                                  value={formData.destinationCode}
                                  onChange={e => setFormData({ ...formData, destinationCode: e.target.value })}
                                  className="w-full h-14 bg-white/[0.02] border border-white/5 rounded-xl px-4 text-sm font-medium text-white focus:outline-none focus:bg-white/[0.05] appearance-none cursor-pointer"
                                >
                                  {destinationsList.map(d => (
                                    <option key={d.code} value={d.code} className="bg-neutral-900">{d.title} ({d.code})</option>
                                  ))}
                                </select>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">
                                    <CalendarDays size={12} /> {t("dash.modal.departure")} <span className="text-amber-500">*</span>
                                  </label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="outline" className="w-full h-14 justify-start text-left font-medium bg-white/[0.02] border-white/5 rounded-xl hover:bg-white/[0.05] text-white">
                                        <CalendarDays className="mr-3 h-4 w-4 text-amber-500" />
                                        {formData.travelDate ? format(new Date(formData.travelDate), "PPP") : <span className="text-neutral-500">{t("checkout.selectDate")}</span>}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 border-white/10 bg-neutral-900" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={formData.travelDate ? new Date(formData.travelDate) : undefined}
                                        onSelect={date => setFormData({ ...formData, travelDate: date?.toISOString() })}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  {errors.travelDate && <p className="text-[10px] text-red-400 mt-1">{errors.travelDate}</p>}
                                </div>
                                <div>
                                  <label className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">
                                    <CalendarDays size={12} /> {t("dash.modal.return")}
                                  </label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="outline" className="w-full h-14 justify-start text-left font-medium bg-white/[0.02] border-white/5 rounded-xl hover:bg-white/[0.05] text-white">
                                        <CalendarDays className="mr-3 h-4 w-4 text-amber-500/50" />
                                        {formData.returnDate ? format(new Date(formData.returnDate), "PPP") : <span className="text-neutral-500">{t("checkout.selectDate")}</span>}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 border-white/10 bg-neutral-900" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={formData.returnDate ? new Date(formData.returnDate) : undefined}
                                        onSelect={date => setFormData({ ...formData, returnDate: date?.toISOString() })}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  {errors.returnDate && <p className="text-[10px] text-red-400 mt-1">{errors.returnDate}</p>}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <label className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">
                                    <Users size={12} /> {t("dash.modal.guests")}
                                  </label>
                                  <Input
                                    type="number"
                                    min="1" max="100"
                                    value={formData.guests}
                                    onChange={e => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                                    className="h-14 bg-white/[0.02] border-white/5 rounded-xl text-white font-medium focus:bg-white/[0.05] px-4"
                                  />
                                </div>
                                <div>
                                  <label className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">
                                    <Plane size={12} /> {t("dash.modal.class")}
                                  </label>
                                  <select
                                    value={formData.travelClass}
                                    onChange={e => setFormData({ ...formData, travelClass: e.target.value })}
                                    className="w-full h-14 bg-white/[0.02] border border-white/5 rounded-xl px-4 text-sm font-medium text-white focus:outline-none focus:bg-white/[0.05] appearance-none cursor-pointer capitalize"
                                  >
                                    <option value="economy" className="bg-neutral-900">{t("dash.modal.class.economy")}</option>
                                    <option value="business" className="bg-neutral-900">{t("dash.modal.class.business")}</option>
                                    <option value="first" className="bg-neutral-900">{t("dash.modal.class.first")}</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/50 mb-2">
                                  <Info size={12} /> {t("dash.modal.requests")}
                                </label>
                                <textarea
                                  value={formData.specialRequests}
                                  onChange={e => setFormData({ ...formData, specialRequests: e.target.value })}
                                  placeholder={t("checkout.placeholder.requests")}
                                  className="w-full h-20 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:bg-white/[0.05] resize-none"
                                ></textarea>
                              </div>

                              <div className="pt-2">
                                <Button
                                  onClick={handleNext}
                                  className="w-full h-14 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest rounded-xl shadow-lg transition-all"
                                >
                                  {t("dash.modal.submit")} <ChevronRight size={16} className="ml-2" />
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ) : step === 2 ? (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-12"
                    >
                      <button onClick={() => setStep(1)} className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest leading-none">
                        <ArrowLeft size={12} /> {t("dash.modal.back")}
                      </button>

                      <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter mb-3 leading-none italic uppercase">
                          {t("checkout.title").split('&')[0]} & <span className="text-amber-500">{t("checkout.title").split('&')[1] || t("common.confirm")}</span>
                        </h1>
                        <p className="text-neutral-400 text-sm">{t("checkout.subtitle")}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Summary Details */}
                        <div className="space-y-6">
                          <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2rem] space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-500/60">{t("dash.modal.step2")}</h3>
                            <div className="flex items-center gap-5">
                              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                                <MapPin size={28} />
                              </div>
                              <div>
                                <p className="text-2xl font-black text-white leading-tight tracking-tight">{selectedDestination?.title}</p>
                                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mt-1">Status: Restricted Access ({selectedDestination?.code})</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6 pt-6 border-t border-white/5">
                              <div>
                                <p className="text-[9px] uppercase font-black text-white/20 tracking-widest mb-1.5">{t("dash.modal.departure")}</p>
                                <p className="text-base font-bold text-white tracking-tight">{formData.travelDate ? format(new Date(formData.travelDate), "MMM dd, yyyy") : "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-[9px] uppercase font-black text-white/20 tracking-widest mb-1.5">{t("dash.modal.return")}</p>
                                <p className="text-base font-bold text-white tracking-tight">{formData.returnDate ? format(new Date(formData.returnDate), "MMM dd, yyyy") : "OPEN"}</p>
                              </div>
                              <div>
                                <p className="text-[9px] uppercase font-black text-white/20 tracking-widest mb-1.5">{t("dash.modal.guests")}</p>
                                <p className="text-base font-bold text-white tracking-tight">{formData.guests} {formData.guests > 1 ? t("checkout.explorers") : t("checkout.explorer")}</p>
                              </div>
                              <div>
                                <p className="text-[9px] uppercase font-black text-white/20 tracking-widest mb-1.5">{t("dash.modal.class")}</p>
                                <p className="text-base font-bold text-amber-500 uppercase tracking-widest text-sm">{t(`dash.modal.class.${formData.travelClass}`)}</p>
                              </div>
                            </div>
                          </div>

                          <div className="p-8 bg-amber-500/[0.02] border border-amber-500/10 rounded-[2rem] space-y-5">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <Wallet className="text-amber-500/40" size={18} />
                                <span className="text-xs font-black uppercase tracking-widest text-white/40">{t("checkout.total")}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-[10px] text-white/20 font-black uppercase tracking-widest mb-1">{t("checkout.credits.standard")}</div>
                                <span className="text-4xl font-black text-white tracking-tighter">${calculateTotal()}</span>
                              </div>
                            </div>
                            <div className="pt-4 border-t border-white/5 space-y-2">
                              <div className="flex justify-between text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">
                                <span>{t("checkout.base")}:</span>
                                <span>${selectedDestination?.basePrice} x {formData.guests}</span>
                              </div>
                              <div className="flex justify-between text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">
                                <span>{t("checkout.classIndex")}:</span>
                                <span>x{classMultipliers[formData.travelClass]}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Security/Trust Column */}
                        <div className="space-y-5">
                          <div className="p-8 border border-white/10 rounded-[2.5rem] bg-neutral-900 group relative">
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                                  <User className="text-amber-500" size={16} />
                                </div>
                                <h4 className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] leading-none">{t("dash.modal.step1")}</h4>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-[9px] uppercase font-black text-white/20 tracking-widest mb-1">{t("dash.modal.name")}</p>
                                  <p className="text-xs font-bold text-white">{formData.name || t("checkout.anonymous")}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] uppercase font-black text-white/20 tracking-widest mb-1">{t("auth.login.email")}</p>
                                  <p className="text-xs font-bold text-white">{formData.email || t("checkout.notProvided")}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] uppercase font-black text-white/20 tracking-widest mb-1">{t("dash.modal.phone")}</p>
                                  <p className="text-xs font-bold text-white">{formData.phone || t("checkout.notProvided")}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-8 border border-white/10 rounded-[2.5rem] bg-neutral-900 flex flex-col justify-between">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-white/5 rounded-2xl">
                                <Info className="text-blue-400" size={24} />
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-2 leading-none">{t("checkout.policy.title")}</h4>
                                <p className="text-xs text-neutral-500 leading-relaxed font-medium">{t("checkout.policy.desc")}</p>
                              </div>
                            </div>
                            <div className="mt-8 p-4 bg-white/[0.02] rounded-2xl flex items-center gap-4 border border-white/5">
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-2.5">
                                <svg viewBox="0 0 100 100" fill="black"><rect x="10" y="10" width="20" height="20" /><rect x="70" y="10" width="20" height="20" /><rect x="40" y="40" width="20" height="20" /><rect x="10" y="70" width="20" height="20" /><rect x="70" y="70" width="20" height="20" /></svg>
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{t("checkout.authCode")}</p>
                                <p className="text-[11px] font-mono text-white/60">ETH-SEC-{Math.floor(Math.random() * 99999)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button
                          disabled={isLoading}
                          onClick={handleConfirm}
                          className="w-full h-20 rounded-[2rem] bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-[0.4em] text-xs shadow-[0_20px_60px_-15px_rgba(245,158,11,0.5)] active:scale-95 transition-all overflow-hidden relative group"
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-3">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-6 h-6 border-4 border-black border-t-transparent rounded-full"
                              />
                              {t("checkout.processing")}
                            </span>
                          ) : (
                            <span className="flex items-center gap-3 relative z-10">
                              {t("checkout.confirm")} <CheckCircle2 size={20} />
                            </span>
                          )}
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </Button>
                      </div>
                    </motion.div>
                  ) : step === 3 ? (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center text-center space-y-8 py-10"
                    >
                      <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center border-2 border-amber-500/20 mb-4 border-dashed">
                        <CheckCircle2 size={48} className="text-amber-500" />
                      </div>
                      <div>
                        <h1 className="text-5xl font-black text-white tracking-tighter mb-4 italic uppercase">
                          {t("checkout.success.title").split(' ')[0]} <span className="text-amber-500">{t("checkout.success.title").split(' ')[1] || ''}</span>
                        </h1>
                        <p className="text-neutral-400 text-sm max-w-md mx-auto leading-relaxed">
                          {t("checkout.success.desc")}
                        </p>
                      </div>

                      <Button
                        onClick={() => navigate("/dashboard")}
                        className="h-16 px-10 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-amber-500/30 transition-all group"
                      >
                        {t("checkout.success.btn")} <ArrowRight size={14} className="ml-3 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* Visual Side Panel */}
              <div className="relative hidden md:flex flex-col bg-neutral-900 border-l border-white/5 overflow-hidden">
                <div className="absolute inset-0">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedDestination?.id}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 0.3, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 1.5 }}
                      src={selectedDestination?.image}
                      className="w-full h-full object-cover"
                      alt="Context"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-neutral-900 to-transparent" />
                </div>

                <div className="relative z-10 p-12 flex flex-col h-full justify-between">
                  <div>
                    <motion.div
                      key={selectedDestination?.code}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="space-y-6"
                    >
                      <span className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
                        {selectedDestination?.badge}
                      </span>
                      <h2 className="text-6xl font-black text-white mt-4 tracking-tighter leading-[0.9] italic uppercase">
                        {selectedDestination?.title.split(' ')[0]}<br />
                        <span className="text-amber-500">{selectedDestination?.title.split(' ')[1] || 'Site'}</span>
                      </h2>
                      <div className="flex items-center gap-3 text-neutral-500">
                        <MapPin size={14} className="text-amber-500" />
                        <span className="text-xs font-black uppercase tracking-widest">Sector: {selectedDestination?.code}</span>
                      </div>
                    </motion.div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-8 rounded-[2.5rem] bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl relative group overflow-hidden">
                      <div className="absolute top-0 right-0 w-2 h-full bg-amber-500/20" />
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <CreditCard size={12} /> {t("checkout.livePreview")}
                      </p>
                      <div className="space-y-5">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{t("dash.modal.class")}</span>
                          <span className="text-sm font-black text-white uppercase tracking-wider">{t(`dash.modal.class.${formData.travelClass}`)} {t("checkout.grade")}</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{t("dash.modal.step1")}</span>
                          <span className="text-sm font-black text-white truncate max-w-[120px]">{formData.name || t("auth.signup.name")}</span>
                        </div>
                        <div className="pt-5 border-t border-white/10 mt-2 flex justify-between items-center">
                          <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">{t("checkout.credits.projected")}</span>
                          <span className="text-2xl font-black text-amber-500 tracking-tighter">${calculateTotal()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
