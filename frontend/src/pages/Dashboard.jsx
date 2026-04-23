import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import Navbar from "../components/Navbar/Navbar";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Calendar as ShadcnCalendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import api from "../api/axios";
import { generateDigitalPassport } from "../utils/pdfGenerator";
import { useTranslation } from "react-i18next";
import {
  Ticket, Plane, Users, XCircle, Plus, LogOut,
  CalendarDays, MapPin, User, Phone, Mail, CreditCard,
  MessageSquare, ArrowRight, ArrowLeft, Trash2, Ban,
  Clock, CheckCircle2, AlertCircle, Globe, Download,
  Menu, Heart, Zap, Calendar as CalendarIcon, Home, ShieldCheck
} from "lucide-react";

// ─── Ethiopian Destinations ───
const destinationsList = [
  { id: "lalibela", title: "Lalibela Churches", code: "LAL", image: "/assets/images/ethiopia/image3.jpg", badge: "Heritage" },
  { id: "axum", title: "Ancient Axum", code: "AXM", image: "/assets/images/ethiopia/Ancient-Axum.jpg", badge: "Priority" },
  { id: "gondar", title: "Gondar Castles", code: "GDQ", image: "/assets/images/ethiopia/image8.jpg", badge: "Medieval" },
  { id: "harar", title: "Ancient Harar", code: "HRR", image: "/assets/images/ethiopia/Ancient harar.jpg", badge: "Walled City" },
  { id: "simien", title: "Simien Mountains", code: "SIM", image: "/assets/images/ethiopia/image3.jpg", badge: "Nature" },
  { id: "danakil", title: "Danakil Depression", code: "DNK", image: "/assets/images/ethiopia/image8.jpg", badge: "Extreme" },
  { id: "omo", title: "Omo Valley", code: "OMO", image: "/assets/images/ethiopia/Ancient harar.jpg", badge: "Culture" },
  { id: "bale", title: "Bale Mountains", code: "BAL", image: "/assets/images/ethiopia/Ancient Axum.jpg", badge: "Wildlife" },
];

// ─── Status config ───
const statusConfig = {
  pending: { color: "bg-amber-500", pulse: true, label: "dash.status.pending", Icon: Clock },
  clearance: { color: "bg-emerald-500", pulse: false, label: "dash.status.approved", Icon: CheckCircle2 },
  approved: { color: "bg-emerald-500", pulse: false, label: "dash.status.approved", Icon: CheckCircle2 },
  completed: { color: "bg-blue-500", pulse: false, label: "dash.status.completed", Icon: CheckCircle2 },
  cancelled: { color: "bg-red-500", pulse: false, label: "dash.status.cancelledStatus", Icon: XCircle },
};

// ─── Local Storage Helpers ───
const getStorageKey = (userId) => userId ? `eth_tourism_tickets_${userId}` : null;

const loadTickets = (userId) => {
  const key = getStorageKey(userId);
  if (!key) return [];
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
};

const saveTickets = (tickets, userId) => {
  const key = getStorageKey(userId);
  if (key) localStorage.setItem(key, JSON.stringify(tickets));
};

// ─── Inline Error Display ───
const FieldError = ({ message }) => {
  if (!message) return null;
  return (
    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 text-red-400 text-xs font-medium mt-1.5 ml-1">
      <AlertCircle size={12} />
      {message}
    </motion.p>
  );
};

// ─── Date Picker with shadcn Calendar ───
const DatePicker = ({ value, onChange, label, required, error, placeholder = "Pick a date" }) => {
  const [open, setOpen] = useState(false);
  const selectedDate = value ? new Date(value) : undefined;

  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1">
        {label} {required && <span className="text-amber-500">*</span>}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`h-12 w-full rounded-xl border ${error ? "border-red-500/50 bg-red-500/5" : "border-white/10 bg-white/5"} px-4 text-left text-sm font-bold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500 flex items-center gap-3`}
          >
            <CalendarDays size={16} className="text-amber-500/60 flex-shrink-0" />
            <span className={value ? "text-white" : "text-white/40"}>
              {value ? format(selectedDate, "MMM dd, yyyy") : placeholder}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-2 w-auto">
          <ShadcnCalendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              onChange(date ? format(date, "yyyy-MM-dd") : "");
              setOpen(false);
            }}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          />
        </PopoverContent>
      </Popover>
      <FieldError message={error} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════
//  TICKET MODAL — Real Tourism Booking Form
// ═══════════════════════════════════════════════════════
const TicketModal = ({ isOpen, onClose, onTicketCreated, initialUser }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    travelerName: "", phone: "", email: "", passportId: "",
    destination: "LAL", travelDate: "", returnDate: "",
    guests: 1, travelClass: "economy", specialRequests: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // Auto-fill from Profile
  useEffect(() => {
    if (isOpen && initialUser) {
      setForm(prev => ({
        ...prev,
        travelerName: initialUser.name || prev.travelerName,
        email: initialUser.email || prev.email,
        phone: initialUser.phoneNumber || prev.phone,
        passportId: initialUser.passportNumber || initialUser.nationalIdNumber || prev.passportId,
      }));
    }
  }, [isOpen, initialUser]);

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.travelerName.trim()) e.travelerName = "Full name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[\+]?[\d\s-]{7,15}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number";
    if (!form.email.trim()) e.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email address";
    if (!form.passportId.trim()) e.passportId = "Passport or ID number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.travelDate) e.travelDate = "Departure date is required";
    if (!form.destination) e.destination = "Please select a destination";
    if (form.returnDate && form.travelDate && form.returnDate < form.travelDate) e.returnDate = "Return date must be after departure";
    if (form.guests < 1) e.guests = "At least 1 traveler required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validateStep1()) setStep(2); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setIsSubmitting(true);

    const dest = destinationsList.find(d => d.code === form.destination);
    const ticket = {
      id: crypto.randomUUID(),
      travelerName: form.travelerName, phone: form.phone, email: form.email,
      passportId: form.passportId, destinationCode: form.destination,
      destinationTitle: dest?.title || form.destination,
      travelDate: form.travelDate, returnDate: form.returnDate,
      guests: form.guests, travelClass: form.travelClass,
      specialRequests: form.specialRequests, status: "pending",
      networkId: `ETH-${form.destination}-${Math.floor(Math.random() * 9000 + 1000)}`,
      issueHash: `#${Math.random().toString(36).substring(2, 8)}`,
      createdAt: new Date().toISOString(),
    };

    try {
      const { data } = await api.post("/dashboard/bookings", {
        destinationCode: form.destination,
        travelClass: form.travelClass,
        travelDate: form.travelDate,
        returnDate: form.returnDate,
        guests: form.guests,
        phone: form.phone,
        passportId: form.passportId,
        specialRequests: form.specialRequests
      });

      // Use backend record if available to ensure sync
      const finalTicket = data.id ? { ...ticket, ...data } : ticket;
      onTicketCreated(finalTicket);
    } catch (error) {
      console.error("Booking error:", error);
      // Fallback to local ticket if backend fails (optimistic UI)
      onTicketCreated(ticket);
    }

    setIsSubmitting(false);
    setStep(1);
    setErrors({});
    setForm({ travelerName: "", phone: "", email: "", passportId: "", destination: "LAL", travelDate: "", returnDate: "", guests: 1, travelClass: "economy", specialRequests: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 30 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-8 pb-0">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black tracking-tight text-white">{t("dash.modal.title")}</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
              <XCircle size={20} className="text-white/40" />
            </button>
          </div>
          <p className="text-white/40 text-sm">{t("dash.modal.subtitle")}</p>

          {/* Step Indicator */}
          <div className="flex items-center gap-3 mt-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${step === 1 ? "bg-amber-500 text-black" : "bg-white/5 text-white/40"}`}>
              <User size={14} /> {t("dash.modal.step1")}
            </div>
            <div className="w-8 h-px bg-white/10" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${step === 2 ? "bg-amber-500 text-black" : "bg-white/5 text-white/40"}`}>
              <Globe size={14} /> {t("dash.modal.step2")}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1 flex items-center gap-1.5">
                  <User size={11} className="text-white/30" /> {t("dash.modal.name")} <span className="text-amber-500">*</span>
                </label>
                <Input value={form.travelerName} onChange={e => set("travelerName", e.target.value)} placeholder="e.g. Abebe Kebede" className={`h-12 bg-white/5 rounded-xl text-white font-medium ${errors.travelerName ? "border-red-500/50 bg-red-500/5" : "border-white/10"}`} />
                <FieldError message={errors.travelerName} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1 flex items-center gap-1.5">
                    <Phone size={11} className="text-white/30" /> {t("dash.modal.phone")} <span className="text-amber-500">*</span>
                  </label>
                  <Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+251 9XX XXX XXX" className={`h-12 bg-white/5 rounded-xl text-white font-medium ${errors.phone ? "border-red-500/50 bg-red-500/5" : "border-white/10"}`} />
                  <FieldError message={errors.phone} />
                </div>
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1 flex items-center gap-1.5">
                    <Mail size={11} className="text-white/30" /> {t("auth.login.email")} <span className="text-amber-500">*</span>
                  </label>
                  <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" className={`h-12 bg-white/5 rounded-xl text-white font-medium ${errors.email ? "border-red-500/50 bg-red-500/5" : "border-white/10"}`} />
                  <FieldError message={errors.email} />
                </div>
              </div>

              {/* Passport / ID */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1 flex items-center gap-1.5">
                  <CreditCard size={11} className="text-white/30" /> {t("dash.modal.passport")} <span className="text-amber-500">*</span>
                </label>
                <Input value={form.passportId} onChange={e => set("passportId", e.target.value)} placeholder="e.g. EP1234567" className={`h-12 bg-white/5 rounded-xl text-white font-medium ${errors.passportId ? "border-red-500/50 bg-red-500/5" : "border-white/10"}`} />
                <FieldError message={errors.passportId} />
              </div>

              <Button type="button" onClick={handleNext} className="w-full h-12 rounded-xl font-bold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all flex items-center justify-center gap-2">
                {t("dash.modal.next")} <ArrowRight size={16} />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              {/* Destination */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1 flex items-center gap-1.5">
                  <MapPin size={11} className="text-white/30" /> {t("dash.modal.destination")} <span className="text-amber-500">*</span>
                </label>
                <select value={form.destination} onChange={e => set("destination", e.target.value)} className={`w-full h-12 bg-white/5 border rounded-xl px-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer ${errors.destination ? "border-red-500/50" : "border-white/10"}`}>
                  {destinationsList.map(d => <option key={d.id} value={d.code} className="bg-neutral-900">{d.title} ({d.code})</option>)}
                </select>
                <FieldError message={errors.destination} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DatePicker label={t("dash.modal.departure")} required value={form.travelDate} onChange={v => set("travelDate", v)} error={errors.travelDate} placeholder={t("dash.modal.departure")} />
                <DatePicker label={t("dash.modal.return")} value={form.returnDate} onChange={v => set("returnDate", v)} error={errors.returnDate} placeholder={t("dash.modal.return")} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Guests */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1 flex items-center gap-1.5">
                    <Users size={11} className="text-white/30" /> {t("dash.modal.guests")}
                  </label>
                  <Input type="number" min="1" max="20" value={form.guests} onChange={e => set("guests", Number(e.target.value))} className={`h-12 bg-white/5 rounded-xl text-white font-bold ${errors.guests ? "border-red-500/50" : "border-white/10"}`} />
                  <FieldError message={errors.guests} />
                </div>
                {/* Class */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1 flex items-center gap-1.5">
                    <Plane size={11} className="text-white/30" /> {t("dash.modal.class")}
                  </label>
                  <select value={form.travelClass} onChange={e => set("travelClass", e.target.value)} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer">
                    <option value="economy" className="bg-neutral-900">{t("dash.modal.class.economy")}</option>
                    <option value="business" className="bg-neutral-900">{t("dash.modal.class.business")}</option>
                    <option value="first" className="bg-neutral-900">{t("dash.modal.class.first")}</option>
                  </select>
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1 flex items-center gap-1.5">
                  <MessageSquare size={11} className="text-white/30" /> {t("dash.modal.requests")}
                </label>
                <textarea value={form.specialRequests} onChange={e => set("specialRequests", e.target.value)} placeholder="Dietary needs, accessibility, preferences..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
              </div>

              <div className="flex gap-3">
                <Button type="button" onClick={() => setStep(1)} variant="outline" className="h-12 px-6 rounded-xl font-bold border-white/10 text-white hover:bg-white/5 flex items-center gap-2">
                  <ArrowLeft size={16} /> {t("dash.modal.back")}
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 h-12 rounded-xl font-black bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] uppercase tracking-widest text-xs">
                  {isSubmitting ? t("dash.modal.generating") : t("dash.modal.submit")}
                </Button>
              </div>
            </motion.div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
//  DASHBOARD — Main Component
// ═══════════════════════════════════════════════════════
const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // ─── State ───
  const [activeTab, setActiveTab] = useState("overview"); // overview, bookings, favorites, settings
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("Explorer");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Profile Form State
  const [formData, setFormData] = useState({ fullName: "", nationalIdNumber: "", passportNumber: "", phoneNumber: "" });
  const [isSaving, setIsSaving] = useState(false);

  const BACKEND_URL = "https://ethiopia-tourism.onrender.com";

  // ─── Data Fetching ───
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statusRes, favsRes] = await Promise.all([
          api.get("/dashboard/status"),
          api.get("/tourism/favorites")
        ]);

        if (statusRes.data.user) {
          const userData = statusRes.data.user;
          setUser(userData);
          setUserName(userData.name);
          setFormData({ 
            fullName: userData.name || userData.full_name || "", 
            nationalIdNumber: userData.nationalIdNumber || userData.national_id_number || "", 
            passportNumber: userData.passportNumber || userData.passport_number || "",
            phoneNumber: userData.phoneNumber || userData.phone_number || userData.phone || ""
          });
          
          const savedAvatar = userData.avatar_url || localStorage.getItem("userAvatar");
          if (savedAvatar) {
            setAvatarUrl(savedAvatar.startsWith('http') ? savedAvatar : `${BACKEND_URL}${savedAvatar}`);
          }

          setBookings(statusRes.data.bookings || []);
          setFavorites(favsRes.data || []);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { data } = await api.put("/auth/profile", formData);
      setUser(data.user);
      setUserName(data.user.name);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTicketCreated = (ticket) => {
    setBookings(prev => [ticket, ...prev]);
  };

  const handleCancel = async (id) => {
    setBookings(prev => prev.map(t => t.id === id ? { ...t, status: "cancelled" } : t));
    try { await api.patch(`/dashboard/bookings/${id}/cancel`); } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    setBookings(prev => prev.filter(t => t.id !== id));
    try { await api.delete(`/dashboard/bookings/${id}`); } catch (err) { console.error(err); }
  };

  // ─── Components ───

  const SidebarItem = ({ id, icon: Icon, label, danger }) => (
    <button
      onClick={() => {
        if (id === 'logout') {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        if (id === 'home') {
          navigate("/");
          return;
        }
        setActiveTab(id);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
        activeTab === id 
        ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" 
        : danger 
          ? "text-red-400 hover:bg-red-500/10" 
          : "text-white/40 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon size={20} className={activeTab === id ? "" : "group-hover:scale-110 transition-transform"} />
      <span className="text-sm font-black uppercase tracking-widest">{label}</span>
      {activeTab === id && (
        <motion.div layoutId="activeGlow" className="ml-auto w-1.5 h-1.5 rounded-full bg-black shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
      )}
    </button>
  );

  const TravelStats = () => (
    <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-500/20 rounded-xl text-amber-500">
          <Zap size={16} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Explorer Analytics</span>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-[10px] uppercase font-black tracking-widest mb-2">
            <span className="text-white/40">Rank: Elite I</span>
            <span className="text-amber-500">75% to Master</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: "75%" }} className="h-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
            <p className="text-[9px] uppercase font-black tracking-widest text-white/20 mb-1">Regions</p>
            <p className="text-xl font-black text-white">04</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
            <p className="text-[9px] uppercase font-black tracking-widest text-white/20 mb-1">Level</p>
            <p className="text-xl font-black text-amber-500">{user?.explorer_level || 1}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center">
          <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full mb-8 shadow-[0_0_30px_rgba(245,158,11,0.2)]" />
          <p className="text-[10px] uppercase font-black tracking-[0.4em] text-amber-500 animate-pulse">Initializing Interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-amber-500/30 font-sans overflow-x-hidden">
      <TicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTicketCreated={handleTicketCreated} 
        initialUser={user}
      />

      {/* ── Sidebar (Desktop) ── */}
      <aside className="hidden lg:flex w-80 flex-col fixed inset-y-0 bg-neutral-950 border-r border-white/5 p-8 z-40">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
            <Plane size={24} strokeWidth={3} />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">Command<span className="text-amber-500">Center</span></span>
        </div>

        <nav className="flex-1 space-y-2 mt-4">
          <SidebarItem id="overview" icon={Ticket} label="Overview" />
          <SidebarItem id="bookings" icon={CalendarIcon} label="Expeditions" />
          <SidebarItem id="favorites" icon={Heart} label="Favorites" />
          <SidebarItem id="settings" icon={User} label="Settings" />
        </nav>

        <div className="mt-auto space-y-6">
          <div className="pt-6 border-t border-white/5 space-y-2">
             <SidebarItem id="logout" icon={LogOut} label="Log Out" danger />
          </div>
        </div>
      </aside>

      {/* ── Mobile Navigation ── */}
      <header className="lg:hidden fixed top-0 w-full z-[60] bg-neutral-950/80 backdrop-blur-xl border-b border-white/5 p-6 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-black">
            <Plane size={18} strokeWidth={3} />
          </div>
          <span className="text-lg font-black tracking-tighter uppercase">Command</span>
        </button>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-white/5 rounded-2xl text-white">
          {isSidebarOpen ? <XCircle size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -100 }}
            className="lg:hidden fixed inset-0 z-50 bg-neutral-950 p-8 flex flex-col pt-32"
          >
            <nav className="flex-1 space-y-2">
              <SidebarItem id="overview" icon={Ticket} label="Overview" />
              <SidebarItem id="bookings" icon={CalendarIcon} label="Expeditions" />
              <SidebarItem id="favorites" icon={Heart} label="Favorites" />
              <SidebarItem id="settings" icon={User} label="Settings" />
              <div className="pt-4 mt-4 border-t border-white/5 space-y-2">
                <SidebarItem id="home" icon={Home} label="Return Home" />
                <SidebarItem id="logout" icon={LogOut} label="Log Out" danger />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content Area ── */}
      <main className="lg:ml-80 min-h-screen relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/4 translate-y-1/4" />

        {/* ── Top Navigation Bar ── */}
        <div className="hidden lg:flex w-full h-20 items-center justify-between px-12 border-b border-white/5 relative z-20">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 text-white/50 hover:text-amber-500 transition-colors group">
            <div className="w-8 h-8 rounded-md bg-white/5 group-hover:bg-amber-500/10 flex items-center justify-center transition-colors">
              <Home size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Main Site</span>
          </button>
          
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
                <span className="text-white text-xs font-bold uppercase">{userName}</span>
                <span className="text-amber-500 text-[10px] uppercase font-black tracking-widest">Active Connection</span>
             </div>
          </div>
        </div>

        <div className="p-8 pt-32 lg:pt-12 lg:p-12 max-w-6xl mx-auto relative z-10">
          
          {/* ── Tab Content ── */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-12"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="flex items-center gap-8">
                    <div className="relative">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-amber-500/10 border-2 border-white/5 overflow-hidden shadow-2xl">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="P" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-amber-500 bg-white/5">
                            <User size={48} />
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-neutral-900 border border-white/10 px-3 py-1 rounded-full text-[10px] font-black text-amber-500 uppercase tracking-widest shadow-xl">
                        LVL {user?.explorer_level || 1}
                      </div>
                    </div>
                    <div className="space-y-2">
                       <span className="text-amber-500 font-black tracking-widest uppercase text-xs">Mission Intelligence</span>
                       <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">Welcome, {userName}</h1>
                       <p className="text-white/40 font-medium">Monitoring {bookings.length} active expeditions across the Horn.</p>
                    </div>
                  </div>
                  <Button onClick={() => setIsModalOpen(true)} className="h-14 px-8 rounded-2xl font-black bg-white text-black hover:bg-amber-500 transition-all flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 uppercase text-xs tracking-widest">
                    <Plus size={18} strokeWidth={3} /> {t("dash.addTicket")}
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Active Expeditions", value: bookings.filter(t => t.status !== 'cancelled').length, icon: Plane, color: "text-emerald-400" },
                    { label: "Total Waypoints", value: favorites.length, icon: Heart, color: "text-red-400" },
                    { label: "Travel NetworkHash", value: `#${Math.random().toString(36).substring(7).toUpperCase()}`, icon: Globe, color: "text-blue-400" },
                  ].map((stat, i) => (
                    <div key={i} className="p-8 bg-white/[0.03] border border-white/5 rounded-[2.5rem] backdrop-blur-xl">
                       <div className="flex justify-between items-start mb-4">
                         <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                           <stat.icon size={20} />
                         </div>
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">{stat.label}</p>
                       <p className="text-3xl font-black text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Activity Mini Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-2">Recent Booking</h3>
                      {bookings.length > 0 ? (
                        <div className="p-8 bg-neutral-900 border border-white/5 rounded-[2.5rem] flex items-center gap-6 group cursor-pointer" onClick={() => setActiveTab('bookings')}>
                           <div className="w-16 h-16 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 bg-neutral-800">
                              <img src={destinationsList.find(d => d.code === bookings[0].destinationCode)?.image || "/assets/images/ethiopia/image3.jpg"} className="w-full h-full object-cover" alt="dest" />
                           </div>
                           <div className="flex-1">
                              <h4 className="font-black text-white group-hover:text-amber-500 transition-colors uppercase">
                                 {destinationsList.find(d => d.code === bookings[0].destinationCode)?.title || bookings[0].destinationTitle || bookings[0].destinationCode || "Unknown Location"}
                              </h4>
                              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                 {bookings[0].departureDate || bookings[0].travelDate || "TBA"}
                              </p>
                           </div>
                           <ArrowRight className="text-white/20 group-hover:text-amber-500 transition-colors" />
                        </div>
                      ) : (
                        <div className="h-32 border border-dashed border-white/10 rounded-[2.5rem] flex items-center justify-center text-white/20 uppercase text-[10px] font-black tracking-widest">No active logs</div>
                      )}
                   </div>
                   <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 ml-2">Favorite Waypoint</h3>
                      {favorites.length > 0 ? (
                        <div className="p-8 bg-neutral-900 border border-white/5 rounded-[2.5rem] flex items-center gap-6 group cursor-pointer" onClick={() => setActiveTab('favorites')}>
                           <div className="w-16 h-16 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 bg-neutral-800">
                              <img src={favorites[0].destination?.image || "/assets/images/ethiopia/image8.jpg"} className="w-full h-full object-cover" alt="fav" />
                           </div>
                           <div className="flex-1">
                              <h4 className="font-black text-white group-hover:text-amber-500 transition-colors uppercase">{favorites[0].destination?.title || "Unknown Destination"}</h4>
                              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{favorites[0].destination?.region || "Ethiopia"}</p>
                           </div>
                           <ArrowRight className="text-white/20 group-hover:text-amber-500 transition-colors" />
                        </div>
                      ) : (
                        <div className="h-32 border border-dashed border-white/10 rounded-[2.5rem] flex items-center justify-center text-white/20 uppercase text-[10px] font-black tracking-widest">No saved waypoints</div>
                      )}
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'bookings' && (
              <motion.div 
                key="bookings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="mb-12">
                   <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Expedition Logs</h2>
                   <p className="text-white/40 font-medium lowercase">Secure monitoring of all registered travel credentials.</p>
                </div>
                
                {bookings.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {bookings.map(ticket => {
                      const sc = statusConfig[ticket.status] || statusConfig.pending;
                      const dest = destinationsList.find(d => d.code === ticket.destinationCode);
                      return (
                        <Card key={ticket.id} className="bg-neutral-900/60 border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl group hover:border-amber-500/30 transition-all duration-500 shadow-2xl">
                          <CardContent className="p-0 flex flex-col md:flex-row">
                            <div className="w-full md:w-64 h-40 md:h-auto relative overflow-hidden bg-neutral-800 flex items-center justify-center">
                              <img src={`${dest?.image || "/assets/images/ethiopia/image3.jpg"}?v=1`} className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 hover:scale-110" alt="Expedition Visual" />
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-900/90" />
                            </div>
                            <div className="flex-1 p-8">
                               <div className="flex justify-between items-start mb-6">
                                  <div>
                                    <h3 className="text-2xl font-black tracking-tight uppercase group-hover:text-amber-500 transition-colors">{ticket.destinationTitle}</h3>
                                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mt-1 tracking-[0.2em]">{ticket.networkId}</p>
                                  </div>
                                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5">
                                    <sc.Icon size={12} className={sc.color.replace("bg-", "text-")} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{t(sc.label)}</span>
                                  </div>
                               </div>
                               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">Traveler</p>
                                    <p className="text-sm font-bold text-white truncate">{ticket.travelerName || userName}</p>
                                  </div>
                                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">Departure</p>
                                    <p className="text-sm font-bold text-white">{ticket.travelDate || ticket.departure_date || "N/A"}</p>
                                  </div>
                                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">Class</p>
                                    <p className="text-sm font-bold text-white uppercase">{ticket.travelClass || "Economy"}</p>
                                  </div>
                                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">Guests</p>
                                    <p className="text-sm font-bold text-white">{ticket.guests || 1} PAX</p>
                                  </div>
                               </div>
                               <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/10">
                                  {ticket.status !== 'cancelled' && (
                                    <Button onClick={() => generateDigitalPassport(ticket, userName, t)} className="w-full sm:w-auto h-12 px-6 rounded-xl font-bold bg-amber-500 text-black hover:bg-amber-600 transition-all uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20">
                                      <Download size={14} /> Download PDF
                                    </Button>
                                  )}
                                  {ticket.status !== 'cancelled' ? (
                                    <Button onClick={() => handleCancel(ticket.id)} variant="outline" className="w-full sm:w-auto h-12 px-6 rounded-xl font-bold border-white/10 text-red-500 hover:bg-red-500/10 uppercase text-[10px] tracking-widest">
                                      Cancel Expedition
                                    </Button>
                                  ) : (
                                    <Button onClick={() => handleDelete(ticket.id)} variant="outline" className="w-full sm:w-auto h-12 px-6 rounded-xl font-bold border-white/10 text-white/40 hover:bg-white/10 uppercase text-[10px] tracking-widest">
                                      Remove Log
                                    </Button>
                                  )}
                               </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-96 border-2 border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center p-12">
                     <Ticket size={48} className="text-white/10 mb-6" />
                     <h3 className="text-2xl font-black uppercase mb-2">No expeditions found</h3>
                     <p className="text-white/30 max-w-sm lowercase mb-8 text-sm">Begin your journey by registering a new travel protocol.</p>
                     <Button onClick={() => setIsModalOpen(true)} className="h-12 px-8 rounded-2xl bg-amber-500 text-black font-black uppercase text-xs tracking-widest">Initialize Booking</Button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'favorites' && (
              <motion.div 
                key="favorites"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="mb-12">
                   <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Favorite Destinations</h2>
                   <p className="text-white/40 font-medium lowercase">Bookmarked locations for future reconnaissance.</p>
                </div>

                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((dest, i) => (
                      <motion.div 
                        key={dest.id} 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ delay: i * 0.05 }}
                        className="group relative h-80 rounded-[2.5rem] overflow-hidden bg-neutral-800 border border-white/5 cursor-pointer shadow-xl flex items-center justify-center"
                        onClick={() => navigate(`/destinations/${dest.destinationId}`)}
                      >
                         <img src={dest.destination?.image || "/assets/images/ethiopia/image3.jpg"} className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" alt="fav-img" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                         <div className="absolute top-6 right-6">
                            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg">
                               <Heart size={18} fill="currentColor" />
                            </div>
                         </div>
                         <div className="absolute bottom-8 left-8 right-8">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-2 block">{dest.destination?.badge || "Exploration"}</span>
                            <h3 className="text-2xl font-black uppercase leading-none mb-1">{dest.destination?.title || "Unknown Destination"}</h3>
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{dest.destination?.code || "N/A"}</p>
                         </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="h-96 border-2 border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center p-12">
                    <Heart size={48} className="text-white/10 mb-6" />
                    <h3 className="text-2xl font-black uppercase mb-2">No Favorites Yet</h3>
                    <p className="text-white/30 max-w-sm lowercase mb-8 text-sm">Mark destinations with the heart icon to save them to your Favorites.</p>
                    <Button onClick={() => navigate('/destinations')} className="h-12 px-8 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-widest hover:bg-amber-500 transition-colors">Browse Destinations</Button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="mb-12">
                   <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Traveler Identity</h2>
                   <p className="text-white/40 font-medium lowercase">Update your credentials and personal travel protocols.</p>
                </div>

                <div className="max-w-2xl bg-neutral-900/40 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-2xl">
                   <form onSubmit={handleProfileUpdate} className="space-y-8">
                     <div className="flex items-center gap-8 border-b border-white/5 pb-8 mb-8">
                        <div className="w-24 h-24 rounded-[2rem] bg-amber-500/10 border border-white/10 overflow-hidden flex items-center justify-center relative group">
                           {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover" alt="av" /> : <User size={40} className="text-amber-500" />}
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-xl font-black uppercase text-amber-500">{userName}</h4>
                           <p className="text-white/30 text-xs font-bold uppercase tracking-widest">{user?.email}</p>
                           <div className="flex items-center gap-2 mt-2">
                             <ShieldCheck size={14} className="text-emerald-500" />
                             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Verified Credentials</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Full Legal Name</label>
                           <Input 
                             value={formData.fullName} 
                             onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                             className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-bold text-white focus:border-amber-500/50 transition-all font-sans"
                             placeholder="Enter your full name"
                           />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Phone Activation #</label>
                           <Input 
                             value={formData.phoneNumber} 
                             onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                             className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-bold text-white focus:border-amber-500/50 transition-all font-mono"
                             placeholder="+251 9XX XXX XXX"
                           />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">National ID Number</label>
                              <Input 
                                value={formData.nationalIdNumber} 
                                onChange={(e) => setFormData({...formData, nationalIdNumber: e.target.value})}
                                className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-bold text-white focus:border-amber-500/50 transition-all font-mono"
                                placeholder="ID Protocol #"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Passport Number</label>
                              <Input 
                                value={formData.passportNumber} 
                                onChange={(e) => setFormData({...formData, passportNumber: e.target.value})}
                                className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-bold text-white focus:border-amber-500/50 transition-all font-mono"
                                placeholder="Global Serial #"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="pt-6">
                        <Button 
                          type="submit" 
                          disabled={isSaving}
                          className={`w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl ${
                            isSaving ? "bg-white/10 text-white/40" : "bg-amber-500 text-black hover:bg-amber-600 hover:scale-[1.02] active:scale-95 shadow-amber-500/20"
                          }`}
                        >
                          {isSaving ? "Synchronizing..." : "Commit Changes"}
                        </Button>
                     </div>
                   </form>
                </div>

                {/* Additional Settings Features */}
                <div className="pt-12 space-y-8">
                   <div className="mb-8">
                      <h3 className="text-3xl font-black tracking-tighter uppercase mb-2">Explorer Analytics</h3>
                      <p className="text-white/40 font-medium lowercase">Mission statistics and progress metrics.</p>
                   </div>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left: Travel Stats */}
                      <TravelStats />

                      {/* Right: Security & Preferences */}
                      <div className="bg-neutral-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl shadow-2xl space-y-6">
                         <h4 className="text-xs font-black tracking-widest uppercase text-amber-500 mb-6 border-b border-white/5 pb-4">Security & Preferences</h4>
                         
                         <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:border-amber-500/50 transition-colors group">
                               <div className="flex items-center gap-4">
                                  <ShieldCheck className="text-emerald-500 group-hover:scale-110 transition-transform" size={18} />
                                  <span className="font-bold uppercase tracking-widest text-[10px] text-white">Two-Factor Auth</span>
                               </div>
                               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">Enabled</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:border-amber-500/50 transition-colors group">
                               <div className="flex items-center gap-4">
                                  <Globe className="text-blue-500 group-hover:scale-110 transition-transform" size={18} />
                                  <span className="font-bold uppercase tracking-widest text-[10px] text-white">Language / Data</span>
                               </div>
                               <ArrowRight className="text-white/20 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" size={16} />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:border-amber-500/50 transition-colors group">
                               <div className="flex items-center gap-4">
                                  <Download className="text-neutral-400 group-hover:scale-110 transition-transform" size={18} />
                                  <span className="font-bold uppercase tracking-widest text-[10px] text-white">Export Logs (.csv)</span>
                               </div>
                               <ArrowRight className="text-white/20 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" size={16} />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
};


export default Dashboard;
