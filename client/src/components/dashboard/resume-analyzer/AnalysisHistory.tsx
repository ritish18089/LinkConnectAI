import React, { useEffect, useState } from 'react';
import { supabase } from '../../../db/supabase';
import { useAuthStore } from '../../../store/useAuthStore';
import { Trash2, ExternalLink, ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function AnalysisHistory({ onBack }: { onBack?: () => void }) {
  const { user } = useAuthStore();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('resume_analyses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
    setLoading(false);
  };

  const deleteRecord = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return;
    try {
      const { error } = await supabase
        .from('resume_analyses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setHistory(history.filter(h => h.id !== id));
    } catch (err) {
      console.error("Error deleting record:", err);
      alert("Failed to delete record.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4 mb-8">
        {onBack && (
          <button onClick={onBack} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-3xl font-bold text-white">Analysis History</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="text-center bg-neutral-900 border border-neutral-800 rounded-2xl p-12">
          <p className="text-neutral-400">No previous analyses found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.map((record) => (
            <div key={record.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{record.resume_name}</h3>
                <p className="text-sm text-neutral-400 mb-2">
                  {format(new Date(record.created_at), 'PPP ')}
                </p>
                <div className="flex gap-4 mt-3">
                  <div className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg text-sm border border-indigo-500/20">
                    ATS Score: {record.ats_score}%
                  </div>
                  <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-lg text-sm border border-green-500/20">
                    Match: {record.overall_match}%
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => deleteRecord(record.id)}
                  className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
