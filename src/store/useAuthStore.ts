import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../db/supabase';
import { ProfileUser } from '../types';
import i18n from '../i18n';

interface LinkedInProfile {
  id: string;
  user_id: string;
  linkedin_id: string;
  full_name: string;
  email: string;
  profile_picture: string;
  profile_url: string;
  headline: string;
  company: string;
  designation: string;
  industry: string;
  location: string;
  country: string;
  connected: boolean;
  connected_at: string;
  last_login_at: string;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  linkedinProfile: LinkedInProfile | null;
  profileUser: ProfileUser | null;
  isConnected: boolean;
  loading: boolean;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
  disconnectLinkedIn: () => Promise<void>;
  updateProfileImage: (url: string) => Promise<void>;
  removeProfileImage: () => Promise<void>;
  updateProfileData: (data: Partial<ProfileUser>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  linkedinProfile: null,
  profileUser: null,
  isConnected: false,
  loading: true,

  initialize: async () => {
    const fetchAndSyncProfile = async (session: Session) => {
      let currentProfile = null;
      let isConnected = false;

      // If they just logged in with LinkedIn, we should upsert their data
      if (session?.user?.app_metadata?.provider === 'linkedin_oidc') {
        const meta = session.user.user_metadata;
        const profilePayload = {
          user_id: session.user.id,
          linkedin_id: meta.sub || session.user.id,
          full_name: meta.full_name || meta.name || '',
          email: meta.email || session.user.email || '',
          profile_picture: meta.avatar_url || meta.picture || '',
          connected: true,
          last_login_at: new Date().toISOString(),
        };

        try {
          const { data, error } = await supabase
            .from('linkedin_profiles')
            .upsert(profilePayload)
            .select()
            .single();

          if (!error && data) {
            currentProfile = data;
            isConnected = data.connected;
          }
        } catch (err) {
          console.error("Failed to sync LinkedIn profile:", err);
        }

        // Also sync basic user info to users table
        try {
          await supabase.from('users').upsert({
            id: session.user.id,
            email: session.user.email,
            full_name: meta.full_name || meta.name || '',
            avatar_url: meta.avatar_url || meta.picture || '',
          });
        } catch (err) {
          console.error("Failed to sync user:", err);
        }
      }

      // If we didn't just upsert (or if it failed/wasn't linkedin provider), try fetching the existing profile
      if (!currentProfile) {
        try {
          const { data, error } = await supabase
            .from('linkedin_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (!error && data) {
            currentProfile = data;
            isConnected = data.connected;
          }
        } catch (err) {
          console.error("Failed to fetch LinkedIn profile:", err);
        }
      }

      let currentProfileUser = null;
      try {
        const { data, error } = await supabase
          .from('profile_users')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (!error && data) {
          currentProfileUser = data;
        } else {
          // If no record exists, automatically create one
          const meta = session.user.user_metadata;
          const { data: newData, error: insertError } = await supabase
            .from('profile_users')
            .upsert({
              user_id: session.user.id,
              full_name: currentProfile?.full_name || meta.full_name || meta.name || '',
            }, { onConflict: 'user_id' })
            .select()
            .single();
            
          if (!insertError && newData) {
            currentProfileUser = newData;
          }
        }
      } catch (err) {
        console.error("Failed to fetch/create profile_users:", err);
      }
      
      // Update application language if specified in profile
      if (currentProfileUser && currentProfileUser.app_language) {
        i18n.changeLanguage(currentProfileUser.app_language);
        localStorage.setItem('i18nextLng', currentProfileUser.app_language);
      }

      set({
        session,
        user: session?.user ?? null,
        linkedinProfile: currentProfile,
        profileUser: currentProfileUser,
        isConnected,
        loading: false,
      });
    };

    // Get current session
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      await fetchAndSyncProfile(session);
    } else {
      set({ session: null, user: null, linkedinProfile: null, profileUser: null, isConnected: false, loading: false });
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        // Only re-sync on actual login events or if we don't have a profile loaded
        if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED' || !get().linkedinProfile) {
          await fetchAndSyncProfile(session);
        } else {
           set({ session, user: session?.user ?? null });
        }
      } else {
        set({
          session: null,
          user: null,
          linkedinProfile: null,
          profileUser: null,
          isConnected: false,
          loading: false,
        });
      }
    });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({
      session: null,
      user: null,
      linkedinProfile: null,
      profileUser: null,
      isConnected: false,
    });
  },

  disconnectLinkedIn: async () => {
    const { user, linkedinProfile } = get();
    if (!user || !linkedinProfile) return;

    try {
      await supabase
        .from('linkedin_profiles')
        .update({ connected: false, updated_at: new Date().toISOString() })
        .eq('id', linkedinProfile.id);
        
      await get().logout();
    } catch (err) {
      console.error("Failed to disconnect LinkedIn:", err);
      throw err;
    }
  },

  updateProfileImage: async (url: string) => {
    const { user, profileUser } = get();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profile_users')
        .upsert({ user_id: user.id, profile_image_url: url }, { onConflict: 'user_id' })
        .select()
        .single();
        
      if (error) throw error;
      if (profileUser || data) {
        set({ profileUser: { ...profileUser, ...data } });
      }
    } catch (err) {
      console.error("Failed to update profile image:", err);
      throw err;
    }
  },

  removeProfileImage: async () => {
    const { user, profileUser } = get();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profile_users')
        .upsert({ user_id: user.id, profile_image_url: null }, { onConflict: 'user_id' })
        .select()
        .single();
        
      if (error) throw error;
      if (profileUser || data) {
        set({ profileUser: { ...profileUser, ...data } });
      }
    } catch (err) {
      console.error("Failed to remove profile image:", err);
      throw err;
    }
  },
  
  updateProfileData: async (data: Partial<ProfileUser>) => {
    const { user, profileUser } = get();
    if (!user) return;
    
    try {
      const { data: updatedData, error } = await supabase
        .from('profile_users')
        .upsert({ user_id: user.id, ...data }, { onConflict: 'user_id' })
        .select()
        .single();
        
      if (error) throw error;
      if (profileUser || updatedData) {
        set({ profileUser: { ...profileUser, ...updatedData } });
      }
    } catch (err) {
      console.error("Failed to update profile data:", err);
      throw err;
    }
  }
}));