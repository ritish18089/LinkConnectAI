import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Heart, FileText, Check } from 'lucide-react';
import { supabase } from '../../db/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import resumeTemplatesData from '../../data/resumeTemplates.json';
import { ResumeTemplateMeta } from '../../types/resume';
import { useNavigate } from 'react-router';

export default function ResumeTemplatesLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { user } = useAuthStore();
  const navigate = useNavigate();

  const categories = ['All', 'IT', 'Non-IT'];

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    console.log("Reload favorites");
    try {
      const { data, error } = await supabase
        .from('favorite_resume_templates')
        .select('template_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      if (data) setFavorites(data.map(d => d.template_id));
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleFavorite = async (templateId: string) => {
    console.log("Heart clicked");
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      showToast("You must be logged in to save favorites.");
      return;
    }
    
    console.log("User loaded", user.id);
    console.log("Template ID", templateId);
    
    const isFav = favorites.includes(templateId);
    console.log("Checking favorite:", isFav ? "Currently favorited" : "Not favorited");
    
    // Optimistic UI Update
    setFavorites(isFav ? favorites.filter(id => id !== templateId) : [...favorites, templateId]);
    console.log("Updated UI optimistically");

    try {
      if (isFav) {
        console.log("Deleting favorite from Supabase");
        const { error, data } = await supabase
          .from('favorite_resume_templates')
          .delete()
          .match({ user_id: user.id, template_id: templateId });
          
        if (error) {
          console.error("Supabase response error:", error);
          throw error;
        }
        console.log("Deleted successfully");
        showToast("Removed from favorites.");
      } else {
        console.log("Inserting favorite into Supabase");
        const { error, data } = await supabase
          .from('favorite_resume_templates')
          .insert({ user_id: user.id, template_id: templateId });
          
        if (error) {
          console.error("Supabase response error:", error);
          throw error;
        }
        console.log("Inserted successfully");
        showToast("Added to favorites.");
      }
    } catch (error: any) {
      // Revert optimistic update
      console.error("Any errors", error);
      setFavorites(isFav ? [...favorites, templateId] : favorites.filter(id => id !== templateId));
      showToast(error.message || "Failed to update favorite.");
    }
  };

  const filteredTemplates = useMemo(() => {
    return (resumeTemplatesData as ResumeTemplateMeta[]).filter(t => {
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch = t.name.toLowerCase().includes(searchStr);
                            
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const favoriteTemplates = useMemo(() => {
    return (resumeTemplatesData as ResumeTemplateMeta[]).filter(t => favorites.includes(t.id));
  }, [favorites]);

  return (
    <div className="max-w-7xl mx-auto pb-12 relative min-h-screen">
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.9 }} className="fixed top-4 right-4 z-[100] px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Check className="w-5 h-5" />
            <span className="font-medium text-sm">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-3 tracking-tight text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-indigo-500" />
            Resume Templates
          </h2>
          <p className="text-neutral-400 text-lg">Build a professional resume in minutes with our templates.</p>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <button 
          onClick={() => setSelectedCategory('IT')}
          className={`p-8 rounded-2xl border text-left transition-all ${selectedCategory === 'IT' ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800'}`}
        >
          <h3 className="text-2xl font-bold text-white mb-2">💻 IT Resume Templates</h3>
          <p className={selectedCategory === 'IT' ? 'text-indigo-100' : 'text-neutral-400'}>10 uniquely designed, ATS-friendly templates optimized for tech professionals.</p>
        </button>

        <button 
          onClick={() => setSelectedCategory('Non-IT')}
          className={`p-8 rounded-2xl border text-left transition-all ${selectedCategory === 'Non-IT' ? 'bg-emerald-600 border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800'}`}
        >
          <h3 className="text-2xl font-bold text-white mb-2">🏢 Non-IT Resume Templates</h3>
          <p className={selectedCategory === 'Non-IT' ? 'text-emerald-100' : 'text-neutral-400'}>10 uniquely designed, ATS-friendly templates optimized for business and creative roles.</p>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 mb-10 flex flex-col lg:flex-row gap-4 items-center backdrop-blur-xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search templates..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
        {selectedCategory !== 'All' && (
          <button onClick={() => setSelectedCategory('All')} className="px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-sm font-medium transition-colors whitespace-nowrap">
            Clear Category Filter
          </button>
        )}
      </div>

      {/* Favorite Templates Section */}
      {user && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            Favorite Templates
          </h3>
          {favoriteTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {favoriteTemplates.map((template) => (
                  <motion.div 
                    key={`fav-${template.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group flex flex-col"
                  >
                    <div className="relative aspect-[1/1.414] overflow-hidden bg-neutral-800">
                      <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(template.id); }}
                          className="p-2 rounded-full bg-neutral-900/80 backdrop-blur border border-neutral-700/50 hover:bg-neutral-800 transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(template.id) ? 'fill-red-500 text-red-500' : 'text-neutral-300 group-hover:text-white'}`} />
                        </button>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <button 
                          onClick={() => navigate(`/dashboard/resume-templates/edit/${template.id}`)}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
                        >
                          Use Template
                        </button>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-white mb-2">{template.name}</h3>
                      <div className="flex gap-2 mb-3">
                        {template.atsRating && (
                          <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-semibold rounded-lg">
                            ATS: {template.atsRating}%
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-lg">
                          {template.category}
                        </span>
                        {template.isAtsFriendly && (
                          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg">
                            ATS Friendly
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-400">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-lg font-medium text-white mb-1">No favorites yet</p>
              <p>You haven't added any favorite templates yet. Click the heart icon on any template to save it here.</p>
            </div>
          )}
        </div>
      )}

      {/* All Templates Grid */}
      <h3 className="text-2xl font-bold text-white mb-6">All Templates</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template) => (
            <motion.div 
              key={template.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group flex flex-col"
            >
              <div className="relative aspect-[1/1.414] overflow-hidden bg-neutral-800">
                <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(template.id); }}
                    className="p-2 rounded-full bg-neutral-900/80 backdrop-blur border border-neutral-700/50 hover:bg-neutral-800 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(template.id) ? 'fill-red-500 text-red-500' : 'text-neutral-300 group-hover:text-white'}`} />
                  </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <button 
                    onClick={() => navigate(`/dashboard/resume-templates/edit/${template.id}`)}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
                  >
                    Use Template
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2">{template.name}</h3>
                
                <div className="flex gap-2 mb-3">
                  {template.atsRating && (
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-semibold rounded-lg">
                      ATS: {template.atsRating}%
                    </span>
                  )}
                </div>

                <div className="flex gap-2 mt-auto">
                  <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-lg">
                    {template.category}
                  </span>
                  {template.isAtsFriendly && (
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg">
                      ATS Friendly
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-20 text-neutral-500">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg">No resume templates found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
