import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { 
  ArrowLeft,
  Award,
  CheckCircle2,
  XCircle,
  Lightbulb,
  FileText
} from 'lucide-react';
import { supabase } from '../../../db/supabase';
import { useAuthStore } from '../../../store/useAuthStore';

export default function MockInterviewReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const { evaluation, messages, candidateDetails, durationUsed } = location.state || {};
  const hasSaved = useRef(false);

  useEffect(() => {
    if (!evaluation || !candidateDetails || !user || hasSaved.current) return;
    hasSaved.current = true;
    
    // Save to database
    const saveReport = async () => {
      try {
        await supabase.from('mock_interviews').insert({
          user_id: user.id,
          job_role: candidateDetails.jobRole,
          experience_level: candidateDetails.experienceLevel,
          interview_type: candidateDetails.interviewType,
          difficulty: candidateDetails.difficulty,
          duration_mins: Math.ceil(durationUsed / 60) || candidateDetails.durationMins,
          resume_text: candidateDetails.resumeText,
          transcript: messages,
          overall_score: evaluation.score,
          feedback_report: evaluation
        });
      } catch (err) {
        console.error("Failed to save mock interview report", err);
      }
    };
    
    saveReport();
  }, [evaluation, candidateDetails, messages, user, durationUsed]);

  if (!evaluation) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl text-white">No evaluation data found.</h2>
        <button onClick={() => navigate('/dashboard/mock-interview')} className="mt-4 text-indigo-400">Return to Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate('/dashboard/mock-interview')} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Mock Interviews
        </button>
        <button onClick={() => navigate('/dashboard/mock-interview/history')} className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors">
          <FileText className="w-4 h-4" /> View History
        </button>
      </div>
      
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-indigo-500/20 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <Award className="w-12 h-12" />
          <div className="absolute -top-2 -right-2 bg-neutral-900 rounded-full p-1">
            <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {evaluation.score}/100
            </span>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Interview Evaluation Report</h2>
        <p className="text-neutral-400 text-lg">
          Readiness Level: <span className="text-emerald-400 font-semibold">{evaluation.interviewReadinessLevel}</span>
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Strengths
          </h3>
          <ul className="space-y-3">
            {evaluation.strengths?.map((str: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-neutral-300">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                <span className="text-sm leading-relaxed">{str}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5" /> Weaknesses
          </h3>
          <ul className="space-y-3">
            {evaluation.weaknesses?.map((wk: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-neutral-300">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 shrink-0"></span>
                <span className="text-sm leading-relaxed">{wk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-lg mb-8">
        <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" /> Areas for Improvement & Recommendations
        </h3>
        <ul className="space-y-3">
          {evaluation.improvementAreas?.map((imp: string, i: number) => (
            <li key={i} className="flex items-start gap-3 text-neutral-300">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 shrink-0"></span>
              <span className="text-sm leading-relaxed">{imp}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" /> Suggested Better Answers
        </h3>
        <ul className="space-y-4">
          {evaluation.recommendedAnswers?.map((ans: string, i: number) => (
            <li key={i} className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
              <span className="text-sm leading-relaxed text-neutral-300">{ans}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
