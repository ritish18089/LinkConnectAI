import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, Mail, Phone, MapPin, Globe, Code, 
  Award, Target, Mic, Briefcase, Flame, Crown, 
  FileText, CheckCircle2, Clock, CalendarDays, 
  Settings, Loader2, Edit2, Save, X
} from 'lucide-react';
import { supabase } from '../../../db/supabase';
import { useAuthStore } from '../../../store/useAuthStore';
import { useActivityStore } from '../../../store/useActivityStore';
import { Bell, Trash2, CheckCheck, Eye } from 'lucide-react';
import ProfessionalProfile from './ProfessionalProfile';
import ProfessionalInformation from './ProfessionalInformation';
export default function ProfileHome() {
  const { user } = useAuthStore();
  const { notifications, markNotificationRead, clearAllNotifications } = useActivityStore();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'read' | 'unread'>('all');
  
  // Profile Data
  const [profile, setProfile] = useState<any>({
    full_name: '',
    phone: '',
    location: '',
    linkedin_url: '',
    github_url: '',
    xp: 0,
    level: 1,
    current_streak: 1,
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
    total_resumes_created: 0,
    total_resumes_downloaded: 0,
    earned_badges: []
  });

  // Edit State
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    location: '',
    linkedin_url: '',
    github_url: ''
  });

  // Stats
  const [stats, setStats] = useState({
    resumeAnalyzed: 0,
    mcqCompleted: 0,
    mcqAvgScore: 0,
    gdCompleted: 0,
    hrCompleted: 0,
    mockCompleted: 0,
    atsReports: 0
  });

  // Recent Activity
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const syncBadgesAndXP = async (currentProfile: any, currentStats: any) => {
    const earnedBadges = currentProfile.earned_badges || [];
    let newXpEarned = 0;
    let updatedEarnedBadges = [...earnedBadges];
    let hasNewBadges = false;

    const evaluatedBadges = [
      { id: 'resume-expert', progress: Math.min(currentProfile.total_resumes_downloaded || 0, 5), max: 5, xp: 100 },
      { id: 'mcq-master', progress: Math.min(currentStats.mcqCompleted, 10), max: 10, xp: 150 },
      { id: 'gd-champion', progress: Math.min(currentStats.gdCompleted, 10), max: 10, xp: 200 },
      { id: 'interview-ready', progress: Math.min((currentStats.hrCompleted + currentStats.mockCompleted), 5), max: 5, xp: 250 },
      { id: 'streak', progress: Math.min(currentProfile.current_streak || 1, 7), max: 7, xp: 150 },
      { id: 'placement-pro', progress: currentStats.mcqAvgScore >= 90 && currentStats.mockCompleted > 0 && currentStats.gdCompleted > 0 ? 1 : 0, max: 1, xp: 500 }
    ];

    evaluatedBadges.forEach(badge => {
      const isUnlocked = badge.progress >= badge.max;
      const alreadyEarned = updatedEarnedBadges.find(b => b.id === badge.id);

      if (isUnlocked && !alreadyEarned) {
        newXpEarned += badge.xp;
        updatedEarnedBadges.push({
          id: badge.id,
          unlockedAt: new Date().toISOString(),
          xpAwarded: badge.xp
        });
        hasNewBadges = true;
      }
    });

    if (hasNewBadges) {
      const newTotalXp = (currentProfile.xp || 0) + newXpEarned;
      const newLevel = Math.floor(newTotalXp / 1000) + 1;

      // Update Supabase
      const { error } = await supabase.from('profile_users').update({
        xp: newTotalXp,
        level: newLevel,
        earned_badges: updatedEarnedBadges
      }).eq('user_id', user!.id);

      if (!error) {
        // Update local state to instantly reflect new XP and Level
        setProfile((prev: any) => ({
          ...prev,
          xp: newTotalXp,
          level: newLevel,
          earned_badges: updatedEarnedBadges
        }));
      }
    }
  };

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from('profile_users')
        .select('*')
        .eq('user_id', user!.id)
        .single();
        
      if (profileData) {
        setProfile(profileData);
        setEditForm({
          full_name: profileData.full_name || user?.user_metadata?.full_name || '',
          phone: profileData.phone || '',
          location: profileData.location || '',
          linkedin_url: profileData.linkedin_url || '',
          github_url: profileData.github_url || ''
        });
      } else {
        // Fallback or initialization
        setEditForm({
          full_name: user?.user_metadata?.full_name || '',
          phone: '',
          location: '',
          linkedin_url: '',
          github_url: ''
        });
      }

      // 2. Fetch Placement Progress
      const { data: placementData } = await supabase
        .from('placement_user_progress')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      // 3. Fetch Mock Interviews
      const { data: mockData } = await supabase
        .from('mock_interviews')
        .select('id')
        .eq('user_id', user!.id);

      // 4. Fetch Resume Analyses
      const { data: analysisData } = await supabase
        .from('resume_analyses')
        .select('id')
        .eq('user_id', user!.id);

      // 5. Fetch Activities
      const { data: activityData } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const newStats = {
        resumeAnalyzed: analysisData?.length || 0,
        atsReports: analysisData?.length || 0,
        mcqCompleted: placementData?.mcqs_completed || 0,
        mcqAvgScore: placementData?.average_score || 0,
        gdCompleted: placementData?.gd_topics_practiced || 0,
        hrCompleted: placementData?.hr_questions_completed || 0,
        mockCompleted: mockData?.length || 0,
      };
      
      setStats(newStats);
      setActivities(activityData || []);

      // Synchronize XP and Level if new badges are unlocked
      if (profileData) {
        await syncBadgesAndXP(profileData, newStats);
      }

    } catch (error) {
      console.error("Error fetching profile data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profile_users')
        .update({
          full_name: editForm.full_name,
          phone: editForm.phone,
          location: editForm.location,
          linkedin_url: editForm.linkedin_url,
          github_url: editForm.github_url
        })
        .eq('user_id', user!.id);
        
      if (!error) {
        setProfile((prev: any) => ({ ...prev, ...editForm }));
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate Badges
  const badges = [
    {
      id: 'resume-expert',
      title: 'Resume Expert',
      description: 'Created and downloaded multiple professional resumes.',
      icon: <FileText className="w-6 h-6" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      progress: Math.min(profile.total_resumes_downloaded || 0, 5),
      max: 5,
      xp: 100
    },
    {
      id: 'mcq-master',
      title: 'MCQ Master',
      description: 'Completed multiple MCQ assessments with excellent scores.',
      icon: <Target className="w-6 h-6" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      progress: Math.min(stats.mcqCompleted, 10),
      max: 10,
      xp: 150
    },
    {
      id: 'gd-champion',
      title: 'GD Champion',
      description: 'Successfully completed Group Discussion sessions.',
      icon: <Mic className="w-6 h-6" />,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      progress: Math.min(stats.gdCompleted, 10),
      max: 10,
      xp: 200
    },
    {
      id: 'interview-ready',
      title: 'Interview Ready',
      description: 'Completed HR and Mock Interviews successfully.',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      progress: Math.min((stats.hrCompleted + stats.mockCompleted), 5),
      max: 5,
      xp: 250
    },
    {
      id: 'streak',
      title: '7-Day Streak',
      description: 'Used LinkConnect AI for seven consecutive days.',
      icon: <Flame className="w-6 h-6" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      progress: Math.min(profile.current_streak || 1, 7),
      max: 7,
      xp: 150
    },
    {
      id: 'placement-pro',
      title: 'Placement Pro',
      description: 'Completed all placement preparation modules with excellent performance.',
      icon: <Crown className="w-6 h-6" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-400/30',
      progress: stats.mcqAvgScore >= 90 && stats.mockCompleted > 0 && stats.gdCompleted > 0 ? 1 : 0,
      max: 1,
      xp: 500
    }
  ];

  if (loading && !profile.full_name) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const xpProgress = ((profile.xp || 0) % 1000) / 10; // Assuming 1000 XP per level

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
      
      {/* PROFILE HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-1 flex-shrink-0">
            <div className="w-full h-full bg-neutral-900 rounded-xl flex items-center justify-center overflow-hidden">
              {profile.profile_image_url ? (
                <img src={profile.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-indigo-400" />
              )}
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">{profile.full_name || 'User Name'}</h1>
            <p className="text-neutral-400 flex items-center justify-center md:justify-start gap-2 mb-6">
              <Mail className="w-4 h-4" /> {user?.email}
            </p>
            

          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Personal Info & Activity Summary */}
        <div className="space-y-8 lg:col-span-1">
          
          {/* PERSONAL INFO */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Personal Information</h3>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsEditing(false)} className="p-2 text-neutral-400 hover:text-white transition-colors" title="Cancel">
                    <X className="w-4 h-4" />
                  </button>
                  <button onClick={handleSaveProfile} className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors" title="Save">
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors" title="Edit Profile">
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <User className="w-5 h-5 text-neutral-500 mt-1" />
                <div className="flex-1">
                  <label className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-1 block">Full Name</label>
                  {isEditing ? (
                    <input type="text" value={editForm.full_name} onChange={(e) => setEditForm({...editForm, full_name: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                  ) : (
                    <div className="text-neutral-200 text-sm">{profile.full_name || 'Not set'}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-neutral-500 mt-1" />
                <div className="flex-1">
                  <label className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-1 block">Email (Read Only)</label>
                  <div className="text-neutral-200 text-sm">{user?.email}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-neutral-500 mt-1" />
                <div className="flex-1">
                  <label className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-1 block">Phone Number</label>
                  {isEditing ? (
                    <input type="text" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                  ) : (
                    <div className="text-neutral-200 text-sm">{profile.phone || 'Not set'}</div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-neutral-500 mt-1" />
                <div className="flex-1">
                  <label className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-1 block">Location</label>
                  {isEditing ? (
                    <input type="text" value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                  ) : (
                    <div className="text-neutral-200 text-sm">{profile.location || 'Not set'}</div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Globe className="w-5 h-5 text-neutral-500 mt-1" />
                <div className="flex-1">
                  <label className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-1 block">LinkedIn</label>
                  {isEditing ? (
                    <input type="text" value={editForm.linkedin_url} onChange={(e) => setEditForm({...editForm, linkedin_url: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                  ) : (
                    <div className="text-neutral-200 text-sm">{profile.linkedin_url || 'Not set'}</div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Code className="w-5 h-5 text-neutral-500 mt-1" />
                <div className="flex-1">
                  <label className="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-1 block">GitHub</label>
                  {isEditing ? (
                    <input type="text" value={editForm.github_url} onChange={(e) => setEditForm({...editForm, github_url: e.target.value})} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                  ) : (
                    <div className="text-neutral-200 text-sm">{profile.github_url || 'Not set'}</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
              <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Member since {new Date(profile.created_at).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Active Status</span>
            </div>
          </motion.div>

          <ProfessionalProfile profile={profile} setProfile={setProfile} userId={user!.id} />

        </div>

        {/* RIGHT COLUMN: Achievements & Recent Activity */}
        <div className="space-y-8 lg:col-span-2">
          
          <ProfessionalInformation profile={profile} setProfile={setProfile} userId={user!.id} />

          {/* RECENT ACTIVITY */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
            
            {activities.length > 0 ? (
              <div className="space-y-6">
                {activities.map((activity, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    {idx !== activities.length - 1 && (
                      <div className="absolute top-8 left-4 bottom-[-16px] w-px bg-neutral-800"></div>
                    )}
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 z-10">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="flex-1 pb-1">
                      <h4 className="text-sm font-medium text-white mb-1">
                        {activity.activity_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <p className="text-xs text-neutral-500">
                        {new Date(activity.created_at).toLocaleDateString()} at {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-neutral-800 border-dashed rounded-xl">
                <Clock className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-400 text-sm">No recent activity found.</p>
                <p className="text-neutral-500 text-xs mt-1">Start using LinkConnect AI to see your activity here.</p>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
