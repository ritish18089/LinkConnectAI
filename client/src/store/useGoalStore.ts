import { create } from 'zustand';
import { supabase } from '../db/supabase';

export interface UserGoal {
  id: string;
  user_id: string;
  weekly_connection_goal: number;
  target_templates: number;
  saved_templates_goal: number;
  profile_completion_goal: number;
  daily_connection_goal?: number;
  daily_template_goal?: number;
  completed_connections: number;
  completed_templates: number;
  reset_frequency: string;
  last_reset_at: string;
}

export interface UserGoalHistory {
  id: string;
  user_id: string;
  period_identifier: string;
  connection_goal: number;
  template_goal: number;
  completed_connections: number;
  completed_templates: number;
  status: string;
  created_at: string;
}

interface GoalState {
  goal: UserGoal | null;
  loading: boolean;
  
  initialize: (userId: string) => Promise<void>;
  updateGoal: (userId: string, updates: Partial<UserGoal>) => Promise<void>;
  incrementProgress: (userId: string, type: 'connections' | 'templates', amount?: number) => Promise<void>;
  manualUpdateProgress: (userId: string, type: 'connections' | 'templates', value: number) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goal: null,
  loading: false,

  initialize: async (userId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        // Initialize default goal
        const { data: newData, error: insertError } = await supabase
          .from('user_goals')
          .upsert([{ 
            user_id: userId,
            weekly_connection_goal: 10,
            target_templates: 5,
            completed_connections: 0,
            completed_templates: 0,
            reset_frequency: 'weekly',
            last_reset_at: new Date().toISOString()
          }], { onConflict: 'user_id' })
          .select()
          .single();
          
        if (!insertError && newData) {
          set({ goal: newData, loading: false });
        }
      } else {
        // Check for reset before setting goal
        const now = new Date();
        const lastReset = new Date(data.last_reset_at || data.created_at);
        let needsReset = false;
        
        if (data.reset_frequency === 'weekly') {
          // Check if it's a new week (starts Monday)
          const currentWeekStart = new Date(now);
          currentWeekStart.setHours(0, 0, 0, 0);
          currentWeekStart.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
          if (lastReset < currentWeekStart) {
            needsReset = true;
          }
        } else if (data.reset_frequency === 'monthly') {
          // Check if it's a new month
          const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          if (lastReset < currentMonthStart) {
            needsReset = true;
          }
        }

        if (needsReset) {
          // 1. Save history
          const periodId = data.reset_frequency === 'weekly' 
            ? `Week of ${lastReset.toLocaleDateString()}` 
            : `Month of ${lastReset.toLocaleString('default', { month: 'long', year: 'numeric' })}`;
            
          const isCompleted = data.completed_connections >= data.weekly_connection_goal && 
                              data.completed_templates >= data.target_templates;
          
          await supabase.from('user_goals_history').insert({
            user_id: userId,
            period_identifier: periodId,
            connection_goal: data.weekly_connection_goal,
            template_goal: data.target_templates,
            completed_connections: data.completed_connections,
            completed_templates: data.completed_templates,
            status: isCompleted ? 'Completed' : 'Incomplete'
          });

          // 2. Reset progress
          const { data: updatedData, error: updateError } = await supabase
            .from('user_goals')
            .update({
              completed_connections: 0,
              completed_templates: 0,
              last_reset_at: now.toISOString()
            })
            .eq('user_id', userId)
            .select()
            .single();

          if (!updateError && updatedData) {
            set({ goal: updatedData, loading: false });
            return;
          }
        }

        set({ goal: data, loading: false });
      }
    } catch (err) {
      console.error("Failed to initialize goals", err);
      set({ loading: false });
    }
  },

  updateGoal: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('user_goals')
        .upsert({ user_id: userId, ...updates }, { onConflict: 'user_id' })
        .select()
        .single();
        
      if (!error && data) {
        set({ goal: data });
      }
    } catch (err) {
      console.error("Failed to update goal", err);
    }
  },

  incrementProgress: async (userId, type, amount = 1) => {
    const { goal } = get();
    if (!goal) return;

    let updates: Partial<UserGoal> = {};
    if (type === 'connections') {
      const max = goal.weekly_connection_goal;
      updates.completed_connections = Math.min(goal.completed_connections + amount, max);
    } else {
      const max = goal.target_templates;
      updates.completed_templates = Math.min(goal.completed_templates + amount, max);
    }

    try {
      const { data, error } = await supabase
        .from('user_goals')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();
        
      if (!error && data) {
        set({ goal: data });
      }
    } catch (err) {
      console.error("Failed to increment goal progress", err);
    }
  },

  manualUpdateProgress: async (userId, type, value) => {
    const { goal } = get();
    if (!goal) return;

    let updates: Partial<UserGoal> = {};
    if (type === 'connections') {
      const max = goal.weekly_connection_goal;
      updates.completed_connections = Math.max(0, Math.min(value, max));
    } else {
      const max = goal.target_templates;
      updates.completed_templates = Math.max(0, Math.min(value, max));
    }

    try {
      const { data, error } = await supabase
        .from('user_goals')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();
        
      if (!error && data) {
        set({ goal: data });
      }
    } catch (err) {
      console.error("Failed to manually update goal progress", err);
    }
  }
}));
