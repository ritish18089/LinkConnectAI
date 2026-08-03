export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface GeneratedMessage {
  id: string;
  user_id: string;
  profile_url: string;
  connection_type: string;
  purpose: string;
  generated_message: string;
  connection_note?: string;
  recommended_message_index?: number;
  scores?: {
    professionalism: number;
    personalization: number;
    clarity: number;
    replyProbability: number;
    spamRisk: string;
  };
  icebreaker?: string;
  tips?: string[];
  created_at: string;
}

export interface Stats {
  totalMessages: number;
  messagesToday: number;
  creditsRemaining: number;
}

export interface LinkedInProfile {
  id: string;
  user_id: string;
  full_name: string;
  headline: string;
  company: string;
  location: string;
  profile_url: string;
  profile_image: string;
  linkedin_email: string;
  linkedin_id: string;
  connected: boolean;
  connected_at: string;
  updated_at: string;
  followers?: number;
  connections?: number;
  profile_views?: number;
}

export interface SavedTemplate {
  id: string;
  user_id: string;
  template_id: string;
  title: string;
  category: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileUser {
  id: string;
  user_id: string;
  profile_image_url: string | null;
  full_name: string | null;
  headline: string | null;
  company: string | null;
  job_title: string | null;
  industry: string | null;
  location: string | null;
  linkedin_url: string | null;
  bio: string | null;
  website: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  experience_level: string | null;
  app_language?: string | null;
  skills: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface AIConversation {
  id: string;
  user_id: string;
  title: string;
  messages: AIMessage[];
  is_pinned?: boolean;
  is_archived?: boolean;
  ai_mode?: string;
  created_at: string;
  updated_at: string;
}

export interface AIFavorite {
  id: string;
  user_id: string;
  conversation_id: string;
  content: string;
  created_at: string;
}

export interface AIStatistics {
  user_id: string;
  total_conversations: number;
  messages_sent: number;
  templates_generated: number;
  favorite_ai_mode: string;
  updated_at: string;
}