import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../api/axios";
import DestinationManager from "../components/Admin/DestinationManager";
import TourManager from "../components/Admin/TourManager";
import { useTranslation } from "react-i18next";

// SVG Icons
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const SortIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5h10"/><path d="M11 9h7"/><path d="M11 13h4"/><path d="M3 17l3 3 3-3"/><path d="M6 18V4"/></svg>;
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const ToursIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1"/><path d="m11 17-7-7c-1.1-1.1-1.1-2.9 0-4l3-3c1.1-1.1 2.9-1.1 4 0l7 7c1.1 1.1 1.1 2.9 0 4l-3 3c-1.1 1.1-2.9 1.1-4 0Z"/><path d="m15 5 4 4"/></svg>;

const AdminDashboard = ({ onLogout }) => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStartTime] = useState(Date.now()); // Track when dashboard was opened
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, destinations, tours
  
  // Modals & Navigation
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("createdAt"); 
  const [sortDir, setSortDir] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, PENDING, APPROVED, CANCELLED, NEW
  const [newRegistrations, setNewRegistrations] = useState(0);

  const fetchBookings = async (isBackgroundPolling = false) => {
    try {
      const { data } = await api.get("/admin/bookings");
      
      setBookings(prev => {
        if (isBackgroundPolling && prev.length > 0 && data.length > prev.length) {
          setNewRegistrations(count => count + (data.length - prev.length));
        }
        return data; 
      });
      
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      if (!isBackgroundPolling) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBookings();
    const intervalId = setInterval(() => fetchBookings(true), 10000);
    return () => clearInterval(intervalId);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/bookings/${id}/status`, { status });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(prev => ({ ...prev, status }));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(t("admin.error.status"));
    }
  };

  const handleViewNewRegistrations = () => {
    setStatusFilter("NEW");
    setNewRegistrations(0);
    fetchBookings();
  };

  const filteredAndSortedBookings = useMemo(() => {
    let result = [...bookings];

    if (statusFilter !== "ALL") {
      result = result.filter(b => {
        if (statusFilter === "PENDING") return b.status === "pending";
        if (statusFilter === "APPROVED") return b.status === "clearance" || b.status === "completed";
        if (statusFilter === "CANCELLED") return b.status === "cancelled";
        if (statusFilter === "NEW") return new Date(b.createdAt).getTime() > sessionStartTime;
        return true;
      });
    }

    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(b => 
        (b.user?.fullName && b.user.fullName.toLowerCase().includes(lowerQ)) ||
        (b.destinationCode && b.destinationCode.toLowerCase().includes(lowerQ)) ||
        (b.networkId && b.networkId.toLowerCase().includes(lowerQ))
      );
    }

    result.sort((a, b) => {
      let valA, valB;
      if (sortField === "name") {
        valA = a.user?.fullName?.toLowerCase() || "";
        valB = b.user?.fullName?.toLowerCase() || "";
      } else if (sortField === "status") {
        valA = a.status || "";
        valB = b.status || "";
      } else {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [bookings, searchQuery, sortField, sortDir, statusFilter, sessionStartTime]);

  const totalBookings = bookings.length;
  const pendingClearanceCount = bookings.filter(b => b.status === "pending").length;
  const approvedCount = bookings.filter(b => b.status === "clearance" || b.status === "completed").length;
  const revenue = totalBookings * 1250; 

  const destinationCounts = useMemo(() => {
    const counts = {};
    bookings.forEach(b => {
      const dest = b.destinationCode || "UNK";
      counts[dest] = (counts[dest] || 0) + 1;
    });
    const maxVal = Math.max(...Object.values(counts), 1);
    return Object.entries(counts).map(([name, count]) => ({
      name, 
      count, 
      heightPercentage: Math.max((count / maxVal) * 100, 5) 
    })).sort((a,b) => b.count - a.count).slice(0, 5); 
  }, [bookings]);

  const getStatusColor = (status) => {
    switch (status) {
      case "clearance": 
      case "completed": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-amber-500/30 w-full flex">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {newRegistrations > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 right-6 z-[100] bg-neutral-900 border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.15)] rounded-2xl p-4 flex items-center gap-4 cursor-pointer"
            onClick={handleViewNewRegistrations}
          >
            <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 relative flex-shrink-0">
              <BellIcon />
              <span className="absolute top-0 right-0 w-3 h-3 bg-amber-500 rounded-full animate-ping"></span>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{t("dash.tickets.new")}</h4>
              <p className="text-xs text-neutral-400">{newRegistrations} {t("dash.tickets.applied")}</p>
            </div>
            <button className="text-xs font-bold text-black px-3 py-1.5 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors ml-2">
              {t("admin.view")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setSelectedBooking(null)} 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
                <div>
                  <h3 className="text-xl font-black">{t("dash.tickets.details")}</h3>
                  <p className="text-xs text-neutral-500 font-mono mt-1">{selectedBooking.networkId}</p>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="p-2 bg-neutral-800/50 hover:bg-neutral-800 rounded-full transition-colors">
                  <CloseIcon />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                
                {/* Traveler Info */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">{t("admin.modal.identity")}</h4>
                  <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">{t("dash.modal.name")}</p>
                      <p className="text-sm font-bold">{selectedBooking.user?.fullName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">{t("auth.login.email")}</p>
                      <p className="text-sm font-bold truncate">{selectedBooking.user?.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">{t("dash.modal.phone")}</p>
                      <p className="text-sm font-bold">{selectedBooking.phone || t("checkout.notProvided")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">{t("dash.modal.passport")}</p>
                      <p className="text-sm font-bold">{selectedBooking.passportId || t("checkout.notProvided")}</p>
                    </div>
                  </div>
                </div>

                {/* Trip Info */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">{t("admin.modal.trip")}</h4>
                  <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">{t("dash.modal.destination")}</p>
                      <p className="text-sm font-bold text-amber-500">{selectedBooking.destinationCode}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">{t("dash.modal.class")}</p>
                      <p className="text-sm font-bold capitalize">{t(`dash.modal.class.${selectedBooking.travelClass}`)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">{t("dash.modal.departure")}</p>
                      <p className="text-sm font-bold">{selectedBooking.departureDate ? new Date(selectedBooking.departureDate).toLocaleDateString() : "TBD"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">{t("dash.modal.guests")}</p>
                      <p className="text-sm font-bold">{selectedBooking.guests}</p>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">{t("admin.modal.requests")}</h4>
                  <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
                    <p className="text-sm text-neutral-300 whitespace-pre-wrap">{selectedBooking.specialRequests || "No special requests provided."}</p>
                  </div>
                </div>

                {/* Status Log */}
                <div className="flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded-2xl">
                   <p className="text-sm font-bold">{t("admin.modal.status")}:</p>
                   <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${getStatusColor(selectedBooking.status)}`}>
                     {(selectedBooking.status || "Unknown").replace("_", " ")}
                   </span>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="p-6 border-t border-neutral-800 bg-neutral-950 flex justify-end gap-3">
                {selectedBooking.status !== 'clearance' && selectedBooking.status !== 'completed' && (
                  <button 
                    onClick={() => { updateStatus(selectedBooking.id, "clearance"); setSelectedBooking(null); }}
                    className="px-6 py-2.5 bg-emerald-500 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    {t("admin.modal.approve")}
                  </button>
                )}
                {selectedBooking.status !== 'cancelled' && (
                  <button 
                    onClick={() => { updateStatus(selectedBooking.id, "cancelled"); setSelectedBooking(null); }}
                    className="px-6 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-red-500/20 transition-colors"
                  >
                    {t("admin.modal.reject")}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-neutral-800 bg-[#0a0a0a] flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none text-white">{t("admin.nav.staff")}</h1>
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mt-1">{t("admin.nav.control")}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <p className="px-3 text-xs font-bold text-neutral-600 uppercase tracking-widest mb-2 mt-4">{t("admin.nav.menu")}</p>
          <button onClick={() => setActiveTab("dashboard")} className={`flex items-center w-full text-left gap-3 px-3 py-2.5 rounded-xl font-bold transition-all border ${activeTab === 'dashboard' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900'}`}>
            <DashboardIcon /> {t("admin.nav.dashboard")}
          </button>
          <button onClick={() => setActiveTab("destinations")} className={`flex items-center w-full text-left gap-3 px-3 py-2.5 rounded-xl font-bold transition-all border ${activeTab === 'destinations' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900'}`}>
            <GlobeIcon /> {t("admin.nav.destinations")}
          </button>
          <button onClick={() => setActiveTab("tours")} className={`flex items-center w-full text-left gap-3 px-3 py-2.5 rounded-xl font-bold transition-all border ${activeTab === 'tours' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900'}`}>
            <ToursIcon /> {t("admin.nav.tours")}
          </button>
          <button className="flex items-center w-full text-left gap-3 px-3 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            {t("admin.nav.travelers")}
          </button>
        </nav>

        <div className="p-4 border-t border-neutral-800 flex flex-col gap-2">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all font-medium">
            <GlobeIcon /> {t("common.back")}
          </Link>
          <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all font-medium text-left">
            <LogoutIcon /> {t("admin.nav.logout")}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white">
                {activeTab === 'dashboard' ? t("admin.header.overview") : activeTab === 'destinations' ? t("admin.nav.destinations") : t("admin.nav.tours")}
              </h2>
              <p className="text-neutral-400 mt-1">
                {activeTab === 'dashboard' ? t("admin.header.metrics") : activeTab === 'destinations' ? t("admin.header.manageDest") : t("admin.header.manageTours")}
              </p>
            </div>
            
             <div className="flex md:hidden w-full gap-2 border-t border-neutral-800 pt-4 overflow-x-auto hide-scroll pb-2">
                <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 text-center rounded-lg text-xs font-medium border shrink-0 ${activeTab === 'dashboard' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-neutral-900 border-neutral-800'}`}>{t("admin.nav.dashboard")}</button>
                <button onClick={() => setActiveTab('destinations')} className={`px-4 py-2 text-center rounded-lg text-xs font-medium border shrink-0 ${activeTab === 'destinations' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-neutral-900 border-neutral-800'}`}>{t("admin.nav.destinations")}</button>
                <button onClick={() => setActiveTab('tours')} className={`px-4 py-2 text-center rounded-lg text-xs font-medium border shrink-0 ${activeTab === 'tours' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-neutral-900 border-neutral-800'}`}>{t("admin.nav.tours")}</button>
                <button onClick={onLogout} className="px-4 py-2 text-center bg-red-500/10 text-red-500 rounded-lg text-xs font-medium border border-red-500/20 shrink-0">{t("admin.nav.logout")}</button>
             </div>
          </header>

          {activeTab === "destinations" ? (
            <DestinationManager />
          ) : activeTab === "tours" ? (
            <TourManager />
          ) : (
            <>
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: t("admin.metric.total"), value: totalBookings, prefix: null },
                { label: t("admin.metric.pending"), value: pendingClearanceCount, prefix: null, color: "text-amber-500" },
                { label: t("admin.metric.approved"), value: approvedCount, prefix: null, color: "text-emerald-500" },
                { label: t("admin.metric.revenue"), value: revenue.toLocaleString(), prefix: "$", color: "text-white" },
              ].map((metric, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-neutral-900/50 border border-neutral-800/80 p-6 rounded-3xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-[40px] pointer-events-none" />
                  <p className="text-xs uppercase tracking-widest font-bold text-neutral-500 mb-3">{metric.label}</p>
                  <div className="text-4xl font-black tracking-tight flex items-baseline gap-1">
                    {metric.prefix && <span className="text-xl text-neutral-600 mr-1">{metric.prefix}</span>}
                    <span className={metric.color || "text-white"}>{metric.value}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Destination Graph */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-neutral-900/50 border border-neutral-800/80 p-6 rounded-3xl flex flex-col"
            >
               <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6">{t("admin.graph.title")}</h3>
               <div className="flex-1 flex items-end justify-between gap-2 h-40">
                  {destinationCounts.length > 0 ? (
                    destinationCounts.map((dest, i) => (
                      <div key={dest.name} className="flex flex-col items-center gap-3 w-full group">
                        <div className="w-full relative flex justify-center bg-neutral-950 rounded-t-lg overflow-hidden border border-neutral-800/50 border-b-0 h-[120px]">
                           <motion.div 
                             initial={{ height: 0 }}
                             animate={{ height: `${dest.heightPercentage}%` }}
                             transition={{ duration: 1, delay: i * 0.1 }}
                             className="absolute bottom-0 w-full bg-gradient-to-t from-amber-600/20 to-amber-500 rounded-t-sm group-hover:from-amber-500 group-hover:to-amber-300 transition-colors"
                           />
                           <span className="absolute bottom-1 text-[10px] font-bold z-10 text-black/80">{dest.count}</span>
                        </div>
                        <span className="text-xs font-bold text-neutral-500 tracking-wider">{dest.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-neutral-600 font-medium">Insufficient Data</div>
                  )}
               </div>
            </motion.div>
          </div>

          {/* Data Table Section */}
          <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-3xl overflow-hidden flex flex-col">
            
            <div className="p-4 md:p-6 border-b border-neutral-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto overflow-hidden">
                <h2 className="text-xl font-bold tracking-tight shrink-0">{t("admin.table.itineraries")}</h2>
                
                {/* Filter Tabs */}
                <div className="flex bg-neutral-950 border border-neutral-800 rounded-xl p-1 overflow-x-auto w-full lg:w-auto scrollbar-hide">
                  {["ALL", "NEW", "PENDING", "APPROVED", "CANCELLED"].map(filterTab => (
                    <button
                      key={filterTab}
                      onClick={() => setStatusFilter(filterTab)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-widest transition-all whitespace-nowrap ${
                        statusFilter === filterTab 
                        ? (filterTab === "PENDING" ? "bg-amber-500 text-black" : filterTab === "APPROVED" ? "bg-emerald-500 text-black" : filterTab === "CANCELLED" ? "bg-red-500 text-white" : filterTab === "NEW" ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]" : "bg-neutral-200 text-black")
                        : "text-neutral-500 hover:text-white"
                      }`}
                    >
                      {filterTab === "NEW" && statusFilter !== "NEW" && newRegistrations > 0 && <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>}
                      {filterTab}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex w-full lg:w-auto items-center gap-3">
                <div className="relative w-full lg:w-56">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                     <SearchIcon />
                   </div>
                   <input
                     type="text"
                     placeholder={t("admin.table.search")}
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-shadow text-white placeholder:text-neutral-600"
                   />
                </div>
                <button 
                  onClick={() => fetchBookings()} 
                  className="p-2 border border-neutral-800 bg-neutral-950 hover:bg-neutral-800 rounded-xl transition-colors text-neutral-400 group flex-shrink-0"
                  title="Force Refresh Data"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-20 flex justify-center">
                  <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap relative">
                  <thead className="bg-[#0f0f0f] text-neutral-500 text-[11px] uppercase font-bold tracking-widest border-b border-neutral-800/50">
                    <tr>
                      <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("name")}>
                        <div className="flex items-center gap-2">{t("admin.table.traveler")} <SortIcon /></div>
                      </th>
                      <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("destination")}>
                         {t("dash.modal.destination")}
                      </th>
                      <th className="px-6 py-4">{t("admin.table.flight")}</th>
                      <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("status")}>
                         <div className="flex items-center gap-2">{t("admin.table.status")} <SortIcon /></div>
                      </th>
                      <th className="px-6 py-4 text-right">{t("admin.table.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/30">
                    <AnimatePresence>
                      {filteredAndSortedBookings.map((booking) => {
                        const isNew = new Date(booking.createdAt).getTime() > sessionStartTime;
                        return (
                        <motion.tr 
                          key={booking.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={`group transition-colors cursor-pointer ${isNew ? 'bg-amber-500/5 hover:bg-amber-500/10 border-l-2 border-l-amber-500' : 'hover:bg-neutral-800/10'}`}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <td className="px-6 py-4 pl-8">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-neutral-300 text-xs shadow-inner">
                                {booking.user?.fullName?.charAt(0) || "U"}
                              </div>
                              <div className="max-w-[200px] overflow-hidden">
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-white mb-0.5 truncate">{booking.user?.fullName || "Unknown User"}</p>
                                  {isNew && <span className="px-1.5 py-0.5 bg-amber-500 text-black text-[8px] font-black uppercase rounded-sm">New</span>}
                                </div>
                                <p className="text-[11px] text-neutral-500 font-medium truncate">{booking.user?.email || "N/A"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold font-mono tracking-wide text-neutral-300">
                            {booking.destinationCode}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-white mb-0.5 capitalize">{booking.travelClass || "Economy"}</p>
                            <p className="text-[11px] text-neutral-500">Guests: {booking.guests || 1}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
                              {(booking.status || "Unknown").replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); }}
                                className="px-4 py-1.5 bg-white/10 text-white hover:bg-white/20 font-bold text-xs rounded-md transition-all"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      )})}
                    </AnimatePresence>
                    
                    {filteredAndSortedBookings.length === 0 && !isLoading && (
                       <tr>
                         <td colSpan="5" className="px-6 py-16 text-center">
                           <div className="inline-flex flex-col items-center justify-center p-6 bg-neutral-900 border border-neutral-800 rounded-2xl border-dashed">
                             <SearchIcon className="w-8 h-8 text-neutral-600 mb-2"/>
                             <p className="text-white font-bold">No results found</p>
                             <p className="text-xs text-neutral-500 mt-1">Try adjusting your filters or search query.</p>
                           </div>
                         </td>
                       </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          </>
          )}
          
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
