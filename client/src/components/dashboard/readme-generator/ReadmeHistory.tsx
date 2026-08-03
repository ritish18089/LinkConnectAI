import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Clock, FileText, Download, Copy, Trash2, Eye, User, FolderGit2 } from 'lucide-react';
import { supabase } from '../../../db/supabase';
import { useAuthStore } from '../../../store/useAuthStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ReadmeHistory() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReadme, setSelectedReadme] = useState<any>(null);
  
  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);
  
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('readme_history')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setHistory(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this README?')) return;
    try {
      const { error } = await supabase.from('readme_history').delete().eq('id', id);
      if (!error) {
        setHistory(prev => prev.filter(h => h.id !== id));
        if (selectedReadme?.id === id) setSelectedReadme(null);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('Markdown copied to clipboard!');
  };
  
  const downloadReadme = (content: string, title: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_README.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  if (selectedReadme) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <button 
          onClick={() => setSelectedReadme(null)}
          className="flex items-center text-neutral-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to History
        </button>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col h-[800px]">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
            <h3 className="font-medium text-white flex items-center gap-2">
              {selectedReadme.type === 'profile' ? <User className="w-4 h-4 text-indigo-400" /> : <FolderGit2 className="w-4 h-4 text-emerald-400" />}
              {selectedReadme.title}
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={() => copyToClipboard(selectedReadme.content)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
              <button 
                onClick={() => downloadReadme(selectedReadme.content, selectedReadme.title)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
          <div className="p-6 overflow-y-auto bg-neutral-900 flex-1 prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {selectedReadme.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard/readme-generator')}
            className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Generation History</h1>
            <p className="text-neutral-400 text-sm">Your previously generated README files.</p>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" /></div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 border border-neutral-800 border-dashed rounded-2xl bg-neutral-900/50">
          <FileText className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No History Yet</h3>
          <p className="text-neutral-400 max-w-md mx-auto mb-6">You haven't generated any README files yet. Head back to create your first one.</p>
          <button 
            onClick={() => navigate('/dashboard/readme-generator')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Generate README
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${item.type === 'profile' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {item.type === 'profile' ? <User className="w-5 h-5" /> : <FolderGit2 className="w-5 h-5" />}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setSelectedReadme(item)} className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg" title="View"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{item.title}</h3>
              <p className="text-xs text-neutral-500 flex items-center gap-1 mb-4">
                <Clock className="w-3 h-3" /> {new Date(item.created_at).toLocaleDateString()}
              </p>
              <div className="flex gap-2 mt-auto pt-4 border-t border-neutral-800">
                <button 
                  onClick={() => copyToClipboard(item.content)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
                <button 
                  onClick={() => downloadReadme(item.content, item.title)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-xs font-medium rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
