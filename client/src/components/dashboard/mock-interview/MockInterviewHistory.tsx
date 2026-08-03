import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Clock, Award, Briefcase, ChevronRight, Activity } from 'lucide-react';
import { supabase } from '../../../db/supabase';
import { useAuthStore } from '../../../store/useAuthStore';

export default function MockInterviewHistory() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('mock_interviews')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setInterviews(data || []);
      } catch (err) {
        console.error("Failed to fetch mock interview history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const totalInterviews = interviews.length;
  const avgScore = totalInterviews > 0 
    ? Math.round(interviews.reduce((acc, curr) => acc + (curr.overall_score || 0), 0) / totalInterviews)
    : 0;
  const bestScore = totalInterviews > 0 
    ? Math.max(...interviews.map(i => i.overall_score || 0))
    : 0;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <button 
        onClick={() => navigate('/dashboard/mock-interview')} 
        className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Mock Interview
      </button>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Interview History</h1>
        <p className="text-neutral-400">Track your progress and review past mock interviews.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-neutral-400 text-sm mb-1">Total Interviews</p>
            <p className="text-2xl font-bold text-white">{totalInterviews}</p>
          </div>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-neutral-400 text-sm mb-1">Average Score</p>
            <p className="text-2xl font-bold text-white">{avgScore}/100</p>
          </div>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500/10 text-yellow-500 rounded-xl flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-neutral-400 text-sm mb-1">Best Score</p>
            <p className="text-2xl font-bold text-white">{bestScore}/100</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-6">Recent Sessions</h2>
      
      {loading ? (
        <div className="text-center text-neutral-400 py-12">Loading history...</div>
      ) : interviews.length === 0 ? (
        <div className="text-center bg-neutral-900 border border-neutral-800 rounded-2xl p-12">
          <Clock className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No interviews yet</h3>
          <p className="text-neutral-400 mb-6">Start your first mock interview to see your history here.</p>
          <button 
            onClick={() => navigate('/dashboard/mock-interview')}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
          >
            Start Mock Interview
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {interviews.map(interview => (
            <div key={interview.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-neutral-700 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{interview.job_role}</h3>
                  <span className="px-2 py-1 bg-neutral-800 text-neutral-300 rounded text-xs font-medium">
                    {interview.interview_type}
                  </span>
                  <span className="px-2 py-1 bg-neutral-800 text-neutral-300 rounded text-xs font-medium">
                    {interview.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-400">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(interview.created_at).toLocaleDateString()}</span>
                  <span>{interview.duration_mins} Mins</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Score</p>
                  <p className={`text-xl font-bold ${interview.overall_score >= 80 ? 'text-emerald-400' : interview.overall_score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {interview.overall_score}/100
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/dashboard/mock-interview/report', {
                    state: {
                      evaluation: interview.feedback_report,
                      messages: interview.transcript,
                      candidateDetails: {
                        jobRole: interview.job_role,
                        experienceLevel: interview.experience_level,
                        interviewType: interview.interview_type,
                        difficulty: interview.difficulty,
                        durationMins: interview.duration_mins
                      }
                    }
                  })}
                  className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 transition-colors shrink-0"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
