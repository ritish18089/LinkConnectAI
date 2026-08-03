import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bookmark, Plus, Edit2, Trash2, Search, Copy, Download, Check, X, Save } from "lucide-react";
import { supabase } from "../../db/supabase";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router";

export default function SavedTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data, error } = await supabase
      .from("saved_templates")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTemplates(data);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = async (text: string, tpl: any) => {
    navigator.clipboard.writeText(text);
    setCopiedId(tpl.id);
    showToast("Copied to clipboard!");

    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("saved_templates").delete().eq("id", id);
    if (!error) {
      setTemplates(prev => prev.filter(t => t.id !== id));
      showToast("Template deleted.");
    }
  };

  const handleExportTxt = (tpl: any) => {
    const content = `${tpl.title}\nCategory: ${tpl.category || 'Custom'}\n\n${tpl.message}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${tpl.title.replace(/\s+/g, '_')}.txt`);
    showToast("Exported to TXT.");
  };

  const handleExportPdf = (tpl: any) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(tpl.title, 20, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`Category: ${tpl.category || 'Custom'}`, 20, 28);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(tpl.message, 170);
    doc.text(lines, 20, 40);
    doc.save(`${tpl.title.replace(/\s+/g, '_')}.pdf`);
    showToast("Exported to PDF.");
  };

  const openEditModal = (tpl: any) => {
    setActiveTemplate(tpl);
    setEditTitle(tpl.title);
    setEditMessage(tpl.message);
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!activeTemplate || isUpdating) return;
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("saved_templates")
        .update({ title: editTitle, message: editMessage, updated_at: new Date().toISOString() })
        .eq("id", activeTemplate.id);
        
      if (!error) {
        setTemplates(prev => prev.map(t => t.id === activeTemplate.id ? { ...t, title: editTitle, message: editMessage } : t));
        setEditModalOpen(false);
        showToast("Template updated!");
      } else {
        console.error("Update error:", error);
        showToast("Failed to update template.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredTemplates = templates.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto pb-12 relative min-h-screen">
      <AnimatePresence>
        {toastMessage && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 bg-neutral-900 border border-neutral-800 text-white">
            <Check className="w-5 h-5 text-indigo-400" />
            <span className="font-medium text-sm">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold mb-3 tracking-tight text-white flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-indigo-500" />
            Saved Templates
          </h2>
          <p className="text-neutral-400 text-lg">Manage and reuse your personalized message templates.</p>
        </div>
        <button onClick={() => navigate('/dashboard/browse')} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all font-semibold shadow-lg shadow-indigo-500/20">
          <Plus className="w-5 h-5" />
          Browse Library
        </button>
      </div>

      {/* Search */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 mb-10 flex items-center backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search your saved templates..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((tpl) => (
            <motion.div
              key={tpl.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col group hover:border-neutral-700 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white mb-1 line-clamp-1">{tpl.title}</h3>
                  <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
                    {tpl.category || "Custom"}
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(tpl)} className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(tpl.id)} className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 bg-neutral-950 rounded-xl p-4 border border-neutral-800/50 mb-4">
                <p className="text-neutral-300 text-sm leading-relaxed line-clamp-4">{tpl.message}</p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-neutral-800 mt-auto">
                <div className="flex gap-2">
                  <button onClick={() => handleCopy(tpl.message, tpl)} className="px-3 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 transition-colors flex items-center gap-2 text-sm font-semibold">
                    {copiedId === tpl.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    Copy & Use
                  </button>
                </div>
                <div className="relative group/export">
                  <button className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-full right-0 mb-2 w-36 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl opacity-0 invisible group-hover/export:opacity-100 group-hover/export:visible transition-all z-10 overflow-hidden">
                    <button onClick={() => handleExportTxt(tpl)} className="w-full text-left px-4 py-2 hover:bg-neutral-800 text-xs text-neutral-300">Export TXT</button>
                    <button onClick={() => handleExportPdf(tpl)} className="w-full text-left px-4 py-2 hover:bg-neutral-800 text-xs text-neutral-300">Export PDF</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-20 text-neutral-500">
          <Bookmark className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg">No saved templates found.</p>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
                <h3 className="text-xl font-bold text-white">Edit Template</h3>
                <button onClick={() => setEditModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Title</label>
                  <input 
                    type="text" 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Message Content</label>
                  <textarea 
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    rows={6}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-neutral-800 bg-neutral-950/50 flex justify-end gap-3 mt-auto">
                <button onClick={() => setEditModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">Cancel</button>
                <button 
                  onClick={handleUpdate} 
                  disabled={isUpdating}
                  className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {isUpdating ? <div className="w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4"/>} 
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
