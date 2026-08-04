import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Bot, 
  FileText, 
  BarChart, 
  Briefcase, 
  Mic, 
  ChevronRight, 
  BookOpenText,
  FileSignature,
  Download,
  Calendar,
  Clock,
  Target,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../../store/useAuthStore';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const MotionLink = motion.create(Link);


const quickAccess = [
  {
    id: 1,
    title: "AI Assistant",
    desc: "Get instant help with networking.",
    icon: Bot,
    path: "/dashboard/ai",
    cta: "Open Assistant",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10"
  },
  {
    id: 2,
    title: "Resume Analyzer",
    desc: "Score and improve your resume.",
    icon: BarChart,
    path: "/dashboard/resume-analyzer",
    cta: "Analyze Now",
    color: "text-rose-400",
    bg: "bg-rose-500/10"
  },
  {
    id: 3,
    title: "Mock Interview",
    desc: "Practice with AI interviewer.",
    icon: Mic,
    path: "/dashboard/mock-interview",
    cta: "Start Interview",
    color: "text-orange-400",
    bg: "bg-orange-500/10"
  },
  {
    id: 4,
    title: "Placement Support",
    desc: "MCQ and HR prep materials.",
    icon: Target,
    path: "/dashboard/placement",
    cta: "Explore Now",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10"
  },
  {
    id: 5,
    title: "Browse Templates",
    desc: "Find the perfect resume template.",
    icon: FileText,
    path: "/dashboard/resume-templates",
    cta: "Browse Now",
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  }
];

const recentActivity = [
  { id: 1, type: "Resume Generated", icon: FileText, date: "Today", time: "10:30 AM", color: "text-blue-400", bg: "bg-blue-500/10", path: "/dashboard/templates" },
  { id: 2, type: "Mock Interview Completed", icon: Mic, date: "Yesterday", time: "04:15 PM", color: "text-orange-400", bg: "bg-orange-500/10", path: "/dashboard/mock-interview/history" },
  { id: 3, type: "Resume Analyzed", icon: BarChart, date: "Yesterday", time: "11:20 AM", color: "text-rose-400", bg: "bg-rose-500/10", path: "/dashboard/resume-analyzer" },
  { id: 4, type: "README Generated", icon: BookOpenText, date: "Mon", time: "09:00 AM", color: "text-indigo-400", bg: "bg-indigo-500/10", path: "/dashboard/readme-generator" },
  { id: 5, type: "Cover Letter Generated", icon: FileSignature, date: "Sun", time: "02:45 PM", color: "text-emerald-400", bg: "bg-emerald-500/10", path: "/dashboard/cover-letter" },
];

const progressData = [
  { name: 'Completed', value: 68, color: '#6366f1' },
  { name: 'Remaining', value: 32, color: '#262626' } // neutral-800
];

export default function Overview() {
  const { user, profileUser } = useAuthStore();
  const navigate = useNavigate();

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const displayName = profileUser?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || 'User';

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 overflow-x-hidden">
      
      {/* 1. Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between min-h-[240px]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 z-0 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 space-y-4 w-full md:w-[60%] lg:w-[65%]">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{displayName}</span> 👋
          </h1>
          <p className="text-lg text-neutral-400">
            Let's continue your placement preparation journey. You're making great progress!
          </p>
        </div>

        {/* Illustration */}
        <motion.div 
          className="relative z-10 w-full md:w-[40%] lg:w-[35%] flex justify-center md:justify-end mt-8 md:mt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, -12, 0] }}
          transition={{ 
            opacity: { duration: 0.8, delay: 0.2 },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <img 
            src="/images/welcome-illustration.png" 
            alt="Welcome Illustration" 
            className="w-full max-w-[240px] md:max-w-[280px] lg:max-w-[320px] h-auto object-contain"
          />
        </motion.div>
      </motion.div>



      {/* 3. Quick Access */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickAccess.map((item, idx) => {
            const Icon = item.icon;
            return (
              <MotionLink
                to={item.path}
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (idx * 0.1) }}
                className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800 rounded-2xl p-5 hover:bg-neutral-800/80 transition-all group flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-900/50"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-neutral-400 mb-6 flex-grow">{item.desc}</p>
                <div className="w-full py-2 rounded-lg bg-neutral-800 group-hover:bg-indigo-600 transition-colors text-sm font-medium text-white flex items-center justify-center gap-2">
                  {item.cta}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </MotionLink>
            );
          })}
        </div>
      </div>

      {/* 4 & 5. Recent Activity and Weekly Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-7 bg-neutral-900/40 backdrop-blur-md border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col h-full"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <Link to="/dashboard/profile" className="text-sm font-medium text-indigo-400 hover:text-indigo-300">View All</Link>
          </div>
          
          <div className="space-y-4 flex-grow">
            {recentActivity.map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <Link to={activity.path} key={activity.id}>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + (idx * 0.1) }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-neutral-900/50 hover:bg-neutral-800/80 border border-transparent hover:border-neutral-700 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${activity.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-white group-hover:text-indigo-400 transition-colors truncate">{activity.type}</div>
                        <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 whitespace-nowrap"><Calendar className="w-3 h-3" /> {activity.date}</span>
                          <span className="flex items-center gap-1 whitespace-nowrap"><Clock className="w-3 h-3" /> {activity.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                      <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Weekly Progress */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-5 bg-neutral-900/40 backdrop-blur-md border border-neutral-800 rounded-3xl p-6 sm:p-8"
        >
          <h2 className="text-xl font-bold text-white mb-6">Weekly Progress</h2>
          
          {/* Circular Chart Area */}
          <div className="flex flex-col items-center justify-center mb-8 relative">
            <div className="w-48 h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={progressData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={10}
                  >
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Inner Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-bold text-white">68%</span>
                <span className="text-sm font-medium text-neutral-400">Overall Score</span>
              </div>
            </div>
          </div>

          {/* Linear Progress Bars */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-white">Resume Improvement</span>
                <span className="font-bold text-indigo-400">85%</span>
              </div>
              <div className="h-2.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '85%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-white">Mock Interviews</span>
                <span className="font-bold text-orange-400">40%</span>
              </div>
              <div className="h-2.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '40%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-white">AI Interactions</span>
                <span className="font-bold text-emerald-400">92%</span>
              </div>
              <div className="h-2.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '92%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-white">MCQ Practice</span>
                <span className="font-bold text-purple-400">60%</span>
              </div>
              <div className="h-2.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '60%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
