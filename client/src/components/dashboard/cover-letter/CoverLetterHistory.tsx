import React, { useEffect, useState } from 'react';
import { supabase } from '../../../db/supabase';
import { useAuthStore } from '../../../store/useAuthStore';
import { ArrowLeft, Loader2, Search, Calendar, Building, FileText, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router';
import { format } from 'date-fns';

export default function CoverLetterHistory() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cover_letter_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteLetter = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this cover letter?")) return;
    
    try {
      const { error } = await supabase.from('cover_letter_history').delete().eq('id', id);
      if (error) throw error;
      setHistory(history.filter(h => h.id !== id));
      if (selectedLetter?.id === id) setSelectedLetter(null);
    } catch (err) {
      console.error('Error deleting letter:', err);
      alert('Failed to delete cover letter.');
    }
  };

  const filteredHistory = history.filter(item => 
    item.company_name.toLowerCase().includes(search.toLowerCase()) ||
    item.job_role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-[calc(100vh-2rem)]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/cover-letter')} className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Cover Letter History</h1>
            <p className="text-neutral-400 text-sm">View and manage your previously generated cover letters.</p>
          </div>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search by company or role..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        {/* List View */}
        <div className="w-full md:w-1/3 flex flex-col min-h-0 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-neutral-800 bg-neutral-950">
            <h3 className="font-semibold text-white flex items-center gap-2"><FileText className="w-4 h-4" /> Saved Letters</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-10 px-4 text-neutral-500 text-sm">
                No cover letters found.
              </div>
            ) : (
              filteredHistory.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedLetter(item)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedLetter?.id === item.id ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-white truncate pr-2">{item.company_name}</h4>
                    <button onClick={(e) => deleteLetter(item.id, e)} className="text-neutral-500 hover:text-red-400 transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                    <Building className="w-3.5 h-3.5" />
                    <span className="truncate">{item.job_role}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Preview View */}
        <div className="w-full md:w-2/3 flex flex-col min-h-0 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-neutral-800 bg-neutral-950 flex justify-between items-center">
            <h3 className="font-semibold text-white flex items-center gap-2"><Eye className="w-4 h-4" /> Preview</h3>
            {selectedLetter && (
              <div className="text-xs text-neutral-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Generated on {format(new Date(selectedLetter.created_at), 'MMM d, yyyy')}
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-neutral-950">
            {selectedLetter ? (
              <div className="bg-white text-black p-8 rounded-xl max-w-3xl mx-auto shadow-sm whitespace-pre-wrap font-sans text-sm md:text-base">
                {selectedLetter.content}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-neutral-500">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p>Select a cover letter from the list to view its contents.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
