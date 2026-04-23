import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';

const CultureManager = () => {
  const [formData, setFormData] = useState({
    title: '',
    amharic: '',
    label: '',
    description: '',
    detail: '',
    image: '',
    accent: 'from-amber-900/80',
    number: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [cultures, setCultures] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchCultures = async () => {
    try {
      const { data } = await api.get('/tourism/cultures');
      setCultures(data);
    } catch (err) {
      console.error('Failed to load cultures:', err);
    }
  };

  useEffect(() => {
    fetchCultures();
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
        await api.put(`/tourism/cultures/${editingId}`, formData);
        setMessage({ type: 'success', text: 'Culture item updated successfully!' });
      } else {
        await api.post('/tourism/cultures', formData);
        setMessage({ type: 'success', text: 'Culture item added successfully!' });
      }

      setFormData({
        title: '', amharic: '', label: '', description: '',
        detail: '', image: '', accent: 'from-amber-900/80', number: ''
      });
      setEditingId(null);
      fetchCultures();
    } catch (error) {
      console.error('Error saving culture:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save culture' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      amharic: item.amharic || '',
      label: item.label || '',
      description: item.description || '',
      detail: item.detail || '',
      image: item.image || '',
      accent: item.accent || 'from-amber-900/80',
      number: item.number || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this culture item?')) return;
    try {
      await api.delete(`/tourism/cultures/${id}`);
      fetchCultures();
    } catch (err) {
      console.error('Failed to delete culture:', err);
      setMessage({ type: 'error', text: 'Failed to delete culture' });
    }
  };

  return (
    <div className="space-y-12">
      <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-3xl p-6 md:p-10 text-white">
        <h2 className="text-2xl font-black mb-2">{editingId ? 'Refine Tradition' : 'Archive New Tradition'}</h2>
        <p className="text-neutral-400 mb-8">{editingId ? 'Update the details of this cultural heritage.' : 'Document a new cultural landmark for the digital archive.'}</p>

        {message && (
          <div className={`p-4 mb-6 rounded-xl text-sm font-bold border ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Title (Key or String) *</label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. The Coffee Ceremony" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Amharic Identity</label>
              <input type="text" name="amharic" value={formData.amharic} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. ቡና ቤት" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Category Label</label>
              <input type="text" name="label" value={formData.label} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. ጥበብ · Arts" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Display Number</label>
              <input type="text" name="number" value={formData.number} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. 01" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Description *</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="Explain the cultural significance..."></textarea>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Secondary Detail</label>
              <input type="text" name="detail" value={formData.detail} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. 45–90 min" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Accent Gradient</label>
              <select name="accent" value={formData.accent} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors">
                <option value="from-amber-900/80">Amber Deep</option>
                <option value="from-rose-900/80">Rose Deep</option>
                <option value="from-emerald-900/80">Emerald Deep</option>
                <option value="from-purple-900/80">Purple Deep</option>
                <option value="from-stone-900/80">Stone Deep</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-neutral-500 mb-2 tracking-widest">Image URL *</label>
              <input required type="text" name="image" value={formData.image} onChange={handleChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors" placeholder="https://res.cloudinary.com/..." />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                   setEditingId(null);
                   setFormData({
                    title: '', amharic: '', label: '', description: '',
                    detail: '', image: '', accent: 'from-amber-900/80', number: ''
                  });
                }}
                className="px-8 py-3 border border-neutral-700 text-neutral-400 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-neutral-800 transition-all"
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-8 py-3 bg-amber-500 text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : (editingId ? 'Update Tradition' : 'Document Tradition')}
            </button>
          </div>
        </form>

        {/* Culture List */}
        <div className="mt-16 pt-10 border-t border-neutral-800">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2">
            Archived Traditions <span className="bg-amber-500 text-black text-xs px-2 py-0.5 rounded-full">{cultures.length}</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cultures.map(item => (
              <div key={item.id} className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden group relative">
                <div className="h-48 relative">
                  <img src={item.image || "/assets/images/ethiopia/image1.jpg"} alt={item.title} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => handleEdit(item)} className="p-2 bg-amber-500/10 text-amber-500 rounded-lg backdrop-blur-md border border-amber-500/20 hover:bg-amber-500 hover:text-black transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg backdrop-blur-md border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
                       <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{item.number}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-px w-4 bg-amber-500" />
                    <span className="text-[9px] uppercase font-black tracking-widest text-amber-400">{item.label}</span>
                  </div>
                  <h4 className="font-bold text-base mb-1 truncate">{item.title}</h4>
                  <p className="text-[10px] text-neutral-500 mb-3 font-bold">{item.amharic}</p>
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
            {cultures.length === 0 && (
              <div className="col-span-full py-16 text-center border border-dashed border-neutral-800 rounded-3xl text-neutral-500 text-sm">
                No cultural archives recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CultureManager;
