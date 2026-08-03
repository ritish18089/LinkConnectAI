import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Copy, Heart, Download, Check, Save, FileText, Bookmark, X, SlidersHorizontal, Settings2, Keyboard } from 'lucide-react';
import { supabase } from '../../db/supabase';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import templatesData from '../../data/templates.json';
import { useAuthStore } from '../../store/useAuthStore';
import { useActivityStore } from '../../store/useActivityStore';

interface Template {
  id: number;
  category: string;
  title: string;
  tone: string;
  short_message: string;
  medium_message: string;
  long_message: string;
}

type LengthType = 'short' | 'medium' | 'long';
type SortType = 'recently_added' | 'a_z' | 'most_used';

export default function TemplateLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTone, setSelectedTone] = useState('All');
  const [selectedLength, setSelectedLength] = useState<LengthType>('medium');
  const [sortBy, setSortBy] = useState<SortType>('recently_added');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const [favorites, setFavorites] = useState<number[]>([]);
  const [usageStats, setUsageStats] = useState<Record<number, number>>({});
  
  const [copiedId, setCopiedId] = useState<number | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const searchInputRef = useRef<HTMLInputElement>(null);

  const { user, linkedinProfile } = useAuthStore();
  const { logActivity } = useActivityStore();
  
  const senderName = linkedinProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";

  // Modals
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [placeholders, setPlaceholders] = useState<{ [key: string]: string }>({});

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const categories = ['All', ...Array.from(new Set(templatesData.map(t => t.category)))];
  const tones = ['All', ...Array.from(new Set(templatesData.map(t => t.tone)))];

  useEffect(() => {
    fetchFavorites();
    fetchUsageStats();
  }, [user]);

  const fetchFavorites = async () => {
    try {
      if (!user) return;
      const { data } = await supabase.from('favorite_templates').select('template_id').eq('user_id', user.id);
      if (data) setFavorites(data.map(d => parseInt(d.template_id)));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUsageStats = async () => {
    try {
      // In a real scenario, we'd group by template_id to get counts.
      // For now, we simulate fetching stats from 'template_usage' where action_type = 'used'
      if (!user) return;
      const { data } = await supabase.from('template_usage').select('template_id').eq('action_type', 'used');
      const stats: Record<number, number> = {};
      if (data) {
        data.forEach(row => {
          const id = parseInt(row.template_id);
          stats[id] = (stats[id] || 0) + 1;
        });
      }
      setUsageStats(stats);
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const logUsage = async (templateId: number, title: string, category: string, actionType: 'used' | 'viewed') => {
    if (!user) return;
    try {
      await supabase.from('template_usage').insert({
        user_id: user.id,
        template_id: templateId.toString(),
        title,
        category,
        action_type: actionType
      });
      if (actionType === 'used') {
        logActivity(user.id, 'Used Template', { template_id: templateId, title });
      }
    } catch (err) {
      console.error("Failed to log usage", err);
    }
  };

  const toggleFavorite = async (templateId: number, title: string) => {
    try {
      if (!user) {
        showToast("Please login to save favorites.");
        return;
      }
      
      const isFav = favorites.includes(templateId);
      if (isFav) {
        await supabase.from('favorite_templates').delete().match({ user_id: user.id, template_id: templateId.toString() });
        setFavorites(favorites.filter(id => id !== templateId));
        showToast("Removed from favorites.");
      } else {
        await supabase.from('favorite_templates').insert({ user_id: user.id, template_id: templateId.toString(), title });
        setFavorites([...favorites, templateId]);
        showToast("Added to favorites.");
        logActivity(user.id, 'Favorited Template', { template_id: templateId, title });
      }
    } catch (error: any) {
      showToast(error.message || "Failed to update favorite.");
    }
  };

  const extractPlaceholders = (text: string) => {
    const matches = text.match(/\{([^}]+)\}/g);
    return matches ? matches.map(m => m.slice(1, -1)).filter(p => p !== 'sender_name') : [];
  };

  const replaceSender = (text: string) => {
    return text.replace(/\{sender_name\}/g, senderName);
  };

  const getCustomizedText = () => {
    if (!activeTemplate) return "";
    const key = `${selectedLength}_message` as keyof Template;
    let text = activeTemplate[key] as string;
    for (const [key, val] of Object.entries(placeholders)) {
      if (val) {
        text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), val as string);
      }
    }
    return replaceSender(text);
  };

  const openPreview = (template: Template) => {
    setActiveTemplate(template);
    setPreviewOpen(true);
    logUsage(template.id, template.title, template.category, 'viewed');
  };

  const openCustomizer = (template?: Template) => {
    const target = template || activeTemplate;
    if (!target) return;
    const key = `${selectedLength}_message` as keyof Template;
    const text = target[key] as string;
    const phs = extractPlaceholders(text);
    const initialPlaceholders: { [key: string]: string } = {};
    phs.forEach(p => initialPlaceholders[p] = "");
    
    setPlaceholders(initialPlaceholders);
    setActiveTemplate(target);
    setPreviewOpen(false);
    setCustomizerOpen(true);
  };

  const handleCopy = async (text: string, template: Template, isCustomized: boolean = false) => {
    navigator.clipboard.writeText(text);
    setCopiedId(template.id);
    showToast("Message copied successfully.");
    logUsage(template.id, template.title, template.category, 'used');

    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportTxt = (template: Template) => {
    const key = `${selectedLength}_message` as keyof Template;
    const text = replaceSender(template[key] as string);
    const content = `${template.title}\nCategory: ${template.category} | Tone: ${template.tone} | Length: ${selectedLength}\n\n${text}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${template.title.replace(/\s+/g, '_')}.txt`);
    showToast("Exported to TXT.");
  };

  const handleExportPdf = (template: Template) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(template.title, 20, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`Category: ${template.category}  |  Tone: ${template.tone}  |  Length: ${selectedLength}`, 20, 28);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const key = `${selectedLength}_message` as keyof Template;
    const text = replaceSender(template[key] as string);
    const lines = doc.splitTextToSize(text, 170);
    doc.text(lines, 20, 40);

    doc.save(`${template.title.replace(/\s+/g, '_')}.pdf`);
    showToast("Exported to PDF.");
  };

  const handleExportDocx = async (template: Template) => {
    const key = `${selectedLength}_message` as keyof Template;
    const text = replaceSender(template[key] as string);
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({ children: [new TextRun({ text: template.title, bold: true, size: 32 })] }),
          new Paragraph({ children: [new TextRun({ text: `Category: ${template.category} | Tone: ${template.tone} | Length: ${selectedLength}`, italics: true, size: 20 })] }),
          new Paragraph({ text: "" }),
          new Paragraph({ children: [new TextRun({ text, size: 24 })] })
        ],
      }],
    });
    
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${template.title.replace(/\s+/g, '_')}.docx`);
    showToast("Exported to DOCX.");
  };

  const handleSaveTemplate = async () => {
    if (!activeTemplate || isSaving) return;
    try {
      setIsSaving(true);
      if (!user) {
        showToast("Please login to save custom templates.");
        setIsSaving(false);
        return;
      }
      
      const customizedText = getCustomizedText();
      const now = new Date().toISOString();
      
      const { error } = await supabase.from('saved_templates').insert({
        user_id: user.id,
        template_id: activeTemplate.id.toString(),
        title: activeTemplate.title + " (Saved)",
        category: activeTemplate.category,
        message: customizedText,
        created_at: now,
        updated_at: now
      });
      
      if (error) throw error;

      showToast("Template saved successfully!");
      logActivity(user.id, 'Saved Template', { template_id: activeTemplate.id, title: activeTemplate.title });
      setCustomizerOpen(false);
    } catch (error: any) {
      showToast(error.message || "Failed to save template.");
    } finally {
      setIsSaving(false);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Esc
      if (e.key === 'Escape') {
        setCustomizerOpen(false);
        setPreviewOpen(false);
        setShowShortcuts(false);
      }
      
      // Ctrl + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      // Ctrl + S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        if (customizerOpen && activeTemplate) {
          e.preventDefault();
          handleSaveTemplate();
        }
      }

      // Ctrl + Shift + C (Copy)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'c' || e.key === 'C')) {
        if (customizerOpen && activeTemplate) {
          e.preventDefault();
          handleCopy(getCustomizedText(), activeTemplate, true);
          setCustomizerOpen(false);
        } else if (previewOpen && activeTemplate) {
          e.preventDefault();
          const key = `${selectedLength}_message` as keyof Template;
          const text = replaceSender(activeTemplate[key] as string);
          handleCopy(text, activeTemplate);
          setPreviewOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [customizerOpen, previewOpen, activeTemplate, placeholders]);

  // Filtering & Sorting
  const filteredTemplates = useMemo(() => {
    let result = templatesData.filter(t => {
      const key = `${selectedLength}_message` as keyof typeof t;
      const textToSearch = (t[key] as string).toLowerCase();
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || textToSearch.includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      const matchesTone = selectedTone === 'All' || t.tone === selectedTone;
      const matchesFavorites = showFavoritesOnly ? favorites.includes(t.id) : true;
      return matchesSearch && matchesCategory && matchesTone && matchesFavorites;
    });

    if (sortBy === 'a_z') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'most_used') {
      result.sort((a, b) => (usageStats[b.id] || 0) - (usageStats[a.id] || 0));
    } else {
      // naturally 'recently_added' (by ID or file order)
      result.sort((a, b) => b.id - a.id); 
    }

    return result;
  }, [searchTerm, selectedCategory, selectedTone, selectedLength, showFavoritesOnly, sortBy, favorites, usageStats]);

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const currentTemplates = filteredTemplates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedTone, selectedLength, showFavoritesOnly, sortBy]);

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
            <Bookmark className="w-8 h-8 text-indigo-500" />
            Template Library
          </h2>
          <p className="text-neutral-400 text-lg">Browse 100 professionally crafted LinkedIn outreach templates.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => setShowShortcuts(true)} className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors" title="Keyboard Shortcuts">
            <Keyboard className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 font-medium transition-all ${showFavoritesOnly ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-red-400' : ''}`} />
            Favorites
          </button>

          {/* Global Length Toggle */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-1 flex">
            {(['short', 'medium', 'long'] as LengthType[]).map((len) => (
              <button
                key={len}
                onClick={() => setSelectedLength(len)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${selectedLength === len ? 'bg-indigo-600 text-white shadow-md' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
              >
                {len}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 mb-10 flex flex-col lg:flex-row gap-4 items-center backdrop-blur-xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder={`Search templates (Ctrl+K)...`} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-40">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-8 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="relative w-full sm:w-40">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <select 
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value)}
              className="w-full appearance-none bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-8 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
            >
              {tones.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="relative w-full sm:w-48">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="w-full appearance-none bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-8 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="recently_added">Recently Added</option>
              <option value="a_z">Sort A-Z</option>
              <option value="most_used">Most Used</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {currentTemplates.map((template) => (
            <motion.div 
              key={template.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group flex flex-col"
            >
              <div className="p-6 flex-1 flex flex-col cursor-pointer" onClick={() => openPreview(template)}>
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
                      {template.category}
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold ml-2">
                      {template.tone}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(template.id, template.title); }}
                    className="p-2 -mr-2 rounded-full hover:bg-neutral-800 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(template.id) ? 'fill-red-500 text-red-500' : 'text-neutral-500 group-hover:text-neutral-400'}`} />
                  </button>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-3 line-clamp-1">{template.title}</h3>
                
                <div className="bg-neutral-950 rounded-xl p-4 flex-1 mb-4 border border-neutral-800/50">
                  <p className="text-neutral-400 text-sm leading-relaxed line-clamp-4">{replaceSender(template[`${selectedLength}_message` as keyof Template] as string)}</p>
                </div>
              </div>
              <div className="px-6 pb-6 flex items-center justify-between mt-auto border-t border-neutral-800 pt-4 bg-neutral-900/50">
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleCopy(replaceSender(template[`${selectedLength}_message` as keyof Template] as string), template); }}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors flex items-center justify-center relative overflow-hidden"
                    title="Quick Copy"
                  >
                    <AnimatePresence>
                      {copiedId === template.id && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-emerald-400" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <Copy className={`w-4 h-4 ${copiedId === template.id ? 'opacity-0' : 'opacity-100'}`} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); openCustomizer(template); }}
                    className="px-3 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 transition-colors flex items-center gap-2 text-sm font-semibold"
                  >
                    <Settings2 className="w-4 h-4" /> Use
                  </button>
                </div>
                <div className="relative group/export">
                  <button className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-full right-0 mb-2 w-36 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl opacity-0 invisible group-hover/export:opacity-100 group-hover/export:visible transition-all z-10 overflow-hidden">
                    <button onClick={(e) => { e.stopPropagation(); handleExportTxt(template); }} className="w-full text-left px-4 py-2 hover:bg-neutral-800 text-xs text-neutral-300">Export TXT</button>
                    <button onClick={(e) => { e.stopPropagation(); handleExportPdf(template); }} className="w-full text-left px-4 py-2 hover:bg-neutral-800 text-xs text-neutral-300">Export PDF</button>
                    <button onClick={(e) => { e.stopPropagation(); handleExportDocx(template); }} className="w-full text-left px-4 py-2 hover:bg-neutral-800 text-xs text-neutral-300">Export DOCX</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-20 text-neutral-500">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg">No templates found matching your filters.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white disabled:opacity-50 hover:bg-neutral-800 transition-colors"
          >
            Prev
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all ${currentPage === page ? 'bg-indigo-600 text-white' : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="text-neutral-500 px-2">...</span>;
              }
              return null;
            })}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white disabled:opacity-50 hover:bg-neutral-800 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Premium Preview Modal */}
      <AnimatePresence>
        {previewOpen && activeTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{activeTemplate.title}</h3>
                    <div className="flex gap-2">
                      <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold">{activeTemplate.category}</span>
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold capitalize">{selectedLength}</span>
                    </div>
                  </div>
                  <button onClick={() => setPreviewOpen(false)} className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="bg-neutral-950 rounded-2xl p-6 border border-neutral-800 text-neutral-300 leading-relaxed text-lg mb-8">
                  {replaceSender(activeTemplate[`${selectedLength}_message` as keyof Template] as string)}
                </div>

                <div className="flex flex-wrap gap-3 justify-end">
                  <button onClick={() => toggleFavorite(activeTemplate.id, activeTemplate.title)} className={`px-5 py-3 rounded-xl border flex items-center gap-2 font-medium transition-all ${favorites.includes(activeTemplate.id) ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'}`}>
                    <Heart className={`w-5 h-5 ${favorites.includes(activeTemplate.id) ? 'fill-red-400' : ''}`} />
                    Favorite
                  </button>
                  <button onClick={() => openCustomizer()} className="px-5 py-3 rounded-xl font-medium bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 transition-colors flex items-center gap-2">
                    <Settings2 className="w-5 h-5" /> Customize
                  </button>
                  <button onClick={() => { handleCopy(replaceSender(activeTemplate[`${selectedLength}_message` as keyof Template] as string), activeTemplate); setPreviewOpen(false); }} className="px-5 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                    <Copy className="w-5 h-5" /> Copy Message
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Customizer Modal */}
      <AnimatePresence>
        {customizerOpen && activeTemplate && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Customize Template</h3>
                  <p className="text-sm text-neutral-400">Fill in the variables before copying.</p>
                </div>
                <button onClick={() => setCustomizerOpen(false)} className="p-2 rounded-full bg-neutral-800 text-neutral-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                {/* Variables Panel */}
                <div className="w-full md:w-1/3 bg-neutral-950 p-6 border-r border-neutral-800 overflow-y-auto">
                  <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4"/> Variables</h4>
                  {Object.keys(placeholders).length > 0 ? (
                    <div className="space-y-4">
                      {Object.keys(placeholders).map(key => (
                        <div key={key}>
                          <label className="block text-xs font-medium text-neutral-500 mb-1 capitalize">{key}</label>
                          <input 
                            type="text" 
                            placeholder={`Enter ${key}...`}
                            value={placeholders[key]}
                            onChange={(e) => setPlaceholders({...placeholders, [key]: e.target.value})}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-neutral-500 text-sm py-4">No variables found in this template length.</div>
                  )}
                </div>

                {/* Preview Panel */}
                <div className="w-full md:w-2/3 p-6 flex flex-col bg-neutral-900">
                  <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Live Preview</h4>
                  <div className="flex-1 bg-neutral-950 rounded-xl p-5 border border-neutral-800 text-neutral-200 leading-relaxed whitespace-pre-wrap overflow-y-auto min-h-[200px]">
                    {getCustomizedText()}
                  </div>
                  <div className="mt-2 text-right text-xs font-medium text-neutral-500">
                    {getCustomizedText().length} characters
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-neutral-800 bg-neutral-950/50 flex justify-between items-center mt-auto">
                <button 
                  onClick={handleSaveTemplate} 
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                  title="Ctrl + S"
                >
                  {isSaving ? <div className="w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4"/>} 
                  {isSaving ? 'Saving...' : 'Save Template'}
                </button>
                <div className="flex gap-3">
                  <button onClick={() => setCustomizerOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">Cancel</button>
                  <button onClick={() => { handleCopy(getCustomizedText(), activeTemplate, true); setCustomizerOpen(false); }} className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2" title="Ctrl + Shift + C">
                    <Copy className="w-4 h-4"/> Copy Message
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Shortcuts Modal */}
      <AnimatePresence>
        {showShortcuts && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><Keyboard className="w-5 h-5"/> Keyboard Shortcuts</h3>
                <button onClick={() => setShowShortcuts(false)} className="text-neutral-500 hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Search Templates</span>
                  <div className="flex gap-1">
                    <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-400">Ctrl</kbd>
                    <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-400">K</kbd>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Save Custom Template</span>
                  <div className="flex gap-1">
                    <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-400">Ctrl</kbd>
                    <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-400">S</kbd>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Copy Template</span>
                  <div className="flex gap-1">
                    <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-400">Ctrl</kbd>
                    <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-400">Shift</kbd>
                    <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-400">C</kbd>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300">Close Modals</span>
                  <div className="flex gap-1">
                    <kbd className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-400">Esc</kbd>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
