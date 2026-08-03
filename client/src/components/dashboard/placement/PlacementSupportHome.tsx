import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  BookOpen, 
  Users, 
  Briefcase, 
  Award,
  Target,
  Clock,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../../../db/supabase';
import { useAuthStore } from '../../../store/useAuthStore';

interface PlacementProgress {
  mcqs_completed: number;
  gd_topics_practiced: number;
  hr_questions_completed: number;
  average_score: number;
  time_spent_minutes: number;
}

export default function PlacementSupportHome() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [progress, setProgress] = useState<PlacementProgress | null>(null);
  const [mcqTotal, setMcqTotal] = useState(0);
  const [mcqAvg, setMcqAvg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('placement_user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      const { data: mcqData } = await supabase
        .from('mcq_user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (mcqData && mcqData.length > 0) {
        const total = mcqData.reduce((acc, curr) => acc + curr.total_attempted, 0);
        const avg = mcqData.reduce((acc, curr) => acc + curr.average_score, 0) / mcqData.length;
        setMcqTotal(total);
        setMcqAvg(avg);
      }

      if (data) {
        setProgress(data);
      }
    } catch (err) {
      console.error('Error fetching progress', err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      id: 'mcq',
      title: 'MCQ Assessment Round',
      description: 'Practice role-based MCQs, improve your accuracy, and build confidence for placement assessment rounds.',
      icon: BookOpen,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      hoverBorder: 'hover:border-blue-500/50',
      path: '/dashboard/placement/mcq',
      progress: mcqTotal,
      progressLabel: 'Questions Completed'
    },
    {
      id: 'gd',
      title: 'Group Discussion Round',
      description: 'Experience AI-powered group discussions, improve communication and teamwork, and build confidence for campus placement GD rounds.',
      icon: Users,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      hoverBorder: 'hover:border-emerald-500/50',
      path: '/dashboard/placement/gd',
      progress: progress ? progress.gd_topics_practiced : 0,
      progressLabel: 'Topics Practiced'
    },
    {
      id: 'hr',
      title: 'HR Interview Round',
      description: 'Prepare for real HR interviews with AI-driven resume-based questions, voice interaction, and personalized performance evaluation.',
      icon: Briefcase,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      hoverBorder: 'hover:border-purple-500/50',
      path: '/dashboard/placement/hr',
      progress: progress ? progress.hr_questions_completed : 0,
      progressLabel: 'Questions Reviewed'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Target className="w-8 h-8 text-indigo-500" />
          Placement Support
        </h1>
        <p className="text-neutral-400 text-lg">
          Master every round of your placement journey with curated practice modules and AI feedback.
        </p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-2"
        >
          <div className="flex items-center gap-3 text-neutral-400 mb-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="font-medium">Average Score</span>
          </div>
          {loading ? (
            <div className="h-8 bg-neutral-800 rounded animate-pulse w-24"></div>
          ) : (
            <span className="text-3xl font-bold text-white">{Math.round(((progress?.average_score || 0) + mcqAvg) / (mcqAvg > 0 && progress?.average_score ? 2 : 1))}%</span>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-2"
        >
          <div className="flex items-center gap-3 text-neutral-400 mb-2">
            <Target className="w-5 h-5 text-emerald-500" />
            <span className="font-medium">Total Practice Sessions</span>
          </div>
          {loading ? (
            <div className="h-8 bg-neutral-800 rounded animate-pulse w-24"></div>
          ) : (
            <span className="text-3xl font-bold text-white">
              {mcqTotal + (progress?.gd_topics_practiced || 0) + (progress?.hr_questions_completed || 0)}
            </span>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-2"
        >
          <div className="flex items-center gap-3 text-neutral-400 mb-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            <span className="font-medium">Time Spent Practicing</span>
          </div>
          {loading ? (
            <div className="h-8 bg-neutral-800 rounded animate-pulse w-24"></div>
          ) : (
            <span className="text-3xl font-bold text-white">{progress?.time_spent_minutes || 0} mins</span>
          )}
        </motion.div>
      </div>

      {/* Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + (idx * 0.1) }}
            className={`bg-neutral-900 border ${card.borderColor} ${card.hoverBorder} rounded-2xl p-6 transition-all group flex flex-col`}
          >
            <div className={`w-12 h-12 rounded-xl ${card.bgColor} ${card.color} flex items-center justify-center mb-6`}>
              <card.icon className="w-6 h-6" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
            <p className="text-neutral-400 mb-6 flex-1">
              {card.description}
            </p>

            <div className="bg-neutral-950 rounded-xl p-4 mb-6 border border-neutral-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-neutral-400">{card.progressLabel}</span>
                {loading ? (
                  <div className="h-5 bg-neutral-800 rounded animate-pulse w-8"></div>
                ) : (
                  <span className={`text-sm font-bold ${card.color}`}>{card.progress}</span>
                )}
              </div>
              <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${card.color.replace('text-', 'bg-')} transition-all duration-1000`} 
                  style={{ width: `${Math.min(100, (card.progress / (card.id === 'mcq' ? 50 : card.id === 'gd' ? 20 : 50)) * 100)}%` }}
                ></div>
              </div>
            </div>

            <button 
              onClick={() => navigate(card.path)}
              className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 group-hover:bg-indigo-600"
            >
              Start Practice
              <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </button>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
