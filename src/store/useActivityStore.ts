import { create } from 'zustand';
import { supabase } from '../db/supabase';

export interface Activity {
  id: string;
  user_id: string;
  activity_type: string;
  details: any;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  badge_name: string;
  description: string;
  icon: string;
  earned_at: string;
}

interface ActivityState {
  activities: Activity[];
  notifications: Notification[];
  achievements: Achievement[];
  unreadNotificationsCount: number;
  loading: boolean;
  
  initialize: (userId: string) => Promise<void>;
  logActivity: (userId: string, activity_type: string, details?: any) => Promise<void>;
  addNotification: (userId: string, title: string, message: string, type: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  clearAllNotifications: (userId: string) => Promise<void>;
  checkAndAwardAchievements: (userId: string) => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  notifications: [],
  achievements: [],
  unreadNotificationsCount: 0,
  loading: false,

  initialize: async (userId) => {
    set({ loading: true });
    try {
      const [activitiesRes, notifRes, achRes] = await Promise.all([
        supabase.from('user_activities').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
        supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50),
        supabase.from('achievements').select('*').eq('user_id', userId)
      ]);

      if (activitiesRes.error) console.error("Error fetching activities:", activitiesRes.error);
      if (notifRes.error) console.error("Error fetching notifications:", notifRes.error);
      if (achRes.error) console.error("Error fetching achievements:", achRes.error);

      const notifications = notifRes.data || [];
      const unreadCount = notifications.filter(n => !n.read).length;

      set({
        activities: activitiesRes.data || [],
        notifications,
        achievements: achRes.data || [],
        unreadNotificationsCount: unreadCount,
        loading: false
      });
    } catch (err) {
      console.error(err);
      set({ loading: false });
    }
  },

  logActivity: async (userId, activity_type, details) => {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .insert([{ user_id: userId, activity_type, details }])
        .select()
        .single();
      
      if (!error && data) {
        set(state => ({
          activities: [data, ...state.activities].slice(0, 20)
        }));
        await get().checkAndAwardAchievements(userId);
      }
    } catch (err) {
      console.error("Failed to log activity", err);
    }
  },

  addNotification: async (userId, title, message, type) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{ user_id: userId, title, message, type, read: false }])
        .select()
        .single();
        
      if (!error && data) {
        set(state => ({
          notifications: [data, ...state.notifications],
          unreadNotificationsCount: state.unreadNotificationsCount + 1
        }));
      }
    } catch (err) {
      console.error("Failed to add notification", err);
    }
  },

  markNotificationRead: async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
        
      if (!error) {
        set(state => {
          const updated = state.notifications.map(n => n.id === id ? { ...n, read: true } : n);
          return {
            notifications: updated,
            unreadNotificationsCount: updated.filter(n => !n.read).length
          };
        });
      }
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  },

  clearAllNotifications: async (userId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);
        
      if (!error) {
        set({ notifications: [], unreadNotificationsCount: 0 });
      }
    } catch (err) {
      console.error("Failed to clear notifications", err);
    }
  },

  checkAndAwardAchievements: async (userId) => {
    // This is a simplified client-side check. 
    // In production, better handled via database triggers or Edge Functions.
    const state = get();
    const existingBadges = state.achievements.map(a => a.badge_name);
    const newBadges: { badge_name: string, description: string, icon: string }[] = [];

    // Check logic
    const { count: templateUses } = await supabase.from('template_usage').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('action_type', 'used');
    const { count: saves } = await supabase.from('saved_templates').select('*', { count: 'exact', head: true }).eq('user_id', userId);
    
    if (templateUses && templateUses >= 10 && !existingBadges.includes('Used 10 Templates')) {
      newBadges.push({ badge_name: 'Used 10 Templates', description: 'You have used 10 professional templates.', icon: '🏆' });
    }
    
    if (saves && saves >= 1 && !existingBadges.includes('First Template Saved')) {
      newBadges.push({ badge_name: 'First Template Saved', description: 'You saved your very first template!', icon: '⭐' });
    }
    
    if (saves && saves >= 25 && !existingBadges.includes('Saved 25 Templates')) {
      newBadges.push({ badge_name: 'Saved 25 Templates', description: 'You have a vast library of 25 saved templates.', icon: '📚' });
    }

    if (newBadges.length > 0) {
      const insertData = newBadges.map(b => ({ ...b, user_id: userId }));
      const { data, error } = await supabase.from('achievements').insert(insertData).select();
      if (!error && data) {
        set(state => ({
          achievements: [...state.achievements, ...data]
        }));
        
        // Notify user about new badges
        for (const badge of newBadges) {
          await get().addNotification(userId, 'Achievement Unlocked!', `You earned: ${badge.badge_name}`, 'achievement');
        }
      }
    }
  }
}));
