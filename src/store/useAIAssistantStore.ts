import { create } from 'zustand';
import { supabase } from '../db/supabase';
import { AIConversation, AIMessage } from '../types';

interface AIAssistantState {
  conversations: AIConversation[];
  activeConversation: AIConversation | null;
  loading: boolean;
  isGenerating: boolean;
  
  initialize: (userId: string) => Promise<void>;
  createConversation: (userId: string, initialMessage?: string) => Promise<AIConversation | null>;
  setActiveConversation: (conversation: AIConversation | null) => void;
  renameConversation: (conversationId: string, newTitle: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  sendMessage: (userId: string, content: string, userContext?: any) => Promise<void>;
  stopGeneration: () => void;
  regenerateLastResponse: (userId: string, userContext?: any) => Promise<void>;
}

let abortController: AbortController | null = null;

export const useAIAssistantStore = create<AIAssistantState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  loading: false,
  isGenerating: false,

  initialize: async (userId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      set({ conversations: data as AIConversation[], loading: false });
    } catch (err) {
      console.error("Failed to fetch AI conversations", err);
      set({ loading: false });
    }
  },

  createConversation: async (userId, initialMessage = 'New Conversation') => {
    try {
      const newConv = {
        user_id: userId,
        title: initialMessage.substring(0, 40) + (initialMessage.length > 40 ? '...' : ''),
        messages: []
      };

      const { data, error } = await supabase
        .from('ai_conversations')
        .insert([newConv])
        .select()
        .single();

      if (error) throw error;
      
      set((state) => ({
        conversations: [data as AIConversation, ...state.conversations],
        activeConversation: data as AIConversation
      }));
      
      return data as AIConversation;
    } catch (err) {
      console.error("Failed to create conversation", err);
      return null;
    }
  },

  setActiveConversation: (conversation) => {
    set({ activeConversation: conversation });
  },

  renameConversation: async (conversationId, newTitle) => {
    try {
      const { error } = await supabase
        .from('ai_conversations')
        .update({ title: newTitle, updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      if (error) throw error;

      set((state) => ({
        conversations: state.conversations.map(c => 
          c.id === conversationId ? { ...c, title: newTitle } : c
        ),
        activeConversation: state.activeConversation?.id === conversationId 
          ? { ...state.activeConversation, title: newTitle } 
          : state.activeConversation
      }));
    } catch (err) {
      console.error("Failed to rename conversation", err);
    }
  },

  deleteConversation: async (conversationId) => {
    try {
      const { error } = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;

      set((state) => ({
        conversations: state.conversations.filter(c => c.id !== conversationId),
        activeConversation: state.activeConversation?.id === conversationId ? null : state.activeConversation
      }));
    } catch (err) {
      console.error("Failed to delete conversation", err);
    }
  },

  stopGeneration: () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
    set({ isGenerating: false });
  },

  sendMessage: async (userId, content, userContext) => {
    const { activeConversation, createConversation } = get();
    
    // Auto-create conversation if none is active
    let currentConv = activeConversation;
    if (!currentConv) {
      currentConv = await createConversation(userId, content);
      if (!currentConv) return;
    }

    console.log("--------------------------------------------------");
    console.log("➡️ [FRONTEND] User message received:", content);

    const newUserMessage: AIMessage = {
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    const newAssistantMessage: AIMessage = {
      role: 'assistant',
      content: '', // Will be streamed
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...currentConv.messages, newUserMessage];
    
    // Optimistic UI update
    const updatedConv = { ...currentConv, messages: [...updatedMessages, newAssistantMessage], updated_at: new Date().toISOString() };
    set((state) => ({
      activeConversation: updatedConv,
      conversations: state.conversations.map(c => c.id === currentConv!.id ? updatedConv : c),
      isGenerating: true
    }));

    abortController = new AbortController();

    try {
      console.log("➡️ [FRONTEND] Request sent to backend for streaming (/api/ai/chat).");
      const response = await fetch('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: updatedMessages,
          userContext,
          aiMode: currentConv.ai_mode || '🌐 Career Advisor'
        }),
        signal: abortController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to generate response`);
      }
      
      if (!response.body) throw new Error('ReadableStream not supported');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let streamedContent = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          
          // Parse SSE chunks (Format: data: {"chunk": "text"}\n\n)
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '');
              if (dataStr === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
                if (parsed.chunk) {
                  streamedContent += parsed.chunk;
                  
                  // Update UI with streaming content
                  const streamMessage: AIMessage = { ...newAssistantMessage, content: streamedContent };
                  const finalConv = { ...currentConv!, messages: [...updatedMessages, streamMessage], updated_at: new Date().toISOString() };
                  
                  set((state) => ({
                    activeConversation: finalConv,
                    conversations: state.conversations.map(c => c.id === currentConv!.id ? finalConv : c)
                  }));
                }
              } catch (e: any) {
                if (e.message && e.message !== "Unexpected end of JSON input") {
                  throw e; // Re-throw actual API errors
                }
                // Ignore incomplete JSON chunks parsing
              }
            }
          }
        }
      }
      
      console.log("✅ [FRONTEND] Streaming complete.");

      // Final save to Supabase
      const finalMessage: AIMessage = { ...newAssistantMessage, content: streamedContent };
      const messagesToSave = [...updatedMessages, finalMessage];
      
      await supabase
        .from('ai_conversations')
        .update({ messages: messagesToSave, updated_at: new Date().toISOString() })
        .eq('id', currentConv.id);

      // Generate smart title if it's the first message
      if (updatedMessages.length === 1) {
        try {
          const titleRes = await fetch('http://localhost:3000/api/ai/generate-title', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: content })
          });
          const titleData = await titleRes.json();
          if (titleData.success && titleData.title) {
            await get().renameConversation(currentConv.id, titleData.title);
          }
        } catch (titleErr) {
          console.error("Failed to generate title", titleErr);
        }
      }

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("❌ [FRONTEND] Error generating AI response:", err);
        
        // Update UI with error message
        const errorMessage: AIMessage = { ...newAssistantMessage, content: `**Error:** ${err.message || 'Something went wrong.'}` };
        const errorConv = { ...currentConv!, messages: [...updatedMessages, errorMessage], updated_at: new Date().toISOString() };
        
        set((state) => ({
          activeConversation: errorConv,
          conversations: state.conversations.map(c => c.id === currentConv!.id ? errorConv : c)
        }));
      }
    } finally {
      abortController = null;
      set({ isGenerating: false });
      console.log("--------------------------------------------------");
    }
  },

  regenerateLastResponse: async (userId, userContext) => {
    const { activeConversation, sendMessage } = get();
    if (!activeConversation || activeConversation.messages.length < 2) return;

    const messages = [...activeConversation.messages];
    // Remove last assistant message
    messages.pop();
    // Get last user message
    const lastUserMessage = messages.pop();

    if (lastUserMessage?.role === 'user') {
      // Update state to remove last 2 messages before re-sending
      const updatedConv = { ...activeConversation, messages };
      
      await supabase
        .from('ai_conversations')
        .update({ messages, updated_at: new Date().toISOString() })
        .eq('id', activeConversation.id);
        
      set((state) => ({
        activeConversation: updatedConv,
        conversations: state.conversations.map(c => c.id === activeConversation.id ? updatedConv : c)
      }));

      await sendMessage(userId, lastUserMessage.content, userContext);
    }
  }
}));
