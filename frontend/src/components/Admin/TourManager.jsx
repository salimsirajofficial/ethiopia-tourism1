import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, MapPin, Clock, Users, Shield, Tag, Calendar, Layers } from 'lucide-react';
import api from '../../api/axios';

const TourManager = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    highlight: '',
    duration: '',
    groupSize: '',
    location: '',
    basePrice: '',
    difficulty: 'Moderate',
    tags: '',
    image: '', // Now a URL string
    video_url: '', // New field
  });

  const [itinerary, setItinerary] = useState([{ day: 1, title: '', description: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [tours, setTours] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchTours = async () => {
    try {
      const { data } = await api.get('/tourism/tours');
      setTours(data);
    } catch (err) {
      console.error('Failed to load tours:', err);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Itinerary Handlers ---
  const handleItineraryChange = (index, field, value) => {
    const updated = [...itinerary];
    updated[index][field] = value;
    setItinerary(updated);
  };

  const addDay = () => {
    setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '' }]);
  };

  const removeDay = (index) => {
    if (itinerary.length === 1) return;
    const updated = itinerary.filter((_, i) => i !== index).map((day, i) => ({ ...day, day: i + 1 }));
    setItinerary(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      
      const payload = {
        ...formData,
        tags: tagsArray,
        itinerary: itinerary,
      };

      if (editingId) {
        await api.put(`/tourism/tours/${editingId}`, payload);
        setMessage({ type: 'success', text: 'Expedition updated successfully!' });
      } else {
        await api.post('/tourism/tours', payload);
        setMessage({ type: 'success', text: 'Expedition added successfully!' });
      }

      setFormData({
        title: '', subtitle: '', description: '', highlight: '',
        duration: '', groupSize: '', location: '', basePrice: '',
        difficulty: 'Moderate', tags: '', image: '', video_url: ''
      });
      setItinerary([{ day: 1, title: '', description: '' }]);
      setEditingId(null);
      fetchTours();
    } catch (error) {
      console.error('Error saving tour:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save expedition' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (tour) => {
    setEditingId(tour.id);
    setFormData({
      title: tour.title || '',
      subtitle: tour.subtitle || '',
      description: tour.description || '',
      highlight: tour.highlight || '',
      duration: tour.duration || '',
      groupSize: tour.groupSize || '',
      location: tour.location || '',
      basePrice: tour.basePrice || '',
      difficulty: tour.difficulty || 'Moderate',
      tags: Array.isArray(tour.tags) ? tour.tags.join(', ') : '',
      image: tour.image || '',
      video_url: tour.video_url || '',
    });
    setItinerary(tour.itinerary && tour.itinerary.length > 0 ? tour.itinerary : [{ day: 1, title: '', description: '' }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expedition?')) return;
    try {
      await api.delete(`/tourism/tours/${id}`);
      fetchTours();
    } catch (err) {
      console.error('Failed to delete tour:', err);
      setMessage({ type: 'error', text: 'Failed to delete expedition' });
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Creation/Edit Form */}
      <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-3xl p-6 md:p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
            <Layers className="text-amber-500" /> {editingId ? 'Refine Expedition' : 'Draft New Expedition'}
          </h2>
          <p className="text-neutral-400 mb-10 text-sm">{editingId ? 'Modify the details of your existing journey.' : 'Design a curated journey across the highlands.'}</p>

          {message && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 mb-8 rounded-2xl text-sm font-bold border ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
              {message.text}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Core Specs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase font-black text-neutral-500 mb-2 tracking-widest">Expedition Title *</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. Northern Historical Route" />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-black text-neutral-500 mb-2 tracking-widest">Subtitle / Tagline</label>
                <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. The Grand Circuit" />
              </div>
              
              <div className="md:col-span-3">
                <label className="block text-[10px] uppercase font-black text-neutral-500 mb-2 tracking-widest">Broad Highlight</label>
                <input type="text" name="highlight" value={formData.highlight} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. 9 UNESCO sites in one journey" />
              </div>

              <div className="md:col-span-3">
                <label className="block text-[10px] uppercase font-black text-neutral-500 mb-2 tracking-widest">Full Description *</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="Provide a detailed narrative of the expedition..."></textarea>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black text-neutral-500 mb-2 tracking-widest">Duration</label>
                <div className="relative">
                  <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                  <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. 7 Days" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-black text-neutral-500 mb-2 tracking-widest">Group Size</label>
                <div className="relative">
                  <Users size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                  <input type="text" name="groupSize" value={formData.groupSize} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. 4–12 People" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-black text-neutral-500 mb-2 tracking-widest">Main Location</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. Northern Ethiopia" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black text-neutral-500 mb-2 tracking-widest">Base Price (USD) *</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 font-bold">$</div>
                  <input required type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="1200" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-black text-neutral-500 mb-2 tracking-widest">Difficulty</label>
                <div className="relative">
                  <Shield size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                  <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors appearance-none">
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-black text-neutral-500 mb-2 tracking-widest">Tags (comma separated)</label>
                <div className="relative">
                  <Tag size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                  <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="History, Culture..." />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase font-black text-neutral-500 mb-2 tracking-widest">Cloudinary Image URL *</label>
                <div className="relative">
                   <input required type="text" name="image" value={formData.image} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="https://res.cloudinary.com/..." />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-black text-neutral-500 mb-2 tracking-widest">Cloudinary Video URL</label>
                <div className="relative">
                   <input type="text" name="video_url" value={formData.video_url} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="https://res.cloudinary.com/..." />
                </div>
              </div>
            </div>

            {/* Itinerary Builder */}
            <div className="space-y-6 pt-6 border-t border-neutral-800/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black flex items-center gap-2">
                    <Calendar className="text-amber-500" size={18} /> Daily Itinerary
                  </h3>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mt-1">Structure the day-by-day experience</p>
                </div>
                <button type="button" onClick={addDay} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 text-xs font-bold">
                  <Plus size={14} /> Add Day
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence initial={false}>
                  {itinerary.map((day, index) => (
                    <motion.div key={index} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-4 group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 px-2 py-1 bg-amber-500/10 rounded-lg">Day {day.day}</span>
                        <button type="button" onClick={() => removeDay(index)} className="p-1.5 text-neutral-600 hover:text-red-500 transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-1">
                          <input required type="text" value={day.title} onChange={(e) => handleItineraryChange(index, 'title', e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 transition-colors font-bold" placeholder="Day Title (e.g. Arrival)" />
                        </div>
                        <div className="md:col-span-3">
                          <textarea required value={day.description} onChange={(e) => handleItineraryChange(index, 'description', e.target.value)} rows="2" className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500 transition-colors" placeholder="What happens on this day?"></textarea>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="pt-8 border-t border-neutral-800 flex justify-end gap-3">
              {editingId && (
                <button 
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      title: '', subtitle: '', description: '', highlight: '',
                      duration: '', groupSize: '', location: '', basePrice: '',
                      difficulty: 'Moderate', tags: '', image: '', video_url: ''
                    });
                    setItinerary([{ day: 1, title: '', description: '' }]);
                  }}
                  className="px-10 py-4 border border-neutral-700 text-neutral-400 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-neutral-800 transition-all"
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-10 py-4 bg-amber-500 text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50 flex items-center gap-3"
              >
                {isLoading ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Synchronizing...</> : (editingId ? 'Update Expedition' : 'Deploy Expedition')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Live Table */}
      <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-3xl p-6 md:p-10 text-white">
        <h3 className="text-xl font-black mb-8 flex items-center gap-3">
          Live Expeditions <span className="bg-amber-500 text-black text-xs px-2 py-0.5 rounded-full">{tours.length}</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map(tour => (
            <div key={tour.id} className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden group">
              <div className="relative h-40 overflow-hidden">
                <img src={tour.image || "/assets/images/ethiopia/image1.jpg"} alt={tour.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
                <div className="absolute top-4 right-4 flex gap-2">
                   <button onClick={() => handleEdit(tour)} className="p-2 bg-amber-500/10 text-amber-500 rounded-lg backdrop-blur-md border border-amber-500/20 hover:bg-amber-500 hover:text-black transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                   </button>
                   <button onClick={() => handleDelete(tour.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg backdrop-blur-md border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={14} />
                   </button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                   <span className="text-[8px] font-black uppercase tracking-widest text-amber-500 py-0.5 px-2 bg-amber-500/10 rounded">{tour.duration}</span>
                   <span className="text-[8px] font-black uppercase tracking-widest text-neutral-500 py-0.5 px-2 bg-neutral-800 rounded">{tour.difficulty}</span>
                   {tour.video_url && <span className="text-[8px] font-black uppercase tracking-widest text-blue-400 py-0.5 px-2 bg-blue-500/10 rounded">Video</span>}
                </div>
                <h4 className="font-bold text-sm mb-1">{tour.title}</h4>
                <p className="text-[10px] text-neutral-500 font-medium mb-4">{tour.location}</p>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-800/50">
                   <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-white">${tour.basePrice}</span>
                      <span className="text-[9px] text-neutral-600 uppercase font-black">USD</span>
                   </div>
                   <span className="text-[9px] text-neutral-500 font-bold uppercase">{tour.itinerary?.length || 0} Days</span>
                </div>
              </div>
            </div>
          ))}
          {tours.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-neutral-800 rounded-3xl text-neutral-500 text-sm">
              No expeditions in the database.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourManager;
