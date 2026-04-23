import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';

const DestinationManager = () => {
  const [formData, setFormData] = useState({
    title: '',
    amharic: '',
    code: '',
    region: '',
    description: '',
    tag: '',
    color: 'from-amber-900/80',
    bestTime: '',
    duration: '',
    basePrice: '',
    image: '', // URL string
    video_url: '', // New field
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchDestinations = async () => {
    try {
      const { data } = await api.get('/tourism/destinations');
      setDestinations(data);
    } catch (err) {
      console.error('Failed to load destinations:', err);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (editingId) {
        await api.put(`/tourism/destinations/${editingId}`, formData);
        setMessage({ type: 'success', text: 'Destination updated successfully!' });
      } else {
        await api.post('/tourism/destinations', formData);
        setMessage({ type: 'success', text: 'Destination added successfully!' });
      }

      setFormData({
        title: '', amharic: '', code: '', region: '', description: '',
        tag: '', color: 'from-amber-900/80', bestTime: '', duration: '', 
        basePrice: '', image: '', video_url: ''
      });
      setEditingId(null);
      fetchDestinations();
    } catch (error) {
      console.error('Error saving destination:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save destination' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (dest) => {
    setEditingId(dest.id);
    setFormData({
      title: dest.title || '',
      amharic: dest.amharic || '',
      code: dest.code || '',
      region: dest.region || '',
      description: dest.description || '',
      tag: dest.tag || '',
      color: dest.color || 'from-amber-900/80',
      bestTime: dest.bestTime || '',
      duration: dest.duration || '',
      basePrice: dest.basePrice || '',
      image: dest.image || '',
      video_url: dest.video_url || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      await api.delete(`/tourism/destinations/${id}`);
      fetchDestinations();
    } catch (err) {
      console.error('Failed to delete destination:', err);
      setMessage({ type: 'error', text: 'Failed to delete destination' });
    }
  };

  return (
    <div className="space-y-12">
      <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-3xl p-6 md:p-10 text-white">
        <h2 className="text-2xl font-black mb-2">{editingId ? 'Refine Heritage Site' : 'Add New Heritage Site'}</h2>
        <p className="text-neutral-400 mb-8">{editingId ? 'Update the parameters of this recorded location.' : 'Create a new legendary landscape for travelers to discover.'}</p>

        {message && (
          <div className={`p-4 mb-6 rounded-xl text-sm font-bold border ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Title *</label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. Omo Valley" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Amharic Title</label>
              <input type="text" name="amharic" value={formData.amharic} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. ኦሞ ሸለቆ" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Code (Unique) *</label>
              <input required type="text" name="code" value={formData.code} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. OMO" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Region</label>
              <input type="text" name="region" value={formData.region} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. ደቡብ · South" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Description *</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="Describe the destination..."></textarea>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Tag Category</label>
              <input type="text" name="tag" value={formData.tag} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. Cultural Tapestry" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Gradient Color</label>
              <select name="color" value={formData.color} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors">
                <option value="from-amber-900/80">Amber</option>
                <option value="from-emerald-900/80">Emerald</option>
                <option value="from-orange-900/80">Orange</option>
                <option value="from-purple-900/80">Purple</option>
                <option value="from-red-900/80">Red</option>
                <option value="from-stone-900/80">Stone</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Best Time</label>
              <input type="text" name="bestTime" value={formData.bestTime} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. Sep — Feb" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Duration</label>
              <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. 5–7 Days" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Base Price (USD)</label>
              <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. 350" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Cloudinary Image URL *</label>
              <input required type="text" name="image" value={formData.image} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="https://res.cloudinary.com/..." />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Cloudinary Video URL</label>
              <input type="text" name="video_url" value={formData.video_url} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="https://res.cloudinary.com/..." />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                   setEditingId(null);
                   setFormData({
                    title: '', amharic: '', code: '', region: '', description: '',
                    tag: '', color: 'from-amber-900/80', bestTime: '', duration: '', 
                    basePrice: '', image: '', video_url: ''
                  });
                }}
                className="px-8 py-3 border border-neutral-700 text-neutral-400 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-neutral-800 transition-all font-bold"
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-8 py-3 bg-amber-500 text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : (editingId ? 'Update Heritage' : 'Register Heritage')}
            </button>
          </div>
        </form>

        {/* Live Destinations List */}
        <div className="mt-16 pt-10 border-t border-neutral-800">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2">
            Live Records <span className="bg-amber-500 text-black text-xs px-2 py-0.5 rounded-full">{destinations.length}</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map(dest => (
              <div key={dest.id} className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden group relative">
                <div className="h-40 relative">
                  <img src={dest.image || "/assets/images/ethiopia/image1.jpg"} alt={dest.title} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => handleEdit(dest)} className="p-2 bg-amber-500/10 text-amber-500 rounded-lg backdrop-blur-md border border-amber-500/20 hover:bg-amber-500 hover:text-black transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                    </button>
                    <button onClick={() => handleDelete(dest.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg backdrop-blur-md border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] uppercase font-black tracking-widest text-amber-500 px-2 py-0.5 bg-amber-500/10 rounded">{dest.code}</span>
                    {dest.video_url && <span className="text-[9px] uppercase font-black tracking-widest text-blue-400 px-2 py-0.5 bg-blue-500/10 rounded">Video</span>}
                  </div>
                  <h4 className="font-bold text-base mb-1 truncate">{dest.title}</h4>
                  <p className="text-xs text-neutral-500 mb-4">{dest.region}</p>
                  <div className="pt-4 border-t border-neutral-800/50 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    <span>${dest.basePrice} Rate</span>
                    <span>{dest.duration}</span>
                  </div>
                </div>
              </div>
            ))}
            {destinations.length === 0 && (
              <div className="col-span-full py-16 text-center border border-dashed border-neutral-800 rounded-3xl text-neutral-500 text-sm">
                No legendary landscapes live yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationManager;
